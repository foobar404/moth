import React, { useState, useEffect } from 'react';
import { ICanvas, ILayer, IFrame, IPreview } from './';
import { IoPlay, IoStop, IoCopy } from "react-icons/io5";
import { MdAddPhotoAlternate, MdDelete, MdLayers, MdLayersClear } from "react-icons/md";
import { BsFillCaretLeftFill, BsFillCaretRightFill } from "react-icons/bs";


interface IProps {
    defaultCanvasSize: number;
    canvas?: ICanvas;
    frames: IFrame[];
    setFrames: React.Dispatch<React.SetStateAction<IFrame[]>>;
    activeFrame: IFrame;
    setActiveFrame: (frame: IFrame, frames?: IFrame[]) => void;
    activeLayer: ILayer;
    setActiveLayer: (layer: ILayer, frame?: IFrame, frames?: IFrame[]) => void;
    preview: IPreview;
    setPreview: React.Dispatch<React.SetStateAction<IPreview>>;
}

export function Frames(props: IProps) {
    const data = useLayers(props);

    return (<section className="p-app__frames p-app__block">
        <nav className={"p-app__frames-controls"}>
            <section className="p-app__frame-controls-section">
                <button data-tip="new frame" data-for="tooltip"
                    onClick={data.addNewFrame}
                    className="c-button --xs --fourth mr-2">
                    <MdAddPhotoAlternate />
                </button>
                <button data-tip="duplicate frame"
                    data-for="tooltip"
                    onClick={data.duplicateFrame}
                    className="c-button --xs --fourth mr-2">
                    <IoCopy />
                </button>

                <button data-tip="move frame left"
                    data-for="tooltip"
                    onClick={data.moveFrameLeft}
                    className="c-button --xs --fourth mr-2">
                    <BsFillCaretLeftFill />
                </button>
                <button data-tip="move frame right"
                    data-for="tooltip"
                    onClick={data.moveFrameRight}
                    className="c-button --xs --fourth mr-2">
                    <BsFillCaretRightFill />
                </button>

                <button data-tip="delete frame"
                    data-for="tooltip"
                    onClick={data.deleteFrame}
                    className="c-button --xs --fourth">
                    <MdDelete />
                </button>
            </section>

            <section className="p-app__frame-controls-section flex items-center">
                <label data-tip="FPS" data-for="tooltip">
                    <input type="number"
                        value={props.preview.fps}
                        className="c-input --xs mr-2"
                        onChange={e => data.setFps(Number(e.target.value))} />
                </label>
                <button data-tip={`${data.playing ? "stop" : "play"} animation`}
                    data-for="tooltip"
                    onClick={data.togglePlay}
                    className="c-button --xs --fourth">
                    {data.playing ? <IoStop /> : <IoPlay />}
                </button>
            </section>

            <section className="p-app__frame-controls-section flex items-center">
                <button data-tip={`${data.onionSkin ? "disable" : "enable"} onion skin`}
                    data-for="tooltip"
                    onClick={() => data.setOnionSkin(x => !x)}
                    className="c-button --xs --fourth mr-2">
                    {data.onionSkin ? <MdLayersClear /> : <MdLayers />}
                </button>
                <label data-tip="onion skin opacity" data-for="tooltip">
                    <p hidden>onion skin slider</p>
                    <input type="range" className="c-input --xs --wide"></input>
                </label>
            </section>
        </nav>

        <section className="p-app__frames-container">
            {props.frames.map((frame, i) => (
                <img key={i}
                    className={`p-app__frame ${frame.symbol === props.activeFrame.symbol ? "--active" : ""}`}
                    src={data.imageMap[frame.symbol]}
                    onClick={() => {
                        props.setActiveFrame(frame);
                        props.setActiveLayer(frame.layers[0], frame);
                    }} />
            ))}
        </section>
    </section>)
}

function useLayers(props: IProps) {
    let [playing, setPlaying] = useState(false);
    let [onionSkin, setOnionSkin] = useState(false);
    let [imageMap, setImageMap] = useState<any>({});
    let [loopRef, setLoopRef] = useState<NodeJS.Timer>();

    useEffect(() => {
        let map: { [s: symbol]: string } = {};
        props.frames.forEach(frame => {
            map[frame.symbol] = getImage(frame);
        });

        setImageMap(map);
    }, [props.activeFrame]);

    function getImage(frame?: IFrame) {
        if (!frame) return "";
        if (!props.canvas) return "";

        let mainCanvas = document.createElement("canvas");
        mainCanvas.width = props.canvas.width;
        mainCanvas.height = props.canvas.height;
        let mainCtx = mainCanvas.getContext("2d");

        let tempCanvas = document.createElement("canvas");
        tempCanvas.width = props.canvas.width;
        tempCanvas.height = props.canvas.height;
        let tempCtx = tempCanvas.getContext("2d");

        let reversedLayers = frame.layers.slice(0).reverse();
        reversedLayers.forEach(layer => {
            tempCtx!.putImageData(layer.image, 0, 0);
            mainCtx!.drawImage(tempCanvas, 0, 0, props.canvas!.width, props.canvas!.height);
        });

        return mainCanvas.toDataURL();
    }

    function addNewFrame() {
        let newFrame: IFrame = {
            layers: [{ image: new ImageData(props!.canvas!.width, props!.canvas!.height), opacity: 255, symbol: Symbol(), name: "New Layer" }],
            symbol: Symbol()
        };

        props.setActiveFrame(newFrame);
    }

    function deleteFrame() {
        if (!window.confirm("Are you sure you want to delete this frame?")) return;

        let newFrames = props.frames.filter(frame => frame.symbol !== props.activeFrame.symbol);
        if (newFrames.length === 0) {
            newFrames.push({
                layers: [{ image: new ImageData(props!.canvas!.width, props!.canvas!.height), opacity: 255, symbol: Symbol(), name: "New Layer" }],
                symbol: Symbol()
            })
        }
        props.setActiveLayer(newFrames[0].layers[0], newFrames[0], newFrames);
    }

    function duplicateFrame() {
        let newFrame: IFrame = {
            layers: props.activeFrame.layers.map(layer => {
                return {
                    image: new ImageData(layer.image.data.slice(0), layer.image.width, layer.image.height),
                    opacity: layer.opacity,
                    symbol: Symbol(),
                    name: layer.name
                }
            }),
            symbol: Symbol()
        };

        props.setActiveFrame(newFrame);
        props.setActiveLayer(newFrame.layers[0], newFrame);
    }

    function moveFrameLeft() {
        let index = props.frames.findIndex(frame => frame.symbol === props.activeFrame.symbol);
        if (index === 0) return;

        let newFrames = [...props.frames];
        newFrames[index] = newFrames[index - 1];
        newFrames[index - 1] = props.activeFrame;
        props.setFrames(newFrames);
    }

    function moveFrameRight() {
        let index = props.frames.findIndex(frame => frame.symbol === props.activeFrame.symbol);
        if (index === props.frames.length - 1) return;

        let newFrames = [...props.frames];
        newFrames[index] = newFrames[index + 1];
        newFrames[index + 1] = props.activeFrame;
        props.setFrames(newFrames);
    }

    function play() {
        if (!props.preview.ctx) return;
        if (!props.canvas) return;

        let i = 0;
        let tempCanvas = document.createElement("canvas");
        tempCanvas.width = props.canvas.width;
        tempCanvas.height = props.canvas.height;
        let tempCtx = tempCanvas.getContext("2d");

        let previewElm = document.querySelector(".p-app__preview");
        if (previewElm) previewElm.scrollIntoView({ behavior: "smooth", block: "end" });

        setPlaying(true);
        setLoopRef(setInterval(() => {
            if (i >= props.frames.length) i = 0;

            let frame = props.frames[i];
            props.preview.ctx!.clearRect(0, 0, props?.canvas?.width ?? 0, props?.canvas?.height ?? 0);
            let reversedLayers = frame.layers.slice().reverse();
            reversedLayers.forEach(layer => {
                tempCtx!.putImageData(layer.image, 0, 0);
                props.preview.ctx!.drawImage(tempCanvas, 0, 0);
            })
            i++;
        }, 1000 / props.preview.fps));
    }

    function stop() {
        if (!loopRef) return;

        setPlaying(false);
        clearInterval(loopRef!);
    }

    function togglePlay() {
        if (playing) stop();
        else play();
    }

    function setFps(fps: number) {
        props.setPreview({ ...props.preview, fps });
        stop();
        play();
    }

    return {
        addNewFrame,
        deleteFrame,
        duplicateFrame,
        imageMap,
        onionSkin,
        moveFrameLeft,
        moveFrameRight,
        play,
        playing,
        setFps,
        setOnionSkin,
        setPlaying,
        stop,
        togglePlay
    }
}


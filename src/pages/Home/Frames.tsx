import { Preview } from './Preview';
import { IoPlay, IoStop, IoCopy } from "react-icons/io5";
import React, { useState, useEffect, useReducer } from 'react';
import { ICanvas, ILayer, IFrame, IPreview } from '../../types';
import { initReducerState, reducer, useCanvas } from '../../utils';
import { BsFillCaretLeftFill, BsFillCaretRightFill } from "react-icons/bs";
import { MdAddPhotoAlternate, MdDelete, MdLayers, MdLayersClear } from "react-icons/md";


interface IProps {
    frames: IFrame[];
    activeFrame: IFrame;
    activeLayer: ILayer;
    setFrames: React.Dispatch<React.SetStateAction<IFrame[]>>;
    setActiveFrame: (frame: IFrame, frames?: IFrame[]) => void;
    setActiveLayer: (layer: ILayer, frame?: IFrame, frames?: IFrame[]) => void;
}


export function Frames(props: IProps) {
    const data = useLayers(props);

    return (<section className="p-app__frames p-app__block">
        <section>
            <nav className={"p-app__frames-controls"}>
                <section className="p-app__frame-controls-section">
                    <button data-tip="new frame" data-for="tooltip"
                        onClick={data.addFrame}
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
                    {/* <label data-tip="FPS" data-for="tooltip">
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
                    </button> */}
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
        </section>

        <Preview frames={props.frames}
            preview={data.preview} />
    </section>)
}

function useLayers(props: IProps) {
    const canvas1 = useCanvas();
    const canvas2 = useCanvas();
    let [playing, setPlaying] = useState(false);
    let [onionSkin, setOnionSkin] = useState(false);
    let [imageMap, setImageMap] = useState<any>({});
    let [global, setGlobal] = useReducer(reducer, initReducerState);
    let [preview, setPreview] = useState<IPreview>({  fps: 24 });

    useEffect(() => {
        let map: { [s: symbol]: string } = {};
        props.frames.forEach(frame => {
            map[frame.symbol] = getImage(frame);
        });

        setImageMap(map);
    }, [props.activeFrame]);

    function getImage(frame?: IFrame) {
        if (!frame) return "";

        canvas1.resize(global["Canvas.mainCanvas"].width, global["Canvas.mainCanvas"].height);
        canvas2.resize(global["Canvas.mainCanvas"].width, global["Canvas.mainCanvas"].height);

        let reversedLayers = frame.layers.slice(0).reverse();
        reversedLayers.forEach(layer => {
            canvas1.putImageData(layer.image);
            canvas2!.drawImage(canvas1.canvas);
        });

        return canvas2.toDataURL();
    }

    function addFrame() {
        let newFrame: IFrame = {
            layers: [{ image: new ImageData(global["Canvas.mainCanvas"].width, global["Canvas.mainCanvas"].height), opacity: 255, symbol: Symbol(), name: "New Layer" }],
            symbol: Symbol()
        };

        props.setActiveFrame(newFrame);
    }

    function deleteFrame() {
        if (!window.confirm("Are you sure you want to delete this frame?")) return;

        let newFrames = props.frames.filter(frame => frame.symbol !== props.activeFrame.symbol);
        if (newFrames.length === 0) {
            newFrames.push({
                layers: [{ image: new ImageData(global["Canvas.mainCanvas"].width, global["Canvas.mainCanvas"].height), opacity: 255, symbol: Symbol(), name: "New Layer" }],
                symbol: Symbol()
            })
        }
        props.setActiveLayer(newFrames[0].layers[0], newFrames[0], newFrames);
    }

    function duplicateFrame() {
        let newFrame: IFrame = {
            layers: props.activeFrame.layers.map(layer => {
                return {
                    symbol: Symbol(),
                    name: layer.name,
                    opacity: layer.opacity,
                    image: new ImageData(layer.image.data.slice(0), layer.image.width, layer.image.height),
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

    return {
        preview,
        playing,
        imageMap,
        onionSkin,
        setPlaying,
        addFrame,
        deleteFrame,
        setOnionSkin,
        moveFrameLeft,
        moveFrameRight,
        duplicateFrame,
    }
}


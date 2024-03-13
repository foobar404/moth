import { Preview } from './Preview';
import { IFrame, IPreview } from '../../types';
import React, { useState, useEffect } from 'react';
import { useCanvas, useGlobalStore } from '../../utils';
import { IoCopy, IoPlay, IoStop } from "react-icons/io5";
import { BsFillCaretLeftFill, BsFillCaretRightFill } from "react-icons/bs";
import { MdAddPhotoAlternate, MdDelete, MdLayers, MdLayersClear } from "react-icons/md";


export function Frames() {
    const data = useFrames();

    return (<section className="!justify-between row p-app__block">
        <section className="flex-1">
            <nav className={"row !justify-between"}>
                <section className="space-x-2 p-app__frame-controls-section">
                    <button data-tip="new frame" data-for="tooltip"
                        onClick={data.addFrame}
                        className="btn btn-xs">
                        <MdAddPhotoAlternate className="text-lg"/>
                    </button>
                    <button data-tip="duplicate frame"
                        data-for="tooltip"
                        onClick={data.duplicateFrame}
                        className="btn btn-xs">
                        <IoCopy className="text-lg"/>
                    </button>

                    <button data-tip="move frame left"
                        data-for="tooltip"
                        onClick={data.moveFrameLeft}
                        className="btn btn-xs">
                        <BsFillCaretLeftFill className="text-lg"/>
                    </button>
                    <button data-tip="move frame right"
                        data-for="tooltip"
                        onClick={data.moveFrameRight}
                        className="btn btn-xs">
                        <BsFillCaretRightFill className="text-lg"/>
                    </button>

                    <button data-tip="delete frame"
                        data-for="tooltip"
                        onClick={data.deleteFrame}
                        className="btn btn-xs">
                        <MdDelete className="text-lg"/>
                    </button>
                </section>

                <section className="flex items-center p-app__frame-controls-section">
                    <label data-tip="FPS" data-for="tooltip">
                        <input type="number"
                            value={data.preview.fps}
                            className="w-16 mr-2 input input-xs"
                            onChange={e => data.setFps(Number(e.target.value))} />
                    </label>
                    <button data-tip={`${data.preview.playing ? "stop" : "play"} animation`}
                        data-for="tooltip"
                        onClick={data.togglePlay}
                        className="btn btn-xs">
                        {data.preview.playing ? <IoStop className="text-lg"/> : <IoPlay className="text-lg"/>}
                    </button>
                </section>

                <section className="row !flex-nowrap p-app__frame-controls-section">
                    <button data-tip={`${data.onionSkin ? "disable" : "enable"} onion skin`}
                        data-for="tooltip"
                        className="mr-2 btn btn-xs"
                        onClick={() => data.setOnionSkin(data.onionSkin == 255 ? 0 : 255)}>
                        {data.onionSkin ? <MdLayers className="text-lg"/> : <MdLayersClear className="text-lg"/>}
                    </button>
                    <input data-tip="onion skin opacity"
                        data-for="tooltip"
                        type="range"
                        min="0"
                        max="255"
                        value={data.onionSkin}
                        className="range range-xs"
                        onChange={e => data.setOnionSkin(e.target.valueAsNumber)}
                    ></input>
                </section>
            </nav>

            <section className="p-app__frames-container">
                {data.frames.map((frame, i) => (
                    <img key={i}
                        draggable
                        onDragStart={(e) => data.handleDragStart(e, frame)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => data.handleDrop(e, frame)}
                        onDragEnd={data.handleDragEnd}
                        className={`p-app__frame ${frame.symbol === data.activeFrame.symbol ? "border-2 border-black" : ""}`}
                        src={data.imageMap[frame.symbol]}
                        onClick={() => {
                            data.setActiveFrame(frame);
                            data.setActiveLayer(frame.layers[0]);
                        }} />
                ))}
            </section>
        </section>

        <Preview {...data.preview} />
    </section>)
}

function useFrames() {
    const canvas1 = useCanvas();
    const canvas2 = useCanvas();
    const {
        frames, setFrames, activeFrame, setActiveFrame,
        setActiveLayer, canvasSize, onionSkin, setOnionSkin,
    } = useGlobalStore();

    let [imageMap, setImageMap] = useState<any>({});
    let [draggedFrame, setDraggedFrame] = useState<IFrame | null>(null);
    let [preview, setPreview] = useState<IPreview>({ fps: 24, playing: false });

    useEffect(() => {
        let map: { [s: symbol]: string } = {};
        frames.forEach(frame => {
            map[frame.symbol] = getImage(frame);
        });

        setImageMap(map);
    }, [activeFrame]);

    const handleDragStart = (e, frame) => {
        setDraggedFrame(frame);
        // Optional: Add any drag start effects here
    };

    const handleDrop = (e, targetFrame) => {
        e.preventDefault();
        if (!draggedFrame || draggedFrame === targetFrame) return;

        const draggedIndex = frames.findIndex(f => f.symbol === draggedFrame!.symbol);
        const targetIndex = frames.findIndex(f => f.symbol === targetFrame.symbol);

        let newFrames = [...frames];
        // Remove the dragged frame and insert it at the position of the target frame
        newFrames.splice(draggedIndex, 1); // Remove dragged frame
        newFrames.splice(targetIndex, 0, draggedFrame); // Insert at new position

        setFrames(newFrames);
    };

    const handleDragEnd = () => {
        setDraggedFrame(null); // Reset the state
    };

    function getImage(frame?: IFrame) {
        if (!frame) return "";

        canvas1.resize(canvasSize.width, canvasSize.height);
        canvas2.resize(canvasSize.width, canvasSize.height);

        let reversedLayers = frame.layers.slice(0).reverse();
        reversedLayers.forEach(layer => {
            canvas1.putImageData(layer.image);
            canvas2!.drawImage(canvas1.getElement());
        });

        return canvas2.toDataURL();
    }

    function addFrame() {
        let newFrame: IFrame = {
            layers: [{ image: new ImageData(canvasSize.width, canvasSize.height), opacity: 255, symbol: Symbol(), name: "New Layer" }],
            symbol: Symbol()
        };

        setActiveFrame(newFrame);
    }

    function deleteFrame() {
        if (!window.confirm("Are you sure you want to delete this frame?")) return;

        let newFrames = frames.filter(frame => frame.symbol !== activeFrame.symbol);
        if (newFrames.length === 0) {
            newFrames.push({
                layers: [{ image: new ImageData(canvasSize.width, canvasSize.height), opacity: 255, symbol: Symbol(), name: "New Layer" }],
                symbol: Symbol(),
            });
        }
        setFrames(newFrames);
        setActiveFrame(newFrames[0]);
    }

    function duplicateFrame() {
        let newFrame: IFrame = {
            layers: activeFrame.layers.map(layer => {
                return {
                    symbol: Symbol(),
                    name: layer.name,
                    opacity: layer.opacity,
                    image: new ImageData(layer.image.data.slice(0), layer.image.width, layer.image.height),
                }
            }),
            symbol: Symbol()
        };

        setActiveFrame(newFrame);
        setActiveLayer(newFrame.layers[0]);
    }

    function moveFrameLeft() {
        let index = frames.findIndex(frame => frame.symbol === activeFrame.symbol);
        if (index === 0) return;

        let newFrames = [...frames];
        newFrames[index] = newFrames[index - 1];
        newFrames[index - 1] = activeFrame;
        setFrames(newFrames);
    }

    function moveFrameRight() {
        let index = frames.findIndex(frame => frame.symbol === activeFrame.symbol);
        if (index === frames.length - 1) return;

        let newFrames = [...frames];
        newFrames[index] = newFrames[index + 1];
        newFrames[index + 1] = activeFrame;
        setFrames(newFrames);
    }

    function togglePlay() {
        setPreview({ ...preview, playing: !preview.playing });
    }

    function setFps(fps: number) {
        setPreview({ ...preview, fps });
    }

    return {
        frames,
        preview,
        imageMap,
        onionSkin,
        activeFrame,
        setFps,
        addFrame,
        togglePlay,
        deleteFrame,
        setOnionSkin,
        moveFrameLeft,
        moveFrameRight,
        handleDrop,
        handleDragStart,
        handleDragEnd,
        duplicateFrame,
        setActiveFrame,
        setActiveLayer,
    }
}


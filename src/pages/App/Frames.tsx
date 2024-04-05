import { Preview } from './Preview';
import { IFrame, IPreview } from '../../types';
import React, { useState, useEffect, useRef } from 'react';
import { useCanvas, useGlobalStore, useShortcuts } from '../../utils';
import { BsFillCaretLeftFill, BsFillCaretRightFill } from "react-icons/bs";
import { IoCopy, IoPlay, IoStop, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { MdAddPhotoAlternate, MdDelete, MdLayers, MdLayersClear } from "react-icons/md";


export function Frames() {
    const data = useFrames();

    return (<section className="!justify-between row-top p-app__block overflow-hidden">
        <section className="flex-1 w-1/2">
            <nav className={"row !justify-between"}>
                <section className="space-x-2 p-app__frame-controls-section bg-accent">
                    <button aria-label="add new frame" 
                        data-tip="new frame" data-for="tooltip"
                        onClick={data.addFrame}
                        className="btn btn-xs">
                        <MdAddPhotoAlternate className="text-lg" />
                    </button>
                    <button aria-label="duplicate current frame" 
                        data-tip="duplicate frame"
                        data-for="tooltip"
                        onClick={data.duplicateFrame}
                        className="btn btn-xs">
                        <IoCopy className="text-lg" />
                    </button>

                    <button aria-label="move current frame left" 
                        data-tip="move frame left"
                        data-for="tooltip"
                        onClick={data.moveFrameLeft}
                        className="btn btn-xs">
                        <BsFillCaretLeftFill className="text-lg" />
                    </button>
                    <button aria-label="move current frame right" 
                        data-tip="move frame right"
                        data-for="tooltip"
                        onClick={data.moveFrameRight}
                        className="btn btn-xs">
                        <BsFillCaretRightFill className="text-lg" />
                    </button>

                    <button aria-label="delete current frame"
                        data-tip="delete frame"
                        data-for="tooltip"
                        onClick={data.deleteFrame}
                        className="btn btn-xs">
                        <MdDelete className="text-lg" />
                    </button>
                </section>

                <section className="flex items-center space-x-2 p-app__frame-controls-section bg-accent">
                    <button aria-label="move animation frame left" 
                        data-tip={"animation frame left"}
                        data-for="tooltip"
                        onClick={data.previewFrameLeft}
                        className="btn btn-xs">
                        {<IoChevronBack className="text-lg" />}
                    </button>

                    <button aria-label="toggle animation play/pause" 
                        data-tip={`${data.preview.playing ? "stop" : "play"} animation`}
                        data-for="tooltip"
                        onClick={data.togglePlay}
                        className="btn btn-xs">
                        {data.preview.playing ? <IoStop className="text-lg" /> : <IoPlay className="text-lg" />}
                    </button>

                    <button aria-label="move animation frame right" 
                        data-tip={"animation frame right"}
                        data-for="tooltip"
                        onClick={data.previewFrameRight}
                        className="btn btn-xs">
                        {<IoChevronForward className="text-lg" />}
                    </button>

                    <input aria-label="current fps slider" 
                        data-tip="fps slider"
                        data-for="tooltip"
                        type="range"
                        min="1"
                        max="24"
                        step="1"
                        value={data.preview.fps}
                        className="range range-xs range-secondary max-w-[60px]"
                        onChange={e => data.setFps(Number(e.target.value))} />

                    <input aria-label="current fps input" 
                        data-tip="fps"
                        data-for="tooltip"
                        type="number"
                        min="1"
                        value={data.preview.fps}
                        className="w-16 mr-2 input input-xs max-w-[50px]"
                        onKeyUp={e => e.stopPropagation()}
                        onChange={e => data.setFps(Number(e.target.value))} />
                </section>

                <section className="row !flex-nowrap p-app__frame-controls-section bg-accent">
                    <button aria-label="toggle onion skin effect" 
                        data-tip={`${data.onionSkin ? "disable" : "enable"} onion skin`}
                        data-for="tooltip"
                        className="mr-2 btn btn-xs"
                        onClick={() => data.setOnionSkin(data.onionSkin == 255 ? 0 : 255)}>
                        {data.onionSkin ? <MdLayers className="text-lg" /> : <MdLayersClear className="text-lg" />}
                    </button>

                    <input aria-label="onion skin opacity slider" 
                        data-tip="onion skin opacity"
                        data-for="tooltip"
                        type="range"
                        min="0"
                        max="255"
                        value={data.onionSkin}
                        className="range range-xs range-secondary"
                        onChange={e => data.setOnionSkin(e.target.valueAsNumber)} />
                </section>
            </nav>

            <section className={`overflow-auto p-1 row-left max-h-[400px] ${data.enlargePreview ? "!row flex-wrap" : ""}`}>
                {data.frames.map((frame, i) => (
                    <img key={i}
                        alt={`frame #${i + 1}`}
                        draggable
                        onDragStart={(e) => data.handleDragStart(e, frame)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => data.handleDrop(e, frame)}
                        onDragEnd={data.handleDragEnd}
                        className={`h-[60px] min-w-[60px] max-w-[106px] flex-shrink-0 p-app__grid m-1 hover:scale-105 shadow-md rounded-md cursor-pointer box-content border-4 border-base-100 ${frame.symbol === data.activeFrame.symbol ? "!border-base-content" : ""}`}
                        src={data.imageMap[frame.symbol]}
                        onClick={() => {
                            data.setActiveFrame(frame);
                            data.setActiveLayer(frame.layers[0]);
                        }} />
                ))}
            </section>
        </section>

        <div data-tip="enlarge animatin ( space )"
            data-for="tooltip"
            onClick={() => data.setEnlargePreview(!data.enlargePreview)}
            className={`ml-2 cursor-pointer hover:scale-95`}>
            <Preview {...data.preview} className={`${data.enlargePreview ? "h-[300px] min-w-[300px] max-w-[534px]" : "h-[120px] min-w-[120px] max-w-[213px]"}`} />
        </div>
    </section>)
}

function useFrames() {
    const canvas1 = useCanvas();
    const canvas2 = useCanvas();
    const frameCount = useRef(0);
    const {
        frames, setFrames, activeFrame, setActiveFrame,
        setActiveLayer, canvasSize, onionSkin, setOnionSkin,
    } = useGlobalStore();

    let [imageMap, setImageMap] = useState<any>({});
    let [enlargePreview, setEnlargePreview] = useState(false);
    let [draggedFrame, setDraggedFrame] = useState<IFrame | null>(null);
    let [preview, setPreview] = useState<IPreview>({ fps: 24, playing: false, frameCount });

    useShortcuts({
        "arrowright": previewFrameRight,
        "arrowleft": previewFrameLeft,
        " ": toggleAnimationMode
    });

    useEffect(() => {
        let map: { [s: symbol]: string } = {};
        frames.forEach(frame => {
            map[frame.symbol] = getImage(frame);
        });

        setImageMap(map);
    }, [activeFrame]);

    const handleDragStart = (e, frame) => {
        setDraggedFrame(frame);
    };

    const handleDrop = (e, targetFrame) => {
        e.preventDefault();
        if (!draggedFrame || draggedFrame === targetFrame) return;

        const draggedIndex = frames.findIndex(f => f.symbol === draggedFrame!.symbol);
        const targetIndex = frames.findIndex(f => f.symbol === targetFrame.symbol);

        let newFrames = [...frames];
        newFrames.splice(draggedIndex, 1); // Remove dragged frame
        newFrames.splice(targetIndex, 0, draggedFrame); // Insert at new position

        setFrames(newFrames);
    };

    const handleDragEnd = () => {
        setDraggedFrame(null);
    };

    function getImage(frame?: IFrame) {
        if (!frame) return "";

        canvas1.resize(canvasSize.width, canvasSize.height);
        canvas2.resize(canvasSize.width, canvasSize.height);

        let reversedLayers = frame.layers.slice(0).reverse();
        reversedLayers.forEach(layer => {
            canvas1.putImageData(layer.image);
            canvas2.drawImage(canvas1.getElement());
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
        let newFrames = frames.filter(frame => frame.symbol !== activeFrame.symbol);
        if (newFrames.length === 0) {
            newFrames.push({
                layers: [{ image: new ImageData(canvasSize.width, canvasSize.height), opacity: 255, symbol: Symbol(), name: "New Layer" }],
                symbol: Symbol(),
            });
        }
        setFrames(newFrames);
        setActiveFrame(newFrames[0]);
        setActiveLayer(newFrames[0].layers[0]);
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

    function previewFrameLeft() {
        setPreview({ ...preview, playing: false });
        let activeFrameIndex = frames.findIndex(frame => frame.symbol === activeFrame.symbol);

        let frame = frames[activeFrameIndex - 1];
        frameCount.current = activeFrameIndex - 1

        if ((activeFrameIndex - 1) < 0) {
            frame = frames[frames.length - 1];
            frameCount.current = frames.length - 1;
        }
        setActiveFrame(frame);
        setActiveLayer(frame.layers[0]);
    }

    function previewFrameRight() {
        setPreview({ ...preview, playing: false });
        let activeFrameIndex = frames.findIndex(frame => frame.symbol === activeFrame.symbol);

        let frame = frames[activeFrameIndex + 1];
        frameCount.current = activeFrameIndex + 1

        if ((activeFrameIndex + 1) >= frames.length) {
            frame = frames[0];
            frameCount.current = 0;
        }
        setActiveFrame(frame);
        setActiveLayer(frame.layers[0]);
    }

    function setFps(fps: number) {
        setPreview({ ...preview, fps });
    }

    function toggleAnimationMode() {
        if (enlargePreview === false) {
            setEnlargePreview(true);
            setPreview({ ...preview, playing: true });
        } else {
            setEnlargePreview(false);
            setPreview({ ...preview, playing: false })
        }
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
        previewFrameLeft,
        previewFrameRight,
        handleDrop,
        handleDragStart,
        handleDragEnd,
        duplicateFrame,
        setActiveFrame,
        setActiveLayer,
        enlargePreview,
        setEnlargePreview,
    }
}


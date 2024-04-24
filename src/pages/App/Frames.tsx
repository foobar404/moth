import { Preview } from './Preview';
import { TiArrowMove } from "react-icons/ti";
import { IFrame, IPreview } from '../../types';
import { HiOutlineArrowsExpand } from 'react-icons/hi';
import React, { useState, useEffect, useRef } from 'react';
import { RiEye2Line, RiEyeCloseFill } from 'react-icons/ri';
import { MdAddPhotoAlternate, MdDelete } from "react-icons/md";
import { useCanvas, useGlobalStore, useSetInterval, useShortcuts } from '../../utils';
import { IoCopy, IoPlay, IoStop, IoChevronBack, IoChevronForward } from "react-icons/io5";
import ReactTooltip from 'react-tooltip';


export function Frames() {
    const data = useFrames();

    return (<section className={`!justify-between p-app__block overflow-hidden ${data.enlargePreview ? "row-top" : "row"}`}>
        <section className="flex-1 w-1/2 space-x-2 row-left">
            <section className="rounded-lg shadow-lg h-[135px] col bg-accent p-4 py-3 relative">
                <input aria-label="onion skin opacity slider"
                    data-tip="onion skin opacity"
                    data-for="tooltip"
                    type="range"
                    min="0"
                    max="255"
                    value={data.onionSkin}
                    className="range range-xs range-secondary w-[120px] -rotate-90 mt-12 absolute"
                    onChange={e => data.setOnionSkin(e.target.valueAsNumber)} />
            </section>

            <section className={`overflow-auto p-1 row-left max-h-[300px] ${data.enlargePreview ? "!row flex-wrap" : ""}`}>
                {data.frames.map((frame, i) => (
                    <div key={i} draggable
                        onDragStart={(e) => data.handleDragStart(e, frame)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => data.handleDrop(e, frame)}
                        onDragEnd={data.handleDragEnd}
                        onClick={() => data.setFrame(frame)}
                        className={`relative group hover:scale-105 ${frame.visible ? "" : "opacity-50"}`}>

                        <img aria-label={`frame #${i + 1}`}
                            className={`h-[70px] min-w-[70px] max-w-[106px] m-1 flex-shrink-0 p-app__grid  shadow-md rounded-md cursor-pointer box-content border-4 border-base-100 ${frame.symbol === data.activeFrame.symbol ? "!border-base-content" : ""}`}
                            src={data.imageMap[frame.symbol] ?? data.emptyImg} />

                        <div className="absolute top-left !hidden group-hover:!flex row w-full h-full bg-base-100/40 rounded-md cursor-grab">
                            <TiArrowMove className="text-3xl text-base-content" />
                        </div>

                        <button aria-label="toggle frame visibility"
                            data-tip="animation visibility"
                            data-for="tooltip"
                            onClick={(e) => {
                                e.stopPropagation();
                                data.toggleVisibility(frame)
                            }}
                            className={`absolute !hidden row w-6 h-6 m-1 rounded-md top-right bg-base-100 hover:bg-base-200 group-hover:!flex`}>
                            {frame.visible ? <RiEye2Line className="text-lg" /> : <RiEyeCloseFill className="text-lg" />}
                        </button>

                        <button aria-label="delete current frame"
                            data-tip="delete frame"
                            data-for="tooltip"
                            onClick={(e) => {
                                e.stopPropagation();
                                data.deleteFrame(frame);
                            }}
                            className="absolute !hidden row w-6 h-6 m-1 rounded-md bottom-right bg-base-100 hover:bg-base-200 group-hover:!flex">
                            <MdDelete className="text-lg" />
                        </button>

                        <button aria-label="duplicate current frame"
                            data-tip="duplicate frame"
                            data-for="tooltip"
                            onClick={(e) => {
                                e.stopPropagation();
                                data.duplicateFrame(frame)
                            }}
                            className="absolute !hidden row w-6 h-6 m-1 rounded-md bottom-left bg-base-100 hover:bg-base-200 group-hover:!flex">
                            <IoCopy className="text-lg" />
                        </button>
                    </div>
                ))}

                <div data-tip="new frame"
                    data-for="tooltip"
                    onClick={data.addFrame}
                    className="min-w-[70px] min-h-[70px] m-1 bg-gray-200 border-4 border-gray-400 border-dashed rounded-md cursor-pointer box-content row hover:scale-105 shadow-md">
                    <MdAddPhotoAlternate aria-label="add new frame" className="text-3xl text-gray-400" />
                </div>
            </section>
        </section>

        <div onClick={() => data.setEnlargePreview(!data.enlargePreview)}
            className={`relative group ml-2 cursor-pointer hover:animate-tilt`}>
            <Preview {...data.preview} className={`${data.enlargePreview ? "h-[300px] min-w-[300px] max-w-[534px]" : "h-[120px] min-w-[120px] max-w-[213px]"}`} />

            <div className="absolute top-left !hidden group-hover:!flex row w-full h-full bg-base-100/40 rounded-md cursor-pointer">
                <HiOutlineArrowsExpand className="text-3xl text-base-content" />
            </div>

            <button aria-label="move animation frame left"
                data-tip={"animation frame left"}
                data-for="tooltip"
                onClick={e => {
                    e.stopPropagation();
                    data.previewFrameLeft();
                }}
                className="hover:bg-base-200 absolute w-7 h-7 rounded-md top-left bg-base-100 text-accent-content row !hidden group-hover:!flex">
                {<IoChevronBack className="text-lg" />}
            </button>

            <button aria-label="toggle animation play/pause"
                data-tip={`${data.preview.playing ? "stop" : "play"} animation`}
                data-for="tooltip"
                onClick={e => {
                    e.stopPropagation();
                    data.togglePlay();
                }}
                className="hover:bg-base-200 absolute w-7 h-7 rounded-md top bg-base-100 text-accent-content row !hidden group-hover:!flex">
                {data.preview.playing ? <IoStop className="text-lg" /> : <IoPlay className="text-lg" />}
            </button>

            <button aria-label="move animation frame right"
                data-tip={"animation frame right"}
                data-for="tooltip"
                onClick={e => {
                    e.stopPropagation();
                    data.previewFrameRight();
                }}
                className="hover:bg-base-200 absolute w-7 h-7 rounded-md top-right bg-base-100 text-accent-content row !hidden group-hover:!flex">
                {<IoChevronForward className="text-lg" />}
            </button>

            <input aria-label="current fps slider"
                data-tip
                data-for="fpsTooltip"
                type="range"
                min="1"
                max="30"
                step="1"
                value={data.preview.fps}
                onClick={e => e.stopPropagation()}
                className="range range-xs range-secondary w-full absolute rounded-md bottom-left bg-base-100 text-accent-content row !hidden group-hover:!flex"
                onChange={e => data.setFps(Number(e.target.value))} />
            <ReactTooltip id='fpsTooltip' effect="solid" className="tooltip" getContent={() => `fps slider (${data.preview.fps})`} />
        </div>
    </section>)
}

function useFrames() {
    const {
        frames, setFrames, activeFrame, setActiveFrame,
        setActiveLayer, canvasSize, onionSkin, setOnionSkin,
        activeLayer,
    } = useGlobalStore();
    const canvas1 = useCanvas();
    const canvas2 = useCanvas();
    const frameCount = useRef(0);
    const emptyImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wIAAgEBAJpvAX4AAAAASUVORK5CYII=";

    let [imageMap, setImageMap] = useState<any>({});
    let [enlargePreview, setEnlargePreview] = useState(false);
    let [draggedFrame, setDraggedFrame] = useState<IFrame | null>(null);
    let [preview, setPreview] = useState<IPreview>({ fps: 24, playing: false, frameCount });

    useShortcuts({
        "arrowright": previewFrameRight,
        "arrowleft": previewFrameLeft,
        " ": toggleAnimationMode
    });

    // update preview when frames change
    useEffect(() => {
        let map: { [s: symbol]: string } = {};
        frames.forEach(frame => {
            map[frame.symbol] = getImage(frame);
        });

        setImageMap(map);
    }, [frames]);

    // update preview every x seconds
    useSetInterval(() => {
        let map: { [s: symbol]: string } = {};
        frames.forEach(frame => {
            map[frame.symbol] = getImage(frame);
        });

        setImageMap(map);
    }, 1000, [frames]);

    useEffect(() => {
        let activeFrameIndex = frames.findIndex(frame => frame.symbol === activeFrame.symbol);
        frameCount.current = activeFrameIndex;
    }, [activeFrame, preview.playing]);

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
            visible: true,
            symbol: Symbol()
        };

        setActiveFrame(newFrame);
    }

    function deleteFrame(frame) {
        let frameIndex = frames.findIndex(f => f.symbol === frame.symbol);
        let newFrameIndex = frames.length - 2 >= frameIndex ? frameIndex : Math.max(frameIndex - 1, 0);
        let newFrames = frames.filter(f => f.symbol !== frame.symbol);

        if (newFrames.length === 0) {
            newFrames.push({
                layers: [{ image: new ImageData(canvasSize.width, canvasSize.height), opacity: 255, symbol: Symbol(), name: "New Layer" }],
                visible: true,
                symbol: Symbol(),
            });
        }

        setFrames(newFrames);

        if (frame.symbol === activeFrame.symbol) {
            setActiveFrame(newFrames[newFrameIndex]);
            setActiveLayer(newFrames[newFrameIndex].layers[0]);
        }
    }

    function duplicateFrame(frame) {
        let frameIndex = frames.findIndex(f => f.symbol === frame.symbol);
        let newFrame: IFrame = {
            layers: frame.layers.map(layer => {
                return {
                    symbol: Symbol(),
                    name: layer.name,
                    opacity: layer.opacity,
                    image: new ImageData(layer.image.data.slice(0), layer.image.width, layer.image.height),
                }
            }),
            visible: true,
            symbol: Symbol()
        };

        let newFrames = [...frames];
        newFrames.splice(frameIndex + 1, 0, newFrame);
        setFrames(newFrames);
    }

    function setFrame(frame) {
        let layerIndex = activeFrame.layers.findIndex(layer => layer.symbol === activeLayer.symbol);
        let newLayerIndex = (frame.layers.length - 1) >= layerIndex ? layerIndex : frame.layers.length - 1;

        setActiveFrame(frame);
        setActiveLayer(frame.layers[newLayerIndex]);
    }

    function toggleVisibility(frame) {
        let newFrames = [...frames];
        let index = newFrames.findIndex(f => f.symbol === frame.symbol);
        newFrames[index].visible = !newFrames[index].visible;
        setFrames(newFrames);
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
        emptyImg,
        setFps,
        setFrame,
        addFrame,
        togglePlay,
        deleteFrame,
        setOnionSkin,
        moveFrameLeft,
        moveFrameRight,
        toggleVisibility,
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


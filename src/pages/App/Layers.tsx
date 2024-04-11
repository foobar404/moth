import { ILayer } from "../../types";
import { MdDelete } from "react-icons/md";
import ReactTooltip from "react-tooltip";
import { RiGitMergeFill } from "react-icons/ri";
import { IoEye, IoCopy } from "react-icons/io5";
import { useCanvas, useGlobalStore, useSetInterval, useShortcuts } from "../../utils";
import { HiEyeOff, HiDocumentAdd } from "react-icons/hi";
import React, { useEffect, useRef, useState } from 'react';
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";


export function Layers() {
    const data = useLayers();

    return (
        <section className="mt-2">
            <nav className="mb-2 p-app__layer-controls !bg-accent">
                <button aria-label="add new layer"
                    data-tip="add new layer"
                    data-for="tooltip"
                    onClick={data.addNewLayer}
                    className="btn btn-xs">
                    <HiDocumentAdd className="text-lg" />
                </button>
                <button aria-label="delete current layer"
                    data-tip="delete current layer"
                    data-for="tooltip"
                    onClick={data.deleteLayer}
                    className="btn btn-xs">
                    <MdDelete className="text-lg" />
                </button>
                <button aria-label="move current layer up"
                    data-tip="move layer up"
                    data-for="tooltip"
                    onClick={data.moveLayerUp}
                    className="btn btn-xs">
                    <BsFillCaretUpFill className="text-lg" />
                </button>
                <button aria-label="move current layer down"
                    data-tip="move layer down"
                    data-for="tooltip"
                    onClick={data.moveLayerDown}
                    className="btn btn-xs">
                    <BsFillCaretDownFill className="text-lg" />
                </button>
                <button aria-label="merge current layer with layer below"
                    data-tip="merge layer with layer below"
                    data-for="tooltip"
                    onClick={data.mergeLayer}
                    className="btn btn-xs">
                    <RiGitMergeFill className="text-lg" />
                </button>
                <button aria-label="duplicate current layer"
                    data-tip="duplicate layer"
                    data-for="tooltip"
                    onClick={data.duplicateLayer}
                    className="btn btn-xs">
                    <IoCopy className="text-lg" />
                </button>
                <div className="content-center w-full space-x-2 row">
                    <button aria-label="toggle all layers visibility"
                        data-tip={`${data.layersAreVisible ? "hide non-active layers" : "show all layers"}`}
                        data-for="tooltip"
                        onClick={data.toggleAllLayerVisibility}
                        className="btn btn-xs">
                        {data.layersAreVisible ? <IoEye className="text-lg" /> : <HiEyeOff className="text-lg" />}
                    </button>
                    <label data-tip="change non-active layers opacity"
                        data-for="tooltip"
                        className="w-full mt-1">
                        <p hidden>layers opacity lever</p>
                        <input aria-label="non-active layers opacity slider"
                            min="1"
                            step="1"
                            max="255"
                            type="range"
                            className="w-full range range-xs range-secondary"
                            value={data.allLayersOpacity}
                            onChange={e => data.setAllLayersOpacity(e.currentTarget.valueAsNumber)} />
                    </label>
                </div>
            </nav>

            <section className="space-y-2">
                {data.activeFrame.layers.map((layer: ILayer, i) => (
                    <div className="space-x-2 row" key={i}>
                        <button aria-label={`toggle visibility of layer ${layer.name}`}
                            onClick={() => data.toggleLayerVisibility(layer)}
                            className="self-stretch h-auto ml-1 btn btn-xs btn-accent">
                            {layer.opacity === 255 ? <IoEye className="text-lg" /> : <HiEyeOff className="text-lg" />}
                        </button>
                        <div className={`overflow-hidden row-left flex-1 rounded-md border-4 border-transparent hover:border-black/25 ${layer.symbol === data.activeLayer.symbol ? "!border-4 !border-black" : ""}`}>
                            <img src={data.imageMap[layer.symbol] ?? data.emptyImg}
                                aria-label={`layer #${i + 1}`}
                                draggable
                                onDragEnd={data.handleDragEnd}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => data.handleDrop(e, layer)}
                                onClick={() => data.setActiveLayer(layer)}
                                onDragStart={(e) => data.handleDragStart(e, layer)}
                                className="w-12 h-12 mx-1 rounded-sm shadow-md p-app__grid cursor-grab" />
                            <input aria-label={`${layer.name} layer`}
                                data-tip={`${layer.name}`}
                                data-for="tooltip"
                                type="text"
                                value={layer.name}
                                className="flex-1 input w-[70px] m-[4px]"
                                onKeyDown={e => e.stopPropagation()}
                                onClick={() => data.setActiveLayer(layer)}
                                onChange={e => {
                                    let value = e.target.value;
                                    data.setActiveLayer({
                                        ...data.activeLayer,
                                        name: value
                                    })
                                }}
                            />
                        </div>
                    </div>
                ))}
            </section>
        </section>
    )
}


function useLayers() {
    let [imageMap, setImageMap] = useState<any>({});
    let [allLayersOpacity, setAllLayersOpacity] = useState(255);
    let [draggedLayer, setDraggedLayer] = useState<ILayer | null>(null);

    const { activeFrame, setActiveFrame, activeLayer, setActiveLayer, canvasSize } = useGlobalStore();
    const canvas1 = useCanvas();
    const canvas2 = useCanvas();
    const layersAreVisible = allLayersOpacity === 255;
    const previousActiveLayer = useRef<Symbol>(activeLayer.symbol);
    const emptyImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wIAAgEBAJpvAX4AAAAASUVORK5CYII=";

    useShortcuts({
        "arrowup": decreaseCurrentLayer,
        "arrowdown": increaseCurrentLayer,
    });

    //? use a hash to check for changes
    useSetInterval(() => {
        let map: any = {};
        activeFrame.layers.forEach(layer => {
            let img = getImage(layer.image);
            map[layer.symbol] = img;
        });
        setImageMap(map);
    }, 1000, [activeFrame]);

    useEffect(() => {
        ReactTooltip.rebuild();

        if (previousActiveLayer.current !== activeLayer.symbol) {
            previousActiveLayer.current = activeLayer.symbol;
            onionSkinHandler(allLayersOpacity);
        }
    }, [activeLayer]);

    useEffect(() => {
        onionSkinHandler(allLayersOpacity);
    }, [allLayersOpacity]);

    const handleDragStart = (e: React.DragEvent, layer: ILayer) => {
        setDraggedLayer(layer);
        // Optionally, you can add effects or styling here to indicate dragging
    };

    const handleDrop = (e: React.DragEvent, targetLayer: ILayer) => {
        e.preventDefault();
        if (!draggedLayer || draggedLayer === targetLayer) return;

        // Find indexes
        const draggedIndex = activeFrame.layers.findIndex(l => l.symbol === draggedLayer!.symbol);
        const targetIndex = activeFrame.layers.findIndex(l => l.symbol === targetLayer.symbol);

        // Reorder layers
        let newLayers = [...activeFrame.layers];
        newLayers.splice(draggedIndex, 1); // Remove dragged layer
        newLayers.splice(targetIndex, 0, draggedLayer); // Insert dragged layer before the target layer

        // Update frame with new layers order
        let newFrame = { ...activeFrame, layers: newLayers };
        setActiveFrame(newFrame);
    };

    const handleDragEnd = () => {
        setDraggedLayer(null); // Reset draggedLayer state
        // Optionally, reset any drag effects or styling here
    };

    function getImage(data?: ImageData) {
        if (!data) return "";

        canvas1.resize(data.width, data.height);
        canvas1.putImageData(data);
        return canvas1.toDataURL();
    }

    function onionSkinHandler(opacity: number) {
        let newLayers = activeFrame.layers
            .map(layer => {
                layer.opacity = layer.symbol === activeLayer.symbol ? 255 : opacity;
                return layer;
            });
        activeFrame.layers = newLayers;
        setActiveFrame({ ...activeFrame });
    }

    function toggleAllLayerVisibility() {
        if (allLayersOpacity === 255) setAllLayersOpacity(0);
        else setAllLayersOpacity(255);
    }

    function toggleLayerVisibility(layer) {
        let newLayers = activeFrame.layers
            .map(l => {
                if (l.symbol === layer.symbol) {
                    l.opacity = l.opacity === 255 ? 0 : 255;
                }
                return l;
            });

        activeFrame.layers = newLayers;
        setActiveFrame({ ...activeFrame });
    }

    function moveLayerUp() {
        let newFrame = { ...activeFrame };
        let index = newFrame.layers.findIndex(l => l.symbol == activeLayer.symbol);
        if (index != 0) {
            let temp = newFrame.layers[index];
            newFrame.layers[index] = newFrame.layers[index - 1];
            newFrame.layers[index - 1] = temp;
        }
        setActiveFrame(newFrame);
    }

    function moveLayerDown() {
        let newFrame = { ...activeFrame };
        let index = newFrame.layers.findIndex(l => l.symbol == activeLayer.symbol);
        if (index != newFrame.layers.length - 1) {
            let temp = newFrame.layers[index];
            newFrame.layers[index] = newFrame.layers[index + 1];
            newFrame.layers[index + 1] = temp;
        }
        setActiveFrame(newFrame);
    }

    function deleteLayer() {
        let newLayers = activeFrame.layers.filter(layer => layer.symbol !== activeLayer.symbol);
        if (newLayers.length === 0) {
            newLayers.push({
                opacity: 255,
                symbol: Symbol(),
                name: "New Layer",
                image: new ImageData(canvasSize.width ?? 1, canvasSize.height ?? 1),
            })
        }
        let newFrame = { ...activeFrame, layers: newLayers };
        setActiveFrame(newFrame);
        setActiveLayer(newFrame.layers[0]);
    }

    function updateLayer(layer: ILayer) {
        setActiveLayer(layer);
    }

    function addNewLayer() {
        let newLayer: ILayer = {
            opacity: 255,
            symbol: Symbol(),
            name: "New Layer",
            image: new ImageData(canvasSize.width ?? 1, canvasSize.height ?? 1),
        };

        setActiveLayer(newLayer);
    }

    function mergeLayer() {
        canvas1.resize(activeLayer.image.width, activeLayer.image.height);
        canvas2.resize(activeLayer.image.width, activeLayer.image.height);

        let newFrame = { ...activeFrame };
        let index = newFrame.layers.findIndex(l => l.symbol == activeLayer.symbol);

        if (newFrame.layers.length > 1 && index != newFrame.layers.length - 1) {
            let layerBelow = newFrame.layers[index + 1];

            canvas1.putImageData(activeLayer.image);
            canvas2.putImageData(layerBelow.image);
            canvas2.drawImage(canvas1.getElement());

            newFrame.layers[index].image = canvas2.getImageData();
            newFrame.layers.splice(index + 1, 1);

            setActiveLayer(newFrame.layers[index]);
            setActiveFrame(newFrame);
        }
    }

    function duplicateLayer() {
        let image = canvas1.getCtx().createImageData(activeLayer.image.width, activeLayer.image.height);
        image.data.set(activeLayer.image.data);

        let index = activeFrame.layers.findIndex(l => l.symbol === activeLayer.symbol);
        let newFrame = { ...activeFrame };
        let newLayer: ILayer = {
            symbol: Symbol(),
            name: "Copy of " + activeLayer.name,
            image: image,
            opacity: activeLayer.opacity,
        };

        newFrame.layers.splice(index + 1, 0, newLayer);
        setActiveFrame(newFrame);
        setActiveLayer(newLayer);
    }

    function increaseCurrentLayer() {
        let newFrame = { ...activeFrame };
        let index = newFrame.layers.findIndex(l => l.symbol == activeLayer.symbol) + 1;
        if (index < newFrame.layers.length) {
            setActiveLayer(newFrame.layers[index]);
        }
        else {
            setActiveLayer(newFrame.layers[0]);
        }
    }

    function decreaseCurrentLayer() {
        let newFrame = { ...activeFrame };
        let index = newFrame.layers.findIndex(l => l.symbol == activeLayer.symbol) - 1;
        if (index >= 0) {
            setActiveLayer(newFrame.layers[index]);
        }
        else {
            setActiveLayer(newFrame.layers[newFrame.layers.length - 1]);
        }
    }

    return {
        emptyImg,
        imageMap,
        activeFrame,
        activeLayer,
        allLayersOpacity,
        layersAreVisible,
        handleDrop,
        mergeLayer,
        updateLayer,
        addNewLayer,
        deleteLayer,
        moveLayerUp,
        moveLayerDown,
        handleDragEnd,
        setActiveLayer,
        duplicateLayer,
        setAllLayersOpacity,
        handleDragStart,
        onionSkinHandler,
        toggleLayerVisibility,
        toggleAllLayerVisibility,
    }
}

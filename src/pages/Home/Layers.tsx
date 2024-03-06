import { ILayer } from "../../types";
import { MdDelete } from "react-icons/md";
import { RiGitMergeFill } from "react-icons/ri";
import { IoEye, IoCopy } from "react-icons/io5";
import { useCanvas, useGlobalStore } from "../../utils";
import { HiEyeOff, HiDocumentAdd } from "react-icons/hi";
import React, { useEffect, useRef, useState } from 'react';
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";


export function Layers() {
    const data = useLayers();

    return (
        <section>
            <nav className="mb-2 p-app__layer-controls">
                <button data-tip="add new layer"
                    data-for="tooltip"
                    onClick={data.addNewLayer}
                    className="c-button --xs --fourth">
                    <HiDocumentAdd />
                </button>
                <button data-tip="delete current layer"
                    data-for="tooltip"
                    onClick={data.deleteLayer}
                    className="c-button --xs --fourth">
                    <MdDelete />
                </button>
                <button data-tip={`${data.layersAreVisible ? "hide other layers" : "show all layers"}`}
                    data-for="tooltip"
                    onClick={data.toggleLayerVisibility}
                    className="c-button --xs --fourth">
                    {data.layersAreVisible ? <IoEye /> : <HiEyeOff />}
                </button>
                <button data-tip="move layer up"
                    data-for="tooltip"
                    onClick={data.moveLayerUp}
                    className="c-button --xs --fourth">
                    <BsFillCaretUpFill />
                </button>
                <button data-tip="move layer down"
                    data-for="tooltip"
                    onClick={data.moveLayerDown}
                    className="c-button --xs --fourth">
                    <BsFillCaretDownFill />
                </button>
                <button data-tip="merge layer with layer below"
                    data-for="tooltip"
                    onClick={data.mergeLayer}
                    className="c-button --xs --fourth">
                    <RiGitMergeFill />
                </button>
                <button data-tip="duplicate layer"
                    data-for="tooltip"
                    onClick={data.duplicateLayer}
                    className="c-button --xs --fourth">
                    <IoCopy />
                </button>
                <label data-tip="change non-active layers opacity"
                    data-for="tooltip"
                    className="w-full">
                    <p hidden>layers opacity lever</p>
                    <input min="1"
                        step="1"
                        max="255"
                        type="range"
                        className="w-full c-input"
                        value={data.layerOpacity}
                        onChange={e => data.setLayerOpacity(e.currentTarget.valueAsNumber)} />
                </label>
            </nav>

            <section className="mb-2 p-app__layer-container">
                {data.activeFrame.layers.map((layer: ILayer, i) => (
                    <div key={i}
                        draggable
                        onDragEnd={data.handleDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => data.handleDrop(e, layer)}
                        onClick={() => data.setActiveLayer(layer)}
                        onDragStart={(e) => data.handleDragStart(e, layer)}
                        className={`p-app__layer ${layer.symbol === data.activeLayer.symbol ? "--active" : ""}`}>

                        <img src={data.imageMap[layer.symbol]} className="p-app__layer-img" />
                        <input type="text"
                            className="c-input --xs !w-9/12"
                            value={layer.name}
                            onChange={e => {
                                let value = e.target.value;
                                data.setActiveLayer({
                                    ...data.activeLayer,
                                    name: value
                                })
                            }}
                        />
                    </div>
                ))}
            </section>
        </section>
    )
}


function useLayers() {
    let [imageMap, setImageMap] = useState<any>({});
    let [layerOpacity, setLayerOpacity] = useState(255);
    let [draggedLayer, setDraggedLayer] = useState<ILayer | null>(null);

    const canvas1 = useCanvas();
    const canvas2 = useCanvas();
    const layersAreVisible = layerOpacity === 255;
    const { activeFrame, setActiveFrame, activeLayer, setActiveLayer, canvasSize } = useGlobalStore();
    const previousActiveLayer = useRef<Symbol>(activeLayer.symbol);

    useEffect(() => {
        let map: any = {};
        activeFrame.layers.forEach(layer => {
            let img = getImage(layer.image);
            map[layer.symbol] = img;
        });
        setImageMap(map);
    }, [activeFrame]);

    useEffect(() => {
        if (previousActiveLayer.current !== activeLayer.symbol) {
            previousActiveLayer.current = activeLayer.symbol;
            onionSkinHandler(layerOpacity);
        }
    }, [activeLayer]);

    useEffect(() => {
        onionSkinHandler(layerOpacity);
    }, [layerOpacity]);

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

    function toggleLayerVisibility() {
        if (layerOpacity === 255) setLayerOpacity(0);
        else setLayerOpacity(255);
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
        if (!window.confirm("Are you sure you want to delete this layer?")) return;

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

        let newLayer: ILayer = {
            symbol: Symbol(),
            name: "Copy of " + activeLayer.name,
            image: image,
            opacity: activeLayer.opacity,
        };

        setActiveLayer(newLayer);
    }

    return {
        imageMap,
        activeFrame,
        activeLayer,
        layerOpacity,
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
        setLayerOpacity,
        handleDragStart,
        onionSkinHandler,
        toggleLayerVisibility,
    }
}

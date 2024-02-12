import { MdDelete } from "react-icons/md";
import { RiGitMergeFill } from "react-icons/ri";
import { IoEye, IoCopy } from "react-icons/io5";
import { initReducerState, reducer, useCanvas } from "../../utils";
import { IFrame, ILayer, ICanvas } from "../../types";
import { HiEyeOff, HiDocumentAdd } from "react-icons/hi";
import React, { useEffect, useReducer, useState } from 'react';
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";


interface IProps {
    activeFrame: IFrame;
    activeLayer: ILayer;
    setActiveFrame: (frame: IFrame) => void;
    setActiveLayer: (layer: ILayer, frame?: IFrame, frames?: IFrame[]) => void;
}


export function Layers(props: IProps) {
    const data = useLayers(props);

    return (
        <section>
            <nav className="p-app__layer-controls mb-2">
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
                    <input onChange={e => data.onionSkinHandler(e.target.valueAsNumber)}
                        className="c-input w-full"
                        type="range"
                        min="1"
                        max="255"
                        step="1"
                        value={
                            props.activeFrame.layers.reduce((acc, v) => {
                                if (v.symbol !== props.activeLayer.symbol) return v.opacity;
                                else return acc;
                            }, 255)
                        } />
                </label>
            </nav>

            <section className="p-app__layer-container mb-2">
                {props.activeFrame.layers.map((layer: ILayer, i) => (
                    <div className={`p-app__layer ${layer.symbol === props.activeLayer.symbol ? "--active" : ""}`}
                        onClick={() => data.updateLayer(layer)}
                        key={i}>
                        <img src={data.imageMap[layer.symbol]} className="p-app__layer-img" />
                        <input type="text"
                            className="c-input --xs !w-9/12"
                            value={layer.name}
                            onChange={e => {
                                let value = e.target.value;
                                props.setActiveLayer({
                                    ...props.activeLayer,
                                    name: value
                                })
                            }} />
                    </div>
                ))}
            </section>
        </section>
    )
}


function useLayers(props: IProps) {
    let [imageMap, setImageMap] = useState<any>({});
    let [layerOpacity, setLayerOpacity] = useState(255);
    let [global, setGlobal] = useReducer(reducer, initReducerState);

    const canvas1 = useCanvas();
    const canvas2 = useCanvas();
    const layersAreVisible = layerOpacity === 255;

    useEffect(() => {
        let map: any = {};
        props.activeFrame.layers.forEach(layer => {
            let img = getImage(layer.image);
            map[layer.symbol] = img;
        });
        setImageMap(map);
    }, [props.activeLayer, props.activeFrame]);

    useEffect(() => {
        onionSkinHandler(layerOpacity);
    }, [layerOpacity, props.activeLayer]);

    function getImage(data?: ImageData) {
        if (!data) return "";

        canvas1.resize(data.width, data.height);
        canvas1.putImageData(data);
        return canvas1.toDataURL();
    }

    function updateLayer(layer: ILayer) {
        props.setActiveLayer(layer);
    }

    function addNewLayer() {
        let newLayer: ILayer = {
            opacity: 255,
            symbol: Symbol(),
            name: "New Layer",
            image: new ImageData(global["Canvas.mainCanvas"].width ?? 1, global["Canvas.mainCanvas"].height ?? 1),
        };

        props.setActiveLayer(newLayer);
    }

    function deleteLayer() {
        if (!window.confirm("Are you sure you want to delete this layer?")) return;

        let newLayers = props.activeFrame.layers.filter(layer => layer.symbol !== props.activeLayer.symbol);
        if (newLayers.length === 0) {
            newLayers.push({
                opacity: 255,
                symbol: Symbol(),
                name: "New Layer",
                image: new ImageData(global["Canvas.mainCanvas"].width ?? 1, global["Canvas.mainCanvas"].height ?? 1),
            })
        }
        let newFrame = { ...props.activeFrame, layers: newLayers };
        props.setActiveFrame(newFrame);
        props.setActiveLayer(newFrame.layers[0], newFrame);
    }

    function onionSkinHandler(opacity: number) {
        let newLayers = props.activeFrame.layers
            .map(layer => {
                let newOpacity = layer.symbol === props.activeLayer.symbol ? 255 : opacity;
                layer.opacity = newOpacity;
                return layer;
            });
        props.activeFrame.layers = newLayers;
        props.setActiveFrame({ ...props.activeFrame });
        setLayerOpacity(opacity);
    }

    function toggleLayerVisibility() {
        if (layerOpacity === 255) setLayerOpacity(0);
        else setLayerOpacity(255);
    }

    function moveLayerUp() {
        let newFrame = { ...props.activeFrame };
        let index = newFrame.layers.findIndex(l => l.symbol == props.activeLayer.symbol);
        if (index != 0) {
            let temp = newFrame.layers[index];
            newFrame.layers[index] = newFrame.layers[index - 1];
            newFrame.layers[index - 1] = temp;
        }
        props.setActiveFrame(newFrame);
    }

    function moveLayerDown() {
        let newFrame = { ...props.activeFrame };
        let index = newFrame.layers.findIndex(l => l.symbol == props.activeLayer.symbol);
        if (index != newFrame.layers.length - 1) {
            let temp = newFrame.layers[index];
            newFrame.layers[index] = newFrame.layers[index + 1];
            newFrame.layers[index + 1] = temp;
        }
        props.setActiveFrame(newFrame);
    }

    function mergeLayer() {
        canvas1.resize(props.activeLayer.image.width, props.activeLayer.image.height);
        canvas2.resize(props.activeLayer.image.width, props.activeLayer.image.height);

        let newFrame = { ...props.activeFrame };
        let index = newFrame.layers.findIndex(l => l.symbol == props.activeLayer.symbol);

        if (newFrame.layers.length > 1 && index != newFrame.layers.length - 1) {
            let layerBelow = newFrame.layers[index + 1];

            canvas1.putImageData(props.activeLayer.image);
            canvas2.putImageData(layerBelow.image);
            canvas2.drawImage(canvas1.canvas);

            newFrame.layers[index].image = canvas2.getImageData();
            newFrame.layers.splice(index + 1, 1);

            props.setActiveLayer(newFrame.layers[index]);
            props.setActiveFrame(newFrame);
        }
    }

    function duplicateLayer() {
        let image = canvas1.ctx.createImageData(props.activeLayer.image.width, props.activeLayer.image.height);
        image.data.set(props.activeLayer.image.data);

        let newLayer: ILayer = {
            symbol: Symbol(),
            name: "Copy of " + props.activeLayer.name,
            image: image,
            opacity: props.activeLayer.opacity,
        };

        props.setActiveLayer(newLayer);
    }

    return {
        imageMap,
        mergeLayer,
        updateLayer,
        addNewLayer,
        deleteLayer,
        moveLayerUp,
        moveLayerDown,
        duplicateLayer,
        layersAreVisible,
        onionSkinHandler,
        toggleLayerVisibility,
    }
}

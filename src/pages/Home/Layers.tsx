import { MdDelete } from "react-icons/md";
import { IFrame, ILayer, ICanvas } from "./";
import { RiGitMergeFill } from "react-icons/ri";
import { IoEye, IoCopy } from "react-icons/io5";
import React, { useEffect, useState } from 'react';
import { HiEyeOff, HiDocumentAdd } from "react-icons/hi";
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";


interface IProps {
    canvas?: ICanvas;
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
                    data-for="tooltip">
                    <p hidden>layers opacity lever</p>
                    <input onChange={e => data.onionSkinHandler(e.target.valueAsNumber)}
                        className="c-input --xs w-full"
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
    const layersAreVisible = layerOpacity === 255;

    useEffect(() => {
        let map: any = {};
        props.activeFrame.layers.forEach(layer => {
            let img = getImage(layer.image);
            map[layer.symbol] = img;
        });
        setImageMap(map);
    }, [props.activeLayer, props.activeFrame]);

    function getImage(data?: ImageData) {
        if (!data) return "";

        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = data.width;
        canvas.height = data.height;
        ctx?.putImageData(data, 0, 0);

        return canvas.toDataURL();
    }

    function updateLayer(layer: ILayer) {
        props.setActiveLayer(layer);
        onionSkinHandler(layerOpacity);
    }

    function addNewLayer() {
        let newLayer: ILayer = {
            image: new ImageData(props.canvas?.width ?? 1, props.canvas?.height ?? 1),
            opacity: 255,
            symbol: Symbol(),
            name: "New Layer"
        };

        props.setActiveLayer(newLayer);
    }

    function deleteLayer() {
        if (!window.confirm("Are you sure you want to delete this layer?")) return;

        let newLayers = props.activeFrame.layers.filter(layer => layer.symbol !== props.activeLayer.symbol);
        if (newLayers.length === 0) {
            newLayers.push({
                image: new ImageData(props.canvas?.width ?? 1, props.canvas?.height ?? 1),
                opacity: 255,
                symbol: Symbol(),
                name: "New Layer"
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
        let tempCanvas = document.createElement("canvas");
        let tempCtx = tempCanvas.getContext("2d");
        tempCanvas.width = props.activeLayer.image.width;
        tempCanvas.height = props.activeLayer.image.height;

        let tempCanvas2 = document.createElement("canvas");
        let tempCtx2 = tempCanvas2.getContext("2d");
        tempCanvas2.width = props.activeLayer.image.width;
        tempCanvas2.height = props.activeLayer.image.height;

        let newFrame = { ...props.activeFrame };
        let index = newFrame.layers.findIndex(l => l.symbol == props.activeLayer.symbol);

        if (newFrame.layers.length > 1 && index != newFrame.layers.length - 1) {
            let layerBelow = newFrame.layers[index + 1];

            tempCtx?.putImageData(props.activeLayer.image, 0, 0);
            tempCtx2?.putImageData(layerBelow.image, 0, 0);
            tempCtx2?.drawImage(tempCanvas, 0, 0);

            newFrame.layers[index].image = tempCtx2!.getImageData(0, 0, tempCanvas2.width, tempCanvas2.height);
            newFrame.layers.splice(index + 1, 1);

            props.setActiveLayer(newFrame.layers[index]);
            props.setActiveFrame(newFrame);
        }
    }

    function duplicateLayer() {
        if (!props.canvas) return;

        let image = props.canvas.ctx!.createImageData(props.activeLayer.image.width, props.activeLayer.image.height);
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

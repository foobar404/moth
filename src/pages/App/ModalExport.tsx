import GIF from "gif.js";
import { Base64 } from 'js-base64';
import pngText from "png-chunk-text";
import { IProject } from '../../types';
import { Modal } from "../../components";
import { FaStar } from "react-icons/fa";
import pngEncode from "png-chunks-encode";
import ReactTooltip from "react-tooltip";
import { PiGifFill } from "react-icons/pi";
import pngExtract from "png-chunks-extract";
import { Buffer as pngBuffer } from "buffer";
import { MdMovieFilter } from "react-icons/md";
import React, { useEffect, useState } from 'react';
import { IoImage, IoLayers } from "react-icons/io5";
import { useCanvas, useGlobalStore } from '../../utils';


export interface IExportSettings {
    scale: number;
    gifFps: number;
    paddingX: number;
    paddingY: number;
    frameOnly: boolean;
    mothData: boolean;
}


export function ModalExport(props) {
    const data = useModalExport(props);

    return (
        <Modal {...props}>
            <ReactTooltip id="tooltip" />
            <main className="pt-8 sm:p-12 max-w-[80vw]">
                <section className="!items-stretch space-y-2 col">
                    <span className="sm:hidden">Export Current Frame</span>
                    <button aria-label="export current frame"
                        className="btn btn-secondary row-left"
                        onClick={() => data.exportProject({ ...data.exportSettings, frameOnly: true })}>
                        <IoImage className="text-2xl" />
                        <span className="hidden sm:block">Export Current Frame</span>
                    </button>

                    <span className="sm:hidden">Export as GIF</span>
                    <button aria-label="export all frames as a gif"
                        className="btn btn-secondary row-left"
                        onClick={() => data.createGif(data.exportSettings)}>
                        <PiGifFill className="text-2xl" />
                        <span className="hidden sm:block">Export as GIF</span>
                        <input aria-label="gif fps setting"
                            data-for="tooltip"
                            data-tip="fps"
                            type="number"
                            className="w-20 ml-4 input input-sm bg-secondary-content text-secondary"
                            defaultValue={data.exportSettings.gifFps}
                            onClick={e => e.stopPropagation()}
                            onKeyUp={e => e.stopPropagation()}
                            onChange={e => data.setExportSettings({ ...data.exportSettings, gifFps: e.currentTarget.valueAsNumber })} />
                    </button>

                    <span className="sm:hidden">Export as Spritesheet</span>
                    <button aria-label="export all frames as a spritesheet"
                        className="btn btn-secondary row-left"
                        onClick={() => data.exportProject(data.exportSettings)}>
                        <MdMovieFilter className="text-2xl" />
                        <span className="hidden sm:block">Export as Spritesheet</span>
                        <div className="inline-flex ml-4 space-x-2">
                            <input aria-label="spritesheet x padding value"
                                data-for="tooltip"
                                data-tip="padding x"
                                type="number"
                                className="w-20 input input-sm bg-secondary-content text-secondary"
                                value={data.exportSettings.paddingX}
                                onClick={e => e.stopPropagation()}
                                onKeyUp={e => e.stopPropagation()}
                                onChange={e => data.setExportSettings({ ...data.exportSettings, paddingX: e.currentTarget.valueAsNumber })} />
                            <input aria-label="spritesheet y padding value"
                                data-for="tooltip"
                                data-tip="padding y"
                                type="number"
                                className="w-20 input input-sm bg-secondary-content text-secondary"
                                value={data.exportSettings.paddingY}
                                onClick={e => e.stopPropagation()}
                                onKeyUp={e => e.stopPropagation()}
                                onChange={e => data.setExportSettings({ ...data.exportSettings, paddingY: e.currentTarget.valueAsNumber })} />
                        </div>
                    </button>

                    <span className="sm:hidden">Save Project</span>
                    <button aria-label="save project as .moth file"
                        className="btn btn-primary row-left"
                        onClick={() => data.saveProject()}>
                        <FaStar className="text-2xl" />
                        <span className="hidden sm:block">Save Project</span>
                    </button>

                    <footer>
                        <h2 className="p-2 font-bold rounded-t-lg text-base-content w-min bg-base-200">Settings</h2>

                        <section className="bg-base-200 max-h-[200px] overflow-auto p-2 rounded-tl-none rounded-lg text-base-content">
                            <p>Scale: {data.exportSettings.scale} - {data.canvasSize.height * data.exportSettings.scale} x {data.canvasSize.width * data.exportSettings.scale}</p>
                            <div className="row">
                                <input aria-label="export image scale slider"
                                    type="range"
                                    min={1} max={30}
                                    value={data.exportSettings.scale}
                                    className="range range-slider-base-content"
                                    onChange={(e) => data.setExportSettings({ ...data.exportSettings, scale: e.currentTarget.valueAsNumber })} />

                                <input aria-label="export image scale input"
                                    type="number"
                                    min={1}
                                    value={data.exportSettings.scale}
                                    className="input input-sm w-[70px] ml-2"
                                    onChange={(e) => data.setExportSettings({ ...data.exportSettings, scale: e.currentTarget.valueAsNumber })} />
                            </div>
                        </section>
                    </footer>
                </section>
            </main>

        </Modal>
    )
}


function useModalExport(props) {
    const canvas1 = useCanvas();
    const canvas2 = useCanvas();
    const canvas3 = useCanvas();
    const { canvasSize, activeFrame, activeLayer, projectName, frames, colorPalettes } = useGlobalStore();

    let [exportSettings, setExportSettings] = useState<IExportSettings>({
        scale: 1,
        gifFps: 24,
        paddingX: 0,
        paddingY: 0,
        mothData: false,
        frameOnly: false,
    });

    useEffect(() => {
        ReactTooltip.rebuild();
    }, [props.isOpen]);

    function getProject(): IProject {
        return {
            name: projectName,
            frames: frames,
            colorPalettes: colorPalettes,
            canvas: canvasSize,
        };
    }

    function exportProject(settings: IExportSettings) {
        let height = canvasSize.height;
        let width = settings?.frameOnly ?
            canvasSize.width : canvasSize.width * frames.length;
        let newFrames = settings?.frameOnly ?
            [activeFrame] : frames;

        height += (newFrames.length * settings.paddingY * 2);
        width += (newFrames.length * settings.paddingX * 2);
        height *= settings.scale;
        width *= settings.scale;

        canvas1.resize(width, height);
        canvas2.resize(canvasSize.width, canvasSize.height);
        canvas3.resize(canvasSize.width, canvasSize.height);

        // render image
        newFrames.forEach((frame, i) => {
            let layersRevered = frame.layers.slice().reverse();

            layersRevered.forEach(layer => {
                canvas3.putImageData(layer.image);
                canvas2.drawImage(canvas3.getElement());
            });

            let scaledWidth = canvasSize.width * settings.scale;
            let scaledHeight = canvasSize.height * settings.scale;

            let posX = (i * (scaledWidth + settings.paddingX)) + settings.paddingX;
            let posY = settings.paddingY;

            canvas1.drawImage(canvas2.getElement(), posX, posY, scaledWidth, scaledHeight);
            canvas2.clear();
        });

        // get current project as png
        let tempPng = canvas1.toDataURL();
        let tempPngData = tempPng.replace(/^data:image\/(png|jpg);base64,/, "");
        let tempPngBuffer = pngBuffer.from(tempPngData, "base64");
        let data = new Uint8Array(tempPngBuffer.buffer);
        let chunks = pngExtract(data);

        // add meta data to png
        if (settings.mothData) {
            let project = getProject();
            chunks.splice(-1, 0, pngText.encode('moth', Base64.encode(JSON.stringify(project))));
        }

        // convert data to png
        let newBuffer = pngBuffer.from(pngEncode(chunks), 'base64');
        let blob = new Blob([newBuffer], { type: "image/png" });
        let url = URL.createObjectURL(blob);

        // download the image
        let anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = projectName + (settings.mothData ? ".moth.png" : "");
        anchor.click();
    }

    function saveProject() {
        exportProject({
            gifFps: 0,
            paddingX: 0,
            paddingY: 0,
            scale: 5,
            mothData: true,
            frameOnly: true,
        });
    }

    function createGif(settings: IExportSettings) {
        // Scaling the dimensions
        let scaledWidth = canvasSize.width * settings.scale;
        let scaledHeight = canvasSize.height * settings.scale;

        var gif = new GIF({
            workerScript: '/js/gif.worker.js',
            quality: 1,
            workers: 2,
            transparent: 0x000000,
            height: scaledHeight,
            width: scaledWidth,
            repeat: 0
        });

        canvas1.resize(canvasSize.width, canvasSize.height);
        canvas2.resize(canvasSize.width, canvasSize.height);
        canvas3.resize(scaledWidth, scaledHeight);

        frames.forEach(frame => {
            canvas1.clear();
            canvas2.clear();
            canvas3.clear();

            let layersRevered = frame.layers.slice().reverse();
            layersRevered.forEach(layer => {
                canvas1.putImageData(layer.image);
                canvas2.drawImage(canvas1.getElement());
            });

            canvas3.drawImage(canvas2.getElement(), 0, 0, scaledWidth, scaledHeight);

            gif.addFrame(canvas3.getElement(), {
                copy: true,
                delay: 1000 / settings.gifFps,
            });
        });

        gif.on('finished', function (blob) {
            let anchor = document.createElement("a");
            anchor.href = URL.createObjectURL(blob);
            anchor.download = projectName;
            anchor.click();
        });

        gif.render();
    }

    return {
        canvasSize,
        exportSettings,
        createGif,
        saveProject,
        exportProject,
        setExportSettings,
    }
}
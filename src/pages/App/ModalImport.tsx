import RgbQuant from "rgbquant";
import { Base64 } from 'js-base64';
import pngText from "png-chunk-text";
import { Modal } from "../../components";
import { ImCross } from "react-icons/im";
import ReactTooltip from "react-tooltip";
import pngExtract from "png-chunks-extract";
import React, { useEffect, useState } from 'react';
import { useCanvas, useGlobalStore } from '../../utils';


export function ModalImport(props) {
    const data = useModalImport(props);

    return (
        <Modal {...props}>
            <ReactTooltip id="tooltip" />
            <main className="p-12">
                <section className="space-y-2 col">
                    <button aria-label="import moth project"
                        className="px-14 btn btn-accent"
                        onClick={() => {
                            data.importProject();
                            props.setIsOpen(false);
                        }}>
                        Import Project
                    </button>
                    <section className="p-4 rounded-lg col bg-base-200">
                        <button aria-label="import png, jpg or gif image"
                            className="px-14 btn btn-outline"
                            onClick={() => {
                                data.importImage();
                                props.setIsOpen(false);
                            }}>
                            Import Image
                        </button>

                        <div className="mt-2 space-x-2 row">
                            <input aria-label="max size of image"
                                data-tip="max size"
                                data-for="tooltip"
                                type="number"
                                max="512"
                                min="8"
                                className="input input-sm w-[70px]"
                                defaultValue={data.imageImportSettings.size}
                                onKeyDown={e => e.stopPropagation()}
                                onClick={e => e.currentTarget.select()}
                                onChange={e => data.setImageImportSettings(s => ({ ...s, size: Number(e.currentTarget?.value ?? 512) }))} />
                            <input aria-label="max unique colors of image"
                                data-tip="max colors"
                                data-for="tooltip"
                                type="number"
                                max="128"
                                min="2"
                                className="input input-sm w-[70px]"
                                defaultValue={data.imageImportSettings.colors}
                                onKeyDown={e => e.stopPropagation()}
                                onClick={e => e.currentTarget.select()}
                                onChange={e => data.setImageImportSettings(s => ({ ...s, colors: Number(e.currentTarget?.value ?? 128) }))} />
                        </div>
                    </section>

                    <div className="divider">Local Projects</div>

                    <ul className="w-56 rounded-lg menu bg-base-200">
                        {[...data.projectList].reverse().map((project) => (
                            <div key={project} className="row">
                                <li key={project}
                                    onClick={() => {
                                        data.loadProjectFromLocalStorage(project);
                                        props.setIsOpen(false);
                                    }}
                                    className="flex-1 p-1 text-center rounded-md cursor-pointer hover:bg-slate-400 hover:text-white">
                                    {project}
                                </li>
                                <button aria-label="delete project"
                                    className="btn btn-xs"
                                    onClick={() => data.deleteProject(project)}>
                                    <ImCross />
                                </button>
                            </div>
                        ))}
                    </ul>
                </section>
            </main>
        </Modal>
    )
}


function useModalImport(props) {
    const canvas1 = useCanvas();
    const { projectName, setProjectName, setCanvasSize,
        setFrames, setActiveFrame, setColorPalettes, setActiveLayer,
        setActiveColorPalette, canvasSize } = useGlobalStore();
    let [projectList, setProjectList] = useState<string[]>([]);
    let [imageImportSettings, setImageImportSettings] = useState({
        colors: 32,
        size: 256,
    });

    useEffect(() => {
        ReactTooltip.rebuild();
    }, []);

    // load local projects
    useEffect(() => {
        let cachedList = JSON.parse(localStorage.getItem("moth-projects") ?? "[]");
        setProjectList(cachedList);
    }, []);

    async function importProject() {
        let [fileHandle] = await (window as any).showOpenFilePicker({
            types: [{ accept: { 'image/*': [".png"] } }],
        });

        let file = await fileHandle.getFile();
        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = async () => {
            let data = new Uint8Array(fileReader.result as ArrayBuffer);
            let chunks = pngExtract(data);

            const mothChunk = chunks.filter((chunk: any) => {
                return chunk.name === 'tEXt';
            }).map((chunk: any) => {
                return pngText.decode(chunk.data);
            }).filter((chunk: any) => {
                return chunk.keyword === "moth";
            })[0];

            if (mothChunk) { // load project
                let project = JSON.parse(Base64.decode(mothChunk.text));
                loadProject(project);
            }
        }
    }

    function loadProjectFromLocalStorage(projectName) {
        let project = JSON.parse(localStorage.getItem(projectName) ?? "{}");
        loadProject(project);
    }

    function loadProject(project) {
        project.frames.forEach((frame) => {
            frame.symbol = Symbol();
            frame.layers.forEach((layer) => {
                layer.image = new ImageData(new Uint8ClampedArray(Object.values(layer.image.data)), project.canvas.width, project.canvas.height);
                layer.symbol = Symbol();
            });
        });
        project.colorPalettes.forEach((palette) => {
            palette.symbol = Symbol();
        })

        setProjectName(project.name);
        setCanvasSize(project.canvas);
        setFrames(project.frames);
        setActiveFrame(project.frames[0]);
        setActiveLayer(project.frames[0].layers[0]);
        setColorPalettes(project.colorPalettes);
        setActiveColorPalette(project.colorPalettes[0])
    }

    async function importImage() {
        try {
            let [fileHandle] = await (window as any).showOpenFilePicker({
                types: [{ accept: { 'image/*': [".png", ".jpg", ".jpeg", ".gif"] } }],
            });

            let file = await fileHandle.getFile();
            // Convert the file reading process to use async/await syntax
            let arrayBuffer = await file.arrayBuffer();
            let data = new Uint8Array(arrayBuffer);
            let blob = new Blob([data], { type: file.type });
            let url = URL.createObjectURL(blob);
            let img = new Image();
            img.src = url;
            await img.decode();

            // Calculate the scaling factor and adjust dimensions if necessary
            let scale = Math.min(1, imageImportSettings.size / Math.max(img.width, img.height));
            let scaledWidth = Math.round(img.width * scale); // Ensure scaledWidth is a whole number
            let scaledHeight = Math.round(img.height * scale); // Ensure scaledHeight is a whole number

            // Draw the resized image on canvas
            canvas1.clear();
            canvas1.resize(scaledWidth, scaledHeight);
            canvas1.drawImage(img, 0, 0, scaledWidth, scaledHeight);

            // limit color palette
            let q = new RgbQuant({
                colors: imageImportSettings.colors,
            });
            q.sample(canvas1.getElement());

            let imageData = new ImageData(scaledWidth, scaledHeight);
            imageData.data.set(q.reduce(canvas1.getElement()));

            let layer = {
                name: file.name,
                image: imageData,
                symbol: Symbol(),
                opacity: 255,
            };

            setActiveLayer(layer);
            setCanvasSize({
                width: (scaledWidth > canvasSize.width) ? scaledWidth : canvasSize.width,
                height: (scaledHeight > canvasSize.height) ? scaledHeight : canvasSize.height,
            });
        } catch (error) { }
    }

    function deleteProject(project: string) {
        if (!window.confirm("Are you sure you want to delete this project?")) return;

        let currentProjectList = JSON.parse(localStorage.getItem("moth-projects") ?? "[]");
        currentProjectList = currentProjectList.filter((p: string) => p !== project);
        let projectListWithoutCurrent = currentProjectList.filter((p: string) => p !== projectName);

        localStorage.setItem("moth-projects", JSON.stringify(currentProjectList));
        localStorage.removeItem(project);
    }

    return {
        projectList,
        importImage,
        deleteProject,
        importProject,
        imageImportSettings,
        setImageImportSettings,
        loadProjectFromLocalStorage,
    }
}
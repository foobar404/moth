import RgbQuant from "rgbquant";
import { Base64 } from 'js-base64';
import pngText from "png-chunk-text";
import { Modal } from "../../components";
import { ImCross } from "react-icons/im";
import ReactTooltip from "react-tooltip";
import { IoImage } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import pngExtract from "png-chunks-extract";
import React, { useEffect, useState } from 'react';
import { useCanvas, useGlobalStore } from '../../utils';
import { IFrame } from "../../types";


export function ModalImport(props) {
    const data = useModalImport(props);

    return (
        <Modal {...props}>
            <ReactTooltip id="tooltip" />
            <main className="pt-8 md:p-12 max-w-[80vw]">
                <section className="!items-stretch space-y-2 col">

                    <button aria-label="import png, jpg or gif image"
                        className="btn btn-secondary row-left"
                        onClick={async () => {
                            await data.importImage();
                            props.close();
                        }}>
                        <IoImage className="text-2xl" />
                        Import Image

                        <input aria-label="max size of image"
                            data-tip="max size"
                            data-for="tooltip"
                            type="number"
                            max="512"
                            min="8"
                            className="input bg-secondary-content text-secondary input-sm w-[70px]"
                            defaultValue={data.imageImportSettings.size}
                            onKeyDown={e => e.stopPropagation()}
                            onClick={e => { e.currentTarget.select(); e.stopPropagation(); }}
                            onChange={e => data.setImageImportSettings(s => ({ ...s, size: Number(e.currentTarget?.value ?? 512) }))} />
                        <input aria-label="max unique colors of image"
                            data-tip="max colors"
                            data-for="tooltip"
                            type="number"
                            max="128"
                            min="2"
                            className="input input-sm bg-secondary-content text-secondary w-[70px]"
                            defaultValue={data.imageImportSettings.colors}
                            onKeyDown={e => e.stopPropagation()}
                            onClick={e => { e.currentTarget.select(); e.stopPropagation(); }}
                            onChange={e => data.setImageImportSettings(s => ({ ...s, colors: Number(e.currentTarget?.value ?? 128) }))} />
                    </button>

                    <button aria-label="import moth project"
                        className="btn btn-primary row-left"
                        onClick={async () => {
                            await data.importProject();
                            props.close();
                        }}>
                        <FaStar className="text-2xl" />
                        Open Project
                    </button>

                    <div className="!mb-2 !mt-4 divider">Local Projects</div>

                    <ul className="rounded-lg menu bg-base-200">
                        {[...data.projectList].reverse().map((project) => (
                            <div key={project} className="row">
                                <li key={project}
                                    onClick={() => {
                                        data.loadProjectFromLocalStorage(project);
                                        props.close();
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


export function useModalImport(props) {
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
        let file: any = await openFilePicker();
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

    function openFilePicker(options: any = {}) {
        return new Promise((resolve, reject) => {
            // Create an input element
            const input: any = document.createElement('input');
            input.type = 'file';
            input.style.display = 'none'; // Hide the input element

            // Apply options such as allowing multiple file selections
            if (options.multiple) input.multiple = true;

            // Handle file type restrictions if provided
            if (options.types && Array.isArray(options.types)) {
                let accept = options.types.map(type => type.accept.join(', ')).join(', ');
                input.accept = accept;
            }

            // Append to the body temporarily
            document.body.appendChild(input);

            // Listen for file selection
            input.onchange = () => {
                if (input.files.length > 0) {
                    if (input.multiple) {
                        resolve(Array.from(input.files)); // Return all selected files
                    } else {
                        resolve(input.files[0]); // Return the single selected file
                    }
                } else {
                    reject(new DOMException("The user aborted a request.", "AbortError"));
                }
                document.body.removeChild(input); // Clean up
            };

            input.onerror = () => {
                reject(new Error('Error in file input.'));
                document.body.removeChild(input); // Clean up
            };

            // Trigger file selection dialog
            input.click();
        });
    }

    function loadProjectFromLocalStorage(projectName) {
        let project = JSON.parse(localStorage.getItem(projectName) ?? "{}");
        loadProject(project);
    }

    function loadProject(project) {
        project.frames.forEach((frame: IFrame) => {
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
            let file: any = await openFilePicker();
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

        let projectListWithoutCurrent = projectList.filter((p: string) => p !== project);

        localStorage.setItem("moth-projects", JSON.stringify(projectListWithoutCurrent));
        localStorage.removeItem(project);

        setProjectList(projectListWithoutCurrent);
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
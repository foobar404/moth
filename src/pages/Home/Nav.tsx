import GIF from "gif.js";
import { Base64 } from 'js-base64';
import pngText from "png-chunk-text";
import { IProject } from '../../types';
import { HiStar } from "react-icons/hi";
import { ImCross } from "react-icons/im";
import { Modal } from "../../components";
import pngEncode from "png-chunks-encode";
import { PiGifFill } from "react-icons/pi";
import pngExtract from "png-chunks-extract";
import { Buffer as pngBuffer } from "buffer";
import { MdMovieFilter } from "react-icons/md";
import React, { useEffect, useState } from 'react';
import { useCanvas, useModal, useGlobalStore } from '../../utils';
import { IoImage, IoLayers, IoColorPalette } from "react-icons/io5";


interface IProps {
    setShowMobilePanel: (show: boolean) => void;
}


interface IExportSettings {
    gap?: number;
    rows?: number;
    scale?: number;
    offset?: number;
    columns?: number;
    layerOnly?: boolean;
    frameOnly?: boolean;
    allFrames?: boolean;
    allLayers?: boolean;
}


export function Nav(props: IProps) {
    const data = useNav(props);

    return (<>
        <Modal {...data.modalExport}>
            <main className="p-12">
                <section className="space-y-2 col">
                    <button className="btn min-w-[250px] text-left"
                        onClick={() => data.exportProject({ layerOnly: true })}>
                        <i className="c-button__icon"><IoLayers /></i>
                        Export Current Layer
                    </button>
                    <button className="btn min-w-[250px]"
                        onClick={() => data.exportProject({ frameOnly: true })}>
                        <i className="c-button__icon"><IoImage /></i>
                        Export Current Frame
                    </button>
                    <button className="btn min-w-[250px]"
                        onClick={() => data.createGif()}>
                        <i className="c-button__icon --first"><PiGifFill /></i>
                        Export as GIF
                    </button>
                    <section className="p-4 rounded-lg shadow-inner col bg-slate-400">
                        <button className="btn btn-accent min-w-[250px]"
                            onClick={() => data.exportProject()}>
                            <i className="c-button__icon --first"><MdMovieFilter /></i>
                            Export as Spritesheet
                        </button>

                        <section className="flex flex-wrap">
                            <label className="mr-4">
                                <p>scale</p>
                                <input type="number" className="c-input --sm" value={1} />
                            </label>
                        </section>
                    </section>
                </section>
            </main>
        </Modal>

        <Modal {...data.modalImport}>
            <main className="p-12">
                <section className="space-y-2 col">
                    <button className="px-14 btn btn-accent">
                        Import Project
                    </button>
                    <button className="px-14 btn btn-outline">
                        Import Image
                    </button>

                    <div className="divider">Local Projects</div>

                    <ul className="w-56 rounded-lg menu bg-base-200">
                        {data.projectList.map((project) => (
                            <li key={project}
                                onClick={() => data.loadProjectFromLocalStorage(project)}
                                className="p-1 text-center rounded-md cursor-pointer hover:bg-slate-400 hover:text-white">
                                {project}
                            </li>
                        ))}
                    </ul>
                </section>
            </main>
        </Modal>

        <section className="row-left p-app__nav p-app__block w-max">
            <nav className="flex mr-3">
                <button onClick={() => data.modalImport.setIsOpen(true)}
                    className="btn btn-primary rounded-xl mr-2 !hidden md:!inline-flex">
                    <i className="c-button__icon"> <IoImage /></i> Import
                </button>
                <button onClick={() => data.modalExport.setIsOpen(true)}
                    className="btn btn-secondary rounded-xl !hidden md:!inline-flex">
                    <i className="c-button__icon"><HiStar /></i> Export
                </button>

                {/* mobile buttons */}
                <button onClick={() => data.modalImport.setIsOpen(true)}
                    className="c-button --secondary --sm mr-2 md:!hidden">
                    <IoImage />
                </button>
                <button onClick={() => data.modalExport.setIsOpen(true)}
                    className="c-button --primary --sm md:!hidden">
                    <HiStar />
                </button>
            </nav>

            <label>
                <p hidden>project name</p>
                <input data-tip="project name (press enter to save)"
                    data-for="tooltip"
                    type="text"
                    className="input shadow-lg min-w-[250px]"
                    placeholder="Enter Name"
                    value={data.projectName}
                    onChange={e => data.saveProjectName(e.target.value)} />
            </label>

            {/* mobile buttons */}
            <button className="c-button --secondary --sm md:!hidden"
                onClick={() => props.setShowMobilePanel(true)}>
                <IoColorPalette />
            </button>
        </section>
    </>)
}

function useNav(props: IProps) {
    const modalExport = useModal();
    const modalImport = useModal();
    const canvas1 = useCanvas();
    const canvas2 = useCanvas();
    const canvas3 = useCanvas();
    const {
        projectName, frames, activeFrame,
        activeLayer, canvasSize, colorPalettes,
        setProjectName, setFrames, setColorPalettes,
        setCanvasSize, setActiveLayer, setActiveColorPalette
    } = useGlobalStore();
    let [projectList, setProjectList] = useState<string[]>([]);

    // load local projects
    useEffect(() => {
        let cachedList = JSON.parse(localStorage.getItem("moth-projects") ?? "[]");
        setProjectList(cachedList);
    }, []);

    // save project locally
    useEffect(() => {
        let localProject = getProject();

        let currentProjectList = JSON.parse(localStorage.getItem("moth-projects") ?? "[]");
        if (!currentProjectList.includes(localProject.name)) {
            currentProjectList.push(localProject.name);
            localStorage.setItem("moth-projects", JSON.stringify(currentProjectList));
        }

        if (currentProjectList.length > 10) {
            let front = currentProjectList.shift();
            localStorage.removeItem(front);
            localStorage.setItem("moth-projects", JSON.stringify(currentProjectList));
        }

        localStorage.setItem(localProject.name, JSON.stringify(localProject));
    }, [activeLayer]);

    function saveProjectName(name) {
        let currentProjectList = JSON.parse(localStorage.getItem("moth-projects") ?? "[]");
        let index = currentProjectList.indexOf(projectName);
        currentProjectList[index] = name;

        localStorage.setItem("moth-projects", JSON.stringify(currentProjectList));
        localStorage.removeItem(projectName);

        setProjectList(currentProjectList);
        setProjectName(name);
    }

    function getProject(): IProject {
        return {
            name: projectName,
            frames: frames,
            colorPalettes: colorPalettes,
            canvas: canvasSize,
        };
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
        setColorPalettes(project.colorPalettes);
        setActiveColorPalette(project.colorPalettes[0])
        setActiveLayer(project.frames[0].layers[0]);
    }

    function loadProjectFromLocalStorage(projectName) {
        let project = JSON.parse(localStorage.getItem(projectName) ?? "{}");
        loadProject(project);
    }

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

    async function importImage() {
        let [fileHandle] = await (window as any).showOpenFilePicker({
            types: [{ accept: { 'image/*': [".png", ".jpg", ".jpeg"] } }],
        });

        let file = await fileHandle.getFile();
        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = async () => {
            let data = new Uint8Array(fileReader.result as ArrayBuffer);
            let blob = new Blob([data], { type: file.type });
            let url = URL.createObjectURL(blob);
            let img = new Image();
            img.src = url;

            await img.decode();
            let canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            let ctx = canvas.getContext('2d');
            ctx!.drawImage(img, 0, 0);

            let imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
            let layer = {
                name: "Layer 1",
                image: imageData,
                symbol: Symbol(),
                opacity: 255,
            };
            setActiveLayer(layer);
            setCanvasSize({ width: img.width, height: img.height });
            setProjectName(file.name);
        }
    }

    function exportProject(settings?: IExportSettings) {
        let height = canvasSize.height;
        let width = (settings?.frameOnly || settings?.layerOnly) ?
            canvasSize.width :
            canvasSize.width * frames.length;
        canvas1.resize(width, height);
        canvas2.resize(canvasSize.width, canvasSize.height);
        canvas3.resize(canvasSize.width, canvasSize.height);

        let newFrames = (settings?.frameOnly || settings?.layerOnly) ?
            [activeFrame] : frames;

        newFrames.forEach((frame, i) => {
            let layersRevered = frame.layers.slice().reverse();
            let layers = (settings?.layerOnly) ? [activeLayer] : layersRevered;

            layers.forEach(layer => {
                canvas3.putImageData(layer.image);
                canvas2.drawImage(canvas3.getElement());
            });

            canvas1.drawImage(canvas2.getElement(), (width / newFrames.length) * i, 0, canvasSize.width, canvasSize.height);
            canvas2.clear();
        });

        // get current project as png
        let tempPng = canvas1.toDataURL();
        let tempPngData = tempPng.replace(/^data:image\/(png|jpg);base64,/, "");
        let tempPngBuffer = pngBuffer.from(tempPngData, "base64");
        let data = new Uint8Array(tempPngBuffer.buffer);
        let chunks = pngExtract(data);

        // add meta data to png
        let project = getProject();
        chunks.splice(-1, 0, pngText.encode('moth', Base64.encode(JSON.stringify(project))));

        // convert data to png
        let newBuffer = pngBuffer.from(pngEncode(chunks), 'base64');
        let blob = new Blob([newBuffer], { type: "image/png" });
        let url = URL.createObjectURL(blob);

        // download the image
        let anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = projectName;
        anchor.click();
    }

    function deleteProject(project: string) {
        if (!window.confirm("Are you sure you want to delete this project?")) return;

        let currentProjectList = JSON.parse(localStorage.getItem("moth-projects") ?? "[]");
        currentProjectList = currentProjectList.filter((p: string) => p !== project);
        let projectListWithoutCurrent = currentProjectList.filter((p: string) => p !== projectName);

        localStorage.setItem("moth-projects", JSON.stringify(currentProjectList));
        localStorage.removeItem(project);
        setProjectList(projectListWithoutCurrent);
    }

    function createGif() {
        var gif = new GIF({
            workerScript: '/moth/js/gif.worker.js',
            workers: 2,
            quality: 10
        });

        frames.forEach(frame => {
            let layersRevered = frame.layers.slice().reverse();
            layersRevered.forEach(layer => {
                canvas3.resize(canvasSize.width, canvasSize.height);
                canvas3.putImageData(layer.image);
                canvas2.drawImage(canvas3.getElement());
            });
            gif.addFrame(canvas2.getElement(), { delay: 200 });
        })

        gif.on('finished', function (blob) {
            let anchor = document.createElement("a");
            anchor.href = URL.createObjectURL(blob);
            anchor.download = projectName;
            anchor.click();
        });

        gif.render();
    }

    return {
        modalExport,
        modalImport,
        projectName,
        projectList,
        createGif,
        deleteProject,
        exportProject,
        importProject,
        importImage,
        saveProjectName,
        loadProjectFromLocalStorage,
    }
}

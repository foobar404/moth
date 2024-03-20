import GIF from "gif.js";
import { Base64 } from 'js-base64';
import pngText from "png-chunk-text";
import { FaBug } from "react-icons/fa";
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
import { IoImage, IoLayers, IoColorPalette } from "react-icons/io5";
import { useCanvas, useModal, useGlobalStore, useIntervalEffect } from '../../utils';


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
                    <div>
                        <label>
                            <p>Scale: {data.exportSettings.scale}</p>
                            <input type="range"
                                value={data.exportSettings.scale}
                                className="range" min={1} max={20} step={1}
                                onChange={(e) => data.setExportSettings({ ...data.exportSettings, scale: e.currentTarget.valueAsNumber })} />
                        </label>
                        <label className="label">
                            <p className="">Include Moth Data</p>
                            <input type="checkbox"
                                className="checkbox"
                                checked={data.exportSettings.mothData}
                                onChange={e => data.setExportSettings({ ...data.exportSettings, mothData: e.currentTarget.checked })} />
                        </label>
                    </div>

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
                    {/* <button className="btn min-w-[250px]"
                        onClick={() => data.createGif()}>
                        <i className="c-button__icon --first"><PiGifFill /></i>
                        Export as GIF
                    </button> */}
                    <section className="p-4 rounded-lg shadow-inner col bg-base-200">
                        <button className="btn btn-accent min-w-[250px] mb-2"
                            onClick={() => data.exportProject()}>
                            <i className="c-button__icon --first"><MdMovieFilter /></i>
                            Export as Spritesheet
                        </button>

                        <section className="space-x-2 row">
                            <label>
                                <p>Padding X</p>
                                <input type="number"
                                    className="w-20 input input-sm"
                                    value={data.exportSettings.paddingX}
                                    onChange={e => data.setExportSettings({ ...data.exportSettings, paddingX: e.currentTarget.valueAsNumber })} />
                            </label>
                            <label>
                                <p>Padding Y</p>
                                <input type="number"
                                    className="w-20 input input-sm"
                                    value={data.exportSettings.paddingY}
                                    onChange={e => data.setExportSettings({ ...data.exportSettings, paddingY: e.currentTarget.valueAsNumber })} />
                            </label>
                            {/* <label>
                                <p>Data File</p>
                                <input type="checkbox"
                                    className="checkbox checkbox-sm"
                                    checked={data.exportSettings.dataFile}
                                    onChange={e => data.setExportSettings({ ...data.exportSettings, dataFile: e.currentTarget.checked })} />
                            </label> */}
                        </section>
                    </section>
                </section>
            </main>
        </Modal>

        <Modal {...data.modalImport}>
            <main className="p-12">
                <section className="space-y-2 col">
                    <button className="px-14 btn btn-accent"
                        onClick={() => {
                            data.importProject();
                            data.modalImport.setIsOpen(false);
                        }}>
                        Import Project
                    </button>
                    <button className="px-14 btn btn-outline"
                        onClick={() => {
                            data.importImage();
                            data.modalImport.setIsOpen(false);
                        }}>
                        Import Image
                    </button>

                    <div className="divider">Local Projects</div>

                    <ul className="w-56 rounded-lg menu bg-base-200">
                        {[...data.projectList].reverse().map((project) => (
                            <li key={project}
                                onClick={() => {
                                    data.loadProjectFromLocalStorage(project);
                                    data.modalImport.setIsOpen(false);
                                }}
                                className="p-1 text-center rounded-md cursor-pointer hover:bg-slate-400 hover:text-white">
                                {project}
                            </li>
                        ))}
                    </ul>
                </section>
            </main>
        </Modal>

        <nav className="space-x-2 row-left !flex-nowrap p-app__nav p-app__block w-max">
            <button onClick={() => data.modalImport.setIsOpen(true)}
                className="btn btn-sm box-content py-1 btn-primary !hidden md:!inline-flex">
                <i className="c-button__icon"> <IoImage /></i> Import
            </button>
            <button onClick={() => data.modalExport.setIsOpen(true)}
                className="btn btn-sm box-content py-1 btn-secondary !hidden md:!inline-flex">
                <i className="c-button__icon"><HiStar /></i> Export
            </button>

            {/* mobile buttons */}
            <button onClick={() => data.modalImport.setIsOpen(true)}
                className="c-button --secondary --sm md:!hidden">
                <IoImage />
            </button>
            <button onClick={() => data.modalExport.setIsOpen(true)}
                className="c-button --primary --sm md:!hidden">
                <HiStar />
            </button>

            <select className="select select-bordered"
                value={data.theme}
                onChange={(e) => data.changeTheme(e.currentTarget.value)}>

                <option value="light">Light</option>

                <option value="n64-light">N64 Light</option>
                <option value="gbc-light">GBC Light</option>
                <option value="atari-light">Atari Light</option>
                <option value="snes-light">SNES Light</option>
                <option value="genesis-light">Genesis Light</option>
                <option value="playstation-light">Playstation Light</option>
                <option value="dreamcast-light">Dreamcast Light</option>
                <option value="xbox-light">Xbox Light</option>

                <option value="dark">Dark</option>
                <option value="n64-dark">N64 Dark</option>
                <option value="gbc-dark">GBC Dark</option>
                <option value="atari-dark">Atari Dark</option>
                <option value="snes-dark">SNES Dark</option>
                <option value="genesis-dark">Genesis Dark</option>
                <option value="playstation-dark">Playstation Dark</option>
                <option value="dreamcast-dark">Dreamcast Dark</option>
                <option value="xbox-dark">Xbox Dark</option>
            </select>

            <input data-tip="project name"
                data-for="tooltip"
                type="text"
                className="input input-sm min-w-[250px]"
                placeholder="Enter Name"
                value={data.projectName}
                onChange={e => data.saveProjectName(e.target.value)} />

            <a data-tip="report a bug"
                data-for="tooltip"
                target="_blank"
                className="btn btn-sm btn-warning"
                href={"https://forms.gle/pDXePJUoGSFnUBJF7"}>
                <FaBug />
            </a>

            <section className="fixed z-50 p-2 bottom-right">
                <div className="px-6 py-4 badge badge-info">
                    {data.message && data.message}
                    {!data.message && (<>
                        {data.saving ? "Saving..." : "Saved"}
                    </>)}
                </div>
            </section>

            {/* mobile buttons */}
            <button className="c-button --secondary --sm md:!hidden"
                onClick={() => props.setShowMobilePanel(true)}>
                <IoColorPalette />
            </button>
        </nav>
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
        setCanvasSize, setActiveLayer, setActiveColorPalette,
        setActiveFrame, canvasChangeCount
    } = useGlobalStore();
    let [projectList, setProjectList] = useState<string[]>([]);
    let [theme, setTheme] = useState("light");
    let [exportSettings, setExportSettings] = useState({
        scale: 1,
        paddingX: 0,
        paddingY: 0,
        mothData: true,
        dataFile: false,
    });
    let [saving, setSaving] = useState(false);
    let [message, setMessage] = useState("");

    // load local projects
    useEffect(() => {
        let cachedList = JSON.parse(localStorage.getItem("moth-projects") ?? "[]");
        setProjectList(cachedList);
    }, []);

    useEffect(() => {
        setSaving(true);
    }, [canvasChangeCount]);

    // save project locally
    useIntervalEffect(() => {
        try {
            let localProject = getProject();

            let currentProjectList = JSON.parse(localStorage.getItem("moth-projects") ?? "[]");
            if (!currentProjectList.includes(localProject.name)) {
                currentProjectList.push(localProject.name);
                localStorage.setItem("moth-projects", JSON.stringify(currentProjectList));
            }

            if (currentProjectList.length > 5) {
                let front = currentProjectList.shift();
                localStorage.removeItem(front);
                localStorage.setItem("moth-projects", JSON.stringify(currentProjectList));
            }

            localStorage.setItem(localProject.name, JSON.stringify(localProject));
            setSaving(false);
            setMessage("");
        }
        catch (e) {
            setMessage("Storage Full");
        }
    }, 2000, [canvasChangeCount]);

    // load theme
    useEffect(() => {
        let defaultTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? "dark" : "light";
        let theme = localStorage.getItem("moth-theme") ?? defaultTheme;
        changeTheme(theme);
    }, []);

    function saveProjectName(name) {
        let currentProjectList = JSON.parse(localStorage.getItem("moth-projects") ?? "[]");
        let index = currentProjectList.indexOf(projectName);
        currentProjectList[index] = name;

        localStorage.setItem("moth-projects", JSON.stringify(currentProjectList));
        localStorage.removeItem(projectName);
        localStorage.setItem(name, JSON.stringify(getProject()));

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
        setActiveFrame(project.frames[0]);
        setActiveLayer(project.frames[0].layers[0]);
        setColorPalettes(project.colorPalettes);
        setActiveColorPalette(project.colorPalettes[0])
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
            canvasSize.width : canvasSize.width * frames.length;
        let newFrames = (settings?.frameOnly || settings?.layerOnly) ?
            [activeFrame] : frames;

        height += (newFrames.length * exportSettings.paddingY * 2);
        width += (newFrames.length * exportSettings.paddingX * 2);
        height *= exportSettings.scale;
        width *= exportSettings.scale;

        canvas1.resize(width, height);
        canvas2.resize(canvasSize.width, canvasSize.height);
        canvas3.resize(canvasSize.width, canvasSize.height);

        // render image
        newFrames.forEach((frame, i) => {
            let layersRevered = frame.layers.slice().reverse();
            let layers = (settings?.layerOnly) ? [activeLayer] : layersRevered;

            layers.forEach(layer => {
                canvas3.putImageData(layer.image);
                canvas2.drawImage(canvas3.getElement());
            });

            let scaledWidth = canvasSize.width * exportSettings.scale;
            let scaledHeight = canvasSize.height * exportSettings.scale;

            let posX = (i * (scaledWidth + exportSettings.paddingX)) + exportSettings.paddingX;
            let posY = exportSettings.paddingY;

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
        if (exportSettings.mothData) {
            let project = getProject();
            chunks.splice(-1, 0, pngText.encode('moth', Base64.encode(JSON.stringify(project))));
        }

        if (exportSettings.dataFile) {
            exportData();
        }

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

    function exportData(type = "aseprite") {
        let data = {};

        if (type === "aseprite") {
            data = {

            }
        }
        if (type === "texture packer") { }

        let blob = new Blob([JSON.stringify(data)], { type: "application/json" });
        let url = URL.createObjectURL(blob);
        let anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `${projectName}-data.json`;
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
            workerScript: '/js/gif.worker.js',
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

    function changeTheme(themeName) {
        let root = document.documentElement;
        root.setAttribute("data-theme", themeName);
        localStorage.setItem("moth-theme", themeName);
        setTheme(themeName);
    }

    return {
        theme,
        saving,
        message,
        modalExport,
        modalImport,
        projectName,
        projectList,
        exportSettings,
        setTheme,
        createGif,
        changeTheme,
        deleteProject,
        exportProject,
        importProject,
        importImage,
        saveProjectName,
        setExportSettings,
        loadProjectFromLocalStorage,
    }
}

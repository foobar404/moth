import pngText from "png-chunk-text";
import { HiStar } from "react-icons/hi";
import { ImCross } from "react-icons/im";
import { Modal } from "../../components";
import pngEncode from "png-chunks-encode";
import pngExtract from "png-chunks-extract";
import { Buffer as pngBuffer } from "buffer";
import { MdMovieFilter } from "react-icons/md";
import { useModal } from "../../utils/useModal";
import React, { useEffect, useState } from 'react';
import { IoImage, IoLayers, IoColorPalette } from "react-icons/io5";
import { IFrame, ILayer, IProject, ICanvas, IColorPallete, IColor } from "./";


interface IProps {
    frames: IFrame[];
    project: IProject;
    pixelSize: number;
    activeFrame: IFrame;
    activeLayer: ILayer;
    activeColor: IColor;
    getProject: () => IProject;
    colorPalettes: IColorPallete[];
    activeColorPallete: IColorPallete;
    setProject: (project: IProject) => void;
    loadProject: (projectName: string) => void;
    setShowMobilePanel: (show: boolean) => void;
    canvas?: ICanvas;
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
        <Modal {...data.modal}>
            <main className="flex flex-col p-10">
                <section className="flex flex-col items-center mr-10">
                    <button className="c-button --second mb-2"
                        onClick={() => data.exportProject()}>
                        <i className="c-button__icon --first"><MdMovieFilter /></i>
                        Export as Spritesheet
                    </button>
                    <button className="c-button --second mb-2"
                        onClick={() => data.exportProject({ frameOnly: true })}>
                        <i className="c-button__icon"><IoImage /></i>
                        Export Current Frame
                    </button>
                    <button className="c-button --second mb-2"
                        onClick={() => data.exportProject({ layerOnly: true })}>
                        <i className="c-button__icon"><IoLayers /></i>
                        Export Current Layer
                    </button>
                </section>
                {/* <section className="flex flex-wrap">
                    <label className="mr-4">
                        <p>scale</p>
                        <input type="number" className="c-input --sm" />
                    </label>
                    <label className="mr-4">
                        <p>rows</p>
                        <input type="number" className="c-input --sm" />
                    </label>
                    <label className="mr-4">
                        <p>columns</p>
                        <input type="number" className="c-input --sm" />
                    </label>
                    <label className="mr-4">
                        <p>offset X</p>
                        <input type="number" className="c-input --sm" />
                    </label>
                    <label className="mr-4">
                        <p>offset Y</p>
                        <input type="number" className="c-input --sm" />
                    </label>
                    <label className="mr-4">
                        <p>gap</p>
                        <input type="number" className="c-input --sm" />
                    </label>
                </section> */}
            </main>
        </Modal>

        <section className="p-app__nav p-app__block flex items-center justify-between">
            <section className="flex items-center">
                <nav className="flex mr-3">
                    <button onClick={() => data.importProject()}
                        className="c-button --secondary mr-2 !hidden md:!inline-flex">
                        <i className="c-button__icon"> <IoImage /></i> Import
                    </button>
                    <button onClick={() => data.modal.setIsOpen(true)}
                        className="c-button --primary !hidden md:!inline-flex">
                        <i className="c-button__icon"><HiStar /></i> Export
                    </button>

                    {/* mobile buttons */}
                    <button className="c-button --secondary --sm mr-2 md:!hidden">
                        <IoImage />
                    </button>
                    <button onClick={() => data.modal.setIsOpen(true)}
                        className="c-button --primary --sm md:!hidden">
                        <HiStar />
                    </button>
                </nav>

                <label>
                    <p hidden>project name</p>
                    <input data-tip="project name (press enter to save)"
                        data-for="tooltip"
                        type="text"
                        className="c-input mr-2"
                        placeholder="Enter Name"
                        value={data.name}
                        onChange={e => data.setName(e.target.value)}
                        onBlur={e => data.saveProjectName()}
                        onKeyPress={e => {
                            if (e.key === "Enter") e.currentTarget.blur();
                        }} />
                </label>

                {/* mobile buttons */}
                <button className="c-button --secondary --sm md:!hidden"
                    onClick={() => props.setShowMobilePanel(true)}>
                    <IoColorPalette />
                </button>

                <section className="flex items-center">
                    {data.projectList.filter(p => p !== props.project.name).reverse().map((project) => (
                        <span key={project} className="c-token" onClick={() => props.loadProject(project)}>
                            {project}

                            <button className="c-button --danger --xs ml-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    data.deleteProject(project);
                                }}>
                                <ImCross />
                            </button>
                        </span>
                    ))}
                </section>
            </section>

            <section className="flex items-center"></section>
        </section>
    </>)
}

function useNav(props: IProps) {
    const modal = useModal();
    let [projectList, setProjectList] = useState<string[]>([]);
    let [name, setName] = useState<string>(props.project.name);

    useEffect(() => {
        let cachedList = JSON.parse(localStorage.getItem("moth-projects") ?? "[]");
        setProjectList(cachedList);
    }, []);

    useEffect(() => {
        setName(props.project.name);
    }, [props.project.name]);

    useEffect(() => {
        // save project locally
        const interval = setInterval(() => {
            let localProject = props.getProject();

            // if the project doesint have any changes yet dont save it
            if (localProject.frames?.length === 1 && localProject.frames[0].layers?.length === 1) {
                let anyNewPixels = localProject.frames[0].layers[0].image.data?.some(p => p !== 0);
                if (!anyNewPixels) return;
            }

            let currentProjectList = JSON.parse(localStorage.getItem("moth-projects") ?? "[]");
            if (!currentProjectList.includes(props.project.name)) {
                currentProjectList.push(props.project.name);
                localStorage.setItem("moth-projects", JSON.stringify(currentProjectList));
            }

            if (currentProjectList.length > 10) {
                let front = currentProjectList.shift();
                localStorage.removeItem(front);
                localStorage.setItem("moth-projects", JSON.stringify(currentProjectList));
            }

            let projectName = props.project.name.startsWith("moth-") ? props.project.name + " " : props.project.name;
            localStorage.setItem(projectName, JSON.stringify(localProject));
        }, 1000);
        return () => clearInterval(interval);
    }, [props.canvas, props.frames, props.project, props.colorPalettes]);

    function saveProjectName() {
        if (name === props.project.name) return;

        let currentProjectList = JSON.parse(localStorage.getItem("moth-projects") ?? "[]");
        let index = currentProjectList.indexOf(props.project.name);
        currentProjectList[index] = name;

        localStorage.setItem("moth-projects", JSON.stringify(currentProjectList));
        localStorage.removeItem(props.project.name);
        props.setProject({ ...props.project, name });

        setProjectList(currentProjectList);
    }

    function deleteProject(project: string) {
        if (!window.confirm("Are you sure you want to delete this project?")) return;

        let currentProjectList = JSON.parse(localStorage.getItem("moth-projects") ?? "[]");
        currentProjectList = currentProjectList.filter((p: string) => p !== project);
        let projectListWithoutCurrent = currentProjectList.filter((p: string) => p !== props.project.name);

        localStorage.setItem("moth-projects", JSON.stringify(currentProjectList));
        localStorage.removeItem(project);
        setProjectList(projectListWithoutCurrent);
    }

    async function importProject() {
        let [fileHandle] = await (window as any).showOpenFilePicker({
            types: [{ accept: { 'image/*': ['.png'] } }],
        });

        let file = await fileHandle.getFile();
        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = () => {
            let data = new Uint8Array(fileReader.result as ArrayBuffer);
            let chunks = pngExtract(data);

            const mothChunk = chunks.filter((chunk: any) => {
                return chunk.name === 'tEXt'
            }).map((chunk: any) => {
                return pngText.decode(chunk.data)
            }).filter((chunk: any) => {
                return chunk.keyword === "moth"
            })[0];

            if (mothChunk) props.setProject(JSON.parse(mothChunk.text));
        }
    }

    function exportProject(settings?: IExportSettings) {
        let height = props.canvas!.height;
        let width = (settings?.frameOnly || settings?.layerOnly) ?
            props.canvas!.width :
            props.canvas!.width * props.frames.length;
        let tempCanvas1 = document.createElement("canvas");
        let tempCtx1 = tempCanvas1.getContext("2d");
        tempCanvas1.height = height;
        tempCanvas1.width = width;

        let frames = (settings?.frameOnly || settings?.layerOnly) ?
            [props.activeFrame] : props.frames;

        frames.forEach((frame, i) => {
            let tempCanvas2 = document.createElement("canvas");
            let tempCtx2 = tempCanvas2.getContext("2d");
            tempCanvas2.height = props.canvas!.height;
            tempCanvas2.width = props.canvas!.width;

            let layersRevered = frame.layers.slice().reverse();
            let layers = (settings?.layerOnly) ? [props.activeLayer] : layersRevered;

            layers.forEach(layer => {
                let tempCanvas3 = document.createElement("canvas");
                let tempCtx3 = tempCanvas3.getContext("2d");
                tempCanvas3.height = props.canvas!.height;
                tempCanvas3.width = props.canvas!.width;

                tempCtx3?.putImageData(layer.image, 0, 0);
                tempCtx2?.drawImage(tempCanvas3, 0, 0);
            });

            tempCtx1?.drawImage(tempCanvas2, (i * props.canvas!.width), 0);
        });

        // get current project as png
        let tempPng = tempCanvas1!.toDataURL("image/png");
        let tempPngData = tempPng.replace(/^data:image\/(png|jpg);base64,/, "");
        let tempPngBuffer = pngBuffer.from(tempPngData, "base64");
        let data = new Uint8Array(tempPngBuffer.buffer);
        let chunks = pngExtract(data);

        // add meta data to png
        let project = props.getProject();
        chunks.splice(-1, 0, pngText.encode('moth', JSON.stringify(project)));

        // convert data to png
        let newBuffer = pngBuffer.from(pngEncode(chunks), 'base64');
        let blob = new Blob([newBuffer], { type: "image/png" });
        let url = URL.createObjectURL(blob);

        // download the image
        let anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = props.project.name;
        anchor.click();
    }

    return {
        name,
        modal,
        setName,
        projectList,
        deleteProject,
        exportProject,
        importProject,
        saveProjectName,
    }
}

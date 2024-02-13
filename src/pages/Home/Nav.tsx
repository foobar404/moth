import { Base64 } from 'js-base64';
import pngText from "png-chunk-text";
import { IProject } from '../../types';
import { HiStar } from "react-icons/hi";
import { ImCross } from "react-icons/im";
import { Modal } from "../../components";
import pngEncode from "png-chunks-encode";
import pngExtract from "png-chunks-extract";
import { Buffer as pngBuffer } from "buffer";
import { MdMovieFilter } from "react-icons/md";
import React, { useEffect, useState } from 'react';
import { useCanvas, useModal, useGlobalStore } from '../../utils';
import { IoImage, IoLayers, IoColorPalette } from "react-icons/io5";


interface IProps {
    loadProject: (projectName: string) => void;
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
                <section className="flex flex-wrap">
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
                </section>
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
                        value={data.projectName}
                        onChange={e => data.saveProjectName(e.target.value)} />
                </label>

                {/* mobile buttons */}
                <button className="c-button --secondary --sm md:!hidden"
                    onClick={() => props.setShowMobilePanel(true)}>
                    <IoColorPalette />
                </button>

                <section className="flex items-center">
                    {data.projectList.filter(p => p !== data.projectName).reverse().map((project) => (
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
    const canvas1 = useCanvas();
    const canvas2 = useCanvas();
    const canvas3 = useCanvas();
    const {
        projectName, setProjectName, frames, activeFrame,
        activeLayer, canvasSize, colorPalettes
    } = useGlobalStore();
    let [projectList, setProjectList] = useState<string[]>([]);

    useEffect(() => {
        let cachedList = JSON.parse(localStorage.getItem("moth-projects") ?? "[]");
        setProjectList(cachedList);
    }, []);

    // useEffect(() => {
    //     // save project locally
    //     const interval = setInterval(() => {
    //         let localProject = props.getProject();

    //         // if the project doesint have any changes yet dont save it
    //         if (localProject.frames?.length === 1 && localProject.frames[0].layers?.length === 1) {
    //             let anyNewPixels = localProject.frames[0].layers[0].image.data?.some(p => p !== 0);
    //             if (!anyNewPixels) return;
    //         }

    //         let currentProjectList = JSON.parse(localStorage.getItem("moth-projects") ?? "[]");
    //         if (!currentProjectList.includes(props.project.name)) {
    //             currentProjectList.push(props.project.name);
    //             localStorage.setItem("moth-projects", JSON.stringify(currentProjectList));
    //         }

    //         if (currentProjectList.length > 10) {
    //             let front = currentProjectList.shift();
    //             localStorage.removeItem(front);
    //             localStorage.setItem("moth-projects", JSON.stringify(currentProjectList));
    //         }

    //         let projectName = props.project.name.startsWith("moth-") ? props.project.name + " " : props.project.name;
    //         localStorage.setItem(projectName, JSON.stringify(localProject));
    //     }, 1000);
    //     return () => clearInterval(interval);
    // }, [props.frames, props.project, props.colorPalettes]);

    // function getProject(): IProject {
    // 	return {
    // 		name: project.name,
    // 		frames: frames,
    // 		colorPalettes: colorPalettes,
    // 		canvas: {
    // 			width: canvasSize.width,
    // 			height: canvasSize.height
    // 		}
    // 	}
    // }

    function getProject(): IProject {
        return {
            name: projectName,
            frames: frames,
            colorPalettes: colorPalettes,
            canvas: canvasSize
        };
    }

    function saveProjectName(name) {
        let currentProjectList = JSON.parse(localStorage.getItem("moth-projects") ?? "[]");
        let index = currentProjectList.indexOf(projectName);
        currentProjectList[index] = name;

        localStorage.setItem("moth-projects", JSON.stringify(currentProjectList));
        localStorage.removeItem(projectName);

        setProjectList(currentProjectList);
        setProjectName(name);
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
                return chunk.name === 'tEXt';
            }).map((chunk: any) => {
                return pngText.decode(chunk.data);
            }).filter((chunk: any) => {
                return chunk.keyword === "moth";
            })[0];

            if (mothChunk) {
                //! do something with this
                JSON.parse(Base64.decode(mothChunk.text));
            }
        }
    }

    function exportProject(settings?: IExportSettings) {
        let height = canvasSize.height;
        let width = (settings?.frameOnly || settings?.layerOnly) ?
            canvasSize.width :
            canvasSize.width * frames.length;
        canvas1.resize(width, height);

        let newFrames = (settings?.frameOnly || settings?.layerOnly) ?
            [activeFrame] : frames;

        newFrames.forEach((frame, i) => {
            canvas2.resize(canvasSize.width, canvasSize.height);

            let layersRevered = frame.layers.slice().reverse();
            let layers = (settings?.layerOnly) ? [activeLayer] : layersRevered;

            layers.forEach(layer => {
                canvas3.resize(canvasSize.width, canvasSize.height);

                canvas3.putImageData(layer.image);
                canvas2.drawImage(canvas3.getElement());
            });

            canvas1.drawImage(canvas2.getElement(), (i * canvasSize.width), 0);
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

    return {
        modal,
        projectName,
        projectList,
        deleteProject,
        exportProject,
        importProject,
        saveProjectName,
    }
}

import { FaBug } from "react-icons/fa";
import { IProject } from '../../types';
import { HiStar } from "react-icons/hi";
import { IoImage } from "react-icons/io5";
import { ModalExport } from "./ModalExport";
import { ModalImport } from "./ModalImport";
import React, { useEffect, useState } from 'react';
import { useModal, useGlobalStore, useSetInterval } from '../../utils';


export function Nav() {
    const data = useNav();

    return (<>
        <ModalExport {...data.modalExport} />
        <ModalImport {...data.modalImport} />
        <nav className="space-x-2 row-left !flex-nowrap w-max overflow-hidden h-full">
            <button aria-label="open import settings"
                onClick={() => data.modalImport.setIsOpen(true)}
                className="box-content py-1 btn btn-sm btn-primary">
                <IoImage className="text-2xl" />
                <span className="hidden sm:block">Open</span>
            </button>
            <button aria-label="open export settings"
                onClick={() => data.modalExport.setIsOpen(true)}
                className="box-content py-1 btn btn-sm btn-secondary">
                <HiStar className="text-2xl" />
                <span className="hidden sm:block">Save</span>
            </button>
            <a aria-label="report a bug with the moth bug form"
                data-tip="report a bug"
                data-for="tooltip"
                target="_blank"
                className="box-content py-1 btn btn-sm btn-warning"
                href={"https://forms.gle/pDXePJUoGSFnUBJF7"}>
                <FaBug className="text-lg" />
            </a>

            <select aria-label="themes list"
                className="select select-bordered"
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

            <input aria-label="project name"
                data-tip="project name"
                data-for="tooltip"
                type="text"
                placeholder="Enter Name"
                value={data.projectName}
                onKeyDown={e => e.stopPropagation()}
                className="input input-md input-bordered w-min min-w-[250px] hidden lg:block"
                onChange={e => data.saveProjectName(e.target.value)} />

            {/* <section className="fixed z-50 !hidden p-2 bottom-right lg:!block">
                {data.message && (
                    <div className="px-6 py-4 badge badge-info">
                        {data.message}
                    </div>
                )}
            </section> */}
        </nav>
    </>)
}


function useNav() {
    const { projectName, frames, canvasSize, colorPalettes, setProjectName } = useGlobalStore();
    const modalExport = useModal();
    const modalImport = useModal();

    let [theme, setTheme] = useState("light");
    let [message, setMessage] = useState("");

    // save project locally
    useSetInterval(() => {
        if (canvasSize.height >= 512 || canvasSize.width >= 512) {
            return setMessage("Storage Full");
        }

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
            setMessage(`Saved at: ${new Date().toLocaleTimeString()}`);
        }
        catch (e) {
            setMessage("Storage Full");
        }
    }, 20000, [projectName, frames, colorPalettes, canvasSize]);

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

    function changeTheme(themeName) {
        // update web app theme
        let root = document.documentElement;
        root.setAttribute("data-theme", themeName);
        localStorage.setItem("moth-theme", themeName);
        setTheme(themeName);

        // update PWA theme
        const newColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--p').trim();
        const metaThemeColor = document.querySelector('meta[name=theme-color]');
        metaThemeColor!.setAttribute("content", `oklch(${newColor})`);
    }

    return {
        theme,
        message,
        canvasSize,
        modalExport,
        modalImport,
        projectName,
        setTheme,
        changeTheme,
        saveProjectName,
    }
}
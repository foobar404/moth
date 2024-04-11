import tinycolor from "tinycolor2";
import { IColor } from "../../types";
import ReactTooltip from 'react-tooltip';
import { MdDelete } from "react-icons/md";
import { ChromePicker } from "react-color";
import { BiPlusMedical } from "react-icons/bi";
import React, { useEffect, useState } from 'react';
import { ModalColorPalettes } from "./ModalColorPalettes";
import { FaFileExport, FaFileImport } from "react-icons/fa";
import { useCanvas, useGlobalStore, useModal, useSetInterval, useShortcuts } from '../../utils';


export function Colors() {
    const data = useColors();

    return (<>
        <ModalColorPalettes {...data.modalColorPalettes} />
        <section className="mt-2">
            <div onKeyDown={e => e.stopPropagation()}>
                <ChromePicker
                    disableAlpha
                    className="!w-full !bg-base-100 !rounded-xl !shadow-xl border-4 border-accent overflow-hidden !box-border"
                    color={{ r: data.activeColor.r, g: data.activeColor.g, b: data.activeColor.b, a: Number((data.activeColor.a / 255).toFixed(2)) }}
                    onChange={(color: any) => data.setActiveColor({ r: color.rgb.r, g: color.rgb.g, b: color.rgb.b, a: Math.ceil(color.rgb.a * 255) })} />
            </div>

            <div data-tip="active / prev color toggle ( z )"
                data-for="tooltip"
                onClick={data.swapColors}
                className={`h-10 row rounded-lg overflow-hidden my-2 hover:scale-95 cursor-pointer`}>

                <div className="w-1/2 h-full" style={{ background: `${tinycolor(data.activeColor).toRgbString()}` }}></div>
                <div className="w-1/2 h-full" style={{ background: `${tinycolor(data.recentColors[1]).toRgbString()}` }}></div>
            </div>

            <nav className="my-2 p-app__color-controls !bg-accent">
                <div className="w-full space-x-1 row">
                    <button aria-label="import color palette"
                        data-tip="import color palette from lospec or file"
                        data-for="tooltip"
                        className="w-1/2 btn btn-xs"
                        onClick={() => data.modalColorPalettes.open()}>
                        <FaFileImport className="text-lg" />
                        Import
                    </button>
                    <button aria-label="export color palette"
                        data-tip="export color palette as .png"
                        data-for="tooltip"
                        className="w-1/2 btn btn-xs"
                        onClick={() => data.exportColorPalette()}>
                        <FaFileExport className="text-lg" />
                        Export
                    </button>
                </div>

                <div className="w-full space-x-1 row">
                    <button aria-label="add new color palette"
                        data-tip="add new pallete"
                        data-for="tooltip"
                        onClick={data.addNewColorPalette}
                        className="btn btn-xs">
                        <BiPlusMedical className="text-lg" />
                    </button>
                    <select aria-label="color palettes"
                        data-tip="color pallete selection"
                        data-for="tooltip"
                        className="w-1/3 select select-xs"
                        onChange={(e) => data.setColorPalette(Number(e.target.value))}
                        value={data.colorPalettes.findIndex(x => data.activeColorPalette.symbol === x.symbol)}>

                        {data.colorPalettes.map((colorPallete, i) => (
                            <option key={i} value={i}>{colorPallete.name}</option>
                        ))}
                    </select>

                    <input aria-label="color palette name"
                        type="text"
                        data-for="tooltip"
                        data-tip={`${data.activeColorPalette.name}`}
                        className="w-1/3 input input-xs"
                        value={data.activeColorPalette.name}
                        onKeyDown={e => e.stopPropagation()}
                        onChange={e => data.updatePaletteName(e.currentTarget.value)} />
                    <button aria-label="remove current color palette"
                        data-tip="remove current pallete"
                        data-for="tooltip"
                        className="btn btn-xs"
                        onClick={data.deleteColorPalette}>
                        <MdDelete className="text-lg" />
                    </button>
                </div>

                <div className="w-full space-x-1 row">
                    <button aria-label="add current color"
                        data-tip="add current color"
                        data-for="tooltip"
                        onClick={data.addColor}
                        className="btn btn-xs">
                        <BiPlusMedical className="text-lg" />
                    </button>

                    <select aria-label="color sorting"
                        data-tip="sort colors"
                        data-for="tooltip"
                        className="w-1/3 select select-xs"
                        value={data.colorState.sort}
                        onChange={e => data.setColorState(s => ({ ...s, sort: e.target.value as any }))}>
                        <option value="default">Default</option>
                        <option value="count">Most Used</option>
                        <option value="recent">Recently Used</option>
                        <option value="hue">Hue</option>
                    </select>

                    <select aria-label="color filtering"
                        className="w-1/3 select select-xs"
                        data-tip="filter colors"
                        data-for="tooltip"
                        value={data.colorState.filter}
                        onChange={e => data.setColorState(s => ({ ...s, filter: e.target.value as any }))}>
                        <option value="all">All Colors</option>
                        <option value="project">Project Colors</option>
                        <option value="frame">Frame Colors</option>
                        <option value="layer">Layer Colors</option>
                    </select>

                    <button aria-label="remove current color"
                        data-tip="remove current color"
                        data-for="tooltip"
                        onClick={data.deleteColor}
                        className="btn btn-xs">
                        <MdDelete className="text-lg" />
                    </button>
                </div>
            </nav>

            <section className="flex-wrap row">
                {data.visibleColors.map((c: IColor, i) => (
                    <div key={i}
                        data-for="tooltip"
                        onClick={() => data.setActiveColor(c)}
                        data-tip={`${tinycolor(c).toHexString()}`}
                        style={{ background: `${tinycolor(c).toHexString()}` }}
                        className={`hover:scale-105 overflow-hidden box-content row cursor-pointer h-7 w-7 rounded shadow-xl mr-1 mb-1 border-4 border-transparent ${JSON.stringify(c) === JSON.stringify(data.activeColor) ? "border-base-content" : ""}`}>
                        <span className="text-xs" style={{ color: `${data.getTextColor(c)}`, fontSize: "9px" }}>
                            {data.colorStats[`rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`]?.count ?? 0}
                        </span>
                    </div>
                ))}
            </section>
        </section>
    </>)
}


function useColors() {
    const {
        colorStats, setColorStats, colorPalettes, setColorPalettes, activeColorPalette,
        setActiveColorPalette, activeColor, frames, activeFrame, activeLayer, setActiveColor,
    } = useGlobalStore();
    const modalColorPalettes = useModal();
    const canvas1 = useCanvas({ offscreen: true });
    const recentColors = sortColorsByMostRecent(activeColorPalette.colors);

    let [visibleColors, setVisibleColors] = useState<IColor[]>(activeColorPalette.colors);
    let [colorState, setColorState] = useState<{ filter: "all" | "project" | "frame" | "layer", sort: "default" | "hue" | "recent" | "count" }>({
        filter: "all",
        sort: "default"
    });

    useShortcuts({
        // "z": swapColors
    });

    useEffect(() => {
        ReactTooltip.rebuild();
    }, [visibleColors]);

    // adjust visible colors
    useEffect(() => {
        let colors = visibleColors

        if (colorState.filter === "all") colors = showColorsInPalette();
        if (colorState.filter === "project") colors = showColorsInProject();
        if (colorState.filter === "frame") colors = showColorsInFrame();
        if (colorState.filter === "layer") colors = showColorsInLayer();

        if (colorState.sort === "hue") colors = sortColorsByHue(colors);
        if (colorState.sort === "recent") colors = sortColorsByMostRecent(colors);
        if (colorState.sort === "count") colors = sortColorsByMostUsed(colors);

        setVisibleColors(colors);
    }, [activeColorPalette, activeColor, colorState, colorStats]);

    // update color stats
    useEffect(() => {
        let statsCopy = { ...colorStats };
        let colorString = tinycolor(activeColor).toRgbString();

        if (statsCopy[colorString])
            statsCopy[colorString].lastUsed = Date.now();
        else
            statsCopy[colorString] = { count: 0, lastUsed: Date.now() };

        setColorStats(statsCopy);
    }, [activeColor]);

    // update color stats
    useSetInterval(() => {
        let statsCopy = { ...colorStats };

        for (let key in statsCopy) {
            statsCopy[key].count = 0;
        }

        frames.forEach(({ layers }) => {
            layers.forEach(({ image }) => {
                const data = new Uint32Array(image.data.buffer);
                for (let i = 0; i < data.length; i++) {
                    const color = data[i];
                    const r = color & 0xFF;
                    const g = (color >>> 8) & 0xFF;
                    const b = (color >>> 16) & 0xFF;
                    const a = (color >>> 24) & 0xFF;
                    const colorKey = `rgba(${r}, ${g}, ${b}, ${a})`;

                    if (a === 0) continue;

                    if (!statsCopy[colorKey]) {
                        statsCopy[colorKey] = { count: 1, lastUsed: 0 };
                    } else {
                        statsCopy[colorKey].count++;
                    }
                }
            });
        });

        setColorStats(statsCopy);
    }, 3000, [frames, colorStats]);

    function deleteColor() {
        let colors = activeColorPalette.colors.filter(c => JSON.stringify(c) !== JSON.stringify(activeColor));
        activeColorPalette.colors = colors;
        setActiveColorPalette({ ...activeColorPalette });
    }

    function addColor() {
        if (!activeColorPalette.colors.find(c => JSON.stringify(c) === JSON.stringify(activeColor))) {
            let newColors = [...activeColorPalette.colors, activeColor];
            setActiveColorPalette({ ...activeColorPalette, colors: newColors });
            setColorState({ ...colorState, filter: "all" });
        }
    }

    function updatePaletteName(name: string) {
        let palette = colorPalettes.find(p => p.symbol === activeColorPalette.symbol);
        palette!.name = name;

        setColorPalettes([...colorPalettes]);
        setActiveColorPalette(palette!);
    }

    function addNewColorPalette() {
        let name = window.prompt("Enter a name for the new palette.");
        let newPalette = {
            name: name ?? "",
            colors: [{ r: 0, g: 0, b: 0, a: 255 }],
            symbol: Symbol()
        };

        setColorPalettes([...colorPalettes, newPalette]);
        setActiveColorPalette(newPalette);
    }

    function deleteColorPalette() {
        if (!window.confirm("Are you sure you want to delete this color palette?")) return;
        if (colorPalettes.length <= 1) return;

        let newColorPalettes = colorPalettes.filter(p => p.symbol !== activeColorPalette.symbol);
        setColorPalettes(newColorPalettes);
        setActiveColorPalette(newColorPalettes[0]);
    }

    function setColorPalette(colorPalleteIndex: number) {
        setActiveColorPalette({ ...colorPalettes[colorPalleteIndex] });
    }

    function showColorsInPalette() {
        return activeColorPalette.colors;
    }

    function showColorsInProject() {
        let allColors: { [color: string]: boolean } = {};

        frames.forEach(frame => {
            frame.layers.forEach(layer => {
                for (let i = 0; i < layer.image.data.length; i += 4) {
                    let r = layer.image.data[i];
                    let g = layer.image.data[i + 1];
                    let b = layer.image.data[i + 2];
                    let a = layer.image.data[i + 3];
                    let colorString = `${r},${g},${b},${a}`;
                    allColors[colorString] = true;
                }
            });
        });

        let colors = activeColorPalette.colors.filter(color => {
            let colorString = `${color.r},${color.g},${color.b},${color.a}`;
            return allColors[colorString];
        });

        return colors;
    }

    function showColorsInFrame() {
        let allColors: { [color: string]: boolean } = {};

        activeFrame.layers.forEach(layer => {
            for (let i = 0; i < layer.image.data.length; i += 4) {
                let r = layer.image.data[i];
                let g = layer.image.data[i + 1];
                let b = layer.image.data[i + 2];
                let a = layer.image.data[i + 3];
                let colorString = `${r},${g},${b},${a}`;
                allColors[colorString] = true;
            }
        });

        let colors = activeColorPalette.colors.filter(color => {
            let colorString = `${color.r},${color.g},${color.b},${color.a}`;
            return allColors[colorString];
        });

        return colors;
    }

    function showColorsInLayer() {
        let allColors: { [color: string]: boolean } = {};

        for (let i = 0; i < activeLayer.image.data.length; i += 4) {
            let r = activeLayer.image.data[i];
            let g = activeLayer.image.data[i + 1];
            let b = activeLayer.image.data[i + 2];
            let a = activeLayer.image.data[i + 3];
            let colorString = `${r},${g},${b},${a}`;
            allColors[colorString] = true;
        }

        let colors = activeColorPalette.colors.filter(color => {
            let colorString = `${color.r},${color.g},${color.b},${color.a}`;
            return allColors[colorString];
        });

        return colors;
    }

    function sortColorsByMostUsed(colors: IColor[]) {
        let newColors = [...colors].sort((a, b) => {
            let colorString = tinycolor(a).toRgbString();
            let colorString2 = tinycolor(b).toRgbString();

            return (colorStats[colorString2]?.count ?? 0) - (colorStats[colorString]?.count ?? 0);
        });

        return newColors;
    }

    function sortColorsByMostRecent(colors: IColor[]) {
        let newColors = [...colors].sort((a, b) => {
            let colorString = tinycolor(a).toRgbString();
            let colorString2 = tinycolor(b).toRgbString();

            if (colorStats[colorString2]?.lastUsed && !colorStats[colorString]?.lastUsed) return 1;
            if (!colorStats[colorString2]?.lastUsed && colorStats[colorString]?.lastUsed) return -1;

            return (colorStats[colorString2]?.lastUsed ?? 0) > (colorStats[colorString]?.lastUsed ?? 0) ? 1 : -1;
        });

        return newColors;
    }

    function sortColorsByHue(colors: IColor[]) {
        return [...colors].sort((a, b) => {
            let hslA = tinycolor(a).toHsl();
            let hslB = tinycolor(b).toHsl();

            if (hslA.h !== hslB.h) {
                return hslA.h - hslB.h;
            }

            if (hslA.s !== hslB.s) {
                return hslA.s - hslB.s;
            }

            return hslA.l - hslB.l;
        });
    }

    function getTextColor(backgroundColor) {
        const color = tinycolor(backgroundColor);
        const brightness = color.getBrightness();

        return brightness > 200 ? "#000000" : "#FFFFFF";
    }

    function swapColors() {
        let colors = sortColorsByMostRecent(activeColorPalette.colors);
        setActiveColor(colors[1] ?? activeColor);
        setColorStats({
            ...colorStats,
            [tinycolor(colors[1]).toRgbString()]: {
                count: colorStats[tinycolor(colors[1]).toRgbString()].count,
                lastUsed: Date.now()
            }
        });
    }

    function exportColorPalette() {
        let size = 40;
        let rowMax = 10;
        let width = Math.min(rowMax * size, activeColorPalette.colors.length * size);
        let height = Math.floor(activeColorPalette.colors.length / rowMax) * size + size;

        canvas1.resize(width, height);

        activeColorPalette.colors.forEach((color, i) => {
            let x = i % 10;
            let y = Math.floor(i / 10);

            canvas1.drawPixel(x * size, y * size, size, color);
        });

        let url = canvas1.toDataURL();
        let a = document.createElement("a");
        a.href = url;
        a.download = `${activeColorPalette.name}.png`;
        a.click();
    }

    return {
        colorStats,
        colorState,
        activeColor,
        recentColors,
        visibleColors,
        colorPalettes,
        activeColorPalette,
        modalColorPalettes,
        addColor,
        swapColors,
        getTextColor,
        deleteColor,
        setColorState,
        setActiveColor,
        setColorPalette,
        sortColorsByHue,
        showColorsInLayer,
        showColorsInFrame,
        exportColorPalette,
        updatePaletteName,
        addNewColorPalette,
        deleteColorPalette,
        showColorsInProject,
        showColorsInPalette,
        sortColorsByMostUsed,
        setActiveColorPalette,
        sortColorsByMostRecent,
    };
}


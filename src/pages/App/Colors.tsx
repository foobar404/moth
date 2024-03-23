import { IColor } from "../../types";
import ReactTooltip from 'react-tooltip';
import { MdDelete } from "react-icons/md";
import { ChromePicker } from "react-color";
import { useGlobalStore } from '../../utils';
import { BiPlusMedical } from "react-icons/bi";
import React, { useEffect, useState } from 'react';


export function Colors() {
    const data = useColors();

    return (
        <section className="mt-2">

            <div onKeyDown={e => e.stopPropagation()}>
                <ChromePicker
                    disableAlpha
                    className="!w-full !bg-base-100 !rounded-xl !shadow-xl border-4 border-accent overflow-hidden !box-border"
                    color={{ r: data.activeColor.r, g: data.activeColor.g, b: data.activeColor.b, a: Number((data.activeColor.a / 255).toFixed(2)) }}
                    onChange={(color: any) => data.setActiveColor({ r: color.rgb.r, g: color.rgb.g, b: color.rgb.b, a: Math.ceil(color.rgb.a * 255) })} />
            </div>

            <nav className="my-2 p-app__color-controls !bg-accent">
                <div className="w-full space-x-1 row">
                    <button data-tip="add new pallete"
                        data-for="tooltip"
                        onClick={data.addNewColorPalette}
                        className="btn btn-xs">
                        <BiPlusMedical className="text-lg" />
                    </button>
                    <select data-tip="color pallete selection"
                        data-for="tooltip"
                        className="w-1/3 select select-xs"
                        onChange={(e) => data.setColorPalette(Number(e.target.value))}
                        value={data.colorPalettes.findIndex(x => data.activeColorPalette.symbol === x.symbol)}>

                        {data.colorPalettes.map((colorPallete, i) => (
                            <option key={i} value={i}>{colorPallete.name}</option>
                        ))}
                    </select>

                    <input type="text"
                        data-for="tooltip"
                        data-tip="color pallete name"
                        className="w-1/3 input input-xs"
                        value={data.activeColorPalette.name}
                        onKeyDown={e => e.stopPropagation()}
                        onChange={e => data.updatePaletteName(e.currentTarget.value)} />
                    <button data-tip="remove current pallete"
                        data-for="tooltip"
                        className="btn btn-xs"
                        onClick={data.deleteColorPalette}>
                        <MdDelete className="text-lg" />
                    </button>
                </div>

                <div className="w-full space-x-1 row">
                    <button data-tip="add current color"
                        data-for="tooltip"
                        onClick={data.addColor}
                        className="btn btn-xs">
                        <BiPlusMedical className="text-lg" />
                    </button>

                    <select data-tip="sort colors"
                        data-for="tooltip"
                        className="w-1/3 select select-xs"
                        value={data.colorState.sort}
                        onChange={e => data.setColorState(s => ({ ...s, sort: e.target.value as any }))}>
                        <option value="default">Default</option>
                        <option value="count">Most Used</option>
                        <option value="recent">Recently Used</option>
                        <option value="hue">Hue</option>
                    </select>

                    <select className="w-1/3 select select-xs"
                        data-tip="filter colors"
                        data-for="tooltip"
                        value={data.colorState.filter}
                        onChange={e => data.setColorState(s => ({ ...s, filter: e.target.value as any }))}>
                        <option value="all">All Colors</option>
                        <option value="project">Project Colors</option>
                        <option value="frame">Frame Colors</option>
                        <option value="layer">Layer Colors</option>
                    </select>

                    <button data-tip="remove current color"
                        data-for="tooltip"
                        onClick={data.deleteColor}
                        className="btn btn-xs">
                        <MdDelete className="text-lg" />
                    </button>
                </div>
            </nav>

            <section className="flex-wrap row">
                {data.visibleColors.map((color: IColor, i) => (
                    <div key={i}
                        data-for="tooltip"
                        onClick={() => data.setActiveColor(color)}
                        data-tip={`rgba(${color.r}, ${color.g}, ${color.b}, ${Number((color.a / 255).toFixed(2))})`}
                        style={{ background: `rgba(${color.r}, ${color.g}, ${color.b}, ${(color.a / 255).toFixed(2)})` }}
                        className={`hover:scale-105 cursor-pointer h-8 w-8 rounded shadow-xl mr-1 mb-1 ${JSON.stringify(color) === JSON.stringify(data.activeColor) ? "border-2 border-black" : ""}`}>
                    </div>
                ))}
            </section>
        </section>
    )
}


function useColors() {
    const {
        colorStats, colorPalettes, setColorPalettes, activeColorPalette,
        setActiveColorPalette, activeColor, frames, activeFrame, activeLayer,
        setActiveColor,
    } = useGlobalStore();
    let [visibleColors, setVisibleColors] = useState<IColor[]>(activeColorPalette.colors);
    let [colorState, setColorState] = useState<{ filter: "all" | "project" | "frame" | "layer", sort: "default" | "hue" | "recent" | "count" }>({
        filter: "all",
        sort: "default"
    });

    useEffect(() => {
        ReactTooltip.rebuild();
    }, [activeColorPalette]);

    useEffect(() => {
        let colors = visibleColors
        if (colorState.filter === "all") colors = showColorsInPalette();
        if (colorState.filter === "project") colors = showColorsInProject();
        if (colorState.filter === "frame") colors = showColorsInFrame();
        if (colorState.filter === "layer") colors = showColorsInLayer();

        if (colorState.sort === "hue") sortColorsByHue(colors);
        if (colorState.sort === "recent") sortColorsByMostRecent(colors);
        if (colorState.sort === "count") sortColorsByMostUsed(colors);
        if (colorState.sort === "default") sortColorsByDefault(colors);
    }, [activeColorPalette, activeColor, colorState, colorStats]);

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
        setVisibleColors(activeColorPalette.colors);

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

        setVisibleColors(colors);

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

        setVisibleColors(colors);

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

        setVisibleColors(colors);

        return colors;
    }

    function sortColorsByMostUsed(colors: IColor[]) {
        let newColors = [...colors].sort((a, b) => {
            let colorString = `${a.r},${a.g},${a.b},${a.a}`;
            let colorString2 = `${b.r},${b.g},${b.b},${b.a}`;

            return (colorStats[colorString2]?.count ?? 0) - (colorStats[colorString]?.count ?? 0);
        });

        setVisibleColors(newColors);
        return newColors;
    }

    function sortColorsByMostRecent(colors: IColor[]) {
        let newColors = [...colors].sort((a, b) => {
            let colorString = `${a.r},${a.g},${a.b},${a.a}`;
            let colorString2: string = `${b.r},${b.g},${b.b},${b.a}`;

            if (colorStats[colorString2]?.lastUsed && !colorStats[colorString]?.lastUsed) return 1;
            if (!colorStats[colorString2]?.lastUsed && colorStats[colorString]?.lastUsed) return -1;

            return (colorStats[colorString2]?.lastUsed ?? colorString2) > (colorStats[colorString]?.lastUsed ?? colorString) ? 1 : -1;
        });

        setVisibleColors(newColors);
        return newColors;
    }

    function sortColorsByHue(colors: IColor[]) {
        let newColors = [...colors].sort((a, b) => {
            let [h1, s1, l1] = rgbToHsl(a.r, a.g, a.b);
            let [h2, s2, l2] = rgbToHsl(b.r, b.g, b.b);

            return (h1 + (s1 * .1) + (l1 * .3)) - (h2 + (s2 * .1) + (l2 * .3));
        });

        setVisibleColors(newColors);
        return newColors;
    }

    function sortColorsByDefault(colors) {
        setVisibleColors(colors);

        return colors;
    }

    function rgbToHsl(r: number, g: number, b: number) {
        r /= 255;
        g /= 255;
        b /= 255;
        const l = Math.max(r, g, b);
        const s = l - Math.min(r, g, b);
        const h = s
            ? l === r
                ? (g - b) / s
                : l === g
                    ? 2 + (b - r) / s
                    : 4 + (r - g) / s
            : 0;
        return [
            60 * h < 0 ? 60 * h + 360 : 60 * h,
            100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
            (100 * (2 * l - s)) / 2,
        ];
    };

    return {
        activeColor,
        setActiveColor,
        colorPalettes,
        activeColorPalette,
        setActiveColorPalette,
        addColor,
        colorState,
        deleteColor,
        visibleColors,
        setColorState,
        setColorPalette,
        sortColorsByHue,
        showColorsInLayer,
        showColorsInFrame,
        updatePaletteName,
        addNewColorPalette,
        deleteColorPalette,
        showColorsInProject,
        showColorsInPalette,
        sortColorsByMostUsed,
        sortColorsByMostRecent,
    };
}


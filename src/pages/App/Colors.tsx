import { IColor, IColorPalette } from "../../types";
import ReactTooltip from 'react-tooltip';
import { useGlobalStore } from '../../utils';
import { BsTrophyFill } from "react-icons/bs";
import { BiPlusMedical } from "react-icons/bi";
import { HiColorSwatch } from "react-icons/hi";
import { MdMovieFilter } from "react-icons/md";
import React, { useEffect, useState } from 'react';
import { IoImage, IoLayers } from "react-icons/io5";
import { Popover, ColorPicker } from "../../components/";
import { FaSortAlphaDown, FaFilter } from "react-icons/fa";
import { MdDelete, MdAccessTimeFilled } from "react-icons/md";


export function Colors() {
    const data = useColors();

    return (
        <section>
            <ColorPicker
                onChange={(color: IColor) => data.setActiveColor({ r: color.r, g: color.g, b: color.b, a: Math.ceil(color.a * 255) })}
                color={{ r: data.activeColor.r, g: data.activeColor.g, b: data.activeColor.b, a: Number((data.activeColor.a / 255).toFixed(4)) }} />

            <nav className="my-2 p-app__color-controls">
                <div className="w-full row">
                    <select data-tip="color pallete selection"
                        data-for="tooltip"
                        className="w-1/2 select select-xs"
                        onChange={(e) => data.setColorPalette(Number(e.target.value))}
                        value={data.colorPalettes.findIndex(x => data.activeColorPalette.symbol === x.symbol)}>

                        {data.colorPalettes.map((colorPallete, i) => (
                            <option key={i} value={i}>{colorPallete.name}</option>
                        ))}
                    </select>

                    <input type="text"
                        data-for="tooltip"
                        data-tip="color pallete name"
                        className="w-1/2 input input-xs"
                        value={data.activeColorPalette.name}
                        onChange={e => data.updatePaletteName(e.currentTarget.value)} />
                </div>

                <button data-tip="add new pallete"
                    data-for="tooltip"
                    onClick={data.addNewColorPalette}
                    className="btn btn-xs">
                    <BiPlusMedical className="text-lg" />
                </button>

                <button data-tip="remove current pallete"
                    data-for="tooltip"
                    onClick={data.deleteColorPalette}
                    className="btn btn-xs">
                    <MdDelete className="text-lg" />
                </button>

                <button data-tip="add current color"
                    data-for="tooltip"
                    onClick={data.addColor}
                    className="btn btn-xs">
                    <BiPlusMedical className="text-lg" />
                </button>

                <Popover>
                    <button data-tip="sort colors"
                        data-for="tooltip"
                        className="btn btn-xs">
                        <FaSortAlphaDown />
                    </button>

                    <section className="flex flex-col gap-2">
                        <button className={`c-button --second --slim ${data.colorState.sort === "count" ? "--active-fourth" : ""}`}
                            onClick={() => data.sortColorsByMostUsed()}>
                            <BsTrophyFill className="c-button__icon" />
                            Most Used
                        </button>
                        <button className={`c-button --second --slim ${data.colorState.sort === "recent" ? "--active-fourth" : ""}`}
                            onClick={() => data.sortColorsByMostRecent()}>
                            <MdAccessTimeFilled className="c-button__icon" />
                            Recently Used
                        </button>
                        <button className={`c-button --second --slim ${data.colorState.sort === "hue" ? "--active-fourth" : ""}`}
                            onClick={() => data.sortColorsByHue()}>
                            <HiColorSwatch className="c-button__icon" />
                            Hue
                        </button>
                    </section>
                </Popover>

                <Popover>
                    <button data-tip="filter colors"
                        data-for="tooltip"
                        className="btn btn-xs">
                        <FaFilter />
                    </button>

                    <section className="flex flex-col gap-2">
                        <button className={`c-button --second --slim ${data.colorState.filter === "all" ? "--active-fourth" : ""}`}
                            onClick={data.showColorsInPalette}>
                            <HiColorSwatch className="c-button__icon" />
                            All Colors
                        </button>
                        <button className={`c-button --second --slim ${data.colorState.filter === "project" ? "--active-fourth" : ""}`}
                            onClick={data.showColorsInProject}>
                            <MdMovieFilter className="c-button__icon" />
                            Project Colors
                        </button>
                        <button className={`c-button --second --slim ${data.colorState.filter === "frame" ? "--active-fourth" : ""}`}
                            onClick={data.showColorsInFrame}>
                            <IoImage className="c-button__icon" />
                            Frame Colors
                        </button>
                        <button className={`c-button --second --slim ${data.colorState.filter === "layer" ? "--active-fourth" : ""}`}
                            onClick={data.showColorsInLayer}>
                            <IoLayers className="c-button__icon" />
                            Layer Colors
                        </button>
                    </section>
                </Popover>

                <button data-tip="remove current color"
                    data-for="tooltip"
                    onClick={data.deleteColor}
                    className="btn btn-xs">
                    <MdDelete className="text-lg" />
                </button>
            </nav>

            <section className="flex-wrap row-left">
                {data.visibleColors.map((color: IColor, i) => (
                    <div key={i}
                        data-for="tooltip"
                        onClick={() => data.setActiveColor(color)}
                        data-tip={`rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`}
                        style={{
                            background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a / 255})`
                        }}
                        className={`h-8 w-8 rounded mr-1 mb-1 ${JSON.stringify(color) === JSON.stringify(data.activeColor) ? "border-2 border-black" : ""}`}>
                    </div>
                ))}
            </section>

            {/* <section className="p-app__color-swatch">
                {data.mostRecentColors.map((_, i) => {
                    let index = data.mostRecentColors.length - 1 - i;
                    let recentColor = data.mostRecentColors[index];

                    return (
                        <div key={index}
                            className="p-app__color-swatch-layer"
                            onClick={() => setActiveColor(recentColor)}
                            style={{
                                background: `rgb(${recentColor.r}, ${recentColor.g}, ${recentColor.b})`
                            }}>
                        </div>
                    )
                })}
            </section> */}
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
    let [colorState, setColorState] = useState<{ filter: "all" | "project" | "frame" | "layer", sort: "hue" | "recent" | "count" }>({
        filter: "all",
        sort: "recent"
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
    }, [activeColorPalette, activeColor]);

    function deleteColor() {
        if (!window.confirm("Are you sure you want to delete this color?")) return;

        let colors = activeColorPalette.colors.filter(c => JSON.stringify(c) !== JSON.stringify(activeColor));
        activeColorPalette.colors = colors;
        setActiveColorPalette({ ...activeColorPalette });
    }

    function addColor() {
        if (!activeColorPalette.colors.find(c => JSON.stringify(c) === JSON.stringify(activeColor))) {
            let newColors = [...activeColorPalette.colors, activeColor];
            setActiveColorPalette({ ...activeColorPalette, colors: newColors });
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
        setColorState(s => ({ ...s, filter: "all" }));

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
        setColorState(s => ({ ...s, filter: "project" }));

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
        setColorState(s => ({ ...s, filter: "frame" }));

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
        setColorState(s => ({ ...s, filter: "layer" }));

        return colors;
    }

    function sortColorsByMostUsed(colorOverride?: IColor[]) {
        let colors = [...(colorOverride ?? visibleColors)].sort((a, b) => {
            let colorString = `${a.r},${a.g},${a.b},${a.a}`;
            let colorString2 = `${b.r},${b.g},${b.b},${b.a}`;

            return (colorStats[colorString2]?.count ?? 0) - (colorStats[colorString]?.count ?? 0);
        });

        setVisibleColors(colors);
        setColorState(s => ({ ...s, sort: "count" }));

        return colors;
    }

    function sortColorsByMostRecent(colorOverride?: IColor[]) {
        let colors = [...(colorOverride ?? visibleColors)].sort((a, b) => {
            let colorString = `${a.r},${a.g},${a.b},${a.a}`;
            let colorString2: string = `${b.r},${b.g},${b.b},${b.a}`;

            if (colorStats[colorString2]?.lastUsed && !colorStats[colorString]?.lastUsed) return 1;
            if (!colorStats[colorString2]?.lastUsed && colorStats[colorString]?.lastUsed) return -1;

            return (colorStats[colorString2]?.lastUsed ?? colorString2) > (colorStats[colorString]?.lastUsed ?? colorString) ? 1 : -1;
        });

        setVisibleColors(colors);
        setColorState(s => ({ ...s, sort: "recent" }));

        return colors;
    }

    function sortColorsByHue(colorOverride?: IColor[]) {
        let colors = [...(colorOverride ?? visibleColors)].sort((a, b) => {
            let [h1, s1, l1] = rgbToHsl(a.r, a.g, a.b);
            let [h2, s2, l2] = rgbToHsl(b.r, b.g, b.b);

            return (h1 + (s1 * .1) + (l1 * .3)) - (h2 + (s2 * .1) + (l2 * .3));
        });

        setVisibleColors(colors);
        setColorState(s => ({ ...s, sort: "hue" }));

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


import ReactTooltip from 'react-tooltip';
import { HiColorSwatch } from "react-icons/hi";
import { BsTrophyFill } from "react-icons/bs";
import { BiPlusMedical } from "react-icons/bi";
import { MdMovieFilter } from "react-icons/md";
import React, { useEffect, useState } from 'react';
import { IoImage, IoLayers } from "react-icons/io5";
import { Popover, ColorPicker } from "../../components/";
import { FaSortAlphaDown, FaFilter } from "react-icons/fa";
import { MdDelete, MdAccessTimeFilled } from "react-icons/md";
import { IColorPallete, IColor, IColorStats, IFrame, ILayer } from "./";


interface IProps {
    frames: IFrame[];
    activeColor: IColor;
    activeFrame: IFrame;
    activeLayer: ILayer;
    colorStats: IColorStats;
    colorPalettes: IColorPallete[];
    activeColorPallete: IColorPallete;
    setActiveColor: (color: IColor) => void;
    setColorPalettes: (colorPalettes: IColorPallete[] | any) => void;
    setActiveColorPallete: (colorPallete: IColorPallete | any, colorPalettesOverride?: IColorPallete[]) => void;
}

export function Colors(props: IProps) {
    const data = useColors(props);

    return (
        <section>
            <ColorPicker
                onChange={(color: IColor) => props.setActiveColor({ r: color.r, g: color.g, b: color.b, a: Math.ceil(color.a * 255) })}
                color={{ r: props.activeColor.r, g: props.activeColor.g, b: props.activeColor.b, a: Number((props.activeColor.a / 255).toFixed(4)) }} />

            <div className="mb-2"></div>

            <nav className="p-app__color-controls mb-2">
                <input type="text"
                    data-for="tooltip"
                    data-tip="color pallete name"
                    className="c-input --xs"
                    style={{ width: '58%' }}
                    value={props.activeColorPallete.name}
                    onChange={e => data.updatePaletteName(e.currentTarget.value)} />

                <select data-tip="color pallete selection"
                    data-for="tooltip"
                    className="c-input --xs --wide"
                    onChange={(e) => data.setColorPalette(Number(e.target.value))}
                    style={{ width: "30px" }}>

                    {props.colorPalettes.map((colorPallete, i) => (
                        <option key={i} value={i}>{colorPallete.name}</option>
                    ))}
                </select>

                <button data-tip="add new pallete"
                    data-for="tooltip"
                    onClick={data.addNewColorPalette}
                    className="c-button --xs --fourth">
                    <BiPlusMedical />
                </button>

                <button data-tip="remove current pallete"
                    data-for="tooltip"
                    onClick={data.deleteColorPalette}
                    className="c-button --xs --fourth">
                    <MdDelete />
                </button>

                <button data-tip="add current color"
                    data-for="tooltip"
                    onClick={data.addColor}
                    className="c-button --xs --fourth">
                    <BiPlusMedical />
                </button>

                <Popover>
                    <button data-tip="sort colors"
                        data-for="tooltip"
                        className="c-button --xs --fourth">
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
                        className="c-button --xs --fourth">
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
                    className="c-button --xs --fourth">
                    <MdDelete />
                </button>
            </nav>

            <section className="p-app__color-box mt-2">
                {data.visibleColors.map((color: IColor, i) => (
                    <div data-tip={`rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`}
                        data-for="tooltip"
                        className={`p-app__color c-color-card mb-1 mr-1 ${JSON.stringify(color) === JSON.stringify(props.activeColor) ? "--active" : ""}`}
                        onClick={() => props.setActiveColor(color)}
                        key={i}
                        style={{
                            background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a / 255})`
                        }}>
                    </div>
                ))}
            </section>
        </section>
    )
}

function useColors(props: IProps) {
    let [visibleColors, setVisibleColors] = useState<IColor[]>(props.activeColorPallete.colors);
    let [colorState, setColorState] = useState<{ filter: "all" | "project" | "frame" | "layer", sort: "hue" | "recent" | "count" }>({
        filter: "all",
        sort: "recent"
    });

    useEffect(() => {
        ReactTooltip.rebuild();
    }, [props.activeColorPallete]);

    useEffect(() => {
        let colors = visibleColors
        if (colorState.filter === "all") colors = showColorsInPalette();
        if (colorState.filter === "project") colors = showColorsInProject();
        if (colorState.filter === "frame") colors = showColorsInFrame();
        if (colorState.filter === "layer") colors = showColorsInLayer();

        if (colorState.sort === "hue") sortColorsByHue(colors);
        if (colorState.sort === "recent") sortColorsByMostRecent(colors);
        if (colorState.sort === "count") sortColorsByMostUsed(colors);
    }, [props.activeColorPallete, props.activeColor]);

    function deleteColor() {
        if (!window.confirm("Are you sure you want to delete this color?")) return;

        let colors = props.activeColorPallete.colors.filter(c => JSON.stringify(c) !== JSON.stringify(props.activeColor));
        props.activeColorPallete.colors = colors;
        props.setActiveColorPallete({ ...props.activeColorPallete });
    }

    function addColor() {
        props.activeColorPallete.colors.push(props.activeColor);
        props.setActiveColorPallete({ ...props.activeColorPallete });
    }

    function updatePaletteName(name: string) {
        let palette = props.colorPalettes.find(p => p.symbol === props.activeColorPallete.symbol);
        if (!palette) return;

        palette.name = name;
        props.setColorPalettes([...props.colorPalettes]);
    }

    function addNewColorPalette() {
        let name = window.prompt("Enter a name for the new palette.");
        let newPalette = {
            name: name,
            colors: [{ r: 0, g: 0, b: 0, a: 255 }],
            symbol: Symbol()
        };

        props.setColorPalettes((p: IColorPallete[]) => [...p, newPalette]);
        props.setActiveColorPallete(newPalette);
    }

    function deleteColorPalette() {
        if (!window.confirm("Are you sure you want to delete this color palette?")) return;
        if (props.colorPalettes.length <= 1) return;

        let colorPalettes = props.colorPalettes.filter(p => p.symbol !== props.activeColorPallete.symbol);
        props.setColorPalettes(colorPalettes);
        props.setActiveColorPallete(colorPalettes[0], colorPalettes);
    }

    function setColorPalette(colorPalleteIndex: number) {
        props.setActiveColorPallete({ ...props.colorPalettes[colorPalleteIndex] });
    }

    function showColorsInPalette() {
        setVisibleColors(props.activeColorPallete.colors);
        setColorState(s => ({ ...s, filter: "all" }));

        return props.activeColorPallete.colors;
    }

    function showColorsInProject() {
        let allColors: { [color: string]: boolean } = {};

        props.frames.forEach(frame => {
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

        let colors = props.activeColorPallete.colors.filter(color => {
            let colorString = `${color.r},${color.g},${color.b},${color.a}`;
            return allColors[colorString];
        });

        setVisibleColors(colors);
        setColorState(s => ({ ...s, filter: "project" }));

        return colors;
    }

    function showColorsInFrame() {
        let allColors: { [color: string]: boolean } = {};

        props.activeFrame.layers.forEach(layer => {
            for (let i = 0; i < layer.image.data.length; i += 4) {
                let r = layer.image.data[i];
                let g = layer.image.data[i + 1];
                let b = layer.image.data[i + 2];
                let a = layer.image.data[i + 3];
                let colorString = `${r},${g},${b},${a}`;
                allColors[colorString] = true;
            }
        });

        let colors = props.activeColorPallete.colors.filter(color => {
            let colorString = `${color.r},${color.g},${color.b},${color.a}`;
            return allColors[colorString];
        });

        setVisibleColors(colors);
        setColorState(s => ({ ...s, filter: "frame" }));

        return colors;
    }

    function showColorsInLayer() {
        let allColors: { [color: string]: boolean } = {};

        for (let i = 0; i < props.activeLayer.image.data.length; i += 4) {
            let r = props.activeLayer.image.data[i];
            let g = props.activeLayer.image.data[i + 1];
            let b = props.activeLayer.image.data[i + 2];
            let a = props.activeLayer.image.data[i + 3];
            let colorString = `${r},${g},${b},${a}`;
            allColors[colorString] = true;
        }

        let colors = props.activeColorPallete.colors.filter(color => {
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

            return (props.colorStats[colorString2]?.count ?? 0) - (props.colorStats[colorString]?.count ?? 0);
        });

        setVisibleColors(colors);
        setColorState(s => ({ ...s, sort: "count" }));

        return colors;
    }

    function sortColorsByMostRecent(colorOverride?: IColor[]) {
        let colors = [...(colorOverride ?? visibleColors)].sort((a, b) => {
            let colorString = `${a.r},${a.g},${a.b},${a.a}`;
            let colorString2: string = `${b.r},${b.g},${b.b},${b.a}`;

            if (props.colorStats[colorString2]?.lastUsed && !props.colorStats[colorString]?.lastUsed) return 1;
            if (!props.colorStats[colorString2]?.lastUsed && props.colorStats[colorString]?.lastUsed) return -1;

            return (props.colorStats[colorString2]?.lastUsed ?? colorString2) > (props.colorStats[colorString]?.lastUsed ?? colorString) ? 1 : -1;
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


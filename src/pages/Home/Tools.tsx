import React, { useEffect, useState } from 'react';
import { ITool, IToolSettings, IColor, ILayer, IColorPallete, IColorStats } from './';
import { IoBandageSharp, IoColorWandSharp } from "react-icons/io5";
import { IoMdMove } from "react-icons/io";
import { GiMirrorMirror } from "react-icons/gi";
import { AiFillFire } from "react-icons/ai";
import { FaEyeDropper, FaBox, FaBone, FaBrush, FaTools } from "react-icons/fa";
import { BsBucketFill } from "react-icons/bs";
import { TbArrowsDiagonal2, TbFlipHorizontal, TbFlipVertical } from "react-icons/tb";
import { IoNuclear } from "react-icons/io5";
import { BiRotateRight, BiRotateLeft, BiHorizontalCenter, BiVerticalCenter } from "react-icons/bi";
import ReactTooltip from 'react-tooltip';


interface IProps {
    activeColor: IColor;
    setActiveColor: (color: IColor) => void;
    toolSettings: IToolSettings;
    setToolSettings: (toolSettings: any) => void;
    activeLayer: ILayer;
    setActiveLayer: (layer: ILayer) => void;
    activeColorPallete: IColorPallete;
    colorStats: IColorStats;
}

export function Tools(props: IProps) {
    const data = useTools(props);

    return (<>
        <nav className="flex items-center mb-2">
            <FaTools data-tip="tools"
                data-for="tooltip"
                className={`c-icon ${data.view == "tools" ? "--active" : ""}`}
                onMouseEnter={() => data.setView("tools")} />
            <AiFillFire data-tip="actions"
                data-for="tooltip"
                className={`c-icon ${data.view == "actions" ? "--active-alt" : ""}`}
                onMouseEnter={() => data.setView("actions")} />
        </nav>

        {data.view === "tools" && (
            <section className="p-app__tools">
                <button data-tip={`brush tool ( b​ ) ${data.getButtonTooltip("brush")}`}
                    data-for="tooltip"
                    className={`mb-2 c-button --fourth --sm ${data.getButtonStyles("brush")}`}
                    onMouseDown={(e) => data.updateTool(e, "brush")}>
                    <FaBrush />
                </button>
                <button data-tip={`eraser tool ( e​ ) ${data.getButtonTooltip("eraser")}`}
                    data-for="tooltip"
                    className={`mb-2 c-button --fourth --sm ${data.getButtonStyles("eraser")}`}
                    onMouseDown={(e) => data.updateTool(e, "eraser")}>
                    <IoBandageSharp />
                </button>
                <button data-tip={`eyedropper tool ( i​ ) ${data.getButtonTooltip("eyedropper")}`}
                    data-for="tooltip"
                    className={`mb-2 c-button --fourth --sm ${data.getButtonStyles("eyedropper")}`}
                    onMouseDown={(e) => data.updateTool(e, "eyedropper")}>
                    <FaEyeDropper />
                </button>
                <button data-tip={`bucket tool ( g​ ) ${data.getButtonTooltip("bucket")}`}
                    data-for="tooltip"
                    className={`mb-2 c-button --fourth --sm ${data.getButtonStyles("bucket")}`}
                    onMouseDown={(e) => data.updateTool(e, "bucket")}>
                    <BsBucketFill />
                </button>
                <button data-tip={`move tool ( m​ ) ${data.getButtonTooltip("move")}`}
                    data-for="tooltip"
                    className={`mb-2 c-button --fourth --sm ${data.getButtonStyles("move")}`}
                    onMouseDown={(e) => data.updateTool(e, "move")}>
                    <IoMdMove />
                </button>
                {/* <button data-tip={`wand selection tool ( w​ ) ${data.getButtonTooltip("wand")}`}
                    data-for="tooltip"
                    className={`mb-2 c-button --fourth --sm ${data.getButtonStyles("wand")}`}
                    onMouseDown={(e) => data.updateTool(e, "wand")}>
                    <IoColorWandSharp />
                </button> */}
                {/* <button data-tip={`box selection tool ( x​ ) ${data.getButtonTooltip("box")}`}
                    data-for="tooltip"
                    className={`mb-2 c-button --fourth --sm ${data.getButtonStyles("box")}`}
                    onMouseDown={(e) => data.updateTool(e, "box")}>
                    <FaBox />
                </button> */}
                {/* <button data-tip={`bone tool ( o​ ) ${data.getButtonTooltip("bone")}`}
                    data-for="tooltip"
                    className={`mb-2 c-button --fourth --sm ${data.getButtonStyles("bone")}`}
                    onMouseDown={(e) => data.updateTool(e, "bone")}>
                    <FaBone />
                </button> */}
                <button data-tip={`line tool ( l​ ) ${data.getButtonTooltip("line")}`}
                    data-for="tooltip"
                    className={`mb-2 c-button --fourth --sm ${data.getButtonStyles("line")}`}
                    onMouseDown={(e) => data.updateTool(e, "line")}>
                    <TbArrowsDiagonal2 />
                </button>
                <button data-tip={`mirror tool ( r​ ) ${data.getButtonTooltip("mirror")}`}
                    data-for="tooltip"
                    className={`mb-2 c-button --fourth --sm ${data.getButtonStyles("mirror")}`}
                    onMouseDown={(e) => data.updateTool(e, "mirror")}>
                    <GiMirrorMirror />
                </button>
            </section>
        )}

        {data.view === "actions" && (
            <section className="p-app__tools">
                <button data-tip="flip layer horizontally ( shift + h )"
                    data-for="tooltip"
                    onClick={() => data.actions["flipHorizontal"]()}
                    className="c-button --sm --second mb-2">
                    <TbFlipHorizontal />
                </button>
                <button data-tip="flip layer vertically ( shift + v ​)"
                    data-for="tooltip"
                    onClick={() => data.actions["flipVertical"]()}
                    className="c-button --sm --second mb-2">
                    <TbFlipVertical />
                </button>
                {/* <button data-tip="center layer horizontally ( shift + ~ )"
                    data-for="tooltip"
                    onClick={() => data.actions["centerHorizontal"]()}
                    className="c-button --sm --second mb-2">
                    <BiHorizontalCenter />
                </button>
                <button data-tip="center layer vertically ( shift + | ​)"
                    data-for="tooltip"
                    onClick={() => data.actions["centerVertical"]()}
                    className="c-button --sm --second mb-2">
                    <BiVerticalCenter />
                </button> */}
                <button data-tip="rotate layer 90° right ( shift + r ​)"
                    data-for="tooltip"
                    onClick={() => data.actions["rotateRight"]()}
                    className="c-button --sm --second mb-2">
                    <BiRotateRight />
                </button>
                <button data-tip="rotate layer 90° left ( shift + l ​)"
                    data-for="tooltip"
                    onClick={() => data.actions["rotateLeft"]()}
                    className="c-button --sm --second mb-2">
                    <BiRotateLeft />
                </button>
                <button data-tip="clear current layer ( shift + c​ )"
                    data-for="tooltip"
                    onClick={() => data.actions["clear"]()}
                    className="c-button --sm --second mb-2">
                    <IoNuclear />
                </button>
            </section>
        )}

        <section className="p-app__color-swatch">
            {data.mostRecentColors.map((_, i) => {
                let index = data.mostRecentColors.length - 1 - i;
                let recentColor = data.mostRecentColors[index];

                return (
                    <div key={index}
                        className="p-app__color-swatch-layer"
                        onClick={() => props.setActiveColor(recentColor)}
                        style={{
                            background: `rgb(${recentColor.r}, ${recentColor.g}, ${recentColor.b})`
                        }}>
                    </div>
                )
            })}
        </section>
    </>)
}

function useTools(props: IProps) {
    let [view, setView] = useState<'tools' | 'actions'>("tools");
    let [keys, setKeys] = useState<string[]>([]);
    let [mostRecentColors, setMostRecentColors] = useState<IColor[]>([]);

    let actions = {
        "clear": () => {
            if (!window.confirm("Are you sure you want to clear the current layer?")) return;

            let newLayer = { ...props.activeLayer };
            newLayer.image = new ImageData(newLayer.image.width, newLayer.image.height);
            props.setActiveLayer(newLayer);
        },
        "flipHorizontal": () => {
            let tempCanvas = document.createElement("canvas");
            let tempCtx = tempCanvas.getContext("2d");
            tempCanvas.width = props.activeLayer.image.width;
            tempCanvas.height = props.activeLayer.image.height;

            let tempCanvas2 = document.createElement("canvas");
            let tempCtx2 = tempCanvas2.getContext("2d");
            tempCanvas2.width = props.activeLayer.image.width;
            tempCanvas2.height = props.activeLayer.image.height;

            tempCtx!.putImageData(props.activeLayer.image, 0, 0);
            tempCtx2!.translate(0, tempCanvas2.height);
            tempCtx2!.scale(1, -1);
            tempCtx2!.drawImage(tempCanvas, 0, 0);

            let newLayer = { ...props.activeLayer };
            newLayer.image = tempCtx2!.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            props.setActiveLayer(newLayer);
        },
        "flipVertical": () => {
            let tempCanvas = document.createElement("canvas");
            let tempCtx = tempCanvas.getContext("2d");
            tempCanvas.width = props.activeLayer.image.width;
            tempCanvas.height = props.activeLayer.image.height;

            let tempCanvas2 = document.createElement("canvas");
            let tempCtx2 = tempCanvas2.getContext("2d");
            tempCanvas2.width = props.activeLayer.image.width;
            tempCanvas2.height = props.activeLayer.image.height;

            tempCtx!.putImageData(props.activeLayer.image, 0, 0);
            tempCtx2!.translate(tempCanvas2.width, 0);
            tempCtx2!.scale(-1, 1);
            tempCtx2!.drawImage(tempCanvas, 0, 0);

            let newLayer = { ...props.activeLayer };
            newLayer.image = tempCtx2!.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            props.setActiveLayer(newLayer);
        },
        "rotateRight": () => {
            let tempCanvas = document.createElement("canvas");
            let tempCtx = tempCanvas.getContext("2d");
            tempCanvas.width = props.activeLayer.image.width;
            tempCanvas.height = props.activeLayer.image.height;

            let tempCanvas2 = document.createElement("canvas");
            let tempCtx2 = tempCanvas2.getContext("2d");
            tempCanvas2.width = props.activeLayer.image.width;
            tempCanvas2.height = props.activeLayer.image.height;

            tempCtx!.putImageData(props.activeLayer.image, 0, 0);
            tempCtx2!.translate(tempCanvas2.width / 2, tempCanvas2.height / 2);
            tempCtx2!.rotate(90 * Math.PI / 180);
            tempCtx2!.translate(-tempCanvas2.width / 2, -tempCanvas2.height / 2);
            tempCtx2!.drawImage(tempCanvas, 0, 0);

            let newLayer = { ...props.activeLayer };
            newLayer.image = tempCtx2!.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            props.setActiveLayer(newLayer);
        },
        "rotateLeft": () => {
            let tempCanvas = document.createElement("canvas");
            let tempCtx = tempCanvas.getContext("2d");
            tempCanvas.width = props.activeLayer.image.width;
            tempCanvas.height = props.activeLayer.image.height;

            let tempCanvas2 = document.createElement("canvas");
            let tempCtx2 = tempCanvas2.getContext("2d");
            tempCanvas2.width = props.activeLayer.image.width;
            tempCanvas2.height = props.activeLayer.image.height;

            tempCtx!.putImageData(props.activeLayer.image, 0, 0);
            tempCtx2!.translate(tempCanvas2.width / 2, tempCanvas2.height / 2);
            tempCtx2!.rotate(-90 * Math.PI / 180);
            tempCtx2!.translate(-tempCanvas2.width / 2, -tempCanvas2.height / 2);
            tempCtx2!.drawImage(tempCanvas, 0, 0);

            let newLayer = { ...props.activeLayer };
            newLayer.image = tempCtx2!.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            props.setActiveLayer(newLayer);
        },
        "centerHorizontal": () => { },
        "centerVertical": () => { },
    }
    let shortcuts: any = {
        "b": () => updateTool(null, "brush", 0),
        "e": () => updateTool(null, "eraser", 0),
        "i": () => updateTool(null, "eyedropper", 0),
        "g": () => updateTool(null, "bucket", 0),
        "m": () => updateTool(null, "move", 0),
        "w": () => updateTool(null, "wand", 0),
        "x": () => updateTool(null, "box", 0),
        "o": () => updateTool(null, "bone", 0),
        "l": () => updateTool(null, "line", 0),
        "r": () => updateTool(null, "mirror", 0),
        "shift+h": actions.flipHorizontal,
        "shift+v": actions.flipVertical,
        "shift+~": actions.centerHorizontal,
        "shift+|": actions.centerVertical,
        "shift+r": actions.rotateRight,
        "shift+l": actions.rotateLeft,
        "shift+c": actions.clear,
        "1": () => props.setActiveColor(mostRecentColors[0]),
        "2": () => props.setActiveColor(mostRecentColors[1]),
        "3": () => props.setActiveColor(mostRecentColors[2]),
        "4": () => props.setActiveColor(mostRecentColors[3]),
        "5": () => props.setActiveColor(mostRecentColors[4]),
        "6": () => props.setActiveColor(mostRecentColors[5]),
        "7": () => props.setActiveColor(mostRecentColors[6]),
        "8": () => props.setActiveColor(mostRecentColors[7]),
        "9": () => props.setActiveColor(mostRecentColors[8]),
        "0": () => props.setActiveColor(mostRecentColors[9]),
    };

    useEffect(() => {
        ReactTooltip.rebuild();
    }, [view]);

    useEffect(() => {
        setMostRecentColors(sortColorsByMostRecent());
    }, [props.activeColor, props.activeColorPallete]);

    useEffect(() => {
        document.body.addEventListener("keydown", (e) => {
            setKeys(oldKeys => {
                if (oldKeys.includes(e.key.toLowerCase())) return oldKeys;

                let newKeys = [...oldKeys, e.key.toLowerCase()];

                console.log(newKeys);

                for (let i = 0; i < newKeys.length; i++) {
                    let jStart = newKeys.length === 1 ? i : i + 1;

                    for (let j = jStart; j < newKeys.length; j++) {
                        let key1 = newKeys[i];
                        let key2 = newKeys[j];
                        let key3 = `${newKeys[i]}+${newKeys[j]}`;

                        if (key3 in shortcuts) {
                            shortcuts[key3]();
                            return newKeys;
                        }
                        if (key2 in shortcuts) {
                            shortcuts[key2]();
                            return newKeys;
                        }
                        if (key1 in shortcuts) {
                            shortcuts[key1]();
                            return newKeys;
                        }
                    }
                }

                return newKeys;
            })
        });
        
        document.body.addEventListener("keyup", (e) => {
            setKeys(k => k.filter(x => x !== e.key.toLowerCase()));
        });
    }, []);

    function sortColorsByMostRecent() {
        let colors = props.activeColorPallete.colors.sort((a, b) => {
            let colorString = `${a.r},${a.g},${a.b},${a.a}`;
            let colorString2 = `${b.r},${b.g},${b.b},${b.a}`;

            if (props.colorStats[colorString2]?.lastUsed && !props.colorStats[colorString]?.lastUsed) return 1;
            if (!props.colorStats[colorString2]?.lastUsed && props.colorStats[colorString]?.lastUsed) return -1;

            return (props.colorStats[colorString2]?.lastUsed ?? colorString2) > (props.colorStats[colorString]?.lastUsed ?? colorString) ? 1 : -1;
        });

        return colors;
    }

    function getButtonStyles(tool: ITool) {
        let classes = "";
        if (props.toolSettings.leftTool === tool) classes += " --active-second";
        else if (props.toolSettings.rightTool === tool) classes += " --active-third";
        else if (props.toolSettings.middleTool === tool) classes += " --active-gray";
        return classes;
    }

    function getButtonTooltip(tool: ITool) {
        let tooltip = "";
        if (props.toolSettings.leftTool === tool) tooltip += "( left 🖱️ )";
        else if (props.toolSettings.rightTool === tool) tooltip += "( right 🖱️ )";
        else if (props.toolSettings.middleTool === tool) tooltip += "( middle 🖱️ )";
        return tooltip;
    }

    function updateTool(e: any, tool: ITool, mouseButton?: number) {
        let rightOrLeft = e ? e.button : mouseButton;

        if (rightOrLeft === 0)
            props.setToolSettings((s: IToolSettings) => ({ ...s, leftTool: tool }));
        else if (rightOrLeft == 1)
            props.setToolSettings((s: IToolSettings) => ({ ...s, middleTool: tool }));
        else if (rightOrLeft == 2)
            props.setToolSettings((s: IToolSettings) => ({ ...s, rightTool: tool }));
    }

    function setBrushSize(delta: number) {
        props.setToolSettings((p: IToolSettings) =>
            ({ ...p, size: (p.size + delta < 1) ? 1 : (p.size + delta) }));
    }

    return {
        actions,
        getButtonStyles,
        getButtonTooltip,
        setBrushSize,
        mostRecentColors,
        sortColorsByMostRecent,
        updateTool,
        setView,
        view,
    }
}

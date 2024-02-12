import ReactTooltip from 'react-tooltip';
import { IoMdMove } from "react-icons/io";
import { AiFillFire } from "react-icons/ai";
import { BsBucketFill } from "react-icons/bs";
import { GiMirrorMirror } from "react-icons/gi";
import { IoBandageSharp } from "react-icons/io5";
import React, { useEffect, useState } from 'react';
import { useShortcuts, useCanvas } from '../../utils';
import { ITool, IToolSettings, ILayer } from '../../types';
import { IoColorWandSharp, IoNuclear } from "react-icons/io5";
import { FaEyeDropper, FaBrush, FaTools, FaBox, FaLightbulb, FaShapes } from "react-icons/fa";
import { BiRotateRight, BiRotateLeft, BiHorizontalCenter, BiVerticalCenter } from "react-icons/bi";
import { TbArrowsDiagonal2, TbFlipHorizontal, TbFlipVertical, TbArrowLoopRight } from "react-icons/tb";


interface IProps {
    activeLayer: ILayer;
    toolSettings: IToolSettings;
    setActiveLayer: (layer: ILayer) => void;
    setToolSettings: (toolSettings: any) => void;
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
                <button data-tip={`bucket tool ( g​ ) ${data.getButtonTooltip("bucket")}`}
                    data-for="tooltip"
                    className={`mb-2 c-button --fourth --sm ${data.getButtonStyles("bucket")}`}
                    onMouseDown={(e) => data.updateTool(e, "bucket")}>
                    <BsBucketFill />
                </button>
                <button data-tip={`shape tool ( s​ ) ${data.getButtonTooltip("shape")}`}
                    data-for="tooltip"
                    className={`mb-2 c-button --fourth --sm ${data.getButtonStyles("shape")}`}
                    onMouseDown={(e) => data.updateTool(e, "shape")}>
                    <FaShapes />
                </button>
                <button data-tip={`light tool ( t​ ) ${data.getButtonTooltip("light")}`}
                    data-for="tooltip"
                    className={`mb-2 c-button --fourth --sm ${data.getButtonStyles("light")}`}
                    onMouseDown={(e) => data.updateTool(e, "light")}>
                    <FaLightbulb />
                </button>
                <button data-tip={`eyedropper tool ( i​ ) ${data.getButtonTooltip("eyedropper")}`}
                    data-for="tooltip"
                    className={`mb-2 c-button --fourth --sm ${data.getButtonStyles("eyedropper")}`}
                    onMouseDown={(e) => data.updateTool(e, "eyedropper")}>
                    <FaEyeDropper />
                </button>
                <button data-tip={`move tool ( m​ ) ${data.getButtonTooltip("move")}`}
                    data-for="tooltip"
                    className={`mb-2 c-button --fourth --sm ${data.getButtonStyles("move")}`}
                    onMouseDown={(e) => data.updateTool(e, "move")}>
                    <IoMdMove />
                </button>
                <button data-tip={`box selection tool ( x​ ) ${data.getButtonTooltip("box")}`}
                    data-for="tooltip"
                    className={`mb-2 c-button --fourth --sm ${data.getButtonStyles("box")}`}
                    onMouseDown={(e) => data.updateTool(e, "box")}>
                    <FaBox />
                </button>
                <button data-tip={`wand selection tool ( w​ ) ${data.getButtonTooltip("wand")}`}
                    data-for="tooltip"
                    className={`mb-2 c-button --fourth --sm ${data.getButtonStyles("wand")}`}
                    onMouseDown={(e) => data.updateTool(e, "wand")}>
                    <IoColorWandSharp />
                </button>
                <button data-tip={`laso selection tool ( o​ ) ${data.getButtonTooltip("laso")}`}
                    data-for="tooltip"
                    className={`mb-2 c-button --fourth --sm ${data.getButtonStyles("laso")}`}
                    onMouseDown={(e) => data.updateTool(e, "laso")}>
                    <TbArrowLoopRight />
                </button>
                {/* <button data-tip={`bone tool ( n​ ) ${data.getButtonTooltip("bone")}`}
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
                <button data-tip="center layer horizontally ( shift + ~ )"
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
                </button>
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
    </>)
}


function useTools(props: IProps) {
    const canvas1 = useCanvas();
    const canvas2 = useCanvas();
    let [view, setView] = useState<'tools' | 'actions'>("tools");
    let actions = {
        "clear": () => {
            if (!window.confirm("Are you sure you want to clear the current layer?")) return;

            props.setActiveLayer({
                ...props.activeLayer,
                image: new ImageData(props.activeLayer.image.width, props.activeLayer.image.height)
            });
        },
        "flipHorizontal": () => {
            canvas1.resize(props.activeLayer.image.width, props.activeLayer.image.height);
            canvas2.resize(props.activeLayer.image.width, props.activeLayer.image.height);

            canvas1.putImageData(props.activeLayer.image);
            canvas2.ctx.translate(0, canvas2.height);
            canvas2.ctx.scale(1, -1);
            canvas2.drawImage(canvas1.canvas);

            props.setActiveLayer({
                ...props.activeLayer,
                image: canvas2.getImageData()
            });
        },
        "flipVertical": () => {
            canvas1.resize(props.activeLayer.image.width, props.activeLayer.image.height);
            canvas2.resize(props.activeLayer.image.width, props.activeLayer.image.height);

            canvas1.putImageData(props.activeLayer.image, 0, 0);
            canvas2.ctx.translate(canvas2.width, 0);
            canvas2.ctx.scale(-1, 1);
            canvas2.drawImage(canvas1.canvas, 0, 0);

            props.setActiveLayer({
                ...props.activeLayer,
                image: canvas2.getImageData()
            });
        },
        "rotateRight": () => {
            canvas1.resize(props.activeLayer.image.width, props.activeLayer.image.height);
            canvas2.resize(props.activeLayer.image.width, props.activeLayer.image.height);

            canvas1.putImageData(props.activeLayer.image);
            canvas2.ctx.translate(canvas2.width / 2, canvas2.height / 2);
            canvas2.ctx.rotate(90 * Math.PI / 180);
            canvas2.ctx.translate(-canvas2.width / 2, -canvas2.height / 2);
            canvas2.drawImage(canvas1.canvas, 0, 0);

            props.setActiveLayer({
                ...props.activeLayer,
                image: canvas2.getImageData()
            });
        },
        "rotateLeft": () => {
            canvas1.resize(props.activeLayer.image.width, props.activeLayer.image.height);
            canvas2.resize(props.activeLayer.image.width, props.activeLayer.image.height);

            canvas1.putImageData(props.activeLayer.image, 0, 0);
            canvas2.ctx.translate(canvas2.width / 2, canvas2.height / 2);
            canvas2.ctx.rotate(-90 * Math.PI / 180);
            canvas2.ctx.translate(-canvas2.width / 2, -canvas2.height / 2);
            canvas2.drawImage(canvas1.canvas);

            props.setActiveLayer({
                ...props.activeLayer,
                image: canvas2.getImageData()
            });
        },
        "centerHorizontal": () => {
            canvas1.resize(props.activeLayer.image.width, props.activeLayer.image.height);

            const imageData = props.activeLayer.image;
            const bounds = findVisibleBounds(imageData);
            const visibleWidth = bounds.maxX - bounds.minX + 1;
            const dx = (canvas2.width - visibleWidth) / 2 - bounds.minX;

            canvas1.ctx.putImageData(imageData, dx, 0);

            props.setActiveLayer({
                ...props.activeLayer,
                image: canvas1.getImageData()
            });
        },
        "centerVertical": () => {
            canvas1.resize(props.activeLayer.image.width, props.activeLayer.image.height);

            const imageData = props.activeLayer.image;
            const bounds = findVisibleBounds(imageData);
            const visibleHeight = bounds.maxY - bounds.minY + 1;
            const dy = (canvas1.height - visibleHeight) / 2 - bounds.minY;

            canvas1.ctx.putImageData(imageData, 0, dy);

            props.setActiveLayer({
                ...props.activeLayer,
                image: canvas1.getImageData()
            });
        },
    }
    let keys = useShortcuts({
        "b": () => updateTool(null, "brush", 0),
        "e": () => updateTool(null, "eraser", 0),
        "s": () => updateTool(null, "shape", 0),
        "g": () => updateTool(null, "bucket", 0),
        "t": () => updateTool(null, "light", 0),
        "i": () => updateTool(null, "eyedropper", 0),
        "m": () => updateTool(null, "move", 0),
        "x": () => updateTool(null, "box", 0),
        "w": () => updateTool(null, "wand", 0),
        "o": () => updateTool(null, "laso", 0),
        "n": () => updateTool(null, "bone", 0),
        "l": () => updateTool(null, "line", 0),
        "r": () => updateTool(null, "mirror", 0),
        "shift+h": actions.flipHorizontal,
        "shift+v": actions.flipVertical,
        "shift+~": actions.centerHorizontal,
        "shift+|": actions.centerVertical,
        "shift+r": actions.rotateRight,
        "shift+l": actions.rotateLeft,
        "shift+c": actions.clear,
    });

    useEffect(() => {
        ReactTooltip.rebuild();
    }, [view]);

    function findVisibleBounds(imageData) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        let minX = width, maxX = 0, minY = height, maxY = 0;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const alpha = data[(y * width + x) * 4 + 3];
                if (alpha > 0) { // This pixel is not transparent.
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }

        return { minX, maxX, minY, maxY };
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

    return {
        view,
        actions,
        setView,
        updateTool,
        getButtonStyles,
        getButtonTooltip,
    }
}

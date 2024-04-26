import { ITool } from '../../types';
import ReactTooltip from 'react-tooltip';
import { IoMdMove } from "react-icons/io";
import { AiFillFire } from "react-icons/ai";
import { GiMirrorMirror } from "react-icons/gi";
import React, { useEffect, useState } from 'react';
import { MdOutlineCallReceived } from "react-icons/md";
import { BsBucketFill, BsEraserFill } from "react-icons/bs";
import { IoColorWandSharp, IoNuclear } from "react-icons/io5";
import { useShortcuts, useCanvas, useGlobalStore } from '../../utils';
import { TbFlipHorizontal, TbFlipVertical, TbArrowLoopRight } from "react-icons/tb";
import { FaEyeDropper, FaBrush, FaTools, FaBox, FaLightbulb, FaShapes } from "react-icons/fa";
import { BiRotateRight, BiRotateLeft, BiHorizontalCenter, BiVerticalCenter } from "react-icons/bi";


export function Tools() {
    const data = useTools();

    return (<section className="p-app__area-left p-app__block">
        <nav className="flex items-center mb-1 border-2 rounded-md border-primary">
            <FaTools data-tip="tools (1)"
                data-for="tooltip"
                className={`cursor-pointer p-1 box-content focus:outline-none ${data.view == "tools" ? "bg-primary text-primary-content" : "text-base-content"}`}
                onClick={() => data.setView("tools")} />
            <AiFillFire data-tip="actions (2)"
                data-for="tooltip"
                className={`cursor-pointer p-1 box-content focus:outline-none ${data.view == "actions" ? "bg-primary text-primary-content" : "text-base-content"}`}
                onClick={() => data.setView("actions")} />
        </nav>

        <section className="space-y-1 col">
            {data.view === "tools" && (<>
                <button aria-label="select brush tool"
                    data-tip={`brush tool ( b​ ) ${data.getButtonTooltip("brush")}`}
                    data-for="tooltip"
                    className={`btn btn-primary btn-sm box-content py-1 hover:animate-squeeze ${data.getButtonStyles("brush")}`}
                    onMouseDown={(e) => data.updateTool(e, "brush")}>
                    <FaBrush className="text-xl" />
                </button>
                <button aria-label="select eraser tool"
                    data-tip={`eraser tool ( e​ ) ${data.getButtonTooltip("eraser")}`}
                    data-for="tooltip"
                    className={`btn btn-primary btn-sm box-content py-1 hover:animate-squeeze ${data.getButtonStyles("eraser")}`}
                    onMouseDown={(e) => data.updateTool(e, "eraser")}>
                    <BsEraserFill className="text-xl" />
                </button>
                <button aria-label="select bucket tool"
                    data-tip={`bucket tool ( g​ ) ${data.getButtonTooltip("bucket")}`}
                    data-for="tooltip"
                    className={`btn btn-primary btn-sm box-content py-1 hover:animate-squeeze ${data.getButtonStyles("bucket")}`}
                    onMouseDown={(e) => data.updateTool(e, "bucket")}>
                    <BsBucketFill className="text-xl" />
                </button>
                <button aria-label="select shape tool"
                    data-tip={`shape tool ( s​ ) ${data.getButtonTooltip("shape")}`}
                    data-for="tooltip"
                    className={`btn btn-primary btn-sm box-content py-1 hover:animate-squeeze ${data.getButtonStyles("shape")}`}
                    onMouseDown={(e) => data.updateTool(e, "shape")}>
                    <FaShapes className="text-xl" />
                </button>
                <button aria-label="select light tool"
                    data-tip={`light tool ( t​ ) ${data.getButtonTooltip("light")}`}
                    data-for="tooltip"
                    className={`btn btn-primary btn-sm box-content py-1 hover:animate-squeeze ${data.getButtonStyles("light")}`}
                    onMouseDown={(e) => data.updateTool(e, "light")}>
                    <FaLightbulb className="text-xl" />
                </button>
                <button aria-label="select line tool"
                    data-tip={`line tool ( l​ ) ${data.getButtonTooltip("line")}`}
                    data-for="tooltip"
                    className={`btn btn-primary btn-sm box-content py-1 hover:animate-squeeze ${data.getButtonStyles("line")}`}
                    onMouseDown={(e) => data.updateTool(e, "line")}>
                    <MdOutlineCallReceived className="text-xl" />
                </button>
                <button aria-label="select mirror tool"
                    data-tip={`mirror tool ( m​ ) ${data.getButtonTooltip("mirror")}`}
                    data-for="tooltip"
                    className={`btn btn-primary btn-sm box-content py-1 hover:animate-squeeze ${data.getButtonStyles("mirror")}`}
                    onMouseDown={(e) => data.updateTool(e, "mirror")}>
                    <GiMirrorMirror className="text-xl" />
                </button>
                <button aria-label="select eyedropper tool"
                    data-tip={`eyedropper tool ( i​ ) ${data.getButtonTooltip("eyedropper")}`}
                    data-for="tooltip"
                    className={`btn btn-primary btn-sm box-content py-1 hover:animate-squeeze ${data.getButtonStyles("eyedropper")}`}
                    onMouseDown={(e) => data.updateTool(e, "eyedropper")}>
                    <FaEyeDropper className="text-xl" />
                </button>
                <button aria-label="select move tool"
                    data-tip={`move tool ( v​ ) ${data.getButtonTooltip("move")}`}
                    data-for="tooltip"
                    className={`btn btn-primary btn-sm box-content py-1 hover:animate-squeeze ${data.getButtonStyles("move")}`}
                    onMouseDown={(e) => data.updateTool(e, "move")}>
                    <IoMdMove className="text-xl" />
                </button>
                <button aria-label="select box selection tool"
                    data-tip={`box selection tool ( x​ ) ${data.getButtonTooltip("box")}`}
                    data-for="tooltip"
                    className={`btn btn-primary btn-sm box-content py-1 hover:animate-squeeze ${data.getButtonStyles("box")}`}
                    onMouseDown={(e) => data.updateTool(e, "box")}>
                    <FaBox className="text-xl" />
                </button>
                <button aria-label="select wand selection tool"
                    data-tip={`wand selection tool ( w​ ) ${data.getButtonTooltip("wand")}`}
                    data-for="tooltip"
                    className={`btn btn-primary btn-sm box-content py-1 hover:animate-squeeze ${data.getButtonStyles("wand")}`}
                    onMouseDown={(e) => data.updateTool(e, "wand")}>
                    <IoColorWandSharp className="text-xl" />
                </button>
                <button aria-label="select lasso selection tool"
                    data-tip={`lasso selection tool ( o​ ) ${data.getButtonTooltip("lasso")}`}
                    data-for="tooltip"
                    className={`btn btn-primary btn-sm box-content py-1 hover:animate-squeeze ${data.getButtonStyles("lasso")}`}
                    onMouseDown={(e) => data.updateTool(e, "lasso")}>
                    <TbArrowLoopRight className="text-xl" />
                </button>
            </>)}

            {data.view === "actions" && (<>
                <button aria-label="flip layer horizontally"
                    data-tip="flip layer horizontally ( shift + h )"
                    data-for="tooltip"
                    onClick={() => data.actions["flipHorizontal"]()}
                    className="box-content py-1 btn btn-secondary btn-sm hover:animate-squeeze">
                    <TbFlipHorizontal className="text-xl" />
                </button>
                <button aria-label="flip layer vertically"
                    data-tip="flip layer vertically ( shift + v ​)"
                    data-for="tooltip"
                    onClick={() => data.actions["flipVertical"]()}
                    className="box-content py-1 btn btn-secondary btn-sm hover:animate-squeeze">
                    <TbFlipVertical className="text-xl" />
                </button>
                <button aria-label="center layer horizontally"
                    data-tip="center layer horizontally ( shift + ~ )"
                    data-for="tooltip"
                    onClick={() => data.actions["centerHorizontal"]()}
                    className="box-content py-1 btn btn-secondary btn-sm hover:animate-squeeze">
                    <BiHorizontalCenter className="text-xl" />
                </button>
                <button aria-label="center layer vertically"
                    data-tip="center layer vertically ( shift + | ​)"
                    data-for="tooltip"
                    onClick={() => data.actions["centerVertical"]()}
                    className="box-content py-1 btn btn-secondary btn-sm hover:animate-squeeze">
                    <BiVerticalCenter className="text-xl" />
                </button>
                <button aria-label="rotate layer 90° right"
                    data-tip="rotate layer 90° right ( shift + r ​)"
                    data-for="tooltip"
                    onClick={() => data.actions["rotateRight"]()}
                    className="box-content py-1 btn btn-secondary btn-sm hover:animate-squeeze">
                    <BiRotateRight className="text-xl" />
                </button>
                <button aria-label="rotate layer 90° left"
                    data-tip="rotate layer 90° left ( shift + l ​)"
                    data-for="tooltip"
                    onClick={() => data.actions["rotateLeft"]()}
                    className="box-content py-1 btn btn-secondary btn-sm hover:animate-squeeze">
                    <BiRotateLeft className="text-xl" />
                </button>
                <button aria-label="clear current layer"
                    data-tip="clear current layer ( shift + c​ )"
                    data-for="tooltip"
                    onClick={() => data.actions["clear"]()}
                    className="box-content py-1 btn btn-secondary btn-sm hover:animate-squeeze">
                    <IoNuclear className="text-xl" />
                </button>
            </>)}
        </section>
    </section >)
}


function useTools() {
    const canvas1 = useCanvas();
    const canvas2 = useCanvas();
    const { setActiveLayer, activeLayer, toolSettings, setToolSettings } = useGlobalStore();
    let [view, setView] = useState<'tools' | 'actions'>("tools");
    let actions = {
        "clear": () => {
            setActiveLayer({
                ...activeLayer,
                image: new ImageData(activeLayer.image.width, activeLayer.image.height)
            });
        },
        "flipHorizontal": () => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas2.resize(activeLayer.image.width, activeLayer.image.height);

            canvas1.putImageData(activeLayer.image);
            canvas2.getCtx().translate(0, canvas2.getHeight());
            canvas2.getCtx().scale(1, -1);
            canvas2.drawImage(canvas1.getElement());

            setActiveLayer({
                ...activeLayer,
                image: canvas2.getImageData()
            });
        },
        "flipVertical": () => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas2.resize(activeLayer.image.width, activeLayer.image.height);

            canvas1.putImageData(activeLayer.image, 0, 0);
            canvas2.getCtx().translate(canvas2.getWidth(), 0);
            canvas2.getCtx().scale(-1, 1);
            canvas2.drawImage(canvas1.getElement(), 0, 0);

            setActiveLayer({
                ...activeLayer,
                image: canvas2.getImageData()
            });
        },
        "rotateRight": () => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas2.resize(activeLayer.image.width, activeLayer.image.height);

            canvas1.putImageData(activeLayer.image);
            canvas2.getCtx().translate(canvas2.getWidth() / 2, canvas2.getHeight() / 2);
            canvas2.getCtx().rotate(90 * Math.PI / 180);
            canvas2.getCtx().translate(-canvas2.getWidth() / 2, -canvas2.getHeight() / 2);
            canvas2.drawImage(canvas1.getElement(), 0, 0);

            setActiveLayer({
                ...activeLayer,
                image: canvas2.getImageData()
            });
        },
        "rotateLeft": () => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas2.resize(activeLayer.image.width, activeLayer.image.height);

            canvas1.putImageData(activeLayer.image, 0, 0);
            canvas2.getCtx().translate(canvas2.getWidth() / 2, canvas2.getHeight() / 2);
            canvas2.getCtx().rotate(-90 * Math.PI / 180);
            canvas2.getCtx().translate(-canvas2.getWidth() / 2, -canvas2.getHeight() / 2);
            canvas2.drawImage(canvas1.getElement());

            setActiveLayer({
                ...activeLayer,
                image: canvas2.getImageData()
            });
        },
        "centerHorizontal": () => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);

            const imageData = activeLayer.image;
            const bounds = findVisibleBounds(imageData);
            const visibleWidth = bounds.maxX - bounds.minX + 1;
            const dx = (canvas1.getWidth() - visibleWidth) / 2 - bounds.minX;

            canvas1.putImageData(imageData, dx, 0);

            setActiveLayer({
                ...activeLayer,
                image: canvas1.getImageData()
            });
        },
        "centerVertical": () => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);

            const imageData = activeLayer.image;
            const bounds = findVisibleBounds(imageData);
            const visibleHeight = bounds.maxY - bounds.minY + 1;
            const dy = (canvas1.getHeight() - visibleHeight) / 2 - bounds.minY;

            canvas1.putImageData(imageData, 0, dy);

            setActiveLayer({
                ...activeLayer,
                image: canvas1.getImageData()
            });
        },
    }

    useShortcuts({
        "1": () => setView("tools"),
        "2": () => setView("actions"),
        "b": () => updateTool(null, "brush", 0),
        "e": () => updateTool(null, "eraser", 0),
        "s": () => updateTool(null, "shape", 0),
        "g": () => updateTool(null, "bucket", 0),
        "t": () => updateTool(null, "light", 0),
        "d": () => updateTool(null, "smudge", 0),
        "i": () => updateTool(null, "eyedropper", 0),
        "v": () => updateTool(null, "move", 0),
        "x": () => updateTool(null, "box", 0),
        "w": () => updateTool(null, "wand", 0),
        "o": () => updateTool(null, "lasso", 0),
        // "n": () => updateTool(null, "bone", 0),
        "l": () => updateTool(null, "line", 0),
        "m": () => updateTool(null, "mirror", 0),
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
        if (toolSettings.leftTool === tool) classes += " btn-secondary";
        else if (toolSettings.rightTool === tool) classes += " btn-accent";
        else if (toolSettings.middleTool === tool) classes += " btn-neutral";
        return classes;
    }

    function getButtonTooltip(tool: ITool) {
        let tooltip = "";
        if (toolSettings.leftTool === tool) tooltip += "( left 🖱️ )";
        else if (toolSettings.rightTool === tool) tooltip += "( right 🖱️ )";
        else if (toolSettings.middleTool === tool) tooltip += "( middle 🖱️ )";
        return tooltip;
    }

    function updateTool(e: any, newTool: ITool, mouseButton?: number) {
        const btn = e ? e.button : mouseButton;
        const { leftTool, middleTool, rightTool } = toolSettings;

        // Check if the tool is already assigned to a button
        if (newTool === leftTool || newTool === middleTool || newTool === rightTool) {
            // Swap the tools if already assigned
            if (btn === 0 && newTool !== leftTool) {
                setToolSettings({
                    ...toolSettings,
                    leftTool: newTool,
                    ...(newTool === middleTool && { middleTool: leftTool }),
                    ...(newTool === rightTool && { rightTool: leftTool }),
                });
            } else if (btn === 1 && newTool !== middleTool) {
                setToolSettings({
                    ...toolSettings,
                    middleTool: newTool,
                    ...(newTool === leftTool && { leftTool: middleTool }),
                    ...(newTool === rightTool && { rightTool: middleTool }),
                });
            } else if (btn === 2 && newTool !== rightTool) {
                setToolSettings({
                    ...toolSettings,
                    rightTool: newTool,
                    ...(newTool === leftTool && { leftTool: rightTool }),
                    ...(newTool === middleTool && { middleTool: rightTool }),
                });
            }
        } else {
            // Assign the tool as before if not already assigned
            if (btn === 0) setToolSettings({ ...toolSettings, leftTool: newTool });
            else if (btn === 1) setToolSettings({ ...toolSettings, middleTool: newTool });
            else if (btn === 2) setToolSettings({ ...toolSettings, rightTool: newTool });
        }
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

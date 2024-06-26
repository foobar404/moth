import tinycolor from "tinycolor2";
import { FaDroplet, FaMap } from "react-icons/fa6";
import ReactTooltip from 'react-tooltip';
import React, { useEffect, useRef, useState } from 'react';
import { BsBucketFill, BsCircleFill, BsCircleHalf, BsStars } from "react-icons/bs";
import { useCanvas as useCanvasHook, useGlobalStore, useShortcuts } from "../../utils";
import { TbCircleFilled, TbOvalFilled, TbSquareFilled, TbRectangleFilled } from "react-icons/tb";
import { FaUndoAlt, FaRedoAlt, FaMoon, FaSun, FaArrowsAlt, FaArrowsAltH, FaArrowsAltV, FaFill, FaCloud, FaBrush } from "react-icons/fa";
import { IoColorFill } from "react-icons/io5";
import { PiMaskHappyFill } from "react-icons/pi";


enum ToolStage {
    PREVIEW, ADJUSTING, MOVING
}


export function Canvas() {
    const data = useCanvas();

    return (
        <section className="relative overflow-auto p-app__area-content p-app__block">
            <nav className={`absolute h-[40px] z-10 m-2 rounded-lg shadow-lg bg-accent text-accent-content top-left row space-x-2 p-2`}>
                {data.toolSettings.leftTool === "eraser" && (<>
                    <div aria-label="erase all pixel with the same color"
                        data-tip="toggle erase area"
                        data-for="tooltip"
                        onClick={() => data.setToolSettings({ ...data.toolSettings, eraseAll: !data.toolSettings.eraseAll })}
                        className={`bg-base-100 p-1 rounded-md cursor-pointer ${data.toolSettings.eraseAll ? "bg-primary" : ""}`}>
                        <FaDroplet className={` ${data.toolSettings.eraseAll ? "text-primary-content" : "text-base-content"}`} />
                    </div>
                </>)}

                {data.toolSettings.leftTool === "bucket" && (<>
                    <div aria-label="continuous / global fill toggle for bucket tool"
                        data-tip="toggle global fill"
                        data-for="tooltip"
                        onClick={(e) => data.setToolSettings({ ...data.toolSettings, fillAll: !data.toolSettings.fillAll })}
                        className={`bg-base-100 p-1 rounded-md cursor-pointer ${data.toolSettings.fillAll ? "bg-primary" : ""}`}>
                        <FaCloud className={` ${data.toolSettings.fillAll ? "text-primary-content" : "text-base-content"}`} />
                    </div>
                </>)}

                {data.toolSettings.leftTool === "spray" && (<>
                    <label className="row">
                        <input data-tip="density"
                            data-for="tooltip"
                            aria-label="spray density"
                            type="number"
                            min="1"
                            max="10"
                            step="1"
                            className="input input-xs"
                            value={data.toolSettings.spray.density}
                            onChange={(e) => data.setToolSettings({ ...data.toolSettings, spray: { density: e.currentTarget.valueAsNumber } })} />
                    </label>
                </>)}

                {data.toolSettings.leftTool === "mirror" && (<>
                    <label className="row"
                        data-tip="mirror x & y axis"
                        data-for="tooltip">
                        <FaArrowsAlt className="inline mr-1 text-lg text-accent-content" />
                        <input aria-label="mirror x and y axis"
                            type="radio"
                            className="radio radio-xs radio-secondary"
                            name="mirror-type"
                            checked={data.toolSettings.mirror.x && data.toolSettings.mirror.y}
                            onClick={() => data.setToolSettings({ ...data.toolSettings, mirror: { x: true, y: true } })} />
                    </label>
                    <label className="row"
                        data-tip="mirror x axis"
                        data-for="tooltip">
                        <FaArrowsAltH className="inline mr-1 text-lg text-accent-content" />
                        <input aria-label="mirror x axis"
                            type="radio"
                            className="radio radio-xs radio-secondary"
                            name="mirror-type"
                            checked={data.toolSettings.mirror.x && !data.toolSettings.mirror.y}
                            onClick={() => data.setToolSettings({ ...data.toolSettings, mirror: { x: true, y: false } })} />
                    </label>
                    <label className="row"
                        data-tip="mirror y axis"
                        data-for="tooltip">
                        <FaArrowsAltV className="inline mr-1 text-lg text-accent-content" />
                        <input aria-label="mirror y axis"
                            type="radio"
                            className="radio radio-xs radio-secondary"
                            name="mirror-type"
                            checked={data.toolSettings.mirror.y && !data.toolSettings.mirror.x}
                            onClick={() => data.setToolSettings({ ...data.toolSettings, mirror: { x: false, y: true } })} />
                    </label>
                </>)}

                {data.toolSettings.leftTool === "shape" && (<>
                    <div aria-label="fill shapes in with active color"
                        data-tip="fill shape"
                        data-for="tooltip"
                        onClick={e => data.setToolSettings({ ...data.toolSettings, fillShape: !data.toolSettings.fillShape })}
                        className={`bg-base-100 p-1 rounded-md cursor-pointer ${data.toolSettings.fillShape ? "bg-primary" : ""}`}>
                        <FaFill className={` ${data.toolSettings.fillShape ? "text-primary-content" : "text-base-content"}`} />
                    </div>

                    <label data-tip="square"
                        data-for="tooltip"
                        className="flex row">
                        <TbSquareFilled className="mr-1 text-lg text-accent-content" />
                        <input aria-label="set shape to square"
                            type="radio"
                            name="shape"
                            className="radio radio-xs radio-secondary"
                            value="square"
                            onClick={(e) => data.setToolSettings({ ...data.toolSettings, shape: e.currentTarget.value as any })}
                        />
                    </label>
                    <label data-tip="rectangle"
                        data-for="tooltip"
                        className="flex row">
                        <TbRectangleFilled className="mr-1 text-lg text-accent-content" />
                        <input aria-label="set shape to rectangle"
                            type="radio"
                            name="shape"
                            className="radio radio-xs radio-secondary"
                            value="rect"
                            defaultChecked={true}
                            onClick={(e) => data.setToolSettings({ ...data.toolSettings, shape: e.currentTarget.value as any })}
                        />
                    </label>
                    <label data-tip="circle"
                        data-for="tooltip"
                        className="flex row">
                        <TbCircleFilled className="mr-1 text-lg text-accent-content" />
                        <input aria-label="set shape to circle"
                            type="radio"
                            name="shape"
                            className="radio radio-xs radio-secondary"
                            value="circle"
                            onClick={(e) => data.setToolSettings({ ...data.toolSettings, shape: e.currentTarget.value as any })}
                        />
                    </label>
                    <label data-tip="oval"
                        data-for="tooltip"
                        className="flex row">
                        <TbOvalFilled className="mr-1 text-lg text-accent-content" />
                        <input aria-label="set shape to oval"
                            type="radio"
                            name="shape"
                            className="radio radio-xs radio-secondary"
                            value="oval"
                            onClick={(e) => data.setToolSettings({ ...data.toolSettings, shape: e.currentTarget.value as any })}
                        />
                    </label>
                </>)}

                {data.toolSettings.leftTool === "light" && (<>
                    <div aria-label="toggle dark mode"
                        data-tip="toggle dark mode"
                        data-for="tooltip"
                        onClick={(e) => data.setToolSettings({ ...data.toolSettings, lightMode: data.toolSettings.lightMode == "light" ? "dark" : "light" })}
                        className={`bg-base-100 p-1 rounded-md cursor-pointer ${data.toolSettings.lightMode == "light" ? "" : "bg-primary"}`}>

                        {data.toolSettings.lightMode == "light" ?
                            <FaSun className="text-base-content" /> :
                            <FaMoon className="text-primary-content" />}
                    </div>

                    <input aria-label="light intensity value"
                        data-tip="dark/light intensity"
                        data-for="tooltip"
                        value={data.toolSettings.lightIntensity}
                        onChange={(e) => data.setToolSettings({ ...data.toolSettings, lightIntensity: e.currentTarget.valueAsNumber })}
                        type="range" min="1" max="20" className="mr-2 range range-xs range-secondary" step=".5" />
                </>)}

                {data.toolSettings.leftTool === "wand" && (<>
                    <div data-tip="select by color"
                        data-for="tooltip"
                        onClick={() => data.setToolSettings({ ...data.toolSettings, wandSelectAll: !data.toolSettings.wandSelectAll })}
                        className={`bg-base-100 p-1 rounded-md cursor-pointer ${data.toolSettings.wandSelectAll ? "bg-primary" : ""}`}>
                        <IoColorFill className={` ${data.toolSettings.wandSelectAll ? "text-primary-content" : "text-base-content"}`} />
                    </div>
                </>)}

                {["box", "wand", "lasso"].includes(data.toolSettings.leftTool) && (<>
                    <button onClick={data.saveAsBrush}
                        className="btn btn-sm">
                        <FaBrush className="text-lg" />
                        save as brush
                    </button>
                </>)}

                {data.toolSettings.leftTool === "brush" && (<>
                    <div className="space-x-1 row">
                        <div data-tip="toggle fill mode"
                            data-for="tooltip"
                            onClick={() => data.setToolSettings({ ...data.toolSettings, brush: { ...data.toolSettings.brush, fill: !data.toolSettings.brush.fill } })}
                            className={`bg-base-100 p-1 rounded-md cursor-pointer ${data.toolSettings.brush.fill ? "bg-primary" : ""}`}>
                            <BsBucketFill className={` ${data.toolSettings.brush.fill ? "text-primary-content" : "text-base-content"}`} />
                        </div>
                        <div data-tip="toggle pixel perfect"
                            data-for="tooltip"
                            onClick={() => data.setToolSettings({ ...data.toolSettings, brush: { ...data.toolSettings.brush, pixelPerfect: !data.toolSettings.brush.pixelPerfect } })}
                            className={`bg-base-100 p-1 rounded-md cursor-pointer ${data.toolSettings.brush.pixelPerfect ? "bg-primary" : ""}`}>
                            <BsStars className={` ${data.toolSettings.brush.pixelPerfect ? "text-primary-content" : "text-base-content"}`} />
                        </div>
                        <div data-tip="toggle mask mode"
                            data-for="tooltip"
                            onClick={() => data.setToolSettings({ ...data.toolSettings, brush: { ...data.toolSettings.brush, maskMode: !data.toolSettings.brush.maskMode } })}
                            className={`bg-base-100 p-1 rounded-md cursor-pointer ${data.toolSettings.brush.maskMode ? "bg-primary" : ""}`}>
                            <PiMaskHappyFill className={` ${data.toolSettings.brush.maskMode ? "text-primary-content" : "text-base-content"}`} />
                        </div>
                    </div>
                </>)}

                {["brush", "eraser", "light", "line", "mirror", "spray", "smudge"].includes(data.toolSettings.leftTool) && (<>
                    <div className="space-x-1 row">
                        <input aria-label="active tool size slider"
                            data-tip="brush slider ( [ ) ( ] )"
                            data-for="tooltip"
                            type="range" min="1" max="10" step="1"
                            className="range range-xs range-secondary w-[60px]"
                            value={data.toolSettings.size}
                            onChange={(e) => data.setToolSettings({ ...data.toolSettings, size: e.currentTarget.valueAsNumber })} />
                        <input aria-label="active tool size input"
                            type="number"
                            data-tip="brush size ( [ ) ( ] )"
                            data-for="tooltip"
                            value={data.toolSettings.size}
                            min={1}
                            className="input input-xs text-base-content w-[50px]"
                            onKeyUp={e => e.stopPropagation()}
                            onChange={e => {
                                data.setToolSettings({ ...data.toolSettings, size: e.currentTarget.valueAsNumber });
                            }} />
                    </div>
                </>)}

                {["brush", "eraser", "mirror"].includes(data.toolSettings.leftTool) && <>
                    <div data-tip="select brush"
                        data-for="tooltip"
                        className="dropdown dropdown-end">

                        <button tabIndex={0} className="btn btn-xs">
                            <img src={data.getActiveBrushPreview()} className="h-[12px] object-contain" style={{ imageRendering: "pixelated" }} />
                        </button>
                        <div className="w-12 rounded-md dropdown-content menu bg-base-200">
                            {data.toolSettings.brushes.map((brush, index) => (
                                <a href="#" key={index}>
                                    <img className="object-cover w-10 p-1 cursor-pointer hover:bg-primary"
                                        onClick={() => data.setToolSettings({ ...data.toolSettings, activeBrush: brush })}
                                        style={{ imageRendering: "pixelated" }}
                                        src={data.brushPreviews[index]} />
                                </a>
                            ))}
                        </div>
                    </div>
                </>}
            </nav>

            <nav className="absolute h-[40px] z-10 p-2 m-2 space-x-2 rounded-lg shadow-lg bg-accent text-accent-content top-right row">
                <input aria-label="zoom slider"
                    type="range" min="1" max="50" step="1"
                    data-tip="grid zoom"
                    data-for="tooltip"
                    className="range range-xs range-secondary"
                    style={{ width: "100px" }}
                    defaultValue={10}
                    onChange={(e) => data.setZoom(parseInt(e.target.value))} />

                <label>
                    <p hidden>height</p>
                    <input aria-label="set grid height"
                        data-tip="grid height"
                        data-for="tooltip"
                        type="number"
                        min="1"
                        max="2048"
                        className="w-16 input input-xs text-base-content"
                        value={data.canvasSize.height}
                        onKeyUp={e => e.stopPropagation()}
                        onClick={e => e.currentTarget.select()}
                        onChange={e => data.resizeHandler({ height: Math.min(2048, e.currentTarget.valueAsNumber) })} />
                </label>

                <label>
                    <p hidden>width</p>
                    <input aria-label="set grid width"
                        data-tip="grid width"
                        data-for="tooltip"
                        type="number"
                        min="1"
                        max="2048"
                        className="w-16 input input-xs text-base-content"
                        value={data.canvasSize.width}
                        onKeyUp={e => e.stopPropagation()}
                        onClick={e => e.currentTarget.select()}
                        onChange={e => data.resizeHandler({ width: Math.min(2048, e.currentTarget.valueAsNumber) })} />
                </label>

                <button aria-label="undo"
                    data-tip="undo ( ctrl + z )"
                    data-for="tooltip"
                    onClick={data.undo}
                    className="btn btn-xs">
                    <FaUndoAlt />
                </button>

                <button aria-label="redo"
                    data-tip="redo ( ctrl + shift + z )"
                    data-for="tooltip"
                    onClick={data.redo}
                    className="btn btn-xs">
                    <FaRedoAlt />
                </button>

                <div data-tip="toggle tile mode"
                    data-for="tooltip"
                    onClick={() => data.setTilemode(!data.tilemode)}
                    className={`bg-base-100 p-1 rounded-md cursor-pointer ${data.tilemode ? "bg-primary" : ""}`}>
                    <FaMap className={` ${data.tilemode ? "text-primary-content" : "text-base-content"}`} />
                </div>
            </nav>

            <section className="w-full h-full overflow-hidden row p-app__canvas-container" ref={data.mainCanvasContainer}></section>
        </section >
    )
}


function useCanvas() {
    let { toolSettings, setActiveColor, setToolSettings,
        activeColor, activeColorPalette, setActiveColorPalette,
        activeLayer, activeFrame, canvasSize, setCanvasSize, onionSkin, frames,
    } = useGlobalStore();
    let [tilemode, setTilemode] = useState(false);
    const stateCache = useRef({ activeColorPalette, activeColor, activeFrame, toolSettings, activeLayer, canvasSize, onionSkin, frames, tilemode });
    const mainCanvas = useCanvasHook();
    const saveCanvas = useCanvasHook({ willReadFrequently: true });
    const previewCanvas = useCanvasHook({ willReadFrequently: true });
    const tempCanvas1 = useCanvasHook({ willReadFrequently: true });
    const tempCanvas2 = useCanvasHook({ willReadFrequently: true });
    const undoStack = useRef<{ layerID: any; image: any; hash: any; frameID: any }[]>([]);
    const redoStack = useRef<{ layerID: any; image: any; hash: any; frameID: any }[]>([]);
    let [brushPreviews, setBrushPreviews] = useState<string[]>([]);

    const mainCanvasContainer = useRef<HTMLElement>(null);
    const mainCanvasZoom = useRef(15);
    const mouseState = useRef({
        leftDown: false,
        rightDown: false,
        middleDown: false,
        x: 0,
        y: 0,
        movementX: 0,
        movementY: 0,
    });
    const toolState = useRef({
        stage: ToolStage.PREVIEW,
        brush: { firstPoint: { x: 0, y: 0 }, previousPoint: { x: 0, y: 0 }, points: [{ x: 0, y: 0 }] },
        eraser: { previousPoint: { x: 0, y: 0 } },
        line: { activePoints: [] as { x: number; y: number; }[] },
        crop: { startPoint: { x: 0, y: 0 } },
        mirror: { previousPoint: { x: 0, y: 0 } },
        smudge: { previousPoint: { x: 0, y: 0 }, previousColor: { r: 0, g: 0, b: 0, a: 0 } },
        shape: { activePoints: [] as { x: number; y: number; }[] },
        light: { modifiedPoints: new Set(), previousPoint: { x: 0, y: 0 } },
        move: {
            imgData: null as ImageData | null,
            startPosition: { x: 0, y: 0 },
            currentPosition: { x: 0, y: 0 },
        },
        box: {
            imgData: null as ImageData | null,
            startPosition: { x: 0, y: 0 },
            currentPosition: { x: 0, y: 0 },
            startPoint: { x: 0, y: 0 },
            endPoint: { x: 0, y: 0 }
        },
        wand: {
            imgData: null as ImageData | null,
            points: [] as { x: number; y: number; }[],
            startPosition: { x: 0, y: 0 },
            currentPosition: { x: 0, y: 0 },
        },
        lasso: {
            imgData: null as ImageData | null,
            points: [] as { x: number; y: number }[],
            currentPosition: { x: 0, y: 0 },
            startPosition: { x: 0, y: 0 },
        }
    });
    const toolHandlers = {
        "brush": (x, y, toolButtonActive, preview) => {
            // center the mouse cursor in the brush 
            let width = stateCache.current.toolSettings.size;
            let height = stateCache.current.toolSettings.size;
            let centerX = x - Math.floor(width / 2);
            let centerY = y - Math.floor(height / 2);

            let { toolSettings, activeColor, activeLayer } = stateCache.current;

            if (toolButtonActive) {
                if (toolState.current.brush.previousPoint.x === 0 && toolState.current.brush.previousPoint.y === 0) {
                    toolState.current.brush.previousPoint.x = centerX;
                    toolState.current.brush.previousPoint.y = centerY;
                }
                if (toolState.current.brush.firstPoint.x === 0 && toolState.current.brush.firstPoint.y === 0) {
                    toolState.current.brush.firstPoint.x = centerX;
                    toolState.current.brush.firstPoint.y = centerY;
                }

                let start = toolState.current.brush.previousPoint;
                let end = { x: centerX, y: centerY };

                toolState.current.brush.previousPoint = { x: centerX, y: centerY };

                if (toolSettings.brush.fill) {
                    toolState.current.brush.points.push({ x: centerX, y: centerY });
                }

                saveCanvas.drawLine(start, end, toolSettings.size, activeColor, toolSettings.activeBrush, toolSettings.brush.pixelPerfect);

                if (toolSettings.brush.maskMode) {
                    tempCanvas1.putImageData(activeLayer.image);
                    tempCanvas1.getCtx().globalCompositeOperation = 'source-in';
                    tempCanvas1.drawImage(saveCanvas.getElement());
                    saveCanvas.putImageData(tempCanvas1.getImageData());

                    tempCanvas1.getCtx().globalCompositeOperation = 'source-over';
                }
            } else {
                if (toolSettings.brush.fill && toolState.current.brush.points.length > 2)
                    saveCanvas.drawPolygon(toolState.current.brush.points, true, activeColor, true);

                toolState.current.brush.previousPoint = { x: 0, y: 0 };
                toolState.current.brush.firstPoint = { x: 0, y: 0 };
                toolState.current.brush.points = [];

                if (preview) previewCanvas.drawPixel(centerX, centerY, toolSettings.size, activeColor, toolSettings.activeBrush);
            }
        },
        "eraser": (x, y, toolButtonActive, preview) => {
            let size = stateCache.current.toolSettings.eraseAll
                ? 1 : stateCache.current.toolSettings.size;
            let width = size;
            let height = size;
            let newX = x - Math.floor(width / 2);
            let newY = y - Math.floor(height / 2);

            if (toolButtonActive) {
                if (stateCache.current.toolSettings.eraseAll) {
                    tempCanvas1.putImageData(stateCache.current.activeLayer.image);
                    let points = tempCanvas1.floodFill(x, y);

                    points.forEach(point => saveCanvas.erasePixel(point.x, point.y, size));
                } else {
                    if (toolState.current.eraser.previousPoint.x === 0 && toolState.current.eraser.previousPoint.y === 0) {
                        toolState.current.eraser.previousPoint.x = newX;
                        toolState.current.eraser.previousPoint.y = newY;
                    }
                    let start = toolState.current.eraser.previousPoint;
                    let end = { x: newX, y: newY };

                    saveCanvas.drawLine(start, end, size, { r: 0, g: 0, b: 0, a: 1 }, stateCache.current.toolSettings.activeBrush);

                    toolState.current.eraser.previousPoint.x = newX;
                    toolState.current.eraser.previousPoint.y = newY;
                }
            } else {
                toolState.current.eraser.previousPoint.x = 0;
                toolState.current.eraser.previousPoint.y = 0;
                if (preview) previewCanvas.erasePixel(newX, newY, size);
            }
        },
        "bucket": (x, y, toolButtonActive, preview) => {
            if (toolButtonActive) {
                if (stateCache.current.toolSettings.fillAll) {
                    const imgData = stateCache.current.activeLayer.image;
                    const data = imgData.data;
                    const index = (x + y * imgData.width) * 4;
                    const targetColor = { r: data[index], g: data[index + 1], b: data[index + 2], a: data[index + 3] };
                    const activeColor = stateCache.current.activeColor;

                    for (let i = 0; i < data.length; i += 4) {
                        // Using a simple color match; for more complex scenarios, consider a tolerance
                        if (data[i] === targetColor.r && data[i + 1] === targetColor.g && data[i + 2] === targetColor.b && data[i + 3] === targetColor.a) {
                            // Replace with active color
                            data[i] = activeColor.r;
                            data[i + 1] = activeColor.g;
                            data[i + 2] = activeColor.b;
                            data[i + 3] = activeColor.a;
                        }
                    }

                    saveCanvas.putImageData(imgData, 0, 0);
                } else {
                    tempCanvas1.putImageData(stateCache.current.activeLayer.image);
                    let points = tempCanvas1.floodFill(x, y);

                    points.forEach(point => {
                        saveCanvas.drawPixel(point.x, point.y, 1, stateCache.current.activeColor);
                    });
                }
            } else {
                if (preview) previewCanvas.drawPixel(x, y, 1, stateCache.current.activeColor);
            }
        },
        "spray": (x, y, toolButtonActive, preview) => {
            let size = stateCache.current.toolSettings.size;
            let radius = size / 2;
            let density = stateCache.current.toolSettings.spray.density;
            let color = stateCache.current.activeColor;

            if (toolButtonActive) {
                for (let i = 0; i < density; i++) {
                    let angle = Math.random() * 2 * Math.PI; // Random angle
                    let randRadius = Math.random() * radius; // Random radius
                    let sprayX = Math.round(x + randRadius * Math.cos(angle));
                    let sprayY = Math.round(y + randRadius * Math.sin(angle));

                    saveCanvas.drawPixel(sprayX, sprayY, 1, color); // Draw a small dot at the calculated position
                }
            }
            else {
                let centerX = x - Math.floor(size / 2); // Centering the x coordinate
                let centerY = y - Math.floor(size / 2); // Centering the y coordinate
                if (preview) previewCanvas.drawPixel(centerX, centerY, stateCache.current.toolSettings.size, stateCache.current.activeColor);
            }
        },
        "line": (x, y, toolButtonActive, preview) => {
            if (!toolButtonActive && toolState.current.stage === ToolStage.PREVIEW) {
                let width = stateCache.current.toolSettings.size;
                let height = stateCache.current.toolSettings.size;
                let newX = x - Math.floor(width / 2);
                let newY = y - Math.floor(height / 2);
                if (preview) previewCanvas.drawPixel(newX, newY, stateCache.current.toolSettings.size, stateCache.current.activeColor);
            }
            if (toolButtonActive && toolState.current.stage === ToolStage.PREVIEW) {
                toolState.current.line.activePoints = [{ x: Math.floor(x), y: Math.floor(y) }];
                toolState.current.stage = ToolStage.ADJUSTING;
            } else if (toolState.current.stage === ToolStage.ADJUSTING) {
                const activePoints = toolState.current.line.activePoints;

                if (activePoints.length > 0) {
                    let width = stateCache.current.toolSettings.size;
                    let height = stateCache.current.toolSettings.size;

                    // center start point
                    const startPoint = { ...activePoints[0] };
                    startPoint.x -= Math.floor(width / 2);
                    startPoint.y -= Math.floor(height / 2);

                    // center end point
                    const endPoint = { x: Math.floor(x), y: Math.floor(y) };
                    endPoint.x -= Math.floor(width / 2);
                    endPoint.y -= Math.floor(height / 2);

                    if (preview) previewCanvas.drawLine(startPoint, endPoint, stateCache.current.toolSettings.size, stateCache.current.activeColor);

                    if (!toolButtonActive) {
                        saveCanvas.drawLine(startPoint, endPoint, stateCache.current.toolSettings.size, stateCache.current.activeColor);
                        toolState.current.stage = ToolStage.PREVIEW;
                        toolState.current.line.activePoints = [];
                    }
                }
            }
        },
        "crop": (x, y, toolButtonActive, preview) => {
            if (!toolButtonActive && toolState.current.stage === ToolStage.PREVIEW) {
                if (preview) previewCanvas.drawPixel(x, y, 1, stateCache.current.activeColor);
                return;
            }
            if (toolButtonActive && toolState.current.stage === ToolStage.PREVIEW) {
                toolState.current.crop.startPoint = { x, y };
                toolState.current.stage = ToolStage.ADJUSTING;
            }
            if (toolButtonActive && toolState.current.stage === ToolStage.ADJUSTING) {
                const startX = Math.min(toolState.current.crop.startPoint.x, x);
                const startY = Math.min(toolState.current.crop.startPoint.y, y);
                const endX = Math.max(toolState.current.crop.startPoint.x, x);
                const endY = Math.max(toolState.current.crop.startPoint.y, y);
                const width = endX - startX;
                const height = endY - startY;

                if (preview) previewCanvas.drawRect(startX, startY, width, height, stateCache.current.activeColor);
            }
            if (!toolButtonActive && toolState.current.stage === ToolStage.ADJUSTING) {
                const startX = Math.min(toolState.current.crop.startPoint.x, x);
                const startY = Math.min(toolState.current.crop.startPoint.y, y);
                const endX = Math.max(toolState.current.crop.startPoint.x, x);
                const endY = Math.max(toolState.current.crop.startPoint.y, y);

                // Draw transparent color over the entire preview canvas to remove previous previews
                let { width, height } = stateCache.current.canvasSize;
                let clearData = new ImageData(stateCache.current.activeLayer.image.data.slice(), width, height);
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        let index = (y * width + x) * 4;
                        if (!(x >= startX && x <= endX && y >= startY && y <= endY)) {
                            clearData.data[index] = 0;
                            clearData.data[index + 1] = 0;
                            clearData.data[index + 2] = 0;
                            clearData.data[index + 3] = 1;
                        }
                    }
                }
                saveCanvas.putImageData(clearData, 0, 0);

                // Reset the tool state
                toolState.current.stage = ToolStage.PREVIEW;
                toolState.current.crop.startPoint = { x: 0, y: 0 };
            }
        },
        "mirror": (x, y, toolButtonActive, preview) => {
            const { size, mirror } = stateCache.current.toolSettings;
            let newX = x - Math.floor(size / 2);
            let newY = y - Math.floor(size / 2);

            if (toolState.current.mirror.previousPoint.x === 0 && toolState.current.mirror.previousPoint.y === 0) {
                toolState.current.mirror.previousPoint.x = newX;
                toolState.current.mirror.previousPoint.y = newY;
            }

            let start = toolState.current.mirror.previousPoint;
            let end = { x: newX, y: newY };

            // Draw line for initial point
            tempCanvas1.drawLine(start, end, size, stateCache.current.activeColor, stateCache.current.toolSettings.activeBrush);

            // Calculate mirrored positions and draw lines for X and Y axis mirroring
            if (mirror.x) {
                let mirroredStartX = mainCanvas.getWidth() - start.x - size;
                let mirroredEndX = mainCanvas.getWidth() - end.x - size;
                tempCanvas1.drawLine({ x: mirroredStartX, y: start.y }, { x: mirroredEndX, y: end.y }, size, stateCache.current.activeColor, stateCache.current.toolSettings.activeBrush);
            }
            if (mirror.y) {
                let mirroredStartY = mainCanvas.getHeight() - start.y - size;
                let mirroredEndY = mainCanvas.getHeight() - end.y - size;
                tempCanvas1.drawLine({ x: start.x, y: mirroredStartY }, { x: end.x, y: mirroredEndY }, size, stateCache.current.activeColor, stateCache.current.toolSettings.activeBrush);
            }
            if (mirror.x && mirror.y) {
                let mirroredStartXY = { x: mainCanvas.getWidth() - start.x - size, y: mainCanvas.getHeight() - start.y - size };
                let mirroredEndXY = { x: mainCanvas.getWidth() - end.x - size, y: mainCanvas.getHeight() - end.y - size };
                tempCanvas1.drawLine(mirroredStartXY, mirroredEndXY, size, stateCache.current.activeColor, stateCache.current.toolSettings.activeBrush);
            }

            toolState.current.mirror.previousPoint.x = newX;
            toolState.current.mirror.previousPoint.y = newY;

            if (toolButtonActive) {
                saveCanvas.putImageData(tempCanvas1.getImageData());
            } else {
                toolState.current.mirror.previousPoint.x = 0;
                toolState.current.mirror.previousPoint.y = 0;

                if (preview) previewCanvas.putImageData(tempCanvas1.getImageData());
            }
        },
        "smudge": (x, y, toolButtonActive, preview) => {
            let radius = stateCache.current.toolSettings.size / 2;
            tempCanvas1.putImageData(stateCache.current.activeLayer.image);
            let imageData = tempCanvas1.getImageData(x - radius, y - radius, radius * 2, radius * 2);
            let data = imageData.data;
            let r = 0, g = 0, b = 0, a = 255, count = 0;
            let width = stateCache.current.toolSettings.size;
            let height = stateCache.current.toolSettings.size;
            let centerX = x - Math.floor(width / 2);
            let centerY = y - Math.floor(height / 2);

            // Loop through the pixel data to average the colors within the circle
            for (let i = 0; i < data.length; i += 4) {
                let px = (i / 4) % (radius * 2); // current pixel x position
                let py = Math.floor((i / 4) / (radius * 2)); // current pixel y position

                // Check if the pixel is within the circle
                if ((px - centerX) ** 2 + (py - centerY) ** 2 <= radius ** 2) {
                    r += data[i];
                    g += data[i + 1];
                    b += data[i + 2];
                    // a += data[i + 3];
                    count++;
                }
            }

            if (count > 0) {
                r = Math.floor(r / count);
                g = Math.floor(g / count);
                b = Math.floor(b / count);
                // a = Math.floor(a / count);
            }

            let color = { r: r, g: g, b: b, a: a };

            if (toolButtonActive) {
                saveCanvas.drawPixel(x, y, stateCache.current.toolSettings.size, color);
            } else {
                if (preview) previewCanvas.drawPixel(centerX, centerY, stateCache.current.toolSettings.size, stateCache.current.activeColor);
            }
        },
        "move": (x, y, toolButtonActive, preview) => {
            if (toolButtonActive && toolState.current.stage === ToolStage.PREVIEW) {
                toolState.current.stage = ToolStage.ADJUSTING;

                tempCanvas1.putImageData(stateCache.current.activeLayer.image);
                toolState.current.move.imgData = tempCanvas1.getImageData();
                toolState.current.move.startPosition = { x: x, y: y };
                toolState.current.move.currentPosition = {
                    x: x - toolState.current.move.startPosition.x,
                    y: y - toolState.current.move.startPosition.y
                };
            }
            if (toolState.current.stage === ToolStage.ADJUSTING) {
                // Calculate the displacement
                toolState.current.move.currentPosition.x = x - toolState.current.move.startPosition.x;
                toolState.current.move.currentPosition.y = y - toolState.current.move.startPosition.y;

                // save and draw
                let { width, height } = stateCache.current.canvasSize;
                const eraseImageData = new ImageData(width, height);

                // Fill the new ImageData with black pixels
                for (let i = 0; i < eraseImageData.data.length; i += 4) {
                    eraseImageData.data[i] = 255;
                    eraseImageData.data[i + 1] = 255;
                    eraseImageData.data[i + 2] = 255;
                    eraseImageData.data[i + 3] = 1;
                }

                tempCanvas1.putImageData(
                    toolState.current.move.imgData,
                    toolState.current.move.currentPosition.x,
                    toolState.current.move.currentPosition.y
                );
                tempCanvas2.drawImage(tempCanvas1.getElement());

                if (toolButtonActive) {
                    if (preview) previewCanvas.putImageData(eraseImageData);
                    if (preview) previewCanvas.drawImage(tempCanvas2.getElement());
                } else {
                    saveCanvas.putImageData(eraseImageData);
                    saveCanvas.drawImage(tempCanvas2.getElement());

                    toolState.current.stage = ToolStage.PREVIEW;
                    toolState.current.move.startPosition = { x: 0, y: 0 };
                    toolState.current.move.currentPosition = { x: 0, y: 0 };
                }
            }
        },
        "eyedropper": (x, y, toolButtonActive, preview) => {
            if (toolState.current.stage === ToolStage.PREVIEW) {
                let reversedLayers = stateCache.current.activeFrame.layers.slice().reverse();
                reversedLayers.forEach((layer) => {
                    let imageData = layer.image;
                    for (let i = 3; i < imageData.data.length; i += 4) {
                        imageData.data[i] *= layer.opacity / 255;
                    }

                    tempCanvas1.putImageData(imageData, 0, 0);
                    tempCanvas2.drawImage(tempCanvas1.getElement(), 0, 0);
                });

                let frameData = tempCanvas2.getImageData();
                let currentColor = {
                    r: frameData.data[(((y * frameData.width) + x) * 4)],
                    g: frameData.data[(((y * frameData.width) + x) * 4) + 1],
                    b: frameData.data[(((y * frameData.width) + x) * 4) + 2],
                    a: frameData.data[(((y * frameData.width) + x) * 4) + 3]
                };

                if (toolButtonActive) {
                    if (currentColor.a !== 0) setActiveColor(currentColor);
                    toolState.current.stage = ToolStage.ADJUSTING;
                } else {
                    let max = Math.max(stateCache.current.canvasSize.height, stateCache.current.canvasSize.width);
                    let size = Math.floor(max / 10);

                    if (preview) previewCanvas.drawCircle(x, y, size, currentColor);
                }
            }
            if (toolState.current.stage = ToolStage.ADJUSTING) {
                if (!toolButtonActive) toolState.current.stage = ToolStage.PREVIEW;
            }
        },
        "shape": (x, y, toolButtonActive, preview) => {
            if (!toolButtonActive && toolState.current.stage === ToolStage.PREVIEW) {
                if (preview) previewCanvas.drawPixel(x, y, 1, stateCache.current.activeColor);
            }
            if (toolButtonActive && toolState.current.stage === ToolStage.PREVIEW) {
                toolState.current.shape.activePoints = [{ x: Math.floor(x), y: Math.floor(y) }];
                toolState.current.stage = ToolStage.ADJUSTING;
            } else if (toolState.current.stage === ToolStage.ADJUSTING) {
                const activePoints = toolState.current.shape.activePoints;

                if (activePoints.length > 0) {
                    const start = activePoints[0];
                    const end = { x: Math.floor(x), y: Math.floor(y) };

                    if (stateCache.current.toolSettings.shape == "square") {
                        const size = Math.max(Math.abs(end.x - start.x), Math.abs(end.y - start.y));
                        const width = size;
                        const height = size;
                        const left = end.x >= start.x ? start.x : start.x - size;
                        const top = end.y >= start.y ? start.y : start.y - size;

                        tempCanvas1.drawRect(
                            left,
                            top,
                            width,
                            height,
                            stateCache.current.activeColor,
                            stateCache.current.toolSettings.fillShape,
                        );
                    }
                    if (stateCache.current.toolSettings.shape == "rect") {
                        const width = Math.abs(end.x - start.x);
                        const height = Math.abs(end.y - start.y);
                        const left = Math.min(start.x, end.x);
                        const top = Math.min(start.y, end.y);

                        tempCanvas1.drawRect(
                            left,
                            top,
                            width,
                            height,
                            stateCache.current.activeColor,
                            stateCache.current.toolSettings.fillShape,
                        );
                    }
                    if (stateCache.current.toolSettings.shape === "circle") {
                        const width = Math.abs(end.x - start.x);
                        const height = Math.abs(end.y - start.y);
                        const size = Math.max(width, height);
                        const radius = size / 2;
                        let centerX = start.x + (end.x >= start.x ? radius : -radius);
                        let centerY = start.y + (end.y >= start.y ? radius : -radius);

                        tempCanvas1.drawOval(
                            centerX,
                            centerY,
                            radius,
                            radius,
                            stateCache.current.activeColor,
                            stateCache.current.toolSettings.fillShape,
                        );
                    }
                    if (stateCache.current.toolSettings.shape === "oval") {
                        const width = Math.abs(end.x - start.x);
                        const height = Math.abs(end.y - start.y);
                        const radiusX = width / 2;
                        const radiusY = height / 2;
                        let centerX = (start.x + end.x) / 2;
                        let centerY = (start.y + end.y) / 2;

                        tempCanvas1.drawOval(
                            centerX,
                            centerY,
                            radiusX,
                            radiusY,
                            stateCache.current.activeColor,
                            stateCache.current.toolSettings.fillShape,
                        );
                    }

                    if (toolButtonActive) {
                        if (preview) previewCanvas.putImageData(tempCanvas1.getImageData());
                    } else {
                        saveCanvas.putImageData(tempCanvas1.getImageData());
                        toolState.current.stage = ToolStage.PREVIEW;
                        toolState.current.shape.activePoints = [];
                    }
                }
            }
        },
        "light": (x, y, toolButtonActive, preview) => {
            // Put the active layer image onto canvas2 for manipulation
            tempCanvas1.putImageData(stateCache.current.activeLayer.image);
            const brushSize = stateCache.current.toolSettings.size;
            const lightAdjustmentPercentage = stateCache.current.toolSettings.lightMode === "light"
                ? stateCache.current.toolSettings.lightIntensity
                : stateCache.current.toolSettings.lightIntensity * -1;

            // Calculate start and end points, ensuring they are within canvas bounds
            const startX = Math.max(-brushSize, x - Math.floor(brushSize / 2));
            const startY = Math.max(-brushSize, y - Math.floor(brushSize / 2));
            const endX = Math.min(tempCanvas1.getWidth(), startX + brushSize);
            const endY = Math.min(tempCanvas1.getHeight(), startY + brushSize);

            if (startX >= tempCanvas1.getWidth() || startY >= tempCanvas1.getHeight()) return;

            // Get the image data for the brush area
            let imgData = tempCanvas1.getImageData(startX, startY, endX - startX, endY - startY);
            let data = imgData.data;

            // Iterate over each pixel in the brush area
            for (let j = startY; j < endY; j++) {
                for (let i = startX; i < endX; i++) {
                    // Calculate the index for the pixel data array
                    let index = (j - startY) * (endX - startX) * 4 + (i - startX) * 4;
                    let pixelKey = `${i},${j}`;

                    // Check if the pixel has not been modified or if the tool button is not active
                    if (!toolState.current.light.modifiedPoints.has(pixelKey) || !toolButtonActive) {
                        let pixelColor = `rgba(${data[index]}, ${data[index + 1]}, ${data[index + 2]}, ${data[index + 3] / 255})`;
                        let color = tinycolor(pixelColor);
                        let hsl = color.toHsl();

                        // Adjust lightness, hue, and saturation
                        hsl.l += lightAdjustmentPercentage / 100;
                        hsl.l = Math.min(1, Math.max(0, hsl.l));
                        if (lightAdjustmentPercentage > 0) {
                            let orangeRate = lightAdjustmentPercentage / 20;
                            hsl.h = Math.max(20, hsl.h - orangeRate); // Towards orange for brightness
                            hsl.s = Math.min(1, hsl.s + 0.1); // Increase saturation
                        } else {
                            let blueRate = lightAdjustmentPercentage / 20;
                            hsl.h = Math.min(250, hsl.h + blueRate); // Towards blue for darkness
                            hsl.s = Math.min(1, hsl.s + 0.1); // Increase saturation
                        }

                        // Convert back to RGB and update the pixel data
                        let newColor = tinycolor(hsl).toRgb();
                        data[index] = newColor.r;
                        data[index + 1] = newColor.g;
                        data[index + 2] = newColor.b;

                        // Add the pixel to the set of modified points
                        toolState.current.light.modifiedPoints.add(pixelKey);
                    }
                }
            }

            if (toolButtonActive) {
                saveCanvas.putImageData(imgData, startX, startY);
            } else {
                toolState.current.light.modifiedPoints.clear();
                if (preview) previewCanvas.putImageData(imgData, startX, startY);
            }
        },
        "box": (x, y, toolButtonActive, preview) => {
            if (!toolButtonActive && toolState.current.stage === ToolStage.PREVIEW) {
                if (preview) previewCanvas.drawPixel(x, y, 1, { r: 0, g: 0, b: 0, a: 255 });
                return;
            }
            if (toolButtonActive && toolState.current.stage === ToolStage.PREVIEW) {
                toolState.current.box.startPoint = { x, y };
                toolState.current.stage = ToolStage.ADJUSTING;
            }
            if (toolButtonActive && toolState.current.stage === ToolStage.ADJUSTING) {
                const startX = Math.min(toolState.current.box.startPoint.x, x);
                const startY = Math.min(toolState.current.box.startPoint.y, y);
                const endX = Math.max(toolState.current.box.startPoint.x, x);
                const endY = Math.max(toolState.current.box.startPoint.y, y);
                const width = endX - startX;
                const height = endY - startY;

                if (preview) previewCanvas.drawRect(startX, startY, width, height, { r: 0, g: 0, b: 0, a: 255 });
            }
            if (!toolButtonActive && toolState.current.stage === ToolStage.ADJUSTING) {
                const startX = Math.min(toolState.current.box.startPoint.x, x);
                const startY = Math.min(toolState.current.box.startPoint.y, y);
                const endX = Math.max(toolState.current.box.startPoint.x, x);
                const endY = Math.max(toolState.current.box.startPoint.y, y);

                let { height, width } = stateCache.current.activeLayer.image;
                let img = new ImageData(width, height);

                for (let i = 0; i < img.data.length; i += 4) {
                    let x = i / 4 % width;
                    let y = Math.floor(i / 4 / width);

                    if (x >= startX && x <= endX && y >= startY && y <= endY) {
                        let r = stateCache.current.activeLayer.image.data[i];
                        let g = stateCache.current.activeLayer.image.data[i + 1];
                        let b = stateCache.current.activeLayer.image.data[i + 2];
                        let a = stateCache.current.activeLayer.image.data[i + 3];

                        img.data[i] = r;
                        img.data[i + 1] = g;
                        img.data[i + 2] = b;
                        img.data[i + 3] = a;
                    }
                }

                toolState.current.box.imgData = img;
                toolState.current.box.startPoint = { x: startX, y: startY };
                toolState.current.box.endPoint = { x: endX, y: endY };

                if (startX !== endX && startY !== endY)
                    toolState.current.stage = ToolStage.MOVING;
                else
                    toolState.current.stage = ToolStage.PREVIEW;
            }
            if (toolState.current.stage === ToolStage.MOVING) {
                // set the inital drag point
                if (toolButtonActive &&
                    toolState.current.box.startPosition.x === 0 &&
                    toolState.current.box.startPosition.y === 0
                ) {
                    toolState.current.box.startPosition = { x, y };
                    toolState.current.box.currentPosition = {
                        x: x - toolState.current.box.startPosition.x,
                        y: y - toolState.current.box.startPosition.y
                    };
                }

                const { startPoint, endPoint } = toolState.current.box;
                let currentX = toolState.current.box.currentPosition.x;
                let currentY = toolState.current.box.currentPosition.y;
                let newStartX = Math.floor(startPoint.x + currentX);
                let newStartY = Math.floor(startPoint.y + currentY);
                let newEndX = Math.floor(endPoint.x + currentX);
                let newEndY = Math.floor(endPoint.y + currentY);
                let selectionWidth = newEndX - newStartX;
                let selectionheight = newEndY - newStartY;

                let pointIsInsideBoundery = x >= newStartX && x <= newEndX && y >= newStartY && y <= newEndY;

                let { width, height } = toolState.current.box.imgData!;
                const eraseImageData = new ImageData(width, height);

                for (let i = 0; i < eraseImageData.data.length; i += 4) {
                    let r = toolState.current.box.imgData!.data[i];
                    let g = toolState.current.box.imgData!.data[i + 1];
                    let b = toolState.current.box.imgData!.data[i + 2];
                    let a = toolState.current.box.imgData!.data[i + 3];

                    if (r != 0 || g != 0 || b != 0 || a > 1) {
                        eraseImageData.data[i] = 255;
                        eraseImageData.data[i + 1] = 255;
                        eraseImageData.data[i + 2] = 255;
                        eraseImageData.data[i + 3] = 1;
                    }
                }

                tempCanvas1.putImageData(
                    toolState.current.box.imgData,
                    toolState.current.box.currentPosition.x,
                    toolState.current.box.currentPosition.y,
                );
                tempCanvas2.drawImage(tempCanvas1.getElement());

                if (preview) previewCanvas.putImageData(eraseImageData);
                if (preview) previewCanvas.drawImage(tempCanvas2.getElement());
                if (preview) previewCanvas.drawRect(newStartX, newStartY, selectionWidth, selectionheight, { r: 0, g: 0, b: 0, a: 255 });

                //preview
                if (pointIsInsideBoundery && toolButtonActive) {
                    toolState.current.box.currentPosition.x = x - toolState.current.box.startPosition.x;
                    toolState.current.box.currentPosition.y = y - toolState.current.box.startPosition.y;
                }

                let outsideOfSelection = !(pointIsInsideBoundery) && toolButtonActive;

                //save
                if (outsideOfSelection) {
                    saveCanvas.putImageData(eraseImageData);
                    saveCanvas.drawImage(tempCanvas2.getElement());

                    toolState.current.stage = ToolStage.PREVIEW;
                    toolState.current.box.startPosition = { x: 0, y: 0 };
                    toolState.current.box.currentPosition = { x: 0, y: 0 };
                    toolState.current.box.startPoint = { x: 0, y: 0 };
                    toolState.current.box.endPoint = { x: 0, y: 0 };
                    toolState.current.box.imgData = null;
                }
            }
        },
        "wand": (x, y, toolButtonActive, preview) => {
            if (!toolButtonActive && toolState.current.stage === ToolStage.PREVIEW) {
                if (preview) previewCanvas.drawPixel(x, y, 1, { r: 0, g: 0, b: 0, a: 255 });
                return;
            }
            if (toolButtonActive && toolState.current.stage === ToolStage.PREVIEW) {
                tempCanvas1.putImageData(stateCache.current.activeLayer.image);
                let points = tempCanvas1.floodFill(x, y);
                let color = tempCanvas1.getColor(x, y);

                if (stateCache.current.toolSettings.wandSelectAll) {
                    const imgData = stateCache.current.activeLayer.image;
                    const data = imgData.data;
                    points = [];

                    for (let i = 0; i < data.length; i += 4) {
                        if (data[i] === color.r && data[i + 1] === color.g && data[i + 2] === color.b && data[i + 3] === color.a) {
                            points.push({ x: i / 4 % imgData.width, y: Math.floor(i / 4 / imgData.width) });
                        }
                    }
                }

                if (color.a === 0) return;

                toolState.current.wand.points = points;
                toolState.current.wand.startPosition = { x, y };
                toolState.current.wand.currentPosition = {
                    x: x - toolState.current.wand.startPosition.x,
                    y: y - toolState.current.wand.startPosition.y
                };

                let { height, width } = stateCache.current.activeLayer.image;
                let img = new ImageData(width, height);
                points.forEach(point => {
                    let index = (point.y * width + point.x) * 4;
                    let r = stateCache.current.activeLayer.image.data[index];
                    let g = stateCache.current.activeLayer.image.data[index + 1];
                    let b = stateCache.current.activeLayer.image.data[index + 2];
                    let a = stateCache.current.activeLayer.image.data[index + 3];

                    img.data[index] = r;
                    img.data[index + 1] = g;
                    img.data[index + 2] = b;
                    img.data[index + 3] = a;
                });

                toolState.current.wand.imgData = img;
                toolState.current.stage = ToolStage.MOVING;
            }
            if (toolState.current.stage === ToolStage.MOVING) {
                let newPoints: { x: number, y: number }[] = [];
                toolState.current.wand.points.forEach(point => {
                    let currentX = toolState.current.wand.currentPosition.x;
                    let currentY = toolState.current.wand.currentPosition.y;
                    let newPoint = { x: Math.floor(point.x + currentX), y: Math.floor(point.y + currentY) };

                    newPoints.push(newPoint);
                });

                let boundery = tempCanvas1.getBoundary(newPoints);
                let pointIsInsideBoundery = x >= boundery[0].x
                    && x <= boundery[1].x
                    && y >= boundery[0].y
                    && y <= boundery[3].y;

                let { width, height } = toolState.current.wand.imgData!;
                const eraseImageData = new ImageData(width, height);

                for (let i = 0; i < eraseImageData.data.length; i += 4) {
                    let r = toolState.current.wand.imgData!.data[i];
                    let g = toolState.current.wand.imgData!.data[i + 1];
                    let b = toolState.current.wand.imgData!.data[i + 2];
                    let a = toolState.current.wand.imgData!.data[i + 3];

                    if (r != 0 || g != 0 || b != 0 || a > 1) {
                        eraseImageData.data[i] = 255;
                        eraseImageData.data[i + 1] = 255;
                        eraseImageData.data[i + 2] = 255;
                        eraseImageData.data[i + 3] = 1;
                    }
                }

                tempCanvas1.putImageData(
                    toolState.current.wand.imgData,
                    toolState.current.wand.currentPosition.x,
                    toolState.current.wand.currentPosition.y,
                );
                tempCanvas2.drawImage(tempCanvas1.getElement());

                if (preview) previewCanvas.putImageData(eraseImageData);
                if (preview) previewCanvas.drawImage(tempCanvas2.getElement());
                if (preview) previewCanvas.drawPolygon(tempCanvas1.getBoundary(newPoints), true, { r: 0, g: 0, b: 0, a: 255 });

                if (pointIsInsideBoundery && toolButtonActive) {
                    toolState.current.wand.currentPosition.x = x - toolState.current.wand.startPosition.x;
                    toolState.current.wand.currentPosition.y = y - toolState.current.wand.startPosition.y;
                }

                let outsideOfSelection = !(pointIsInsideBoundery) && toolButtonActive;

                // save
                if (outsideOfSelection) {
                    saveCanvas.putImageData(eraseImageData);
                    saveCanvas.drawImage(tempCanvas2.getElement());

                    toolState.current.stage = ToolStage.PREVIEW;
                    toolState.current.wand.startPosition = { x: 0, y: 0 };
                    toolState.current.wand.currentPosition = { x: 0, y: 0 };
                    toolState.current.wand.points = [];
                    toolState.current.wand.imgData = null;
                }
            }
        },
        "lasso": (x, y, toolButtonActive, preview) => {
            if (!toolButtonActive && toolState.current.stage === ToolStage.PREVIEW) {
                if (preview) previewCanvas.drawPixel(x, y, 1, { r: 0, g: 0, b: 0, a: 255 });
                return;
            }
            if (toolButtonActive && toolState.current.stage === ToolStage.PREVIEW) {
                toolState.current.lasso.points.push({ x, y });
                toolState.current.stage = ToolStage.ADJUSTING;
            }
            if (toolButtonActive && toolState.current.stage === ToolStage.ADJUSTING) {
                let lastPoint = toolState.current.lasso.points[toolState.current.lasso.points.length - 1];
                if (x !== lastPoint.x || y !== lastPoint.y)
                    toolState.current.lasso.points.push({ x, y });

                let points = toolState.current.lasso.points;
                if (preview) previewCanvas.drawPolygon(points, true, { r: 0, g: 0, b: 0, a: 255 });
            }
            if (!toolButtonActive && toolState.current.stage === ToolStage.ADJUSTING) {
                let points = toolState.current.lasso.points;
                let allPoints = tempCanvas1.getPointsInPolygon(points);

                let { height, width } = stateCache.current.activeLayer.image;
                let img = new ImageData(width, height);

                allPoints.forEach(point => {
                    let index = (point.y * width + point.x) * 4;
                    let r = stateCache.current.activeLayer.image.data[index];
                    let g = stateCache.current.activeLayer.image.data[index + 1];
                    let b = stateCache.current.activeLayer.image.data[index + 2];
                    let a = stateCache.current.activeLayer.image.data[index + 3];

                    img.data[index] = r;
                    img.data[index + 1] = g;
                    img.data[index + 2] = b;
                    img.data[index + 3] = a;
                });

                toolState.current.lasso.imgData = img;

                if (allPoints.length > 0)
                    toolState.current.stage = ToolStage.MOVING;
                else
                    toolState.current.stage = ToolStage.PREVIEW;
            }
            if (toolState.current.stage === ToolStage.MOVING) {
                // set the inital drag point
                if (toolButtonActive &&
                    toolState.current.lasso.startPosition.x === 0 &&
                    toolState.current.lasso.startPosition.y === 0
                ) {
                    toolState.current.lasso.startPosition = { x, y };
                    toolState.current.lasso.currentPosition = {
                        x: x - toolState.current.lasso.startPosition.x,
                        y: y - toolState.current.lasso.startPosition.y
                    };
                }

                let newPoints: { x: number, y: number }[] = [];
                toolState.current.lasso.points.forEach(point => {
                    let currentX = toolState.current.lasso.currentPosition.x;
                    let currentY = toolState.current.lasso.currentPosition.y;
                    let newPoint = { x: Math.floor(point.x + currentX), y: Math.floor(point.y + currentY) };

                    newPoints.push(newPoint);
                });

                let boundery = tempCanvas1.getBoundary(newPoints);
                let pointIsInsideBoundery = x >= boundery[0].x
                    && x <= boundery[1].x
                    && y >= boundery[0].y
                    && y <= boundery[3].y;

                let { width, height } = toolState.current.lasso.imgData!;
                const eraseImageData = new ImageData(width, height);

                for (let i = 0; i < eraseImageData.data.length; i += 4) {
                    let r = toolState.current.lasso.imgData!.data[i];
                    let g = toolState.current.lasso.imgData!.data[i + 1];
                    let b = toolState.current.lasso.imgData!.data[i + 2];
                    let a = toolState.current.lasso.imgData!.data[i + 3];

                    if (r != 0 || g != 0 || b != 0 || a > 1) {
                        eraseImageData.data[i] = 255;
                        eraseImageData.data[i + 1] = 255;
                        eraseImageData.data[i + 2] = 255;
                        eraseImageData.data[i + 3] = 1;
                    }
                }

                tempCanvas1.putImageData(
                    toolState.current.lasso.imgData,
                    toolState.current.lasso.currentPosition.x,
                    toolState.current.lasso.currentPosition.y,
                );
                tempCanvas2.drawImage(tempCanvas1.getElement());

                if (preview) previewCanvas.putImageData(eraseImageData);
                if (preview) previewCanvas.drawImage(tempCanvas2.getElement());
                if (preview) previewCanvas.drawPolygon(tempCanvas1.getBoundary(newPoints), true, { r: 0, g: 0, b: 0, a: 255 });

                if (pointIsInsideBoundery && toolButtonActive) {
                    toolState.current.lasso.currentPosition.x = x - toolState.current.lasso.startPosition.x;
                    toolState.current.lasso.currentPosition.y = y - toolState.current.lasso.startPosition.y;
                }

                let outsideOfSelection = !(pointIsInsideBoundery) && toolButtonActive;

                // save
                if (outsideOfSelection) {
                    saveCanvas.putImageData(eraseImageData);
                    saveCanvas.drawImage(tempCanvas2.getElement());

                    toolState.current.stage = ToolStage.PREVIEW;
                    toolState.current.lasso.startPosition = { x: 0, y: 0 };
                    toolState.current.lasso.currentPosition = { x: 0, y: 0 };
                    toolState.current.lasso.points = [];
                    toolState.current.lasso.imgData = null;
                }
            }
        },
    };

    useShortcuts({
        "control+z": undo,
        "meta+z": undo,
        "control+shift+z": redo,
        "meta+shift+z": redo,
        "[": () => setBrushSize(-1),
        "]": () => setBrushSize(1),
    });

    // update brush previews
    useEffect(() => {
        let previews: string[] = [];
        toolSettings.brushes.forEach(brush => {
            tempCanvas1.resize(brush.width, brush.height);
            tempCanvas1.putImageData(brush);

            previews.push(tempCanvas1.toDataURL());
        });

        tempCanvas1.resize(canvasSize.width, canvasSize.height);
        setBrushPreviews(previews);
    }, [toolSettings.brushes]);

    // animation loop
    useEffect(() => {
        (function render() {
            requestAnimationFrame(render);
            paint();
        })();
    }, []);

    // undo loop
    useEffect(() => {
        setInterval(saveCanvasState, 1000);
    }, []);

    // mouse event listeners
    useEffect(() => {
        const setMouseState = e => {
            let clientX = e.clientX;
            let clientY = e.clientY;
            let movementX = e.movementX;
            let movementY = e.movementY;

            if (e.touches) {
                if (e.touches[0]) {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                    // Calculating movementX/Y for touch by comparing with last position
                    movementX = clientX - (mouseState.current.x || clientX);
                    movementY = clientY - (mouseState.current.y || clientY);
                }
            }

            mouseState.current = {
                ...mouseState.current,
                x: clientX,
                y: clientY,
                movementX: movementX,
                movementY: movementY,
            }

            switch (e.type) {
                case "mousedown":
                    if (e.button === 0) mouseState.current.leftDown = true;
                    if (e.button === 1) mouseState.current.middleDown = true;
                    if (e.button === 2) mouseState.current.rightDown = true;
                    break;
                case "mouseup":
                    if (e.button === 0) mouseState.current.leftDown = false;
                    if (e.button === 1) mouseState.current.middleDown = false;
                    if (e.button === 2) mouseState.current.rightDown = false;
                    break;
                case "touchstart":
                    mouseState.current.leftDown = true;
                    break;
                case "touchend":
                    mouseState.current.leftDown = false;
                    break;
            }
        };

        const canvasContainer = document.querySelector(".p-app__canvas-container");

        canvasContainer!.addEventListener('mousedown', setMouseState, { passive: true });
        document.addEventListener('mouseup', setMouseState, { passive: true });
        document.addEventListener('mousemove', setMouseState, { passive: true });

        canvasContainer!.addEventListener('touchstart', setMouseState, { passive: true });
        document.addEventListener('touchend', setMouseState, { passive: true });
        document.addEventListener('touchmove', setMouseState, { passive: true });

        canvasContainer!.addEventListener('wheel', (e: any) => {
            e.preventDefault();
            e.stopPropagation();

            let max = Math.max(stateCache.current.canvasSize.width, stateCache.current.canvasSize.height);
            let baseSpeed = .5;
            let speed = Math.log(max) / Math.log(max / baseSpeed);
            let delta = e.deltaY > 0 ? -(speed) : (speed);
            setZoom(mainCanvasZoom.current + delta);
        }, { passive: false });

        return () => {
            canvasContainer!.removeEventListener('mousedown', setMouseState);
            document.removeEventListener('mouseup', setMouseState);
            document.removeEventListener('mousemove', setMouseState);
        };
    }, []);

    // reset toolState
    useEffect(() => {
        toolState.current.stage = ToolStage.PREVIEW;
    }, [toolSettings.leftTool, toolSettings.rightTool]);

    // canvas setup 
    useEffect(() => {
        mainCanvas.getCtx().imageSmoothingEnabled = false;
        mainCanvasContainer.current?.appendChild(mainCanvas.getElement());

        mainCanvas.getElement().classList.add(...["p-app__canvas-elm"]);
        mainCanvas.resize(canvasSize.width, canvasSize.height);
        saveCanvas.resize(canvasSize.width, canvasSize.height);
        previewCanvas.resize(canvasSize.width, canvasSize.height);
        tempCanvas1.resize(canvasSize.width, canvasSize.height);
        tempCanvas2.resize(canvasSize.width, canvasSize.height);

        setZoom(mainCanvasZoom.current);
    }, []);

    // update state cache
    useEffect(() => {
        stateCache.current = { activeColorPalette, activeColor, toolSettings, activeLayer, activeFrame, canvasSize, onionSkin, frames, tilemode };
    }, [activeColorPalette, activeColor, toolSettings, activeLayer, activeFrame, canvasSize, onionSkin, frames, tilemode]);

    // resize canvas and layers
    useEffect(() => {
        mainCanvas.resize(canvasSize.width, canvasSize.height);
        saveCanvas.resize(canvasSize.width, canvasSize.height);
        previewCanvas.resize(canvasSize.width, canvasSize.height);
        tempCanvas1.resize(canvasSize.width, canvasSize.height);
        tempCanvas2.resize(canvasSize.width, canvasSize.height);

        const centerImageData = (oldImageData, newWidth, newHeight) => {
            const startX = Math.max(0, Math.floor((newWidth - oldImageData.width) / 2));
            const startY = Math.max(0, Math.floor((newHeight - oldImageData.height) / 2));
            saveCanvas.resize(newWidth, newHeight);
            saveCanvas.putImageData(oldImageData, startX, startY);
            return saveCanvas.getImageData();
        };

        frames.forEach(frame => {
            frame.layers.forEach(layer => {
                layer.image = centerImageData(layer.image, canvasSize.width, canvasSize.height);
            });
        });

        setZoom(mainCanvasZoom.current);
    }, [canvasSize]);

    // rebuild tooltip
    useEffect(() => { ReactTooltip.rebuild() }, [toolSettings]);

    function setBrushSize(delta: number) {
        setToolSettings({ ...toolSettings, size: (toolSettings.size + delta < 1) ? 1 : (toolSettings.size + delta) });
    }

    function undo() {
        if (undoStack.current.length > 0) {
            const currentState = undoStack.current.pop();
            if (currentState) {
                redoStack.current.push({ ...currentState });

                const previousState = undoStack.current[undoStack.current.length - 1];
                if (previousState) {
                    const { image, layerID } = previousState;
                    // Find the layer to revert its image data
                    const layerToRevert = stateCache.current.activeFrame.layers.find(layer => layer.symbol === layerID);
                    if (layerToRevert) {
                        layerToRevert.image = new ImageData(
                            new Uint8ClampedArray(image.data),
                            image.width,
                            image.height
                        );
                    }
                }
            }
        }
    }

    function redo() {
        if (redoStack.current.length > 0) {
            const stateToRedo = redoStack.current.pop();
            if (stateToRedo) {
                undoStack.current.push({ ...stateToRedo });

                const { image, layerID } = stateToRedo;
                // Find the layer to apply the redone image data
                const layerToRedo = stateCache.current.activeFrame.layers.find(layer => layer.symbol === layerID);
                if (layerToRedo) {
                    layerToRedo.image = new ImageData(
                        new Uint8ClampedArray(image.data),
                        image.width,
                        image.height
                    );
                }
            }
        }
    }

    function saveCanvasState() {
        function hashImageData(imageData) {
            const data = imageData.data;
            let hash = 5381; // Starting with a prime number

            for (let i = 0; i < data.length; i += 4) {
                // Combining the RGBA values in a way that tries to ensure uniqueness
                let part = (data[i] << 24) | (data[i + 1] << 16) | (data[i + 2] << 8) | data[i + 3];
                hash = ((hash << 5) + hash) + part; // hash * 33 + part
                hash = hash & hash; // Convert to 32bit integer
            }

            return hash >>> 0; // Ensure hash is unsigned
        }

        // Extract the current state
        const currentImage = stateCache.current.activeLayer.image;
        const currentHash = hashImageData(currentImage);

        // Check if there's a previous state to compare with
        if (undoStack.current.length > 0) {
            const lastState = undoStack.current[undoStack.current.length - 1];
            const lastHash = lastState.hash;

            // If the hashes match, no need to save the state again
            if (lastHash === currentHash) return;
        }

        // If there's a change or no previous state, save the current state
        const currentState = {
            layerID: stateCache.current.activeLayer.symbol,
            frameID: stateCache.current.activeFrame.symbol,
            image: new ImageData(
                new Uint8ClampedArray(currentImage.data),
                currentImage.width,
                currentImage.height
            ),
            hash: currentHash, // Save the hash along with the state
        };

        undoStack.current.push(currentState);
        redoStack.current = []; // Optionally clear the redo stack on a new action

        // limit the undo stack size to conserve memory
        if (undoStack.current.length > 100) undoStack.current.shift();
    }

    function setZoom(zoom = 1) {
        let min;
        if (stateCache.current.canvasSize.width > stateCache.current.canvasSize.height)
            min = (mainCanvasContainer.current!.clientWidth * .6) / stateCache.current.canvasSize.width;
        else
            min = (mainCanvasContainer.current!.clientHeight * .6) / stateCache.current.canvasSize.height;

        mainCanvasZoom.current = Math.max(min, zoom);

        let translateX = 0;
        let translateY = 0;

        mainCanvas.getElement().style.transform = `scale(${mainCanvasZoom.current}) translate(${translateX}px, ${translateY}px)`;
    }

    function resizeHandler(size: { height?: number, width?: number }) {
        let newHeight = Number.isFinite(size.height) ? Math.max(1, size.height!) : canvasSize.height;
        let newWidth = Number.isFinite(size.width) ? Math.max(1, size.width!) : canvasSize.width;

        setCanvasSize({
            height: newHeight,
            width: newWidth
        });
    }

    function paint() {
        tempCanvas1.clear();
        tempCanvas2.clear();
        saveCanvas.clear();
        previewCanvas.clear();
        mainCanvas.clear();
        mainCanvas.drawGrid();

        // position relative to the canvas element
        let rect = mainCanvas.getElement().getBoundingClientRect();
        let x = Math.floor((mouseState.current.x - rect.x) * (mainCanvas.getWidth() / rect.width));
        let y = Math.floor((mouseState.current.y - rect.y) * (mainCanvas.getHeight() / rect.height));

        // run current tool
        const { leftTool, rightTool } = stateCache.current.toolSettings;
        if (rightTool) toolHandlers[rightTool](x, y, mouseState.current.rightDown, false);
        if (leftTool) toolHandlers[leftTool](x, y, mouseState.current.leftDown, true);

        // save pixels from saveCanvas to active layer
        {
            let savedImg = saveCanvas.getImageData();
            let newChange = new Uint32Array(savedImg.data.buffer).some(value => value !== 0);
            if (newChange) {
                const existingColor = stateCache.current.activeColorPalette.colors
                    .find(c => JSON.stringify(c) === JSON.stringify(stateCache.current.activeColor));
                if (!existingColor && (mouseState.current.leftDown || mouseState.current.rightDown)) {
                    const newColors = [...stateCache.current.activeColorPalette.colors, stateCache.current.activeColor];
                    setActiveColorPalette({ ...stateCache.current.activeColorPalette, colors: newColors });
                }
            }

            for (let i = 0; i < savedImg.data.length; i += 4) {
                let r = savedImg.data[i];
                let g = savedImg.data[i + 1];
                let b = savedImg.data[i + 2];
                let a = savedImg.data[i + 3];

                // paint colored pixels
                if (r != 0 || g != 0 || b != 0 || a > 5) {
                    stateCache.current.activeLayer.image!.data[i] = savedImg.data[i];
                    stateCache.current.activeLayer.image!.data[i + 1] = savedImg.data[i + 1];
                    stateCache.current.activeLayer.image!.data[i + 2] = savedImg.data[i + 2];
                    stateCache.current.activeLayer.image!.data[i + 3] = savedImg.data[i + 3];
                }

                // erase invisible pixels 
                if (a <= 5 && a >= 1) {
                    stateCache.current.activeLayer.image!.data[i] = 0;
                    stateCache.current.activeLayer.image!.data[i + 1] = 0;
                    stateCache.current.activeLayer.image!.data[i + 2] = 0;
                    stateCache.current.activeLayer.image!.data[i + 3] = 0;
                }
            }
        }

        // render previous frame
        if (stateCache.current.onionSkin != 0) {
            // find activeframe and get the previous one
            const frameIndex = stateCache.current.frames.findIndex(frame => frame.symbol === stateCache.current.activeFrame.symbol);
            const previousFrame = stateCache.current.frames[frameIndex - 1];

            if (previousFrame) {
                let reversedLayers = previousFrame.layers.slice().reverse();
                tempCanvas2.getCtx().globalAlpha = stateCache.current.onionSkin / 255;

                reversedLayers.forEach((layer) => {
                    tempCanvas2.getCtx().globalAlpha *= layer.opacity / 255;

                    tempCanvas1.putImageData(layer.image);
                    tempCanvas2.drawImage(tempCanvas1.getElement());
                    mainCanvas.drawImage(tempCanvas2.getElement());

                    tempCanvas2.getCtx().globalAlpha = stateCache.current.onionSkin / 255;
                });
            }
        }

        // render active frame
        stateCache.current.activeFrame.layers.slice().reverse().forEach((layer) => {
            tempCanvas2.getCtx().globalAlpha = layer.opacity / 255;

            // draw preview
            if (layer.symbol === stateCache.current.activeLayer.symbol) {
                let previewData = previewCanvas.getImageData();
                let activeLayerData = new ImageData(layer.image.data.slice(0), layer.image.width, layer.image.height);

                for (let i = 0; i < previewData.data.length; i += 4) {
                    let a = previewData.data[i + 3];
                    // erase invisible pixels 
                    if (a <= 5 && a >= 1) {
                        activeLayerData.data[i] = 0;
                        activeLayerData.data[i + 1] = 0;
                        activeLayerData.data[i + 2] = 0;
                        activeLayerData.data[i + 3] = 0;
                    }
                }

                tempCanvas1.putImageData(activeLayerData);
                tempCanvas2.drawImage(tempCanvas1.getElement());
                tempCanvas2.drawImage(previewCanvas.getElement());
            } else {
                tempCanvas1.putImageData(layer.image);
                tempCanvas2.drawImage(tempCanvas1.getElement());
            }

            mainCanvas.drawImage(tempCanvas2.getElement());
        });

        if (stateCache.current.tilemode) {
            let width = Math.ceil(stateCache.current.canvasSize.width * mainCanvasZoom.current);
            let height = Math.ceil(stateCache.current.canvasSize.height * mainCanvasZoom.current);
            mainCanvasContainer.current!.style.background = `url(${mainCanvas.getElement().toDataURL()}) repeat center`;
            mainCanvasContainer.current!.style.backgroundSize = `${width}px ${height}px`;
            mainCanvasContainer.current!.style.imageRendering = "pixelated";
        } else {
            mainCanvasContainer.current!.style.background = `transparent`;
        }
    }

    function saveAsBrush() {
        let { data, width, height } = toolState.current[toolSettings.leftTool].imgData;
        console.log(width, height);
        let brush = new ImageData(data.slice(), width, height);

        setToolSettings({ ...toolSettings, brushes: [...toolSettings.brushes, brush] });
        toolState.current.stage = ToolStage.PREVIEW;
    }

    function getActiveBrushPreview() {
        let index = toolSettings.brushes.findIndex(b => b === toolSettings.activeBrush);

        return brushPreviews[index];
    }

    return {
        tilemode,
        canvasSize,
        tempCanvas1,
        toolSettings,
        brushPreviews,
        mainCanvasZoom,
        mainCanvasContainer,
        undo,
        redo,
        setZoom,
        setTilemode,
        saveAsBrush,
        setBrushSize,
        resizeHandler,
        setToolSettings,
        getActiveBrushPreview,
    };
}


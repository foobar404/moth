import tinycolor from "tinycolor2";
import { FaMap } from "react-icons/fa6";
import { ImMinus } from "react-icons/im";
import ReactTooltip from 'react-tooltip';
import { BiPlusMedical } from "react-icons/bi";
import { BsCircleFill, BsCircleHalf } from "react-icons/bs";
import React, { useEffect, useRef } from 'react';
import { useCanvas as useCanvasHook, useGlobalStore, useShortcuts } from "../../utils";
import { TbCircleFilled, TbOvalFilled, TbSquareFilled, TbRectangleFilled } from "react-icons/tb";
import { FaUndoAlt, FaRedoAlt, FaMoon, FaSun, FaArrowsAlt, FaArrowsAltH, FaArrowsAltV } from "react-icons/fa";


enum ToolStage {
    PREVIEW, ADJUSTING, MOVING
}


enum MouseEvent {
    MOUSE_DOWN, MOUSE_UP, MOUSE_MOVE
}


export function Canvas() {
    const data = useCanvas();

    return (
        <section className="p-app__canvas p-app__block">
            <nav className="p-app__brush-controls !bg-accent text-accent-content">
                {data.toolSettings.leftTool === "eraser" && (<>
                    <label data-tip="erase all"
                        data-for="tooltip"
                        className="mr-2 swap swap-rotate"
                        onChange={e => data.setToolSettings({ ...data.toolSettings, eraseAll: !data.toolSettings.eraseAll })}>

                        <input type="checkbox" checked={data.toolSettings.eraseAll} />

                        <BsCircleHalf className="text-xl swap-off" />
                        <BsCircleFill className="text-xl swap-on" />
                    </label>
                </>)}

                {data.toolSettings.leftTool === "bucket" && (<>
                    <label data-tip="fill all"
                        data-for="tooltip"
                        className="p-1 space-x-1 bg-base rounded-xl row">
                        <BsCircleHalf className={``} />
                        <input
                            type="checkbox"
                            value="synthwave"
                            className="toggle toggle-sm"
                            checked={data.toolSettings.fillAll}
                            onChange={(e) => data.setToolSettings({ ...data.toolSettings, fillAll: e.currentTarget.checked })} />
                        <BsCircleFill />
                    </label>
                </>)}

                {data.toolSettings.leftTool === "mirror" && (<>
                    <label className="mr-2 row"
                        data-tip="mirror x & y axis"
                        data-for="tooltip">
                        <FaArrowsAlt className="inline mr-1 text-lg" />
                        <input type="radio"
                            className="radio radio-xs"
                            name="mirror-type"
                            checked={data.toolSettings.mirror.x && data.toolSettings.mirror.y}
                            onClick={() => data.setToolSettings({ ...data.toolSettings, mirror: { x: true, y: true } })} />
                    </label>
                    <label className="mr-2 row"
                        data-tip="mirror x axis"
                        data-for="tooltip">
                        <FaArrowsAltH className="inline mr-1 text-lg" />
                        <input type="radio"
                            className="radio radio-xs"
                            name="mirror-type"
                            checked={data.toolSettings.mirror.x && !data.toolSettings.mirror.y}
                            onClick={() => data.setToolSettings({ ...data.toolSettings, mirror: { x: true, y: false } })} />
                    </label>
                    <label className="mr-2 row"
                        data-tip="mirror y axis"
                        data-for="tooltip">
                        <FaArrowsAltV className="inline mr-1 text-lg" />
                        <input type="radio"
                            className="radio radio-xs"
                            name="mirror-type"
                            checked={data.toolSettings.mirror.y && !data.toolSettings.mirror.x}
                            onClick={() => data.setToolSettings({ ...data.toolSettings, mirror: { x: false, y: true } })} />
                    </label>
                </>)}

                {data.toolSettings.leftTool === "shape" && (<>
                    <label data-tip=""
                        data-for="tooltip"
                        className="flex mr-2 row">
                        <TbSquareFilled className="mr-1 text-lg" />
                        <input type="radio"
                            name="shape"
                            className="radio radio-xs"
                            value="square"
                            onClick={(e) => data.setToolSettings({ ...data.toolSettings, shape: e.currentTarget.value as any })}
                        />
                    </label>
                    <label data-tip=""
                        data-for="tooltip"
                        className="flex mr-2 row">
                        <TbRectangleFilled className="mr-1 text-lg" />
                        <input type="radio"
                            name="shape"
                            className="radio radio-xs"
                            value="rect"
                            defaultChecked={true}
                            onClick={(e) => data.setToolSettings({ ...data.toolSettings, shape: e.currentTarget.value as any })}
                        />
                    </label>
                    <label data-tip=""
                        data-for="tooltip"
                        className="flex mr-2 row">
                        <TbCircleFilled className="mr-1 text-lg" />
                        <input type="radio"
                            name="shape"
                            className="radio radio-xs"
                            value="circle"
                            onClick={(e) => data.setToolSettings({ ...data.toolSettings, shape: e.currentTarget.value as any })}
                        />
                    </label>
                    <label data-tip=""
                        data-for="tooltip"
                        className="flex mr-2 row">
                        <TbOvalFilled className="mr-1 text-lg" />
                        <input type="radio"
                            name="shape"
                            className="radio radio-xs"
                            value="oval"
                            onClick={(e) => data.setToolSettings({ ...data.toolSettings, shape: e.currentTarget.value as any })}
                        />
                    </label>
                </>)}

                {data.toolSettings.leftTool === "light" && (<>
                    <div className="row !flex-nowrap">
                        <div className="mr-2 swap swap-rotate"
                            data-tip="dark/light mode"
                            data-for="tooltip"
                            onClick={(e) => data.setToolSettings({ ...data.toolSettings, lightMode: data.toolSettings.lightMode == "light" ? "dark" : "light" })}>

                            <input type="checkbox" checked={data.toolSettings.lightMode === "light"} />

                            <FaSun className="text-xl swap-on" />
                            <FaMoon className="text-xl swap-off" />
                        </div>
                        <input data-tip="dark/light intensity"
                            data-for="tooltip"
                            value={data.toolSettings.lightIntensity}
                            onChange={(e) => data.setToolSettings({ ...data.toolSettings, lightIntensity: e.currentTarget.valueAsNumber })}
                            type="range" min="1" max="20" className="mr-2 range range-xs" step=".5" />
                    </div>
                </>)}

                <div className="space-x-1 row">
                    <input data-tip="set brush size"
                        data-for="tooltip"
                        type="range" min="1" max="10" step="1"
                        className="range range-xs w-[40px]"
                        value={data.toolSettings.size}
                        onChange={(e) => data.setToolSettings({ ...data.toolSettings, size: e.currentTarget.valueAsNumber })} />
                    <button data-tip="decrease brush size ( [ )"
                        data-for="tooltip"
                        className="btn btn-xs"
                        onClick={() => data.setBrushSize(-1)}>
                        <ImMinus />
                    </button>
                    <button data-tip="increase brush size ( ] )"
                        data-for="tooltip"
                        className="btn btn-xs"
                        onClick={() => data.setBrushSize(1)}>
                        <BiPlusMedical />
                    </button>
                    <span data-tip="brush size"
                        data-for="tooltip">
                        {data.toolSettings.size}
                    </span>
                </div>
            </nav>

            <nav className="space-x-2 p-app__canvas-controls !bg-accent text-accent-content">
                <input type="range" min="1" max="50" step="1"
                    data-tip="grid zoom"
                    data-for="tooltip"
                    className="range range-xs"
                    style={{ width: "100px" }}
                    defaultValue={10}
                    onChange={(e) => data.setZoom(parseInt(e.target.value))} />
                <label>
                    <p hidden>height</p>
                    <input data-tip="grid height"
                        data-for="tooltip"
                        type="number"
                        className="w-16 input input-xs"
                        value={data.canvasSize.height}
                        onChange={e => data.resizeHandler({ height: e.currentTarget.valueAsNumber })} />
                </label>
                <label>
                    <p hidden>width</p>
                    <input data-tip="grid width"
                        data-for="tooltip"
                        type="number"
                        className="w-16 input input-xs"
                        value={data.canvasSize.width}
                        onChange={e => data.resizeHandler({ width: e.currentTarget.valueAsNumber })} />
                </label>
                <button data-tip="undo ( ctrl + z )"
                    data-for="tooltip"
                    onClick={data.undo}
                    className="btn btn-xs">
                    <FaUndoAlt />
                </button>
                <button data-tip="redo ( ctrl + shift + z )"
                    data-for="tooltip"
                    onClick={data.redo}
                    className="btn btn-xs">
                    <FaRedoAlt />
                </button>
                <label data-tip="toggle tilemode"
                    data-for="tooltip"
                    className="mr-2 row">
                    <FaMap className="mr-2 text-lg" />
                    <input type="checkbox"
                        className="checkbox checkbox-xs"
                        onChange={e => data.tilemode.current = e.currentTarget.checked} />
                </label>
            </nav>

            <section className="p-app__canvas-container" ref={data.mainCanvasContainer}></section>
        </section>
    )
}

function useCanvas() {
    const { toolSettings, setActiveColor, setToolSettings,
        activeColor, activeColorPalette, setActiveColorPalette,
        colorStats, setColorStats, activeLayer, setActiveLayer,
        activeFrame, canvasSize, setCanvasSize, onionSkin, frames,
    } = useGlobalStore();
    const mainCanvasContainer = useRef<HTMLElement>(null);
    const mainCanvas = useCanvasHook();
    const saveCanvas = useCanvasHook();
    const previewCanvas = useCanvasHook();
    const tempCanvas1 = useCanvasHook();
    const tempCanvas2 = useCanvasHook();
    const undoStack = useRef<{ layerID: any; image: any; hash: any; }[]>([]);
    const redoStack = useRef<{ layerID: any; image: any; hash: any; }[]>([]);

    let tilemode = useRef(false);
    let mainCanvasZoom = useRef(15);
    let mouseState = useRef({
        leftDown: false,
        rightDown: false,
        middleDown: false,
        x: 0,
        y: 0,
        movementX: 0,
        movementY: 0,
    });
    let toolState = useRef({
        stage: ToolStage.PREVIEW,
        activePoints: [] as { x: number; y: number; }[], //remove 
        modifiedPoints: new Set(), // add key
        selectionArea: {
            imgData: null as ImageData | null,
            points: [] as { x: number; y: number; }[],
            startPosition: { x: 0, y: 0 },
            currentPosition: { x: 0, y: 0 },
            rectSelection: { startPoint: { x: 0, y: 0 }, endPoint: { x: 0, y: 0 } },
            lassoSelection: { points: [] as { x: number; y: number }[] }
        }
    });
    let stateCache = useRef({ activeColorPalette, activeColor, activeFrame, colorStats, toolSettings, activeLayer, canvasSize, onionSkin, frames });
    let keys = useShortcuts({
        "control+z": undo,
        "[": () => setBrushSize(-1),
        "]": () => setBrushSize(1),
    });
    let toolHandlers = {
        "brush": (x, y, toolButtonActive) => {
            // center the mouse cursor in the brush 
            let width = stateCache.current.toolSettings.size;
            let height = stateCache.current.toolSettings.size;
            let newX = x == 0 ? 0 : x - Math.floor(width / 2);
            let newY = y == 0 ? 0 : y - Math.floor(height / 2);

            if (toolButtonActive) {
                saveCanvas.drawPixel(newX, newY, stateCache.current.toolSettings.size);
            } else {
                previewCanvas.drawPixel(newX, newY, stateCache.current.toolSettings.size);
            }
        },
        "eraser": (x, y, toolButtonActive) => {
            let size = stateCache.current.toolSettings.eraseAll
                ? 1 : stateCache.current.toolSettings.size;
            let width = size;
            let height = size;
            let newX = x == 0 ? 0 : x - Math.floor(width / 2);
            let newY = y == 0 ? 0 : y - Math.floor(height / 2);

            if (toolButtonActive) {
                if (stateCache.current.toolSettings.eraseAll) {
                    tempCanvas1.putImageData(stateCache.current.activeLayer.image);
                    let points = tempCanvas1.floodFill(x, y);

                    points.forEach(point => saveCanvas.erasePixel(point.x, point.y, size));
                } else {
                    saveCanvas.erasePixel(newX, newY, size);
                }
            } else {
                previewCanvas.erasePixel(newX, newY, size);
            }
        },
        "bucket": (x, y, toolButtonActive) => {
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
                        saveCanvas.drawPixel(point.x, point.y);
                    });
                }
            } else {
                previewCanvas.drawPixel(x, y, 1);
            }
        },
        "line": (x, y, toolButtonActive) => {
            if (toolButtonActive && toolState.current.stage === ToolStage.PREVIEW) {
                toolState.current.activePoints = [{ x: Math.floor(x), y: Math.floor(y) }];
                toolState.current.stage = ToolStage.ADJUSTING;
            } else if (toolState.current.stage === ToolStage.ADJUSTING) {
                const activePoints = toolState.current.activePoints;

                if (activePoints.length > 0) {
                    const startPoint = activePoints[0];
                    const endPoint = { x: Math.floor(x), y: Math.floor(y) };

                    previewCanvas.drawLine(startPoint, endPoint, stateCache.current.toolSettings.size);

                    if (!toolButtonActive) {
                        saveCanvas.drawLine(startPoint, endPoint, stateCache.current.toolSettings.size);
                        toolState.current.stage = ToolStage.PREVIEW;
                        toolState.current.activePoints = [];
                    }
                }
            }
        },
        "mirror": (x, y, toolButtonActive) => {
            const { size, mirror } = stateCache.current.toolSettings;
            const mirrorX = mirror.x;
            const mirrorY = mirror.y;

            tempCanvas1.drawPixel(x, y, size);

            if (mirrorX)
                tempCanvas1.drawPixel(mainCanvas.getWidth() - x - size, y, size);

            if (mirrorY)
                tempCanvas1.drawPixel(x, mainCanvas.getHeight() - y - size, size);

            if (mirrorX && mirrorY)
                tempCanvas1.drawPixel(mainCanvas.getWidth() - x - size, mainCanvas.getHeight() - y - size, size);

            if (toolButtonActive) {
                saveCanvas.putImageData(tempCanvas1.getImageData());
            }
            else {
                previewCanvas.putImageData(tempCanvas1.getImageData());
            }
        },
        "move": (x, y, toolButtonActive) => {
            if (toolButtonActive && toolState.current.stage === ToolStage.PREVIEW) {
                toolState.current.stage = ToolStage.ADJUSTING;

                tempCanvas1.putImageData(stateCache.current.activeLayer.image);
                toolState.current.selectionArea.imgData = tempCanvas1.getImageData();
                toolState.current.selectionArea.startPosition = { x: x, y: y };
                toolState.current.selectionArea.currentPosition = {
                    x: x - toolState.current.selectionArea.startPosition.x,
                    y: y - toolState.current.selectionArea.startPosition.y
                };
            }
            if (toolState.current.stage === ToolStage.ADJUSTING) {
                // Calculate the displacement
                toolState.current.selectionArea.currentPosition.x = x - toolState.current.selectionArea.startPosition.x;
                toolState.current.selectionArea.currentPosition.y = y - toolState.current.selectionArea.startPosition.y;

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
                    toolState.current.selectionArea.imgData,
                    toolState.current.selectionArea.currentPosition.x,
                    toolState.current.selectionArea.currentPosition.y
                );
                tempCanvas2.drawImage(tempCanvas1.getElement());

                if (toolButtonActive) {
                    previewCanvas.putImageData(eraseImageData);
                    previewCanvas.drawImage(tempCanvas2.getElement());
                } else {
                    saveCanvas.putImageData(eraseImageData);
                    saveCanvas.drawImage(tempCanvas2.getElement());

                    toolState.current.stage = ToolStage.PREVIEW;
                    toolState.current.selectionArea.startPosition = { x: 0, y: 0 };
                    toolState.current.selectionArea.currentPosition = { x: 0, y: 0 };
                }
            }
        },
        "eyedropper": (x, y, toolButtonActive) => {
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
                    let { width, height } = stateCache.current.canvasSize;
                    let { r, g, b, a } = currentColor;
                    previewCanvas.drawRect(0, 0, width - 1, height - 1, `rgba(${r},${g},${b},${a / 255})`);
                }
            }
            if (toolState.current.stage = ToolStage.ADJUSTING) {
                if (!toolButtonActive) toolState.current.stage = ToolStage.PREVIEW;
            }
        },
        "shape": (x, y, toolButtonActive) => {
            if (toolButtonActive && toolState.current.stage === ToolStage.PREVIEW) {
                toolState.current.activePoints = [{ x: Math.floor(x), y: Math.floor(y) }];
                toolState.current.stage = ToolStage.ADJUSTING;
            } else if (toolState.current.stage === ToolStage.ADJUSTING) {
                const activePoints = toolState.current.activePoints;

                if (activePoints.length > 0) {
                    const start = activePoints[0];
                    const end = { x: Math.floor(x), y: Math.floor(y) };

                    if (stateCache.current.toolSettings.shape == "square" || stateCache.current.toolSettings.shape == "rect") {
                        const width = stateCache.current.toolSettings.shape == "square" ?
                            Math.max(Math.abs(end.x - start.x), Math.abs(end.y - start.y)) :
                            Math.abs(end.x - start.x);
                        const height = stateCache.current.toolSettings.shape == "square" ?
                            width :
                            Math.abs(end.y - start.y);
                        const left = Math.min(start.x, end.x);
                        const top = Math.min(start.y, end.y);

                        tempCanvas1.drawRect(left, top, width, height, stateCache.current.activeColor);
                    } else if (stateCache.current.toolSettings.shape == "circle" || stateCache.current.toolSettings.shape == "oval") {
                        const radiusX = stateCache.current.toolSettings.shape == "circle" ?
                            Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)) :
                            Math.abs(end.x - start.x) / 2;
                        const radiusY = stateCache.current.toolSettings.shape == "circle" ?
                            radiusX :
                            Math.abs(end.y - start.y) / 2;
                        const centerX = (start.x + end.x) / 2;
                        const centerY = (start.y + end.y) / 2;

                        tempCanvas1.drawOval(centerX, centerY, radiusX, radiusY, stateCache.current.activeColor);
                    }

                    if (toolButtonActive) {
                        previewCanvas.putImageData(tempCanvas1.getImageData());
                    } else {
                        saveCanvas.putImageData(tempCanvas1.getImageData());
                        toolState.current.stage = ToolStage.PREVIEW;
                        toolState.current.activePoints = [];
                    }
                }
            }
        },
        "light": (x, y, toolButtonActive) => {
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
                    if (!toolState.current.modifiedPoints.has(pixelKey) || !toolButtonActive) {
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
                        toolState.current.modifiedPoints.add(pixelKey);
                    }
                }
            }

            if (toolButtonActive) {
                saveCanvas.putImageData(imgData, startX, startY);
            } else {
                toolState.current.modifiedPoints.clear();
                previewCanvas.putImageData(imgData, startX, startY);
            }
        },
        "box": (x, y, toolButtonActive) => {
            if (!toolButtonActive && toolState.current.stage === ToolStage.PREVIEW) {
                previewCanvas.drawPixel(x, y);
                return;
            }
            if (toolButtonActive && toolState.current.stage === ToolStage.PREVIEW) {
                toolState.current.selectionArea.rectSelection.startPoint = { x, y };
                toolState.current.stage = ToolStage.ADJUSTING;
            }
            if (toolButtonActive && toolState.current.stage === ToolStage.ADJUSTING) {
                const startX = Math.min(toolState.current.selectionArea.rectSelection.startPoint.x, x);
                const startY = Math.min(toolState.current.selectionArea.rectSelection.startPoint.y, y);
                const endX = Math.max(toolState.current.selectionArea.rectSelection.startPoint.x, x);
                const endY = Math.max(toolState.current.selectionArea.rectSelection.startPoint.y, y);
                const width = endX - startX;
                const height = endY - startY;

                previewCanvas.drawRect(startX, startY, width, height, "rgba(0,0,0,1)");
            }
            if (!toolButtonActive && toolState.current.stage === ToolStage.ADJUSTING) {
                const startX = Math.min(toolState.current.selectionArea.rectSelection.startPoint.x, x);
                const startY = Math.min(toolState.current.selectionArea.rectSelection.startPoint.y, y);
                const endX = Math.max(toolState.current.selectionArea.rectSelection.startPoint.x, x);
                const endY = Math.max(toolState.current.selectionArea.rectSelection.startPoint.y, y);

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

                toolState.current.selectionArea.imgData = img;
                toolState.current.selectionArea.rectSelection.endPoint = { x, y };
                toolState.current.stage = ToolStage.MOVING;
            }
            if (toolState.current.stage === ToolStage.MOVING) {
                // set the inital drag point
                if (toolButtonActive &&
                    toolState.current.selectionArea.startPosition.x === 0 &&
                    toolState.current.selectionArea.startPosition.y === 0
                ) {
                    toolState.current.selectionArea.startPosition = { x, y };
                    toolState.current.selectionArea.currentPosition = {
                        x: x - toolState.current.selectionArea.startPosition.x,
                        y: y - toolState.current.selectionArea.startPosition.y
                    };
                }

                const { startPoint, endPoint } = toolState.current.selectionArea.rectSelection;
                let currentX = toolState.current.selectionArea.currentPosition.x;
                let currentY = toolState.current.selectionArea.currentPosition.y;
                let newStartX = Math.floor(startPoint.x + currentX);
                let newStartY = Math.floor(startPoint.y + currentY);
                let newEndX = Math.floor(endPoint.x + currentX);
                let newEndY = Math.floor(endPoint.y + currentY);
                let selectionWidth = newEndX - newStartX;
                let selectionheight = newEndY - newStartY;

                let pointIsInsideBoundery = x >= newStartX && x <= newEndX && y >= newStartY && y <= newEndY;

                let { width, height } = toolState.current.selectionArea.imgData!;
                const eraseImageData = new ImageData(width, height);

                for (let i = 0; i < eraseImageData.data.length; i += 4) {
                    let r = toolState.current.selectionArea.imgData!.data[i];
                    let g = toolState.current.selectionArea.imgData!.data[i + 1];
                    let b = toolState.current.selectionArea.imgData!.data[i + 2];
                    let a = toolState.current.selectionArea.imgData!.data[i + 3];

                    if (r != 0 || g != 0 || b != 0 || a > 1) {
                        eraseImageData.data[i] = 255;
                        eraseImageData.data[i + 1] = 255;
                        eraseImageData.data[i + 2] = 255;
                        eraseImageData.data[i + 3] = 1;
                    }
                }

                tempCanvas1.putImageData(
                    toolState.current.selectionArea.imgData,
                    toolState.current.selectionArea.currentPosition.x,
                    toolState.current.selectionArea.currentPosition.y,
                );
                tempCanvas2.drawImage(tempCanvas1.getElement());

                previewCanvas.putImageData(eraseImageData);
                previewCanvas.drawImage(tempCanvas2.getElement());
                previewCanvas.drawRect(newStartX, newStartY, selectionWidth, selectionheight, "rgba(0,0,0,1)");

                //preview
                if (pointIsInsideBoundery && toolButtonActive) {
                    toolState.current.selectionArea.currentPosition.x = x - toolState.current.selectionArea.startPosition.x;
                    toolState.current.selectionArea.currentPosition.y = y - toolState.current.selectionArea.startPosition.y;
                }

                let outsideOfCanvas = (x < 0 || y < 0 || x > stateCache.current.canvasSize.width || y > stateCache.current.canvasSize.height);
                let outsideOfSelection = !(pointIsInsideBoundery) && toolButtonActive;

                //save
                if (outsideOfCanvas || outsideOfSelection) {
                    saveCanvas.putImageData(eraseImageData);
                    saveCanvas.drawImage(tempCanvas2.getElement());

                    toolState.current.stage = ToolStage.PREVIEW;
                    toolState.current.selectionArea.startPosition = { x: 0, y: 0 };
                    toolState.current.selectionArea.currentPosition = { x: 0, y: 0 };
                    toolState.current.selectionArea.rectSelection.startPoint = { x: 0, y: 0 };
                    toolState.current.selectionArea.rectSelection.endPoint = { x: 0, y: 0 };
                    toolState.current.selectionArea.imgData = null;
                }
            }
        },
        "wand": (x, y, toolButtonActive) => {
            if (!toolButtonActive && toolState.current.stage === ToolStage.PREVIEW) {
                previewCanvas.drawPixel(x, y);
                return;
            }
            if (toolButtonActive && toolState.current.stage === ToolStage.PREVIEW) {
                tempCanvas1.putImageData(stateCache.current.activeLayer.image);
                let points = tempCanvas1.floodFill(x, y);
                let color = tempCanvas1.getColor(x, y);

                if (color.a === 0) return;

                toolState.current.selectionArea.points = points;
                toolState.current.selectionArea.startPosition = { x, y };
                toolState.current.selectionArea.currentPosition = {
                    x: x - toolState.current.selectionArea.startPosition.x,
                    y: y - toolState.current.selectionArea.startPosition.y
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
                toolState.current.selectionArea.imgData = img;

                toolState.current.stage = ToolStage.MOVING;
            }
            if (toolState.current.stage === ToolStage.MOVING) {
                let newPoints: { x: number, y: number }[] = [];
                toolState.current.selectionArea.points.forEach(point => {
                    let currentX = toolState.current.selectionArea.currentPosition.x;
                    let currentY = toolState.current.selectionArea.currentPosition.y;
                    let newPoint = { x: Math.floor(point.x + currentX), y: Math.floor(point.y + currentY) };

                    newPoints.push(newPoint);
                });

                let boundery = tempCanvas1.getBoundary(newPoints);
                let pointIsInsideBoundery = x >= boundery[0].x
                    && x <= boundery[1].x
                    && y >= boundery[0].y
                    && y <= boundery[3].y;

                let { width, height } = toolState.current.selectionArea.imgData!;
                const eraseImageData = new ImageData(width, height);

                for (let i = 0; i < eraseImageData.data.length; i += 4) {
                    let r = toolState.current.selectionArea.imgData!.data[i];
                    let g = toolState.current.selectionArea.imgData!.data[i + 1];
                    let b = toolState.current.selectionArea.imgData!.data[i + 2];
                    let a = toolState.current.selectionArea.imgData!.data[i + 3];

                    if (r != 0 || g != 0 || b != 0 || a > 1) {
                        eraseImageData.data[i] = 255;
                        eraseImageData.data[i + 1] = 255;
                        eraseImageData.data[i + 2] = 255;
                        eraseImageData.data[i + 3] = 1;
                    }
                }

                tempCanvas1.putImageData(
                    toolState.current.selectionArea.imgData,
                    toolState.current.selectionArea.currentPosition.x,
                    toolState.current.selectionArea.currentPosition.y,
                );
                tempCanvas2.drawImage(tempCanvas1.getElement());

                previewCanvas.putImageData(eraseImageData);
                previewCanvas.drawImage(tempCanvas2.getElement());
                previewCanvas.drawPolygon(tempCanvas1.getBoundary(newPoints), true, "rgba(0,0,0,1)");

                if (pointIsInsideBoundery && toolButtonActive) {
                    toolState.current.selectionArea.currentPosition.x = x - toolState.current.selectionArea.startPosition.x;
                    toolState.current.selectionArea.currentPosition.y = y - toolState.current.selectionArea.startPosition.y;
                }

                let outsideOfCanvas = (x < 0 || y < 0 || x > stateCache.current.canvasSize.width || y > stateCache.current.canvasSize.height);
                let outsideOfSelection = !(pointIsInsideBoundery) && toolButtonActive;

                // save
                if (outsideOfCanvas || outsideOfSelection) {
                    saveCanvas.putImageData(eraseImageData);
                    saveCanvas.drawImage(tempCanvas2.getElement());

                    toolState.current.stage = ToolStage.PREVIEW;
                    toolState.current.selectionArea.startPosition = { x: 0, y: 0 };
                    toolState.current.selectionArea.currentPosition = { x: 0, y: 0 };
                    toolState.current.selectionArea.points = [];
                    toolState.current.selectionArea.imgData = null;
                }
            }
        },
        "lasso": (x, y, toolButtonActive) => {
            if (!toolButtonActive && toolState.current.stage === ToolStage.PREVIEW) {
                previewCanvas.drawPixel(x, y);
                return;
            }
            if (toolButtonActive && toolState.current.stage === ToolStage.PREVIEW) {
                toolState.current.selectionArea.lassoSelection.points.push({ x, y });
                toolState.current.stage = ToolStage.ADJUSTING;
            }
            if (toolButtonActive && toolState.current.stage === ToolStage.ADJUSTING) {
                let lastPoint = toolState.current.selectionArea.lassoSelection.points[toolState.current.selectionArea.lassoSelection.points.length - 1];
                if (x !== lastPoint.x || y !== lastPoint.y)
                    toolState.current.selectionArea.lassoSelection.points.push({ x, y });

                let points = toolState.current.selectionArea.lassoSelection.points;
                previewCanvas.drawPolygon(points, true, "rgba(0,0,0,1)");
            }
            if (!toolButtonActive && toolState.current.stage === ToolStage.ADJUSTING) {
                let points = toolState.current.selectionArea.lassoSelection.points;
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

                toolState.current.selectionArea.imgData = img;
                toolState.current.stage = ToolStage.MOVING;
            }
            if (toolState.current.stage === ToolStage.MOVING) {
                // set the inital drag point
                if (toolButtonActive &&
                    toolState.current.selectionArea.startPosition.x === 0 &&
                    toolState.current.selectionArea.startPosition.y === 0
                ) {
                    toolState.current.selectionArea.startPosition = { x, y };
                    toolState.current.selectionArea.currentPosition = {
                        x: x - toolState.current.selectionArea.startPosition.x,
                        y: y - toolState.current.selectionArea.startPosition.y
                    };
                }

                let newPoints: { x: number, y: number }[] = [];
                toolState.current.selectionArea.lassoSelection.points.forEach(point => {
                    let currentX = toolState.current.selectionArea.currentPosition.x;
                    let currentY = toolState.current.selectionArea.currentPosition.y;
                    let newPoint = { x: Math.floor(point.x + currentX), y: Math.floor(point.y + currentY) };

                    newPoints.push(newPoint);
                });

                let boundery = tempCanvas1.getBoundary(newPoints);
                let pointIsInsideBoundery = x >= boundery[0].x
                    && x <= boundery[1].x
                    && y >= boundery[0].y
                    && y <= boundery[3].y;

                let { width, height } = toolState.current.selectionArea.imgData!;
                const eraseImageData = new ImageData(width, height);

                for (let i = 0; i < eraseImageData.data.length; i += 4) {
                    let r = toolState.current.selectionArea.imgData!.data[i];
                    let g = toolState.current.selectionArea.imgData!.data[i + 1];
                    let b = toolState.current.selectionArea.imgData!.data[i + 2];
                    let a = toolState.current.selectionArea.imgData!.data[i + 3];

                    if (r != 0 || g != 0 || b != 0 || a > 1) {
                        eraseImageData.data[i] = 255;
                        eraseImageData.data[i + 1] = 255;
                        eraseImageData.data[i + 2] = 255;
                        eraseImageData.data[i + 3] = 1;
                    }
                }

                tempCanvas1.putImageData(
                    toolState.current.selectionArea.imgData,
                    toolState.current.selectionArea.currentPosition.x,
                    toolState.current.selectionArea.currentPosition.y,
                );
                tempCanvas2.drawImage(tempCanvas1.getElement());

                previewCanvas.putImageData(eraseImageData);
                previewCanvas.drawImage(tempCanvas2.getElement());
                previewCanvas.drawPolygon(tempCanvas1.getBoundary(newPoints), true, "rgba(0,0,0,1)");

                if (pointIsInsideBoundery && toolButtonActive) {
                    toolState.current.selectionArea.currentPosition.x = x - toolState.current.selectionArea.startPosition.x;
                    toolState.current.selectionArea.currentPosition.y = y - toolState.current.selectionArea.startPosition.y;
                }

                let outsideOfCanvas = (x < 0 || y < 0 || x > stateCache.current.canvasSize.width || y > stateCache.current.canvasSize.height);
                let outsideOfSelection = !(pointIsInsideBoundery) && toolButtonActive;

                // save
                if (outsideOfCanvas || outsideOfSelection) {
                    saveCanvas.putImageData(eraseImageData);
                    saveCanvas.drawImage(tempCanvas2.getElement());

                    toolState.current.stage = ToolStage.PREVIEW;
                    toolState.current.selectionArea.startPosition = { x: 0, y: 0 };
                    toolState.current.selectionArea.currentPosition = { x: 0, y: 0 };
                    toolState.current.selectionArea.lassoSelection.points = [];
                    toolState.current.selectionArea.imgData = null;
                }
            }
        },
    };

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

    // update frames and layers preview image
    useEffect(() => {
        setInterval(() => {
            setActiveLayer(stateCache.current.activeLayer);
        }, 500);
    }, []);

    // mouse event listeners
    useEffect(() => {
        const setMouseState = e => {
            mouseState.current = {
                ...mouseState.current,
                x: e.clientX,
                y: e.clientY,
                movementX: e.movementX,
                movementY: e.movementY,
            }

            if (e.type === "mousedown") {
                if (e.button === 0) mouseState.current.leftDown = true;
                if (e.button === 1) mouseState.current.middleDown = true;
                if (e.button === 2) mouseState.current.rightDown = true;
            }
            if (e.type === "mouseup") {
                if (e.button === 0) mouseState.current.leftDown = false;
                if (e.button === 1) mouseState.current.middleDown = false;
                if (e.button === 2) mouseState.current.rightDown = false;
            }
        };

        const canvasContainer = document.querySelector(".p-app__canvas-container");

        // Add passive: false if you need to call preventDefault for these events
        canvasContainer!.addEventListener('mousedown', setMouseState, { passive: true });
        document.addEventListener('mouseup', setMouseState, { passive: true });
        document.addEventListener('mousemove', setMouseState, { passive: true });

        canvasContainer!.addEventListener('wheel', (e: any) => {
            e.preventDefault();
            e.stopPropagation();
            let delta = e.deltaY > 0 ? -0.3 : 0.3;
            setZoom(mainCanvasZoom.current + delta);
        }, { passive: false });

        return () => {
            canvasContainer!.removeEventListener('mousedown', setMouseState);
            document.removeEventListener('mouseup', setMouseState);
            document.removeEventListener('mousemove', setMouseState);
        };
    }, []);

    // canvas setup 
    useEffect(() => {
        mainCanvas.getCtx().imageSmoothingEnabled = false;
        mainCanvasContainer.current?.appendChild(mainCanvas.getElement());

        mainCanvas.getElement().classList.add("p-app__canvas-elm");
        mainCanvas.resize(canvasSize.width, canvasSize.height);
        saveCanvas.resize(canvasSize.width, canvasSize.height);
        previewCanvas.resize(canvasSize.width, canvasSize.height);
        tempCanvas1.resize(canvasSize.width, canvasSize.height);
        tempCanvas2.resize(canvasSize.width, canvasSize.height);

        setZoom(mainCanvasZoom.current);
    }, []);

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
    }, [canvasSize]);

    // update state cache
    useEffect(() => {
        stateCache.current = { activeColorPalette, activeColor, colorStats, toolSettings, activeLayer, activeFrame, canvasSize, onionSkin, frames };
    }, [activeColorPalette, activeColor, colorStats, toolSettings, activeLayer, activeFrame, canvasSize, onionSkin, frames]);

    // rebuild tooltip
    useEffect(() => { ReactTooltip.rebuild() }, [toolSettings]);

    //! move to tools
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
        mainCanvasZoom.current = Math.max(1, zoom);
        mainCanvas.getElement().style.transform = `scale(${mainCanvasZoom.current})`;
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
        let x = Math.floor((mouseState.current.x - rect.x) / mainCanvasZoom.current);
        let y = Math.floor((mouseState.current.y - rect.y) / mainCanvasZoom.current);

        // tool info
        const { leftTool, rightTool, middleTool } = stateCache.current.toolSettings;
        const tool =
            mouseState.current.leftDown ? leftTool :
                mouseState.current.rightDown ? rightTool :
                    mouseState.current.middleDown ? middleTool : leftTool;
        const toolButtonActive =
            tool === leftTool ? mouseState.current.leftDown :
                tool === rightTool ? mouseState.current.rightDown :
                    tool === middleTool ? mouseState.current.middleDown : false;

        // set tool color
        let { r, g, b, a } = stateCache.current.activeColor;
        saveCanvas.getCtx().fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
        previewCanvas.getCtx().fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;

        // run current tool
        toolHandlers[tool](x, y, toolButtonActive);

        // color related operations
        const existingColor = stateCache.current.activeColorPalette.colors
            .find(c => JSON.stringify(c) === JSON.stringify(stateCache.current.activeColor));
        if (!existingColor && toolButtonActive) {
            const newColors = [...stateCache.current.activeColorPalette.colors, stateCache.current.activeColor];
            setActiveColorPalette({ ...stateCache.current.activeColorPalette, colors: newColors });
        }
        if (toolButtonActive) {
            let { r, g, b, a } = stateCache.current.activeColor;
            let colorString = `${r},${g},${b},${a}`;

            // Access the colorStats object once to avoid repeated lookups
            const currentColorStats = stateCache.current.colorStats[colorString] || { count: 0 };

            setColorStats({
                ...stateCache.current.colorStats,
                [colorString]: {
                    count: currentColorStats.count + 1,
                    lastUsed: (new Date()).toUTCString()
                },
            });
        }

        // save pixels from saveCanvas to active layer
        {
            let savedImg = saveCanvas.getImageData();

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
                    tempCanvas1.putImageData(layer.image);
                    tempCanvas2.drawImage(tempCanvas1.getElement());
                    mainCanvas.drawImage(tempCanvas2.getElement());
                });

                tempCanvas2.getCtx().globalAlpha = 1;
            }
        }

        // render active frame
        let reversedLayers = stateCache.current.activeFrame.layers.slice().reverse();
        reversedLayers.forEach((layer) => {
            tempCanvas1.putImageData(layer.image);
            tempCanvas2.getCtx().globalAlpha = layer.opacity / 255;

            // draw the preview layer ontop of the active layer
            if (layer.symbol === stateCache.current.activeLayer.symbol) {
                let previewData = previewCanvas.getImageData();
                let activeLayerData = tempCanvas1.getImageData();

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
                tempCanvas2.putImageData(previewData);
                tempCanvas1.drawImage(tempCanvas2.getElement());
            }

            tempCanvas2.drawImage(tempCanvas1.getElement());
            mainCanvas.drawImage(tempCanvas2.getElement());

            tempCanvas2.getCtx().globalAlpha = 1;
        });

        if (tilemode.current) {
            let width = Math.ceil(stateCache.current.canvasSize.width * mainCanvasZoom.current);
            let height = Math.ceil(stateCache.current.canvasSize.height * mainCanvasZoom.current);
            mainCanvasContainer.current!.style.background = `url(${mainCanvas.getElement().toDataURL()}) repeat center`;
            mainCanvasContainer.current!.style.backgroundSize = `${width}px ${height}px`;
        } else {
            mainCanvasContainer.current!.style.background = `transparent`;
        }
    }

    return {
        undo,
        redo,
        setZoom,
        tilemode,
        canvasSize,
        toolSettings,
        mainCanvasZoom,
        setBrushSize,
        resizeHandler,
        setToolSettings,
        mainCanvasContainer,
    };
}


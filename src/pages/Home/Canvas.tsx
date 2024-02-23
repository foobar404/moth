import { ImMinus } from "react-icons/im";
import ReactTooltip from 'react-tooltip';
import { IMouseState } from "../../types";
import { BiPlusMedical } from "react-icons/bi";
import React, { useEffect, useRef } from 'react';
import { FaUndoAlt, FaRedoAlt, FaMoon, FaSun } from "react-icons/fa";
import { TbCircleFilled, TbOvalFilled, TbSquareFilled, TbRectangleFilled } from "react-icons/tb";
import { useCanvas as useCanvasHook, useGlobalStore, useShortcuts } from "../../utils";
import tinycolor from "tinycolor2";


enum ToolStage {
    PREVIEW, ADJUSTING, MOVING, SAVE
}


enum MouseEvent {
    MOUSE_DOWN, MOUSE_UP, MOUSE_MOVE
}


export function Canvas() {
    const data = useCanvas();

    return (
        <section className="p-app__canvas p-app__block">
            <nav className="p-app__brush-controls">
                {data.toolSettings.leftTool === "mirror" && (<>
                    <label className="mr-2 flex"
                        data-tip="mirror x & y axis"
                        data-for="tooltip">
                        <span className="mr-1">X & Y</span>
                        <input type="radio"
                            className="c-input"
                            name="mirror-type"
                            checked={data.toolSettings.mirror.x && data.toolSettings.mirror.y}
                            onClick={() => data.setToolSettings({ ...data.toolSettings, mirror: { x: true, y: true } })} />
                    </label>
                    <label className="mr-2 flex"
                        data-tip="mirror x axis"
                        data-for="tooltip">
                        <span className="mr-1">X</span>
                        <input type="radio"
                            className="c-input"
                            name="mirror-type"
                            checked={data.toolSettings.mirror.x && !data.toolSettings.mirror.y}
                            onClick={() => data.setToolSettings({ ...data.toolSettings, mirror: { x: true, y: false } })} />
                    </label>
                    <label className="mr-2 flex"
                        data-tip="mirror y axis"
                        data-for="tooltip">
                        <span className="mr-1">Y</span>
                        <input type="radio"
                            className="c-input"
                            name="mirror-type"
                            checked={data.toolSettings.mirror.y && !data.toolSettings.mirror.x}
                            onClick={() => data.setToolSettings({ ...data.toolSettings, mirror: { x: false, y: true } })} />
                    </label>
                </>)}

                {data.toolSettings.leftTool === "shape" && (<>
                    <label data-tip=""
                        data-for="tooltip"
                        className="mr-2 flex">
                        <TbSquareFilled className="c-icon" />
                        <input type="radio"
                            name="shape"
                            className="c-input"
                            value="square"
                            onClick={(e) => data.setToolSettings({ ...data.toolSettings, shape: e.currentTarget.value as any })}
                        />
                    </label>
                    <label data-tip=""
                        data-for="tooltip"
                        className="mr-2 flex">
                        <TbRectangleFilled className="c-icon" />
                        <input type="radio"
                            name="shape"
                            className="c-input"
                            value="rect"
                            defaultChecked={true}
                            onClick={(e) => data.setToolSettings({ ...data.toolSettings, shape: e.currentTarget.value as any })}
                        />
                    </label>
                    <label data-tip=""
                        data-for="tooltip"
                        className="mr-2 flex">
                        <TbCircleFilled className="c-icon" />
                        <input type="radio"
                            name="shape"
                            className="c-input"
                            value="circle"
                            onClick={(e) => data.setToolSettings({ ...data.toolSettings, shape: e.currentTarget.value as any })}
                        />
                    </label>
                    <label data-tip=""
                        data-for="tooltip"
                        className="mr-2 flex">
                        <TbOvalFilled className="c-icon" />
                        <input type="radio"
                            name="shape"
                            className="c-input"
                            value="oval"
                            onClick={(e) => data.setToolSettings({ ...data.toolSettings, shape: e.currentTarget.value as any })}
                        />
                    </label>
                </>)}

                {data.toolSettings.leftTool === "light" && (<>
                    <label data-tip=""
                        data-for="tooltip"
                        className="mr-2 flex">
                        <FaSun className="c-icon" />
                        <input type="radio"
                            name="light"
                            className="c-input"
                            value="light"
                            defaultChecked={true}
                            onClick={(e) => data.setToolSettings({ ...data.toolSettings, lightMode: e.currentTarget.value as any })}
                        />
                    </label>
                    <label data-tip=""
                        data-for="tooltip"
                        className="mr-2 flex">
                        <FaMoon className="c-icon" />
                        <input type="radio"
                            name="light"
                            className="c-input"
                            value="dark"
                            onClick={(e) => data.setToolSettings({ ...data.toolSettings, lightMode: e.currentTarget.value as any })}
                        />
                    </label>
                </>)}

                <button data-tip="decrease brush size ( [ )"
                    data-for="tooltip"
                    className="c-button --xs --fourth mr-2"
                    onClick={() => data.setBrushSize(-1)}>
                    <ImMinus />
                </button>
                <button data-tip="increase brush size ( ] )"
                    data-for="tooltip"
                    className="c-button --xs --fourth mr-2"
                    onClick={() => data.setBrushSize(1)}>
                    <BiPlusMedical />
                </button>
                <span data-tip="brush size"
                    data-for="tooltip">
                    {data.toolSettings.size}
                </span>
            </nav>

            <nav className="p-app__canvas-controls">
                <input type="range" min="1" max="50" step="1"
                    data-tip="grid zoom"
                    data-for="tooltip"
                    className="c-input --xs mr-2"
                    style={{ width: "100px" }}
                    defaultValue={10}
                    onChange={(e) => data.setZoom(parseInt(e.target.value))} />
                <label>
                    <p hidden>height</p>
                    <input data-tip="grid height"
                        data-for="tooltip"
                        type="number"
                        className="c-input --xs mr-2"
                        value={data.canvasSize.height}
                        onChange={e => data.resizeHandler({ height: e.currentTarget.valueAsNumber })} />
                </label>
                <label>
                    <p hidden>width</p>
                    <input data-tip="grid width"
                        data-for="tooltip"
                        type="number"
                        className="c-input --xs mr-2"
                        value={data.canvasSize.width}
                        onChange={e => data.resizeHandler({ width: e.currentTarget.valueAsNumber })} />
                </label>
                <button data-tip="undo ( ctrl + z )"
                    data-for="tooltip"
                    onClick={data.undo}
                    className="c-button --xs --fourth mr-2">
                    <FaUndoAlt />
                </button>
                <button data-tip="redo ( ctrl + shift + z )"
                    data-for="tooltip"
                    onClick={data.redo}
                    className="c-button --xs --fourth mr-2">
                    <FaRedoAlt />
                </button>
            </nav>

            <section className="p-app__canvas-container" ref={data.mainCanvasContainer}></section>
        </section>
    )
}

function useCanvas() {
    const { toolSettings, setActiveColor, setToolSettings,
        activeColor, activeColorPalette, setActiveColorPalette,
        colorStats, setColorStats, activeLayer, setActiveLayer,
        activeFrame, canvasSize, setCanvasSize,
    } = useGlobalStore();
    const mainCanvasContainer = useRef<HTMLElement>(null);
    const mainCanvas = useCanvasHook();
    const canvas1 = useCanvasHook();
    const canvas2 = useCanvasHook();
    const undoStack = useRef<{ frameID: any, layerID: any; image: any }[]>([]);
    const redoStack = useRef<{ frameID: any, layerID: any; image: any }[]>([]);

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
        activePoints: [] as { x: number; y: number; }[],
        modifiedPoints: new Set(),
        selectionArea: {
            imgData: null as ImageData | null,
            bounderyPoints: [] as { x: number; y: number; }[],
            startPosition: { x: 0, y: 0 },
            currentPosition: { x: 0, y: 0 },
        }
    });
    let stateCache = useRef({ activeColorPalette, activeColor, activeFrame, colorStats, toolSettings, activeLayer });
    let keys = useShortcuts({
        "control+z": undo,
        "[": () => setBrushSize(-1),
        "]": () => setBrushSize(1),
    });
    let toolHandlers = {
        "brush": (x, y, toolButtonActive) => {
            if (toolButtonActive)
                toolState.current.stage = ToolStage.SAVE;

            // center the mouse cursor in the brush 
            let width = stateCache.current.toolSettings.size;
            let height = stateCache.current.toolSettings.size;
            let newX = x == 0 ? 0 : x - Math.floor(width / 2);
            let newY = y == 0 ? 0 : y - Math.floor(height / 2);

            canvas1.drawPixel(newX, newY, stateCache.current.toolSettings.size);
        },
        "eraser": (x, y, toolButtonActive) => {
            if (toolButtonActive)
                toolState.current.stage = ToolStage.SAVE;

            // center the mouse cursor in the brush 
            let width = stateCache.current.toolSettings.size;
            let height = stateCache.current.toolSettings.size;
            let newX = x == 0 ? 0 : x - Math.floor(width / 2);
            let newY = y == 0 ? 0 : y - Math.floor(height / 2);

            canvas1.erasePixel(newX, newY, stateCache.current.toolSettings.size);
        },
        "bucket": (x, y, toolButtonActive) => {
            if (!toolButtonActive) {
                canvas1.drawPixel(x, y);
                return;
            }

            toolState.current.stage = ToolStage.SAVE;

            canvas2.putImageData(activeLayer.image);
            let points = canvas2.floodFill(x, y);

            points.forEach(point => {
                canvas1.drawPixel(point[0], point[1]);
            });
        },
        "line": (x, y, toolButtonActive) => {
            // Check if we are previewing a new line or adjusting an existing line
            if (toolButtonActive && toolState.current.stage === ToolStage.PREVIEW) {
                toolState.current.activePoints = [{ x: Math.floor(x), y: Math.floor(y) }];
                toolState.current.stage = ToolStage.ADJUSTING;
            } else if (toolState.current.stage === ToolStage.ADJUSTING) {
                const activePoints = toolState.current.activePoints;

                if (activePoints.length > 0) {
                    const startPoint = activePoints[0];
                    const endPoint = { x: Math.floor(x), y: Math.floor(y) };

                    canvas1.drawLine(startPoint, endPoint, stateCache.current.toolSettings.size);

                    if (!toolButtonActive) {
                        toolState.current.stage = ToolStage.SAVE;
                        toolState.current.activePoints = []; // Prepare for the next use
                    }
                }
            }
        },
        "mirror": (x, y, toolButtonActive) => {
            if (toolButtonActive)
                toolState.current.stage = ToolStage.SAVE;

            const { size, mirror } = stateCache.current.toolSettings;
            const ctx = canvas1.getCtx();
            const mirrorX = mirror.x;
            const mirrorY = mirror.y;

            ctx.fillRect(x, y, size, size);

            if (mirrorX)
                ctx.fillRect(mainCanvas.getWidth() - x - size, y, size, size);

            if (mirrorY)
                ctx.fillRect(x, mainCanvas.getHeight() - y - size, size, size);

            // Mirror both X and Y axes
            if (mirrorX && mirrorY)
                ctx.fillRect(mainCanvas.getWidth() - x - size, mainCanvas.getHeight() - y - size, size, size);

        },
        "move": (x, y, toolButtonActive) => {
            if (toolButtonActive && toolState.current.stage === ToolStage.PREVIEW) {
                toolState.current.stage = ToolStage.ADJUSTING;

                canvas2.putImageData(stateCache.current.activeLayer.image);
                toolState.current.selectionArea.imgData = canvas2.getImageData();
            }
            if (toolButtonActive && toolState.current.stage === ToolStage.ADJUSTING) {
                // Calculate the displacement
                toolState.current.selectionArea.currentPosition.x += mouseState.current.movementX / mainCanvasZoom.current;
                toolState.current.selectionArea.currentPosition.y += mouseState.current.movementY / mainCanvasZoom.current;

                canvas1.putImageData(
                    toolState.current.selectionArea.imgData,
                    toolState.current.selectionArea.currentPosition.x,
                    toolState.current.selectionArea.currentPosition.y
                );
            }
            if (!toolButtonActive && toolState.current.stage === ToolStage.ADJUSTING) {
                // save and draw

                let { width, height } = toolState.current.selectionArea.imgData!;
                const eraseImageData = new ImageData(width, height);

                // Fill the new ImageData with black pixels
                for (let i = 0; i < eraseImageData.data.length; i += 4) {
                    let r = toolState.current.selectionArea.imgData!.data[i];
                    let g = toolState.current.selectionArea.imgData!.data[i + 1];
                    let b = toolState.current.selectionArea.imgData!.data[i + 2];
                    let a = toolState.current.selectionArea.imgData!.data[i + 3];


                    // replace colored pixel with black
                    if (r != 0 || g != 0 || b != 0 || a > 1) {
                        eraseImageData.data[i] = 255;
                        eraseImageData.data[i + 1] = 255;
                        eraseImageData.data[i + 2] = 255;
                        eraseImageData.data[i + 3] = 1;
                    }
                }
                canvas2.putImageData(
                    eraseImageData,
                    toolState.current.selectionArea.startPosition.x,
                    toolState.current.selectionArea.startPosition.y,
                );
                canvas1.drawImage(canvas2.getElement());
                canvas2.putImageData(
                    toolState.current.selectionArea.imgData,
                    toolState.current.selectionArea.currentPosition.x,
                    toolState.current.selectionArea.currentPosition.y
                );
                canvas1.drawImage(canvas2.getElement());

                toolState.current.stage = ToolStage.SAVE;
                toolState.current.selectionArea.startPosition = { x: 0, y: 0 };
                toolState.current.selectionArea.currentPosition = { x: 0, y: 0 };
            }
        },
        "eyedropper": (x, y, toolButtonActive) => {
            if (toolButtonActive) {
                let reversedLayers = stateCache.current.activeFrame.layers.slice().reverse();
                reversedLayers.forEach((layer) => {
                    let imageData = layer.image;
                    for (let i = 3; i < imageData.data.length; i += 4) {
                        imageData.data[i] *= layer.opacity / 255;
                    }

                    canvas1.putImageData(imageData, 0, 0);
                    canvas2.drawImage(canvas1.getElement(), 0, 0);
                });

                let frameData = canvas2.getImageData();
                let current = {
                    r: frameData.data[(((y * frameData.width) + x) * 4)],
                    g: frameData.data[(((y * frameData.width) + x) * 4) + 1],
                    b: frameData.data[(((y * frameData.width) + x) * 4) + 2],
                    a: frameData.data[(((y * frameData.width) + x) * 4) + 3]
                };

                setActiveColor(current);
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

                        canvas1.drawRect(left, top, width, height);
                    } else if (stateCache.current.toolSettings.shape == "circle" || stateCache.current.toolSettings.shape == "oval") {
                        const radiusX = stateCache.current.toolSettings.shape == "circle" ?
                            Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)) :
                            Math.abs(end.x - start.x) / 2;
                        const radiusY = stateCache.current.toolSettings.shape == "circle" ?
                            radiusX :
                            Math.abs(end.y - start.y) / 2;
                        const centerX = (start.x + end.x) / 2;
                        const centerY = (start.y + end.y) / 2;

                        canvas1.drawOval(centerX, centerY, radiusX, radiusY);
                    }

                    if (!toolButtonActive) {
                        toolState.current.stage = ToolStage.SAVE;
                        toolState.current.activePoints = []; // Prepare for the next use
                    }
                }
            }
        },
        "light": (x, y, toolButtonActive) => {
            // Put the active layer image onto canvas2 for manipulation
            canvas2.putImageData(stateCache.current.activeLayer.image);
            const brushSize = stateCache.current.toolSettings.size;
            const lightAdjustmentPercentage = stateCache.current.toolSettings.lightMode === "light" ? 15 : -15;

            // Calculate start and end points, ensuring they are within canvas bounds
            const startX = Math.max(0, x - Math.floor(brushSize / 2));
            const startY = Math.max(0, y - Math.floor(brushSize / 2));
            const endX = Math.min(canvas2.getWidth(), startX + brushSize);
            const endY = Math.min(canvas2.getHeight(), startY + brushSize);

            // Get the image data for the brush area
            let imgData = canvas2.getImageData(startX, startY, endX - startX, endY - startY);
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
                            hsl.h = Math.max(20, hsl.h - 10); // Towards orange for brightness
                            hsl.s = Math.min(1, hsl.s + 0.1); // Increase saturation
                        } else {
                            hsl.h = Math.min(250, hsl.h + 10); // Towards blue for darkness
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

            // Put the modified image data back onto canvas1
            canvas1.putImageData(imgData, startX, startY);

            // Save the state when the tool button is active, clear modified points otherwise
            if (toolButtonActive) {
                toolState.current.stage = ToolStage.SAVE;
            } else {
                toolState.current.modifiedPoints.clear();
            }
        },
        "recolor": (x, y, toolButtonActive) => {
            if (!toolButtonActive) {
                canvas1.drawPixel(x, y);
                return;
            }

            toolState.current.stage = ToolStage.SAVE;

            const imgData = activeLayer.image;
            const data = imgData.data;

            // Step 2: Get the color of the pixel at the current point
            const index = (x + y * imgData.width) * 4;
            const targetColor = { r: data[index], g: data[index + 1], b: data[index + 2], a: data[index + 3] };

            // Assume activeColor is an object { r: number, g: number, b: number, a: number }
            const activeColor = stateCache.current.activeColor; // You need to implement this based on how active color is set

            // Step 3 & 4: Loop through all pixels to find and replace the target color
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

            // Step 5: Apply the modified image data back to the canvas
            canvas1.putImageData(imgData, 0, 0);
        },
        "box": (x, y, toolButtonActive) => {
            // if toolButtonActive and in preview mode 
            // set start position, current possition, and first boundery point
            // change to adjusting mode
            // if in adjusting mode
            // update current position 
            // draw rect from start to current position
            // if !toolButtonActive and in adjusting mode
            // update current position
            // add final point to boundery
            // save image data to slection area image
            // reset current position to start position
            // change mode to MOVING
            // draw rect
            // if in moving mode
            // if clicked outside of the selection boundery
            // update current position by mouse movement
            // paint selection img to canvas1 at current position
            // change mode to SAVE

            // clear selection img
            // reset current position to start position
            // change mode to PREVIEW
            // else 
            // update current position by mouse movement
            // paint selection img to canvas1 at current position
            // draw rect 
        },
        "wand": (x, y, toolButtonActive) => { },
        "laso": (x, y, toolButtonActive) => { },
    };

    // animation loop
    useEffect(() => {
        (function render() {
            requestAnimationFrame(render);
            paint();
        })();
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
        mainCanvasContainer.current?.appendChild(mainCanvas.getElement());

        mainCanvas.getElement().classList.add("p-app__canvas-elm");
        mainCanvas.resize(canvasSize.width, canvasSize.height);
        canvas1.resize(canvasSize.width, canvasSize.height);
        canvas2.resize(canvasSize.width, canvasSize.height);

        mainCanvas.getCtx().imageSmoothingEnabled = false;
        canvas1.getCtx().imageSmoothingEnabled = false;
        canvas2.getCtx().imageSmoothingEnabled = false;

        setZoom(mainCanvasZoom.current);
    }, []);

    // resize canvas
    useEffect(() => {
        mainCanvas.resize(canvasSize.width, canvasSize.height);
        canvas1.resize(canvasSize.width, canvasSize.height);
        canvas2.resize(canvasSize.width, canvasSize.height);
    }, [canvasSize]);

    useEffect(() => {
        stateCache.current = { activeColorPalette, activeColor, colorStats, toolSettings, activeLayer, activeFrame };
    }, [activeColorPalette, activeColor, colorStats, toolSettings, activeLayer, activeFrame]);

    useEffect(() => { ReactTooltip.rebuild() }, [toolSettings]);

    //! move to tools
    function setBrushSize(delta: number) {
        setToolSettings({ ...toolSettings, size: (toolSettings.size + delta < 1) ? 1 : (toolSettings.size + delta) });
    }

    function undo() { }

    function redo() { }

    function saveCanvasState() {
        canvas2.putImageData(stateCache.current.activeLayer.image);
        let data = {
            frameID: stateCache.current.activeFrame.symbol,
            layerID: stateCache.current.activeLayer.symbol,
            image: canvas2.getImageData()
        };
        undoStack.current.push(data);
        canvas2.clear();

        if (undoStack.current.length > 100) undoStack.current.shift();
    }

    function setZoom(zoom = 1) {
        mainCanvasZoom.current = Math.max(1, zoom);
        mainCanvas.getElement().style.transform = `scale(${mainCanvasZoom.current})`;
    }

    function resizeHandler(size: { height?: number, width?: number }) {
        let newHeight = Math.max(1, size.height ?? canvasSize.height);
        let newWidth = Math.max(1, size.width ?? canvasSize.width);
        setCanvasSize({
            height: newHeight,
            width: newWidth
        });
    }

    function paint() {
        canvas1.clear();
        canvas2.clear();
        mainCanvas.clear();
        mainCanvas.drawGrid();

        // color related operations
        const isMouseDown = mouseState.current.leftDown || mouseState.current.rightDown || mouseState.current.middleDown;
        const existingColor = stateCache.current.activeColorPalette.colors
            .find(color => color === stateCache.current.activeColor);
        if (!existingColor && isMouseDown) {
            const newColors = [...stateCache.current.activeColorPalette.colors, stateCache.current.activeColor];
            setActiveColorPalette({ ...stateCache.current.activeColorPalette, colors: newColors });
        }
        if (isMouseDown) {
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

        // position relative to the canvas element
        let rect = mainCanvas.getElement().getBoundingClientRect();
        let x = Math.floor((mouseState.current.x - rect.x) / mainCanvasZoom.current);
        let y = Math.floor((mouseState.current.y - rect.y) / mainCanvasZoom.current);

        const { leftTool, rightTool, middleTool } = stateCache.current.toolSettings;
        const tool =
            mouseState.current.leftDown ? leftTool :
                mouseState.current.rightDown ? rightTool :
                    mouseState.current.middleDown ? middleTool : leftTool;
        const toolButtonActive =
            tool === leftTool ? mouseState.current.leftDown :
                tool === rightTool ? mouseState.current.rightDown :
                    tool === middleTool ? mouseState.current.middleDown : false;

        let { r, g, b, a } = stateCache.current.activeColor;
        canvas1.getCtx().fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;

        //* draw a preview of the selected tool
        toolHandlers[tool]?.(x, y, toolButtonActive);

        const canvas1Img = canvas1.getImageData();
        canvas1.clear();

        // save pixels from canvas1 to active layer
        if (toolState.current.stage === ToolStage.SAVE) {
            for (let i = 0; i < canvas1Img.data.length; i += 4) {
                let r = canvas1Img.data[i];
                let g = canvas1Img.data[i + 1];
                let b = canvas1Img.data[i + 2];
                let a = canvas1Img.data[i + 3];

                // paint colored pixels
                if (r != 0 || g != 0 || b != 0 || a > 1) {
                    stateCache.current.activeLayer.image!.data[i] = canvas1Img.data[i];
                    stateCache.current.activeLayer.image!.data[i + 1] = canvas1Img.data[i + 1];
                    stateCache.current.activeLayer.image!.data[i + 2] = canvas1Img.data[i + 2];
                    stateCache.current.activeLayer.image!.data[i + 3] = canvas1Img.data[i + 3];
                }

                // erase invisible pixels 
                if (a === 1) {
                    stateCache.current.activeLayer.image!.data[i] = 0;
                    stateCache.current.activeLayer.image!.data[i + 1] = 0;
                    stateCache.current.activeLayer.image!.data[i + 2] = 0;
                    stateCache.current.activeLayer.image!.data[i + 3] = 0;
                }
            }
            setActiveLayer({ ...stateCache.current.activeLayer });
            toolState.current.stage = ToolStage.PREVIEW;
        }

        // update the main canvas with contents of canvas1
        let reversedLayers = stateCache.current.activeFrame.layers.slice().reverse();
        reversedLayers.forEach((layer) => {
            // apply layer opacity
            let imageData = layer.image;
            for (let i = 3; i < imageData.data.length; i += 4) {
                imageData.data[i] *= layer.opacity / 255;
            }

            canvas1.putImageData(imageData, 0, 0);
            mainCanvas.drawImage(canvas1.getElement(), 0, 0);

            // Paint new pixels if the layer matches the active layer
            if (layer.symbol === stateCache.current.activeLayer.symbol) {
                canvas1.putImageData(canvas1Img, 0, 0); // Overwrite the off-screen canvas with new pixels
                mainCanvas.drawImage(canvas1.getElement(), 0, 0); // Copy the new pixels to the main canvas
            }
        });
    }

    return {
        undo,
        redo,
        setZoom,
        canvasSize,
        toolSettings,
        mainCanvasZoom,
        setBrushSize,
        resizeHandler,
        setToolSettings,
        mainCanvasContainer,
    };
}


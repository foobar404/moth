import { ImMinus } from "react-icons/im";
import ReactTooltip from 'react-tooltip';
import { IMouseState } from "../../types";
import { BiPlusMedical } from "react-icons/bi";
import React, { useEffect, useRef } from 'react';
import { FaUndoAlt, FaRedoAlt } from "react-icons/fa";
import { useCanvas as useCanvasHook, useGlobalStore, useShortcuts } from "../../utils";


enum ToolStage {
    PREVIEW, ADJUSTING, SAVE
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
                <button data-tip="zoom out"
                    data-for="tooltip"
                    onClick={() => data.setZoom(-5)}
                    className="c-button --xs --fourth mr-2">
                    <ImMinus />
                </button>
                <button data-tip="zoom in"
                    data-for="tooltip"
                    onClick={() => data.setZoom(5)}
                    className="c-button --xs --fourth mr-2">
                    <BiPlusMedical />
                </button>
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
            if (toolButtonActive)
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
                // Proceed only if there's a starting point
                if (activePoints.length > 0) {
                    const startPoint = activePoints[0];
                    const endPoint = { x: Math.floor(x), y: Math.floor(y) };
                    const points = calculateLinePoints(startPoint, endPoint);

                    // Draw each point using the lineThickness
                    points.forEach((point: { x: number; y: number }) => {
                        canvas1.drawPixel(point.x, point.y, stateCache.current.toolSettings.size);
                    });

                    // If the tool is no longer active, finalize the drawing
                    if (!toolButtonActive) {
                        toolState.current.stage = ToolStage.SAVE;
                        toolState.current.activePoints = []; // Prepare for the next use
                    }
                }
            }

            function calculateLinePoints(start, end) {
                let points = [];
                let x0 = start.x;
                let y0 = start.y;
                let x1 = end.x;
                let y1 = end.y;

                let dx = Math.abs(x1 - x0);
                let dy = -Math.abs(y1 - y0);
                let sx = x0 < x1 ? 1 : -1;
                let sy = y0 < y1 ? 1 : -1;
                let err = dx + dy, e2; // error value e_xy

                while (true) {
                    //@ts-ignore
                    points.push({ x: x0, y: y0 });
                    if (x0 === x1 && y0 === y1) break;
                    e2 = 2 * err;
                    if (e2 >= dy) { err += dy; x0 += sx; } // e_xy+e_x > 0
                    if (e2 <= dx) { err += dx; y0 += sy; } // e_xy+e_y < 0
                }

                return points;
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
                // Mark the starting position for the move
                // toolState.current.selectionArea.startPosition = { x, y };
                // toolState.current.selectionArea.currentPosition = { x, y };
                toolState.current.stage = ToolStage.ADJUSTING;

                toolState.current.selectionArea.imgData = stateCache.current.activeLayer.image;
            }
            if (toolButtonActive && toolState.current.stage === ToolStage.ADJUSTING) {
                // Calculate the displacement
                toolState.current.selectionArea.currentPosition.x += mouseState.current.movementX / mainCanvasZoom.current;
                toolState.current.selectionArea.currentPosition.y += mouseState.current.movementY / mainCanvasZoom.current;

                // create a copy of  thats all black
                // let { width, height } = toolState.current.selectionArea.imgData!;
                // const blackImageData = new ImageData(width, height);

                // // Fill the new ImageData with black pixels
                // for (let i = 0; i < blackImageData.data.length; i += 4) {
                //     let r = toolState.current.selectionArea.imgData!.data[i];
                //     let g = toolState.current.selectionArea.imgData!.data[i + 1];
                //     let b = toolState.current.selectionArea.imgData!.data[i + 2];
                //     let a = toolState.current.selectionArea.imgData!.data[i + 3];

                //     // replace colored pixel with black
                //     if (r != 0 || g != 0 || b != 0 || a > 1) {
                //         blackImageData.data[i] = 100;
                //         blackImageData.data[i + 1] = 100;
                //         blackImageData.data[i + 2] = 100;
                //         blackImageData.data[i + 3] = 255;
                //     }
                // }
                // canvas1.putImageData(blackImageData, 0, 0);
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
                canvas1.putImageData(
                    eraseImageData,
                    toolState.current.selectionArea.startPosition.x,
                    toolState.current.selectionArea.startPosition.y,
                );
                canvas1.putImageData(
                    toolState.current.selectionArea.imgData,
                    toolState.current.selectionArea.currentPosition.x,
                    toolState.current.selectionArea.currentPosition.y
                );

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
        "shape": () => { },
        "light": () => { },
        "box": () => { },
        "wand": () => { },
        "laso": () => { },
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

        // Add passive: false if you need to call preventDefault for these events
        document.addEventListener('mousedown', setMouseState, { passive: true });
        document.addEventListener('mouseup', setMouseState, { passive: true });
        document.addEventListener('mousemove', setMouseState, { passive: true });

        const canvasContainer = document.querySelector(".p-app__canvas-container");
        if (canvasContainer) {
            canvasContainer.addEventListener('wheel', (e: any) => {
                e.preventDefault();
                e.stopPropagation();
                setZoom(e.deltaY > 0 ? -0.2 : 0.2);
            }, { passive: false });
        }

        return () => {
            document.removeEventListener('mousedown', setMouseState);
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

        setZoom();
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

    function setZoom(zoomDelta = 1) {
        mainCanvasZoom.current = Math.max(1, mainCanvasZoom.current + zoomDelta);
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
        setBrushSize,
        resizeHandler,
        setToolSettings,
        mainCanvasContainer,
    };
}


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
        left: false,
        right: false,
        middle: false,
        x: 0,
        y: 0,
        movementX: 0,
        movementY: 0,
        type: 'mousemove'
    });
    let toolState = useRef({
        stage: ToolStage.PREVIEW,
        activePoints: [] as { x: number; y: number; }[],
        selectionArea: {
            imgData: null,
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
        "brush": (x, y) => {
            if (mouseState.current.left || mouseState.current.right)
                toolState.current.stage = ToolStage.SAVE;

            // center the mouse cursor in the brush 
            let width = stateCache.current.toolSettings.size;
            let height = stateCache.current.toolSettings.size;
            let newX = x == 0 ? 0 : x - Math.floor(width / 2);
            let newY = y == 0 ? 0 : y - Math.floor(height / 2);

            canvas1.drawPixel(newX, newY, stateCache.current.toolSettings.size);
        },
        "eraser": (x, y) => {
            if (mouseState.current.left || mouseState.current.right)
                toolState.current.stage = ToolStage.SAVE;

            // center the mouse cursor in the brush 
            let width = stateCache.current.toolSettings.size;
            let height = stateCache.current.toolSettings.size;
            let newX = x == 0 ? 0 : x - Math.floor(width / 2);
            let newY = y == 0 ? 0 : y - Math.floor(height / 2);

            canvas1.erasePixel(newX, newY, stateCache.current.toolSettings.size);
        },
        "bucket": (x, y) => {
            if (mouseState.current.left || mouseState.current.right)
                toolState.current.stage = ToolStage.SAVE;

            canvas2.putImageData(activeLayer.image);
            let points = canvas2.floodFill(x, y);

            points.forEach(point => {
                canvas1.drawPixel(point[0], point[1]);
            });
        },
        "line": (x, y) => {
            console.log(mouseState.current.type);

            if (mouseState.current.type === "mousedown") {
                // Initialize the line with the start point
                toolState.current.activePoints = [{ x: Math.floor(x), y: Math.floor(y) }];
            } else if (mouseState.current.type === "mousemove" || mouseState.current.type === "mouseup") {
                // Calculate line points only if we have a start point
                if (toolState.current.activePoints.length > 0) {
                    const startPoint = toolState.current.activePoints[0];
                    const endPoint = { x: Math.floor(x), y: Math.floor(y) };
                    const points = calculateLinePoints(startPoint, endPoint);

                    // Draw each point
                    points.forEach(point => {
                        //@ts-ignore
                        canvas1.getCtx().fillRect(point.x, point.y, 1, 1); // Drawing 1x1 pixel
                    });

                    if (mouseState.current.type === "mouseup") {
                        // Finalize the line drawing
                        toolState.current.stage = ToolStage.SAVE;
                        toolState.current.activePoints = []; // Reset for the next line
                        console.log("mouseup");
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
        "mirror": (x, y) => {
            const { size, mirror } = stateCache.current.toolSettings;
            const ctx = canvas1.getCtx();
            const mirrorX = mirror.x;
            const mirrorY = mirror.y;

            if (mouseState.current.left || mouseState.current.right)
                toolState.current.stage = ToolStage.SAVE;

            ctx.fillRect(x, y, size, size);

            if (mirrorX)
                ctx.fillRect(mainCanvas.getWidth() - x - size, y, size, size);

            if (mirrorY)
                ctx.fillRect(x, mainCanvas.getHeight() - y - size, size, size);

            // Mirror both X and Y axes
            if (mirrorX && mirrorY)
                ctx.fillRect(mainCanvas.getWidth() - x - size, mainCanvas.getHeight() - y - size, size, size);

        },
        // "box": (x, y) => {
        //     let point1 = activePoints[0] ?? { x, y };
        //     let point2 = activePoints[1] ?? { x, y };
        //     let lastPoint = activePoints[2] ?? { x, y };
        //     let minY = Math.min(point1.y, point2.y);
        //     let maxY = Math.max(point1.y, point2.y);
        //     let minX = Math.min(point1.x, point2.x);
        //     let maxX = Math.max(point1.x, point2.x);
        //     let topLeftPoint = {
        //         x: minX,
        //         y: minY
        //     };
        //     let bottomRightPoint = {
        //         x: maxX,
        //         y: maxY
        //     };
        //     let height = selectionArea?.height ?? bottomRightPoint.y - topLeftPoint.y;
        //     let width = selectionArea?.width ?? bottomRightPoint.x - topLeftPoint.x;

        //     if (!selectionArea) {
        //         if (mouseState.type == "mouseup") {
        //             let tempCanvas1 = document.createElement("canvas");
        //             tempCanvas1.width = activeLayer.image.width;
        //             tempCanvas1.height = activeLayer.image.height;
        //             let tempCtx1 = tempCanvas1.getContext("2d")!;
        //             tempCtx1.putImageData(activeLayer.image, 0, 0);

        //             let newImage = tempCtx1.getImageData(topLeftPoint.x, topLeftPoint.y, width, height);
        //             setSelectionArea(newImage);
        //             setActivePoints([point1, point2]);
        //         }
        //         if (mouseState.type == "mousedown") setActivePoints([{ x, y }]);
        //     }

        //     if (mouseState.type == "mousedown") {
        //         let insideSelection = x >= lastPoint.x && x <= lastPoint.x + width && y >= lastPoint.y && y <= lastPoint.y + height;

        //         if (!insideSelection) {
        //             paintState.savePixels = true;
        //             setSelectionArea(null);
        //             setActivePoints([]);

        //             if (toolSettings.leftTool == "box") setToolSettings((t) => ({ ...t, leftTool: "brush" }));
        //             if (toolSettings.middleTool == "box") setToolSettings((t) => ({ ...t, middleTool: "brush" }));
        //             if (toolSettings.rightTool == "box") setToolSettings((t) => ({ ...t, rightTool: "brush" }));

        //             canvas1.getCtx().fillStyle = "rgba(255, 255, 255, .004)";
        //             canvas1.getCtx().fillRect(topLeftPoint.x, topLeftPoint.y, width, height);
        //         }
        //     }
        // },
        // "move": (x, y) => {
        //     if (!selectionArea) {
        //         setActivePoints([{ x: 0, y: 0 }, { x: activeLayer.image.width, y: activeLayer.image.height }]);
        //         setSelectionArea(activeLayer.image);
        //     }

        //     if (mouseState.type == "mousedown" && selectionArea) {
        //         let point1 = activePoints[0] ?? { x, y };
        //         let point2 = activePoints[1] ?? { x, y };
        //         let lastPoint = activePoints[2] ?? { x, y };
        //         let minY = Math.min(point1.y, point2.y);
        //         let maxY = Math.max(point1.y, point2.y);
        //         let minX = Math.min(point1.x, point2.x);
        //         let maxX = Math.max(point1.x, point2.x);
        //         let topLeftPoint = {
        //             x: minX,
        //             y: minY
        //         };
        //         let bottomRightPoint = {
        //             x: maxX,
        //             y: maxY
        //         };
        //         let height = selectionArea?.height ?? bottomRightPoint.y - topLeftPoint.y;
        //         let width = selectionArea?.width ?? bottomRightPoint.x - topLeftPoint.x;
        //         let insideSelection = x >= lastPoint.x && x <= lastPoint.x + width && y >= lastPoint.y && y <= lastPoint.y + height;

        //         if (!insideSelection) {
        //             paintState.savePixels = true;
        //             setSelectionArea(null);
        //             setActivePoints([]);

        //             if (toolSettings.leftTool == "move") setToolSettings((t) => ({ ...t, leftTool: "brush" }));
        //             if (toolSettings.middleTool == "move") setToolSettings((t) => ({ ...t, middleTool: "brush" }));
        //             if (toolSettings.rightTool == "move") setToolSettings((t) => ({ ...t, rightTool: "brush" }));

        //             canvas1.getCtx().fillStyle = "rgba(255, 255, 255, .004)";
        //             canvas1.getCtx().fillRect(topLeftPoint.x, topLeftPoint.y, width, height);
        //         }
        //     }
        // },
        "eyedropper": (x, y) => {
            let image = mainCanvas.getImageData();
            let current = {
                r: image.data[(((y * image.width) + x) * 4)],
                g: image.data[(((y * image.width) + x) * 4) + 1],
                b: image.data[(((y * image.width) + x) * 4) + 2],
                a: image.data[(((y * image.width) + x) * 4) + 3]
            };
            if (mouseState.current.left || mouseState.current.right) setActiveColor(current);
        },
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
            // Standardize button detection across different event types
            const isLeftButtonDown = e.buttons === 1 || e.button === 0;
            const isMiddleButtonDown = e.buttons === 4 || e.button === 1;
            const isRightButtonDown = e.buttons === 2 || e.button === 2;

            mouseState.current = {
                x: e.clientX,
                y: e.clientY,
                movementX: e.movementX,
                movementY: e.movementY,
                left: isLeftButtonDown,
                middle: isMiddleButtonDown,
                right: isRightButtonDown,
                type: e.type,
            };
        };

        // Add passive: false if you need to call preventDefault for these events
        document.addEventListener('mousedown', setMouseState, { passive: true });
        document.addEventListener('mouseup', setMouseState, { passive: true });
        document.addEventListener('mousemove', setMouseState, { passive: true });
        document.addEventListener('pointerdown', setMouseState, { passive: true });
        document.addEventListener('pointerup', setMouseState, { passive: true });
        document.addEventListener('pointermove', setMouseState, { passive: true });

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
            document.removeEventListener('pointerdown', setMouseState);
            document.removeEventListener('pointerup', setMouseState);
            document.removeEventListener('pointermove', setMouseState);
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
        let existingColor = stateCache.current.activeColorPalette.colors
            .find(color => JSON.stringify(color) === JSON.stringify(stateCache.current.activeColor));

        if (!existingColor && (mouseState.current.left || mouseState.current.right || mouseState.current.middle)) {
            let newColorPallete = { ...stateCache.current.activeColorPalette };
            newColorPallete.colors.push(stateCache.current.activeColor);
            setActiveColorPalette(newColorPallete);
        }
        if ((mouseState.current.left || mouseState.current.right || mouseState.current.middle)) {
            let { r, g, b, a } = stateCache.current.activeColor;
            let colorString = `${r},${g},${b},${a}`;
            setColorStats({
                ...stateCache.current.colorStats,
                [colorString]: {
                    count: (stateCache.current.colorStats[colorString]?.count ?? 0) + 1,
                    lastUsed: (new Date()).toUTCString()
                }
            });
        }

        // position relative to the canvas element
        let rect = mainCanvas.getElement().getBoundingClientRect();
        let x = Math.floor((mouseState.current.x - rect.x) / mainCanvasZoom.current);
        let y = Math.floor((mouseState.current.y - rect.y) / mainCanvasZoom.current);

        const { leftTool, rightTool, middleTool } = stateCache.current.toolSettings;
        const tool =
            mouseState.current.left ? leftTool :
                mouseState.current.right ? rightTool :
                    mouseState.current.middle ? middleTool : leftTool;

        let { r, g, b, a } = stateCache.current.activeColor;
        canvas1.getCtx().fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;

        //* draw a preview of the selected tool
        toolHandlers[tool]?.(x, y);

        // draw selection widget
        // if (!paintState.savePixels && (tool == "box" || tool == "move")) {
        //     let localTopLeft = activePoints[2] ?? activePoints[0] ?? { x, y };
        //     let localBottomRight = (activePoints[2] && selectionArea) ? { x: activePoints[2].x + selectionArea?.width, y: activePoints[2].y + selectionArea?.height } : activePoints[1] ?? { x, y };

        //     canvas1.getCtx().lineWidth = 1;
        //     canvas1.getCtx().strokeRect(Math.max(localTopLeft.x - 0.5, 0), Math.max(localTopLeft.y - 0.5, 0), localBottomRight.x - localTopLeft.x, localBottomRight.y - localTopLeft.y);
        // }

        // if were currently selecting an area
        // if (selectionArea) {
        //     let offsetX = mouseState.current.movementX;
        //     let offsetY = mouseState.current.movementY;
        //     let lastPoint = (activePoints.length <= 2) ? activePoints[0] : activePoints[activePoints.length - 1];

        //     if (mouseState.current.left) {
        //         lastPoint.x += offsetX;
        //         lastPoint.y += offsetY;
        //         setActivePoints(p => [p[0], p[1], { ...lastPoint }]);
        //     }

        //     canvas1.putImageData(selectionArea, lastPoint.x, lastPoint.y);
        // }

        let canvas1Img = canvas1.getImageData();

        // save pixels to layer
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


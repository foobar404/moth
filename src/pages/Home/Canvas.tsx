import { ImMinus } from "react-icons/im";
import ReactTooltip from 'react-tooltip';
import { IToolSettings } from "../../types";
import { BiPlusMedical } from "react-icons/bi";
import React, { useEffect, useRef } from 'react';
import { FaUndoAlt, FaRedoAlt } from "react-icons/fa";
import { useCanvas as useCanvasHook, useShortcuts } from "../../utils";


export function Canvas() {
    const data = useCanvas();

    return (
        <section className="p-app__canvas p-app__block">
            <nav className="p-app__brush-controls">
                {props.toolSettings.leftTool === "mirror" && (<>
                    <label className="mr-2 flex"
                        data-tip="mirror x & y axis"
                        data-for="tooltip">
                        <span className="mr-1">X & Y</span>
                        <input type="radio"
                            className="c-input"
                            name="mirror-type"
                            checked={props.toolSettings.mirror.x && props.toolSettings.mirror.y}
                            onClick={() => props.setToolSettings((t: IToolSettings) => ({ ...t, mirror: { x: true, y: true } }))} />
                    </label>
                    <label className="mr-2 flex"
                        data-tip="mirror x axis"
                        data-for="tooltip">
                        <span className="mr-1">X</span>
                        <input type="radio"
                            className="c-input"
                            name="mirror-type"
                            checked={props.toolSettings.mirror.x && !props.toolSettings.mirror.y}
                            onClick={() => props.setToolSettings((t: IToolSettings) => ({ ...t, mirror: { x: true, y: false } }))} />
                    </label>
                    <label className="mr-2 flex"
                        data-tip="mirror y axis"
                        data-for="tooltip">
                        <span className="mr-1">Y</span>
                        <input type="radio"
                            className="c-input"
                            name="mirror-type"
                            checked={props.toolSettings.mirror.y && !props.toolSettings.mirror.x}
                            onClick={() => props.setToolSettings((t: IToolSettings) => ({ ...t, mirror: { x: false, y: true } }))} />
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
                    {props.toolSettings.size}
                </span>
            </nav>

            <nav className="p-app__canvas-controls">
                {/* <label>
                    <p hidden>height</p>
                    <input data-tip="grid height"
                        data-for="tooltip"
                        type="number"
                        className="c-input --xs mr-2"
                        value={((props?.canvas?.height ?? 1)) ?? 0}
                        onChange={e => data.resizeHandler({ height: e.currentTarget.valueAsNumber })} />
                </label>
                <label>
                    <p hidden>width</p>
                    <input data-tip="grid width"
                        data-for="tooltip"
                        type="number"
                        className="c-input --xs mr-2"
                        value={((props?.canvas?.width ?? 1)) ?? 0}
                        onChange={e => data.resizeHandler({ width: e.currentTarget.valueAsNumber })} />
                </label> */}
                {/* <button data-tip="zoom out"
                    data-for="tooltip"
                    onClick={() => data.setZoom(-2)}
                    className="c-button --xs --fourth mr-2">
                    <ImMinus />
                </button>
                <button data-tip="zoom in"
                    data-for="tooltip"
                    onClick={() => data.setZoom(2)}
                    className="c-button --xs --fourth mr-2">
                    <BiPlusMedical />
                </button> */}
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
    const mainCanvasContainer = useRef<HTMLElement>(null);
    const mainCanvas = useCanvasHook();
    const canvas1 = useCanvasHook();
    const canvas2 = useCanvasHook();

    let selectionArea = useRef({
        data: null,
        startPosition: { x: 0, y: 0 },
        currentPosition: { x: 0, y: 0 },
    });
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
        stage: "preview"
    });
    let propsCache = useRef({ ...props });
    let { current: activePoints } = useRef<{ x: number, y: number }[]>([]);
    let keys = useShortcuts({
        "control+z": undo,
        "[": () => setBrushSize(-1),
        "]": () => setBrushSize(1),
    });
    let toolHandlers = {
        "brush": (mouseState, paintState, x, y) => {
            if (mouseState.left || mouseState.right) paintState.savePixels = true;

            // center the mouse cursor in the brush 
            let width = props.toolSettings.size;
            let height = props.toolSettings.size;
            let newX = x == 0 ? 0 : (x - (width / 2)) + ((x - (width / 2)) % 1);
            let newY = y == 0 ? 0 : (y - (height / 2)) + ((y - (height / 2)) % 1);

            canvas1.ctx!.fillRect(newX, newY, width, height);

            return paintState;
        },
        "eraser": (mouseState, paintState, x, y) => {
            if (mouseState.left || mouseState.right) paintState.savePixels = true;

            // center the mouse cursor in the brush 
            let width = props.toolSettings.size;
            let height = props.toolSettings.size;
            let newX = x == 0 ? 0 : (x - (width / 2)) + ((x - (width / 2)) % 1);
            let newY = y == 0 ? 0 : (y - (height / 2)) + ((y - (height / 2)) % 1);

            canvas1.ctx!.fillStyle = "rgba(255, 255, 255, .004)";
            canvas1.ctx!.fillRect(newX, newY, width, height);

            return paintState;
        },
        "bucket": (mouseState, paintState, x, y) => {
            if (mouseState.left || mouseState.right) paintState.savePixels = true;
            // floodFill(props.activeLayer.image, x, y, props.activeColor);

            return paintState;
        },
        "line": (mouseState, paintState, x, y) => {
            if (mouseState.type == "mouseup") {
                paintState.savePixels = true;
                activePoints = [];
            }
            if (mouseState.type == "mousedown") {
                activePoints = [{ x, y }];
            }

            let point = activePoints[0] ?? { x, y };
            let xDelta = x - point.x;
            let yDelta = y - point.y;
            let distance = Math.sqrt(xDelta * xDelta + yDelta * yDelta);
            let pointCount = Math.floor(distance);
            let progress = 1 / pointCount;
            let points = [point];

            for (let i = 1; i < pointCount; i++) {
                let newX = points[0].x + (x - points[0].x) * (progress * i);
                let newY = points[0].y + (y - points[0].y) * (progress * i);
                points.push({ x: newX, y: newY });
            }

            points.push({ x, y });
            points.forEach(point => {
                point.x = point.x - (point.x % 1);
                point.y = point.y - (point.y % 1);

                canvas1.ctx!.fillRect(point.x, point.y, 1, 1);
            });

            return paintState;
        },
        "mirror": (mouseState, paintState, x, y) => {
            if (mouseState.left || mouseState.right) paintState.savePixels = true;

            if (props.toolSettings.mirror.x) {
                canvas1.ctx!.fillRect(x, y, props.toolSettings.size, props.toolSettings.size);
                canvas1.ctx!.fillRect(mainCanvas.width - x - 1, y, props.toolSettings.size, props.toolSettings.size);
            }
            if (props.toolSettings.mirror.y) {
                canvas1.ctx!.fillRect(x, y, props.toolSettings.size, props.toolSettings.size);
                canvas1.ctx!.fillRect(x, mainCanvas.height - y - 1, props.toolSettings.size, props.toolSettings.size);
            }
            if (props.toolSettings.mirror.x && props.toolSettings.mirror.y) {
                canvas1.ctx!.fillRect(x, y, props.toolSettings.size, props.toolSettings.size);
                canvas1.ctx!.fillRect(mainCanvas.width - x - 1, y, props.toolSettings.size, props.toolSettings.size);
                canvas1.ctx!.fillRect(x, mainCanvas.height - y - 1, props.toolSettings.size, props.toolSettings.size);
                canvas1.ctx!.fillRect(mainCanvas.width - x - 1, mainCanvas.height - y - 1, props.toolSettings.size, props.toolSettings.size);
            }

            return paintState;
        },
        // "box": (mouseState, paintState, x, y) => {
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
        //             tempCanvas1.width = props.activeLayer.image.width;
        //             tempCanvas1.height = props.activeLayer.image.height;
        //             let tempCtx1 = tempCanvas1.getContext("2d")!;
        //             tempCtx1.putImageData(props.activeLayer.image, 0, 0);

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

        //             if (props.toolSettings.leftTool == "box") props.setToolSettings((t) => ({ ...t, leftTool: "brush" }));
        //             if (props.toolSettings.middleTool == "box") props.setToolSettings((t) => ({ ...t, middleTool: "brush" }));
        //             if (props.toolSettings.rightTool == "box") props.setToolSettings((t) => ({ ...t, rightTool: "brush" }));

        //             canvas1.ctx!.fillStyle = "rgba(255, 255, 255, .004)";
        //             canvas1.ctx!.fillRect(topLeftPoint.x, topLeftPoint.y, width, height);
        //         }
        //     }

        //     return paintState;
        // },
        // "move": (mouseState, paintState, x, y) => {
        //     if (!selectionArea) {
        //         setActivePoints([{ x: 0, y: 0 }, { x: props.activeLayer.image.width, y: props.activeLayer.image.height }]);
        //         setSelectionArea(props.activeLayer.image);
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

        //             if (props.toolSettings.leftTool == "move") props.setToolSettings((t) => ({ ...t, leftTool: "brush" }));
        //             if (props.toolSettings.middleTool == "move") props.setToolSettings((t) => ({ ...t, middleTool: "brush" }));
        //             if (props.toolSettings.rightTool == "move") props.setToolSettings((t) => ({ ...t, rightTool: "brush" }));

        //             canvas1.ctx!.fillStyle = "rgba(255, 255, 255, .004)";
        //             canvas1.ctx!.fillRect(topLeftPoint.x, topLeftPoint.y, width, height);
        //         }
        //     }

        //     return paintState;
        // },
        "eyedropper": (mouseState, paintState, x, y) => {
            let image = mainCanvas.getImageData();
            let current = {
                r: image.data[(((y * image.width) + x) * 4)],
                g: image.data[(((y * image.width) + x) * 4) + 1],
                b: image.data[(((y * image.width) + x) * 4) + 2],
                a: image.data[(((y * image.width) + x) * 4) + 3]
            };
            props.setActiveColor(current);

            return paintState;
        },
    };

    useEffect(() => {
        (function render() {
            requestAnimationFrame(render);
            paint();
        })();
    }, []);

    useEffect(() => {
        let setMouseState = e => {
            mouseState.current = {
                x: e.clientX,
                y: e.clientY,
                movementX: e.movementX,
                movementY: e.movementY,
                left: e.buttons === 1,
                middle: e.buttons === 4 || e.button === 1,
                right: e.buttons === 2 || e.button === 2,
                type: e.type as IMouseState["type"]
            } as IMouseState;
        };

        document.addEventListener('mousedown', setMouseState);
        document.addEventListener('mouseup', setMouseState);
        document.addEventListener('mousemove', setMouseState);
        document.addEventListener('pointerdown', setMouseState);
        document.addEventListener('pointerup', setMouseState);
        document.addEventListener('pointermove', setMouseState);

        document.querySelector(".p-app__canvas-container")!.addEventListener('wheel', (e: any) => {
            e.preventDefault();
            e.stopPropagation();
            // setZoom(e.deltaY > 0 ? -.2 : .2);
        }, { passive: false });

        return () => {
            document.removeEventListener('mousedown', setMouseState);
            document.removeEventListener('mouseup', setMouseState);
            document.removeEventListener('mousemove', setMouseState);
            document.removeEventListener('pointerdown', setMouseState);
            document.removeEventListener('pointerup', setMouseState);
            document.removeEventListener('pointermove', setMouseState);
        }
    }, []);

    useEffect(() => {
        mainCanvasContainer.current?.appendChild(mainCanvas.canvas);
        mainCanvas.ctx!.imageSmoothingEnabled = false;
    }, []);

    useEffect(() => {
        propsCache.current = { ...props };
    }, [props]);

    useEffect(() => { ReactTooltip.rebuild() }, [props.toolSettings]);

    // function setZoom(zoomDelta: number) {
    //     if (!props.canvas) return;
    //     if (!props.canvas.ctx) return;

    //     let newZoom = ((props.canvas?.zoom ?? 1) + zoomDelta < 1)
    //         ? (zoomDelta < 0 ? ((props.canvas?.zoom ?? 1) / 2) : ((props.canvas?.zoom ?? 1) * 2)) : (props.canvas?.zoom ?? 1) + zoomDelta;

    //     props.canvas.zoom = newZoom;
    //     props.setCanvas({ ...props.canvas });
    // }

    function setBrushSize(delta: number) {
        props.setToolSettings((p: IToolSettings) =>
            ({ ...p, size: (p.size + delta < 1) ? 1 : (p.size + delta) }));
    }

    function undo() { }

    function redo() { }

    // function resizeHandler(size: { height?: number, width?: number }) {
    //     if (!props.canvas) return;

    //     let canvasState = { ...props.canvas };

    //     props.canvas.element!.style.width = `${canvasState.width * (props.canvas?.zoom ?? 1)}px`;
    //     props.canvas.element!.style.height = `${canvasState.height * (props.canvas?.zoom ?? 1)}px`;

    //     props.setCanvas(canvasState);
    // }

    function paint() {
        let paintState = {
            savePixels: false
        };

        canvas1.clear();
        canvas2.clear();
        mainCanvas.clear();
        mainCanvas.drawGrid();

        // color related operations
        let existingColor = propsCache.current.activeColorPallete.colors
            .find(color => JSON.stringify(color) === JSON.stringify(propsCache.current.activeColor));

        if (!existingColor && (mouseState.current.left || mouseState.current.right || mouseState.current.middle)) {
            let newColorPallete = { ...propsCache.current.activeColorPallete };
            newColorPallete.colors.push(propsCache.current.activeColor);
            propsCache.current.setActiveColorPallete(newColorPallete);
        }
        if ((mouseState.current.left || mouseState.current.right || mouseState.current.middle)) {
            let { r, g, b, a } = propsCache.current.activeColor;
            let colorString = `${r},${g},${b},${a}`;
            propsCache.current.setColorStats(cs => ({
                ...cs,
                [colorString]: {
                    count: (cs[colorString]?.count ?? 0) + 1,
                    lastUsed: (new Date()).toUTCString()
                }
            }));
        }

        // position relative to the canvas element
        let rect = mainCanvas.canvas.getBoundingClientRect();
        let x = Math.floor(mouseState.current.x - rect.x);
        let y = Math.floor(mouseState.current.y - rect.y);

        const { leftTool, rightTool, middleTool } = propsCache.current.toolSettings;
        const tool =
            mouseState.current.left ? leftTool :
                mouseState.current.right ? rightTool :
                    mouseState.current.middle ? middleTool : leftTool;

        let { r, g, b, a } = propsCache.current.activeColor;
        canvas1.ctx!.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;

        //* draw a preview of the selected tool
        paintState = toolHandlers[tool](mouseState.current, paintState, x, y);

        // draw selection widget
        // if (!paintState.savePixels && (tool == "box" || tool == "move")) {
        //     let localTopLeft = activePoints[2] ?? activePoints[0] ?? { x, y };
        //     let localBottomRight = (activePoints[2] && selectionArea) ? { x: activePoints[2].x + selectionArea?.width, y: activePoints[2].y + selectionArea?.height } : activePoints[1] ?? { x, y };

        //     canvas1.ctx!.lineWidth = 1;
        //     canvas1.ctx!.strokeRect(Math.max(localTopLeft.x - 0.5, 0), Math.max(localTopLeft.y - 0.5, 0), localBottomRight.x - localTopLeft.x, localBottomRight.y - localTopLeft.y);
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

        let tempImage = canvas1.getImageData();

        // save pixels to layer
        if (paintState.savePixels) {
            for (let i = 0; i < tempImage.data.length; i += 4) {
                let r = tempImage.data[i];
                let g = tempImage.data[i + 1];
                let b = tempImage.data[i + 2];
                let a = tempImage.data[i + 3];

                // paint colored pixels
                if (r != 0 || g != 0 || b != 0 || a > 1) {
                    propsCache.current.activeLayer.image!.data[i] = tempImage.data[i];
                    propsCache.current.activeLayer.image!.data[i + 1] = tempImage.data[i + 1];
                    propsCache.current.activeLayer.image!.data[i + 2] = tempImage.data[i + 2];
                    propsCache.current.activeLayer.image!.data[i + 3] = tempImage.data[i + 3];
                }

                // erase invisible pixels 
                if (a === 1) {
                    propsCache.current.activeLayer.image!.data[i] = 0;
                    propsCache.current.activeLayer.image!.data[i + 1] = 0;
                    propsCache.current.activeLayer.image!.data[i + 2] = 0;
                    propsCache.current.activeLayer.image!.data[i + 3] = 0;
                }
            }
            propsCache.current.setActiveLayer({ ...propsCache.current.activeLayer });
        }

        let reversedLayers = propsCache.current.activeFrame.layers.slice().reverse();
        reversedLayers.forEach((layer) => {
            // apply layer opacity 
            let diff = 255 - layer.opacity;
            canvas1.putImageData(layer.image);
            let imageDataCopy = canvas1.getImageData();
            for (let i = 3; i < imageDataCopy.data.length; i += 4) {
                imageDataCopy.data[i] = imageDataCopy.data[i] - diff;
            }

            // start painting old pixels 
            canvas1.putImageData(imageDataCopy);

            // finish painting old pixels
            mainCanvas.drawImage(canvas1.canvas);

            // paint new pixels 
            if (layer.symbol == propsCache.current.activeLayer.symbol) {
                canvas1.putImageData(tempImage);
                mainCanvas.drawImage(canvas1.canvas);
            }
        });
    }

    return {
        undo,
        redo,
        setBrushSize,
        // resizeHandler,
        mainCanvasContainer,
    };
}


import { IoEye } from "react-icons/io5";
import { ImMinus } from "react-icons/im";
import ReactTooltip from 'react-tooltip';
import { HiEyeOff } from "react-icons/hi";
import { BiPlusMedical } from "react-icons/bi";
import { FaUndoAlt, FaRedoAlt } from "react-icons/fa";
import React, { useEffect, useRef, useState } from 'react';
import { ICanvas, ILayer, IColor, IFrame, IToolSettings, IColorPallete, IColorStats } from "./";


interface IProps {
    frames: IFrame[];
    pixelSize: number;
    activeLayer: ILayer;
    activeFrame: IFrame;
    activeColor: IColor;
    defaultCanvasSize: number;
    toolSettings: IToolSettings;
    activeColorPallete: IColorPallete;
    setCanvas: (canvas: ICanvas) => void;
    setActiveLayer: (layer: ILayer) => void;
    setActiveColor: (color: IColor) => void;
    setActiveColorPallete: (colorPallete: IColorPallete) => void;
    setColorStats: (cs: IColorStats | ((cs: IColorStats) => IColorStats)) => void;
    setToolSettings: (toolSettings: IToolSettings | ((t: IToolSettings) => IToolSettings)) => void;
    canvas?: ICanvas;
}

interface IMouseState {
    x: number;
    y: number;
    left: boolean;
    right: boolean;
    middle: boolean;
    movementX: number;
    movementY: number;
    type: 'mousedown' | 'mouseup' | 'mousemove';
}

export function Canvas(props: IProps) {
    const data = useCanvas(props);

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
                <label>
                    <p hidden>height</p>
                    <input data-tip="grid height"
                        data-for="tooltip"
                        type="number"
                        className="c-input --xs mr-2"
                        value={((props?.canvas?.height ?? 1) / props.pixelSize) ?? 0}
                        onChange={e => data.resizeHandler({ height: e.currentTarget.valueAsNumber })} />
                </label>
                <label>
                    <p hidden>width</p>
                    <input data-tip="grid width"
                        data-for="tooltip"
                        type="number"
                        className="c-input --xs mr-2"
                        value={((props?.canvas?.width ?? 1) / props.pixelSize) ?? 0}
                        onChange={e => data.resizeHandler({ width: e.currentTarget.valueAsNumber })} />
                </label>
                <button data-tip="zoom out"
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
                </button>
                <button data-tip="undo ( ctrl + z )"
                    data-for="tooltip"
                    onClick={data.undo}
                    className="c-button --xs --fourth mr-2">
                    <FaUndoAlt />
                </button>
                <button data-tip="redo ( ctrl + shift + z )"
                    data-for="tooltip"
                    onClick={data.undo}
                    className="c-button --xs --fourth mr-2">
                    <FaRedoAlt />
                </button>
                <button data-tip="toggle grid"
                    data-for="tooltip"
                    onClick={() => data.setShowGrid(s => !s)}
                    className="c-button --xs --fourth">
                    {data.showGrid ? < IoEye /> : <HiEyeOff />}
                </button>
            </nav>

            <section className="p-app__canvas-container">
                <canvas className="p-app__canvas-elm"
                    ref={data.canvasRef}
                    onContextMenu={() => false}
                    onTouchStart={data.mouseEventHandler as any}
                    onTouchMove={data.mouseEventHandler as any}
                    onTouchEnd={data.mouseEventHandler as any}
                    onMouseDown={data.mouseEventHandler}
                    onMouseMove={data.mouseEventHandler}
                    onMouseUp={data.mouseEventHandler}></canvas>
            </section>
        </section>
    )
}

function useCanvas(props: IProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    let shortcuts: { [shortcut: string]: () => any } = {
        "control+z": undo,
        "[": () => setBrushSize(-1),
        "]": () => setBrushSize(1),
    }
    let [showGrid, setShowGrid] = useState(true);
    let [activeKeys, setActiveKeys] = useState<string[]>([]);
    let [layerHistory, setLayerHistory] = useState<ILayer[]>([]);
    let [selectionArea, setSelectionArea] = useState<ImageData | null>(null);
    let [activePoints, setActivePoints] = useState<{ x: number, y: number }[]>([]);
    let [tempCanvas, setTempCanvas] = useState<{ element: HTMLCanvasElement, ctx: CanvasRenderingContext2D } | null>(null);

    useEffect(() => {
        document.addEventListener('keydown', (e) => {
            if (e.repeat) return;

            setActiveKeys((oldActiveKeys) => {
                if (oldActiveKeys.includes(e.key.toLowerCase())) return oldActiveKeys;

                let keys = [...oldActiveKeys, e.key.toLowerCase()];

                for (let i = 0; i < keys.length; i++) {
                    for (let j = i + 1; j < keys.length; j++) {
                        let key1 = `${keys[i]}+${keys[j]}`;
                        let key2 = `${keys[j]}+${keys[i]}`;
                        let key3 = keys[i];
                        let key4 = keys[j];

                        if (shortcuts[key1]) shortcuts[key1]();
                        if (shortcuts[key2]) shortcuts[key2]();
                        if (shortcuts[key3]) shortcuts[key3]();
                        if (shortcuts[key4]) shortcuts[key4]();
                    }
                }

                return keys;
            });
        });
        document.addEventListener('keyup', (e) => {
            setActiveKeys((oldActiveKeys) => (
                oldActiveKeys.filter(key => key !== e.key.toLowerCase())
            ));
        });
    }, []);

    useEffect(() => {
        paint(null, true);
    }, [showGrid, props.activeLayer, props.activeFrame]);

    useEffect(() => {
        let ctx = canvasRef?.current?.getContext('2d');

        if (!canvasRef.current) return;
        if (!ctx) return;

        let canvasState: ICanvas = {
            element: canvasRef.current,
            ctx: ctx,
            height: props.defaultCanvasSize * props.pixelSize,
            width: props.defaultCanvasSize * props.pixelSize,
            zoom: 15,
        };

        canvasState.element!.width = canvasState.width;
        canvasState.element!.height = canvasState.height;

        props.setCanvas({ ...canvasState });

        let tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvasState.width;
        tempCanvas.height = canvasState.height;

        let tempCtx = tempCanvas.getContext("2d");
        tempCtx!.imageSmoothingEnabled = false;

        setTempCanvas({
            element: tempCanvas,
            ctx: tempCtx!
        });
    }, [canvasRef.current]);

    useEffect(() => {
        if (!props?.canvas?.ctx) return;

        paint();

        props.canvas.element!.style.width = `${props.canvas.width * (props.canvas?.zoom ?? 1)}px`;
        props.canvas.element!.style.height = `${props.canvas.height * (props.canvas.zoom ?? 1)}px`;
        props.canvas.element!.addEventListener('wheel', (e) => {
            e.preventDefault();
            e.stopPropagation();

            let zoom = e.deltaY > 0 ? -.2 : .2;
            setZoom(zoom);
        }, { passive: false });
    }, [props.canvas]);

    useEffect(() => {
        if (!tempCanvas) return;
        if (!props.canvas) return;

        tempCanvas.element.width = props.canvas.width;
        tempCanvas.element.height = props.canvas.height;
    }, [props.canvas?.height, props.canvas?.width]);

    useEffect(() => {
        ReactTooltip.rebuild();
    }, [props.toolSettings])

    function setZoom(zoomDelta: number) {
        if (!props.canvas) return;
        if (!props.canvas.ctx) return;

        let newZoom = ((props.canvas?.zoom ?? 1) + zoomDelta < 1)
            ? (zoomDelta < 0 ? ((props.canvas?.zoom ?? 1) / 2) : ((props.canvas?.zoom ?? 1) * 2)) : (props.canvas?.zoom ?? 1) + zoomDelta;

        props.canvas.zoom = newZoom;
        props.setCanvas({ ...props.canvas });
    }

    function setBrushSize(delta: number) {
        props.setToolSettings((p: IToolSettings) =>
            ({ ...p, size: (p.size + delta < 1) ? 1 : (p.size + delta) }));
    }

    function mouseEventHandler(e: React.MouseEvent<HTMLCanvasElement>) {
        if (!props.canvas) return;
        // e.preventDefault();
        e.stopPropagation();

        let mouseState: IMouseState = {
            x: e.clientX,
            y: e.clientY,
            movementX: e.movementX,
            movementY: e.movementY,
            left: e.buttons === 1,
            middle: e.buttons === 4 || e.button === 1,
            right: e.buttons === 2 || e.button === 2,
            type: e.type as IMouseState["type"]
        };

        paint({ ...mouseState });

        // fill in missed pixels if the mouse is moving to fast
        let lastPoint = (window as any).GLOBAL_LAST_POINT ?? { x: 0, y: 0 };
        if (Math.abs(mouseState.x - lastPoint.x) != 1 && Math.abs(mouseState.y - lastPoint.y) != 1) {
            let distance = 18;
            let progress = 1 / distance;
            let newMouseState: IMouseState;
            let prevPoint: { x: number, y: number } | null = null;

            for (let i = 1; i <= distance; i++) {
                let point = {
                    x: lastPoint.x + (mouseState.x - lastPoint.x) * (progress * i),
                    y: lastPoint.y + (mouseState.y - lastPoint.y) * (progress * i),
                }

                if (prevPoint != null && point.x == prevPoint.x && point.y == prevPoint.y) continue;
                prevPoint = point;

                newMouseState = {
                    ...mouseState,
                    x: point.x,
                    y: point.y,
                };
                paint(newMouseState);
            }
        }
        (window as any).GLOBAL_LAST_POINT = { x: mouseState.x, y: mouseState.y };
    }

    function drawCheckeredGrid() {
        if (!props.canvas) return;
        if (!props.canvas.ctx) return;
        if (!showGrid) return;

        let size = props.pixelSize;
        let rows = props.canvas.height / size;
        let cols = props.canvas.width / size;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let x = j * size;
                let y = i * size;
                let color = (i + j) % 2 === 0 ? '#fff' : '#ddd';
                props.canvas.ctx.fillStyle = color;
                props.canvas.ctx.fillRect(x, y, size, size);
            }
        }
    }

    function floodFill(
        image: ImageData,
        sx: number,
        sy: number,
        newColor: IColor,
        prevColor?: IColor,
        scannedCoords?: { [key: string]: boolean }
    ) {
        if (!prevColor) prevColor = {
            r: image.data[(((sy * image.width) + sx) * 4)],
            g: image.data[(((sy * image.width) + sx) * 4) + 1],
            b: image.data[(((sy * image.width) + sx) * 4) + 2],
            a: image.data[(((sy * image.width) + sx) * 4) + 3]
        };
        if (!scannedCoords) scannedCoords = {};
        if (scannedCoords[`${sx},${sy}`]) return;
        if (sx < 0) return;
        if (sy < 0) return;
        if (sx >= image.width) return;
        if (sy >= image.height) return;

        scannedCoords[`${sx},${sy}`] = true;

        let current = {
            r: image.data[(((sy * image.width) + sx) * 4)],
            g: image.data[(((sy * image.width) + sx) * 4) + 1],
            b: image.data[(((sy * image.width) + sx) * 4) + 2],
            a: image.data[(((sy * image.width) + sx) * 4) + 3]
        }

        let colorsAreTheSame = current.r == prevColor.r && current.g == prevColor.g && current.b == prevColor.b && current.a == prevColor.a;
        if (!colorsAreTheSame) return;

        tempCanvas!.ctx.fillStyle = `rgba(${newColor.r},${newColor.g},${newColor.b},${newColor.a / 255})`;
        tempCanvas!.ctx.fillRect(sx, sy, props.pixelSize, props.pixelSize);

        floodFill(image, sx - props.pixelSize, sy, newColor, current, scannedCoords);
        floodFill(image, sx + props.pixelSize, sy, newColor, current, scannedCoords);
        floodFill(image, sx, sy - props.pixelSize, newColor, current, scannedCoords);
        floodFill(image, sx, sy + props.pixelSize, newColor, current, scannedCoords);
    }

    function undo() {
        setLayerHistory(oldLayerHistory => {
            let targetLayer: ILayer;
            let oldLayerState = oldLayerHistory.pop();
            if (!oldLayerState) return oldLayerHistory;

            props.frames.forEach(frame => {
                frame.layers.forEach(layer => {
                    if (layer.symbol == oldLayerState?.symbol)
                        targetLayer = layer;
                });
            });

            if (!targetLayer!) return oldLayerHistory;

            targetLayer!.image = oldLayerState!.image;
            props.setActiveLayer({ ...targetLayer });

            return [...oldLayerHistory];
        });
    }

    function resizeHandler(size: { height?: number, width?: number }) {
        if (!props.canvas) return;

        let canvasState = { ...props.canvas };
        if (size.height) canvasState.height = size.height * props.pixelSize;
        if (size.width) canvasState.width = size.width * props.pixelSize;

        props.canvas.element!.style.width = `${canvasState.width * (props.canvas?.zoom ?? 1)}px`;
        props.canvas.element!.style.height = `${canvasState.height * (props.canvas?.zoom ?? 1)}px`;

        props.setCanvas(canvasState);
    }

    function paint(mouseState?: IMouseState | null, fakeEvent: boolean = false) {
        if (!props?.canvas?.ctx) return;
        if (!tempCanvas?.ctx) return;
        if (!mouseState) {
            mouseState = {
                left: false,
                right: false,
                middle: false,
                x: 0,
                y: 0,
                movementX: 0,
                movementY: 0,
                type: 'mousemove'
            };
        }

        props.canvas.ctx.clearRect(0, 0, props.canvas.width, props.canvas.height);
        tempCanvas.ctx.clearRect(0, 0, props.canvas.width, props.canvas.height);
        drawCheckeredGrid();

        // color related operations
        let existingColor = props.activeColorPallete.colors
            .find(color => JSON.stringify(color) === JSON.stringify(props.activeColor));

        if (!existingColor && (mouseState.left || mouseState.right || mouseState.middle)) {
            let newColorPallete = { ...props.activeColorPallete };
            newColorPallete.colors.push(props.activeColor);
            props.setActiveColorPallete(newColorPallete);
        }
        if ((mouseState.left || mouseState.right || mouseState.middle)) {
            let { r, g, b, a } = props.activeColor;
            let colorString = `${r},${g},${b},${a}`;
            props.setColorStats(cs => ({
                ...cs,
                [colorString]: {
                    count: (cs[colorString]?.count ?? 0) + 1,
                    lastUsed: (new Date()).toUTCString()
                }
            }));
        }

        // position relative to the canvas element
        let rect = props.canvas.element!.getBoundingClientRect();
        let x = (mouseState.x - rect.x) / (props.canvas?.zoom ?? 1);
        let y = (mouseState.y - rect.y) / (props.canvas?.zoom ?? 1);

        let tool = "";
        if (mouseState.left) tool = props.toolSettings.leftTool;
        else if (mouseState.right) tool = props.toolSettings.rightTool;
        else if (mouseState.middle) tool = props.toolSettings.middleTool;
        else tool = props.toolSettings.leftTool;

        const snapping = true;
        if (snapping) {
            x = x - (x % props.pixelSize);
            y = y - (y % props.pixelSize);
        }

        tempCanvas!.ctx!.fillStyle = `rgba(${props.activeColor.r}, ${props.activeColor.g}, ${props.activeColor.b}, ${props.activeColor.a / 255})`;

        // show temp pixels from brush previews
        let savePixels = false;
        if (tool == "brush") {
            if (mouseState.left || mouseState.right) savePixels = true;

            // center the mouse cursor in the brush 
            let width = props.pixelSize * props.toolSettings.size;
            let height = props.pixelSize * props.toolSettings.size;
            let newX = x == 0 ? 0 : (x - (width / 2)) + ((x - (width / 2)) % props.pixelSize);
            let newY = y == 0 ? 0 : (y - (height / 2)) + ((y - (height / 2)) % props.pixelSize);

            tempCanvas!.ctx!.fillRect(newX, newY, width, height);
        }
        else if (tool == "eraser") {
            if (mouseState.left || mouseState.right) savePixels = true;

            // center the mouse cursor in the brush 
            let width = props.pixelSize * props.toolSettings.size;
            let height = props.pixelSize * props.toolSettings.size;
            let newX = x == 0 ? 0 : (x - (width / 2)) + ((x - (width / 2)) % props.pixelSize);
            let newY = y == 0 ? 0 : (y - (height / 2)) + ((y - (height / 2)) % props.pixelSize);

            tempCanvas!.ctx!.fillStyle = "rgba(255, 255, 255, .004)";
            tempCanvas!.ctx!.fillRect(newX, newY, width, height);
        }
        else if (tool == "bucket") {
            if (mouseState.left || mouseState.right) savePixels = true;

            floodFill(props.activeLayer.image, x, y, props.activeColor);
        }
        else if (tool == "line") {
            if (mouseState.type == "mouseup") {
                savePixels = true;
                setActivePoints([]);
            }
            if (mouseState.type == "mousedown") {
                setActivePoints([{ x, y }]);
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
                point.x = point.x - (point.x % props.pixelSize);
                point.y = point.y - (point.y % props.pixelSize);

                tempCanvas!.ctx!.fillRect(point.x, point.y, props.pixelSize, props.pixelSize);
            });
        }
        else if (tool == "mirror") {
            if (mouseState.left || mouseState.right) savePixels = true;

            if (props.toolSettings.mirror.x) {
                tempCanvas!.ctx!.fillRect(x, y, props.pixelSize * props.toolSettings.size, props.pixelSize * props.toolSettings.size);
                tempCanvas!.ctx!.fillRect(props.canvas.width - x - props.pixelSize, y, props.pixelSize * props.toolSettings.size, props.pixelSize * props.toolSettings.size);
            }
            if (props.toolSettings.mirror.y) {
                tempCanvas!.ctx!.fillRect(x, y, props.pixelSize * props.toolSettings.size, props.pixelSize * props.toolSettings.size);
                tempCanvas!.ctx!.fillRect(x, props.canvas.height - y - props.pixelSize, props.pixelSize * props.toolSettings.size, props.pixelSize * props.toolSettings.size);
            }
            if (props.toolSettings.mirror.x && props.toolSettings.mirror.y) {
                tempCanvas!.ctx!.fillRect(x, y, props.pixelSize * props.toolSettings.size, props.pixelSize * props.toolSettings.size);
                tempCanvas!.ctx!.fillRect(props.canvas.width - x - props.pixelSize, y, props.pixelSize * props.toolSettings.size, props.pixelSize * props.toolSettings.size);
                tempCanvas!.ctx!.fillRect(x, props.canvas.height - y - props.pixelSize, props.pixelSize * props.toolSettings.size, props.pixelSize * props.toolSettings.size);
                tempCanvas!.ctx!.fillRect(props.canvas.width - x - props.pixelSize, props.canvas.height - y - props.pixelSize, props.pixelSize * props.toolSettings.size, props.pixelSize * props.toolSettings.size);
            }
        }
        else if (tool == "box") {
            let point1 = activePoints[0] ?? { x, y };
            let point2 = activePoints[1] ?? { x, y };
            let lastPoint = activePoints[2] ?? { x, y };
            let minY = Math.min(point1.y, point2.y);
            let maxY = Math.max(point1.y, point2.y);
            let minX = Math.min(point1.x, point2.x);
            let maxX = Math.max(point1.x, point2.x);
            let topLeftPoint = {
                x: minX,
                y: minY
            };
            let bottomRightPoint = {
                x: maxX,
                y: maxY
            };
            let height = selectionArea?.height ?? bottomRightPoint.y - topLeftPoint.y;
            let width = selectionArea?.width ?? bottomRightPoint.x - topLeftPoint.x;

            if (!selectionArea) {
                if (mouseState.type == "mouseup") {
                    let tempCanvas1 = document.createElement("canvas");
                    tempCanvas1.width = props.activeLayer.image.width;
                    tempCanvas1.height = props.activeLayer.image.height;
                    let tempCtx1 = tempCanvas1.getContext("2d")!;
                    tempCtx1.putImageData(props.activeLayer.image, 0, 0);

                    let newImage = tempCtx1.getImageData(topLeftPoint.x, topLeftPoint.y, width, height);
                    setSelectionArea(newImage);
                    setActivePoints([point1, point2]);
                }
                if (mouseState.type == "mousedown") setActivePoints([{ x, y }]);
            }

            if (mouseState.type == "mousedown") {
                let insideSelection = x >= lastPoint.x && x <= lastPoint.x + width && y >= lastPoint.y && y <= lastPoint.y + height;

                if (!insideSelection) {
                    savePixels = true;
                    setSelectionArea(null);
                    setActivePoints([]);

                    if (props.toolSettings.leftTool == "box") props.setToolSettings((t) => ({ ...t, leftTool: "brush" }));
                    if (props.toolSettings.middleTool == "box") props.setToolSettings((t) => ({ ...t, middleTool: "brush" }));
                    if (props.toolSettings.rightTool == "box") props.setToolSettings((t) => ({ ...t, rightTool: "brush" }));

                    tempCanvas!.ctx!.fillStyle = "rgba(255, 255, 255, .004)";
                    tempCanvas!.ctx!.fillRect(topLeftPoint.x, topLeftPoint.y, width, height);
                }
            }
        }
        else if (tool == "move") {
            if (!selectionArea) {
                setActivePoints([{ x: 0, y: 0 }, { x: props.activeLayer.image.width, y: props.activeLayer.image.height }]);
                setSelectionArea(props.activeLayer.image);
            }

            if (mouseState.type == "mousedown" && selectionArea) {
                let point1 = activePoints[0] ?? { x, y };
                let point2 = activePoints[1] ?? { x, y };
                let lastPoint = activePoints[2] ?? { x, y };
                let minY = Math.min(point1.y, point2.y);
                let maxY = Math.max(point1.y, point2.y);
                let minX = Math.min(point1.x, point2.x);
                let maxX = Math.max(point1.x, point2.x);
                let topLeftPoint = {
                    x: minX,
                    y: minY
                };
                let bottomRightPoint = {
                    x: maxX,
                    y: maxY
                };
                let height = selectionArea?.height ?? bottomRightPoint.y - topLeftPoint.y;
                let width = selectionArea?.width ?? bottomRightPoint.x - topLeftPoint.x;
                let insideSelection = x >= lastPoint.x && x <= lastPoint.x + width && y >= lastPoint.y && y <= lastPoint.y + height;

                if (!insideSelection) {
                    savePixels = true;
                    setSelectionArea(null);
                    setActivePoints([]);

                    if (props.toolSettings.leftTool == "move") props.setToolSettings((t) => ({ ...t, leftTool: "brush" }));
                    if (props.toolSettings.middleTool == "move") props.setToolSettings((t) => ({ ...t, middleTool: "brush" }));
                    if (props.toolSettings.rightTool == "move") props.setToolSettings((t) => ({ ...t, rightTool: "brush" }));

                    tempCanvas!.ctx!.fillStyle = "rgba(255, 255, 255, .004)";
                    tempCanvas!.ctx!.fillRect(topLeftPoint.x, topLeftPoint.y, width, height);
                }
            }
        }

        // draw selection widget
        if (!savePixels && (tool == "box" || tool == "move")) {
            let localTopLeft = activePoints[2] ?? activePoints[0] ?? { x, y };
            let localBottomRight = (activePoints[2] && selectionArea) ? { x: activePoints[2].x + selectionArea?.width, y: activePoints[2].y + selectionArea?.height } : activePoints[1] ?? { x, y };

            tempCanvas!.ctx!.lineWidth = props.pixelSize;
            tempCanvas!.ctx!.strokeRect(Math.max(localTopLeft.x - (props.pixelSize / 2), 0), Math.max(localTopLeft.y - (props.pixelSize / 2), 0), localBottomRight.x - localTopLeft.x, localBottomRight.y - localTopLeft.y);
        }

        // if were currently selecting an area
        if (selectionArea) {
            let tempCanvas1 = document.createElement("canvas");
            let tempCtx1 = tempCanvas1.getContext("2d");
            tempCanvas1.width = props.activeLayer.image.width;
            tempCanvas1.height = props.activeLayer.image.height;

            let tempCanvas2 = document.createElement("canvas");
            let tempCtx2 = tempCanvas2.getContext("2d");
            tempCanvas2.width = props.activeLayer.image.width;
            tempCanvas2.height = props.activeLayer.image.height;

            let offsetX = Math.sign(mouseState.movementX) * props.pixelSize;
            let offsetY = Math.sign(mouseState.movementY) * props.pixelSize;
            let lastPoint = (activePoints.length <= 2) ? activePoints[0] : activePoints[activePoints.length - 1];

            if (mouseState.left || mouseState.right) {
                lastPoint.x += offsetX;
                lastPoint.y += offsetY;
                setActivePoints(p => [p[0], p[1], { ...lastPoint }]);
            }

            tempCtx1!.putImageData(selectionArea, lastPoint.x, lastPoint.y);
            tempCtx2!.drawImage(tempCanvas1, 0, 0);
            tempCanvas.ctx!.drawImage(tempCanvas2, 0, 0);

            let image = tempCtx2!.createImageData(selectionArea.width, selectionArea.height);
            image.data.set(tempCtx2!.getImageData(lastPoint.x, lastPoint.y, selectionArea.width, selectionArea.height).data);
            if (!savePixels) setSelectionArea(image);
        }

        let tempImage = tempCanvas!.ctx!.getImageData(0, 0, props.canvas.width, props.canvas.height);

        // save pixels to layer
        if (savePixels) {
            for (let i = 0; i < tempImage.data.length; i += 4) {
                let r = tempImage.data[i];
                let g = tempImage.data[i + 1];
                let b = tempImage.data[i + 2];
                let a = tempImage.data[i + 3];

                // paint colored pixels
                if (r != 0 || g != 0 || b != 0 || a != 0) {
                    props.activeLayer.image!.data[i] = tempImage.data[i];
                    props.activeLayer.image!.data[i + 1] = tempImage.data[i + 1];
                    props.activeLayer.image!.data[i + 2] = tempImage.data[i + 2];
                    props.activeLayer.image!.data[i + 3] = tempImage.data[i + 3];
                }

                // erase invisible pixels 
                if (a === 1) {
                    props.activeLayer.image!.data[i] = 0;
                    props.activeLayer.image!.data[i + 1] = 0;
                    props.activeLayer.image!.data[i + 2] = 0;
                    props.activeLayer.image!.data[i + 3] = 0;
                }
            }
            props.setActiveLayer({ ...props.activeLayer });
        }

        let reversedLayers = props.activeFrame.layers.slice().reverse();
        reversedLayers.forEach((layer) => {
            if (!props.canvas) return;
            if (!props.canvas.ctx) return;

            // apply layer opacity 
            let diff = 255 - layer.opacity;
            tempCanvas!.ctx!.putImageData(layer.image, 0, 0);
            let imageDataCopy = tempCanvas!.ctx!.getImageData(0, 0, props.canvas.width, props.canvas.height)
            for (let i = 3; i < imageDataCopy.data.length; i += 4) {
                imageDataCopy.data[i] = imageDataCopy.data[i] - diff;
            }

            // start painting old pixels 
            tempCanvas!.ctx!.putImageData(imageDataCopy, 0, 0);

            // paint selection area
            if (selectionArea && (layer.symbol == props.activeLayer.symbol)) {
                tempCanvas!.ctx!.clearRect(activePoints[0].x, activePoints[0].y, selectionArea.width, selectionArea.height);
            }

            // finish painting old pixels
            props.canvas.ctx.drawImage(tempCanvas!.element, 0, 0, props.canvas.width, props.canvas.height);

            // paint new pixels
            if (layer.symbol == props.activeLayer.symbol) {
                tempCanvas!.ctx!.putImageData(tempImage, 0, 0);
                props.canvas.ctx.drawImage(tempCanvas!.element, 0, 0, props.canvas.width, props.canvas.height);
            }
        });

        if (tool == "eyedropper" && mouseState.type == "mousedown") {
            let image = props.canvas.ctx.getImageData(0, 0, props.canvas.width, props.canvas.height);
            let current = {
                r: image.data[(((y * image.width) + x) * 4)],
                g: image.data[(((y * image.width) + x) * 4) + 1],
                b: image.data[(((y * image.width) + x) * 4) + 2],
                a: image.data[(((y * image.width) + x) * 4) + 3]
            };
            props.setActiveColor(current);
        }
    }

    useEffect(() => {
        // push a copy of activeLayer to layerHistory
        if (!props.canvas) return;
        if (!props.canvas.ctx) return;

        let image = props.canvas.ctx!.createImageData(props.activeLayer.image.width, props.activeLayer.image.height);
        image.data.set(props.activeLayer.image.data);

        let oldData = layerHistory[layerHistory.length - 1];
        let newData = image;

        if (oldData && newData)
            if (JSON.stringify(oldData.image.data) === JSON.stringify(newData.data)) return;

        let layerCopy: ILayer = {
            symbol: props.activeLayer.symbol,
            name: props.activeLayer.name,
            image: image,
            opacity: props.activeLayer.opacity
        };

        setLayerHistory(lh => {
            let layerHistoryCopy = [...lh, layerCopy];
            if (layerHistory.length >= 200)
                layerHistoryCopy = layerHistoryCopy.slice(-200);
            return layerHistoryCopy;
        });
    }, [props.canvas]);

    return {
        undo,
        setZoom,
        showGrid,
        canvasRef,
        setShowGrid,
        setBrushSize,
        resizeHandler,
        mouseEventHandler,
    };
}


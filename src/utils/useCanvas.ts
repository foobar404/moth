import React, { useRef } from 'react';
import tinycolor from 'tinycolor2';


interface IProps {
    width?: number;
    height?: number;
}


export function useCanvas(props?: IProps) {
    let canvas = useRef<HTMLCanvasElement>(makeCanvas());
    let ctx = useRef<CanvasRenderingContext2D>(canvas.current.getContext('2d')!);

    function makeCanvas() {
        let canvas = document.createElement('canvas');
        canvas.width = props?.width ?? 8;
        canvas.height = props?.height ?? 8;

        return canvas;
    }

    function getHeight() {
        return canvas.current.height;
    }

    function getWidth() {
        return canvas.current.width;
    }

    function getSize(asArray = false) {
        if (asArray) return [canvas.current.width, canvas.current.height];
        else return { width: canvas.current.width, height: canvas.current.height };
    }

    function getElement() {
        return canvas.current;
    }

    function getCtx() {
        return ctx.current;
    }

    function clear(x = 0, y = 0, w = canvas.current.width, h = canvas.current.height) {
        ctx.current.clearRect(x, y, w, h);
    }

    function toDataURL() {
        return canvas.current.toDataURL("image/png");
    }

    function resize(width, height) {
        canvas.current.width = width;
        canvas.current.height = height;
    }

    function putImageData(imageData, x = 0, y = 0) {
        ctx.current.putImageData(imageData, x, y);
    }

    function drawImage(source, dx = 0, dy = 0, dWidth = canvas.current.width, dHeight = canvas.current.height) {
        ctx.current.drawImage(source, dx, dy, dWidth, dHeight);
    }

    function getImageData(x = 0, y = 0, width = canvas.current.width, height = canvas.current.height) {
        return ctx.current.getImageData(x, y, width, height);
    }

    function drawGrid(color1 = "#fff", color2 = "#ddd", size = 1) {
        let rows = Math.floor(canvas.current.height / size);
        let cols = Math.floor(canvas.current.width / size);

        ctx.current.fillStyle = color1;
        for (let y = 0; y < rows; y++) {
            for (let x = (y % 2); x < cols; x += 2) { // Adjust starting index based on row number
                ctx.current.fillRect(x * size, y * size, size, size);
            }
        }

        ctx.current.fillStyle = color2;
        for (let y = 0; y < rows; y++) {
            for (let x = (y % 2 === 0 ? 1 : 0); x < cols; x += 2) { // Adjust starting index based on row number
                ctx.current.fillRect(x * size, y * size, size, size);
            }
        }
    }

    const drawLine = (start, end, size = 1, color?) => {
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
            if (e2 >= dy) { err += dy; x0 += sx; }
            if (e2 <= dx) { err += dx; y0 += sy; }
        }

        points.forEach((point: { x: number; y: number }) => {
            drawPixel(point.x, point.y, size);
        });
    };

    const drawRect = (x, y, width, height, color?, fill = false) => {
        ctx.current.imageSmoothingEnabled = false;

        if (!fill) {
            for (let i = 0; i <= width; i++) {
                drawPixel(x + i, y, 1, color); // Top
                drawPixel(x + i, y + height, 1, color); // Bottom
            }
            for (let i = 0; i <= height; i++) {
                drawPixel(x, y + i, 1, color); // Left
                drawPixel(x + width, y + i, 1, color); // Right
            }
        }
    };

    const drawSquare = (x, y, sideLength, color?, fill = false) => {
        drawRect(x, y, sideLength, sideLength, color, fill);
    };

    function drawCircle(centerX, centerY, radius, color?, fill = false) {
        ctx.current.imageSmoothingEnabled = false;

        for (let y = -radius; y <= radius; y++) {
            for (let x = -radius; x <= radius; x++) {
                if (x * x + y * y <= radius * radius) {
                    if (fill || x * x + y * y >= (radius - 1) * (radius - 1)) {
                        drawPixel(centerX + x, centerY + y, 1, color);
                    }
                }
            }
        }
    }

    function drawOval(centerX, centerY, radiusX, radiusY, color?, fill = false) {
        ctx.current.imageSmoothingEnabled = false;
        const step = 0.01; // Adjust step for more or less detail

        for (let theta = 0; theta < 2 * Math.PI; theta += step) {
            const x = centerX + radiusX * Math.cos(theta);
            const y = centerY + radiusY * Math.sin(theta);
            drawPixel(Math.round(x), Math.round(y), 1, color);
        }
    }

    function drawPixel(x, y, size = 1, color?) {
        if (color) ctx.current.fillStyle = color;

        ctx.current.fillRect(x, y, size, size);
    }

    function erasePixel(x, y, size = 1) {
        ctx.current.fillStyle = "rgba(0, 0, 0, .004)";
        ctx.current.fillRect(x, y, size, size);
    }

    function floodFill(
        startX,
        startY,
        callback: ((x: number, y: number) => void) | null = null,
        tolerance = 0
    ) {
        const startColor = getColorAtPixel(startX, startY);
        let pointsToCheck: [number, number][] = [[startX, startY]];
        let matchingPoints: [number, number][] = [];
        let checkedPoints = new Set();

        while (pointsToCheck.length > 0) {
            let [x, y] = pointsToCheck.pop()!;
            if (!isValidPoint(x, y) || checkedPoints.has(`${x},${y}`) || !colorMatches(x, y, startColor, tolerance)) {
                continue;
            }

            matchingPoints.push([x, y]);
            checkedPoints.add(`${x},${y}`);

            if (callback) {
                callback(x, y);
            }

            // Add neighboring points to check
            pointsToCheck.push([x + 1, y]);
            pointsToCheck.push([x - 1, y]);
            pointsToCheck.push([x, y + 1]);
            pointsToCheck.push([x, y - 1]);
        }

        return matchingPoints;

        function isValidPoint(x, y) {
            return x >= 0 && y >= 0 && x < canvas.current.width && y < canvas.current.height;
        }

        function colorMatches(x, y, targetColor, tolerance) {
            const pixelColor = getColorAtPixel(x, y);
            return pixelColor.every((value, index) => Math.abs(value - targetColor[index]) <= tolerance);
        }

        function getColorAtPixel(x, y) {
            const imageData = ctx.current.getImageData(x, y, 1, 1).data;
            return [imageData[0], imageData[1], imageData[2], imageData[3]]; // RGBA
        }
    }

    return {
        getHeight,
        getWidth,
        getSize,
        getElement,
        getCtx,
        clear,
        resize,
        drawGrid,
        drawLine,
        drawCircle,
        drawSquare,
        drawRect,
        drawPixel,
        erasePixel,
        drawOval,
        drawImage,
        toDataURL,
        getImageData,
        putImageData,
        floodFill,
    }
}
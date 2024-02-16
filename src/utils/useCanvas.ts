import React, { useRef } from 'react';


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

    const drawLine = (x0, y0, x1, y1, color = 'black') => {
        ctx.current.beginPath();
        ctx.current.moveTo(x0, y0);
        ctx.current.lineTo(x1, y1);
        ctx.current.strokeStyle = color;
        ctx.current.stroke();
    };

    const drawRect = (x, y, width, height, color = 'black', fill = false) => {
        if (fill) {
            ctx.current.fillStyle = color;
            ctx.current.fillRect(x, y, width, height);
        } else {
            ctx.current.strokeStyle = color;
            ctx.current.strokeRect(x, y, width, height);
        }
    };

    const drawCircle = (x, y, radius, color = 'black', fill = false) => {
        ctx.current.beginPath();
        ctx.current.arc(x, y, radius, 0, 2 * Math.PI);
        if (fill) {
            ctx.current.fillStyle = color;
            ctx.current.fill();
        } else {
            ctx.current.strokeStyle = color;
            ctx.current.stroke();
        }
    };

    const drawSquare = (x, y, sideLength, color = 'black', fill = false) => {
        drawRect(x, y, sideLength, sideLength, color, fill);
    };

    const drawOval = (x, y, radiusX, radiusY, color = 'black', fill = false) => {
        ctx.current.beginPath();
        ctx.current.ellipse(x, y, radiusX, radiusY, 0, 0, 2 * Math.PI);
        if (fill) {
            ctx.current.fillStyle = color;
            ctx.current.fill();
        } else {
            ctx.current.strokeStyle = color;
            ctx.current.stroke();
        }
    };

    function drawPixel(x, y, size = 1, color?) {
        if (color) {
            let { r, b, g, a } = color;
            ctx.current.fillStyle = `rgba(${r},${g},${b},${a})`;
        }
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
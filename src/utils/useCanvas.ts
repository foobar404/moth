import React, { useRef } from 'react';


interface IProps {
    width?: number;
    height?: number;
}


export function useCanvas(props?: IProps) {
    let { current: canvas } = useRef<HTMLCanvasElement>(makeCanvas());
    let { current: ctx } = useRef<CanvasRenderingContext2D>(canvas.getContext('2d')!);
    let width = canvas.width;
    let height = canvas.height;

    function makeCanvas() {
        let canvas = document.createElement('canvas');
        canvas.width = props?.width ?? 0;
        canvas.height = props?.height ?? 0;

        return canvas;
    }

    function clear(x = 0, y = 0, w = canvas.width, h = canvas.height) {
        ctx.clearRect(x, y, w, h);
    }

    function toDataURL() {
        return canvas.toDataURL("image/png");
    }

    function resize(width, height) {
        canvas.width = width;
        canvas.height = height;
    }

    function putImageData(imageData, x = 0, y = 0) {
        ctx.putImageData(imageData, x, y);
    }

    function drawImage(source, dx = 0, dy = 0, dWidth = canvas.width, dHeight = canvas.height) {
        ctx.drawImage(source, dx, dy, dWidth, dHeight);
    }

    function getImageData(x = 0, y = 0, width = canvas.width, height = canvas.height) {
        return ctx.getImageData(x, y, width, height);
    }

    function drawGrid(color1 = "#fff", color2 = "#ddd", size = 1) {
        let rows = canvas.height;
        let cols = canvas.width;

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                let color = (y + x) % 2 === 0 ? color1 : color2;
                ctx.fillStyle = color;
                ctx.fillRect(x, y, size, size);
            }
        }
    }

    const drawLine = (x0, y0, x1, y1, color = 'black') => {
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.strokeStyle = color;
        ctx.stroke();
    };

    const drawRect = (x, y, width, height, color = 'black', fill = false) => {
        if (fill) {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, width, height);
        } else {
            ctx.strokeStyle = color;
            ctx.strokeRect(x, y, width, height);
        }
    };

    const drawCircle = (x, y, radius, color = 'black', fill = false) => {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        if (fill) {
            ctx.fillStyle = color;
            ctx.fill();
        } else {
            ctx.strokeStyle = color;
            ctx.stroke();
        }
    };

    const drawSquare = (x, y, sideLength, color = 'black', fill = false) => {
        drawRect(x, y, sideLength, sideLength, color, fill);
    };

    const drawOval = (x, y, radiusX, radiusY, color = 'black', fill = false) => {
        ctx.beginPath();
        ctx.ellipse(x, y, radiusX, radiusY, 0, 0, 2 * Math.PI);
        if (fill) {
            ctx.fillStyle = color;
            ctx.fill();
        } else {
            ctx.strokeStyle = color;
            ctx.stroke();
        }
    };

    function drawPixel(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
    }

    function erasePixel(x, y) {
        ctx.clearRect(x, y, 1, 1);
    }

    // function floodFill(
    //     x: number,
    //     y: number,
    //     callback: (x: number, y: number) => void,
    //     tolerance: number = 0,
    //     scannedCoords?: {
    //         [key: string]: boolean
    //     }
    // ) {
    //     if (!prevColor) prevColor = {
    //         r: image.data[(((y * image.width) + x) * 4)],
    //         g: image.data[(((y * image.width) + x) * 4) + 1],
    //         b: image.data[(((y * image.width) + x) * 4) + 2],
    //         a: image.data[(((y * image.width) + x) * 4) + 3]
    //     };
    //     if (!scannedCoords) scannedCoords = {};
    //     if (scannedCoords[`${x},${y}`]) return;
    //     if (x < 0) return;
    //     if (y < 0) return;
    //     if (x >= canvas.width) return;
    //     if (y >= canvas.height) return;

    //     scannedCoords[`${x},${y}`] = true;

    //     let current = {
    //         r: image.data[(((y * image.width) + x) * 4)],
    //         g: image.data[(((y * image.width) + x) * 4) + 1],
    //         b: image.data[(((y * image.width) + x) * 4) + 2],
    //         a: image.data[(((y * image.width) + x) * 4) + 3]
    //     }

    //     let colorsAreTheSame = current.r == prevColor.r && current.g == prevColor.g && current.b == prevColor.b && current.a == prevColor.a;
    //     if (!colorsAreTheSame) return;

    //     canvas1.ctx.fillStyle = `rgba(${newColor.r},${newColor.g},${newColor.b},${newColor.a / 255})`;
    //     canvas1.ctx.fillRect(x, y, 1, 1);

    //     floodFill(image, x - 1, y, newColor, current, scannedCoords);
    //     floodFill(image, x + 1, y, newColor, current, scannedCoords);
    //     floodFill(image, x, y - 1, newColor, current, scannedCoords);    
    //     floodFill(image, x, y + 1, newColor, current, scannedCoords);
    // }

    return {
        ctx,
        width,
        height,
        canvas,
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
    }
}
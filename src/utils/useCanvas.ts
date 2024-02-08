import React, { useState } from 'react';


interface IProps {
    width?: number;
    height?: number;
}


export function useCanvas(props?: IProps) {
    let [canvas] = useState<HTMLCanvasElement>(makeCanvas());
    let [ctx] = useState<CanvasRenderingContext2D>(canvas.getContext('2d')!);
    let width = canvas.width;
    let height = canvas.height;

    function makeCanvas() {
        let canvas = document.createElement('canvas');
        canvas.width = props?.width ?? 0;
        canvas.height = props?.height ?? 0;

        return canvas;
    }

    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function toDataURL() {
        return canvas.toDataURL();
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

    return {
        ctx,
        width,
        height,
        canvas,
        clear,
        resize,
        toDataURL,
        drawImage,
        getImageData,
        putImageData,
    }
}
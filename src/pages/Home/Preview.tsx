import { useEffect, useReducer } from 'react';
import React, { useRef, useState } from 'react';
import { IFrame, ICanvas, IPreview } from '../../types';


interface IProps {
    frames: IFrame[];
    preview: IPreview;
}


export function Preview(props: IProps) {
    const data = usePreview(props);

    return (
        <canvas ref={data.canvasRef}
            className="p-app__preview"
            height={global["Canvas.mainCanvas"]?.height}
            width={global["Canvas.mainCanvas"]?.width}></canvas>
    )
}


function usePreview(props: IProps) {
    let canvasRef = useRef<HTMLCanvasElement>(null);


    // function play() {
    //     if (!props.preview.ctx) return;
    //     if (!global["Canvas.mainCanvas"]) return;

    //     canvas2.resize(global["Canvas.mainCanvas"].width, global["Canvas.mainCanvas"].height);

    //     let i = 0;
    //     let previewElm = document.querySelector(".p-app__preview");
    //     if (previewElm) previewElm.scrollIntoView({ behavior: "smooth", block: "end" });

    //     setPlaying(true);
    //     setLoopRef(setInterval(() => {
    //         if (i >= props.frames.length) i = 0;

    //         let frame = props.frames[i];
    //         props.preview.ctx!.clearRect(0, 0, global["Canvas.mainCanvas"].width ?? 0, global["Canvas.mainCanvas"].height ?? 0);
    //         let reversedLayers = frame.layers.slice().reverse();
    //         reversedLayers.forEach(layer => {
    //             tempCtx!.putImageData(layer.image, 0, 0);
    //             props.preview.ctx!.drawImage(tempCanvas, 0, 0);
    //         })
    //         i++;
    //     }, 1000 / props.preview.fps));
    // }

    // function stop() {
    //     if (!loopRef) return;

    //     setPlaying(false);
    //     clearInterval(loopRef!);
    // }

    // function togglePlay() {
    //     if (playing) stop();
    //     else play();
    // }

    // function setFps(fps: number) {
    //     props.setPreview({ ...props.preview, fps });
    //     stop();
    //     play();
    // }

    return {
        global,
        canvasRef,
    }
}

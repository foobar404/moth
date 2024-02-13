import React, { useRef } from 'react';
import { IPreview } from '../../types';
import { useGlobalStore } from '../../utils';


interface IProps {
    preview: IPreview;
}


export function Preview(props: IProps) {
    const data = usePreview(props);

    return (
        <canvas ref={data.canvasRef}
            className="p-app__preview"
            height={data.canvasSize?.height}
            width={data.canvasSize?.width}></canvas>
    )
}


function usePreview(props: IProps) {
    const { canvasSize } = useGlobalStore();
    let canvasRef = useRef<HTMLCanvasElement>(null);

    // function play() {
    //     canvas2.resize(canvasSize.width, canvasSize.height);

    //     let i = 0;
    //     let previewElm = document.querySelector(".p-app__preview");
    //     if (previewElm) previewElm.scrollIntoView({ behavior: "smooth", block: "end" });

    //     setPlaying(true);
    //     setLoopRef(setInterval(() => {
    //         if (i >= props.frames.length) i = 0;

    //         let frame = props.frames[i];
    //         props.preview.ctx!.clearRect(0, 0, canvasSize.width ?? 0, canvasSize.height ?? 0);
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
        canvasRef,
        canvasSize,
    }
}

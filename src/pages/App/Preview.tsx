import { IPreview } from '../../types';
import React, { useEffect, useRef, useState } from 'react';
import { useCanvas, useGlobalStore } from '../../utils';


export function Preview(props: IPreview) {
    const data = usePreview(props);

    return (
        <img src={data.previewImg}
            className={`p-app__grid w-full h-full border-4 rounded-md shadow-2xl border-accent p-app__preview ${props.className}`} />
    )
}


function usePreview(props: IPreview) {
    let [previewImg, setPreviewImg] = useState("");
    const frameCount = useRef(0);
    const canvas1 = useCanvas();
    const canvas2 = useCanvas();
    const { canvasSize, frames } = useGlobalStore();
    const framesRef = useRef(frames);
    const playingRef = useRef<any>(props.playing);

    useEffect(() => {
        framesRef.current = frames;
        playingRef.current = props.playing;
    }, [frames, props.playing]);

    useEffect(() => {
        canvas1.resize(canvasSize.width, canvasSize.height);
        canvas2.resize(canvasSize.width, canvasSize.height);
        updatePreviewImg();
    }, [canvasSize]);

    useEffect(() => {
        let loop = setInterval(() => {
            if (!playingRef.current) return;

            if (frameCount.current >= framesRef.current.length)
                frameCount.current = 0;

            canvas1.clear();

            let frame = framesRef.current[frameCount.current];
            let reversedLayers = frame.layers.slice().reverse();
            reversedLayers.forEach(layer => {
                canvas2.putImageData(layer.image);
                canvas1.drawImage(canvas2.getElement());
            })
            frameCount.current += 1;
            updatePreviewImg();
        }, 1000 / props.fps);

        return () => clearInterval(loop);
    }, [props.fps]);

    function updatePreviewImg() {
        setPreviewImg(canvas1.toDataURL());
    }

    return {
        previewImg
    }
}
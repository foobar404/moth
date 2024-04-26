import { IPreview } from '../../types';
import React, { useEffect, useState } from 'react';
import { useCanvas, useGlobalStore, useSetInterval } from '../../utils';


export function Preview(props: IPreview) {
    const data = usePreview(props);

    return (
        <img alt="animation preview"
            src={data.previewImg}
            className={`p-app__grid border-4 rounded-md shadow-lg border-base-100 ${props?.className ?? ""}`} />
    )
}


function usePreview(props: IPreview) {
    let [previewImg, setPreviewImg] = useState("");
    const { canvasSize, frames } = useGlobalStore();
    const canvas1 = useCanvas();
    const canvas2 = useCanvas();

    useEffect(() => {
        canvas1.resize(canvasSize.width, canvasSize.height);
        canvas2.resize(canvasSize.width, canvasSize.height);
        setPreviewImg(canvas1.toDataURL());
    }, [canvasSize]);

    useSetInterval(() => {
        if (frames.every(frame => !frame.visible)) return;

        if (props.frameCount.current >= frames.length)
            props.frameCount.current = 0;
        if (props.frameCount.current < 0)
            props.frameCount.current = frames.length - 1;

        canvas1.clear();

        let frame = frames[props.frameCount.current];
        while (!frame.visible) {
            props.frameCount.current += 1;
            if (props.frameCount.current >= frames.length)
                props.frameCount.current = 0;
            frame = frames[props.frameCount.current];
        }

        let reversedLayers = frame.layers.slice().reverse();
        reversedLayers.forEach(layer => {
            canvas2.putImageData(layer.image);
            canvas1.drawImage(canvas2.getElement());
        });
        setPreviewImg(canvas1.toDataURL());

        if (props.playing) {
            props.frameCount.current += 1;
        }
    }, 1000 / props.fps, [props.fps, props.playing, frames]);

    return {
        previewImg,
    }
}
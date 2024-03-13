import { IPreview } from '../../types';
import React, { useEffect, useRef } from 'react';
import { useCanvas, useGlobalStore } from '../../utils';


export function Preview(props: IPreview) {
    const data = usePreview(props);

    return (
        <section ref={data.canvasContainerRef}></section>
    )
}


function usePreview(props: IPreview) {
    const frameCount = useRef(0);
    const loopRef = useRef<any>(null);
    const canvas1 = useCanvas();
    const canvas2 = useCanvas();
    const { canvasSize, frames } = useGlobalStore();
    let canvasContainerRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        canvasContainerRef.current?.appendChild(canvas1.getElement());
        canvas1.getElement().classList.add("p-app__preview");
    }, []);

    useEffect(() => {
        canvas1.resize(canvasSize.width, canvasSize.height);
        canvas2.resize(canvasSize.width, canvasSize.height);
    }, [canvasSize]);

    useEffect(() => {
        if (!props.playing) {
            clearInterval(loopRef.current);
            return;
        }

        canvas1.resize(canvasSize.width, canvasSize.height)

        loopRef.current = setInterval(() => {
            if (frameCount.current >= frames.length)
                frameCount.current = 0;

            canvas1.clear();

            let frame = frames[frameCount.current];
            let reversedLayers = frame.layers.slice().reverse();
            reversedLayers.forEach(layer => {
                canvas2.putImageData(layer.image);
                canvas1.drawImage(canvas2.getElement());
            })
            frameCount.current += 1;
        }, 1000 / props.fps);

        return () => {
            clearInterval(loopRef.current);
        }
    }, [props.playing]);

    return {
        canvasContainerRef,
    }
}

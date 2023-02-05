import { useEffect } from 'react';
import { IFrame, ICanvas, IPreview } from './';
import React, { useRef, useState } from 'react';


interface IProps {
    frames: IFrame[];
    preview: IPreview;
    setPreview: React.Dispatch<React.SetStateAction<IPreview>>;
    canvas?: ICanvas;
}

export function Preview(props: IProps) {
    const data = usePreview(props);

    return (
        <canvas className="p-app__preview" 
            ref={data.canvasRef}
            height={props?.canvas?.height}
            width={props?.canvas?.width}></canvas>
    )
}

function usePreview(props: IProps) {
    let canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        let ctx = canvasRef.current.getContext("2d") ?? undefined;
        props.setPreview({ ...props.preview, ctx, element: canvasRef.current });
    }, [canvasRef]);

    return {
        canvasRef
    }
}

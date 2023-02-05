import React, { useEffect, useRef, useState } from 'react';


interface IProps {
    onChange: (value: number) => void;
    value?: number;
    range?: number;
}

export function ColorSlider(props: IProps) {
    const padding = 10;
    
    let ref = useRef<HTMLDivElement>(null);
    let [range] = useState(props.range ?? 255);
    let [isMouseDown, setIsMouseDown] = useState(false);
    let [rect, setRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
    let [handlePosition, setHandlePosition] = useState(props.value ? (props.value * rect.width / range) : 0);
    let leftOffset = (handlePosition + 12 > rect.width)
        ? rect.width - 12
        : handlePosition;

    useEffect(() => {
        document.addEventListener('mousedown', () => setIsMouseDown(true));
        document.addEventListener('mouseup', () => setIsMouseDown(false));
    }, []);

    useEffect(() => {
        if (!rect.width) return;
        if (!props.value) return;

        let per = rect.width / range;
        setHandlePosition(props.value * per);
    }, [props.value, rect]);

    useEffect(() => {
        if (!ref.current) return;
        setRect(ref.current.getBoundingClientRect());
    }, [ref.current]);

    function moveHandle(e: any, mouseDown?: boolean) {
        if (!rect) return;
        if (mouseDown || isMouseDown) {
            let x = (e.clientX - rect.x);

            if ((x - padding) < 0) x = 0;
            if ((x + padding) > rect.width) x = rect.width;

            let max = rect.width / range;
            let value = x / max;

            props.onChange(Math.ceil(value));
            setHandlePosition(x);
        }
    }

    return (
        <div ref={ref}
            onMouseMove={e => moveHandle(e)}
            onMouseDown={e => moveHandle(e, true)}
            className={`c-color-picker__color-slider`}>

            <div className="c-color-picker__color-slider-handle"
                style={{
                    left: leftOffset + 'px',
                }}></div>
        </div>
    )
}

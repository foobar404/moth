import React, {useEffect, useState} from 'react';


interface IProps {
    onChange: (value: { x: number, y: number }) => void;
    value?: { x: number, y: number };
}

export function ColorDot(props: IProps) {
    let [isMouseDown, setIsMouseDown] = useState(false);
    let [handlePosition, setHandlePosition] = useState(props.value ?? { x: 0, y: 0 });
    let [rect, setRect] = useState<{ x: number, y: number, height: number, width: number } | null>(null);

    useEffect(() => {
        document.addEventListener('mouseup', () => setIsMouseDown(false));
        setRect(document.querySelector(".c-color-picker__color-dot")!.getBoundingClientRect());
    }, []);

    // useEffect(() => {
    //     if (!props.value) return;
    //     setHandlePosition(props.value);
    // }, [props.value]);

    function moveDot(e: any, mouseDown?: boolean) {
        if (!rect) return;
        if (mouseDown || isMouseDown) {
            let x = (e.clientX - rect.x);
            let y = (e.clientY - rect.y);
            let maxX = rect.width / 255;
            let maxY = rect.height / 255;
            let value = {
                x: Math.round(x / maxX),
                y: Math.round(y / maxY)
            };

            if (value.x < 0) value.x = 0;
            if (value.y < 0) value.y = 0;
            if (value.x > 255) value.x = 255;
            if (value.y > 255) value.y = 255;

            props.onChange(value);
            setHandlePosition({ x, y });
        }
    }

    return (
        <section className="c-color-picker__color-dot"
            onMouseUp={() => setIsMouseDown(false)}
            onMouseDown={(e) => {
                setIsMouseDown(true);
                moveDot(e, true);
            }}
            onMouseMove={moveDot}>
            <div className="c-color-picker__color-dot-handle"
                style={{
                    left: handlePosition.x + 'px',
                    top: handlePosition.y + 'px',
                }}></div>
        </section>
    )
}
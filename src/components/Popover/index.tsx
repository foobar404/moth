import React, { useEffect } from 'react';


interface IProps {
    children: any;
}

export function Popover(props: IProps) {
    const data = usePopover();

    return (<>
        <span onClick={(e) => { data.showPopover(); e.stopPropagation() }}>
            {props.children[0]}
        </span>

        {data.isVisible && (
            <section className="c-popover"
                style={{
                    left: data.popoverCoords.x + "px",
                    top: data.popoverCoords.y + "px"
                }}>

                {props.children[1]}
            </section>
        )}
    </>)
}

function usePopover(){
    let [isVisible, setIsVisible] = React.useState(false);
    let [mouseCoords, setMouseCoords] = React.useState({ x: 0, y: 0 });
    let [popoverCoords, setPopoverCoords] = React.useState({ x: 0, y: 0 });

    useEffect(() => {
        document.addEventListener("click", (e) => {
            setIsVisible(false);
        });
        document.addEventListener("mousemove", (e) => {
            setMouseCoords({
                x: e.pageX,
                y: e.pageY
            });
        });
    }, []);

    function showPopover() {
        setIsVisible(true);
        setPopoverCoords(mouseCoords);
    }

    return {
        isVisible,
        showPopover,
        popoverCoords,
    }
}

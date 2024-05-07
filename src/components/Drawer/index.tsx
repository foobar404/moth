import React from 'react';


interface IProps {
    isOpen?: boolean;
    className?: string;
}


export function Drawer(props) {
    const data = useDrawer(props);

    return (<div className={`${props.className ?? ""}`}>
        <div onClick={data.toggle}>{props.children[0]}</div>

        <div className={`duration-75 no-scroll ${data.isOpen ? "max-h-[400px] overflow-auto" : "max-h-0 overflow-hidden"}`}>
            {props.children.slice(1)}
        </div>
    </div>)
}


function useDrawer(props) {
    const [isOpen, setIsOpen] = React.useState(props.isOpen ?? false);

    return {
        isOpen,
        toggle: () => setIsOpen(!isOpen),
    };
}


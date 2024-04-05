import React from 'react';
import { Portal } from "react-portal";
import { ImCross } from "react-icons/im";


interface IProps {
    children: any;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    blur?: boolean;
}

export function Modal(props: IProps) {
    if (!props.isOpen) return <></>;

    return (
        <Portal>
            <main className={`c-modal ${props.blur ? "!bg-gradient-to-r !backdrop-blur-sm" : ""}`}
                onClick={() => props.setIsOpen(false)}>
                <section className="c-modal__body !bg-base-100"
                    onClick={e => { e.preventDefault(); e.stopPropagation(); }}>
                    <button aria-label="exit"
                        onClick={() => props.setIsOpen(false)}
                        className="absolute top-2 right-2 btn btn-sm btn-error">
                        <ImCross />
                    </button>

                    {props.children}
                </section>
            </main>
        </Portal>
    )
}

import React from 'react';


export function useModal() {
    const [isOpen, setIsOpen] = React.useState(false);

    return {
        isOpen,
        isClosed: !isOpen,
        setIsOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        toggle: () => setIsOpen(!isOpen),
    };
}
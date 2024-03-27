import React from 'react';


export function useModal(isOpenParam?: boolean) {
    const [isOpen, setIsOpen] = React.useState(isOpenParam ?? false);

    return {
        isOpen,
        isClosed: !isOpen,
        setIsOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        toggle: () => setIsOpen(!isOpen),
    };
}
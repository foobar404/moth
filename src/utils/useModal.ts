import React from 'react';

export function useModal() {
    const [isOpen, setIsOpen] = React.useState(false);

    return { isOpen, setIsOpen };
}
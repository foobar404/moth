import React from 'react';


const Drawer = (props) => {
    const data = useDrawer(props);

    return (
        <div className={`container ${isOpen ? 'open' : 'closed'}`}>
            <div className={`handle ${handlePositionClass}`} onClick={toggleOpen}>
                {isOpen ? 'Close' : 'Open'}
            </div>
            <div className="content">
                {isOpen && props.children}
            </div>
        </div>
    );
};


function useDrawer(props) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    const handlePositionClass = `handle-${handleSide}`;
}
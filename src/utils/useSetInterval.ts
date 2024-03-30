import { useEffect, useRef } from "react";


export function useSetInterval(callback, delay, dependencies) {
    const savedCallback = useRef();
    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback, ...dependencies]); // Ensure callback refreshes if dependencies change.

    // Set up the interval.
    useEffect(() => {
        function tick() {
            // @ts-ignore
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => {
                clearInterval(id);
            };
        }
    }, [delay, ...dependencies]); // Re-setup
};
import React, { useEffect, useState } from 'react';


interface IProps {
    [name: string]: () => void;
}


export function useShortcuts(props: IProps) {
    let [keys, setKeys] = useState<string[]>([]);

    useEffect(() => {
        document.body.addEventListener("keydown", (e) => {
            if (e.repeat) return;

            setKeys(oldKeys => {
                if (oldKeys.includes(e.key.toLowerCase())) return oldKeys;

                let keys = [...oldKeys, e.key.toLowerCase()];

                for (let i = 0; i < keys.length; i++) {
                    for (let j = i + 1; j < keys.length; j++) {
                        let key1 = `${keys[i]}+${keys[j]}`;
                        let key2 = `${keys[j]}+${keys[i]}`;
                        let key3 = keys[i];
                        let key4 = keys[j];

                        if (props[key1]) props[key1]();
                        else if (props[key2]) props[key2]();
                        else if (props[key3]) props[key3]();
                        else if (props[key4]) props[key4]();
                    }
                }

                return keys;
            })
        });

        document.body.addEventListener("keyup", (e) => {
            setKeys(k => k.filter(x => x !== e.key.toLowerCase()));
        });
    }, []);
}
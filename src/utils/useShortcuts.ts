import React, { useCallback, useEffect, useState } from 'react';


interface IProps {
    [name: string]: () => void;
}


export function useShortcuts(props: IProps) {

    let [keys, setKeys] = useState(new Set());

    useEffect(() => {
        document.body.addEventListener("keydown", handleKeyDown);
        document.body.addEventListener("keyup", handleKeyUp);

        return () => {
            document.body.removeEventListener("keydown", handleKeyDown);
            document.body.removeEventListener("keyup", handleKeyUp);
        };
    }, [keys]);

    const handleKeyDown = (e: KeyboardEvent) => {
        setKeys(prevKeys => {
            if (prevKeys.has(e.key.toLowerCase())) return prevKeys;

            const newKeys = new Set(prevKeys);
            newKeys.add(e.key.toLowerCase());

            let permutations = generatePermutations(Array.from(newKeys) as string[]);
            permutations.forEach(permutation => {
                if (permutation.join("+") in props) {
                    e.preventDefault();
                    props[permutation.join("+")]();
                }
            });

            return newKeys;
        })
    };

    const handleKeyUp = (e: KeyboardEvent) => {
        e.preventDefault();
        setKeys(prevKeys => {
            const newKeys = new Set(prevKeys);
            newKeys.delete(e.key.toLowerCase());
            console.log(newKeys, "newkeys keyup");
            return newKeys;
        });
    };

    function generatePermutations(arr: string[]): string[][] {
        if (arr.length <= 1) return [arr];
        let result: string[][] = [];
        for (let i = 0; i < arr.length; i++) {
            const current = arr[i];
            const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
            const remainingPerms = generatePermutations(remaining);
            for (let perm of remainingPerms) {
                result.push([current].concat(perm));
            }
        }
        return result;
    }

    return { keys }
}
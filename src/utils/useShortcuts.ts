import React, { useEffect, useState } from 'react';


interface IProps {
    [name: string]: () => void;
}


export function useShortcuts(props: IProps) {
    let [keys, setKeys] = useState(new Set());

    useEffect(() => {
        document.body.addEventListener("keydown", (e) => {
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
            });
        });

        document.body.addEventListener("keyup", (e) => {
            e.preventDefault();
            setKeys(prevKeys => {
                const newKeys = new Set(prevKeys);
                newKeys.delete(e.key.toLowerCase());
                return newKeys;
            });
        });
    }, []);

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
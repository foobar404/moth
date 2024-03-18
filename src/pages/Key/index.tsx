import axios from 'axios';
import React, { useState } from 'react';
import { firebaseApp } from '../../index';
import { getFunctions, httpsCallable } from 'firebase/functions';


export function Key() {
    const data = useKey();

    return (
        <main className="flex items-center justify-center h-screen bg-gray-100">
            <section className="p-5 bg-white shadow-lg md:p-20 rounded-xl">

                {data.isLoading && <>
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-8 h-8 border-b-2 border-gray-900 rounded-full animate-spin"></div>
                    </div>
                </>}

                <form onSubmit={data.handleSubmit} className="space-x-2 row">
                    <input type="checkbox" checked={data.pro} onChange={e => data.setPro(e.target.checked)} className="checkbox checkbox-lg" />
                    <input type="text" placeholder="User" value={data.user} onChange={e => data.setUser(e.target.value)} className="input input-bordered" />
                    <input type="number" placeholder="Months Valid" value={data.monthsValid} onChange={e => data.setMonthsValid(e.target.valueAsNumber)} className="w-20 input input-bordered" />
                    <button type="submit" className="btn btn-info">Create Key</button>
                </form>

                <textarea
                    readOnly
                    value={data.newKey}
                    className="w-full h-32 px-4 py-2 mt-4 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Generated Key..."
                ></textarea>
            </section>
        </main>
    );
}


function useKey() {
    const [newKey, setNewKey] = useState("");
    const [user, setUser] = useState("");
    const [pro, setPro] = useState(false);
    const [monthsValid, setMonthsValid] = useState(12);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        createKey({
            user,
            pro,
            monthsValid,
            key: localStorage.getItem("moth-beta-key")
        });
    };

    function createKey(data) {
        const functions = getFunctions(firebaseApp);
        const generateKey = httpsCallable(functions, 'generateKey');
        setIsLoading(true);

        generateKey(data)
            .then((result: any) => {
                setNewKey(result.data.token as string);
            })
            .catch((error) => {
                alert(`There was an error calling the generateKey function: ${error}`);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    return {
        user,
        isLoading,
        setUser,
        pro,
        setPro,
        monthsValid,
        setMonthsValid,
        newKey,
        handleSubmit
    }
}

import axios from 'axios';
import React, { useState } from 'react';


export function Key() {
    const data = useKey();

    return (
        <main className="flex items-center justify-center h-screen bg-gray-100">
            <section className="p-5 bg-white shadow-lg md:p-20 rounded-xl">
                <form onSubmit={data.handleSubmit} className="space-x-2 row">
                    <input type="text" placeholder="User" value={data.user} onChange={e => data.setUser(e.target.value)} className="input" />
                    <input type="checkbox" checked={data.pro} onChange={e => data.setPro(e.target.checked)} className="checkbox" />
                    <input type="number" placeholder="Months Valid" value={data.monthsValid} onChange={e => data.setMonthsValid(e.target.valueAsNumber)} className="w-20 input" />
                    <button type="submit" className="px-4 py-2 text-white bg-indigo-500 rounded">Create Key</button>
                </form>

                <div className="border-b"></div>
                <textarea
                    readOnly
                    value={data.newKey}
                    className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
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

    const handleSubmit = (e) => {
        e.preventDefault();
        createKey({
            user,
            pro,
            monthsValid,
            key: localStorage.getItem("moth-meta-key")
        });
    };

    function createKey(data) {
        axios.post("https://us-central1-your-project-id.cloudfunctions.net/generateKey", data)
            .then(res => {
                setNewKey(res.data.key); // Assuming the response has a `key` property
            }).catch(error => {
                console.error('There was an error!', error);
            });
    }

    return {
        user,
        setUser,
        pro,
        setPro,
        monthsValid,
        setMonthsValid,
        newKey,
        handleSubmit
    }
}

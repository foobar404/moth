import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export function Beta() {
    const data = useBeta();

    return (<main className="relative w-screen h-screen row">
        <img src="./moth/assets/splash.webp"
            className="fixed inset-0 object-cover w-full h-full" />

        <div className="z-10 px-24 py-10 text-center rounded-3xl backdrop-blur-md backdrop-hue-rotate-30">
            <h1 className="mb-4 text-4xl font-bold ">Moth: Pixel Art App</h1>
            <p className="mb-8 text-lg">Join our beta and unleash your creativity with pixel art.</p>

            <div className="space-y-4">
                <input type="text"
                    placeholder="Enter your beta key..."
                    className="input w-[300px]"
                    onChange={e => data.setKey(e.currentTarget.value)} />
                <div>
                    <button
                        onClick={data.submitKey}
                        className="btn btn-primary w-[200px]">
                        Submit Beta Key
                    </button>
                </div>
                <p className="divider">or</p>
                <div>
                    <a href="https://forms.gle/23ywXm7Qcrr8EQJo9"
                        target="_blank"
                        className="btn btn-secondary w-[200px]">
                        Request a Beta Key
                    </a>
                </div>
            </div>
        </div>
    </main>)
}

function useBeta() {
    let [key, setKey] = useState("");
    let navigate = useNavigate();

    function submitKey() {
        if (!key) return

        localStorage.setItem("moth-beta-key", key);
        navigate("/");
    }

    return {
        setKey,
        submitKey,
    }
}
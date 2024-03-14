import mixpanel from 'mixpanel-browser';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';


export function Beta() {
    const data = useBeta();

    return (<main className="relative w-screen h-screen row">
        <img src="./assets/splash.webp"
            className="fixed inset-0 object-cover w-full h-full" />

        <div className="z-10 px-24 py-8 text-center rounded-3xl backdrop-blur-md backdrop-hue-rotate-30">
            <h1 className="mb-4 text-4xl font-bold ">Moth: Pixel Art App</h1>
            <p className="mb-8 text-lg">Join our beta and unleash your creativity with pixel art.</p>

            <div className="space-y-4">
                <textarea
                    placeholder="Enter your beta key..."
                    className="textarea w-[400px]"
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

                <a className="px-4 py-2 mt-4 bg-gradient-to-r from-[#0ACF83] to-[#A8FF78] rounded-xl flex items-center justify-center transform transition duration-500 hover:scale-105 hover:bg-gradient-to-bl shadow-lg"
                    href="https://www.kickstarter.com/projects/foobar404/moth-pixel-art-editor" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <span className="text-sm font-bold tracking-wide text-white">Support Moth Pixel Art Editor Now on</span>
                    <img className="w-32 mx-1" src="/assets/kickstarter-green.png" alt="Kickstarter Logo" />
                    <span className="text-sm font-bold tracking-wide text-white">!</span>
                </a>
            </div>
        </div>
    </main>)
}

function useBeta() {
    let [key, setKey] = useState("");
    let navigate = useNavigate();

    useEffect(() => {
        mixpanel.track('Page: Beta');
    }, []);

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
import mixpanel from 'mixpanel-browser';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';


export function Beta() {
    const data = useBeta();

    return (
        <main className="relative flex items-center justify-center w-screen h-screen p-4 bg-gradient-to-r from-primary to-accent">
            <div className="z-10 max-w-md p-8 mx-auto text-center shadow-lg bg-blue-50 rounded-3xl backdrop-blur-md backdrop-hue-rotate-30">
                <h1 className="mb-4 text-4xl font-bold text-blue-900">Moth: Pixel Art Editor</h1>
                <p className="mb-8 text-lg text-blue-900">Join our beta and unleash your creativity with pixel art.</p>

                <div className="space-y-4">
                    <textarea
                        placeholder="Enter your beta key..."
                        className="w-full p-4 text-blue-900 transition-colors border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                        onChange={e => data.setKey(e.currentTarget.value)} />
                    <button
                        onClick={data.submitKey}
                        className="w-full py-2 font-bold text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600">
                        Submit Beta Key
                    </button>
                    <p className="text-blue-900 divider">or</p>
                    <a href="https://forms.gle/23ywXm7Qcrr8EQJo9"
                        target="_blank"
                        className="inline-block w-full py-2 font-bold text-center text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600">
                        Request a Beta Key
                    </a>

                    <a className="inline-flex items-center justify-center w-full py-3 mt-4 text-sm font-bold tracking-wide text-blue-900 duration-200 hover:scale-105"
                        href="https://www.kickstarter.com/projects/foobar404/moth-pixel-art-editor?ref=6psfuy" target="_blank" rel="noopener noreferrer">
                        Support Moth Pixel Art Editor Now on
                        <img className="w-24 mx-1" src="/assets/kickstarter-green.png" alt="Kickstarter Logo" />
                        !
                    </a>
                </div>
            </div>
        </main>
    );
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
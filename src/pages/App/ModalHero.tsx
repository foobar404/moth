import { BiSolidDonateHeart } from 'react-icons/bi';
import { Modal } from '../../components'
import { useGlobalStore } from '../../utils';
import React, { useEffect, useState } from 'react'
import { FaCloud, FaKickstarterK, FaProductHunt } from 'react-icons/fa';


interface IProps {
    isOpen: boolean;
    close: () => void;
    setIsOpen: (isOpen: boolean) => void;
}


export default function ModalHero(props: IProps) {
    const data = useModalHero(props);

    return (<Modal {...props} blur>
        <main className="space-y-4 rounded-lg max-w-[80vw] max-h-[82vh] w-[600px] col overflow-auto">
            <h1 className="text-3xl font-bold text-base-content row">
                <img src="/assets/logo.png" className="w-8 h-8 mr-2" alt="rosy maple moth" />
                <span className="md:hidden">Moth</span>
                <span className="hidden md:block">Moth: Pixel Art Editor</span>
            </h1>
            <p className="text-base-content max-w-[44ch]">
                Welcome to Moth, the pixel art editor by indie creators for indie creators.
                Packing advanced tools and seamless animation into a simple interface!
            </p>

            <section className="row sm:col">
                <button aria-label="download offline version of the app"
                    className="sm:w-[400px] text-lg btn btn-accent row-left mb-4 mr-4"
                    onClick={() => data.downloadPWA()}>
                    <FaCloud className="text-xl" />
                    <span className="hidden sm:block">Download App</span>
                </button>

                <a className="sm:w-[400px] text-lg btn btn-primary row-left mb-4 mr-4"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    href="https://coindrop.to/austin">
                    <BiSolidDonateHeart className="text-xl" />
                    <span className="hidden sm:block">Support Moth</span>
                </a>

                <a aria-label="support moth by following us on kickstarter"
                    className="sm:w-[400px] text-lg btn btn-secondary row-left mb-4 mr-4"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    href="https://www.kickstarter.com/projects/foobar404/moth-pixel-art-editor?ref=6psfuy">
                    <FaKickstarterK className="text-xl" />
                    <span className="hidden sm:block">Follow Moth on Kickstarter</span>
                </a>
            </section>

            <section className="w-full">
                <h2 className="p-2 font-bold rounded-t-lg text-base-content w-min bg-base-200">Presets</h2>
                <section className="bg-base-200 max-h-[200px] overflow-auto p-2 rounded-tl-none rounded-lg row flex-wrap">
                    {/* <button className="mt-2 mr-2 btn btn-primary btn-sm">Demo</button> */}
                    <button className="mt-2 mr-2 btn btn-primary btn-sm" onClick={() => data.loadPreset("8")}>8x8</button>
                    <button className="mt-2 mr-2 btn btn-primary btn-sm" onClick={() => data.loadPreset("16")}>16x16</button>
                    <button className="mt-2 mr-2 btn btn-primary btn-sm" onClick={() => data.loadPreset("32")}>32x32</button>
                    <button className="mt-2 mr-2 btn btn-primary btn-sm" onClick={() => data.loadPreset("64")}>64x64</button>
                    <button className="mt-2 mr-2 btn btn-primary btn-sm" onClick={() => data.loadPreset("128")}>128x128</button>
                    <button className="mt-2 mr-2 btn btn-primary btn-sm" onClick={() => data.loadPreset("256")}>256x256</button>
                    <button className="mt-2 mr-2 btn btn-primary btn-sm" onClick={() => data.loadPreset("512")}>512x512</button>
                </section>
            </section>

            <footer className="w-full">
                <h2 className="p-2 font-bold rounded-t-lg text-base-content w-min bg-base-200">Changelog</h2>
                <div className="bg-base-200 max-h-[200px] overflow-auto p-2 mockup-code rounded-tl-none rounded-lg">
                    <pre data-prefix="$" className="text-info"><code>v1.1.0 - 5/7/2024</code></pre>
                    <pre data-prefix=">" className="text-success"><code>add a panel for reference images</code></pre>
                    <pre data-prefix=">" className="text-success"><code>add AI image gen panel</code></pre>
                    <pre data-prefix=">" className="text-success"><code>add a spray tool</code></pre>
                    <pre data-prefix=">" className="text-success"><code>add crop tool</code></pre>
                    <pre data-prefix=">" className="text-success"><code>add contour/fill mode to brush tool</code></pre>
                    <pre data-prefix=">" className="text-success"><code>add mask mode for brush tool</code></pre>
                    <pre data-prefix=">" className="text-success"><code>add layer effects/filters</code></pre>
                    <pre data-prefix=">" className="text-success"><code>add custom brush shapes with selection tools</code></pre>
                    <pre data-prefix=">" className="text-success"><code>add copy/paste for layers</code></pre>
                    <pre data-prefix=">" className="text-success"><code>add pixel perfect mode for brush tool (WIP)</code></pre>

                    <div className="divider" />

                    <pre data-prefix="$" className="text-info"><code>v1.0.9 - 4/25/2024</code></pre>
                    <pre data-prefix=">" className="text-success"><code>make sections collapsible</code></pre>
                    <pre data-prefix=">" className="text-base-content"><code>fix inconsistent shortcuts</code></pre>
                    <pre data-prefix=">" className="text-success"><code>add select by color to wand tool</code></pre>

                    <div className="divider" />

                    <pre data-prefix="$" className="text-info"><code>v1.0.8 - 4/24/2024</code></pre>
                    <pre data-prefix=">" className="text-base-content"><code>improve app UI</code></pre>
                    <pre data-prefix=">" className="text-base-content"><code>add support button</code></pre>

                    <div className="divider" />

                    <pre data-prefix="$" className="text-info"><code>v1.0.7 - 4/23/2024</code></pre>
                    <pre data-prefix=">" className="text-base-content"><code>fix opacity issue with eraser</code></pre>
                    <pre data-prefix=">" className="text-base-content"><code>layer opacity works after switching frames</code></pre>
                    <pre data-prefix=">" className="text-success"><code>allow hiding frames from current animation</code></pre>
                    <pre data-prefix=">" className="text-base-content"><code>improve browser support (Brave, Opera, Firefox)</code></pre>
                    <pre data-prefix=">" className="text-base-content"><code>add opacity slider for colors</code></pre>

                    <div className="divider" />

                    <pre data-prefix="$" className="text-info"><code>v1.0.6 - 4/22/2024</code></pre>
                    <pre data-prefix=">" className="text-success"><code>update UI for frames</code></pre>
                    <pre data-prefix=">" className="text-base-content"><code>speed up the import color palette modal</code></pre>
                    <pre data-prefix=">" className="text-base-content"><code>fix sorting colors</code></pre>
                    <pre data-prefix=">" className="text-base-content"><code>fix layer opacity</code></pre>

                    <div className="divider" />

                    <pre data-prefix="$" className="text-info"><code>v1.0.5 - 4/12/2024</code></pre>
                    <pre data-prefix=">" className="text-base-content"><code>fix canceling new color palette</code></pre>
                    <pre data-prefix=">" className="text-base-content"><code>rename import/export to open/save</code></pre>
                    <pre data-prefix=">" className="text-base-content"><code>update zoom speed</code></pre>
                    <pre data-prefix=">" className="text-success"><code>add input for export scale</code></pre>
                    <pre data-prefix=">" className="text-base-content"><code>add PWA not supported message</code></pre>
                    <pre data-prefix=">" className="text-success"><code>add project presets</code></pre>
                    <pre data-prefix=">" className="text-success"><code>add mobile support phase 1</code></pre>
                </div>
            </footer>

            <div className="w-full toast">
                {data.message && (
                    <div className="row alert alert-info animate-duration-5000 animate-delay-4000 animate-fade-out">
                        <div>{data.message}</div>
                    </div>
                )}
            </div>
        </main>
    </Modal >)
}


function useModalHero(props: IProps) {
    const { setCanvasSize } = useGlobalStore();
    const [message, setMessage] = useState("");
    const [installPromptEvent, setInstallPromptEvent] = useState<any>();

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setInstallPromptEvent(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, [installPromptEvent]);

    function downloadPWA() {
        setMessage("The offline app works with browsers that support PWA, such as Chrome, Edge, Safari, Brave, and Opera.");

        if (installPromptEvent) {
            installPromptEvent.prompt();

            installPromptEvent.userChoice
                .then((r) => setInstallPromptEvent(null));
        }
    };

    function loadPreset(preset) {
        if (preset === "8") setCanvasSize({ height: 8, width: 8 });
        if (preset === "16") setCanvasSize({ height: 16, width: 16 });
        if (preset === "32") setCanvasSize({ height: 32, width: 32 });
        if (preset === "64") setCanvasSize({ height: 64, width: 64 });
        if (preset === "128") setCanvasSize({ height: 128, width: 128 });
        if (preset === "256") setCanvasSize({ height: 256, width: 256 });
        if (preset === "512") setCanvasSize({ height: 512, width: 512 });

        props.close();
    }

    return {
        downloadPWA,
        loadPreset,
        message,
    }
}



import { Modal } from '../../components'
import React, { useEffect, useState } from 'react'
import { FaBug, FaCloud, FaKickstarterK } from 'react-icons/fa';


interface IProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}


export default function ModalBeta(props: IProps) {
    const data = useModalBeta(props);

    return (<Modal {...props} blur>
        <main className="max-w-[630px] mx-auto rounded-lg space-y-4 col">
            <img src="/assets/logo.png" className="-mb-2 w-14 h-14" alt="rosy maple moth" />
            <h1 className="text-3xl font-bold text-base-content row">Moth: Pixel Art Editor</h1>
            <p className="text-base-content max-w-[44ch]">
                Revolutionize your digital art with Moth, the leading pixel art editor designed for artists and game developers.
                Boasting advanced tools, seamless animations, and user-friendly interface, it's the perfect canvas to bring your pixel creations to life.
            </p>

            <a aria-label="support moth by following us on kickstarter"
                className="w-[400px] text-lg btn btn-secondary row-left"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                href="https://www.kickstarter.com/projects/foobar404/moth-pixel-art-editor?ref=6psfuy">
                <FaKickstarterK className="text-xl" />
                Follow Moth on Kickstarter
            </a>

            <button aria-label="download offline version of the app"
                className="w-[400px] text-lg btn btn-accent row-left"
                onClick={data.downloadPWA}>
                <FaCloud className="text-xl" />
                Download Offline App
            </button>

            <a aria-label="leave feedback on the Moth feedback form"
                className="w-[400px] text-lg btn btn-primary row-left"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                href="https://forms.gle/pDXePJUoGSFnUBJF7">
                <FaBug className="text-xl" />
                Report a Bug
            </a>

            <footer>
                <h2 className="p-2 font-bold rounded-t-lg text-base-content w-min bg-base-200">Changelog</h2>
                <div className="bg-base-200 max-h-[200px] overflow-auto p-2 mockup-code rounded-tl-none rounded-lg">
                    <pre data-prefix="$" className="text-info"><code>v1.0.3 - 4/9/2024</code></pre>
                    <pre data-prefix=">" className="text-base-content"><code>fix tools not working randomly</code></pre>
                    <pre data-prefix=">" className="text-success"><code>add a colored circle for the eye dropper</code></pre>
                    <pre data-prefix=">" className="text-base-content"><code>simplyfy exporting & saving</code></pre>
                    <pre data-prefix=">" className="text-base-content"><code>box select works in all directions</code></pre>
                    <pre data-prefix=">" className="text-success"><code>add ability to import / export color palettes</code></pre>

                    <div className="divider" />

                    <pre data-prefix="$" className="text-info"><code>v1.0.2 - 4/5/2024</code></pre>
                    <pre data-prefix=">" className="text-success"><code>make app comply with PWA standards</code></pre>
                    <pre data-prefix=">" className="text-success"><code>add PWA download button</code></pre>
                    <pre data-prefix=">" className="text-base-content"><code>improve SEO performance</code></pre>

                    <div className="divider" />

                    <pre data-prefix="$" className="text-info"><code>v1.0.1 - 4/4/2024</code></pre>
                    <pre data-prefix=">" className="text-success"><code>add shortcuts for frames and layers, ↑↓˿→</code></pre>
                    <pre data-prefix=">" className="text-base-content"><code>update bucket global fill tooltip</code></pre>
                    <pre data-prefix=">" className="text-base-content"><code>add more contrast to tool / action toggle buttons</code></pre>
                    <pre data-prefix=">" className="text-success"><code>add a slider for fps</code></pre>
                    <pre data-prefix=">" className="text-success"><code>show preview of height & width when scaling exports</code></pre>
                    <pre data-prefix=">" className="text-success"><code>update visibility icon for layers</code></pre>
                    <pre data-prefix=">" className="text-base-content"><code>make range sliders easier to see</code></pre>
                </div>
            </footer>
        </main>
    </Modal >)
}


function useModalBeta(props: IProps) {
    const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setInstallPromptEvent(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    function downloadPWA() {
        if (installPromptEvent) {
            installPromptEvent.prompt();
            installPromptEvent.userChoice.then((choiceResult) => {
                setInstallPromptEvent(null);
            });
        }
    };

    return {
        downloadPWA,
    }
}

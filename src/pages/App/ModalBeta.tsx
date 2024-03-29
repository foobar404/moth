import React from 'react'
import { Modal } from '../../components'


interface IProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}


export default function ModalBeta(props) {
    const data = useModalBeta(props);

    return (<Modal {...props} blur>
        <main className="m-8 max-w-[500px] mx-auto p-6 rounded-lg">
            <img src="/logo.png" className="relative -mb-6 w-14 h-14 center" />
            <h1 className="mb-4 text-3xl font-bold text-base-content row">Welcome to Moth (Beta) </h1>
            <p className="mb-6 text-base-content">
                Explore Moth, our pixel art editor. Encountering bugs? Your feedback is essential for improvements. Let's refine Moth together.
            </p>
            <div className="flex flex-col gap-4 z-90">
                <a className="text-lg btn btn-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    href="https://forms.gle/DuE2fUUVh99zqC5T7">
                    💬 Leave Feedback
                </a>
                <a className="text-lg btn btn-secondary"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    href="https://www.kickstarter.com/projects/foobar404/moth-pixel-art-editor?ref=6psfuy">
                    🚀 Support Moth on Kickstarter
                </a>
            </div>
        </main>
    </Modal >)
}


function useModalBeta(props) { }

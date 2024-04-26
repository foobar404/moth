import { Nav } from "./Nav";
import { Tools } from './Tools';
import { Canvas } from './Canvas';
import { Colors } from './Colors';
import { Frames } from './Frames';
import { Layers } from './Layers';
import ModalHero from "./ModalHero";
import mixpanel from 'mixpanel-browser';
import ReactTooltip from 'react-tooltip';
import React, { useEffect } from 'react';
import { Drawer } from "../../components";
import { IoLayers } from "react-icons/io5";
import { ResizableBox } from 'react-resizable';
import { IoMdColorPalette } from "react-icons/io";
import { useModal, useShortcuts } from "../../utils";


export function App() {
	const data = useApp();

	return (<>
		<ModalHero {...data.modalHero} />

		<main className="p-app">
			<ReactTooltip id="tooltip" effect="solid" className="tooltip" />

			<Nav />

			<Tools />

			<Canvas />

			<ResizableBox
				className="relative space-y-1 p-app__area-right p-app__block"
				height={Infinity}
				width={330}
				axis="x"
				resizeHandles={["w"]}
				minConstraints={[0, 0]}
				maxConstraints={[400, Infinity]}
				handle={<div tabIndex={-1} onClick={e => e.currentTarget.focus()} className="absolute w-4 -ml-2 rounded-md h-5/6 left cursor-grab hover:bg-primary focus:bg-primary"></div>}>
				<div className="overflow-hidden">
					<Drawer isOpen className="p-2 border-4 rounded-lg border-secondary">
						<h2 className="p-2 duration-100 border-4 cursor-pointer border-base-100 text-secondary-content row bg-secondary rounded-box hover:scale-105">
							<IoMdColorPalette className="mr-1 text-xl" /> Colors
						</h2>

						<Colors />
					</Drawer>

					<Drawer className="p-2 border-4 rounded-lg border-secondary">
						<h2 className="p-2 duration-100 border-4 cursor-pointer border-base-100 text-secondary-content row bg-secondary rounded-box hover:scale-105">
							<IoLayers className="mr-1 text-xl" /> Layers
						</h2>

						<Layers />
					</Drawer>
				</div>
			</ResizableBox>

			<ResizableBox
				className="relative rounded-md p-app__area-footer p-app__block"
				height={150}
				width={Infinity}
				axis="y"
				resizeHandles={["n"]}
				minConstraints={[0, 0]}
				maxConstraints={[Infinity, 340]}
				handle={<div tabIndex={-1} onClick={e => e.currentTarget.focus()} className="absolute w-11/12 h-4 -mt-2 rounded-md top cursor-grab hover:bg-primary focus:bg-primary"></div>}>

				<Frames />

			</ResizableBox>
		</main >
	</>)
}


function useApp() {
	const modalHero = useModal(true);

	useEffect(() => {
		mixpanel.track('Page: App');
	}, []);

	useEffect(() => {
		document.addEventListener('contextmenu', event => event.preventDefault());
	}, []);

	useEffect(() => {
		ReactTooltip.rebuild();
	}, []);

	return {
		modalHero,
	};
}




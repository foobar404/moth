import { Nav } from "./Nav";
import { Tools } from './Tools';
import { Canvas } from './Canvas';
import { Colors } from './Colors';
import { Frames } from './Frames';
import { Layers } from './Layers';
import ModalBeta from "./ModalBeta";
import mixpanel from 'mixpanel-browser';
import ReactTooltip from 'react-tooltip';
import React, { useEffect } from 'react';
import { Drawer } from "../../components";
import { IoLayers } from "react-icons/io5";
import { IoMdColorPalette } from "react-icons/io";
import { useModal, useShortcuts } from "../../utils";


export function App() {
	const data = useApp();

	return (<>
		<ModalBeta {...data.modalBeta} />

		<main className="p-app">
			<ReactTooltip id="tooltip" />

			<Nav />

			<section className="p-app__sidebar-left p-app__block">
				<Tools />
			</section>

			<Canvas />

			<section className={`p-app__sidebar-right p-app__block --right}`}>
				<Drawer isOpen className="p-2 border-4 rounded-lg border-secondary">
					<h2 className="p-2 duration-100 border-4 cursor-pointer border-base-100 text-secondary-content row bg-secondary rounded-box hover:scale-105">
						<IoMdColorPalette className="mr-1 text-xl" /> Colors
					</h2>

					<Colors />
				</Drawer>

				<div className="my-1"></div>

				<Drawer className="p-2 border-4 rounded-lg border-secondary">
					<h2 className="p-2 duration-100 border-4 cursor-pointer border-base-100 text-secondary-content row bg-secondary rounded-box hover:scale-105">
						<IoLayers className="mr-1 text-xl" /> Layers
					</h2>

					<Layers />
				</Drawer>
			</section>

			<Frames />
		</main>
	</>)
}


function useApp() {
	const modalBeta = useModal(true);

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
		modalBeta,
	};
}




import { Nav } from "./Nav";
import { Tools } from './Tools';
import { Canvas } from './Canvas';
import { Colors } from './Colors';
import { Frames } from './Frames';
import { Layers } from './Layers';
import ModalBeta from "./ModalBeta";
import mixpanel from 'mixpanel-browser';
import ReactTooltip from 'react-tooltip';
import { IoLayers } from "react-icons/io5";
import { useModal, useShortcuts } from "../../utils";
import { IoMdColorPalette } from "react-icons/io";
import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';


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
				<Tabs selectedIndex={data.tabIndex}
					onSelect={(index) => data.setTabIndex(index)}>
					<TabList className="row-left">
						<Tab data-tip="Colors (3)" data-for="tooltip"
							className={`w-16 h-8 row rounded-t-xl cursor-pointer ${data.tabIndex === 0 ? "bg-primary text-primary-content border-2 border-accent" : "bg-secondary text-secondary-content"}`}>
							<IoMdColorPalette className="text-xl" />
						</Tab>
						<Tab data-tip="Layers (4)" data-for="tooltip"
							className={`w-16 h-8 row rounded-t-xl cursor-pointer ${data.tabIndex === 1 ? "bg-primary text-primary-content border-2 border-accent" : "bg-secondary text-secondary-content"}`}>
							<IoLayers className="text-xl" />
						</Tab>
					</TabList>

					<TabPanel><Colors /></TabPanel>
					<TabPanel><Layers /></TabPanel>
				</Tabs>
			</section>

			<Frames />
		</main>
	</>)
}

function useApp() {
	let [tabIndex, setTabIndex] = useState(0);
	const modalBeta = useModal(true);
	const keys = useShortcuts({
		"3": () => setTabIndex(0),
		"4": () => setTabIndex(1),
	});

	useEffect(() => {
		mixpanel.track('Page: App');
	}, []);

	useEffect(() => {
		document.addEventListener('contextmenu', event => event.preventDefault());
	}, []);

	useEffect(() => {
		ReactTooltip.rebuild();
	}, [tabIndex]);

	return {
		tabIndex,
		modalBeta,
		setTabIndex,
	};
}




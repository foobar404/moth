import { Nav } from "./Nav";
import { Tools } from './Tools';
import { Canvas } from './Canvas';
import { Colors } from './Colors';
import { Frames } from './Frames';
import { Layers } from './Layers';
import ReactTooltip from 'react-tooltip';
import { ImCross } from "react-icons/im";
import { IoLayers } from "react-icons/io5";
import { IoMdColorPalette } from "react-icons/io";
import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';


export function Home() {
	const data = useHome();

	return (
		<main className="p-app">
			<ReactTooltip id="tooltip" />

			<Nav setShowMobilePanel={data.setShowMobilePanel} />

			<section className="p-app__sidebar-left p-app__block">
				<Tools />
			</section>

			<Canvas />

			<section className={`p-app__sidebar-right p-app__block c-panel --right ${data.showMobilePanel ? "--show" : ""}`}>
				{/* mobile buttons */}
				<button onClick={() => data.setShowMobilePanel(false)}
					className="c-modal__exit c-button --sm --danger md:!hidden">
					<ImCross />
				</button>

				<Tabs selectedIndex={data.tabIndex}
					onSelect={(index) => data.setTabIndex(index)}>
					<TabList className="row-left">
						<Tab className={`w-12 h-8 row rounded-t-xl cursor-pointer text-primary-content ${data.tabIndex === 0 ? "bg-primary text-primary-content" : "bg-secondary text-secondary-content"}`}>
							<IoMdColorPalette className="text-xl" data-tip="Colors" data-for="tooltip" />
						</Tab>
						<Tab className={`w-12 h-8 row rounded-t-xl cursor-pointer ${data.tabIndex === 1 ? "bg-primary text-primary-content" : "bg-secondary text-secondary-content"}`}>
							<IoLayers className="text-xl" data-tip="Layers" data-for="tooltip" />
						</Tab>
					</TabList>

					{/* color panel */}
					<TabPanel>
						<Colors />
					</TabPanel>

					{/* layers panel */}
					<TabPanel>
						<Layers />
					</TabPanel>
				</Tabs>
			</section>

			<Frames />
		</main>
	)
}

function useHome() {
	let [tabIndex, setTabIndex] = useState(0);
	let [showMobilePanel, setShowMobilePanel] = useState<boolean>(false);

	useEffect(() => {
		document.addEventListener('contextmenu', event => event.preventDefault());
	}, []);

	useEffect(() => {
		ReactTooltip.rebuild()
	}, [tabIndex]);

	return {
		tabIndex,
		setTabIndex,
		showMobilePanel,
		setShowMobilePanel,
	};
}




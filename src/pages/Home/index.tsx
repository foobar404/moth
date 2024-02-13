import { Nav } from "./Nav";
import { Tools } from './Tools';
import { Canvas } from './Canvas';
import { Colors } from './Colors';
import { Frames } from './Frames';
import { Layers } from './Layers';
import { IProject } from "../../types";
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

			<Nav loadProject={data.loadProject}
				setShowMobilePanel={data.setShowMobilePanel} />

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
					<TabList>
						<Tab className={`p-app__tab ${data.tabIndex === 0 ? "--active" : ""}`}>
							<IoMdColorPalette className="c-icon" data-tip="Colors" data-for="tooltip" />
						</Tab>
						<Tab className={`p-app__tab ${data.tabIndex === 1 ? "--active" : ""}`}>
							<IoLayers className="c-icon" data-tip="Layers" data-for="tooltip" />
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

	function loadProject(projectName: string = "default") {
		if (!localStorage.getItem(projectName)) return;
		let existingProject: IProject = JSON.parse(localStorage.getItem(projectName) ?? "{}");
		setProject(existingProject);
	}

	function setProject(projectParam: IProject) {
		// if (projectParam.frames && JSON.stringify(projectParam.frames) !== JSON.stringify(getProject().frames)) {
		// 	projectParam.frames.forEach((frame, i) => {
		// 		frame.symbol = Symbol();
		// 		frame.layers.forEach((layer, j) => {
		// 			layer.symbol = Symbol();
		// 			layer.image = new ImageData(new Uint8ClampedArray(Object.values(layer.image.data)), projectParam.canvas!.width, projectParam.canvas!.height);
		// 		});
		// 	});

		// 	setFrames(projectParam.frames);
		// 	setTimeout(() => {
		// 		setActiveLayer({ ...projectParam.frames![0].layers[0] }, projectParam.frames![0], projectParam.frames);
		// 	}, 0);
		// }
		// if (projectParam.colorPalettes && JSON.stringify(projectParam.colorPalettes) !== JSON.stringify(getProject().colorPalettes)) {
		// 	projectParam.colorPalettes.forEach((colorPallete, i) => {
		// 		colorPallete.symbol = Symbol();
		// 	});

		// 	setColorPalettes(projectParam.colorPalettes);
		// 	setActiveColorPallete(projectParam.colorPalettes[0], projectParam.colorPalettes);
		// }

		// setProjectOriginal(projectParam);
	}

	return {
		tabIndex,
		setProject,
		setTabIndex,
		loadProject,
		showMobilePanel,
		setShowMobilePanel,
	};
}




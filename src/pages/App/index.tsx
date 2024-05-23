import { Nav } from "./Nav";
import { Tools } from './Tools';
import { Canvas } from './Canvas';
import { Colors } from './Colors';
import { Frames } from './Frames';
import { Layers } from './Layers';
import ModalHero from "./ModalHero";
import { useModal } from "../../utils";
import mixpanel from 'mixpanel-browser';
import ReactTooltip from 'react-tooltip';
import React, { useEffect, useState } from 'react';
import { Drawer } from "../../components";
import { References } from "./References";
import { IoLayers } from "react-icons/io5";
import { ResizableBox } from 'react-resizable';
import { IoMdColorPalette, IoMdImage } from "react-icons/io";
import { AI } from "./AI";


export function App() {
	const data = useApp();

	return (<>
		<ModalHero {...data.modalHero} />

		<main className="p-app">
			<ReactTooltip id="tooltip" effect="solid" className="tooltip" />

			<ResizableBox
				className="relative p-app__area-header p-app__block"
				height={65}
				width={Infinity}
				axis="y"
				resizeHandles={["s"]}
				minConstraints={[0, 0]}
				maxConstraints={[Infinity, 65]}
				handle={<div tabIndex={-1} onClick={e => e.currentTarget.focus()} className="absolute w-5/6 h-4 -mb-2 rounded-md bottom cursor-grab hover:bg-primary focus:bg-primary"></div>}>

				<Nav />

			</ResizableBox>

			<ResizableBox
				className="relative p-app__area-left p-app__block"
				height={Infinity}
				width={65}
				axis="x"
				resizeHandles={["e"]}
				minConstraints={[0, 0]}
				maxConstraints={[80, Infinity]}
				handle={<div tabIndex={-1} onClick={e => e.currentTarget.focus()} className="absolute w-4 -mr-2 rounded-md h-5/6 right cursor-grab hover:bg-primary focus:bg-primary"></div>}>

				<Tools />

			</ResizableBox>

			<Canvas />

			<ResizableBox
				className="relative p-app__area-right p-app__block"
				height={Infinity}
				width={330}
				axis="x"
				resizeHandles={["w"]}
				minConstraints={[0, 0]}
				maxConstraints={[400, Infinity]}
				handle={<div tabIndex={-1} onClick={e => e.currentTarget.focus()} className="absolute w-4 -ml-2 rounded-md h-5/6 left cursor-grab hover:bg-primary focus:bg-primary"></div>}>
				<div className="h-full space-y-1 overflow-x-hidden overflow-y-auto">
					<Drawer isOpen className="p-1 border-4 rounded-lg border-secondary">
						<h2 className="p-2 duration-100 cursor-pointer row-left text-secondary-content bg-secondary rounded-box hover:scale-95">
							<IoMdColorPalette className="mr-1 text-xl" /> Colors
						</h2>

						<Colors />
					</Drawer>

					<Drawer className="p-1 border-4 rounded-lg border-secondary">
						<h2 className="p-2 duration-100 cursor-pointer text-secondary-content row-left bg-secondary rounded-box hover:scale-95">
							<IoLayers className="mr-1 text-xl" /> Layers
						</h2>

						<Layers />
					</Drawer>

					<Drawer className="p-1 border-4 rounded-lg border-secondary">
						<h2 className="p-2 duration-100 cursor-pointer text-secondary-content row-left bg-secondary rounded-box hover:scale-95">
							<IoMdImage className="mr-1 text-xl" /> References
						</h2>

						<References />
					</Drawer>

					<Drawer className="p-1 border-4 rounded-lg border-secondary">
						<h2 className="p-2 duration-100 cursor-pointer text-secondary-content row-left bg-secondary rounded-box hover:scale-95">
							<IoMdImage className="mr-1 text-xl" /> AI Reference
						</h2>

						<AI />
					</Drawer>
				</div>
			</ResizableBox>

			<ResizableBox
				className="relative overflow-hidden p-app__area-footer p-app__block"
				height={data.frameHeight}
				width={Infinity}
				axis="y"
				resizeHandles={["n"]}
				minConstraints={[0, 0]}
				maxConstraints={[Infinity, 340]}
				handle={<div tabIndex={-1} onClick={e => e.currentTarget.focus()} className="absolute w-5/6 h-4 rounded-md top cursor-grab hover:bg-primary focus:bg-primary"></div>}>

				<Frames setFrameHeight={data.setFrameHeight} frameHeight={data.frameHeight} />

			</ResizableBox>
		</main >
	</>)
}


function useApp() {
	const modalHero = useModal(true);
	const [frameHeight, setFrameHeight] = useState(150);

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
		frameHeight,
		setFrameHeight,
	};
}




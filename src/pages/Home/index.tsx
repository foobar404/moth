import { Nav } from "./Nav";
import { Tools } from './Tools';
import { Canvas } from './Canvas';
import { Colors } from './Colors';
import { Frames } from './Frames';
import { Layers } from './Layers';
import { Preview } from "./Preview";
import ReactTooltip from 'react-tooltip';
import { ImCross } from "react-icons/im";
import { IoLayers } from "react-icons/io5";
import { IoMdColorPalette } from "react-icons/io";
import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';


export interface IProject {
	name: string;
	frames?: IFrame[];
	canvas?: ICanvas;
	colorPalettes?: IColorPallete[];
}


export interface ICanvas {
	height: number;
	width: number;
	zoom?: number;
	element?: HTMLCanvasElement;
	ctx?: CanvasRenderingContext2D;
}


export interface ILayer {
	name: string;
	symbol: symbol;
	opacity: number;
	image: ImageData;
}


export interface IFrame {
	symbol: symbol;
	layers: ILayer[];
}


export interface IColor {
	r: number;
	g: number;
	b: number;
	a: number;
}


export interface IColorPallete {
	name: string;
	symbol: symbol;
	colors: IColor[];
}


export interface IColorStats { [color: string]: { count: number, lastUsed: string } }


export type ITool = "brush" | "eraser" | "eyedropper" | "bucket" | "move" | "wand" | "box" | "laso" | "bone" | "line" | "mirror";


export interface IToolSettings {
	size: number;
	leftTool: ITool;
	rightTool: ITool;
	middleTool: ITool;
	mirror: {
		x: boolean;
		y: boolean;
	}
}


export interface IPreview {
	fps: number;
	zoom: number;
	element?: HTMLCanvasElement;
	ctx?: CanvasRenderingContext2D;
}


export function Home() {
	const data = useHome();

	return (
		<main className="p-app">
			<ReactTooltip id="tooltip" />

			<Nav activeFrame={data.activeFrame}
				activeLayer={data.activeLayer}
				canvas={data.canvas}
				frames={data.frames}
				project={data.project}
				setProject={data.setProject}
				colorPalettes={data.colorPalettes}
				activeColorPallete={data.activeColorPallete}
				activeColor={data.activeColor}
				setShowMobilePanel={data.setShowMobilePanel}
				pixelSize={data.pixelSize}
				getProject={data.getProject}
				loadProject={data.loadProject} />

			<section className="p-app__sidebar-left p-app__block">
				<Tools activeColor={data.activeColor}
					setActiveColor={data.setActiveColor}
					toolSettings={data.toolSettings}
					setToolSettings={data.setToolSettings}
					activeLayer={data.activeLayer}
					setActiveLayer={data.setActiveLayer}
					activeColorPallete={data.activeColorPallete}
					colorStats={data.colorStats} />
			</section>

			<Canvas canvas={data.canvas}
				setCanvas={data.setCanvas}
				defaultCanvasSize={data.defaultCanvasSize}
				activeFrame={data.activeFrame}
				activeLayer={data.activeLayer}
				setActiveLayer={data.setActiveLayer}
				activeColor={data.activeColor}
				setActiveColor={data.setActiveColor}
				toolSettings={data.toolSettings}
				setToolSettings={data.setToolSettings}
				activeColorPallete={data.activeColorPallete}
				setActiveColorPallete={data.setActiveColorPallete}
				frames={data.frames}
				setColorStats={data.setColorStats}
				pixelSize={data.pixelSize} />

			<section className={`p-app__sidebar-right p-app__block c-panel --right ${data.showMobilePanel ? "--show" : ""}`}>
				{/* mobile buttons */}
				<button onClick={() => data.setShowMobilePanel(false)}
					className="c-modal__exit c-button --sm --danger md:!hidden">
					<ImCross />
				</button>

				<Tabs>
					<TabList>
						<Tab>
							<IoMdColorPalette className="c-icon" data-tip="Colors" data-for="tooltip" />
						</Tab>
						<Tab>
							<IoLayers className="c-icon" data-tip="Layers" data-for="tooltip" />
						</Tab>
					</TabList>

					<TabPanel>
						<Colors frames={data.frames}
							colorStats={data.colorStats}
							activeLayer={data.activeLayer}
							activeColor={data.activeColor}
							activeFrame={data.activeFrame}
							colorPalettes={data.colorPalettes}
							setActiveColor={data.setActiveColor}
							setColorPalettes={data.setColorPalettes}
							activeColorPallete={data.activeColorPallete}
							setActiveColorPallete={data.setActiveColorPallete} />
					</TabPanel>

					<TabPanel>
						<Layers canvas={data.canvas}
							activeFrame={data.activeFrame}
							setActiveFrame={data.setActiveFrame}
							activeLayer={data.activeLayer}
							setActiveLayer={data.setActiveLayer} />
					</TabPanel>
				</Tabs>
			</section>

			<Frames defaultCanvasSize={data.defaultCanvasSize}
				canvas={data.canvas}
				frames={data.frames}
				setFrames={data.setFrames}
				activeFrame={data.activeFrame}
				setActiveFrame={data.setActiveFrame}
				activeLayer={data.activeLayer}
				setActiveLayer={data.setActiveLayer}
				preview={data.preview}
				setPreview={data.setPreview} />
		</main>
	)
}

function useHome() {
	const pixelSize = 1;
	const date = new Date();
	const defaultCanvasSize = 32;

	let [project, setProjectOriginal] = useState<IProject>({ name: date.toLocaleString(), });
	let [preview, setPreview] = useState<IPreview>({ zoom: 1, fps: 24 });
	let [canvas, setCanvasOriginal] = useState<ICanvas>();
	let [frames, setFrames] = useState<IFrame[]>(project?.frames ?? [{ layers: [{ image: new ImageData(defaultCanvasSize, defaultCanvasSize), opacity: 255, symbol: Symbol(), name: "New Layer" }], symbol: Symbol() }]);
	let [activeFrame, setActiveFrameOriginal] = useState<IFrame>(frames[0]);
	let [activeLayer, setActiveLayerOriginal] = useState<ILayer>(frames[0].layers[0]);
	let [colorPalettes, setColorPalettes] = useState<IColorPallete[]>(project?.colorPalettes ?? [{ name: "default", colors: [{ r: 0, g: 0, b: 0, a: 255 }], symbol: Symbol() },]);
	let [activeColorPallete, setActiveColorPalleteOriginal] = useState<IColorPallete>(colorPalettes[0]);
	let [colorStats, setColorStats] = useState<IColorStats | {}>({});
	let [activeColor, setActiveColor] = useState<IColor>(colorPalettes[0].colors[0]);
	let [showMobilePanel, setShowMobilePanel] = useState<boolean>(false);
	let [toolSettings, setToolSettings] = React.useState<IToolSettings>({ leftTool: "brush", rightTool: "eraser", middleTool: "eyedropper", size: 1, mirror: { x: true, y: false, }, });

	useEffect(() => {
		document.addEventListener('contextmenu', event => event.preventDefault());
	}, []);

	function loadProject(projectName: string = "default") {
		if (!localStorage.getItem(projectName)) return;
		let existingProject: IProject = JSON.parse(localStorage.getItem(projectName) ?? "{}");
		setProject(existingProject);
	}

	function setCanvas(canvasParam: ICanvas | ((c: ICanvas) => ICanvas)) {
		let newCanvas: ICanvas = canvasParam instanceof Function ? canvasParam(canvas!) : canvasParam;

		if (newCanvas.height !== canvas?.height || newCanvas.width !== canvas?.width) {
			if (canvas?.element) {
				canvas.element.height = newCanvas.height;
				canvas.element.width = newCanvas.width;
			}

			let newFrames = [...frames].map(frame => ({
				...frame,
				layers: frame.layers.map((layer) => {
					let isActiveLayer = activeLayer.symbol === layer.symbol;
					let newLayer = { ...layer };
					let tempCanvas = document.createElement('canvas');
					let tempCtx = tempCanvas.getContext("2d");
					tempCanvas.width = newCanvas.width;
					tempCanvas.height = newCanvas.height;

					tempCtx!.putImageData(layer.image, 0, 0, 0, 0, layer.image.width, layer.image.height);

					newLayer.image = tempCtx!.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
					if (isActiveLayer) setActiveLayer(newLayer);

					return newLayer;
				})
			}));

			setFrames(newFrames);
		}

		setCanvasOriginal(newCanvas);
	}

	function setActiveFrame(frame: IFrame, framesOverride?: IFrame[]) {
		let localFrames = framesOverride ?? [...frames];
		let index = localFrames.reduce((acc, curr, i) => curr.symbol === frame.symbol ? i : acc, -1);

		if (index == -1) {
			localFrames.push(frame);
			setActiveLayer({ ...frame.layers[0] }, frame, localFrames);
		}
		else
			localFrames[index] = frame;

		setFrames([...localFrames]);
		setActiveFrameOriginal({ ...frame });
	}

	function setActiveLayer(layer: ILayer, frameOverride?: IFrame, framesOverride?: IFrame[]) {
		let localFrame = frameOverride ?? activeFrame;
		let localFrames = framesOverride ?? frames;
		let index = localFrame.layers.reduce((acc, curr, i) => curr.symbol === layer.symbol ? i : acc, -1);

		if (index == -1)
			localFrame.layers.push(layer);
		else
			localFrame.layers[index] = layer;

		setActiveFrame({ ...localFrame }, localFrames);
		setActiveLayerOriginal({ ...layer });
	}

	function setActiveColorPallete(colorPalette: IColorPallete, colorPalettesOverride?: IColorPallete[]) {
		let localColorPalettes = colorPalettesOverride ?? colorPalettes;
		let index = localColorPalettes.reduce((acc, curr, i) => curr.symbol === colorPalette.symbol ? i : acc, -1);

		if (index == -1)
			localColorPalettes.push(colorPalette);
		else
			localColorPalettes[index] = colorPalette;

		setActiveColorPalleteOriginal(colorPalette);
		setColorPalettes([...localColorPalettes]);
	}

	function getProject(): IProject {
		return {
			name: project.name,
			frames: frames,
			colorPalettes: colorPalettes,
			canvas: {
				width: canvas!.width,
				height: canvas!.height
			}
		}
	}

	function setProject(projectParam: IProject) {
		if (projectParam.frames && JSON.stringify(projectParam.frames) !== JSON.stringify(getProject().frames)) {
			projectParam.frames.forEach((frame, i) => {
				frame.symbol = Symbol();
				frame.layers.forEach((layer, j) => {
					layer.symbol = Symbol();
					layer.image = new ImageData(new Uint8ClampedArray(Object.values(layer.image.data)), projectParam.canvas!.width, projectParam.canvas!.height);
				});
			});

			setFrames(projectParam.frames);
			setTimeout(() => {
				setActiveLayer({ ...projectParam.frames![0].layers[0] }, projectParam.frames![0], projectParam.frames);
			}, 0);
		}
		if (projectParam.colorPalettes && JSON.stringify(projectParam.colorPalettes) !== JSON.stringify(getProject().colorPalettes)) {
			projectParam.colorPalettes.forEach((colorPallete, i) => {
				colorPallete.symbol = Symbol();
			});

			setColorPalettes(projectParam.colorPalettes);
			setActiveColorPallete(projectParam.colorPalettes[0], projectParam.colorPalettes);
		}
		if (projectParam.canvas && JSON.stringify(projectParam.canvas) !== JSON.stringify(getProject().canvas)) {
			setCanvas(c => ({ ...c, ...projectParam.canvas }));
		}

		setProjectOriginal(projectParam);
	}

	return {
		frames,
		canvas,
		project,
		preview,
		pixelSize,
		setCanvas,
		setFrames,
		setPreview,
		colorStats,
		getProject,
		setProject,
		activeLayer,
		activeColor,
		activeFrame,
		loadProject,
		toolSettings,
		colorPalettes,
		setColorStats,
		setActiveFrame,
		setActiveColor,
		setActiveLayer,
		showMobilePanel,
		setToolSettings,
		setColorPalettes,
		defaultCanvasSize,
		setShowMobilePanel,
		activeColorPallete,
		setActiveColorPallete,
	};
}


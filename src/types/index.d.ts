declare module 'png-chunks-extract';
declare module 'png-chunk-text';
declare module 'png-chunks-encode';


export interface IProject {
	name: string;
	frames?: IFrame[];
	canvas?: { height?: number; width?: number; };
	colorPalettes?: IColorPalette[];
}


export interface ICanvas {
	ctx: CanvasRenderingContext2D;
	width: number;
	height: number;
	canvas: HTMLCanvasElement;
	clear: () => void;
	resize: (width: number, height: number) => void;
	drawGrid: (size: number, color: string) => void;
	toDataURL: () => string;
	drawImage: (image: ImageData, x: number, y: number) => void;
	getImageData: (x: number, y: number, width: number, height: number) => ImageData;
	putImageData: (image: ImageData, x: number, y: number) => void;
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


export interface IColorPalette {
	name: string;
	symbol: symbol;
	colors: IColor[];
}


export interface IColorStats { [color: string]: { count: number, lastUsed: string } }


export type ITool = "brush" | "eraser" | "shape" | "light" | "eyedropper" | "bucket" | "move" | "wand" | "box" | "lasso" | "bone" | "line" | "mirror";


export interface IToolSettings {
	size: number;
	leftTool: ITool;
	rightTool: ITool;
	middleTool: ITool;
	mirror: {
		x: boolean;
		y: boolean;
	};
	shape: "rect" | "circle" | "oval" | "square",
	lightMode: "dark" | "light";
	lightIntensity: number;
	eraseAll: boolean;
	fillAll: boolean;
}


export interface IPreview {
	fps: number;
	playing: boolean;
	className: string;
}


export interface IMouseState {
	x: number;
	y: number;
	left: boolean;
	right: boolean;
	middle: boolean;
	movementX: number;
	movementY: number;
	type: 'mousedown' | 'mouseup' | 'mousemove';
}
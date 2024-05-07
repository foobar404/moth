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
	visible: boolean;
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


export interface IColorStats { [color: string]: { count: number, lastUsed: number } }


export type ITool = "brush" | "eraser" | "shape" | "light" | "smudge" | "eyedropper"
	| "bucket" | "spray" | "move" | "wand" | "box" | "lasso" | "bone" | "line" | "crop"
	| "mirror" | "crop" | "font";


export interface IToolSettings {
	leftTool: ITool;
	rightTool: ITool;
	middleTool: ITool;
	size: number;
	brushes: ImageData[];
	activeBrush: ImageData;
	brush: { fill: boolean, pixelPerfect: boolean, maskMode: boolean };
	mirror: {
		x: boolean;
		y: boolean;
	};
	shape: "rect" | "circle" | "oval" | "square",
	fillShape: boolean;
	lightMode: "dark" | "light";
	lightIntensity: number;
	eraseAll: boolean;
	fillAll: boolean;
	wandSelectAll: boolean;
	spray: { density: number };
}


export interface IPreview {
	fps: number;
	playing: boolean;
	className?: string;
	frameCount: useRef<number>;
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
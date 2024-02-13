import { create } from 'zustand';
import { IColorPalette, IColorStats, IFrame, ILayer, ITool, IToolSettings } from '../types';


interface IGlobalStore {
    projectName: string;
    canvasSize: { height: number; width: number };
    frames: IFrame[];
    activeFrame: IFrame;
    activeLayer: ILayer;
    colorPalettes: IColorPalette[];
    activeColorPalette: IColorPalette;
    activeColor: { r: number; g: number; b: number; a: number };
    colorStats: IColorStats;
    toolSettings: IToolSettings;

    setProjectName: (projectName: string) => void;
    setCanvasSize: (canvasSize: { height: number; width: number }) => void;
    setFrames: (frames: IFrame[]) => void;
    setActiveFrame: (activeFrame: IFrame) => void;
    setActiveLayer: (activeLayer: ILayer) => void;
    setColorPalettes: (colorPalettes: IColorPalette[]) => void;
    setActiveColorPalette: (activeColorPalette: IColorPalette) => void;
    setActiveColor: (activeColor: { r: number; g: number; b: number; a: number }) => void;
    setColorStats: (colorStats: IColorStats) => void;
    setToolSettings: (toolSettings: IToolSettings) => void;
}


export const useGlobalStore = create<IGlobalStore>((set) => {
    const initialFrames: IFrame[] = [{
        layers: [{ image: new ImageData(32, 32), opacity: 255, symbol: Symbol(), name: "New Layer" }],
        symbol: Symbol()
    }];

    const initialColorPalettes: IColorPalette[] = [{
        name: "default",
        colors: [],
        symbol: Symbol()
    }];

    const initialState = {
        projectName: new Date().toLocaleString(),
        canvasSize: { height: 32, width: 32 },
        frames: initialFrames,
        activeFrame: initialFrames[0],
        activeLayer: initialFrames[0].layers[0],
        colorPalettes: initialColorPalettes,
        activeColorPalette: initialColorPalettes[0],
        activeColor: { r: 0, g: 0, b: 0, a: 255 },
        colorStats: {},
        toolSettings: {
            size: 1,
            leftTool: "brush" as ITool,
            rightTool: "eraser" as ITool,
            middleTool: "eyedropper" as ITool,
            mirror: { x: true, y: false },
        },
        // Action methods...
        setProjectName: (projectName: string) => set({ projectName }),
        setCanvasSize: (canvasSize: { height: number; width: number }) => set({ canvasSize }),
        setFrames: (frames: IFrame[]) => set({ frames }),
        setActiveFrame: (activeFrame: IFrame) => set({ activeFrame }),
        setActiveLayer: (activeLayer: ILayer) => set({ activeLayer }),
        setColorPalettes: (colorPalettes: IColorPalette[]) => set({ colorPalettes }),
        setActiveColorPalette: (activeColorPalette: IColorPalette) => set({ activeColorPalette }),
        setActiveColor: (activeColor: { r: number, g: number, b: number, a: number }) => set({ activeColor }),
        setColorStats: (colorStats: IColorStats) => set({ colorStats }),
        setToolSettings: (toolSettings: IToolSettings) => set({ toolSettings }),
    };

    return initialState;
});

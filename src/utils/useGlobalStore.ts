import { create } from 'zustand';
import { IColorPalette, IColorStats, IFrame, ILayer, ITool, IToolSettings } from '../types';


interface IGlobalStore {
    projectName: string;
    canvasSize: { height: number; width: number };
    onionSkin: number;
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
    setOnionSkin: (onionSkin: number) => void;
    setFrames: (frames: IFrame[]) => void;
    setActiveFrame: (activeFrame: IFrame) => void;
    setActiveLayer: (activeLayer: ILayer) => void;
    setColorPalettes: (colorPalettes: IColorPalette[]) => void;
    setActiveColorPalette: (activeColorPalette: IColorPalette) => void;
    setActiveColor: (activeColor: { r: number; g: number; b: number; a: number }) => void;
    setColorStats: (colorStats: IColorStats) => void;
    setToolSettings: (toolSettings: IToolSettings) => void;
}


export const useGlobalStore = create<IGlobalStore>((set, get) => {
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
        onionSkin: 0,
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
            shape: "rect" as any,
            lightMode: "light" as any,
        },
        // Action methods...
        setProjectName: (projectName: string) => set({ projectName }),
        setCanvasSize: (canvasSize: { height: number; width: number }) => set({ canvasSize }),
        setOnionSkin: (onionSkin: number) => set({ onionSkin }),
        setFrames: (frames: IFrame[]) => set({ frames }),
        setColorPalettes: (colorPalettes: IColorPalette[]) => set({ colorPalettes }),
        setActiveColorPalette: (activeColorPalette: IColorPalette) => set({ activeColorPalette }),
        setActiveColor: (activeColor: { r: number, g: number, b: number, a: number }) => set({ activeColor }),
        setColorStats: (colorStats: IColorStats) => set({ colorStats }),
        setToolSettings: (toolSettings: IToolSettings) => set({ toolSettings }),
        setActiveFrame: (activeFrame: IFrame) => {
            let index = get().frames.findIndex(frame => frame.symbol === activeFrame.symbol);
            if (index === -1) { // if frame is new add
                let newFrames = [...get().frames, activeFrame];
                set({ frames: newFrames });
                set({ activeLayer: activeFrame.layers[0] });
            }
            else { // if frame exists update
                let newFrames = [...get().frames];
                newFrames[index] = activeFrame;
                set({ frames: newFrames });
            }
            set({ activeFrame });
        },
        setActiveLayer: (activeLayer: ILayer) => {
            let index = get().activeFrame.layers.findIndex(layer => layer.symbol === activeLayer.symbol);
            if (index === -1) { // if layer is new add
                let newLayers = [...get().activeFrame.layers, activeLayer];
                useGlobalStore.getState().setActiveFrame({ ...get().activeFrame, layers: newLayers })
            }
            else { // if layer exists update
                let newLayers = [...get().activeFrame.layers];
                newLayers[index] = activeLayer;
                useGlobalStore.getState().setActiveFrame({ ...get().activeFrame, layers: newLayers })
            }
            set({ activeLayer });
        },
    };

    return initialState;
});

import { create } from 'zustand';
import { IColorPalette, IColorStats, IFrame, ILayer, ITool, IToolSettings } from '../types';


interface IGlobalStore {
    projectName: string;
    canvasSize: { height: number; width: number };
    onionSkin: number;
    frames: IFrame[];
    activeFrame: IFrame;
    activeLayer: ILayer;
    copyLayer: ILayer;
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
    setCopyLayer: (copyLayer: ILayer) => void;
    setColorPalettes: (colorPalettes: IColorPalette[]) => void;
    setActiveColorPalette: (activeColorPalette: IColorPalette) => void;
    setActiveColor: (activeColor: { r: number; g: number; b: number; a: number }) => void;
    setColorStats: (colorStats: IColorStats) => void;
    setToolSettings: (toolSettings: IToolSettings) => void;
}


export const useGlobalStore = create<IGlobalStore>((set, get) => {
    const initialFrames: IFrame[] = [{
        layers: [{ image: new ImageData(32, 32), opacity: 255, symbol: Symbol(), name: "New Layer" }],
        visible: true,
        symbol: Symbol()
    }];

    const initialColorPalettes: IColorPalette[] = [{
        name: "Default",
        colors: [
            { r: 0, g: 0, b: 0, a: 255 },
            { r: 29, g: 43, b: 83, a: 255 },
            { r: 126, g: 37, b: 83, a: 255 },
            { r: 0, g: 135, b: 81, a: 255 },
            { r: 171, g: 82, b: 54, a: 255 },
            { r: 95, g: 87, b: 79, a: 255 },
            { r: 194, g: 195, b: 199, a: 255 },
            { r: 255, g: 241, b: 232, a: 255 },
            { r: 255, g: 0, b: 77, a: 255 },
            { r: 255, g: 163, b: 0, a: 255 },
            { r: 255, g: 236, b: 39, a: 255 },
            { r: 0, g: 228, b: 54, a: 255 },
            { r: 41, g: 173, b: 255, a: 255 },
            { r: 131, g: 118, b: 156, a: 255 },
            { r: 255, g: 119, b: 168, a: 255 },
            { r: 255, g: 204, b: 170, a: 255 },
        ],
        symbol: Symbol()
    }];

    const initalBrushes = [
        new ImageData(new Uint8ClampedArray([0, 0, 0, 255]), 1, 1),
        new ImageData(new Uint8ClampedArray([0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255]), 4, 4),
        new ImageData(new Uint8ClampedArray([0, 0, 0, 0, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 0]), 4, 4),
        new ImageData(new Uint8ClampedArray([0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 255]), 4, 4),
    ];

    const initialState = {
        projectName: new Date().toLocaleString(),
        canvasSize: { height: 32, width: 32 },
        onionSkin: 0,
        frames: initialFrames,
        activeFrame: initialFrames[0],
        activeLayer: initialFrames[0].layers[0],
        copyLayer: initialFrames[0].layers[0],
        colorPalettes: initialColorPalettes,
        activeColorPalette: initialColorPalettes[0],
        activeColor: { r: 0, g: 0, b: 0, a: 255 },
        colorStats: {},
        toolSettings: {
            leftTool: "brush" as ITool,
            rightTool: "eraser" as ITool,
            middleTool: "" as ITool,
            size: 1,
            brushes: initalBrushes,
            activeBrush: initalBrushes[0],
            brush: { fill: false, pixelPerfect: false, maskMode: false },
            mirror: { x: true, y: false },
            shape: "rect" as any,
            fillShape: false,
            lightMode: "light" as any,
            lightIntensity: 10,
            eraseAll: false,
            fillAll: false,
            wandSelectAll: false,
            spray: { density: 2 },
        },
        setProjectName: (projectName: string) => set({ projectName }),
        setCanvasSize: (canvasSize: { height: number; width: number }) => set({ canvasSize }),
        setOnionSkin: (onionSkin: number) => set({ onionSkin }),
        setFrames: (frames: IFrame[]) => set({ frames }),
        setColorPalettes: (colorPalettes: IColorPalette[]) => set({ colorPalettes }),
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
        setCopyLayer: (copyLayer: ILayer) => set({ copyLayer }),
        setActiveColorPalette: (activeColorPalette: IColorPalette) => {
            let index = get().colorPalettes.findIndex(palette => palette.symbol === activeColorPalette.symbol);
            if (index === -1) { // if palette is new add
                let newPalettes = [...get().colorPalettes, activeColorPalette];
                set({ colorPalettes: newPalettes });
            }
            else { // if palette exists update
                let newPalettes = [...get().colorPalettes];
                newPalettes[index] = activeColorPalette;
                set({ colorPalettes: newPalettes });
            }
            set({ activeColorPalette });
        }
    };

    return initialState;
});

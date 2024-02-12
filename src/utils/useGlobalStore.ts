import { create } from 'zustand';
import { IFrame, ILayer } from '../types';


export function useGlobalStore(): any {
    return create(set => ({
        projectName: (new Date()).toLocaleString(),
        canvasSize: { height: 32, width: 32 },
        frames: [{ layers: [{ image: new ImageData(32, 32), opacity: 255, symbol: Symbol(), name: "New Layer" }], symbol: Symbol() }],
        activeFrame: 0,
        activeLayer: 0,
        colorPalettes: [{ name: "default", colors: [], symbol: Symbol() }],
        activeColorPalette: 0,
        activeColor: { r: 0, g: 0, b: 0, a: 255 },
        colorStats: {},
        toolSettings: { leftTool: "brush", rightTool: "eraser", middleTool: "eyedropper", size: 1, mirror: { x: true, y: false, } },

        setProjectName: (projectName: string) => set({ projectName }),
        setCanvasSize: (canvasSize: number) => set({ canvasSize }),
        setFrames: (frames: IFrame[]) => set({ frames }),
        setActiveFrame: (activeFrame: IFrame) => set({ activeFrame }),
        setActiveLayer: (activeLayer: ILayer) => set({ activeLayer }),
    }));
}

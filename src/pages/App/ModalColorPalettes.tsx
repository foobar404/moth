import axios from 'axios';
import RgbQuant from "rgbquant";
import tinycolor from 'tinycolor2';
import { Modal } from '../../components';
import ReactTooltip from 'react-tooltip';
import { IColorPalette } from '../../types';
import { useGlobalStore } from '../../utils';
import { FaSwatchbook } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import lospecPalettes from '../../misc/lospec-palettes.json';


interface ILospecPalette {
    name: string;
    author: string;
    colors: string[];
}


export function ModalColorPalettes(props) {
    const data = useModalColorPalettes(props);

    return (
        <Modal {...props}>
            <ReactTooltip id="tooltip" />
            <main className="!items-stretch pt-8 col max-w-[600px] space-y-2">
                <button aria-label="import color palette from .png, .jpg, .csv, .hex"
                    className="self-center btn btn-primary w-max"
                    data-tip="import color palette from .png, .jpg, .csv, .hex"
                    data-for="tooltip"
                    onClick={() => data.setColorPaletteFromFile(data.paletteSettings)}>
                    {data.isLoading && <span className="loading loading-dots loading-lg"></span>}
                    <FaSwatchbook className="text-xl" />
                    Import Palette
                    <input onChange={(e) => data.setPaletteSettings({ ...data.paletteSettings, colors: e.currentTarget.valueAsNumber })}
                        aria-label="max number of colors to import"
                        data-tip="max number of colors to import"
                        data-for="tooltip"
                        onKeyDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                        className="w-16 ml-2 input input-sm bg-primary-content text-primary"
                        defaultValue={data.paletteSettings.colors}
                        type="number"
                        min="1"
                        max="128" />
                </button>

                <section className="max-h-[400px] overflow-auto p-4 space-y-4">
                    {data.loadedPalettes.map(c => (
                        <div key={c.name} className="duration-75 cursor-pointer hover:scale-105"
                            onClick={() => data.setColorPaletteFromLospec(c)}>
                            <h2 className="p-2 font-bold rounded-t-lg text-base-content w-max bg-base-200" key={c.name}>{c.name} by: {c.author ? c.author : "Unknown"}</h2>
                            <div className="p-4 overflow-auto row-left bg-base-200 max-h-[200px] rounded-tl-none rounded-lg">
                                {c.colors.map((color, i) => (
                                    <div key={i} className="rounded-full -ml-2 shadow-lg min-w-[30px] min-h-[30px] hover:animate-heartbeat duration-100" style={{ backgroundColor: `#${color}` }}></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>
            </main>
        </Modal>
    )
}


function useModalColorPalettes(props) {
    let [isLoading, setIsLoading] = React.useState(false);
    let [paletteSettings, setPaletteSettings] = useState({ colors: 32 });
    let [loadedPalettes, setLoadedPalettes] = React.useState<ILospecPalette[]>(lospecPalettes.data);
    const { setActiveColorPalette, colorPalettes, setColorPalettes } = useGlobalStore();

    useEffect(() => {
        ReactTooltip.rebuild();
    }, []);

    function loadImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                //@ts-ignore
                img.src = event.target.result;
                img.onload = () => resolve(img);
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    function setColorPaletteFromLospec(palette) {
        let newColorPalette: IColorPalette = {
            colors: palette.colors.map(c => {
                let t = tinycolor(`#${c}`).toRgb();
                return {
                    r: t.r,
                    g: t.g,
                    b: t.b,
                    a: t.a * 255
                }
            }),
            name: palette.name,
            symbol: Symbol()
        };

        setColorPalettes([...colorPalettes, newColorPalette]);
        setActiveColorPalette(newColorPalette);
        props.close();
    }

    async function setColorPaletteFromFile(settings) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';

        setIsLoading(true);

        fileInput.onchange = async (event) => {
            // @ts-ignore
            const file = event.target!.files[0]; // Get the selected file

            if (!file) return; // Exit if no file is selected

            if (file.type.startsWith('image/')) {
                try {
                    const img = await loadImage(file);

                    // limit color palette
                    let q = new RgbQuant({
                        colors: settings.colors,
                    });
                    q.sample(img);

                    let colors: any[] = [];
                    let p = q.palette();
                    for (let i = 0; i < p.length; i += 4) {
                        colors.push({
                            r: p[i],
                            g: p[i + 1],
                            b: p[i + 2],
                            a: p[i + 3]
                        });
                    }

                    let newColorPalette: IColorPalette = {
                        colors: colors,
                        name: file.name,
                        symbol: Symbol()
                    };
                    setColorPalettes([...colorPalettes, newColorPalette]);
                    setActiveColorPalette(newColorPalette);

                    props.close();
                } catch (error) {
                    console.error('Error processing image file:', error);
                }
            } else {
                const reader = new FileReader();
                reader.onload = (event) => {
                    // @ts-ignore
                    let text = event.target.result as string;
                    let palette = text!.split(/[\n\r, ]+/).filter(c => c.trim() !== '').map(c => c.startsWith("#") ? c : `#${c}`);
                    let paletteRGB = palette.map(c => tinycolor(c).toRgb());
                    let colors: any[] = [];

                    paletteRGB.forEach(c => {
                        colors.push({
                            r: c.r,
                            g: c.g,
                            b: c.b,
                            a: c.a * 255
                        });
                    })

                    let newColorPalette: IColorPalette = {
                        colors: colors,
                        name: file.name,
                        symbol: Symbol()
                    };
                    setColorPalettes([...colorPalettes, newColorPalette]);
                    setActiveColorPalette(newColorPalette);

                    props.close();
                };
                reader.readAsText(file);
            }

            setIsLoading(false);
        };

        fileInput.click();
    }

    return {
        isLoading,
        loadedPalettes,
        paletteSettings,
        setPaletteSettings,
        setColorPaletteFromLospec,
        setColorPaletteFromFile,
    };
}   

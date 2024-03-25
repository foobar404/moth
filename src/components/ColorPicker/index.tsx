import tinycolor from 'tinycolor2';
import { ColorDot } from './ColorDot';
import { ColorSlider } from './ColorSlider';
import { FaChevronDown } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';


interface IColor {
    r: number;
    g: number;
    b: number;
    a: number;
}

interface IProps {
    onChange: (color: IColor) => void;
    color?: IColor;
    children?: React.ReactNode
}

export function ColorPicker(props: IProps) {
    const data = useColorPicker(props);

    return (
        <section className="c-color-picker">
            <section className="c-color-picker__color-panel">
                <div className="c-color-picker__color-panel-layer1" style={{
                    backgroundColor: `${(() => {
                        let hsl = tinycolor(data.currentColor).toHsl();
                        hsl.l = 0.5;
                        hsl.s = 1;
                        return tinycolor(hsl).toRgbString();
                    })()}`
                }}></div>
                <div className="c-color-picker__color-panel-layer2"></div>
                <div className="c-color-picker__color-panel-layer3"></div>
                <ColorDot onChange={(p) => {
                    let newColor = tinycolor(data.currentColor).toHsl();
                    newColor.l = Math.ceil((100 - ((p.x / (255 * 2)) * 100)) - ((p.y / (255 * 2)) * 100));
                    newColor.s = Math.ceil((p.x / 255) * 100);
                    data.setCurrentColor(tinycolor(newColor).toRgb());
                }} value={{
                    x: 1,
                    y: tinycolor(data.currentColor).toHsl().s
                }} />
            </section>

            {/* opacity */}
            <section className="flex">
                <div className="c-color-picker__color-bar c-color-picker__opacity" style={{
                    background: `linear-gradient(to right, rgba(0,0,0,0), ${tinycolor(data.currentColor).toRgbString()})`
                }}>
                    <ColorSlider onChange={(v) => {
                        let newColor = { ...data.currentColor };
                        newColor.a = Number((v / 255).toFixed(4));
                        data.setCurrentColor(newColor);
                    }} value={Number((data.currentColor.a * 255).toFixed(4))} />
                </div>
                <input min="0"
                    max="255"
                    step="1"
                    type="number"
                    data-tip="opacity"
                    data-for="tooltip"
                    className=''
                    value={Number((data.currentColor.a * 255).toFixed(4))}
                    onChange={(e) => {
                        let newColor = { ...data.currentColor };
                        newColor.a = Number((e.currentTarget.valueAsNumber / 255).toFixed(4));
                        data.setCurrentColor(newColor);
                    }} />
            </section>

            {/* hue */}
            <section className='flex'>
                <div className="c-color-picker__rainbox"
                    style={{
                        background: `linear-gradient(to right, rgba(255, 0, 0, ${data.currentColor.a}) 0%, rgba(255, 255, 0, ${data.currentColor.a}) 17%, rgba(0, 255, 0, ${data.currentColor.a}) 33%, rgba(0, 255, 255, ${data.currentColor.a}) 50%, rgba(0, 0, 255, ${data.currentColor.a}) 67%, rgba(255, 0, 255, ${data.currentColor.a}) 83%, rgba(255, 0, 0, ${data.currentColor.a}) 100%)`
                    }}>
                    <ColorSlider range={360} onChange={(v) => {
                        let newColor = tinycolor(data.currentColor).toHsl();
                        newColor.h = v;
                        data.setCurrentColor(tinycolor(newColor).toRgb());
                    }} value={tinycolor(data.currentColor).toHsl().h} />
                </div>
                <input min="0"
                    max="360"
                    type="number"
                    data-tip="hue"
                    data-for="tooltip"
                    className=''
                    value={Math.ceil(tinycolor(data.currentColor).toHsl().h)}
                    onChange={(e) => {
                        let newColor = tinycolor(data.currentColor).toHsl();
                        newColor.h = e.currentTarget.valueAsNumber;
                        data.setCurrentColor(tinycolor(newColor).toRgb());
                    }} />
            </section>

            {/* saturation */}
            <section className="flex">
                <div className="c-color-picker__color-bar"
                    style={{
                        background: ((): string => {
                            let hsl = tinycolor(data.currentColor).toHsl();
                            hsl.l = 0.5;
                            hsl.s = 0;

                            let hsl2 = tinycolor(data.currentColor).toHsl();
                            hsl2.l = 0.5;
                            hsl2.s = 1;
                            return `linear-gradient(to right, ${tinycolor(hsl).toRgbString()}, ${tinycolor(hsl2).toRgbString()})`
                        })()
                    }}>
                    <ColorSlider range={100} onChange={(v) => {
                        let newColor = tinycolor(data.currentColor).toHsl();
                        newColor.s = v / 100;
                        data.setCurrentColor(tinycolor(newColor).toRgb());
                    }} value={tinycolor(data.currentColor).toHsl().s * 100} />
                </div>
                <input min="0"
                    max="100"
                    type="number"
                    data-for="tooltip"
                    data-tip="saturation"
                    className=""
                    value={Math.ceil(tinycolor(data.currentColor).toHsl().s * 100)}
                    onChange={(e) => {
                        let newColor = tinycolor(data.currentColor).toHsl();
                        newColor.s = e.currentTarget.valueAsNumber / 100;
                        data.setCurrentColor(tinycolor(newColor).toRgb());
                    }} />
            </section>

            {/* lightness */}
            <section className="flex">
                <div className="c-color-picker__color-bar" style={{
                    background: ((): string => {
                        let hsl = tinycolor(data.currentColor).toHsl();
                        hsl.l = 0;

                        let hsl2 = tinycolor(data.currentColor).toHsl();
                        hsl2.l = .5;
                        hsl2.s = 1;

                        let hsl3 = tinycolor(data.currentColor).toHsl();
                        hsl3.l = 1;

                        return `linear-gradient(to right, ${tinycolor(hsl).toRgbString()}, ${tinycolor(hsl2).toRgbString()}, ${tinycolor(hsl3).toRgbString()})`
                    })()
                }}>
                    <ColorSlider range={100} onChange={(v) => {
                        let newColor = tinycolor(data.currentColor).toHsl();
                        newColor.l = v / 100;
                        data.setCurrentColor(tinycolor(newColor).toRgb());
                    }} value={tinycolor(data.currentColor).toHsl().l * 100} />
                </div>
                <input className=''
                    data-tip="lightness"
                    data-for="tooltip"
                    min="0"
                    max="100"
                    type="number"
                    onChange={(e) => {
                        let newColor = tinycolor(data.currentColor).toHsl();
                        newColor.l = e.currentTarget.valueAsNumber / 100;
                        data.setCurrentColor(tinycolor(newColor).toRgb());
                    }}
                    value={Math.ceil(tinycolor(data.currentColor).toHsl().l * 100)} />
            </section>

            {/* red */}
            <section className="flex">
                <div className="c-color-picker__color-bar" style={{
                    background: `linear-gradient(to right, rgba(0, ${data.currentColor.g}, ${data.currentColor.b}, ${data.currentColor.a}), rgba(255, ${data.currentColor.g}, ${data.currentColor.b}, ${data.currentColor.a}))`
                }}>
                    <ColorSlider onChange={(v) => {
                        let newColor = tinycolor(data.currentColor).toRgb();
                        newColor.r = v;
                        data.setCurrentColor(newColor);
                    }} value={data.currentColor.r} />
                </div>
                <input className=''
                    data-tip="red"
                    data-for="tooltip"
                    min="0"
                    max="255"
                    type="number"
                    onChange={(e) => {
                        let newColor = tinycolor(data.currentColor).toRgb();
                        newColor.r = e.currentTarget.valueAsNumber;
                        data.setCurrentColor(newColor);
                    }}
                    value={Math.ceil(data.currentColor.r)} />
            </section>

            {/* green */}
            <section className="flex">
                <div className="c-color-picker__color-bar" style={{
                    background: `linear-gradient(to right, rgba(${data.currentColor.r}, 0, ${data.currentColor.b}, ${data.currentColor.a}), rgba(${data.currentColor.r}, 255, ${data.currentColor.b}, ${data.currentColor.a}))`
                }}>
                    <ColorSlider onChange={(v) => {
                        let newColor = tinycolor(data.currentColor).toRgb();
                        newColor.g = v;
                        data.setCurrentColor(newColor);
                    }} value={data.currentColor.g} />
                </div>
                <input min="0"
                    max="255"
                    type="number"
                    data-tip="green"
                    data-for="tooltip"
                    value={Math.ceil(data.currentColor.g)}
                    className=''
                    onChange={(e) => {
                        let newColor = tinycolor(data.currentColor).toRgb();
                        newColor.g = e.currentTarget.valueAsNumber;
                        data.setCurrentColor(newColor);
                    }} />
            </section>

            {/* blue */}
            <section className="flex">
                <div className="c-color-picker__color-bar"
                    style={{
                        background: `linear-gradient(to right, rgba(${data.currentColor.r}, ${data.currentColor.g}, 0, ${data.currentColor.a}), rgba(${data.currentColor.r}, ${data.currentColor.g}, 255, ${data.currentColor.a}))`
                    }}>
                    <ColorSlider onChange={(v) => {
                        let newColor = tinycolor(data.currentColor).toRgb();
                        newColor.b = v;
                        data.setCurrentColor(newColor);
                    }} value={data.currentColor.b} />
                </div>
                <input min="0"
                    max="255"
                    type="number"
                    data-tip="blue"
                    data-for="tooltip"
                    value={Math.ceil(data.currentColor.b)}
                    className=''
                    onChange={(e) => {
                        let newColor = tinycolor(data.currentColor).toRgb();
                        newColor.b = e.currentTarget.valueAsNumber;
                        data.setCurrentColor(newColor);
                    }} />
            </section>

            {/* drawer */}
            <section className="c-color-picker__drawer" style={{
                height: data.isDrawerOpen ? '300px' : '0',
            }}>
                {JSON.stringify(data.currentColor) !== JSON.stringify(data.drawerColor) && (
                    <p onClick={() => data.setDrawerColor(data.currentColor)}
                        style={{ color: "#111", cursor: "pointer", textAlign: "center", textDecorationStyle: "wavy", textDecorationLine: "underline", margin: "5px 0", fontWeight: 700 }}>
                        click to update colors
                    </p>
                )}

                <p className="c-color-picker__drawer-text">Lights & Darks</p>
                {[tinycolor(data.drawerColor).lighten(30), tinycolor(data.drawerColor).lighten(20), tinycolor(data.drawerColor).lighten(10), tinycolor(data.drawerColor).darken(10), tinycolor(data.drawerColor).darken(20), tinycolor(data.drawerColor).darken(30)]
                    .map((color, i) => (
                        <div key={i}
                            className="mr-2"
                            onClick={() => data.setCurrentColor(color.toRgb())}
                            style={{ backgroundColor: color.toRgbString() }}></div>
                    ))
                }

                <p className="c-color-picker__drawer-text">Complementary</p>
                {[tinycolor(data.drawerColor).complement()]
                    .map((color, i) => (
                        <div key={i}
                            className="mr-2"
                            onClick={() => data.setCurrentColor(color.toRgb())}
                            style={{ backgroundColor: color.toRgbString() }}></div>
                    ))
                }

                <p className="c-color-picker__drawer-text">Split Complementary</p>
                {tinycolor(data.drawerColor).splitcomplement()
                    .map((color, i) => (
                        <div key={i}
                            className="mr-2"
                            onClick={() => data.setCurrentColor(color.toRgb())}
                            style={{ backgroundColor: color.toRgbString() }}></div>
                    ))
                }

                <p className="c-color-picker__drawer-text">Triadic</p>
                {tinycolor(data.drawerColor).triad()
                    .map((color, i) => (
                        <div key={i}
                            className="mr-2"
                            onClick={() => data.setCurrentColor(color.toRgb())}
                            style={{ backgroundColor: color.toRgbString() }}></div>
                    ))
                }

                <p className="c-color-picker__drawer-text">Tetradic</p>
                {tinycolor(data.drawerColor).tetrad()
                    .map((color, i) => (
                        <div key={i}
                            className="mr-2"
                            onClick={() => data.setCurrentColor(color.toRgb())}
                            style={{ backgroundColor: color.toRgbString() }}></div>
                    ))
                }

                <p className="c-color-picker__drawer-text">Analogous</p>
                {tinycolor(data.drawerColor).analogous()
                    .map((color, i) => (
                        <div key={i}
                            className="mr-2"
                            onClick={() => data.setCurrentColor(color.toRgb())}
                            style={{ backgroundColor: color.toRgbString() }}></div>
                    ))
                }

                <p className="c-color-picker__drawer-text">Monochromatic</p>
                {tinycolor(data.drawerColor).monochromatic()
                    .map((color, i) => (
                        <div key={i}
                            className="mr-2"
                            onClick={() => data.setCurrentColor(color.toRgb())}
                            style={{ backgroundColor: color.toRgbString() }}></div>
                    ))
                }
            </section>

            <section className="c-color-picker__preview"
                onClick={() => data.setIsDrawerOpen(t => !t)}
                style={{
                    backgroundColor: tinycolor(data.currentColor).toRgbString()
                }}>
                <FaChevronDown className="" style={{
                    position: 'absolute',
                    bottom: "4px",
                    left: '50%',
                    transform: 'translateX(-50%) rotate(' + (data.isDrawerOpen ? '180deg' : '0') + ')',
                    transition: 'transform 0.3s ease-in-out',
                    color: "#fff9"
                }} />
            </section>
        </section>
    )
}

function useColorPicker(props: IProps) {
    let [currentColor, setCurrentColor] = useState(props.color ?? { r: 0, g: 0, b: 0, a: 1 });
    let [isDrawerOpen, setIsDrawerOpen] = useState(false);
    let [drawerColor, setDrawerColor] = useState(currentColor);
    let [colorHistory, setColorHistory] = useState<IColor[]>([]);
    let [lastColorChangeTime, setLastColorChangeTime] = useState(0);

    useEffect(() => {
        if (!isDrawerOpen) setDrawerColor(currentColor);
    }, [isDrawerOpen]);

    useEffect(() => {
        props.onChange(currentColor);
        setColorHistory(ch => [currentColor, ...ch].slice(0, 2));

        if (!isDrawerOpen) setDrawerColor(currentColor);
    }, [currentColor]);

    useEffect(() => {
        if (!props.color) return;
        if (JSON.stringify(props.color) === JSON.stringify(currentColor)) return;

        let inHistroy = colorHistory.reduce((acc, color) => JSON.stringify(color) === JSON.stringify(props.color) ? true : acc, false);
        if ((new Date()).getTime() < lastColorChangeTime + 100 && inHistroy) return;

        setLastColorChangeTime((new Date()).getTime());
        setCurrentColor(props.color);
    }, [props.color]);

    return {
        drawerColor,
        currentColor,
        colorHistory,
        isDrawerOpen,
        setDrawerColor,
        setCurrentColor,
        setIsDrawerOpen,
    }
}






import { ILayer, ITool } from '../../types';
import ReactTooltip from 'react-tooltip';
import { IoMdMove } from "react-icons/io";
import { AiFillFire } from "react-icons/ai";
import { Gi3DGlasses, Gi3DMeeple, GiCrystalGrowth, GiDesert, GiExplosionRays, GiMirrorMirror } from "react-icons/gi";
import React, { useEffect, useRef, useState } from 'react';
import { MdBrightness4, MdDeblur, MdHdrPlus, MdInvertColors, MdLensBlur, MdOutlineCallReceived, MdOutlineDeblur, MdOutlineNoiseAware, MdVignette } from "react-icons/md";
import { BsBrightnessHighFill, BsBucketFill, BsEraserFill, BsTriangleHalf } from "react-icons/bs";
import { IoApertureSharp, IoColorWandSharp, IoNuclear, IoPartlySunnySharp, IoReorderTwo } from "react-icons/io5";
import { useShortcuts, useCanvas, useGlobalStore } from '../../utils';
import { TbFlipHorizontal, TbFlipVertical, TbArrowLoopRight, TbInnerShadowTopFilled, TbCirclesFilled } from "react-icons/tb";
import { FaEyeDropper, FaBrush, FaTools, FaBox, FaLightbulb, FaShapes, FaFont, FaPaintBrush, FaBook, FaWineGlass, FaFilm } from "react-icons/fa";
import { BiRotateRight, BiRotateLeft, BiHorizontalCenter, BiVerticalCenter, BiSolidError } from "react-icons/bi";
import { FaCropSimple, FaFishFins, FaSprayCanSparkles } from 'react-icons/fa6';
import { RiContrast2Fill, RiInfraredThermometerFill } from 'react-icons/ri';
import { PiCircleHalfTiltDuotone, PiSunHorizonFill } from 'react-icons/pi';
import { HiSquares2X2 } from "react-icons/hi2";
import { RxBorderAll } from "react-icons/rx";
import { GrSpectrum } from "react-icons/gr";


export function Tools() {
    const data = useTools();

    return (<section className="h-full overflow-x-hidden overflow-y-auto">
        <nav className="mb-1 border-2 rounded-md row border-primary">
            <FaTools data-tip="tools (1)"
                data-for="tooltip"
                className={`flex-1 cursor-pointer p-1 box-content focus:outline-none ${data.view == "tools" ? "bg-primary text-primary-content" : "text-base-content"}`}
                onClick={() => data.setView("tools")} />
            <AiFillFire data-tip="effects (2)"
                data-for="tooltip"
                className={`flex-1 cursor-pointer p-1 box-content focus:outline-none ${data.view == "actions" ? "bg-primary text-primary-content" : "text-base-content"}`}
                onClick={() => data.setView("actions")} />
        </nav>

        <section className="space-y-1 col">
            {data.view === "tools" && (<>
                <button aria-label="select brush tool"
                    data-tip={`brush tool ( b​ ) ${data.getButtonTooltip("brush")}`}
                    data-for="tooltip"
                    className={`btn btn-primary btn-sm box-content py-1 hover:animate-squeeze ${data.getButtonStyles("brush")}`}
                    onMouseDown={(e) => data.updateTool(e, "brush")}>
                    <FaBrush className="text-xl" />
                </button>
                <button aria-label="select eraser tool"
                    data-tip={`eraser tool ( e​ ) ${data.getButtonTooltip("eraser")}`}
                    data-for="tooltip"
                    className={`btn btn-primary btn-sm box-content py-1 hover:animate-squeeze ${data.getButtonStyles("eraser")}`}
                    onMouseDown={(e) => data.updateTool(e, "eraser")}>
                    <BsEraserFill className="text-xl" />
                </button>
                <button aria-label="select bucket tool"
                    data-tip={`bucket tool ( g​ ) ${data.getButtonTooltip("bucket")}`}
                    data-for="tooltip"
                    className={`btn btn-primary btn-sm box-content py-1 hover:animate-squeeze ${data.getButtonStyles("bucket")}`}
                    onMouseDown={(e) => data.updateTool(e, "bucket")}>
                    <BsBucketFill className="text-xl" />
                </button>
                <button aria-label="select spray tool"
                    data-tip={`spray tool ( p​ ) ${data.getButtonTooltip("spray")}`}
                    data-for="tooltip"
                    className={`btn btn-primary btn-sm box-content py-1 hover:animate-squeeze ${data.getButtonStyles("spray")}`}
                    onMouseDown={(e) => data.updateTool(e, "spray")}>
                    <FaSprayCanSparkles className="text-xl" />
                </button>
                <button aria-label="select shape tool"
                    data-tip={`shape tool ( s​ ) ${data.getButtonTooltip("shape")}`}
                    data-for="tooltip"
                    className={`btn btn-primary btn-sm box-content py-1 hover:animate-squeeze ${data.getButtonStyles("shape")}`}
                    onMouseDown={(e) => data.updateTool(e, "shape")}>
                    <FaShapes className="text-xl" />
                </button>
                <button aria-label="select light tool"
                    data-tip={`light tool ( t​ ) ${data.getButtonTooltip("light")}`}
                    data-for="tooltip"
                    className={`btn btn-primary btn-sm box-content py-1 hover:animate-squeeze ${data.getButtonStyles("light")}`}
                    onMouseDown={(e) => data.updateTool(e, "light")}>
                    <MdBrightness4 className="text-xl" />
                </button>
                {/* <button aria-label="select smudge tool"
                    data-tip={`smudge tool ( d ) ${data.getButtonTooltip("smudge")}`}
                    data-for="tooltip"
                    className={`btn btn-primary btn-sm box-content py-1 hover:animate-squeeze ${data.getButtonStyles("smudge")}`}
                    onMouseDown={(e) => data.updateTool(e, "smudge")}>
                    <MdDeblur className="text-xl" />
                </button> */}
                <button aria-label="select line tool"
                    data-tip={`line tool ( l​ ) ${data.getButtonTooltip("line")}`}
                    data-for="tooltip"
                    className={`btn btn-primary btn-sm box-content py-1 hover:animate-squeeze ${data.getButtonStyles("line")}`}
                    onMouseDown={(e) => data.updateTool(e, "line")}>
                    <MdOutlineCallReceived className="text-xl" />
                </button>
                {/* <button aria-label="select font tool"
                    data-tip={`line tool ( f​ ) ${data.getButtonTooltip("font")}`}
                    data-for="tooltip"
                    className={`btn btn-primary btn-sm box-content py-1 hover:animate-squeeze ${data.getButtonStyles("font")}`}
                    onMouseDown={(e) => data.updateTool(e, "font")}>
                    <FaFont className="text-xl" />
                </button> */}
                <button aria-label="select crop tool"
                    data-tip={`crop tool ( c​ ) ${data.getButtonTooltip("crop")}`}
                    data-for="tooltip"
                    className={`btn btn-primary btn-sm box-content py-1 hover:animate-squeeze ${data.getButtonStyles("crop")}`}
                    onMouseDown={(e) => data.updateTool(e, "crop")}>
                    <FaCropSimple className="text-xl" />
                </button>
                <button aria-label="select mirror tool"
                    data-tip={`mirror tool ( m​ ) ${data.getButtonTooltip("mirror")}`}
                    data-for="tooltip"
                    className={`btn btn-primary btn-sm box-content py-1 hover:animate-squeeze ${data.getButtonStyles("mirror")}`}
                    onMouseDown={(e) => data.updateTool(e, "mirror")}>
                    <GiMirrorMirror className="text-xl" />
                </button>
                <button aria-label="select eyedropper tool"
                    data-tip={`eyedropper tool ( i​ ) ${data.getButtonTooltip("eyedropper")}`}
                    data-for="tooltip"
                    className={`btn btn-primary btn-sm box-content py-1 hover:animate-squeeze ${data.getButtonStyles("eyedropper")}`}
                    onMouseDown={(e) => data.updateTool(e, "eyedropper")}>
                    <FaEyeDropper className="text-xl" />
                </button>
                <button aria-label="select move tool"
                    data-tip={`move tool ( v​ ) ${data.getButtonTooltip("move")}`}
                    data-for="tooltip"
                    className={`btn btn-primary btn-sm box-content py-1 hover:animate-squeeze ${data.getButtonStyles("move")}`}
                    onMouseDown={(e) => data.updateTool(e, "move")}>
                    <IoMdMove className="text-xl" />
                </button>
                <button aria-label="select box selection tool"
                    data-tip={`box selection tool ( x​ ) ${data.getButtonTooltip("box")}`}
                    data-for="tooltip"
                    className={`btn btn-primary btn-sm box-content py-1 hover:animate-squeeze ${data.getButtonStyles("box")}`}
                    onMouseDown={(e) => data.updateTool(e, "box")}>
                    <FaBox className="text-xl" />
                </button>
                <button aria-label="select wand selection tool"
                    data-tip={`wand selection tool ( w​ ) ${data.getButtonTooltip("wand")}`}
                    data-for="tooltip"
                    className={`btn btn-primary btn-sm box-content py-1 hover:animate-squeeze ${data.getButtonStyles("wand")}`}
                    onMouseDown={(e) => data.updateTool(e, "wand")}>
                    <IoColorWandSharp className="text-xl" />
                </button>
                <button aria-label="select lasso selection tool"
                    data-tip={`lasso selection tool ( o​ ) ${data.getButtonTooltip("lasso")}`}
                    data-for="tooltip"
                    className={`btn btn-primary btn-sm box-content py-1 hover:animate-squeeze ${data.getButtonStyles("lasso")}`}
                    onMouseDown={(e) => data.updateTool(e, "lasso")}>
                    <TbArrowLoopRight className="text-xl" />
                </button>
            </>)}

            {data.view === "actions" && (<>
                <button aria-label="clear current layer"
                    data-tip="clear current layer ( shift + c​ )"
                    data-for="tooltip"
                    onClick={() => data.actions.clear()}
                    className="box-content py-1 btn btn-secondary btn-sm hover:animate-squeeze">
                    <IoNuclear className="text-xl" />
                </button>
                <button aria-label="flip layer horizontally"
                    data-tip="flip layer horizontally ( shift + h )"
                    data-for="tooltip"
                    onClick={() => data.actions.flipHorizontal()}
                    className="box-content py-1 btn btn-secondary btn-sm hover:animate-squeeze">
                    <TbFlipHorizontal className="text-xl" />
                </button>
                <button aria-label="flip layer vertically"
                    data-tip="flip layer vertically ( shift + v ​)"
                    data-for="tooltip"
                    onClick={() => data.actions.flipVertical()}
                    className="box-content py-1 btn btn-secondary btn-sm hover:animate-squeeze">
                    <TbFlipVertical className="text-xl" />
                </button>
                <button aria-label="rotate layer 90° right"
                    data-tip="rotate layer 90° right ( shift + r ​)"
                    data-for="tooltip"
                    onClick={() => data.actions.rotateRight()}
                    className="box-content py-1 btn btn-secondary btn-sm hover:animate-squeeze">
                    <BiRotateRight className="text-xl" />
                </button>
                <button aria-label="rotate layer 90° left"
                    data-tip="rotate layer 90° left ( shift + l ​)"
                    data-for="tooltip"
                    onClick={() => data.actions.rotateLeft()}
                    className="box-content py-1 btn btn-secondary btn-sm hover:animate-squeeze">
                    <BiRotateLeft className="text-xl" />
                </button>
                <button aria-label="center layer horizontally"
                    data-tip="center layer horizontally ( shift + ~ )"
                    data-for="tooltip"
                    onClick={() => data.actions.centerHorizontal()}
                    className="box-content py-1 btn btn-secondary btn-sm hover:animate-squeeze">
                    <BiHorizontalCenter className="text-xl" />
                </button>
                <button aria-label="center layer vertically"
                    data-tip="center layer vertically ( shift + | ​)"
                    data-for="tooltip"
                    onClick={() => data.actions.centerVertical()}
                    className="box-content py-1 btn btn-secondary btn-sm hover:animate-squeeze">
                    <BiVerticalCenter className="text-xl" />
                </button>

                <div className="divider"></div>

                <button aria-label="increase brightness"
                    data-tip="adjust brightness"
                    data-for="tooltip"
                    onClick={() => data.actions.adjustBrightness(10)}
                    className="box-content py-1 btn btn-accent btn-sm hover:animate-squeeze">
                    <BsBrightnessHighFill className="text-xl" />
                </button>
                <button aria-label="increase contrast"
                    data-tip="increase contrast"
                    data-for="tooltip"
                    onClick={() => data.actions.adjustContrast(20)}
                    className="box-content py-1 btn btn-accent btn-sm hover:animate-squeeze">
                    <RiContrast2Fill className="text-xl" />
                </button>
                <button aria-label="invert colors"
                    data-tip="invert colors"
                    data-for="tooltip"
                    onClick={() => data.actions.invertColors()}
                    className="box-content py-1 btn btn-accent btn-sm hover:animate-squeeze">
                    <MdInvertColors className="text-xl" />
                </button>
                <button aria-label="sepia filter"
                    data-tip="sepia filter"
                    data-for="tooltip"
                    onClick={() => data.actions.applySepia()}
                    className="box-content py-1 btn btn-accent btn-sm hover:animate-squeeze">
                    <GiDesert className="text-xl" />
                </button>
                <button aria-label="blur filter"
                    data-tip="blur filter"
                    data-for="tooltip"
                    onClick={() => data.actions.applyBlur()}
                    className="box-content py-1 btn btn-accent btn-sm hover:animate-squeeze">
                    <MdOutlineDeblur className="text-xl" />
                </button>
                <button aria-label="increase sharpness"
                    data-tip="increase sharpness"
                    data-for="tooltip"
                    onClick={() => data.actions.increaseSharpness(1)}
                    className="box-content py-1 btn btn-accent btn-sm hover:animate-squeeze">
                    <IoApertureSharp className="text-xl" />
                </button>
                <button aria-label="grayscale filter"
                    data-tip="grayscale filter"
                    data-for="tooltip"
                    onClick={() => data.actions.applyGrayscale()}
                    className="box-content py-1 btn btn-accent btn-sm hover:animate-squeeze">
                    <PiCircleHalfTiltDuotone className="text-xl" />
                </button>
                <button aria-label="pixelate"
                    data-tip="pixelate"
                    data-for="tooltip"
                    onClick={() => data.actions.pixelate(2)}
                    className="box-content py-1 btn btn-accent btn-sm hover:animate-squeeze">
                    <HiSquares2X2 className="text-xl" />
                </button>
                <button aria-label="outline"
                    data-tip="outline"
                    data-for="tooltip"
                    onClick={() => data.actions.edgeDetection()}
                    className="box-content py-1 btn btn-accent btn-sm hover:animate-squeeze">
                    <RxBorderAll className="text-xl" />
                </button>
                <button aria-label="noise"
                    data-tip="noise"
                    data-for="tooltip"
                    onClick={() => data.actions.addNoise()}
                    className="box-content py-1 btn btn-accent btn-sm hover:animate-squeeze">
                    <MdOutlineNoiseAware className="text-xl" />
                </button>
                <button aria-label="chromatic aberration"
                    data-tip="chromatic aberration"
                    data-for="tooltip"
                    onClick={() => data.actions.chromaticAberration()}
                    className="box-content py-1 btn btn-accent btn-sm hover:animate-squeeze">
                    <GrSpectrum className="text-xl" />
                </button>
                <button aria-label="vignette"
                    data-tip="vignette"
                    data-for="tooltip"
                    onClick={() => data.actions.applyVignette()}
                    className="box-content py-1 btn btn-accent btn-sm hover:animate-squeeze">
                    <MdVignette className="text-xl" />
                </button>
                <button aria-label="solarize filter"
                    data-tip="solarize filter"
                    data-for="tooltip"
                    onClick={() => data.actions.solarize()}
                    className="box-content py-1 btn btn-accent btn-sm hover:animate-squeeze">
                    <IoPartlySunnySharp className="text-xl" />
                </button>
                <button aria-label="oil paint filter"
                    data-tip="oil paint filter"
                    data-for="tooltip"
                    onClick={() => data.actions.applyOilPainting()}
                    className="box-content py-1 btn btn-accent btn-sm hover:animate-squeeze">
                    <FaPaintBrush className="text-xl" />
                </button>
                <button aria-label="posterize filter"
                    data-tip="posterize filter"
                    data-for="tooltip"
                    onClick={() => data.actions.posterize()}
                    className="box-content py-1 btn btn-accent btn-sm hover:animate-squeeze">
                    <FaBook className="text-xl" />
                </button>
                <button aria-label="HDR filter"
                    data-tip="HDR filter"
                    data-for="tooltip"
                    onClick={() => data.actions.applyHDR()}
                    className="box-content py-1 btn btn-accent btn-sm hover:animate-squeeze">
                    <MdHdrPlus className="text-xl" />
                </button>
                <button aria-label="increase shadows and highlights"
                    data-tip="increase shadows and highlights"
                    data-for="tooltip"
                    onClick={() => data.actions.adjustShadowsAndHighlights()}
                    className="box-content py-1 btn btn-accent btn-sm hover:animate-squeeze">
                    <TbInnerShadowTopFilled className="text-xl" />
                </button>
                <button aria-label="glitch effect"
                    data-tip="glitch effect"
                    data-for="tooltip"
                    onClick={() => data.actions.applyGlitchArt()}
                    className="box-content py-1 btn btn-accent btn-sm hover:animate-squeeze">
                    <BiSolidError className="text-xl" />
                </button>
                <button aria-label="frosted glass effect"
                    data-tip="frosted glass effect"
                    data-for="tooltip"
                    onClick={() => data.actions.applyFrostedGlass()}
                    className="box-content py-1 btn btn-accent btn-sm hover:animate-squeeze">
                    <FaWineGlass className="text-xl" />
                </button>
                <button aria-label="3D anaglyph effect"
                    data-tip="3D anaglyph effect"
                    data-for="tooltip"
                    onClick={() => data.actions.applyAnaglyph3D()}
                    className="box-content py-1 btn btn-accent btn-sm hover:animate-squeeze">
                    <Gi3DGlasses className="text-xl" />
                </button>

                <button aria-label="infrared effect"
                    data-tip="infrared effect"
                    data-for="tooltip"
                    onClick={() => data.actions.applyInfraredEffect()}
                    className="box-content py-1 btn btn-accent btn-sm hover:animate-squeeze">
                    <RiInfraredThermometerFill className="text-xl" />
                </button>
                <button aria-label="old film effect"
                    data-tip="old film effect"
                    data-for="tooltip"
                    onClick={() => data.actions.applyOldFilmEffect()}
                    className="box-content py-1 btn btn-accent btn-sm hover:animate-squeeze">
                    <FaFilm className="text-xl" />
                </button>
                <button aria-label="sunset effect"
                    data-tip="sunet effect"
                    data-for="tooltip"
                    onClick={() => data.actions.applySunsetEffect()}
                    className="box-content py-1 btn btn-accent btn-sm hover:animate-squeeze">
                    <PiSunHorizonFill className="text-xl" />
                </button>
                <button aria-label="light leak effect"
                    data-tip="light leak effect"
                    data-for="tooltip"
                    onClick={() => data.actions.applyLightLeakEffect()}
                    className="box-content py-1 btn btn-accent btn-sm hover:animate-squeeze">
                    <GiExplosionRays className="text-xl" />
                </button>
                <button aria-label="bokeh effect"
                    data-tip="bokeh effect"
                    data-for="tooltip"
                    onClick={() => data.actions.applyBokehEffect()}
                    className="box-content py-1 btn btn-accent btn-sm hover:animate-squeeze">
                    <TbCirclesFilled className="text-xl" />
                </button>
                <button aria-label="miniature effect"
                    data-tip="miniature effect"
                    data-for="tooltip"
                    onClick={() => data.actions.applyTiltShiftMiniature()}
                    className="box-content py-1 btn btn-accent btn-sm hover:animate-squeeze">
                    <IoReorderTwo className="text-xl" />
                </button>
                <button aria-label="fish eye effect"
                    data-tip="fish eye effect"
                    data-for="tooltip"
                    onClick={() => data.actions.applyFisheyeEffect()}
                    className="box-content py-1 btn btn-accent btn-sm hover:animate-squeeze">
                    <FaFishFins className="text-xl" />
                </button>
                <button aria-label="crytallize effect"
                    data-tip="crytallize effect"
                    data-for="tooltip"
                    onClick={() => data.actions.applyCrystallize(2)}
                    className="box-content py-1 btn btn-accent btn-sm hover:animate-squeeze">
                    <GiCrystalGrowth className="text-xl" />
                </button>
                <button aria-label="holographic effect"
                    data-tip="holographic effect"
                    data-for="tooltip"
                    onClick={() => data.actions.applyHolographicEffect()}
                    className="box-content py-1 btn btn-accent btn-sm hover:animate-squeeze">
                    <Gi3DMeeple className="text-xl" />
                </button>
            </>)}
        </section>
    </section >)
}


function useTools() {
    const canvas1 = useCanvas();
    const canvas2 = useCanvas();
    const { setActiveLayer, activeLayer, toolSettings, setToolSettings,  } = useGlobalStore();
    let [view, setView] = useState<'tools' | 'actions'>("tools");

    let actions = {
        clear: () => {
            setActiveLayer({
                ...activeLayer,
                image: new ImageData(activeLayer.image.width, activeLayer.image.height)
            });
        },
        flipHorizontal: () => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas2.resize(activeLayer.image.width, activeLayer.image.height);

            canvas1.putImageData(activeLayer.image);
            canvas2.getCtx().translate(0, canvas2.getHeight());
            canvas2.getCtx().scale(1, -1);
            canvas2.drawImage(canvas1.getElement());

            setActiveLayer({
                ...activeLayer,
                image: canvas2.getImageData()
            });
        },
        flipVertical: () => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas2.resize(activeLayer.image.width, activeLayer.image.height);

            canvas1.putImageData(activeLayer.image, 0, 0);
            canvas2.getCtx().translate(canvas2.getWidth(), 0);
            canvas2.getCtx().scale(-1, 1);
            canvas2.drawImage(canvas1.getElement(), 0, 0);

            setActiveLayer({
                ...activeLayer,
                image: canvas2.getImageData()
            });
        },
        rotateRight: () => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas2.resize(activeLayer.image.width, activeLayer.image.height);

            canvas1.putImageData(activeLayer.image);
            canvas2.getCtx().translate(canvas2.getWidth() / 2, canvas2.getHeight() / 2);
            canvas2.getCtx().rotate(90 * Math.PI / 180);
            canvas2.getCtx().translate(-canvas2.getWidth() / 2, -canvas2.getHeight() / 2);
            canvas2.drawImage(canvas1.getElement(), 0, 0);

            setActiveLayer({
                ...activeLayer,
                image: canvas2.getImageData()
            });
        },
        rotateLeft: () => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas2.resize(activeLayer.image.width, activeLayer.image.height);

            canvas1.putImageData(activeLayer.image, 0, 0);
            canvas2.getCtx().translate(canvas2.getWidth() / 2, canvas2.getHeight() / 2);
            canvas2.getCtx().rotate(-90 * Math.PI / 180);
            canvas2.getCtx().translate(-canvas2.getWidth() / 2, -canvas2.getHeight() / 2);
            canvas2.drawImage(canvas1.getElement());

            setActiveLayer({
                ...activeLayer,
                image: canvas2.getImageData()
            });
        },
        centerHorizontal: () => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);

            const imageData = activeLayer.image;
            const bounds = findVisibleBounds(imageData);
            const visibleWidth = bounds.maxX - bounds.minX + 1;
            const dx = (canvas1.getWidth() - visibleWidth) / 2 - bounds.minX;

            canvas1.putImageData(imageData, dx, 0);

            setActiveLayer({
                ...activeLayer,
                image: canvas1.getImageData()
            });
        },
        centerVertical: () => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);

            const imageData = activeLayer.image;
            const bounds = findVisibleBounds(imageData);
            const visibleHeight = bounds.maxY - bounds.minY + 1;
            const dy = (canvas1.getHeight() - visibleHeight) / 2 - bounds.minY;

            canvas1.putImageData(imageData, 0, dy);

            setActiveLayer({
                ...activeLayer,
                image: canvas1.getImageData()
            });
        },
        adjustBrightness: (adjustment) => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas1.putImageData(activeLayer.image);
            const imgData = canvas1.getImageData();

            for (let i = 0; i < imgData.data.length; i += 4) {
                imgData.data[i] = Math.min(255, Math.max(0, imgData.data[i] + adjustment)); // Red
                imgData.data[i + 1] = Math.min(255, Math.max(0, imgData.data[i + 1] + adjustment)); // Green
                imgData.data[i + 2] = Math.min(255, Math.max(0, imgData.data[i + 2] + adjustment)); // Blue
            }

            canvas1.putImageData(imgData);
            setActiveLayer({
                ...activeLayer,
                image: canvas1.getImageData()
            });
        },
        adjustContrast: (contrast) => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas1.putImageData(activeLayer.image);
            const imgData = canvas1.getImageData();
            const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

            for (let i = 0; i < imgData.data.length; i += 4) {
                imgData.data[i] = factor * (imgData.data[i] - 128) + 128; // Red
                imgData.data[i + 1] = factor * (imgData.data[i + 1] - 128) + 128; // Green
                imgData.data[i + 2] = factor * (imgData.data[i + 2] - 128) + 128; // Blue
            }

            canvas1.putImageData(imgData);
            setActiveLayer({
                ...activeLayer,
                image: canvas1.getImageData()
            });
        },
        invertColors: () => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas1.putImageData(activeLayer.image);
            const imgData = canvas1.getImageData();

            for (let i = 0; i < imgData.data.length; i += 4) {
                imgData.data[i] = 255 - imgData.data[i]; // Invert Red
                imgData.data[i + 1] = 255 - imgData.data[i + 1]; // Invert Green
                imgData.data[i + 2] = 255 - imgData.data[i + 2]; // Invert Blue
            }

            canvas1.putImageData(imgData);
            setActiveLayer({
                ...activeLayer,
                image: canvas1.getImageData()
            });
        },
        applySepia: () => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas1.putImageData(activeLayer.image);
            const imgData = canvas1.getImageData();

            for (let i = 0; i < imgData.data.length; i += 4) {
                const r = imgData.data[i];
                const g = imgData.data[i + 1];
                const b = imgData.data[i + 2];

                imgData.data[i] = (r * 0.393) + (g * 0.769) + (b * 0.189); // Red
                imgData.data[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168); // Green
                imgData.data[i + 2] = (r * 0.272) + (g * 0.534) + (b * 0.131); // Blue
            }

            canvas1.putImageData(imgData);
            setActiveLayer({
                ...activeLayer,
                image: canvas1.getImageData()
            });
        },
        applyBlur: (radius = 1) => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas1.putImageData(activeLayer.image);
            const imgData = canvas1.getImageData();
            const width = imgData.width;
            const height = imgData.height;
            const blurredData = new Uint8ClampedArray(imgData.data.length);

            // Use a weight factor to reduce blur intensity
            const weight = 0.5; // Reduce the effect of surrounding pixels by 50%

            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    let totalR = 0, totalG = 0, totalB = 0, totalA = 0, count = 0;

                    for (let dx = -radius; dx <= radius; dx++) {
                        for (let dy = -radius; dy <= radius; dy++) {
                            let nx = x + dx, ny = y + dy;

                            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                                const idx = (ny * width + nx) * 4;
                                totalR += imgData.data[idx];
                                totalG += imgData.data[idx + 1];
                                totalB += imgData.data[idx + 2];
                                totalA += imgData.data[idx + 3];
                                count++;
                            }
                        }
                    }

                    const idx = (y * width + x) * 4;
                    blurredData[idx] = (imgData.data[idx] * (1 - weight)) + (weight * totalR / count);
                    blurredData[idx + 1] = (imgData.data[idx + 1] * (1 - weight)) + (weight * totalG / count);
                    blurredData[idx + 2] = (imgData.data[idx + 2] * (1 - weight)) + (weight * totalB / count);
                    blurredData[idx + 3] = totalA / count;  // Normally, alpha wouldn't change, kept for consistency
                }
            }

            canvas1.putImageData(new ImageData(blurredData, width, height));
            setActiveLayer({
                ...activeLayer,
                image: canvas1.getImageData()
            });
        },
        increaseSharpness: (sharpnessStrength = 1) => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas1.putImageData(activeLayer.image);
            const imgData = canvas1.getImageData();
            const width = imgData.width;
            const height = imgData.height;
            const sharpenedData = new Uint8ClampedArray(imgData.data.length);

            // Define the sharpening kernel with the ability to adjust its strength
            const baseStrength = 0.3; // Lower base strength for a more subtle effect
            const kernel = [
                0, -1 * sharpnessStrength * baseStrength, 0,
                -1 * sharpnessStrength * baseStrength, 1 + 4 * sharpnessStrength * baseStrength, -1 * sharpnessStrength * baseStrength,
                0, -1 * sharpnessStrength * baseStrength, 0
            ];
            const kernelSize = Math.sqrt(kernel.length);
            const half = Math.floor(kernelSize / 2);

            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    let totalR = 0, totalG = 0, totalB = 0, totalA = 0;

                    for (let dx = -half; dx <= half; dx++) {
                        for (let dy = -half; dy <= half; dy++) {
                            let nx = x + dx, ny = y + dy;

                            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                                const idx = (ny * width + nx) * 4;
                                const k = kernel[(dx + half) + (dy + half) * kernelSize];

                                totalR += imgData.data[idx] * k;
                                totalG += imgData.data[idx + 1] * k;
                                totalB += imgData.data[idx + 2] * k;
                                totalA += imgData.data[idx + 3]; // Normally, alpha wouldn't change, kept for consistency
                            }
                        }
                    }

                    const idx = (y * width + x) * 4;
                    sharpenedData[idx] = Math.min(255, Math.max(0, totalR));
                    sharpenedData[idx + 1] = Math.min(255, Math.max(0, totalG));
                    sharpenedData[idx + 2] = Math.min(255, Math.max(0, totalB));
                    sharpenedData[idx + 3] = totalA;
                }
            }

            canvas1.putImageData(new ImageData(sharpenedData, width, height));
            setActiveLayer({
                ...activeLayer,
                image: canvas1.getImageData()
            });
        },
        applyGrayscale: () => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas1.putImageData(activeLayer.image);
            const imgData = canvas1.getImageData();

            for (let i = 0; i < imgData.data.length; i += 4) {
                const avg = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
                imgData.data[i] = avg; // Set Red to average
                imgData.data[i + 1] = avg; // Set Green to average
                imgData.data[i + 2] = avg; // Set Blue to average
            }

            canvas1.putImageData(imgData);
            setActiveLayer({
                ...activeLayer,
                image: canvas1.getImageData()
            });
        },
        pixelate: (blockSize = 2) => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas1.putImageData(activeLayer.image);
            const imgData = canvas1.getImageData();

            for (let y = 0; y < imgData.height; y += blockSize) {
                for (let x = 0; x < imgData.width; x += blockSize) {
                    const i = (y * imgData.width + x) * 4;
                    const r = imgData.data[i];
                    const g = imgData.data[i + 1];
                    const b = imgData.data[i + 2];
                    const a = imgData.data[i + 3];

                    for (let n = 0; n < blockSize; n++) {
                        for (let m = 0; m < blockSize; m++) {
                            if (x + m < imgData.width && y + n < imgData.height) {
                                const j = ((y + n) * imgData.width + (x + m)) * 4;
                                imgData.data[j] = r;
                                imgData.data[j + 1] = g;
                                imgData.data[j + 2] = b;
                                imgData.data[j + 3] = a;
                            }
                        }
                    }
                }
            }

            canvas1.putImageData(imgData);
            setActiveLayer({
                ...activeLayer,
                image: canvas1.getImageData()
            });
        },
        edgeDetection: () => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas1.putImageData(activeLayer.image);
            const imgData = canvas1.getImageData();
            const resultData = new Uint8ClampedArray(imgData.data.length);

            for (let i = 0; i < imgData.data.length; i += 4) {
                const row = Math.floor((i / 4) / imgData.width);
                const col = (i / 4) % imgData.width;

                if (row > 0 && row < imgData.height - 1 && col > 0 && col < imgData.width - 1) {
                    const sum = imgData.data[i - 4] + imgData.data[i + 4] + imgData.data[i - 4 * imgData.width] + imgData.data[i + 4 * imgData.width] - 4 * imgData.data[i];
                    const color = sum > 255 ? 255 : sum < 0 ? 0 : sum;

                    resultData[i] = color;  // R
                    resultData[i + 1] = color;  // G
                    resultData[i + 2] = color;  // B
                    resultData[i + 3] = 255;  // A
                } else {
                    resultData[i] = imgData.data[i];
                    resultData[i + 1] = imgData.data[i + 1];
                    resultData[i + 2] = imgData.data[i + 2];
                    resultData[i + 3] = imgData.data[i + 3];
                }
            }

            canvas1.putImageData(new ImageData(resultData, imgData.width, imgData.height));
            setActiveLayer({
                ...activeLayer,
                image: canvas1.getImageData()
            });
        },
        addNoise: (intensity = 25) => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas1.putImageData(activeLayer.image);
            const imgData = canvas1.getImageData();

            for (let i = 0; i < imgData.data.length; i += 4) {
                const noise = intensity * (0.5 - Math.random());
                imgData.data[i] += noise;     // R
                imgData.data[i + 1] += noise; // G
                imgData.data[i + 2] += noise; // B
            }

            canvas1.putImageData(imgData);
            setActiveLayer({
                ...activeLayer,
                image: canvas1.getImageData()
            });
        },
        chromaticAberration: () => {
            const shiftAmount = 5; // Amount of pixel shift for the color channels
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas1.putImageData(activeLayer.image);
            const imgData = canvas1.getImageData();
            const width = imgData.width;
            const height = imgData.height;

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    let i = (y * width + x) * 4;
                    let r = imgData.data[i + 4 * shiftAmount] || imgData.data[i]; // Shift red channel right
                    let b = imgData.data[i - 4 * shiftAmount] || imgData.data[i + 2]; // Shift blue channel left
                    imgData.data[i] = r; // Red
                    imgData.data[i + 2] = b; // Blue
                }
            }

            canvas1.putImageData(imgData);
            setActiveLayer({
                ...activeLayer,
                image: canvas1.getImageData()
            });
        },
        applyVignette: () => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas1.putImageData(activeLayer.image);
            const imgData = canvas1.getImageData();
            const radius = Math.min(imgData.width, imgData.height) / 2;
            const center = { x: imgData.width / 2, y: imgData.height / 2 };

            for (let y = 0; y < imgData.height; y++) {
                for (let x = 0; x < imgData.width; x++) {
                    let dx = x - center.x;
                    let dy = y - center.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    let attenuation = Math.max(0, 1 - distance / radius);
                    let i = (y * imgData.width + x) * 4;
                    imgData.data[i] *= attenuation; // Red
                    imgData.data[i + 1] *= attenuation; // Green
                    imgData.data[i + 2] *= attenuation; // Blue
                }
            }

            canvas1.putImageData(imgData);
            setActiveLayer({
                ...activeLayer,
                image: canvas1.getImageData()
            });
        },
        solarize: () => {
            const threshold = 128; // Pixels brighter than this are inverted
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas1.putImageData(activeLayer.image);
            const imgData = canvas1.getImageData();
            const data = imgData.data;

            for (let i = 0; i < data.length; i += 4) {
                data[i] = data[i] > threshold ? 255 - data[i] : data[i]; // Red
                data[i + 1] = data[i + 1] > threshold ? 255 - data[i + 1] : data[i + 1]; // Green
                data[i + 2] = data[i + 2] > threshold ? 255 - data[i + 2] : data[i + 2]; // Blue
            }

            canvas1.putImageData(imgData);
            setActiveLayer({
                ...activeLayer,
                image: canvas1.getImageData()
            });
        },
        applyOilPainting: () => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas1.putImageData(activeLayer.image);
            const imgData = canvas1.getImageData();
            const radius = 1; // Very small radius to minimize the effect
            const intensityLevels = 8; // Fewer intensity levels to reduce detail smoothing
            const width = imgData.width;
            const height = imgData.height;
            const outputData = new ImageData(width, height);

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    let intensityCount = new Array(intensityLevels).fill(0);
                    let intensitySum = new Array(intensityLevels).fill(0).map(() => ({ r: 0, g: 0, b: 0, a: 0 }));

                    // Analyze pixels within the small radius
                    for (let dy = -radius; dy <= radius; dy++) {
                        for (let dx = -radius; dx <= radius; dx++) {
                            const nx = x + dx;
                            const ny = y + dy;

                            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                                const idx = (ny * width + nx) * 4;
                                const r = imgData.data[idx];
                                const g = imgData.data[idx + 1];
                                const b = imgData.data[idx + 2];
                                const intensityIndex = Math.floor(((r + g + b) / 3) * intensityLevels / 256);

                                intensityCount[intensityIndex]++;
                                intensitySum[intensityIndex].r += r;
                                intensitySum[intensityIndex].g += g;
                                intensitySum[intensityIndex].b += b;
                            }
                        }
                    }

                    // Find the most frequent intensity
                    let maxIndex = 0;
                    let maxCount = 0;
                    for (let i = 0; i < intensityLevels; i++) {
                        if (intensityCount[i] > maxCount) {
                            maxCount = intensityCount[i];
                            maxIndex = i;
                        }
                    }

                    const i = (y * width + x) * 4;
                    if (maxCount > 0) { // Ensure division is safe
                        outputData.data[i] = intensitySum[maxIndex].r / maxCount;
                        outputData.data[i + 1] = intensitySum[maxIndex].g / maxCount;
                        outputData.data[i + 2] = intensitySum[maxIndex].b / maxCount;
                    }
                    outputData.data[i + 3] = 255; // Maintain full opacity
                }
            }

            canvas1.putImageData(outputData);
            setActiveLayer({
                ...activeLayer,
                image: canvas1.getImageData()
            });
        },
        posterize: () => {
            const levels = 4; // Number of color levels per channel
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas1.putImageData(activeLayer.image);
            const imgData = canvas1.getImageData();
            const data = imgData.data;
            const step = Math.floor(255 / levels);

            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.floor(data[i] / step) * step; // Red
                data[i + 1] = Math.floor(data[i + 1] / step) * step; // Green
                data[i + 2] = Math.floor(data[i + 2] / step) * step; // Blue
            }

            canvas1.putImageData(imgData);
            setActiveLayer({
                ...activeLayer,
                image: canvas1.getImageData()
            });
        },
        applyHDR: () => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas1.putImageData(activeLayer.image);
            const imgData = canvas1.getImageData();
            const detailsEnhancement = 1.5; // Control how much detail is enhanced

            for (let i = 0; i < imgData.data.length; i += 4) {
                const lightness = 0.2126 * imgData.data[i] + 0.7152 * imgData.data[i + 1] + 0.0722 * imgData.data[i + 2];
                const scale = lightness / 128 - 1;

                imgData.data[i] *= 1 + scale * detailsEnhancement; // Red
                imgData.data[i + 1] *= 1 + scale * detailsEnhancement; // Green
                imgData.data[i + 2] *= 1 + scale * detailsEnhancement; // Blue
            }

            canvas1.putImageData(imgData);
            setActiveLayer({
                ...activeLayer,
                image: canvas1.getImageData()
            });
        },
        adjustShadowsAndHighlights: (shadows = 1.1, highlights = 1.1) => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas1.putImageData(activeLayer.image);
            const imgData = canvas1.getImageData();

            for (let i = 0; i < imgData.data.length; i += 4) {
                const lightness = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
                if (lightness < 128) { // Shadows
                    imgData.data[i] *= shadows; // Red
                    imgData.data[i + 1] *= shadows; // Green
                    imgData.data[i + 2] *= shadows; // Blue
                } else { // Highlights
                    imgData.data[i] *= highlights; // Red
                    imgData.data[i + 1] *= highlights; // Green
                    imgData.data[i + 2] *= highlights; // Blue
                }
            }

            canvas1.putImageData(imgData);
            setActiveLayer({
                ...activeLayer,
                image: canvas1.getImageData()
            });
        },
        applyGlitchArt: () => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas1.putImageData(activeLayer.image);
            const imgData = canvas1.getImageData();
            const width = imgData.width;
            const height = imgData.height;
            const glitchAmount = 5; // How much horizontal shift

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    if (Math.random() < 0.1) { // Only apply glitch with 10% probability
                        const shift = (Math.random() * 2 * glitchAmount - glitchAmount) | 0; // Calculate random shift
                        const nx = (x + shift + width) % width; // Wrap around effect horizontally
                        const idx = (y * width + x) * 4;
                        const nIdx = (y * width + nx) * 4;
                        imgData.data[idx] = imgData.data[nIdx];
                        imgData.data[idx + 1] = imgData.data[nIdx + 1];
                        imgData.data[idx + 2] = imgData.data[nIdx + 2];
                    }
                }
            }

            canvas1.putImageData(imgData, 0, 0);
            setActiveLayer({
                ...activeLayer,
                image: imgData
            });
        },
        applyFrostedGlass: () => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas1.putImageData(activeLayer.image);
            const imgData = canvas1.getImageData();
            const width = imgData.width;
            const height = imgData.height;
            const radius = 5; // Maximum radius of blur
            const outputData = new Uint8ClampedArray(imgData.data.length); // To hold the frosted glass effect data

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    let totalR = 0, totalG = 0, totalB = 0, totalA = 0, count = 0;
                    const radiusVariation = Math.floor(Math.random() * radius);
                    for (let dy = -radiusVariation; dy <= radiusVariation; dy++) {
                        for (let dx = -radiusVariation; dx <= radiusVariation; dx++) {
                            const nx = x + dx;
                            const ny = y + dy;
                            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                                const idx = (ny * width + nx) * 4;
                                totalR += imgData.data[idx];
                                totalG += imgData.data[idx + 1];
                                totalB += imgData.data[idx + 2];
                                totalA += imgData.data[idx + 3];
                                count++;
                            }
                        }
                    }
                    const i = (y * width + x) * 4;
                    outputData[i] = totalR / count;
                    outputData[i + 1] = totalG / count;
                    outputData[i + 2] = totalB / count;
                    outputData[i + 3] = totalA / count;
                }
            }

            const newImageData = new ImageData(new Uint8ClampedArray(outputData), width, height);
            canvas1.putImageData(newImageData, 0, 0);
            setActiveLayer({
                ...activeLayer,
                image: newImageData
            });
        },
        applyAnaglyph3D: () => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas1.putImageData(activeLayer.image);
            const imgData = canvas1.getImageData();
            const width = imgData.width;
            const height = imgData.height;
            const shiftAmount = 5; // Horizontal shift for the 3D effect

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const idx = (y * width + x) * 4;
                    const nIdx = idx + shiftAmount * 4; // Shift index for cyan image

                    // Check bounds
                    if (x + shiftAmount < width) {
                        imgData.data[idx] = imgData.data[idx]; // Red channel remains
                        imgData.data[idx + 1] = imgData.data[nIdx + 1]; // Green channel from shifted pixel
                        imgData.data[idx + 2] = imgData.data[nIdx + 2]; // Blue channel from shifted pixel
                    }
                }
            }

            canvas1.putImageData(imgData, 0, 0);
            setActiveLayer({
                ...activeLayer,
                image: imgData
            });
        },
        applyMosaic: (tileSize = 2) => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas1.putImageData(activeLayer.image);
            const imgData = canvas1.getImageData();
            const width = imgData.width;
            const height = imgData.height;

            for (let y = 0; y < height; y += tileSize) {
                for (let x = 0; x < width; x += tileSize) {
                    let r = 0, g = 0, b = 0, count = 0;
                    for (let dy = 0; dy < tileSize; dy++) {
                        for (let dx = 0; dx < tileSize; dx++) {
                            if (x + dx < width && y + dy < height) {
                                const idx = ((y + dy) * width + (x + dx)) * 4;
                                r += imgData.data[idx];
                                g += imgData.data[idx + 1];
                                b += imgData.data[idx + 2];
                                count++;
                            }
                        }
                    }
                    r /= count;
                    g /= count;
                    b /= count;
                    // Apply average color to the tile
                    for (let dy = 0; dy < tileSize; dy++) {
                        for (let dx = 0; dx < tileSize; dx++) {
                            if (x + dx < width && y + dy < height) {
                                const idx = ((y + dy) * width + (x + dx)) * 4;
                                imgData.data[idx] = r;
                                imgData.data[idx + 1] = g;
                                imgData.data[idx + 2] = b;
                            }
                        }
                    }
                }
            }

            canvas1.putImageData(imgData, 0, 0);
            setActiveLayer({
                ...activeLayer,
                image: imgData
            });
        },
        applyInfraredEffect: () => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas1.putImageData(activeLayer.image);
            const imgData = canvas1.getImageData();

            for (let i = 0; i < imgData.data.length; i += 4) {
                const red = imgData.data[i];
                const green = imgData.data[i + 1];
                const blue = imgData.data[i + 2];
                const brightness = 0.299 * red + 0.587 * green + 0.114 * blue;

                imgData.data[i] = brightness; // Red channel enhanced
                imgData.data[i + 1] = brightness * 0.5; // Green channel reduced
                imgData.data[i + 2] = brightness * 0.5; // Blue channel reduced
            }

            canvas1.putImageData(imgData, 0, 0);
            setActiveLayer({
                ...activeLayer,
                image: imgData
            });
        },
        applyOldFilmEffect: () => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas1.putImageData(activeLayer.image);
            const imgData = canvas1.getImageData();
            const grainAmount = 50;

            // Apply sepia tone
            for (let i = 0; i < imgData.data.length; i += 4) {
                const r = imgData.data[i];
                const g = imgData.data[i + 1];
                const b = imgData.data[i + 2];
                const sepia = 0.393 * r + 0.769 * g + 0.189 * b;
                imgData.data[i] = sepia;
                imgData.data[i + 1] = 0.349 * r + 0.686 * g + 0.168 * b;
                imgData.data[i + 2] = 0.272 * r + 0.534 * g + 0.131 * b;
            }

            // Add grain
            for (let i = 0; i < imgData.data.length; i += 4) {
                const noise = (0.5 - Math.random()) * grainAmount;
                imgData.data[i] += noise;
                imgData.data[i + 1] += noise;
                imgData.data[i + 2] += noise;
            }

            canvas1.putImageData(imgData, 0, 0);
            setActiveLayer({
                ...activeLayer,
                image: imgData
            });
        },
        applySunsetEffect: () => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas1.putImageData(activeLayer.image);
            const imgData = canvas1.getImageData();
            const data = imgData.data;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                data[i] = r + 40; // Enhance red
                data[i + 1] = g + 30; // Slightly enhance green
                data[i + 2] = b; // Maintain blue
            }

            canvas1.putImageData(imgData, 0, 0);
            setActiveLayer({
                ...activeLayer,
                image: imgData
            });
        },
        applyLightLeakEffect: () => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas1.putImageData(activeLayer.image);
            const imgData = canvas1.getImageData();
            const width = imgData.width;
            const height = imgData.height;

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    if (Math.random() < 0.1) { // Random chance to create light leak spots
                        const idx = (y * width + x) * 4;
                        imgData.data[idx] = Math.min(255, imgData.data[idx] + 150); // Increase red channel
                        imgData.data[idx + 1] = Math.min(255, imgData.data[idx + 1] + 150); // Increase green channel
                        imgData.data[idx + 2] = Math.min(255, imgData.data[idx + 2] + 150); // Increase blue channel
                    }
                }
            }

            canvas1.putImageData(imgData, 0, 0);
            setActiveLayer({
                ...activeLayer,
                image: imgData
            });
        },
        applyBokehEffect: () => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas1.putImageData(activeLayer.image);
            const imgData = canvas1.getImageData();
            const width = imgData.width;
            const height = imgData.height;
            const outputData = new Uint8ClampedArray(imgData.data.length);
            const bokehRadius = 15; // Radius of each bokeh spot
            const bokehCount = 20;  // Number of bokeh spots

            // Copy original image data
            outputData.set(imgData.data);

            for (let i = 0; i < bokehCount; i++) {
                const cx = Math.random() * width;
                const cy = Math.random() * height;
                const color = {
                    r: Math.random() * 255,
                    g: Math.random() * 255,
                    b: Math.random() * 255
                };

                for (let y = -bokehRadius; y <= bokehRadius; y++) {
                    for (let x = -bokehRadius; x <= bokehRadius; x++) {
                        if (x * x + y * y <= bokehRadius * bokehRadius) {
                            const px = Math.floor(cx + x);
                            const py = Math.floor(cy + y);
                            if (px >= 0 && px < width && py >= 0 && py < height) {
                                const idx = (py * width + px) * 4;
                                outputData[idx] = color.r;
                                outputData[idx + 1] = color.g;
                                outputData[idx + 2] = color.b;
                                outputData[idx + 3] = 255; // Ensure full opacity for bokeh spots
                            }
                        }
                    }
                }
            }

            canvas1.putImageData(new ImageData(outputData, width, height), 0, 0);
            setActiveLayer({
                ...activeLayer,
                image: canvas1.getImageData()
            });
        },
        applyTiltShiftMiniature: () => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas1.putImageData(activeLayer.image);
            const imgData = canvas1.getImageData();
            const width = imgData.width;
            const height = imgData.height;
            const focusBandStart = height / 3;
            const focusBandEnd = 2 * height / 3;
            const blurAmount = 5; // Amount of blur outside the focus band

            // Copy image data for modification
            const outputData = new Uint8ClampedArray(imgData.data.length);
            outputData.set(imgData.data);

            // Apply blur above and below the focus band
            for (let y = 0; y < height; y++) {
                if (y < focusBandStart || y > focusBandEnd) { // Only blur outside the band
                    for (let x = 0; x < width; x++) {
                        const idx = (y * width + x) * 4;
                        let avgR = 0, avgG = 0, avgB = 0, count = 0;

                        // Average the colors from a small kernel to blur
                        for (let dy = -blurAmount; dy <= blurAmount; dy++) {
                            for (let dx = -blurAmount; dx <= blurAmount; dx++) {
                                const nx = x + dx;
                                const ny = y + dy;
                                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                                    const nIdx = (ny * width + nx) * 4;
                                    avgR += outputData[nIdx];
                                    avgG += outputData[nIdx + 1];
                                    avgB += outputData[nIdx + 2];
                                    count++;
                                }
                            }
                        }

                        outputData[idx] = avgR / count;
                        outputData[idx + 1] = avgG / count;
                        outputData[idx + 2] = avgB / count;
                    }
                }
            }

            canvas1.putImageData(new ImageData(outputData, width, height), 0, 0);
            setActiveLayer({
                ...activeLayer,
                image: canvas1.getImageData()
            });
        },
        applyFisheyeEffect: () => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas1.putImageData(activeLayer.image);
            const imgData = canvas1.getImageData();
            const width = imgData.width;
            const height = imgData.height;
            const outputData = new Uint8ClampedArray(imgData.data.length);
            const radius = Math.min(width, height) / 2;
            const centerX = width / 2;
            const centerY = height / 2;

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const dx = (x - centerX) / radius;
                    const dy = (y - centerY) / radius;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const theta = Math.atan2(dy, dx);
                    const r = distance === 0 ? distance : Math.sin(distance) / distance;

                    const sourceX = Math.min(width - 1, Math.max(0, centerX + r * dx * radius));
                    const sourceY = Math.min(height - 1, Math.max(0, centerY + r * dy * radius));
                    const srcIdx = (Math.floor(sourceY) * width + Math.floor(sourceX)) * 4;

                    const destIdx = (y * width + x) * 4;
                    outputData[destIdx] = imgData.data[srcIdx];
                    outputData[destIdx + 1] = imgData.data[srcIdx + 1];
                    outputData[destIdx + 2] = imgData.data[srcIdx + 2];
                    outputData[destIdx + 3] = 255; // Full opacity
                }
            }

            canvas1.putImageData(new ImageData(outputData, width, height), 0, 0);
            setActiveLayer({
                ...activeLayer,
                image: canvas1.getImageData()
            });
        },
        applyCrystallize: (cellSize = 2) => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas1.putImageData(activeLayer.image);
            const imgData = canvas1.getImageData();
            const width = imgData.width;
            const height = imgData.height;
            const cellsAcross = Math.ceil(width / cellSize);
            const cellsDown = Math.ceil(height / cellSize);
            const outputData = new Uint8ClampedArray(imgData.data.length);

            for (let y = 0; y < cellsDown; y++) {
                for (let x = 0; x < cellsAcross; x++) {
                    let avgR = 0, avgG = 0, avgB = 0, count = 0;
                    // Calculate the average color of the cell
                    for (let dy = 0; dy < cellSize; dy++) {
                        for (let dx = 0; dx < cellSize; dx++) {
                            const px = x * cellSize + dx;
                            const py = y * cellSize + dy;
                            if (px < width && py < height) {
                                const idx = (py * width + px) * 4;
                                avgR += imgData.data[idx];
                                avgG += imgData.data[idx + 1];
                                avgB += imgData.data[idx + 2];
                                count++;
                            }
                        }
                    }
                    avgR /= count;
                    avgG /= count;
                    avgB /= count;

                    // Apply the average color to the whole cell
                    for (let dy = 0; dy < cellSize; dy++) {
                        for (let dx = 0; dx < cellSize; dx++) {
                            const px = x * cellSize + dx;
                            const py = y * cellSize + dy;
                            if (px < width && py < height) {
                                const idx = (py * width + px) * 4;
                                outputData[idx] = avgR;
                                outputData[idx + 1] = avgG;
                                outputData[idx + 2] = avgB;
                                outputData[idx + 3] = 255; // Fully opaque
                            }
                        }
                    }
                }
            }

            canvas1.putImageData(new ImageData(outputData, width, height), 0, 0);
            setActiveLayer({
                ...activeLayer,
                image: canvas1.getImageData()
            });
        },
        applyHolographicEffect: () => {
            canvas1.resize(activeLayer.image.width, activeLayer.image.height);
            canvas1.putImageData(activeLayer.image);
            const imgData = canvas1.getImageData();
            const width = imgData.width;
            const height = imgData.height;

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const idx = (y * width + x) * 4;
                    imgData.data[idx] = (imgData.data[idx] + x % 255); // Red channel
                    imgData.data[idx + 1] = (imgData.data[idx + 1] + y % 255); // Green channel
                    imgData.data[idx + 2] = (imgData.data[idx + 2] + (x + y) % 255); // Blue channel
                    imgData.data[idx] %= 255;
                    imgData.data[idx + 1] %= 255;
                    imgData.data[idx + 2] %= 255;
                }
            }

            canvas1.putImageData(imgData, 0, 0);
            setActiveLayer({
                ...activeLayer,
                image: imgData
            });
        },
    }

    useShortcuts({
        "1": () => setView("tools"),
        "2": () => setView("actions"),
        "b": () => updateTool(null, "brush", 0),
        "e": () => updateTool(null, "eraser", 0),
        "g": () => updateTool(null, "bucket", 0),
        "p": () => updateTool(null, "spray", 0),
        "s": () => updateTool(null, "shape", 0),
        "t": () => updateTool(null, "light", 0),
        "d": () => updateTool(null, "smudge", 0),
        "l": () => updateTool(null, "line", 0),
        "f": () => updateTool(null, "font", 0),
        "c": () => updateTool(null, "crop", 0),
        "m": () => updateTool(null, "mirror", 0),
        "i": () => updateTool(null, "eyedropper", 0),
        "v": () => updateTool(null, "move", 0),
        "x": () => updateTool(null, "box", 0),
        "w": () => updateTool(null, "wand", 0),
        "o": () => updateTool(null, "lasso", 0),
        "shift+h": actions.flipHorizontal,
        "shift+v": actions.flipVertical,
        "shift+~": actions.centerHorizontal,
        "shift+|": actions.centerVertical,
        "shift+r": actions.rotateRight,
        "shift+l": actions.rotateLeft,
        "shift+c": actions.clear,
    });

    useEffect(() => {
        ReactTooltip.rebuild();
    }, [view]);

    function findVisibleBounds(imageData) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        let minX = width, maxX = 0, minY = height, maxY = 0;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const alpha = data[(y * width + x) * 4 + 3];
                if (alpha > 0) { // This pixel is not transparent.
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }

        return { minX, maxX, minY, maxY };
    }

    function getButtonStyles(tool: ITool) {
        let classes = "";
        if (toolSettings.leftTool === tool) classes += " btn-secondary";
        else if (toolSettings.rightTool === tool) classes += " btn-accent";
        else if (toolSettings.middleTool === tool) classes += " btn-neutral";
        return classes;
    }

    function getButtonTooltip(tool: ITool) {
        let tooltip = "";
        if (toolSettings.leftTool === tool) tooltip += "( left 🖱️ )";
        else if (toolSettings.rightTool === tool) tooltip += "( right 🖱️ )";
        else if (toolSettings.middleTool === tool) tooltip += "( middle 🖱️ )";
        return tooltip;
    }

    function updateTool(e: any, newTool: ITool, mouseButton?: number) {
        const btn = e ? e.button : mouseButton;
        const { leftTool, middleTool, rightTool } = toolSettings;

        // Check if the tool is already assigned to a button
        if (newTool === leftTool || newTool === middleTool || newTool === rightTool) {
            // Swap the tools if already assigned
            if (btn === 0 && newTool !== leftTool) {
                setToolSettings({
                    ...toolSettings,
                    leftTool: newTool,
                    ...(newTool === middleTool && { middleTool: leftTool }),
                    ...(newTool === rightTool && { rightTool: leftTool }),
                });
            } else if (btn === 1 && newTool !== middleTool) {
                setToolSettings({
                    ...toolSettings,
                    middleTool: newTool,
                    ...(newTool === leftTool && { leftTool: middleTool }),
                    ...(newTool === rightTool && { rightTool: middleTool }),
                });
            } else if (btn === 2 && newTool !== rightTool) {
                setToolSettings({
                    ...toolSettings,
                    rightTool: newTool,
                    ...(newTool === leftTool && { leftTool: rightTool }),
                    ...(newTool === middleTool && { middleTool: rightTool }),
                });
            }
        } else {
            // Assign the tool as before if not already assigned
            if (btn === 0) setToolSettings({ ...toolSettings, leftTool: newTool });
            else if (btn === 1) setToolSettings({ ...toolSettings, middleTool: newTool });
            else if (btn === 2) setToolSettings({ ...toolSettings, rightTool: newTool });
        }
    }

    return {
        view,
        actions,
        setView,
        updateTool,
        getButtonStyles,
        getButtonTooltip,
    }
}

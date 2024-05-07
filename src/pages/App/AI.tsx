import axios from 'axios';
import RgbQuant from "rgbquant";
import React, { useEffect, useState } from 'react';
import { useCanvas, useGlobalStore } from '../../utils';


export function AI() {
    const data = useAI();

    return (
        <section>
            {data.loading && (
                <div className="w-full row"><div className="mx-auto mt-2 loading loading-ball loading-lg"></div></div>
            )}

            {data.img && !data.loading && (
                <img onClick={data.insertImg}
                    style={{ imageRendering: "pixelated" }}
                    className="object-contain w-full h-56 mt-2 cursor-pointer" src={data.img} alt="ai generated image" />
            )}

            <div className="mt-2 space-x-1 row">
                <button className={`btn btn-sm ${data.resolution == 16 ? "btn-primary" : "btn-secondary"}`}
                    onClick={e => data.setResolution(16)}>16</button>
                <button className={`btn btn-sm ${data.resolution == 32 ? "btn-primary" : "btn-secondary"}`}
                    onClick={e => data.setResolution(32)}>32</button>
                <button className={`btn btn-sm ${data.resolution == 64 ? "btn-primary" : "btn-secondary"}`}
                    onClick={e => data.setResolution(64)}>64</button>
                <button className={`btn btn-sm ${data.resolution == 128 ? "btn-primary" : "btn-secondary"}`}
                    onClick={e => data.setResolution(128)}>128</button>
            </div>

            <textarea
                onKeyDown={e => e.stopPropagation()}
                onChange={e => data.setDescription(e.currentTarget.value)}
                placeholder="Enter image description"
                className="w-full h-20 mt-2 resize-none textarea textarea-bordered"></textarea>
            <button onClick={() => data.generatedImage(data.description)} className="w-full btn btn-primary btn-sm">Generate Image</button>
        </section>
    )
}

function useAI() {
    const canvas1 = useCanvas();
    const canvas2 = useCanvas();
    let [resolution, setResolution] = useState(32);
    const { setActiveFrame, canvasSize, setCanvasSize } = useGlobalStore();

    let [aiBaseImg, setAiBaseImg] = useState("");
    let [img, setImg] = useState<any>("");
    let [description, setDescription] = useState("");
    let [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!aiBaseImg) return;

        let tempImg = new Image();
        tempImg.src = aiBaseImg as string;

        tempImg.onload = () => {
            canvas1.resize(tempImg.width, tempImg.height);
            canvas2.resize(resolution, resolution);

            canvas1.drawImage(tempImg);

            let q = new RgbQuant({
                colors: 32,
                useCache: true,
                cacheFreq: 10,
            });
            q.sample(canvas1.getElement());
            q.sample(canvas1.getElement());

            let imageData = new ImageData(tempImg.width, tempImg.height);
            imageData.data.set(q.reduce(canvas1.getElement()));

            canvas1.putImageData(imageData);
            canvas2.drawImage(canvas1.getElement(), 0, 0, resolution, resolution);

            setImg(canvas2.toDataURL());
        };
    }, [aiBaseImg, resolution]);

    function generatedImage(text) {
        setLoading(true);

        axios.post("https://api-inference.huggingface.co/models/nerijs/pixel-art-xl", {
            inputs: text + ",pixel art, 2d, simple, flat colors",
        }, {
            headers: { Authorization: `Bearer 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` },
            responseType: 'blob'
        }).then((response) => {
            const reader = new FileReader();
            reader.readAsDataURL(response.data);
            reader.onloadend = () => {
                setAiBaseImg(reader.result as string);
            };
        }).finally(() => setLoading(false));
    }

    function insertImg() {
        let i = new Image();
        i.src = img;

        i.onload = () => {
            let width = Math.max(i.width, canvasSize.width);
            let height = Math.max(i.height, canvasSize.height);
            let x = (width - i.width) / 2;
            let y = (height - i.height) / 2;

            setCanvasSize({ width, height });

            canvas1.resize(width, height);
            canvas1.drawImage(i, x, y, i.width, i.height);

            let newFrame = {
                layers: [
                    {
                        name: description,
                        image: canvas1.getImageData(),
                        symbol: Symbol(),
                        opacity: 255,
                    },
                ],
                visible: true,
                symbol: Symbol(),
            };

            setActiveFrame(newFrame);
        }
    }

    return {
        img,
        loading,
        resolution,
        description,
        insertImg,
        setLoading,
        setResolution,
        setDescription,
        generatedImage,
    };
}

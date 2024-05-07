import React, { useState } from 'react';
import { MdAdd, MdDelete } from 'react-icons/md';

export function References() {
    const data = useReferences();

    return (
        <section
            onDrop={data.handleDrop}
            onDragOver={data.handleDragOver}
            className="mt-2 space-y-1">
            {!data.mainImg && (
                <div className="p-6 text-center border-2 border-dashed rounded text-base-content/50 border-base-content/20 bg-base-content/5">
                    <p>Drag and drop your images here</p>
                </div>
            )}

            {data.mainImg && (
                <img onClick={() => data.setEnlargeMainImg(!data.enlargeMainImg)}
                    src={data.mainImg} alt="Main Reference"
                    className={`object-contain w-full cursor-pointer ${data.enlargeMainImg ? "h-60" : "h-40"}`} />
            )}

            <div className="flex-wrap row-left">
                {data.images.map((img, index) => (
                    <div className="relative m-1 group hover:animate-pop" key={index}>
                        <img src={img}
                            alt={`Thumbnail ${index + 1}`}
                            onClick={() => data.setMainImg(img)}
                            className="object-cover w-10 h-10 rounded-md cursor-pointer" />
                        <button onClick={() => {
                            data.setImages(i => i.filter((_, i) => i !== index));
                            if (data.mainImg === img) data.setMainImg('');
                        }}
                            className="absolute hidden bottom-left text-base-content bg-base-100 rounded-tr-md rounded-bl-md group-hover:block">
                            <MdDelete />
                        </button>
                    </div>
                ))}
            </div>

            <div className="w-full space-x-1 row">
                <input type="text"
                    placeholder="Paste image URL here"
                    className="flex-1 input input-sm input-bordered"
                    value={data.imgUrl}
                    onClick={() => data.setImgUrl("")}
                    onChange={(e) => {
                        data.setImgUrl(e.target.value);
                        data.setMainImg(e.target.value);
                        data.setImages(i => [...i, e.target.value]);
                    }} />
                <button data-tip="upload file"
                    data-for="tooltip"
                    onClick={data.uploadImg}
                    className="btn btn-sm btn-primary">
                    <MdAdd className="text-lg" />
                </button>
            </div>
        </section>
    );
}

function useReferences() {
    const [mainImg, setMainImg] = useState('');
    const [images, setImages] = useState<any[]>([]);
    const [enlargeMainImg, setEnlargeMainImg] = useState(false);
    const [imgUrl, setImgUrl] = useState('');

    function openFilePicker(options: any = {}) {
        return new Promise((resolve, reject) => {
            // Create an input element
            const input: any = document.createElement('input');
            input.type = 'file';
            input.style.display = 'none'; // Hide the input element

            // Apply options such as allowing multiple file selections
            if (options.multiple) input.multiple = true;

            // Handle file type restrictions if provided
            if (options.types && Array.isArray(options.types)) {
                let accept = options.types.map(type => type.accept.join(', ')).join(', ');
                input.accept = accept;
            }

            // Append to the body temporarily
            document.body.appendChild(input);

            // Listen for file selection
            input.onchange = () => {
                if (input.files.length > 0) {
                    if (input.multiple) {
                        resolve(Array.from(input.files)); // Return all selected files
                    } else {
                        resolve(input.files[0]); // Return the single selected file
                    }
                } else {
                    reject(new DOMException("The user aborted a request.", "AbortError"));
                }
                document.body.removeChild(input); // Clean up
            };

            input.onerror = () => {
                reject(new Error('Error in file input.'));
                document.body.removeChild(input); // Clean up
            };

            // Trigger file selection dialog
            input.click();
        });
    }

    function uploadImg() {
        openFilePicker({ multiple: true })
            .then(async ([file]: any) => {
                let arrayBuffer = await file.arrayBuffer();
                let data = new Uint8Array(arrayBuffer);
                let blob = new Blob([data], { type: file.type });
                let url = URL.createObjectURL(blob);
                setImages(i => [...i, url]);
            })
            .catch(error => {
                console.error(error);
            });
    }

    const handleDrop = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            const files = Array.from(event.dataTransfer.files);
            await processFiles(files);
            event.dataTransfer.clearData();
        }
    }

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
    }

    function processFiles(files) {
        files.forEach(async (file) => {
            let arrayBuffer = await file.arrayBuffer();
            let data = new Uint8Array(arrayBuffer);
            let blob = new Blob([data], { type: file.type });
            let url = URL.createObjectURL(blob);
            setImages(i => [...i, url]);
        });
    }

    return {
        images,
        mainImg,
        imgUrl,
        setImgUrl,
        setMainImg,
        setImages,
        uploadImg,
        handleDrop,
        handleDragOver,
        enlargeMainImg,
        setEnlargeMainImg
    }
}

import React, { useState, useCallback, useContext } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { AppContext } from '../context/AppContext';

interface ImageCropInputProps {
    label: string;
    value: string;
    onValueChange: (newValue: string) => void;
    t: (key: any) => string;
}

// Utility function to create a cropped image
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
        if (!blob) {
            console.error('Canvas is empty');
            return;
        }
      resolve(URL.createObjectURL(blob));
    }, 'image/jpeg');
  });
}

const blobToBase64 = (blobUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        fetch(blobUrl).then(res => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            res.blob().then(blobData => reader.readAsDataURL(blobData));
        });
    });
}


const ImageCropInput: React.FC<ImageCropInputProps> = ({ label, value, onValueChange, t }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImageSrc(reader.result as string);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    const showCroppedImage = useCallback(async () => {
        if (!imageSrc || !croppedAreaPixels) return;
        try {
            const croppedImageBlobUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
            const croppedImageBase64 = await blobToBase64(croppedImageBlobUrl);
            onValueChange(croppedImageBase64);
            URL.revokeObjectURL(croppedImageBlobUrl);
            setImageSrc(null); // Close modal
        } catch (e) {
            console.error(e);
        }
    }, [imageSrc, croppedAreaPixels, onValueChange]);
    

    const closeModal = () => {
        setImageSrc(null);
    };

    return (
        <div>
            <label className="block text-gray-700 font-semibold">{label}</label>
            <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {value && <img src={value} alt="Preview" className="h-24 w-24 object-cover rounded-full mt-2 shadow-sm" />}

            {imageSrc && (
                <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-lg p-4">
                        <h3 className="text-xl font-bold mb-4">{t('students_image_crop_title')}</h3>
                        <div className="relative h-96 w-full bg-gray-200">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>
                        <div className="mt-4">
                           <label className="block text-sm">Zoom</label>
                           <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>
                        <div className="mt-4 flex justify-end gap-4">
                            <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded">{t('cancel')}</button>
                            <button onClick={showCroppedImage} className="bg-blue-600 text-white px-4 py-2 rounded">{t('students_image_crop_button')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageCropInput;

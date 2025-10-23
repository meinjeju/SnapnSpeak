
import React, { useState, useCallback, useRef } from 'react';
import { UploadCloudIcon, SparklesIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';

interface ImageUploaderProps {
    imageFile: File | null;
    setImageFile: (file: File | null) => void;
    onGenerate: () => void;
    isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ imageFile, setImageFile, onGenerate, isLoading }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const file = event.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, [setImageFile]);

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };


    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 flex flex-col items-center">
             <div 
                className="w-full h-64 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-500 cursor-pointer hover:border-sky-500 hover:bg-slate-50 transition-colors relative"
                onClick={triggerFileSelect}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
             >
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
                {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                ) : (
                    <div className="text-center">
                        <UploadCloudIcon className="w-12 h-12 mx-auto text-slate-400" />
                        <p className="mt-2 font-semibold">Click to upload or drag & drop</p>
                        <p className="text-sm">PNG, JPG, or WEBP</p>
                    </div>
                )}
            </div>
            <button
                onClick={onGenerate}
                disabled={!imageFile || isLoading}
                className="mt-6 w-full flex justify-center items-center gap-2 bg-sky-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
                {isLoading ? (
                    <>
                        <LoadingSpinner />
                        Generating...
                    </>
                ) : (
                    <>
                        <SparklesIcon className="w-5 h-5" />
                        Generate Dialogue
                    </>
                )}
            </button>
        </div>
    );
};


import React from 'react';
import { DialogueLine } from '../types';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import LoadingSpinner from './LoadingSpinner';
import { BotMessageSquareIcon, PlayCircleIcon, AlertTriangleIcon } from './icons';

interface DialogueDisplayProps {
    dialogue: DialogueLine[] | null;
    isLoading: boolean;
    error: string | null;
    targetLanguage: string;
}

const DialogueLineComponent: React.FC<{ line: DialogueLine; onPlay: () => void; isSpeaking: boolean }> = ({ line, onPlay, isSpeaking }) => {
    return (
        <div className="flex items-start gap-3 my-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm flex-shrink-0">
                {line.speaker.substring(0, 1)}
            </div>
            <div className="flex-1 bg-slate-100 rounded-lg p-3">
                <p className="font-bold text-slate-700">{line.speaker}</p>
                <p className="text-slate-800">{line.line}</p>
            </div>
            <button 
                onClick={onPlay} 
                className="p-2 text-slate-500 hover:text-sky-500 transition-colors disabled:text-slate-300"
                disabled={isSpeaking}
                aria-label="Read line aloud"
            >
                <PlayCircleIcon className="w-6 h-6" />
            </button>
        </div>
    );
};

export const DialogueDisplay: React.FC<DialogueDisplayProps> = ({ dialogue, isLoading, error, targetLanguage }) => {
    const { speak, isSpeaking } = useTextToSpeech();

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg font-semibold">Creating your lesson...</p>
                    <p className="text-sm">The AI is analyzing the image and writing a dialogue.</p>
                </div>
            );
        }
        if (error) {
            return (
                 <div className="flex flex-col items-center justify-center h-full text-red-500 bg-red-50 p-4 rounded-lg">
                    <AlertTriangleIcon className="w-12 h-12" />
                    <p className="mt-4 text-lg font-bold">Oops! Something went wrong.</p>
                    <p className="text-sm text-center mt-1">{error}</p>
                </div>
            );
        }
        if (dialogue) {
            return (
                <div className="space-y-4">
                    {dialogue.map((line, index) => (
                        <DialogueLineComponent 
                            key={index} 
                            line={line} 
                            onPlay={() => speak(line.line, targetLanguage)}
                            isSpeaking={isSpeaking}
                        />
                    ))}
                </div>
            );
        }
        return (
             <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <BotMessageSquareIcon className="w-16 h-16" />
                <p className="mt-4 text-lg font-semibold">Your dialogue will appear here</p>
                <p className="text-sm text-center">Set your profile, upload an image, and click "Generate Dialogue".</p>
            </div>
        );
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 h-full min-h-[400px]">
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Generated Dialogue</h2>
            <div className="bg-slate-50 p-4 rounded-lg h-full min-h-[300px] flex flex-col">
                {renderContent()}
            </div>
        </div>
    );
};

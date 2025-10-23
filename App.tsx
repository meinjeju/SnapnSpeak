
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SettingsPanel } from './components/SettingsPanel';
import { ImageUploader } from './components/ImageUploader';
import { DialogueDisplay } from './components/DialogueDisplay';
import { generateDialogue } from './services/geminiService';
import { Proficiency, DialogueLine } from './types';
import { LANGUAGES } from './constants';

const App: React.FC = () => {
    const [nativeLanguage, setNativeLanguage] = useState<string>(LANGUAGES[1].code);
    const [targetLanguage, setTargetLanguage] = useState<string>(LANGUAGES[0].code);
    const [age, setAge] = useState<number>(30);
    const [proficiency, setProficiency] = useState<Proficiency>(Proficiency.Beginner);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [dialogue, setDialogue] = useState<DialogueLine[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!imageFile) {
            setError("Please upload an image first.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setDialogue(null);

        // FIX: Moved `reader` from inside `try` block so it can be accessed in `finally`.
        const reader = new FileReader();
        try {
            reader.readAsDataURL(imageFile);
            reader.onloadend = async () => {
                // FIX: Added try-catch block to handle potential errors from `generateDialogue`.
                try {
                    const base64String = (reader.result as string).split(',')[1];
                    if (!base64String) {
                        setError("Could not read the image file.");
                        setIsLoading(false);
                        return;
                    }

                    const nativeLangName = LANGUAGES.find(l => l.code === nativeLanguage)?.name || 'Unknown';
                    const targetLangName = LANGUAGES.find(l => l.code === targetLanguage)?.name || 'Unknown';

                    const result = await generateDialogue(
                        base64String,
                        imageFile.type,
                        nativeLangName,
                        targetLangName,
                        age,
                        proficiency
                    );
                    
                    if (result && result.dialogue) {
                        setDialogue(result.dialogue);
                    } else {
                        setError("Failed to generate a valid dialogue. The response might be empty or malformed.");
                    }
                } catch (e) {
                    console.error(e);
                    setError(e instanceof Error ? e.message : "An unknown error occurred.");
                }
            };
            reader.onerror = () => {
                 setError("Error reading file.");
                 setIsLoading(false);
            }

        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : "An unknown error occurred.");
        } finally {
            // The loading state will be set to false inside the onloadend callback
            // to ensure it waits for the async operation to complete.
            // But we need a fallback for the main try-catch.
            if (reader.readyState !== 1) { // If not loading
                 setIsLoading(false);
            }
        }
    }, [imageFile, nativeLanguage, targetLanguage, age, proficiency]);
    
    // This is to set loading to false after the async reader operation completes
    React.useEffect(() => {
        if (dialogue !== null || error !== null) {
            setIsLoading(false);
        }
    }, [dialogue, error]);


    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Header />
            <main className="flex-grow container mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-8">
                        <SettingsPanel
                            nativeLanguage={nativeLanguage}
                            setNativeLanguage={setNativeLanguage}
                            targetLanguage={targetLanguage}
                            setTargetLanguage={setTargetLanguage}
                            age={age}
                            setAge={setAge}
                            proficiency={proficiency}
                            setProficiency={setProficiency}
                        />
                        <ImageUploader
                            imageFile={imageFile}
                            setImageFile={setImageFile}
                            onGenerate={handleGenerate}
                            isLoading={isLoading}
                        />
                    </div>
                    <div>
                        <DialogueDisplay
                            dialogue={dialogue}
                            isLoading={isLoading}
                            error={error}
                            targetLanguage={targetLanguage}
                        />
                    </div>
                </div>
            </main>
            <footer className="text-center p-4 text-slate-500 text-sm">
                <p>Powered by Gemini. Designed for language learners everywhere.</p>
            </footer>
        </div>
    );
};

export default App;

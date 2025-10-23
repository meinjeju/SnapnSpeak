
import { useState, useCallback, useEffect } from 'react';

export const useTextToSpeech = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    useEffect(() => {
        const handleVoicesChanged = () => {
            setVoices(window.speechSynthesis.getVoices());
        };
        window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
        handleVoicesChanged(); // initial call
        return () => {
            window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        };
    }, []);

    const speak = useCallback((text: string, lang: string) => {
        if (isSpeaking || !text) return;
        
        window.speechSynthesis.cancel(); // Cancel any previous speech

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Find a matching voice
        const bestVoice = voices.find(voice => voice.lang === lang) || voices.find(voice => voice.lang.startsWith(lang.split('-')[0]));
        
        if (bestVoice) {
            utterance.voice = bestVoice;
        }
        utterance.lang = lang;
        utterance.pitch = 1;
        utterance.rate = 0.9;
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [isSpeaking, voices]);

    return { speak, isSpeaking };
};

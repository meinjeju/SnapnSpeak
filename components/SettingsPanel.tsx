
import React from 'react';
import { Proficiency } from '../types';
import { LANGUAGES } from '../constants';
import { SlidersHorizontalIcon, GraduationCapIcon, UserIcon } from './icons';

interface SettingsPanelProps {
    nativeLanguage: string;
    setNativeLanguage: (lang: string) => void;
    targetLanguage: string;
    setTargetLanguage: (lang: string) => void;
    age: number;
    setAge: (age: number) => void;
    proficiency: Proficiency;
    setProficiency: (level: Proficiency) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
    nativeLanguage,
    setNativeLanguage,
    targetLanguage,
    setTargetLanguage,
    age,
    setAge,
    proficiency,
    setProficiency
}) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
                <SlidersHorizontalIcon className="w-6 h-6 text-sky-500" />
                <h2 className="text-2xl font-bold">Your Learning Profile</h2>
            </div>

            <div className="space-y-6">
                {/* Language Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="nativeLang" className="block text-sm font-medium text-slate-600 mb-1">I speak</label>
                        <select
                            id="nativeLang"
                            value={nativeLanguage}
                            onChange={(e) => setNativeLanguage(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        >
                            {LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="targetLang" className="block text-sm font-medium text-slate-600 mb-1">I'm learning</label>
                        <select
                            id="targetLang"
                            value={targetLanguage}
                            onChange={(e) => setTargetLanguage(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        >
                            {LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* Age Slider */}
                <div>
                     <label htmlFor="age" className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-2">
                        <UserIcon className="w-4 h-4" />
                        <span>My Age: <span className="font-bold text-sky-600">{age}</span></span>
                    </label>
                    <input
                        type="range"
                        id="age"
                        min="5"
                        max="100"
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                {/* Proficiency Level */}
                <div>
                     <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-2">
                        <GraduationCapIcon className="w-4 h-4" />
                        <span>Proficiency Level</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {Object.values(Proficiency).map(level => (
                            <button
                                key={level}
                                onClick={() => setProficiency(level)}
                                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                                    proficiency === level
                                        ? 'bg-sky-500 text-white'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

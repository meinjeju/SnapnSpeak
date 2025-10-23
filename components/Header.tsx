
import React from 'react';
import { MessageSquareQuoteIcon } from './icons';

export const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 md:px-8 py-4 flex items-center gap-4">
                 <MessageSquareQuoteIcon className="w-10 h-10 text-sky-500" />
                <h1 className="text-3xl font-bold text-slate-800">Snap & Speak</h1>
            </div>
        </header>
    );
};

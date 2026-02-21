import { Minus, Square, X } from 'lucide-react';
import { getCurrentWindow } from '@tauri-apps/api/window';

export function TitleBar() {
    const handleMinimize = async () => {
        try {
            await getCurrentWindow().minimize();
        } catch (e) {
            console.error('Minimize failed', e);
        }
    };

    const handleMaximize = async () => {
        try {
            await getCurrentWindow().toggleMaximize();
        } catch (e) {
            console.error('Maximize failed', e);
        }
    };

    const handleClose = async () => {
        try {
            await getCurrentWindow().close();
        } catch (e) {
            console.error('Close failed', e);
        }
    };

    return (
        <div className="h-8 select-none flex justify-between items-center fixed top-0 left-0 right-0 z-50 bg-transparent">
            {/* The space on the left is the draggable region; the buttons on the right handle window actions */}
            <div data-tauri-drag-region className="flex-1 h-full"></div>
            <div className="flex h-full shrink-0">
                <button
                    onClick={handleMinimize}
                    className="inline-flex justify-center items-center w-12 h-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                    <Minus className="w-4 h-4 pointer-events-none" />
                </button>
                <button
                    onClick={handleMaximize}
                    className="inline-flex justify-center items-center w-12 h-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                    <Square className="w-3.5 h-3.5 pointer-events-none" />
                </button>
                <button
                    onClick={handleClose}
                    className="inline-flex justify-center items-center w-12 h-full hover:bg-red-500 text-slate-400 hover:text-white transition-colors"
                >
                    <X className="w-4 h-4 pointer-events-none" />
                </button>
            </div>
        </div>
    );
}

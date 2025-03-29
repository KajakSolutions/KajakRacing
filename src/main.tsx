import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App";
import { soundManager } from "./engine//SoundManager.ts"

document.addEventListener('DOMContentLoaded', () => {
    try {
        soundManager.loadSound('background_music', '/sounds/background_music.mp3', {
            category: 'music',
            loop: true,
            volume: 0.5
        });

        soundManager.loadSound('collision', '/sounds/collision.mp3', {
            category: 'sfx',
            volume: 0.7
        });

        soundManager.loadSound('nitro', '/sounds/nitro.mp3', {
            category: 'sfx',
            volume: 0.7
        });
    } catch (error) {
        console.warn("Sound system initialization failed:", error);
    }

    const root = createRoot(document.getElementById("root")!);
    root.render(<App />);
});

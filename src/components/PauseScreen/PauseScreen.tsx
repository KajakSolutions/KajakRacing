import { useState, useEffect } from "react";
import { useGame } from "../../context/GameContext";
import { soundManager } from "../../utils/SoundManager";
import "./pausescreen.scss";

function PauseScreen() {
    const { resumeGame, setGameState } = useGame();
    const [musicVolume, setMusicVolume] = useState(50);
    const [sfxVolume, setSfxVolume] = useState(100);
    const [musicMuted, setMusicMuted] = useState(false);
    const [sfxMuted, setSfxMuted] = useState(false);


    useEffect(() => {
        const savedSettings = localStorage.getItem("audioSettings");
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            setMusicVolume(settings.musicVolume);
            setSfxVolume(settings.sfxVolume);
            setMusicMuted(settings.musicMuted);
            setSfxMuted(settings.sfxMuted);


            applyAudioSettings(settings);
        }
    }, []);


    useEffect(() => {
        const settings = {
            musicVolume,
            sfxVolume,
            musicMuted,
            sfxMuted
        };

        localStorage.setItem("audioSettings", JSON.stringify(settings));


        applyAudioSettings(settings);
    }, [musicVolume, sfxVolume, musicMuted, sfxMuted]);

    const applyAudioSettings = (settings: any) => {

        soundManager.setMusicVolume(settings.musicMuted ? 0 : settings.musicVolume / 100);
        soundManager.setSfxVolume(settings.sfxMuted ? 0 : settings.sfxVolume / 100);

        if (settings.musicMuted && settings.sfxMuted) {
            soundManager.mute();
        } else {
            soundManager.unmute();
        }
    };

    const handleResumeClick = () => {
        resumeGame();
    };

    const handleMenuClick = () => {
        setGameState('MAIN_MENU');
    };

    const toggleMusicMute = () => {
        setMusicMuted(prev => !prev);
    };

    const toggleSfxMute = () => {
        setSfxMuted(prev => !prev);
    };

    return (
        <section className="pause-screen">
            <div className="container">
                <h2>Pauza</h2>

                <div className="music">
                    <label htmlFor="music">Muzyka:</label>
                    <div className="inp-wrapper">
                        <div
                            id="mute"
                            className={musicMuted ? "muted" : ""}
                            onClick={toggleMusicMute}
                        ></div>
                        <input
                            type="range"
                            name="music"
                            id="music"
                            min="0"
                            max="100"
                            value={musicVolume}
                            onChange={(e) => setMusicVolume(parseInt(e.target.value))}
                            disabled={musicMuted}
                        />
                    </div>
                </div>

                <div className="sfx">
                    <label htmlFor="sfx">Efekty:</label>
                    <div className="inp-wrapper">
                        <div
                            id="mute"
                            className={sfxMuted ? "muted" : ""}
                            onClick={toggleSfxMute}
                        ></div>
                        <input
                            type="range"
                            name="sfx"
                            id="sfx"
                            min="0"
                            max="100"
                            value={sfxVolume}
                            onChange={(e) => setSfxVolume(parseInt(e.target.value))}
                            disabled={sfxMuted}
                        />
                    </div>
                </div>

                <button className="resume" onClick={handleResumeClick}>
                    Powrot do gry
                </button>

                <button id="ReturnToMenu" onClick={handleMenuClick}>
                    Powrot do menu
                </button>
            </div>
        </section>
    );
}

export default PauseScreen;

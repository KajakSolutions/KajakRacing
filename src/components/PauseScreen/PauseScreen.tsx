import { useState, useEffect } from "react";
import { useGame } from "../../context/GameContext";
import { soundManager } from "../../utils/SoundManager";
import "./pausescreen.scss";

function PauseScreen() {
    const { resumeGame, exitGame } = useGame();
    const [musicVolume, setMusicVolume] = useState(1);
    const [sfxVolume, setSfxVolume] = useState(100);
    const [masterVolume, setMasterVolume] = useState(100);
    const [masterMuted, setMasterMuted] = useState(false);

    useEffect(() => {
        setMusicVolume(Math.round(soundManager.getMusicVolume() * 100));
        setSfxVolume(Math.round(soundManager.getSfxVolume() * 100));
        setMasterVolume(Math.round(soundManager.getMasterVolume() * 100));
        setMasterMuted(soundManager.isMuted());
    }, []);

    useEffect(() => {
        soundManager.setMusicVolume(musicVolume / 100);
        soundManager.setSfxVolume(sfxVolume / 100);
        soundManager.setMasterVolume(masterVolume / 100);

        if (masterMuted) {
            soundManager.mute();
        } else {
            soundManager.unmute();
        }
    }, [musicVolume, sfxVolume, masterVolume, masterMuted]);

    const handleResumeClick = () => {
        soundManager.play('select');
        resumeGame();
    };

    const handleExitClick = () => {
        soundManager.play('back');
        soundManager.stop('background_music');
        exitGame();
    };

    const toggleMasterMute = () => {
        setMasterMuted(prev => !prev);
        soundManager.play('click');
    };

    return (
        <section className="pause-screen">
            <div className="container">
                <h2>Pauza</h2>

                <div className="master-volume">
                    <label htmlFor="master">Głośność:</label>
                    <div className="inp-wrapper">
                        <div
                            id="mute"
                            className={
                                masterMuted || masterVolume === 0
                                    ? "muted"
                                    : masterVolume < 30
                                        ? "low"
                                        : masterVolume < 75
                                            ? "medium"
                                            : "high"
                            }
                            onClick={toggleMasterMute}
                        ></div>
                        <input
                            type="range"
                            name="master"
                            id="master"
                            min="0"
                            max="100"
                            value={masterVolume}
                            onChange={(e) => setMasterVolume(parseInt(e.target.value))}
                            disabled={masterMuted}
                        />
                    </div>
                </div>

                <div className="music">
                    <label htmlFor="music">Muzyka:</label>
                    <div className="inp-wrapper">
                        <input
                            type="range"
                            name="music"
                            id="music"
                            min="1"
                            max="100"
                            value={musicVolume}
                            onChange={(e) => setMusicVolume(parseInt(e.target.value))}
                            disabled={masterMuted}
                        />
                    </div>
                </div>

                <div className="sfx">
                    <label htmlFor="sfx">Efekty:</label>
                    <div className="inp-wrapper">
                        <input
                            type="range"
                            name="sfx"
                            id="sfx"
                            min="1"
                            max="100"
                            value={sfxVolume}
                            onChange={(e) => setSfxVolume(parseInt(e.target.value))}
                            disabled={masterMuted}
                        />
                    </div>
                </div>

                <button className="resume" onClick={handleResumeClick}>
                    Powrót do gry
                </button>

                <button className="ReturnToMenu" onClick={handleExitClick}>
                    Powrót do menu
                </button>
            </div>
        </section>
    );
}

export default PauseScreen;

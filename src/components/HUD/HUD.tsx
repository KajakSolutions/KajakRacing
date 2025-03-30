import { useEffect } from "react";
import { useGame } from "../../context/GameContext";
import "./HUD.scss";

const HUD = () => {
    const {
        currentPosition,
        currentLap,
        totalLaps,
        bestLapTime,
        lastLapTime,
        isNitroActive,
        activateNitro,
        dropBananaPeel,
        pauseGame,
        bananaPeels,
        maxBananaPeels,
        nitroAmount,
        maxNitro,
        toggleDebugMode
    } = useGame();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                activateNitro();
            } else if (e.code === "Escape") {
                pauseGame();
            } else if (e.code === "KeyB") {
                dropBananaPeel();
            } else if (e.code === "KeyD") {
                toggleDebugMode();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [activateNitro, pauseGame, dropBananaPeel, toggleDebugMode]);

    const formatTime = (timeInMs: number | null): string => {
        if (timeInMs === null) return "--:--.--";

        const totalSeconds = timeInMs / 1000;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        const milliseconds = Math.floor((totalSeconds * 100) % 100);

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="hud">
            <div className="hud-top">
                <div className="position-indicator">
                    <span className="label">POS</span>
                    <span className="value">{currentPosition || '1'}</span>
                </div>

                <div className="lap-indicator">
                    <span className="label">LAP</span>
                    <span className="value">{currentLap || '1'}/{totalLaps || '3'}</span>
                </div>
            </div>

            <div className="hud-bottom">
                <div className="time-display">
                    <div className="lap-time">
                        <span className="label">LAST LAP:</span>
                        <span className="value">{formatTime(lastLapTime)}</span>
                    </div>
                    <div className="lap-time">
                        <span className="label">BEST LAP:</span>
                        <span className="value">{formatTime(bestLapTime)}</span>
                    </div>
                </div>

                <div className="right-panel">
                    <div className="banan-container">
                        <div className="banan">
                            <img className="banan-icon" src="/banan.png" alt="banan"/>
                            <span className="value">{bananaPeels || '0'}/{maxBananaPeels || '3'}</span>
                        </div>
                    </div>
                    <div className="nitro-container">
                        <div className="nitro-icon">
                            <img src="/nitro.png" alt="Nitro:"/>
                        </div>
                        <div className={`nitro-bar ${isNitroActive ? 'active' : ''}`}>
                            <div
                                className="nitro-fill"
                                style={{ width: `${((nitroAmount || 0) / (maxNitro || 100)) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            <button className="pause-button" onClick={pauseGame}>
                II
            </button>
        </div>
    );
};

export default HUD;

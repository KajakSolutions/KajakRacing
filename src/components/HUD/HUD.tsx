
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
        pauseGame
    } = useGame();

    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                activateNitro();
            } else if (e.code === "Escape") {
                pauseGame();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [activateNitro, pauseGame]);

    
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
                    <span className="value">{currentPosition || '-'}</span>
                </div>

                <div className="lap-indicator">
                    <span className="label">LAP</span>
                    <span className="value">{currentLap || '-'}/{totalLaps || '-'}</span>
                </div>
            </div>

            <div className="hud-bottom">
                <div className="time-display">
                    <div className="last-lap">
                        <span className="label">LAST LAP</span>
                        <span className="value">{formatTime(lastLapTime)}</span>
                    </div>

                    <div className="best-lap">
                        <span className="label">BEST LAP</span>
                        <span className="value">{formatTime(bestLapTime)}</span>
                    </div>
                </div>

                <div className={`nitro-indicator ${isNitroActive ? 'active' : ''}`}>
                    <div className="nitro-icon"></div>
                    <div className="nitro-bar">
                        <div className="nitro-fill" style={{ width: isNitroActive ? '100%' : '0%' }}></div>
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

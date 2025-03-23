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
            {/* Top HUD elements */}
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

            {/* Bottom HUD elements */}
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

                {/* Nitro indicator */}
                <div className={"right-panel"}>
                    <div className="fish-container">
                        <div className="fish">
                            <img className="fish-icon" src={"/public/fish.png"} alt={"fish"}/>
                            <span className="value">{/*currentFish ||*/ '0'}/{/*totalFish ||*/ '3'}</span>
                        </div>
                    </div>
                    <div className="nitro-container">
                        <div className="nitro-icon">
                            <img src={"/nitro.png"} alt={"Nitro:"}/>
                        </div>
                        <div className={`nitro-bar ${isNitroActive ? 'active' : ''}`}>
                            <div className="nitro-fill" style={{ width: `100%` }}></div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Pause button */}
            <button className="pause-button" onClick={pauseGame}>
                II
            </button>
        </div>
    );
};

export default HUD;
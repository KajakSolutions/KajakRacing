import { useEffect, useRef, useState } from "react"
import { useGame } from "../../context/GameContext";
import { soundManager } from "../../utils/SoundManager";
import "./leaderboard.scss";

function Leaderboard() {
    const { exitGame, raceResults } = useGame();
    const [prize, setPrize] = useState(0);
    const prizeAddedRef = useRef(false);

    useEffect(() => {
        if (!prizeAddedRef.current) {
            const playerResult = raceResults.find((result) => result.isPlayer);

            if (playerResult) {
                const position = playerResult.position;
                let prizeMoney = 0;

                switch (position) {
                    case 1:
                        prizeMoney = 500;
                        break;
                    case 2:
                        prizeMoney = 300;
                        break;
                    case 3:
                        prizeMoney = 200;
                        break;
                    case 4:
                        prizeMoney = 100;
                        break;
                    default:
                        prizeMoney = 50;
                        break;
                }

                setPrize(prizeMoney);

                const currentBudget = localStorage.getItem("budget");
                if (currentBudget) {
                    const newBudget = parseInt(currentBudget) + prizeMoney;
                    localStorage.setItem("budget", newBudget.toString());

                    prizeAddedRef.current = true;
                }

                const bestLapTime = playerResult.bestLapTime;
                if (bestLapTime) {
                    saveBestLapTime(bestLapTime);
                }
            }
        }
    }, [raceResults]);

    const saveBestLapTime = (newTime: number) => {
        const trackId = localStorage.getItem("currentTrackId") || "track1";

        const savedTimes = localStorage.getItem("trackBestTimes");
        const bestTimes = savedTimes ? JSON.parse(savedTimes) : {};

        if (!bestTimes[trackId] || newTime < bestTimes[trackId]) {
            bestTimes[trackId] = newTime;
            localStorage.setItem("trackBestTimes", JSON.stringify(bestTimes));
        }
    };

    const formatTime = (timeInMs: number): string => {
        const totalSeconds = timeInMs / 1000;
        const seconds = Math.floor(totalSeconds % 60);
        const milliseconds = Math.floor((totalSeconds * 100) % 100);

        return `${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "00")}s`;
    };

    const handleReturnToMenu = () => {
        soundManager.play('back');
        exitGame();
    };

    const getDriverName = (carId: number, isPlayer: boolean): string => {
        if (isPlayer) return "Gracz";

        const aiNames = [
            "Max Speed",
            "Tornado",
            "Diesel",
            "Hot Wheel",
            "Lightning",
        ];
        return aiNames[carId % aiNames.length];
    };

    if (!raceResults || raceResults.length === 0) {
        return (
            <section className="leaderboard">
                <div className="container">
                    <h2>Wyniki Wyścigu</h2>
                    <p>Ładowanie wyników<span className="loading-text">
                    <span className="dot">.</span>
                    <span className="dot">.</span>
                    <span className="dot">.</span>
                </span></p>
                    <button id="ReturnToMenu" onClick={handleReturnToMenu}>
                        Powrót do menu
                    </button>
                </div>
            </section>
        );
    }

    const sortedResults = [...raceResults].sort(
        (a, b) => a.position - b.position
    );

    return (
        <section className="leaderboard">
            <div className="container">
                <h2>Wyniki Wyścigu</h2>

                {sortedResults.map((result, index) => (
                    <div
                        key={`player-${index}`}
                        className={`player-container ${result.isPlayer ? "player" : ""}`}
                    >
                        <p className="place">{result.position}</p>
                        <p className="nick">
                            {getDriverName(result.carId, result.isPlayer)}
                        </p>
                        <p className="time">{formatTime(result.time * 1000)}</p>
                        <div className="img"></div>
                    </div>
                ))}

                <h3>
                    Wygrana: <span>${prize}</span>
                </h3>

                <button id="ReturnToMenu" onClick={handleReturnToMenu}>
                    Powrót do menu
                </button>
            </div>
        </section>
    );
}

export default Leaderboard;

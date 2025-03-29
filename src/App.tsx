import { useEffect } from "react";
import CarSelect from "./components/CarSelect/CarSelect";
import MainScreen from "./components/MainScreen/MainScreen";
import MapSelect from "./components/MapSelect/MapSelect";
import PauseScreen from "./components/PauseScreen/PauseScreen";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import { GameProvider, useGame } from "./context/GameContext";
import HUD from "./components/HUD/HUD";
import { soundManager } from "./utils/SoundManager";
import DevConsole from "./components/DevConsole/DevConsole.tsx"

const GameContainer = () => {
    const {
        gameState,
        isNitroActive,
        loadingProgress,
        loadingMessage
    } = useGame();

    useEffect(() => {
        soundManager.initialize().catch(console.error);
    }, []);

    return (
        <div className={`app ${isNitroActive ? 'nitro-active' : ''}`}>
            {gameState === 'LOADING' && (
                <LoadingScreen progress={loadingProgress} message={loadingMessage} />
            )}

            <div id="game-container" className="game-container">
                {gameState === 'MAIN_MENU' && <MainScreen />}
                {gameState === 'CAR_SELECT' && <CarSelect />}
                {gameState === 'MAP_SELECT' && <MapSelect />}
                {gameState === 'PLAYING' && <HUD />}
                {gameState === 'PAUSED' && <PauseScreen />}
                {gameState === 'RACE_COMPLETE' && <Leaderboard />}
            </div>

            <DevConsole />
        </div>
    );
};

function App() {
    return (
        <GameProvider>
            <GameContainer />
        </GameProvider>
    );
}

export default App;

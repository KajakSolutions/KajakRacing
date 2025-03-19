import CarSelect from "./components/CarSelect/CarSelect";
import MainScreen from "./components/MainScreen/MainScreen";
import MapSelect from "./components/MapSelect/MapSelect";
import PauseScreen from "./components/PauseScreen/PauseScreen";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import { GameProvider, useGame } from "./context/GameContext";
import HUD from "./components/HUD/HUD";

const GameContainer = () => {
    const { gameState, isNitroActive } = useGame();

    return (
        <div className={`app ${isNitroActive ? 'nitro-active' : ''}`}>
            <div id="game-container" className="game-container">
                {gameState === 'MAIN_MENU' && <MainScreen />}
                {gameState === 'CAR_SELECT' && <CarSelect />}
                {gameState === 'MAP_SELECT' && <MapSelect />}
                {gameState === 'PLAYING' && <HUD />}
                {gameState === 'PAUSED' && <PauseScreen />}
                {gameState === 'RACE_COMPLETE' && <Leaderboard />}
            </div>
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

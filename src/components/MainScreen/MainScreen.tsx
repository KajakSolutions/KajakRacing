import { useGame } from "../../context/GameContext";
import { soundManager } from "../../utils/SoundManager";
import "./mainscreen.scss";

function MainScreen() {
    const { setGameState } = useGame();

    const handlePlayClick = () => {
        soundManager.play('select');
        setGameState('CAR_SELECT');
    };

    return (
        <main className="main-screen">
            <h1>Kajak Racing</h1>
            <button onClick={handlePlayClick}>Graj</button>
        </main>
    );
}

export default MainScreen;

import { useEffect } from "react";
import { useGame } from "../../context/GameContext";
import { soundManager } from "../../utils/SoundManager";
import "./mainscreen.scss";

function MainScreen() {
    const { setGameState } = useGame();

    useEffect(() => {
        try {
            soundManager.play('menu_music');
        } catch (error) {
            console.error("Failed to play menu music:", error);
        }
    }, []);

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

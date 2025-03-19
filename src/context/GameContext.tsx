import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { gameEngine, GameState, PlayerCar } from '../engine/GameEngine';
import { RaceResults } from '@kajaksolutions/kajakengine';

interface GameContextData {
    gameState: GameState;
    setGameState: (state: GameState) => void;
    selectCar: (car: PlayerCar) => void;
    selectedCar: PlayerCar | null;
    startGame: (mapPath: string) => Promise<void>;
    pauseGame: () => void;
    resumeGame: () => void;
    raceResults: RaceResults[];
    currentPosition: number | null;
    currentLap: number | null;
    totalLaps: number | null;
    bestLapTime: number | null;
    lastLapTime: number | null;
    activateNitro: () => void;
    isNitroActive: boolean;
}

const GameContext = createContext<GameContextData>({
    gameState: 'MAIN_MENU',
    setGameState: () => {},
    selectCar: () => {},
    selectedCar: null,
    startGame: async () => {},
    pauseGame: () => {},
    resumeGame: () => {},
    raceResults: [],
    currentPosition: null,
    currentLap: null,
    totalLaps: null,
    bestLapTime: null,
    lastLapTime: null,
    activateNitro: () => {},
    isNitroActive: false,
});


interface GameProviderProps {
    children: ReactNode;
}


export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
    const [gameState, setGameState] = useState<GameState>('MAIN_MENU');
    const [selectedCar, setSelectedCar] = useState<PlayerCar | null>(null);
    const [raceResults, setRaceResults] = useState<RaceResults[]>([]);
    const [currentPosition, setCurrentPosition] = useState<number | null>(null);
    const [currentLap, setCurrentLap] = useState<number | null>(null);
    const [totalLaps, setTotalLaps] = useState<number | null>(null);
    const [bestLapTime, setBestLapTime] = useState<number | null>(null);
    const [lastLapTime, setLastLapTime] = useState<number | null>(null);
    const [isNitroActive, setIsNitroActive] = useState<boolean>(false);


    useEffect(() => {
        const savedCar = localStorage.getItem('selectedCar');
        if (savedCar) {
            setSelectedCar(JSON.parse(savedCar));
        }
    }, []);


    useEffect(() => {
        const handleGameStateChange = (state: GameState) => {
            setGameState(state);
        };

        const handleRaceResults = (results: RaceResults[]) => {
            setRaceResults(results);
        };

        const handleLapTime = (lapTime: number, bestLap: number) => {
            setLastLapTime(lapTime);
            setBestLapTime(bestLap);
        };


        gameEngine.addGameStateListener(handleGameStateChange);
        gameEngine.addRaceResultsListener(handleRaceResults);
        gameEngine.addLapTimeListener(handleLapTime);


        let animFrameId: number;

        const updateGameInfo = () => {
            if (gameState === 'PLAYING') {
                setCurrentPosition(gameEngine.getCurrentPosition());
                setCurrentLap(gameEngine.getCurrentLap());
                setTotalLaps(gameEngine.getTotalLaps());
            }

            animFrameId = requestAnimationFrame(updateGameInfo);
        };

        animFrameId = requestAnimationFrame(updateGameInfo);


        return () => {
            gameEngine.removeGameStateListener(handleGameStateChange);
            gameEngine.removeRaceResultsListener(handleRaceResults);
            gameEngine.removeLapTimeListener(handleLapTime);
            cancelAnimationFrame(animFrameId);
        };
    }, [gameState]);


    useEffect(() => {
        const setupCanvas = async () => {
            const canvas = document.createElement('canvas');
            canvas.width = 1280;
            canvas.height = 720;
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.zIndex = '0';


            const gameContainer = document.getElementById('game-container');
            if (gameContainer) {
                gameContainer.appendChild(canvas);


                await gameEngine.initialize(canvas);
            }
        };

        setupCanvas();


        return () => {
            gameEngine.cleanup();
        };
    }, []);


    const selectCar = (car: PlayerCar) => {
        setSelectedCar(car);
        gameEngine.selectCar(car);
    };


    const startGame = async (mapPath: string) => {
        await gameEngine.loadMap(mapPath);
        gameEngine.start();
    };


    const pauseGame = () => {
        gameEngine.pause();
    };


    const resumeGame = () => {
        gameEngine.resume();
    };


    const activateNitro = () => {
        gameEngine.activateNitro();
        setIsNitroActive(true);


        setTimeout(() => {
            setIsNitroActive(false);
        }, 3000);
    };


    const contextValue: GameContextData = {
        gameState,
        setGameState,
        selectCar,
        selectedCar,
        startGame,
        pauseGame,
        resumeGame,
        raceResults,
        currentPosition,
        currentLap,
        totalLaps,
        bestLapTime,
        lastLapTime,
        activateNitro,
        isNitroActive,
    };

    return (
        <GameContext.Provider value={contextValue}>
            {children}
        </GameContext.Provider>
    );
};


export const useGame = () => useContext(GameContext);

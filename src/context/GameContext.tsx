import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { gameEngine, CarData, GameStats, RaceResult } from '../engine/GameEngine';
import { soundManager } from '../utils/SoundManager';

type GameStateType = 'LOADING' | 'MAIN_MENU' | 'CAR_SELECT' | 'MAP_SELECT' | 'PLAYING' | 'PAUSED' | 'RACE_COMPLETE';

export interface Car {
    id: number;
    name: string;
    type: string;
    stats: {
        speed: number;
        nitro: number;
        drive: string;
    };
    color: string;
}

interface GameContextType {
    gameState: GameStateType;
    setGameState: (state: GameStateType) => void;

    selectedCar: Car | null;
    selectCar: (car: Car) => void;

    startGame: (mapPath: string) => Promise<void>;
    pauseGame: () => void;
    resumeGame: () => void;
    exitGame: () => void;

    isNitroActive: boolean;
    activateNitro: () => void;
    dropBananaPeel: () => void;
    toggleDebugMode: () => void;
    executeCommand: (command: string) => string;

    currentPosition: number | null;
    currentLap: number | null;
    totalLaps: number | null;
    bestLapTime: number | null;
    lastLapTime: number | null;
    bananaPeels: number | null;
    maxBananaPeels: number | null;
    nitroAmount: number | null;
    maxNitro: number | null;
    raceResults: RaceResult[];

    loadingProgress: number;
    loadingMessage: string;
}

const GameContext = createContext<GameContextType>({
    gameState: 'MAIN_MENU',
    setGameState: () => {},
    selectedCar: null,
    selectCar: () => {},
    startGame: async () => {},
    pauseGame: () => {},
    resumeGame: () => {},
    exitGame: () => {},
    isNitroActive: false,
    activateNitro: () => {},
    dropBananaPeel: () => {},
    toggleDebugMode: () => {},
    executeCommand: () => '',
    currentPosition: null,
    currentLap: null,
    totalLaps: null,
    bestLapTime: null,
    lastLapTime: null,
    bananaPeels: null,
    maxBananaPeels: null,
    nitroAmount: null,
    maxNitro: null,
    raceResults: [],
    loadingProgress: 0,
    loadingMessage: '',
});

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [gameState, setGameState] = useState<GameStateType>('MAIN_MENU');
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);

    const [isNitroActive, setIsNitroActive] = useState(false);
    const [currentPosition, setCurrentPosition] = useState<number | null>(null);
    const [currentLap, setCurrentLap] = useState<number | null>(null);
    const [totalLaps, setTotalLaps] = useState<number | null>(null);
    const [bestLapTime, setBestLapTime] = useState<number | null>(null);
    const [lastLapTime, setLastLapTime] = useState<number | null>(null);
    const [bananaPeels, setBananaPeels] = useState<number | null>(null);
    const [maxBananaPeels, setMaxBananaPeels] = useState<number | null>(null);
    const [nitroAmount, setNitroAmount] = useState<number | null>(null);
    const [maxNitro, setMaxNitro] = useState<number | null>(null);
    const [raceResults, setRaceResults] = useState<RaceResult[]>([]);

    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState('');

    useEffect(() => {
        soundManager.initialize();

        if (gameState === 'MAIN_MENU') {
            soundManager.play('menu_music');
        }
    }, []);

    useEffect(() => {
        if (gameState === 'MAIN_MENU') {
            resetGameStats();
            soundManager.play('menu_music');
        }

        if (gameState === 'PAUSED') {
            gameEngine.pause();
        }

        if (gameState === 'PLAYING') {
            gameEngine.resume();
        }

        if (gameState === 'RACE_COMPLETE') {
            gameEngine.pause();
        }
    }, [gameState]);

    const selectCar = (car: Car) => {
        setSelectedCar(car);
        soundManager.play('select');
    };

    const resetGameStats = () => {
        setIsNitroActive(false);
        setCurrentPosition(null);
        setCurrentLap(null);
        setTotalLaps(null);
        setBestLapTime(null);
        setLastLapTime(null);
        setBananaPeels(null);
        setMaxBananaPeels(null);
        setNitroAmount(null);
        setMaxNitro(null);
        setRaceResults([]);
    };

    const startGame = async (mapPath: string) => {
        if (!selectedCar) return;

        try {
            setGameState('LOADING');
            setLoadingProgress(0);
            setLoadingMessage('Initializing...');

            soundManager.stop('menu_music');
            soundManager.stop('background_music');

            gameEngine.onStatsUpdate((stats: GameStats) => {
                setCurrentPosition(stats.position);
                setCurrentLap(stats.currentLap);
                setTotalLaps(stats.totalLaps);
                setBestLapTime(stats.bestLapTime);
                setLastLapTime(stats.lastLapTime);
                setIsNitroActive(stats.isNitroActive);
                setBananaPeels(stats.bananaPeels);
                setMaxBananaPeels(stats.maxBananaPeels);
                setNitroAmount(stats.nitroAmount);
                setMaxNitro(stats.maxNitro);
            });

            gameEngine.onRaceComplete((results: RaceResult[]) => {
                setRaceResults(results);
                setGameState('RACE_COMPLETE');
                soundManager.play('finish');
            });

            setLoadingProgress(10);
            setLoadingMessage('Loading map...');

            await gameEngine.init(mapPath, selectedCar as CarData);

            setLoadingProgress(80);
            setLoadingMessage('Starting game...');

            gameEngine.start();

            setLoadingProgress(100);
            setGameState('PLAYING');

            soundManager.play('start');
            soundManager.play('background_music');
        } catch (error) {
            console.error('Failed to start game:', error);

            setGameState('MAP_SELECT');

            soundManager.play('menu_music');
        }
    };

    const pauseGame = () => {
        setGameState('PAUSED');
        soundManager.play('pause');
    };

    const resumeGame = () => {
        setGameState('PLAYING');
        soundManager.play('resume');
    };

    const exitGame = () => {
        gameEngine.stop();
        resetGameStats();
        setGameState('MAIN_MENU');

        soundManager.stop('background_music');

        soundManager.play('menu_music');
    };

    const activateNitro = () => {
        gameEngine.activateNitro();
    };

    const dropBananaPeel = () => {
        gameEngine.dropBananaPeel();
    };

    const toggleDebugMode = () => {
        gameEngine.toggleDebugMode();
    };

    const executeCommand = (command: string): string => {
        try {
            return gameEngine.executeCommand(command);
        } catch (error) {
            console.error('Błąd wykonania polecenia:', error);
            return `Błąd: ${error instanceof Error ? error.message : 'Nieznany błąd'}`;
        }
    };

    return (
        <GameContext.Provider
            value={{
                gameState,
                setGameState,
                selectedCar,
                selectCar,
                startGame,
                pauseGame,
                resumeGame,
                exitGame,
                isNitroActive,
                activateNitro,
                dropBananaPeel,
                toggleDebugMode,
                executeCommand,
                currentPosition,
                currentLap,
                totalLaps,
                bestLapTime,
                lastLapTime,
                bananaPeels,
                maxBananaPeels,
                nitroAmount,
                maxNitro,
                raceResults,
                loadingProgress,
                loadingMessage,
            }}
        >
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => useContext(GameContext);

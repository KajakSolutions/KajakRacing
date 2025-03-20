import {
    KajakEngine,
    Scene,
    CarObject,
    MapLoader,
    CheckpointObject,
    RaceManager,
    RaceResults
} from '@kajaksolutions/kajakengine';
import { soundManager } from "../utils/SoundManager.ts"

export type CarStats = {
    speed: number;
    nitro: number;
    drive: string;
};

export type PlayerCar = {
    id: number;
    name: string;
    image: string;
    stats: CarStats;
    color?: string;
};

export type GameState = 'MAIN_MENU' | 'CAR_SELECT' | 'MAP_SELECT' | 'PLAYING' | 'PAUSED' | 'RACE_COMPLETE';

export class GameEngine {
    private engine: KajakEngine | null = null;
    private canvas: HTMLCanvasElement | null = null;
    private currentScene: Scene | null = null;
    private playerCar: CarObject | null = null;
    private raceManager: RaceManager | null = null;
    private nitroActive: boolean = false;
    private nitroTimer: number | null = null;
    private baseSpeed: number = 0;
    private selectedCar: PlayerCar | null = null;
    private mapPath: string = '';
    private gameStateListeners: ((state: GameState) => void)[] = [];
    private gameState: GameState = 'MAIN_MENU';
    private raceResultsListeners: ((results: RaceResults[]) => void)[] = [];
    private lapTimeListeners: ((lapTime: number, bestLap: number) => void)[] = [];
    private isDriving: boolean = false;

    public async initialize(canvasElement: HTMLCanvasElement): Promise<void> {
        this.canvas = canvasElement;
        this.engine = new KajakEngine(canvasElement);


        this.loadPlayerData();

        document.addEventListener("keydown", this.handleKeyDown.bind(this));
        document.addEventListener("keyup", this.handleKeyUp.bind(this));
    }

    private loadPlayerData(): void {
        const savedCar = localStorage.getItem('selectedCar');
        if (savedCar) {
            this.selectedCar = JSON.parse(savedCar);
        }
    }

    private setupCollisionHandling(): void {
        if (!this.playerCar) return;


        const originalOnCollision = this.playerCar.onCollision;

        this.playerCar.onCollision = (other, collisionInfo) => {

            originalOnCollision.call(this.playerCar, other, collisionInfo);


            soundManager.playCollisionSound();
        };
    }

    public savePlayerData(): void {
        if (this.selectedCar) {
            localStorage.setItem('selectedCar', JSON.stringify(this.selectedCar));
        }
    }

    public async loadMap(mapPath: string): Promise<void> {
        if (!this.engine) return;

        this.mapPath = mapPath;
        try {
            this.currentScene = await MapLoader.loadMap(mapPath);

            if (this.currentScene) {

                this.raceManager = this.currentScene.raceManager;


                for (const obj of this.currentScene.gameObjects.values()) {
                    if (obj instanceof CarObject && obj.isPlayer) {
                        this.playerCar = obj;


                        if (this.selectedCar) {
                            this.applyCarStats(this.playerCar, this.selectedCar.stats);
                        }


                        this.setupCollisionHandling();

                        break;
                    }
                }

                this.engine.scenes.set(1, this.currentScene);
                this.engine.setCurrentScene(1);


                if (this.raceManager) {

                    this.raceManager.onLapCompleted = (car, lap, lapTime, bestLap) => {
                        if (car.isPlayer) {
                            this.notifyLapTimeListeners(lapTime, bestLap);
                        }
                    };


                    this.raceManager.onRaceFinished = (results) => {
                        this.setGameState('RACE_COMPLETE');
                        this.notifyRaceResultsListeners(results);
                    };
                }
            }
        } catch (error) {
            console.error("Error loading map:", error);
        }
    }

    private applyCarStats(car: CarObject, stats: CarStats): void {

        this.baseSpeed = 183.91 + (stats.speed - 3) * 20;


        if (stats.drive === 'FWD') {


        } else if (stats.drive === 'RWD') {


        } else if (stats.drive === '4WD') {


        }
    }

    public start(): void {
        if (this.engine) {
            this.engine.start();
            this.setGameState('PLAYING');


            this.updateEngineSound(0.2);


            soundManager.play('background_music');
        }
    }

    public pause(): void {
        if (this.engine) {
            this.engine.stop();
            this.setGameState('PAUSED');


            soundManager.pause('engine');


            soundManager.pause('background_music');
        }
    }

    public resume(): void {
        if (this.engine) {
            this.engine.start();
            this.setGameState('PLAYING');


            this.updateEngineSound(0.2);


            soundManager.resume('background_music');
        }
    }

    public selectCar(car: PlayerCar): void {
        this.selectedCar = car;
        this.savePlayerData();
    }

    public activateNitro(): void {
        if (!this.playerCar || this.nitroActive || !this.selectedCar) return;

        this.nitroActive = true;
        const nitroBoost = this.selectedCar.stats.nitro * 75;

        this.playerCar.setThrottle(this.baseSpeed + nitroBoost);


        soundManager.playNitroSound();


        if (this.nitroTimer !== null) {
            clearTimeout(this.nitroTimer);
        }


        this.nitroTimer = window.setTimeout(() => {
            this.deactivateNitro();
        }, 3000);
    }

    private deactivateNitro(): void {
        if (!this.playerCar) return;

        this.nitroActive = false;
        this.playerCar.setThrottle(this.isDriving ? this.baseSpeed : 0);
        this.nitroTimer = null;
    }

    private handleKeyDown(e: KeyboardEvent): void {
        if (this.gameState !== 'PLAYING' || !this.playerCar) return;

        switch (e.key) {
            case "ArrowUp":
                this.playerCar.setThrottle(this.baseSpeed);
                this.isDriving = true;

                this.updateEngineSound(1.0);
                break;
            case "ArrowDown":
                this.playerCar.setThrottle(-30);

                this.updateEngineSound(0.3);
                break;
            case "ArrowLeft":
                this.playerCar.setSteerAngle(-Math.PI / 4);
                break;
            case "ArrowRight":
                this.playerCar.setSteerAngle(Math.PI / 4);
                break;
            case " ":
                this.activateNitro();
                break;
            case "Escape":
                this.pause();
                break;
        }
    }

    private updateEngineSound(throttleLevel: number): void {
        if (!this.playerCar) return;


        const speed = this.playerCar.velocity ? Math.sqrt(
            this.playerCar.velocity.x * this.playerCar.velocity.x +
            this.playerCar.velocity.y * this.playerCar.velocity.y
        ) : 0;


        const normalizedSpeed = Math.min(speed / this.baseSpeed, 1);


        const revLevel = 0.5 * throttleLevel + 0.5 * normalizedSpeed;


        soundManager.playEngineSound(revLevel);
    }

    private handleKeyUp(e: KeyboardEvent): void {
        if (this.gameState !== 'PLAYING' || !this.playerCar) return;

        switch (e.key) {
            case "ArrowUp":
            case "ArrowDown":
                this.playerCar.setThrottle(0);

                this.isDriving = false;

                this.updateEngineSound(0.2);
                break;
            case "ArrowLeft":
            case "ArrowRight":
                this.playerCar.setSteerAngle(0);
                break;
        }
    }

    public setDebugMode(enabled: boolean): void {
        if (this.engine) {
            this.engine.setDebugMode(enabled);
        }
    }

    public addGameStateListener(listener: (state: GameState) => void): void {
        this.gameStateListeners.push(listener);
    }

    public removeGameStateListener(listener: (state: GameState) => void): void {
        this.gameStateListeners = this.gameStateListeners.filter(l => l !== listener);
    }

    public addRaceResultsListener(listener: (results: RaceResults[]) => void): void {
        this.raceResultsListeners.push(listener);
    }

    public removeRaceResultsListener(listener: (results: RaceResults[]) => void): void {
        this.raceResultsListeners = this.raceResultsListeners.filter(l => l !== listener);
    }

    public addLapTimeListener(listener: (lapTime: number, bestLap: number) => void): void {
        this.lapTimeListeners.push(listener);
    }

    public removeLapTimeListener(listener: (lapTime: number, bestLap: number) => void): void {
        this.lapTimeListeners = this.lapTimeListeners.filter(l => l !== listener);
    }

    private setGameState(state: GameState): void {
        this.gameState = state;
        this.notifyGameStateListeners();
    }

    private notifyGameStateListeners(): void {
        this.gameStateListeners.forEach(listener => {
            listener(this.gameState);
        });
    }

    private notifyRaceResultsListeners(results: RaceResults[]): void {
        this.raceResultsListeners.forEach(listener => {
            listener(results);
        });
    }

    private notifyLapTimeListeners(lapTime: number, bestLap: number): void {
        this.lapTimeListeners.forEach(listener => {
            listener(lapTime, bestLap);
        });
    }

    public getGameState(): GameState {
        return this.gameState;
    }

    public getCurrentPosition(): number | null {
        if (!this.raceManager || !this.playerCar) return null;









        return 1;

        return null;
    }

    public getCurrentLap(): number | null {
        if (!this.raceManager || !this.playerCar) return null;

        const progress = this.raceManager.getCarProgress(this.playerCar.id);
        return progress ? progress.currentLap + 1 : null;
    }

    public getTotalLaps(): number | null {
        if (!this.raceManager) return null;

        return this.raceManager.config.totalLaps;
    }

    public cleanup(): void {

        document.removeEventListener("keydown", this.handleKeyDown.bind(this));
        document.removeEventListener("keyup", this.handleKeyUp.bind(this));


        if (this.nitroTimer !== null) {
            clearTimeout(this.nitroTimer);
        }


        soundManager.stopEngineSound();
        soundManager.stop('background_music');


        this.gameStateListeners = [];
        this.raceResultsListeners = [];
        this.lapTimeListeners = [];
    }
}


export const gameEngine = new GameEngine();

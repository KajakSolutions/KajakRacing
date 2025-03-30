import {CarObject, CheckpointObject, KajakEngine, Overlap, Scene,} from "./index";
import {MapLoader} from "./MapLoader.ts";
import {soundManager} from "./SoundManager.ts";
import {TrackSurfaceSegment} from "./objects/TrackSurfaceSegment.ts";
import {ObstacleManager} from "./objects/ObstacleManager.ts";
import {ItemManager} from "./objects/ItemManager.ts";
import {WeatherSystem, WeatherType} from "./objects/WeatherSystem.ts";

export interface CarData {
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

export interface GameStats {
    position: number;
    currentLap: number;
    totalLaps: number;
    bestLapTime: number | null;
    lastLapTime: number | null;
    isNitroActive: boolean;
    bananaPeels: number;
    maxBananaPeels: number;
    nitroAmount: number;
    maxNitro: number;
}

export interface RaceResult {
    position: number;
    time: number;
    isPlayer: boolean;
    carId: number;
    laps: number;
    bestLapTime: number;
}

class GameEngine {
    private engine: KajakEngine | null = null;
    private currentScene: Scene | null = null;
    private debugState: boolean = false;
    private audioInitialized: boolean = false;
    private obstacleManager: ObstacleManager | null = null;
    private itemManager: ItemManager | null = null;
    private weatherSystem: WeatherSystem | null = null;
    private canvas: HTMLCanvasElement | null = null;
    private selectedCar: CarData | null = null;
    private statsInterval: number | null = null;

    private speedMultiplier: number = 1;
    private nitroValue: number = 0;

    private onStatsUpdateCallback: ((stats: GameStats) => void) | null = null;
    private onRaceCompleteCallback: ((results: RaceResult[]) => void) | null = null;

    constructor() {}

    public async init(mapPath: string, carData: CarData): Promise<void> {
        this.selectedCar = carData;

        this.createCanvas();

        this.engine = new KajakEngine(this.canvas!);

        try {
            await this.loadMap(mapPath);

            await this.initializeAudio();

            this.setupGameSystems();

            this.setupEventListeners();

            this.startStatsUpdate();
        } catch (error) {
            console.error("Failed to initialize game:", error);
            throw error;
        }
    }

    public start(): void {
        if (!this.engine) return;
        this.engine.start();
    }

    public pause(): void {
        if (!this.engine) return;
        this.engine.stop();
    }

    public resume(): void {
        if (!this.engine) return;
        this.engine.start();
    }

    public stop(): void {
        if (this.statsInterval) {
            window.clearInterval(this.statsInterval);
            this.statsInterval = null;
        }

        if (this.engine) {
            this.engine.stop();
        }

        this.removeCanvas();

        this.engine = null;
        this.currentScene = null;
        this.obstacleManager = null;
        this.itemManager = null;
        this.weatherSystem = null;
    }

    public setDebugMode(enabled: boolean): void {
        this.debugState = enabled;
        if (this.engine) {
            this.engine.setDebugMode(enabled);
        }
    }

    public toggleDebugMode(): void {
        this.setDebugMode(!this.debugState);
    }

    public isDebugMode(): boolean {
        return this.debugState;
    }

    public executeCommand(commandStr: string): string {
        const parts = commandStr.trim().split(/\s+/);
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        switch (command) {
            case 'debug':
                this.toggleDebugMode();
                return `Tryb debugowania ${this.debugState ? 'włączony' : 'wyłączony'}`;

            case 'tp':
                return this.commandTeleport(args);

            case 'nitro':
                return this.commandNitro(args);

            case 'weather':
                return this.commandWeather(args);

            case 'fps':
                return 'Polecenie fps nie jest jeszcze zaimplementowane';

            case 'banana':
                return this.commandBanana(args);

            case 'god':
                return this.commandGodMode();

            case 'spawn':
                return this.commandSpawn(args);

            default:
                return `Nieznane polecenie: ${command}. Wpisz 'help' aby zobaczyć dostępne polecenia.`;
        }
    }

    private commandTeleport(args: string[]): string {
        if (args.length < 2) {
            return 'Użycie: tp [x] [y]';
        }

        const x = parseFloat(args[0]);
        const y = parseFloat(args[1]);

        if (isNaN(x) || isNaN(y)) {
            return 'Błędne koordynaty. Użycie: tp [x] [y]';
        }

        const playerCar = this.findPlayerCar();
        if (!playerCar) {
            return 'Nie znaleziono pojazdu gracza';
        }

        playerCar.position = { x, y };
        return `Teleportowano do pozycji (${x}, ${y})`;
    }

    private commandNitro(args: string[]): string {
        const playerCar = this.findPlayerCar();
        if (!playerCar) {
            return 'Nie znaleziono pojazdu gracza';
        }

        if (args.length < 1) {
            return `Obecna ilość nitro: ${playerCar.nitroAmount}`;
        }

        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount < 0) {
            return 'Nieprawidłowa ilość nitro. Podaj liczbę większą od 0.';
        }

        playerCar.refillNitro(amount * this.nitroValue);
        return `Ustawiono nitro na ${amount * this.nitroValue}`;
    }

    private commandWeather(args: string[]): string {
        if (!this.weatherSystem || !this.currentScene) {
            return 'System pogodowy nie jest dostępny';
        }

        if (args.length < 1) {
            return `Obecna pogoda: ${this.weatherSystem.getCurrentWeather()}`;
        }

        const weatherType = args[0].toUpperCase();
        if (!['CLEAR', 'RAIN', 'SNOW'].includes(weatherType)) {
            return 'Nieprawidłowy typ pogody. Dostępne opcje: clear, rain, snow';
        }

        const weatherEnum = WeatherType[weatherType as keyof typeof WeatherType];
        this.weatherSystem.forceWeather(weatherEnum);

        return `Zmieniono pogodę na ${weatherType}`;
    }

    private commandBanana(args: string[]): string {
        const playerCar = this.findPlayerCar();
        if (!playerCar) {
            return 'Nie znaleziono pojazdu gracza';
        }

        const amount = args.length > 0 ? parseInt(args[0]) : 1;
        if (isNaN(amount) || amount < 0) {
            return 'Nieprawidłowa ilość bananów. Podaj liczbę większą od 0.';
        }

        for (let i = 0; i < amount; i++) {
            playerCar.collectBananaPeel();
        }

        return `Dodano ${amount} bananów. Obecna ilość: ${playerCar.bananaPeels}/${playerCar.maxBananaPeels}`;
    }

    private commandGodMode(): string {
        return 'Polecenie god nie jest jeszcze zaimplementowane, może w przyszłości...';
    }

    private commandSpawn(args: string[]): string {
        if (args.length < 1) {
            return 'Użycie: spawn [item]';
        }

        const item = args[0].toLowerCase();

        switch (item) {
            case 'banana': {
                const car = this.findPlayerCar();
                if (!car) {
                    return 'Nie znaleziono pojazdu gracza';
                }

                if (this.obstacleManager) {
                    const pos = { x: car.position.x + 3, y: car.position.y };
                    this.obstacleManager.createObstacle('bananaPeel', pos, -1);
                    return 'Stworzono banana';
                }
                return 'Nie można stworzyć banana';
            }

            default:
                return `Nieznany przedmiot: ${item}`;
        }
    }

    private findPlayerCar(): CarObject | null {
        if (!this.currentScene) return null;

        for (const obj of this.currentScene.gameObjects.values()) {
            if (obj instanceof CarObject && obj.isPlayer) {
                return obj;
            }
        }

        return null;
    }

    public activateNitro(): void {
        const playerCar = this.findPlayerCar();
        if (playerCar) {
            playerCar.activateNitro();
        }
    }

    public dropBananaPeel(): void {
        if (!this.obstacleManager) return;

        const playerCar = this.findPlayerCar();
        if (!playerCar) return;

        if (playerCar.useBananaPeel()) {
            const carAngle = playerCar.rotation;
            const dropDistance = -3;
            const dropX = playerCar.position.x - Math.sin(carAngle) * dropDistance;
            const dropY = playerCar.position.y - Math.cos(carAngle) * dropDistance;

            this.obstacleManager.createObstacle('bananaPeel', { x: dropX, y: dropY }, playerCar.id);
        }
    }

    public onStatsUpdate(callback: (stats: GameStats) => void): void {
        this.onStatsUpdateCallback = callback;
    }

    public onRaceComplete(callback: (results: RaceResult[]) => void): void {
        this.onRaceCompleteCallback = callback;
    }

    private createCanvas(): void {
        this.removeCanvas();

        this.canvas = document.createElement('canvas');
        const container = document.getElementById('game-container');
        if (container) {
            container.appendChild(this.canvas);
        } else {
            console.error('Game container not found');
        }
    }

    private removeCanvas(): void {
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
            this.canvas = null;
        }

        const secondBackground = document.getElementById('secondBackground');
        if (!secondBackground) return;

        secondBackground.remove();
    }

    private async loadMap(mapPath: string): Promise<void> {
        try {
            this.currentScene = await MapLoader.loadMap(mapPath);

            if (!this.engine || !this.currentScene) {
                throw new Error("Engine or scene not initialized");
            }

            this.engine.scenes.set(1, this.currentScene);
            this.engine.setCurrentScene(1);

            this.setupCollisions(this.currentScene);

            if (this.selectedCar) {
                this.customizePlayerCar();
            }
        } catch (error) {
            console.error("Error loading map:", error);
            throw error;
        }
    }

    private setupCollisions(scene: Scene): void {
        const cars = Array.from(scene.gameObjects.values())
            .filter(obj => obj instanceof CarObject) as CarObject[];

        const checkpoints = Array.from(scene.gameObjects.values())
            .filter(obj => obj instanceof CheckpointObject) as CheckpointObject[];

        const barriers = Array.from(scene.gameObjects.values())
            .filter(obj => !(obj instanceof CarObject) &&
                !(obj instanceof CheckpointObject) &&
                !(obj instanceof TrackSurfaceSegment));

        for (let i = 0; i < cars.length; i++) {
            for (let j = i + 1; j < cars.length; j++) {
                const overlap = new Overlap(
                    cars[i],
                    cars[j],
                    (car1, car2, collisionInfo) => {
                        if (collisionInfo) {
                            car1.onCollision(car2, collisionInfo);
                        }
                    },
                    { customCollisionHandler: true }
                );
                scene.overlapManager.addOverlap(overlap);
            }
        }

        for (const car of cars) {
            for (const checkpoint of checkpoints) {
                const overlap = new Overlap(
                    car,
                    checkpoint,
                    (vehicle, checkpointObj) => {
                        if (checkpointObj instanceof CheckpointObject) {
                            if (vehicle instanceof CarObject && vehicle.isPlayer && !checkpointObj.isActivated) {
                                checkpointObj.activate(vehicle);
                                checkpointObj.spriteManager!.hidden = true;
                            }
                        }
                    }
                );
                scene.overlapManager.addOverlap(overlap);
            }
        }

        for (const car of cars) {
            for (const barrier of barriers) {
                const overlap = new Overlap(
                    car,
                    barrier,
                    (vehicle, staticObj, collisionInfo) => {
                        if (collisionInfo) {
                            vehicle.onCollision(staticObj, collisionInfo);
                        }
                    },
                    { customCollisionHandler: true }
                );
                scene.overlapManager.addOverlap(overlap);
            }
        }
    }

    private async initializeAudio(): Promise<void> {
        if (this.audioInitialized) return;

        const playerCar = this.findPlayerCar();
        if (playerCar && playerCar.soundSystem) {
            await playerCar.soundSystem.initialize();
        }

        await soundManager.loadSound('background_music', '/sounds/background.mp3', {
            loop: true,
            volume: 0.5,
            category: 'music'
        });

        soundManager.play('background_music');

        this.audioInitialized = true;
    }

    private setupGameSystems(): void {
        if (!this.currentScene) return;

        this.obstacleManager = new ObstacleManager(this.currentScene, {
            maxActiveObstacles: 15,
            bananaPeelLifespan: 30000
        });

        this.itemManager = new ItemManager(this.currentScene, {
            maxItems: 8,
            itemRespawnTime: 15000,
            spawnInterval: 10000
        });
        this.itemManager.startItemSpawning();
    }

    private customizePlayerCar(): void {
        if (!this.selectedCar) return;

        const playerCar = this.findPlayerCar();
        if (!playerCar) return;

        this.speedMultiplier = 1.6   + (this.selectedCar.stats.speed * 0.4);

        playerCar.nitroStrength = 1 + (this.selectedCar.stats.nitro * 0.5);

        const driveTrainMap: Record<string, number> = {
            'FWD': 2,
            'RWD': 0,
            '4WD': 1
        };

        if (this.selectedCar.stats.drive && driveTrainMap[this.selectedCar.stats.drive] !== undefined) {

            playerCar.driveTrain = driveTrainMap[this.selectedCar.stats.drive];
            console.log(`Ustawiono napęd ${this.selectedCar.stats.drive} (${driveTrainMap[this.selectedCar.stats.drive]}) dla pojazdu gracza`);
        }

        if (playerCar.spriteManager) {
            const spritePath = `/cars/${this.selectedCar.type}/${this.selectedCar.color}/sprites.png`;

            playerCar.spriteManager.updateSpriteSheet(spritePath);

            console.log(`Ustawiono sprite sheet ${spritePath} dla pojazdu gracza`);
        }
    }

    private setupEventListeners(): void {
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    private handleKeyDown(e: KeyboardEvent): void {
        const playerCar = this.findPlayerCar();
        if (!playerCar) return;

        switch (e.key) {
            case "ArrowUp":
                playerCar.setThrottle(45 * this.speedMultiplier);
                break;
            case "ArrowDown":
                playerCar.setThrottle(-30);
                break;
            case "ArrowLeft":
                playerCar.setSteerAngle(-Math.PI / 2);
                break;
            case "ArrowRight":
                playerCar.setSteerAngle(Math.PI / 2);
                break;
            case " ":
                this.activateNitro();
                break;
            case "b":
                this.dropBananaPeel();
                break;
            case "d":
                this.toggleDebugMode();
                break;
        }
    }

    private handleKeyUp(e: KeyboardEvent): void {
        const playerCar = this.findPlayerCar();
        if (!playerCar) return;

        switch (e.key) {
            case "ArrowUp":
            case "ArrowDown":
                playerCar.setThrottle(0);
                break;
            case "ArrowLeft":
            case "ArrowRight":
                playerCar.setSteerAngle(0);
                break;
        }
    }

    private startStatsUpdate(): void {
        this.statsInterval = window.setInterval(() => {
            this.updateGameStats();
        }, 100);
    }

    private updateGameStats(): void {
        if (!this.currentScene || !this.onStatsUpdateCallback) return;

        const playerCar = this.findPlayerCar();
        if (!playerCar) return;

        const raceManager = this.currentScene.raceManager;
        const progress = raceManager.getCarProgress(playerCar.id);

        if (!progress) return;

        let position = 1;
        for (const [carId, car] of this.currentScene.gameObjects.entries()) {
            if (!(car instanceof CarObject) || car.id === playerCar.id) continue;

            const carProgress = raceManager.getCarProgress(carId);
            if (!carProgress) continue;

            if (carProgress.currentLap > progress.currentLap ||
                (carProgress.currentLap === progress.currentLap &&
                    carProgress.lastCheckpoint > progress.lastCheckpoint)) {
                position++;
            }
        }

        const stats: GameStats = {
            position,
            currentLap: progress.currentLap + 1,
            totalLaps: raceManager.config.totalLaps,
            bestLapTime: progress.bestLapTime !== Infinity ? progress.bestLapTime : null,
            lastLapTime: progress.lapTimes.length > 0 ? progress.lapTimes[progress.lapTimes.length - 1] : null,
            isNitroActive:playerCar.nitroActive,
            bananaPeels: playerCar.bananaPeels,
            maxBananaPeels: playerCar.maxBananaPeels,
            nitroAmount: playerCar.nitroAmount,
            maxNitro: playerCar.maxNitro
        };

        this.onStatsUpdateCallback(stats);

        if (raceManager.isRaceFinished && this.onRaceCompleteCallback) {
            this.onRaceCompleteCallback(this.getRaceResults());
        }
    }

    private getRaceResults(): RaceResult[] {
        if (!this.currentScene) return [];

        const raceManager = this.currentScene.raceManager;
        return raceManager.results.map(result => ({
            position: result.position,
            time: result.time,
            isPlayer: result.isPlayer,
            carId: result.carId,
            laps: result.laps,
            bestLapTime: result.bestLapTime
        }));
    }
}

// singleton instance
export const gameEngine = new GameEngine();

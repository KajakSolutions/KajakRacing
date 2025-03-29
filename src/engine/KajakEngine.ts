import Scene from "./Scene.ts"

export default class KajakEngine {
    private _scenes: Map<number, Scene> = new Map()
    private _currentScene: Scene | null = null
    private readonly _ctx: CanvasRenderingContext2D
    private readonly _canvas: HTMLCanvasElement
    private _lastTimestamp: number = 0
    private _running: boolean = false

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas
        canvas.width = 1280
        canvas.height = 720

        const ctx = this._canvas.getContext("2d")
        if (!ctx) throw new Error("Unable to get 2d context from canvas")
        this._ctx = ctx

        this.gameLoop = this.gameLoop.bind(this)
    }

    get currentScene(): Scene | null {
        return this._currentScene
    }

    get ctx(): CanvasRenderingContext2D {
        return this._ctx
    }

    get scenes(): Map<number, Scene> {
        return this._scenes
    }

    setDebugMode(debugMode: boolean): void {
        if (!this._currentScene) return
        this._currentScene.debugMode = debugMode
    }

    setCurrentScene(sceneId: number): void {
        const scene = this._scenes.get(sceneId)
        if (scene) {
            this._currentScene = scene
            this._canvas.style.cssText = `
            background: rgba(0, 0, 0, 1);
            background-size: cover;
        `
            this._canvas.style.backgroundImage = `url(${this._currentScene.map.backgroundSrc})`

            this._canvas.style.imageRendering = "pixelated";

            if(this._currentScene.map.secondBackgroundSrc) {
                const img = document.createElement("img");
                img.setAttribute("id", "secondBackground");
                img.src = this._currentScene.map.secondBackgroundSrc;
                this._canvas.parentElement!.appendChild(img);
            }
        }
    }

    start(): void {
        if (!this._running) {
            this._running = true
            this._lastTimestamp = performance.now()
            requestAnimationFrame(this.gameLoop)
        }
    }

    stop(): void {
        this._running = false
    }

    private gameLoop(timestamp: number): void {
        if (!this._running) return

        const deltaTime = (timestamp - this._lastTimestamp) / 1000
        this._lastTimestamp = timestamp

        if (this._currentScene) {
            this._currentScene.update(deltaTime)

            this._currentScene.draw(this._ctx)
        }

        requestAnimationFrame(this.gameLoop)
    }
}

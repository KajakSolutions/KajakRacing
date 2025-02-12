// import Header from "./components/Header/Header"
// import CarStats from "./components/CarStats/CarStats"
// import Slider from "./components/Slider/Slider"
import {
    KajakEngine,
    Scene,
    CheckpointObject,
    vec2D,
    degreesToRadians,
    AABBCollider,
    SpriteManager,
} from "@kajaksolutions/kajakengine"
import { MapObject } from "../../KajakEngine"
import { useEffect, useRef } from "react"

function App() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        if (!canvasRef.current) return
        const canvas = canvasRef.current

        const engine = new KajakEngine(canvas)
        const mainScene = new Scene(
            {
                x: -canvas.width / (2 * Scene.scale),
                y: -canvas.height / (2 * Scene.scale),
                width: canvas.width * Scene.scale,
                height: canvas.height * Scene.scale,
            },
            new MapObject({ backgroundSrc: "./map2.png" })
        )

        engine.scenes.set(1, mainScene)
        engine.setCurrentScene(1)

        const checkpoints = [
            new CheckpointObject({
                position: vec2D(-46, 10),
                size: vec2D(10, 2),
                order: 0,
                isFinishLine: false,
                movable: false,
                rotation: degreesToRadians(45),
                collider: new AABBCollider(vec2D(-12, -1), vec2D(22, 2)),
                spriteManager: new SpriteManager({
                    imageSrc: "src/assets/checkpoint.png",
                    cellSize: vec2D(32, 32),
                    count: 48,
                    columns: 7,
                    offset: 47,
                }),
                mass: 1,
            }),
            new CheckpointObject({
                position: vec2D(-20, 12),
                size: vec2D(10, 2),
                order: 1,
                isFinishLine: false,
                movable: false,
                rotation: degreesToRadians(130),
                collider: new AABBCollider(vec2D(-1, -12), vec2D(2, 18)),
                spriteManager: new SpriteManager({
                    imageSrc: "src/assets/checkpoint.png",
                    cellSize: vec2D(32, 32),
                    count: 48,
                    columns: 7,
                    offset: 47,
                }),
                mass: 1,
            }),
            new CheckpointObject({
                position: vec2D(25, -18),
                size: vec2D(10, 2),
                order: 2,
                isFinishLine: false,
                movable: false,
                rotation: degreesToRadians(65),
                collider: new AABBCollider(vec2D(-1, -12), vec2D(2, 18)),
                spriteManager: new SpriteManager({
                    imageSrc: "src/assets/checkpoint.png",
                    cellSize: vec2D(32, 32),
                    count: 48,
                    columns: 7,
                    offset: 47,
                }),
                mass: 1,
            }),
            new CheckpointObject({
                position: vec2D(50, 0),
                size: vec2D(10, 2),
                order: 3,
                isFinishLine: false,
                movable: false,
                rotation: degreesToRadians(0),
                collider: new AABBCollider(vec2D(-12, -1), vec2D(22, 2)),
                spriteManager: new SpriteManager({
                    imageSrc: "src/assets/checkpoint.png",
                    cellSize: vec2D(32, 32),
                    count: 48,
                    columns: 7,
                    offset: 47,
                }),
                mass: 1,
            }),
            new CheckpointObject({
                position: vec2D(26, 16),
                size: vec2D(10, 2),
                order: 4,
                isFinishLine: false,
                movable: false,
                rotation: degreesToRadians(245),
                collider: new AABBCollider(vec2D(-1, -12), vec2D(2, 22)),
                spriteManager: new SpriteManager({
                    imageSrc: "src/assets/checkpoint.png",
                    cellSize: vec2D(32, 32),
                    count: 48,
                    columns: 7,
                    offset: 47,
                }),
                mass: 1,
            }),
            new CheckpointObject({
                position: vec2D(-25, -18),
                size: vec2D(10, 2),
                order: 5,
                isFinishLine: false,
                movable: false,
                rotation: degreesToRadians(285),
                collider: new AABBCollider(vec2D(-1, -12), vec2D(2, 22)),
                spriteManager: new SpriteManager({
                    imageSrc: "src/assets/checkpoint.png",
                    cellSize: vec2D(32, 32),
                    count: 48,
                    columns: 7,
                    offset: 47,
                }),
                mass: 1,
            }),
            new CheckpointObject({
                position: vec2D(-45, 0),
                size: vec2D(10, 2),
                order: 6,
                isFinishLine: true,
                movable: false,
                rotation: degreesToRadians(0),
                collider: new AABBCollider(vec2D(-12, -1), vec2D(22, 2)),
                spriteManager: new SpriteManager({
                    imageSrc: "src/assets/checkpoint.png",
                    cellSize: vec2D(32, 32),
                    count: 48,
                    columns: 7,
                    offset: 47,
                }),
                mass: 1,
            }),
        ]
        checkpoints.forEach((checkpoint) => {
            mainScene.addObject(checkpoint)
        })
    }, [])

    return (
        <>
            <div id="game">
                <canvas ref={canvasRef}></canvas>
            </div>
            {/*<div id="ui">*/}
            {/*    <Header></Header>*/}
            {/*    <CarStats></CarStats>*/}
            {/*    <Slider></Slider>*/}
            {/*</div>*/}
        </>
    )
}

export default App

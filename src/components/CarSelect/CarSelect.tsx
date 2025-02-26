import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import "./CarSelect.scss"

interface CarStats {
    speed: number
    nitro: number
    drive: string
}

interface Car {
    id: number
    image: string
    name: string
    stats: CarStats
}

const cars: Car[] = [
    {
        id: 0,
        image: "./bmw-e36.png",
        name: "BMW E36",
        stats: {
            speed: 3,
            nitro: 3,
            drive: "FWD",
        },
    },
    {
        id: 1,
        image: "./saab-93.png",
        name: "Saab 93",
        stats: {
            speed: 2,
            nitro: 4,
            drive: "RWD",
        },
    },
    {
        id: 2,
        image: "./nissan-gtr.png",
        name: "Nissan GTR",
        stats: {
            speed: 3,
            nitro: 2,
            drive: "4WD",
        },
    },
]

const pages = [...cars, ...cars, ...cars]

export default function Carousel() {
    const [index, setIndex] = useState(0)
    const [currentCar, setCurrentCar] = useState<Car>(cars[0])

    useEffect(() => {
        const realCarIndex = index % cars.length
        setCurrentCar(cars[realCarIndex])
    }, [index])

    const nextSlide = () => {
        setIndex((prev) => (prev + 1) % pages.length)
    }

    const prevSlide = () => {
        setIndex((prev) => (prev - 1 + pages.length) % pages.length)
    }

    const renderStars = (value: number, maxStars: number = 5) => {
        return Array.from({ length: maxStars }).map((_, i) => (
            <div key={i} className={`star ${i < value ? "active" : ""}`}></div>
        ))
    }

    return (
        <section>
            <header>
                <div className="container">
                    <div className="arrow"></div>
                    <h2>Wybierz swoj pojazd</h2>
                </div>
                <div className="budget">0000$</div>
            </header>
            <div className="stats-wrapper">
                <div className="stats-container">
                    <div className="content">
                        <p>Predkosc:</p>
                        <div className="speed stars">
                            {renderStars(currentCar.stats.speed)}
                        </div>
                    </div>
                    <div className="content">
                        <p>Nitro:</p>
                        <div className="nitro stars">
                            {renderStars(currentCar.stats.nitro)}
                        </div>
                    </div>
                    <div className="content">
                        <p>Naped:</p>
                        <p className="drive">{currentCar.stats.drive}</p>
                    </div>
                </div>
            </div>
            <div className="carousel-container">
                <button onClick={prevSlide} className="carousel-button left">
                    <div className="arrow left"></div>
                </button>

                <div className="carousel-wrapper">
                    {pages.map((page, i) => {
                        const position =
                            (i - index + pages.length) % pages.length
                        const isActive = position === 0
                        const scale = isActive ? 1 : 0.7
                        const opacity =
                            position > 1 && position < pages.length - 1
                                ? 0
                                : isActive
                                  ? 1
                                  : 0.6

                        const xOffset = (() => {
                            if (position === pages.length - 1) {
                                return `-100%`
                            }
                            if (position > pages.length / 2) {
                                return `-200%`
                            }

                            if (position === 0) {
                                return "0%"
                            }

                            if (position === 1) {
                                return "100%"
                            }
                            return "200%"
                        })()

                        return (
                            <motion.div
                                key={`${page.id}-${i}`}
                                className="carousel-slide"
                                animate={{
                                    x: xOffset,
                                    scale,
                                    opacity,
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 20,
                                }}
                            >
                                <img
                                    src={page.image}
                                    alt={`${page.name}`}
                                    className="carousel-image"
                                />
                            </motion.div>
                        )
                    })}
                </div>

                <button onClick={nextSlide} className="carousel-button right">
                    <div className="arrow"></div>
                </button>
            </div>

            <div className="buttons-container">
                <button>Edytuj</button>
                <button>Graj</button>
                <button>Kup</button>
            </div>
        </section>
    )
}

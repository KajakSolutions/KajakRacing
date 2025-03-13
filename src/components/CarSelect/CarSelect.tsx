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
    price: number
    owned: boolean
    stats: CarStats
}

const initialCars: Car[] = [
    {
        id: 0,
        image: "./bmw-e36.png",
        name: "BMW E36",
        price: 100,
        owned: false,
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
        price: 0,
        owned: true,
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
        price: 100,
        owned: false,
        stats: {
            speed: 3,
            nitro: 2,
            drive: "4WD",
        },
    },
]

export default function Carousel() {
    const [cars, setCars] = useState<Car[]>(initialCars)
    const [index, setIndex] = useState(0)
    const [currentCar, setCurrentCar] = useState<Car>(cars[0])
    const [budget, setBudget] = useState(200)

    const pages = [...cars, ...cars, ...cars]

    useEffect(() => {
        const realCarIndex = index % cars.length
        setCurrentCar(cars[realCarIndex])
    }, [index, cars])

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

    const handlePurchase = () => {
        const realCarIndex = index % cars.length
        const carToBuy = cars[realCarIndex]

        if (carToBuy.owned) {
            return
        }

        if (budget >= carToBuy.price) {
            setBudget((prev) => prev - carToBuy.price)

            const updatedCars = [...cars]
            updatedCars[realCarIndex] = {
                ...carToBuy,
                owned: true,
            }

            setCars(updatedCars)
        }
    }

    return (
        <>
            <section>
                <header>
                    <div className="container">
                        <div className="arrow"></div>
                        <h2>Wybierz swoj pojazd</h2>
                    </div>
                    <div className="budget">${budget}</div>
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
                    <button
                        onClick={prevSlide}
                        className="carousel-button left"
                    >
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
                                    className={`carousel-slide ${page.owned ? "owned" : "not-owned"}`}
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

                    <button
                        onClick={nextSlide}
                        className="carousel-button right"
                    >
                        <div className="arrow"></div>
                    </button>
                </div>

                <div className="buttons-container">
                    <button
                        className={`edit-button ${!currentCar.owned ? "disabled" : ""}`}
                        disabled={!currentCar.owned}
                    >
                        Edytuj
                    </button>
                    <button
                        className={`play-button ${!currentCar.owned ? "disabled" : ""}`}
                        disabled={!currentCar.owned}
                    >
                        Graj
                    </button>
                    <button
                        className={`buy-button ${currentCar.owned || budget < currentCar.price ? "disabled" : ""}`}
                        onClick={handlePurchase}
                        disabled={currentCar.owned || budget < currentCar.price}
                    >
                        Kup
                    </button>
                </div>
            </section>

            <div className="car-edit-container">
                <div className="content">
                    <header className="header">
                        <div className="container">
                            <div className="arrow"></div>
                            <h2>Edytuj swoj pojazd</h2>
                        </div>
                        <div className="budget">${budget}</div>
                    </header>
                    <div className="wrapper">
                        <div className="car-container">
                            <img src="" alt="" />
                        </div>
                        <div className="settings-container"></div>
                    </div>
                    <p>Razem: $0</p>
                    <button>Zaplac</button>
                </div>
            </div>
        </>
    )
}

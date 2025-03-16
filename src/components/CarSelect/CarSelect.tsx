import { useState, useEffect } from "react"
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
    color?: string
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
    const [showEditScreen, setShowEditScreen] = useState(false)

    // Edit screen states
    const [speedUpgrades, setSpeedUpgrades] = useState(0)
    const [nitroUpgrades, setNitroUpgrades] = useState(0)
    const [totalCost, setTotalCost] = useState(0)

    const pages = [...cars, ...cars, ...cars]

    useEffect(() => {
        const realCarIndex = index % cars.length
        setCurrentCar(cars[realCarIndex])
    }, [index, cars])

    useEffect(() => {
        // Reset upgrades when edit screen is opened
        if (showEditScreen) {
            const currentSpeed = currentCar.stats.speed
            const currentNitro = currentCar.stats.nitro
            setSpeedUpgrades(0)
            setNitroUpgrades(0)
            setTotalCost(0)
        }
    }, [showEditScreen, currentCar])

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

    const handleEditClick = () => {
        setShowEditScreen(true)
    }

    const handleBackClick = () => {
        setShowEditScreen(false)
    }

    const handleSpeedUpgrade = () => {
        if (
            currentCar.stats.speed + speedUpgrades < 5 &&
            budget >= totalCost + 200
        ) {
            setSpeedUpgrades((prev) => prev + 1)
            setTotalCost((prev) => prev + 200)
        }
    }

    const handleNitroUpgrade = () => {
        if (
            currentCar.stats.nitro + nitroUpgrades < 5 &&
            budget >= totalCost + 200
        ) {
            setNitroUpgrades((prev) => prev + 1)
            setTotalCost((prev) => prev + 200)
        }
    }

    const handlePayment = () => {
        if (totalCost > 0 && budget >= totalCost) {
            setBudget((prev) => prev - totalCost)

            const realCarIndex = index % cars.length
            const updatedCars = [...cars]
            updatedCars[realCarIndex] = {
                ...currentCar,
                stats: {
                    ...currentCar.stats,
                    speed: currentCar.stats.speed + speedUpgrades,
                    nitro: currentCar.stats.nitro + nitroUpgrades,
                },
            }

            setCars(updatedCars)
            setShowEditScreen(false)
        }
    }

    return (
        <>
            <section style={{ display: showEditScreen ? "none" : "block" }}>
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

                            // Removed motion.div for retro feel, using regular div with direct styling
                            return (
                                <div
                                    key={`${page.id}-${i}`}
                                    className={`carousel-slide ${page.owned ? "owned" : "not-owned"}`}
                                    style={{
                                        transform: `translateX(${xOffset}) scale(${scale})`,
                                        opacity: opacity,
                                    }}
                                >
                                    <img
                                        src={page.image}
                                        alt={`${page.name}`}
                                        className="carousel-image"
                                    />
                                </div>
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
                        onClick={handleEditClick}
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

            <div
                className="car-edit-container"
                style={{ display: showEditScreen ? "block" : "none" }}
            >
                <div className="content">
                    <header className="header">
                        <div className="container">
                            <div
                                className="arrow"
                                onClick={handleBackClick}
                            ></div>
                            <h2>Edytuj swoj pojazd</h2>
                        </div>
                        <div className="budget">${budget}</div>
                    </header>
                    <div className="wrapper">
                        <div className="car-container">
                            <img
                                src={currentCar.image}
                                alt={currentCar.name}
                                className="carousel-image"
                            />
                        </div>
                        <div className="settings-container">
                            <div className="speed-container">
                                <p>Ulepsz Predkosc</p>
                                <div className="wrapper">
                                    {Array.from({ length: 5 }).map((_, i) => {
                                        const baseSpeed = currentCar.stats.speed
                                        const isActive =
                                            i < baseSpeed + speedUpgrades
                                        const isPurchasable =
                                            i === baseSpeed + speedUpgrades &&
                                            i < 5

                                        return (
                                            <div
                                                key={i}
                                                className={`block ${!isActive ? "disabled" : ""} ${isPurchasable ? "buy-more" : ""}`}
                                                onClick={
                                                    isPurchasable
                                                        ? handleSpeedUpgrade
                                                        : undefined
                                                }
                                            ></div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="nitro-container">
                                <p>Ulepsz Nitro</p>
                                <div className="wrapper">
                                    {Array.from({ length: 5 }).map((_, i) => {
                                        const baseNitro = currentCar.stats.nitro
                                        const isActive =
                                            i < baseNitro + nitroUpgrades
                                        const isPurchasable =
                                            i === baseNitro + nitroUpgrades &&
                                            i < 5

                                        return (
                                            <div
                                                key={i}
                                                className={`block ${!isActive ? "disabled" : ""} ${isPurchasable ? "buy-more" : ""}`}
                                                onClick={
                                                    isPurchasable
                                                        ? handleNitroUpgrade
                                                        : undefined
                                                }
                                            ></div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="color-container">
                                <p>Zmien Kolor</p>
                                <div className="wrapper">
                                    <div className="color red"></div>
                                    <div className="color blue"></div>
                                    <div className="color yellow"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p>Razem: ${totalCost}</p>
                    <button
                        onClick={handlePayment}
                        disabled={totalCost === 0 || budget < totalCost}
                    >
                        Zaplac
                    </button>
                </div>
            </div>
        </>
    )
}

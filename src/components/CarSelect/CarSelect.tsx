import { useState, useEffect } from "react"
import { useGame } from "../../context/GameContext"
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
    colorUnlocked?: boolean
}

const CarSelect = () => {
    const { selectCar, setGameState } = useGame()
    const [cars, setCars] = useState<Car[]>([])
    const [index, setIndex] = useState(0)
    const [currentCar, setCurrentCar] = useState<Car | null>(null)
    const [budget, setBudget] = useState(20000)
    const [showEditScreen, setShowEditScreen] = useState(false)

    const [speedUpgrades, setSpeedUpgrades] = useState(0)
    const [nitroUpgrades, setNitroUpgrades] = useState(0)
    const [colorUpgrade, setColorUpgrade] = useState(false)
    const [totalCost, setTotalCost] = useState(0)

    useEffect(() => {
        const savedCars = localStorage.getItem("cars")
        const savedBudget = localStorage.getItem("budget")

        if (savedCars) {
            setCars(JSON.parse(savedCars))
        } else {
            const initialCars = [
                {
                    id: 0,
                    image: "./bmw-e36.png",
                    name: "BMW E36",
                    price: 100,
                    owned: false,
                    colorUnlocked: false,
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
                    colorUnlocked: false,
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
                    colorUnlocked: false,
                    stats: {
                        speed: 3,
                        nitro: 2,
                        drive: "4WD",
                    },
                },
            ]
            setCars(initialCars)
            localStorage.setItem("cars", JSON.stringify(initialCars))
        }

        if (savedBudget) {
            setBudget(parseInt(savedBudget))
        } else {
            localStorage.setItem("budget", budget.toString())
        }
    }, [])

    useEffect(() => {
        if (cars.length > 0) {
            localStorage.setItem("cars", JSON.stringify(cars))
        }
        localStorage.setItem("budget", budget.toString())
    }, [cars, budget])

    const pages = [...cars, ...cars, ...cars]

    useEffect(() => {
        if (cars.length > 0) {
            const realCarIndex = index % cars.length
            setCurrentCar(cars[realCarIndex])
        }
    }, [index, cars])

    useEffect(() => {
        if (showEditScreen && currentCar) {
            setSpeedUpgrades(0)
            setNitroUpgrades(0)
            setColorUpgrade(false)
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
        if (!currentCar) return

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

    const handleLastPageClick = () => {
        setGameState("MAIN_MENU")
    }

    const handleBackClick = () => {
        setShowEditScreen(false)
    }

    const handleSpeedUpgrade = () => {
        if (!currentCar) return

        if (
            currentCar.stats.speed + speedUpgrades < 5 &&
            budget >= totalCost + 200
        ) {
            setSpeedUpgrades((prev) => prev + 1)
            setTotalCost((prev) => prev + 200)
        }
    }

    const handleNitroUpgrade = () => {
        if (!currentCar) return

        if (
            currentCar.stats.nitro + nitroUpgrades < 5 &&
            budget >= totalCost + 200
        ) {
            setNitroUpgrades((prev) => prev + 1)
            setTotalCost((prev) => prev + 200)
        }
    }

    const handleColorUpgrade = () => {
        if (!currentCar) return

        // Only allow color upgrade if not already unlocked
        if (!currentCar.colorUnlocked && budget >= totalCost + 50) {
            setColorUpgrade(true)
            setTotalCost((prev) => prev + 50)
        }
    }

    const handlePlayClick = () => {
        if (!currentCar || !currentCar.owned) return

        selectCar({
            id: currentCar.id,
            name: currentCar.name,
            image: currentCar.image,
            stats: currentCar.stats,
            color: currentCar.color,
        })

        setGameState("MAP_SELECT")
    }

    const handlePayment = () => {
        if (!currentCar) return
        // if (totalCost > 0 && budget >= totalCost) gdy zmieniasz kolor to cie nie wypierdala
        // if (budget >= totalCost) tu wypierdala
        if (totalCost > 0 && budget >= totalCost) {
            setBudget((prev) => prev - totalCost)

            const realCarIndex = index % cars.length
            const updatedCars = [...cars]
            updatedCars[realCarIndex] = {
                ...currentCar,
                colorUnlocked: currentCar.colorUnlocked || colorUpgrade,
                stats: {
                    ...currentCar.stats,
                    speed: currentCar.stats.speed + speedUpgrades,
                    nitro: currentCar.stats.nitro + nitroUpgrades,
                },
            }

            if(!currentCar.colorUnlocked){
                setCars(updatedCars)
            }else{
                setCars(updatedCars)
                setShowEditScreen(false)  
            }
        }
    }

    const handleColorSelect = (color: string) => {
        if (!currentCar || !currentCar.colorUnlocked) return

        const realCarIndex = index % cars.length
        const updatedCars = [...cars]
        updatedCars[realCarIndex] = {
            ...currentCar,
            color: color,
        }

        setCars(updatedCars)
    }

    if (!currentCar) return <div>Loading...</div>

    return (
        <>
            <section
                className="car-select-sec"
                style={{ display: showEditScreen ? "none" : "block" }}
            >
                <header className="car-select-header">
                    <div className="container">
                        <div className="arrow" onClick={handleLastPageClick}/>
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
                                         style={{
                                             filter: page.color ? `hue-rotate(${getHueRotateValue(page.color)})` : 'grayscale(100%) brightness(0.35);'
                                        }}
                                    />
                                    <div className={`${page.owned ? "unlocked" : "carLocked"}`}>
                                        <img src="/public/lock.png" alt="lock"/>
                                        <p>$100</p>
                                    </div>
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
                        onClick={handlePlayClick}
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
                                className="car-image"
                                style={{
                                    filter: currentCar.color
                                        ? `hue-rotate(${getHueRotateValue(currentCar.color)})`
                                        : "none",
                                }}
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
                                <div className="colors">
                                    {currentCar.colorUnlocked || colorUpgrade ? (
                                        <>
                                            <div
                                                className={`color ${currentCar.color === "red" ? "active" : "red"}`}
                                                onClick={() => handleColorSelect("red")}
                                            ></div>
                                            <div
                                                className={`color ${currentCar.color === "blue" ? "active" : "blue"}`}
                                                onClick={() => handleColorSelect("blue")}
                                            ></div>
                                            <div
                                                className={`color ${currentCar.color === "yellow" ? "active" : "yellow"}`}
                                                onClick={() => handleColorSelect("yellow")}
                                            ></div>
                                        </>
                                    ) : (
                                        <div 
                                            className={`color-unlock ${colorUpgrade ? "active" : ""}`}
                                            onClick={handleColorUpgrade}
                                        >
                                            ($50)
                                        </div>
                                    )}
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

function getHueRotateValue(color: string): string {
    switch (color) {
        case "red":
            return "0deg"
        case "blue":
            return "180deg"
        case "yellow":
            return "60deg"
        default:
            return "0deg"
    }
}

export default CarSelect
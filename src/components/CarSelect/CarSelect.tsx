import { useState, useEffect } from "react"
import { useGame } from "../../context/GameContext"
import { soundManager } from "../../utils/SoundManager"
import "./CarSelect.scss"

interface CarStats {
    speed: number
    nitro: number
    drive: string
}

interface Car {
    id: number
    type: string  // typ auta: 'aubi', 'bemdablju', 'donda', 'saat'
    name: string
    price: number
    owned: boolean
    stats: CarStats
    color?: string  // kolor: 'black', 'red', 'white', 'yellow'
    availableColors: string[]
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
                    type: "bemdablju",
                    name: "bemdablju E36",
                    price: 100,
                    owned: false,
                    colorUnlocked: false,
                    availableColors: ["blue", "green", "white", "red"],
                    stats: {
                        speed: 3,
                        nitro: 3,
                        drive: "FWD",
                    },
                },
                {
                    id: 1,
                    type: "saat",
                    name: "Saat Leon",
                    price: 0,
                    owned: true,
                    colorUnlocked: false,
                    availableColors: ["blue", "red", "yellow"],
                    stats: {
                        speed: 2,
                        nitro: 4,
                        drive: "RWD",
                    },
                },
                {
                    id: 2,
                    type: "aubi",
                    name: "Aubi a3",
                    price: 100,
                    owned: false,
                    colorUnlocked: false,
                    availableColors: ["black", "red", "white", "yellow"],
                    stats: {
                        speed: 3,
                        nitro: 2,
                        drive: "4WD",
                    },
                },
                {
                    id: 3,
                    type: "donda",
                    name: "donda Civic",
                    price: 50,
                    owned: false,
                    colorUnlocked: false,
                    availableColors: ["blue", "pink", "red", "yellow"],
                    stats: {
                        speed: 2,
                        nitro: 3,
                        drive: "FWD",
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
        soundManager.play('slide')
    }

    const prevSlide = () => {
        setIndex((prev) => (prev - 1 + pages.length) % pages.length)
        soundManager.play('slide')
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
            soundManager.play('purchase')
        }
    }

    const handleEditClick = () => {
        setShowEditScreen(true)
        soundManager.play('select')
    }

    const handleLastPageClick = () => {
        setGameState("MAIN_MENU")
        soundManager.play('back')
    }

    const handleBackClick = () => {
        setShowEditScreen(false)
        soundManager.play('back')
    }

    const handleSpeedUpgrade = () => {
        if (!currentCar) return

        if (
            currentCar.stats.speed + speedUpgrades < 5 &&
            budget >= totalCost + 200
        ) {
            setSpeedUpgrades((prev) => prev + 1)
            setTotalCost((prev) => prev + 200)
            soundManager.play('upgrade')
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
            soundManager.play('upgrade')
        }
    }

    const handleColorUpgrade = () => {
        if (!currentCar) return

        if (!currentCar.colorUnlocked && budget >= totalCost + 50) {
            setColorUpgrade(true)
            setTotalCost((prev) => prev + 50)
            soundManager.play('upgrade')
        }
    }

    const handlePlayClick = () => {
        if (!currentCar || !currentCar.owned) return

        selectCar({
            id: currentCar.id,
            name: currentCar.name,
            type: currentCar.type,
            stats: currentCar.stats,
            color: currentCar.color || 'red',
        });

        setGameState("MAP_SELECT");
    }

    const handleColorSelect = (color: string) => {
        if (!currentCar || !currentCar.colorUnlocked) return;

        if (!currentCar.availableColors.includes(color)) {
            return;
        }

        const realCarIndex = index % cars.length;
        const updatedCars = [...cars];
        updatedCars[realCarIndex] = {
            ...currentCar,
            color: color,
        };

        setCars(updatedCars);
        soundManager.play('select');
    };

    const handlePayment = () => {
        if (!currentCar) return

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

            setCars(updatedCars)
            soundManager.play('purchase')

            if (currentCar.colorUnlocked) {
                setShowEditScreen(false)
            }
        }
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
                                        src={`/cars/${page.type}/${page.color || 'red'}/car_select.png`}
                                        alt={`${page.name}`}
                                        className="carousel-image"
                                    />
                                    <div className={`${page.owned ? "unlocked" : "carLocked"}`}>
                                        <img src="/lock.png" alt="lock"/>
                                        <p>${page.price}</p>
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
                                src={`/cars/${currentCar.type}/${currentCar.color || 'red'}/car_select.png`}
                                alt={currentCar.name}
                                className="car-image"
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
                                            {console.log(currentCar)}
                                            {currentCar.availableColors.map(color => (
                                                <div
                                                    key={color}
                                                    className={`color ${currentCar.color === color ? "active" : ""} ${color}`}
                                                    onClick={() => handleColorSelect(color)}
                                                    style={{backgroundImage: `url(/cars/${currentCar.type}/${color}/car_select.png)`, backgroundSize: 'cover', backgroundPosition: 'center'}}
                                                ></div>
                                            ))}
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

export default CarSelect

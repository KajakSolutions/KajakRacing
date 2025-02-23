import { useState } from "react"
import { motion } from "framer-motion"
import "./CarSelect.scss"
import { section } from "framer-motion/client"

const originalSlides = [
    { id: 0, image: "./bmw-e36.png" },
    { id: 1, image: "./saab-93.png" },
    { id: 2, image: "./nissan-gtr.png" },
]

const pages = [...originalSlides, ...originalSlides, ...originalSlides]

export default function Carousel() {
    const [index, setIndex] = useState(0)

    const nextSlide = () => {
        setIndex((prev) => (prev + 1) % pages.length)
    }

    const prevSlide = () => {
        setIndex((prev) => (prev - 1 + pages.length) % pages.length)
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
                            <div className="star active"></div>
                            <div className="star active"></div>
                            <div className="star active"></div>
                            <div className="star"></div>
                            <div className="star"></div>
                        </div>
                    </div>
                    <div className="content">
                        <p>Nitro:</p>
                        <div className="nitro stars">
                            <div className="star active"></div>
                            <div className="star active"></div>
                            <div className="star active"></div>
                            <div className="star active"></div>
                            <div className="star"></div>
                        </div>
                    </div>
                    <div className="content">
                        <p>Naped:</p>
                        <p className="drive">RWD</p>
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

                        console.log(position, xOffset, opacity)

                        return (
                            <motion.div
                                key={page.id}
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
                                    alt={`Slide ${page.id}`}
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

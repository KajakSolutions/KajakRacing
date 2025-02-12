import { useState } from "react"
import { motion } from "framer-motion"
import "./slider.scss"

const pages = [
    { id: 0, image: ".././src/public/img/bmw-e36.png" },
    { id: 1, image: ".././src/public/img/saab-93.png" },
    { id: 2, image: ".././src/public/img/nissan-gtr.png" },
]

export default function Carousel() {
    const [index, setIndex] = useState(0)

    const nextSlide = () => {
        setIndex((prev) => (prev + 1) % pages.length)
    }

    const prevSlide = () => {
        setIndex((prev) => (prev - 1 + pages.length) % pages.length)
    }

    return (
        <div className="carousel-container">
            <button onClick={prevSlide} className="carousel-button left">
                <div className="arrow left"></div>
            </button>

            <div className="carousel-wrapper">
                {pages.map((page, i) => {
                    const position = (i - index + pages.length) % pages.length
                    const isActive = position === 0
                    const scale = isActive ? 1 : 0.7
                    const opacity = isActive ? 1 : 0.6
                    const xOffset =
                        position === 0
                            ? "0%"
                            : position === 1
                              ? "100%"
                              : "-100%"

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
    )
}

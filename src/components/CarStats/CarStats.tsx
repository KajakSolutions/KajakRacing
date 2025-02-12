import "./CarStats.scss"

function CarStats() {
    return (
        <div className="wrapper">
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
    )
}

export default CarStats

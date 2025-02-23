import "./leaderboard.scss"

function leaderboard() {
    return (
        <section>
            <div className="container">
                <h2>Wyniki Wyscigu</h2>
                <div className="player-container">
                    <p className="place">1</p>
                    <p className="nick">Nick Hers</p>
                    <p className="time">09.11s</p>
                    <div className="img"></div>
                </div>
                <div className="player-container">
                    <p className="place">2</p>
                    <p className="nick">Nick Hers</p>
                    <p className="time">09.11s</p>
                    <div className="img"></div>
                </div>
                <div className="player-container">
                    <p className="place">3</p>
                    <p className="nick">Nick Hers</p>
                    <p className="time">09.11s</p>
                    <div className="img"></div>
                </div>
                <div className="player-container">
                    <p className="place">4</p>
                    <p className="nick">Nick Hers</p>
                    <p className="time">09.11s</p>
                    <div className="img"></div>
                </div>
                <div className="player-container">
                    <p className="place">5</p>
                    <p className="nick">Nick Hers</p>
                    <p className="time">09.11s</p>
                    <div className="img"></div>
                </div>
                <h3>
                    Wygrana: <span>0$</span>
                </h3>
                <button id="ReturnToMenu">Powrot do menu</button>
            </div>
        </section>
    )
}

export default leaderboard

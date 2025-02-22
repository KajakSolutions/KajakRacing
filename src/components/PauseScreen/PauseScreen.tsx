import "./pausescreen.scss"

function PauseScreen() {
    return (
        <section>
            <div className="container">
                <div className="music">
                    <label htmlFor="music">Muzyka:</label>
                    <div className="inp-wrapper">
                        <div id="mute"></div>
                        <input type="range" name="music" id="music" />
                    </div>
                </div>
                <div className="sfx">
                    <label htmlFor="sfx">Efekty:</label>
                    <div className="inp-wrapper">
                        <div id="mute"></div>
                        <input type="range" name="sfx" id="sfx" />
                    </div>
                </div>
                <button className="resume">Powrot do gry</button>
                <button id="ReturnToMenu">Powrot do menu</button>
            </div>
        </section>
    )
}

export default PauseScreen

import "./mapselect.scss"

function MapSelect() {
    return (
        <section>
            <header>
                <div className="arrow"></div> <h2>Wybierz poziom:</h2>
            </header>
            <main>
                <div className="img-container">
                    <img src="" alt="" />
                    <p>
                        Najlepszy czas: <span id="best">4.20s</span>
                    </p>
                </div>
                <div className="buttons-container">
                    <div className="easy selected">
                        <h4>Latwy</h4>
                        <p>dzielnicowa zadymka</p>
                    </div>
                    <div className="medium">
                        <h4>Sredni</h4>
                        <p>blokowy torpedowiec</p>
                    </div>
                    <div className="hard">
                        <h4>Trudny</h4>
                        <p>lodowa banda</p>
                    </div>
                </div>
            </main>
            <button id="MapSelect">Wybierz</button>
        </section>
    )
}

export default MapSelect

import { useState, useEffect } from "react"
import { useGame } from "../../context/GameContext"
import "./mapselect.scss"

interface TrackData {
    id: string
    name: string
    description: string
    difficulty: "easy" | "medium" | "hard"
    imageSrc: string
    mapPath: string
    bestTime: number | null
}

function MapSelect() {
    const { startGame } = useGame()
    const [selectedTrack, setSelectedTrack] = useState<TrackData | null>(null)
    const [tracks, setTracks] = useState<TrackData[]>([])

    useEffect(() => {
        const initialTracks: TrackData[] = [
            {
                id: "track1",
                name: "Latwy",
                description: "dzielnicowa zadymka",
                difficulty: "easy",
                imageSrc: "/tracks/easy_track.jpg",
                mapPath: "tracks/race-track01.json",
                bestTime: null,
            },
            {
                id: "track2",
                name: "Sredni",
                description: "blokowy torpedowiec",
                difficulty: "medium",
                imageSrc: "/tracks/medium_track.jpg",
                mapPath: "src/assets/race-track02.json",
                bestTime: null,
            },
            {
                id: "track3",
                name: "Trudny",
                description: "lodowa banda",
                difficulty: "hard",
                imageSrc: "/tracks/hard_track.jpg",
                mapPath: "src/assets/race-track03.json",
                bestTime: null,
            },
        ]

        const savedTimes = localStorage.getItem("trackBestTimes")
        if (savedTimes) {
            const parsedTimes = JSON.parse(savedTimes)

            initialTracks.forEach((track) => {
                if (parsedTimes[track.id]) {
                    track.bestTime = parsedTimes[track.id]
                }
            })
        }

        setTracks(initialTracks)
        setSelectedTrack(initialTracks[0])
    }, [])

    const handleSelectTrack = (track: TrackData) => {
        setSelectedTrack(track)
    }

    const handleStartRace = async () => {
        if (!selectedTrack) return
        try {
            await startGame(selectedTrack.mapPath)
        } catch (error) {
            console.error("Failed to start race:", error)
        }
    }

    const formatTime = (timeInMs: number | null): string => {
        if (timeInMs === null) return "--.-s"

        const seconds = timeInMs / 1000
        return seconds.toFixed(2) + "s"
    }

    const handleGoBack = () => {
        const { setGameState } = useGame()
        setGameState("CAR_SELECT")
    }

    return (
        <section className="map-select">
            <header>
                <div className="arrow" onClick={handleGoBack}></div>
                <h2>Wybierz poziom:</h2>
            </header>
            <main>
                <div className="img-container">
                    <img
                        src={selectedTrack?.imageSrc || ""}
                        alt={selectedTrack?.name || ""}
                    />
                    <p>
                        Najlepszy czas:{" "}
                        <span id="best">
                            {selectedTrack
                                ? formatTime(selectedTrack.bestTime)
                                : "--.-s"}
                        </span>
                    </p>
                </div>
                <div className="buttons-container">
                    {tracks.map((track) => (
                        <div
                            key={track.id}
                            className={`${track.difficulty} ${selectedTrack?.id === track.id ? "selected" : ""}`}
                            onClick={() => handleSelectTrack(track)}
                        >
                            <h4>{track.name}</h4>
                            <p>{track.description}</p>
                        </div>
                    ))}
                </div>
            </main>
            <button
                id="MapSelect"
                onClick={handleStartRace}
                disabled={!selectedTrack}
            >
                Wybierz
            </button>
        </section>
    )
}

export default MapSelect

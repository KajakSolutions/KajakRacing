import React, { useEffect, useRef, useState } from "react"
import { useGame } from "../../context/GameContext"
import "./devconsole.scss"

const AVAILABLE_COMMANDS = {
    help: "Wyświetla listę dostępnych poleceń",
    debug: "Włącza/wyłącza tryb debugowania",
    tp: "Teleportuje gracza do podanych koordynatów (tp x y)",
    nitro: "Ustawia ilość nitro (nitro [ilość])",
    weather: "Zmienia pogodę (weather [clear|rain|snow])",
    fps: "Pokazuje/ukrywa licznik FPS",
    banana: "Daje graczowi banana (banana [ilość])",
    god: "Włącza/wyłącza nieśmiertelność",
    spawn: "Tworzy obiekt (spawn [item])",
    clear: "Czyści konsolę",
    exit: "Zamyka konsolę",
}

interface ConsoleCommand {
    command: string
    result?: string
    isError?: boolean
}

const DevConsole: React.FC = () => {
    const { executeCommand } = useGame()
    const [isOpen, setIsOpen] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const [history, setHistory] = useState<ConsoleCommand[]>([])
    const [historyIndex, setHistoryIndex] = useState(-1)
    const inputRef = useRef<HTMLInputElement>(null)
    const consoleRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "`" || e.key === "Backquote" || e.key === "F12") {
                e.preventDefault()
                setIsOpen((prev) => !prev)
            }

            if (e.key === "Escape" && isOpen) {
                setIsOpen(false)
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isOpen])

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    useEffect(() => {
        if (consoleRef.current) {
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight
        }
    }, [history])

    const handleCommandSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!inputValue.trim()) return

        const command = inputValue.trim()
        const newHistoryItem: ConsoleCommand = { command }

        if (command === "clear") {
            setHistory([])
            setInputValue("")
            return
        }

        if (command === "exit") {
            setIsOpen(false)
            setInputValue("")
            return
        }

        if (command === "help") {
            newHistoryItem.result = Object.entries(AVAILABLE_COMMANDS)
                .map(([cmd, desc]) => `${cmd} - ${desc}`)
                .join("\n")
        } else {
            try {
                newHistoryItem.result = executeCommand(command)
            } catch (error) {
                newHistoryItem.result = `Błąd: ${error instanceof Error ? error.message : "Nieznany błąd"}`
                newHistoryItem.isError = true
            }
        }

        setHistory((prev) => [...prev, newHistoryItem])
        setInputValue("")
        setHistoryIndex(-1)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowUp") {
            e.preventDefault()
            if (historyIndex < history.length - 1) {
                const newIndex = historyIndex + 1
                setHistoryIndex(newIndex)
                setInputValue(history[history.length - 1 - newIndex].command)
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault()
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1
                setHistoryIndex(newIndex)
                setInputValue(history[history.length - 1 - newIndex].command)
            } else if (historyIndex === 0) {
                setHistoryIndex(-1)
                setInputValue("")
            }
        } else if (e.key === "Tab") {
            e.preventDefault()
            const input = inputValue.toLowerCase()
            const matchingCommands = Object.keys(AVAILABLE_COMMANDS).filter(
                (cmd) => cmd.startsWith(input)
            )

            if (matchingCommands.length === 1) {
                setInputValue(matchingCommands[0] + " ")
            }
        }
    }

    if (!isOpen) return null

    return (
        <div className="dev-console">
            <div className="console-header">
                <span>Konsola Developerska</span>
                <button onClick={() => setIsOpen(false)}>×</button>
            </div>

            <div className="console-output" ref={consoleRef}>
                {history.map((item, index) => (
                    <div key={index} className="console-item">
                        <div className="console-command">
                            <span className="prompt">{">"}</span> {item.command}
                        </div>
                        {item.result && (
                            <div
                                className={`console-result ${item.isError ? "error" : ""}`}
                            >
                                {item.result.split("\n").map((line, i) => (
                                    <div key={i}>{line}</div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <form onSubmit={handleCommandSubmit} className="console-input-form">
                <span className="prompt">{">"}</span>
                <input
                    type="text"
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    autoComplete="off"
                    spellCheck="false"
                />
            </form>
        </div>
    )
}

export default DevConsole

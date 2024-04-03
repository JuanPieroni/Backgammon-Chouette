import React, { useState, useEffect, useMemo } from "react"

import { RiDeleteBin6Line } from "react-icons/ri" // Ícono de eliminar (Remix Icon)
import { GiBackgammon } from "react-icons/gi" // Ícono de backgammon (Glyphicon)
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai" // Importa los íconos de la librería
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

function PlayerScore({
    player,
    score,
    updateScore,

    hover,
}) {
    const handleUpdateScore = (points) => {
        updateScore(player, points)
    }

    return (
        <div className="player-score ">
            <h3 className="player-name">{player}</h3>
            <p className="score">{score}</p>

            <div className="botonera">
                <button
                    className="increment-button"
                    onClick={() => handleUpdateScore(1)}
                >
                    +1
                </button>
                <button
                    className="increment-button"
                    onClick={() => handleUpdateScore(2)}
                >
                    +2
                </button>
                <span>
                    <GiBackgammon />{" "}
                </span>
                <button
                    className="decrement-button"
                    onClick={() => handleUpdateScore(-2)}
                >
                    -2
                </button>
                <button
                    className="decrement-button"
                    onClick={() => handleUpdateScore(-1)}
                >
                    -1
                </button>
            </div>
        </div>
    )
}

function GameBoard() {
    const [players, setPlayers] = useState([])

    const [playerName, setPlayerName] = useState("")

    const [playerScores, setPlayerScores] = useState({})
    const [rounds, setRounds] = useState([])

    const [roundCount, setRoundCount] = useState(0)
    const [editIndex, setEditIndex] = useState(null)
    const [deletedRounds, setDeletedRounds] = useState([])
    const [deletedPlayers, setDeletedPlayers] = useState([])

    // Estado para controlar si el cursor está sobre el elemento
    const [hover, setHover] = useState(false)

    // Funciones para manejar los eventos de entrada y salida del cursor
    const handleMouseEnter = () => setHover(true)
    const handleMouseLeave = () => setHover(false)
    const hoverClass = hover ? "hover-effect" : ""
    const initialPlayerScores = useMemo(() => {
        return players.reduce((scores, player) => {
            scores[player] = 0
            return scores
        }, {})
    }, [players])

    const [editScores, setEditScores] = useState(initialPlayerScores)
    useEffect(() => {
        setEditScores(initialPlayerScores)
    }, [players, initialPlayerScores])

    // Cargar los datos guardados en el Local Storage al iniciar el componente
    useEffect(() => {
        const savedPlayers = JSON.parse(localStorage.getItem("players"))
        const savedRounds = JSON.parse(localStorage.getItem("rounds"))
        const savedPlayerScores = JSON.parse(
            localStorage.getItem("playerScores")
        )
        if (savedPlayers) setPlayers(savedPlayers)
        if (savedRounds) setRounds(savedRounds)
        if (savedPlayerScores) setPlayerScores(savedPlayerScores)
    }, [])
    useEffect(() => {
        localStorage.setItem("players", JSON.stringify(players))
        localStorage.setItem("rounds", JSON.stringify(rounds))
        localStorage.setItem("playerScores", JSON.stringify(playerScores))
    }, [players, rounds, playerScores])

    const addPlayer = () => {
        if (playerName.trim() && !players.includes(playerName)) {
            // Agrega el nuevo jugador a la lista de jugadores
            setPlayers([...players, playerName])
            // Inicializa el puntaje del nuevo jugador en todas las rondas existentes
            const newRounds = rounds.map((round) => ({
                ...round,
                [playerName]: 0, // Asegúrate de que el nuevo jugador tenga un puntaje inicial de 0 en cada ronda
            }))
            setRounds(newRounds)
            // Inicializa el puntaje del nuevo jugador en el estado de puntajes actuales
            setPlayerScores({
                ...playerScores,
                [playerName]: 0,
            })
            // Limpia el nombre del jugador del input
            setPlayerName("")
        }
    }
    const handleResetAll = () => {
        // Borrar todos los datos del estado y del Local Storage
        setPlayers([])
        setRounds([])
        setPlayerScores({})
    }

    useEffect(() => {
        if (
            players.length === 0 &&
            rounds.length === 0 &&
            Object.keys(playerScores).length === 0
        ) {
            localStorage.removeItem("players")
            localStorage.removeItem("rounds")
            localStorage.removeItem("playerScores")
        }
    }, [players, rounds, playerScores])

    const updateScore = (player, points) => {
        setPlayerScores((prevScores) => ({
            ...prevScores,
            [player]: (prevScores[player] || 0) + points,
        }))
        setEditScores((prevScores) => ({
            ...prevScores,
            [player]: (prevScores[player] || 0) + points,
        }))
    }
    const handleReset = () => {
        setPlayerScores(initialPlayerScores)
        setEditIndex(null)
        setEditScores(initialPlayerScores)
    }

    const handleNextRound = () => {
        // Agrega la ronda actual a la lista de rondas
        const updatedRounds = [...rounds, { ...editScores }]

        setRounds(updatedRounds)

        // Reinicia los puntajes para la próxima ronda
        setPlayerScores(initialPlayerScores)
        setRoundCount(roundCount + 1)
        setEditIndex(null)
        setEditScores(initialPlayerScores)
    }

    const totalRow = rounds.reduce((totals, round) => {
        players.forEach((player) => {
            if (!totals[player]) {
                totals[player] = 0
            }
            totals[player] += round[player] || 0
        })
        return totals
    }, {})

    const handleDeleteRound = (indexToDelete) => {
        // Ten en cuenta que estamos trabajando con las rondas invertidas
        const trueIndex = rounds.length - 1 - indexToDelete

        // Captura la ronda que se va a eliminar
        const roundToDelete = rounds[trueIndex]

        // Actualiza el estado para eliminar la ronda
        setRounds((prevRounds) => {
            const updatedRounds = [...prevRounds]
            updatedRounds.splice(trueIndex, 1) // Elimina la ronda en el índice correcto
            return updatedRounds
        })

        // Agrega la ronda eliminada y su índice a la lista de rondas eliminadas
        setDeletedRounds((prevDeletedRounds) => [
            { round: roundToDelete, index: trueIndex }, // Guarda la ronda y su índice
            ...prevDeletedRounds,
        ])

        // Resetea el índice de edición
        setEditIndex(null)
    }

    const handleSaveRound = () => {
        let scoresToSave = { ...editScores }
        const totalScore = Object.values(scoresToSave).reduce(
            (total, score) => total + score,
            0
        )

        if (totalScore !== 0) {
            // Encuentra el último jugador
            const lastPlayer = players[players.length - 1]

            // Ajusta el puntaje del último jugador para que la suma sea cero
            scoresToSave[lastPlayer] = scoresToSave[lastPlayer] - totalScore

            // Muestra un mensaje indicando el ajuste
            alert(
                `El puntaje del último jugador "${lastPlayer}" ha sido ajustado en ${-totalScore} para que la suma sea cero.`
            )
        }

        // Guarda la ronda actualizada en el historial de rondas
        const updatedRounds = [...rounds]
        updatedRounds[editIndex] = scoresToSave
        setRounds(updatedRounds)

        // Reinicia los estados para la próxima edición o ronda
        setEditIndex(null)
        setEditScores(initialPlayerScores)
    }

    const handleRedo = () => {
        if (deletedRounds.length > 0) {
            // Toma la última ronda eliminada y el resto de las rondas eliminadas
            const [lastDeletedRound, ...remainingDeletedRounds] = deletedRounds

            // Verifica que lastDeletedRound tenga una propiedad 'index'
            if (typeof lastDeletedRound.index !== "number") {
                console.error(
                    "La ronda eliminada no tiene una propiedad index válida",
                    lastDeletedRound
                )
                return // Salir de la función si no hay un índice válido
            }

            setRounds((prevRounds) => {
                const updatedRounds = [...prevRounds]
                // Inserta la ronda eliminada en la posición correcta usando el índice
                updatedRounds.splice(
                    lastDeletedRound.index,
                    0,
                    lastDeletedRound.round
                )
                return updatedRounds
            })

            // Actualiza el estado de las rondas eliminadas
            setDeletedRounds(remainingDeletedRounds)
        }
    }
    const reversedRounds = [...rounds].reverse()
    const calculateTotalScore = () => {
        return Object.values(playerScores).reduce(
            (total, score) => total + score,
            0
        )
    }
    const onDragEnd = (result) => {
        if (!result.destination) {
            return
        }

        const items = Array.from(players)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        setPlayers(items)
    }
    return (
        <>
            <div className="game-board">
                <h1>Backgammon Chouette</h1>

                <div className="input-button">
                    <input
                        type="text"
                        value={playerName}
                        onChange={(e) =>
                            setPlayerName(e.target.value.toLocaleUpperCase())
                        }
                        placeholder="Agregar Jugador"
                        className="input-player-name"
                    />
                    <button className="button" onClick={addPlayer}>
                        Add Player
                    </button>
                </div>

                <div>
                    {/* Envuelve la lista de jugadores con DragDropContext y Droppable */}
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable-players">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {players.map((player, index) => (
                                        // Envuelve cada jugador con Draggable
                                        <Draggable
                                            key={player}
                                            draggableId={player}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <PlayerScore
                                                        player={player}
                                                        score={
                                                            playerScores[player]
                                                        }
                                                        updateScore={
                                                            updateScore
                                                        }
                                                        hover={hover}
                                                        handleMouseEnter={
                                                            handleMouseEnter
                                                        }
                                                        handleMouseLeave={
                                                            handleMouseLeave
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        flexFlow: "column wrap",
                    }}
                    className="score-check"
                >
                    {calculateTotalScore() === 0 ? (
                        <AiOutlineCheckCircle
                            color="green"
                            size={55}
                            title="La suma es cero"
                        />
                    ) : (
                        <>
                            <AiOutlineCloseCircle
                                color="red"
                                size={55}
                                title="La suma no es cero"
                            />
                            <p style={{ justifyContent: "center" }}>
                                LA SUMA NO DA CERO
                            </p>
                        </>
                    )}
                </div>
                {calculateTotalScore() === 0 && (
                    <button
                        className="button"
                        onClick={handleNextRound}
                        disabled={calculateTotalScore() !== 0}
                    >
                        Anotar
                    </button>
                )}
                <button className="button" onClick={handleReset}>
                    Reset
                </button>
                <button className="button" onClick={handleResetAll}>
                    Reset ALL
                </button>
                {deletedPlayers.length > 0 && (
                    <button
                        className="reincorporate-player-button"
                        onClick={reincorporatePlayer}
                    >
                        Volver a Incorporar Jugador
                    </button>
                )}

                <table className="table-container">
                    <thead>
                        <tr className="total-row ">
                            <th>Ronda / Jug.</th>
                            {players.map((player) => (
                                <th key={player}>{player}</th>
                            ))}
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="total-row">
                            <td className="total-column">Total</td>
                            {players.map((player) => (
                                <td key={player}>{totalRow[player] || 0}</td>
                            ))}
                            <td></td>
                        </tr>
                        {reversedRounds.map((round, index) => (
                            <tr key={index}>
                                <td>{reversedRounds.length - index}</td>

                                {players.map((player) => (
                                    <td key={player}>{round[player] || 0}</td>
                                ))}
                                <td>
                                    <div className="action-buttons">
                                        {editIndex !== index ? (
                                            <>
                                                <button
                                                    className="action-button delete-button"
                                                    onClick={() =>
                                                        handleDeleteRound(index)
                                                    }
                                                >
                                                    <RiDeleteBin6Line />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    className="action-button"
                                                    onClick={handleSaveRound}
                                                >
                                                    Guardar
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {deletedRounds.length > 0 && (
                    <button className="action-button" onClick={handleRedo}>
                        Rehacer
                    </button>
                )}
            </div>
        </>
    )
}

export default GameBoard

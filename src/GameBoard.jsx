import React, { useState, useEffect, useMemo } from "react"

import { RiDeleteBin6Line } from "react-icons/ri" // Ícono de eliminar (Remix Icon)
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai" // Importa los íconos de la librería
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import Swal from "sweetalert2"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function PlayerScore({
    player,
    score,
    updateScore,
    setScore,
    totalScore,
    removePlayer,
    accumulated,
}) {
    const handleUpdateScore = (points) => {
        updateScore(player, points)
    }

    const handleAutoComplete = () => {
        const resto = -(totalScore - score)
        setScore(player, resto)
    }

    return (
        <div className="player-score ">
            <h3 className="player-name">{player}</h3>
            <div className="accumulated-badge" title="Puntaje acumulado">{accumulated > 0 ? `+${accumulated}` : accumulated}</div>
            <button
                className="remove-player-button"
                onClick={() => removePlayer(player)}
                title="Eliminar jugador"
                style={{ position: 'absolute', top: 6, right: 6, background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', padding: 4, fontSize: '1.4rem', lineHeight: 1 }}
            >
                <RiDeleteBin6Line />
            </button>
            <div style={{ height: '2rem' }} />
            <p className="score">{score}</p>
            <div className="botonera">
                <button className="decrement-button" onClick={() => handleUpdateScore(-2)}>-2</button>
                <button className="decrement-button" onClick={() => handleUpdateScore(-1)}>-1</button>
                <button className="autocomplete-button" onClick={handleAutoComplete} title="Completar para que la suma dé cero">Suma</button>
                <button className="increment-button" onClick={() => handleUpdateScore(1)}>+1</button>
                <button className="increment-button" onClick={() => handleUpdateScore(2)}>+2</button>
            </div>
        </div>
    )
}

function GameBoard() {
    const [players, setPlayers] = useState([])
    const [playersOrder, setPlayersOrder] = useState([])

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
        if (savedPlayers) setPlayersOrder(savedPlayers)
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
            setPlayersOrder([...playersOrder, playerName])
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
        Swal.fire({
            title: "Desea eliminar todas las entradas?",
            text: "Esta accion no se podra deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Aceptar",
        }).then((result) => {
            if (result.isConfirmed) {
                // Borrar todos los datos del estado y del Local Storage
                setPlayers([])
                setPlayersOrder([])
                setRounds([])
                setPlayerScores({})
            }
        })
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
    const setScore = (player, value) => {
        setPlayerScores((prevScores) => ({
            ...prevScores,
            [player]: value,
        }))
        setEditScores((prevScores) => ({
            ...prevScores,
            [player]: value,
        }))
    }

    const removePlayer = (player) => {
        const score = playerScores[player] || 0
        const accumulated = totalRow[player] || 0
        const otherPlayers = players.filter((p) => p !== player)
        const otherPlayersOrder = playersOrder.filter((p) => p !== player)

        const doRemove = (target) => {
            setPlayerScores((prev) => {
                const updated = { ...prev }
                if (target) updated[target] = (updated[target] || 0) + score
                delete updated[player]
                return updated
            })
            setEditScores((prev) => {
                const updated = { ...prev }
                if (target) updated[target] = (updated[target] || 0) + score
                delete updated[player]
                return updated
            })
            setRounds((prev) => prev.map((round) => {
                const updated = { ...round }
                if (target) updated[target] = (updated[target] || 0) + (updated[player] || 0)
                delete updated[player]
                return updated
            }))
            setPlayers(otherPlayers)
            setPlayersOrder(otherPlayersOrder)
        }

        if (otherPlayers.length === 0) {
            doRemove(null)
            return
        }

        const options = otherPlayers.map((p) => `<option value="${p}">${p}</option>`).join("")
        const displayScore = accumulated !== 0 ? accumulated : score
        Swal.fire({
            title: `Eliminar a ${player}`,
            html: `Tiene ${displayScore > 0 ? "+" : ""}${displayScore} puntos acumulados. ¿A quién se los transferís?<br/><br/>
                <select id="transfer-select" class="swal2-select" style="width:100%;max-width:100%;box-sizing:border-box">
                    ${options}
                </select>`,
            confirmButtonText: "Transferir y eliminar",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            width: '80%',
            customClass: { popup: 'swal-compact' },
            preConfirm: () => document.getElementById("transfer-select").value,
        }).then((result) => {
            if (result.isConfirmed) doRemove(result.value)
        })
    }

    const handleReset = () => {
        setPlayerScores(initialPlayerScores)
        setEditIndex(null)
        setEditScores(initialPlayerScores)
    }

    const handleNextRound = () => {
        const total = Object.values(editScores).reduce((sum, s) => sum + s, 0)
        if (total !== 0) {
            Swal.fire({
                icon: "error",
                title: "La suma no es cero",
                text: `La suma actual es ${total > 0 ? "+" : ""}${total}. Corregí los puntajes antes de anotar.`,
            })
            return
        }
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

    const handleManualAdjust = () => {
        const inputs = playersOrder.map(p =>
            `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
                <label style="font-weight:bold;margin-right:8px">${p}</label>
                <input id="adj-${p}" type="number" value="0" class="swal2-input" style="width:90px;margin:0"/>
            </div>`
        ).join("")

        Swal.fire({
            title: "Ajuste manual",
            html: inputs,
            width: "80%",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Aplicar",
            preConfirm: () => {
                const values = {}
                let total = 0
                for (const p of playersOrder) {
                    const v = parseInt(document.getElementById(`adj-${p}`).value) || 0
                    values[p] = v
                    total += v
                }
                if (total !== 0) {
                    Swal.showValidationMessage(`La suma es ${total > 0 ? "+" : ""}${total}, debe ser cero`)
                    return false
                }
                return values
            }
        }).then((result) => {
            if (result.isConfirmed) {
                setRounds(prev => [...prev, { ...result.value, _ajuste: true }])
            }
        })
    }
    const handleRedo = () => {
        if (deletedRounds.length > 0) {
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
    const notify = () => {
        addPlayer()
        toast(`${playerName} se ha sumado a la Chouette`)
    }

    return (
        <>
            <div className="game-board">
                <h1>Backgammon Chouette</h1>

                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable-players">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {players.map((player, index) => (
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
                                                    score={playerScores[player]}
                                                    updateScore={updateScore}
                                                    setScore={setScore}
                                                    totalScore={calculateTotalScore()}
                                                    removePlayer={removePlayer}
                                                    accumulated={totalRow[player] || 0}
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
                {players.length > 0 && (
                    <>
                        <div
                            style={{ display: "flex", alignItems: "center", flexFlow: "column wrap" }}
                            className="score-check"
                        >
                            {calculateTotalScore() !== 0 && (
                                <>
                                    <AiOutlineCloseCircle color="red" size={55} title="La suma no es cero" />
                                    <p style={{ justifyContent: "center" }}>LA SUMA NO ES CERO</p>
                                </>
                            )}
                        </div>
                        {calculateTotalScore() === 0 && (
                            <button className="button btn-anotar" onClick={handleNextRound}>✔ Anotar</button>
                        )}
                        <button className="button btn-reset" onClick={handleReset}>↺ Reset</button>
                    </>
                )}

                {rounds.length > 0 && (
                    <table className="table-container">
                    <thead>
                        <tr className="total-row ">
                            <th style={{width: "2.5rem", minWidth: "2.5rem"}}>Rnd</th>
                            {playersOrder.map((player) => (
                                <th key={player}>{player}</th>
                            ))}
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="total-row">
                            <td className="total-column" style={{width: "2.5rem", minWidth: "2.5rem"}}>
                                {Object.values(totalRow).reduce((s, v) => s + v, 0) === 0 && playersOrder.length > 0 ? "✅" : "❌"}
                            </td>
                            {playersOrder.map((player) => (
                                <td key={player}>{totalRow[player] || 0}</td>
                            ))}
                            <td></td>
                        </tr>
                        {reversedRounds.map((round, index) => (
                            <tr key={index} style={round._ajuste ? {fontStyle:'italic', opacity: 0.85} : {}}>
                                <td>{round._ajuste ? "✏️" : playersOrder.reduce((s, p) => s + (round[p] || 0), 0) === 0 ? "✅" : "❌"}</td>
                                {playersOrder.map((player) => (
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
                )}

                {deletedRounds.length > 0 && (
                    <button className="action-button" onClick={handleRedo}>
                        Rehacer
                    </button>
                )}

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
                    <div>
                        <button className="button btn-add" onClick={notify}>✚ Jugador</button>
                        <ToastContainer
                            position="top-center"
                            autoClose={1000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            draggable
                            pauseOnHover
                            theme="light"
                            transition:Bounce
                        />
                    </div>
                </div>
                {players.length > 0 && (
                    <div className="bottom-actions">
                        <button className="button btn-adjust" onClick={handleManualAdjust}>✏️ Ajuste manual</button>
                        <button className="button btn-danger" onClick={handleResetAll}>🗑 Borrar partida</button>
                    </div>
                )}
            </div>
        </>
    )
}

export default GameBoard

import React, { useState, useEffect } from "react"
import PlayerScore from "./PlayerScore"

function GameBoard() {
    const initialPlayerScores = {
        A: 0,
        B: 0,
        C: 0,
    }

    const [playerScores, setPlayerScores] = useState(initialPlayerScores)
    const [rounds, setRounds] = useState([])
    const [roundCount, setRoundCount] = useState(0)
    const [editIndex, setEditIndex] = useState(null)
    const [editScores, setEditScores] = useState(initialPlayerScores)
    const [deletedRounds, setDeletedRounds] = useState([])

    const updateScore = (player, points) => {
        setEditScores((prevScores) => ({
            ...prevScores,
            [player]: prevScores[player] + points,
        }))
    }

    const handleReset = () => {
        setPlayerScores(initialPlayerScores)
        setEditIndex(null)
        setEditScores(initialPlayerScores)
        setRounds([])
        setDeletedRounds([])
    }

    const handleNextRound = () => {
        const totalScore = editScores.A + editScores.B + editScores.C
        const lastPlayer = Object.keys(editScores).find(
            (player) => editScores[player] === 0
        )
        const pointsToAdd = -totalScore

        if (totalScore !== 0) {
            setEditScores((prevScores) => ({
                ...prevScores,
                [lastPlayer]: prevScores[lastPlayer] + pointsToAdd,
            }))
            alert("La cuenta no da! deseas ajustarlo automaticamente?")
        } else {
            const updatedRounds = [...rounds, { ...editScores }]
            setRounds(updatedRounds)
            setPlayerScores(initialPlayerScores)
            setRoundCount(roundCount + 1)
            setEditIndex(null)
            setEditScores(initialPlayerScores)
        }
    }

    const handleDeleteRound = (index) => {
        const deletedRound = { index, round: rounds[index] }
        setRounds((prevRounds) => {
            const updatedRounds = [...prevRounds]
            updatedRounds.splice(index, 1)
            return updatedRounds
        })
        setDeletedRounds((prevDeletedRounds) => [
            deletedRound,
            ...prevDeletedRounds,
        ])
        setEditIndex(null)
    }

    const handleEditRound = (index) => {
        setEditIndex(index)
        setEditScores(rounds[index])
    }

    const handleSaveRound = () => {
        const totalScore = editScores.A + editScores.B + editScores.C
        if (totalScore !== 0) {
            alert("La cuenta no da! Modificar puntaje?")
            return
        }

        const updatedRounds = [...rounds]
        updatedRounds[editIndex] = editScores
        setRounds(updatedRounds)
        setEditIndex(null)
        setEditScores(initialPlayerScores)
    }

    const handleRedo = () => {
        if (deletedRounds.length > 0) {
            const { index, round } = deletedRounds[0]
            setRounds((prevRounds) => {
                const updatedRounds = [...prevRounds]
                updatedRounds.splice(index, 0, round)
                return updatedRounds
            })
            setDeletedRounds(deletedRounds.slice(1))
        }
    }

    return (
        <div className="game-board">
            <h2>Game Board</h2>
            <div className="player-scores">
                <PlayerScore
                    player="A"
                    score={editScores.A}
                    updateScore={updateScore}
                />
                <PlayerScore
                    player="B"
                    score={editScores.B}
                    updateScore={updateScore}
                />
                <PlayerScore
                    player="C"
                    score={editScores.C}
                    updateScore={updateScore}
                />
            </div>
            <button className="button" onClick={handleNextRound}>
                Next Round
            </button>
            <button className="button" onClick={handleReset}>
                Reset
            </button>

            <table>
                <thead>
                    <tr className="total-row">
                        <th>Ronda</th>
                        <th>Jugador A</th>
                        <th>Jugador B</th>
                        <th>Jugador C</th>

                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {rounds.map((round, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{round.A}</td>
                            <td>{round.B}</td>
                            <td>{round.C}</td>
                            <td>
                                {editIndex !== index ? (
                                    <>
                                        <button
                                            className="action-button"
                                            onClick={() =>
                                                handleEditRound(index)
                                            }
                                        >
                                           Modificar
                                        </button>
                                        <button
                                            className="action-button delete"
                                            onClick={() =>
                                                handleDeleteRound(index)
                                            }
                                        >
                                            Eliminar
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
                            </td>
                        </tr>
                    ))}
                    <tr className="total-row">
                        <td className="total-column">Total</td>
                        <td>
                            {rounds.reduce(
                                (total, round) => total + round.A,
                                0
                            )}
                        </td>
                        <td>
                            {rounds.reduce(
                                (total, round) => total + round.B,
                                0
                            )}
                        </td>
                        <td>
                            {rounds.reduce(
                                (total, round) => total + round.C,
                                0
                            )}
                        </td>
                        <td></td>
                    </tr>
                </tbody>
            </table>

            {deletedRounds.length > 0 && (
                <button className="action-button" onClick={handleRedo}>
                    Rehacer
                </button>
            )}
        </div>
    )
}

export default GameBoard

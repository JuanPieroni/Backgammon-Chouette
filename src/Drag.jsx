// Importa los componentes necesarios de react-beautiful-dnd
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

function GameBoard() {
    // ... (el resto de tu estado y lógica)

    // Esta función se llama cuando el arrastre finaliza
    const onDragEnd = (result) => {
        if (!result.destination) {
            return
        }

        const items = Array.from(players)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        setPlayers(items)
    }

    // ... (el resto de tu código)

    return (
        <>
            <div className="game-board">
                <h2>Game Board</h2>
                {/* ... (otros elementos de tu UI) */}

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
                                                    score={playerScores[player]}
                                                    updateScore={updateScore}
                                                    removePlayer={removePlayer}
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

                {/* ... (el resto de tu UI) */}
            </div>
        </>
    )
}

export default GameBoard

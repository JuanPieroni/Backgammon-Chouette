import React from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
const Drag = () => {
    return 
    (
        <DragDropContext>
  <Droppable droppableId="characters">
    {(provided) => (
      <ul className="characters">
        ...
      </ul>
    )}
  </Droppable>
</DragDropContext>
    )
}

export default Drag

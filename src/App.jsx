// App.js
import React from "react"
import GameBoard from "./GameBoard"
import Drag from "./Drag"


function App() {
    return (
        <div className="App">
            <h1>Backgammon Chouette</h1>
            <GameBoard />
            <Drag/>
        </div>
    )
}

export default App

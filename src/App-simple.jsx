import { useState } from 'react'
import './App.css'

function App() {
  const [score, setScore] = useState(0)

  return (
    <div className="app">
      <div className="game-header">
        <h1>Block Blast</h1>
        <div className="score">得分: {score}</div>
      </div>
      
      <div className="game-container">
        <div className="game-grid">
          {Array(81).fill(0).map((_, index) => (
            <div
              key={index}
              className="grid-cell"
              style={{
                backgroundColor: '#f0f0f0',
                border: '1px solid #ddd'
              }}
            />
          ))}
        </div>
        
        <div className="blocks-container">
          <h3>可放置的方塊</h3>
          <div className="blocks">
            <div className="block">
              <div
                className="block-cell"
                style={{
                  backgroundColor: '#FF6B6B',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 18,
                  height: 18,
                  border: '1px solid #333'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

import { useState, useEffect, useCallback } from 'react'
import './App.css'

// 遊戲常數
const GRID_SIZE = 9
const CELL_SIZE = 40

// 預定義的方塊形狀
const BLOCK_SHAPES = [
  [[1]],
  [[1, 1]],
  [[1], [1]],
  [[1, 1], [1, 1]],
]

// 隨機顏色
const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'
]

function App() {
  const [grid, setGrid] = useState(() => 
    Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0))
  )
  const [score, setScore] = useState(0)
  const [currentBlocks, setCurrentBlocks] = useState([])

  // 生成新的方塊
  const generateNewBlocks = useCallback(() => {
    const blocks = []
    for (let i = 0; i < 3; i++) {
      const shape = BLOCK_SHAPES[Math.floor(Math.random() * BLOCK_SHAPES.length)]
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      blocks.push({
        id: Date.now() + i,
        shape,
        color
      })
    }
    return blocks
  }, [])

  // 初始化遊戲
  useEffect(() => {
    setCurrentBlocks(generateNewBlocks())
  }, [generateNewBlocks])

  return (
    <div className="app">
      <div className="game-header">
        <h1>Block Blast</h1>
        <div className="score">得分: {score}</div>
      </div>
      
      <div className="game-container">
        <div className="game-grid">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="grid-cell"
                style={{
                  backgroundColor: cell || '#f0f0f0',
                  border: cell ? '1px solid #333' : '1px solid #ddd'
                }}
              />
            ))
          )}
        </div>
        
        <div className="blocks-container">
          <h3>可放置的方塊</h3>
          <div className="blocks">
            {currentBlocks.map(block => (
              <div
                key={block.id}
                className="block"
                style={{ cursor: 'grab' }}
              >
                {block.shape.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    cell ? (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className="block-cell"
                        style={{
                          backgroundColor: block.color,
                          position: 'absolute',
                          left: colIndex * 20,
                          top: rowIndex * 20,
                          width: 18,
                          height: 18,
                          border: '1px solid #333'
                        }}
                      />
                    ) : null
                  ))
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

import { useState, useEffect, useCallback } from 'react'
import './App.css'

// 類型定義
interface Block {
  id: number
  shape: number[][]
  color: string
}

interface BlastAnimation {
  type: 'blast' | 'double-blast' | 'triple-blast' | 'brilliant-blast'
  score: number
  lines: number
}

interface LineToClear {
  type: 'row' | 'col'
  index: number
}

interface PreviewPosition {
  x: number
  y: number
}

interface MousePosition {
  x: number
  y: number
}

// 遊戲常數
const GRID_SIZE = 8
const CELL_SIZE = 40

// 預定義的方塊形狀
const BLOCK_SHAPES = [
  // 單一方塊
  [[1]],
  // 直線
  [[1, 1]],
  [[1], [1]],
  // L 形
  [[1, 0], [1, 1]],
  [[0, 1], [1, 1]],
  [[1, 1], [0, 1]],
  [[1, 1], [1, 0]],
  // 正方形
  [[1, 1], [1, 1]],
  // T 形
  [[1, 1, 1], [0, 1, 0]],
  [[0, 1], [1, 1], [0, 1]],
  [[0, 1, 0], [1, 1, 1]],
  [[1, 0], [1, 1], [1, 0]],
  // 長條
  [[1, 1, 1]],
  [[1], [1], [1]],
  [[1, 1, 1, 1]],
  [[1], [1], [1], [1]],
]

// 隨機顏色
const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
]

function App(): React.JSX.Element {
  const [grid, setGrid] = useState<(string | number)[][]>(() => 
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0))
  )
  const [score, setScore] = useState<number>(0)
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [currentBlocks, setCurrentBlocks] = useState<Block[]>([])
  const [draggedBlock, setDraggedBlock] = useState<Block | null>(null)
  const [dragOffset, setDragOffset] = useState<MousePosition>({ x: 0, y: 0 })
  const [previewPosition, setPreviewPosition] = useState<PreviewPosition>({ x: -1, y: -1 })
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [clearingLines, setClearingLines] = useState<LineToClear[]>([])
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })
  const [, setGameEndTime] = useState<number | null>(null)
  const [countdown, setCountdown] = useState<number>(30)
  const [blastAnimation, setBlastAnimation] = useState<BlastAnimation | null>(null)

  // 生成新的方塊
  const generateNewBlocks = useCallback((): Block[] => {
    const blocks: Block[] = []
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

  // 檢查方塊是否可以放置在指定位置
  const canPlaceBlock = useCallback((block: Block, x: number, y: number): boolean => {
    for (let row = 0; row < block.shape.length; row++) {
      for (let col = 0; col < block.shape[row].length; col++) {
        if (block.shape[row][col]) {
          const newX = x + col
          const newY = y + row
          
          if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE) {
            return false
          }
          
          if (grid[newY][newX] !== 0) {
            return false
          }
        }
      }
    }
    return true
  }, [grid])

  // 初始化遊戲
  useEffect(() => {
    setCurrentBlocks(generateNewBlocks())
  }, [generateNewBlocks])

  // 當方塊更新時檢查遊戲是否結束
  useEffect(() => {
    if (currentBlocks.length > 0 && !gameOver) {
      // 簡化的遊戲結束檢測
      let canPlaceAny = false
      
      for (const block of currentBlocks) {
        for (let y = 0; y < GRID_SIZE && !canPlaceAny; y++) {
          for (let x = 0; x < GRID_SIZE && !canPlaceAny; x++) {
            if (canPlaceBlock(block, x, y)) {
              canPlaceAny = true
            }
          }
        }
        if (canPlaceAny) break
      }
      
      if (!canPlaceAny) {
        setGameOver(true)
        setGameEndTime(Date.now())
        setCountdown(30)
      }
    }
  }, [currentBlocks, grid, gameOver, canPlaceBlock])

  // 倒數計時效果
  useEffect(() => {
    if (gameOver && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
    // 移除自動繼續遊戲的邏輯，讓玩家主動點擊
  }, [gameOver, countdown])

  // 放置方塊
  const placeBlock = (block: Block, x: number, y: number): { success: boolean; newGrid: (string | number)[][] | null } => {
    if (!canPlaceBlock(block, x, y)) return { success: false, newGrid: null }

    const newGrid = grid.map(row => [...row])
    for (let row = 0; row < block.shape.length; row++) {
      for (let col = 0; col < block.shape[row].length; col++) {
        if (block.shape[row][col]) {
          newGrid[y + row][x + col] = block.color
        }
      }
    }
    return { success: true, newGrid }
  }

  // 計算得分和動畫類型
  const calculateScoreAndAnimation = (clearedLines: number): { score: number; animationType: BlastAnimation['type'] | null } => {
    let score = 0
    let animationType: BlastAnimation['type'] | null = null

    if (clearedLines === 1) {
      score = 100
      animationType = 'blast'
    } else if (clearedLines === 2) {
      score = 300
      animationType = 'double-blast'
    } else if (clearedLines === 3) {
      score = 500
      animationType = 'triple-blast'
    } else if (clearedLines >= 4) {
      score = clearedLines * 200
      animationType = 'brilliant-blast'
    }

    return { score, animationType }
  }

  // 檢查並消除完整的行和列
  const checkAndClearLines = (currentGrid: (string | number)[][]): { newGrid: (string | number)[][]; clearedLines: number } => {
    let newGrid = currentGrid.map(row => [...row])
    let clearedLines = 0
    const linesToClear: LineToClear[] = []

    // 檢查行
    for (let row = 0; row < GRID_SIZE; row++) {
      if (newGrid[row].every(cell => cell !== 0)) {
        linesToClear.push({ type: 'row', index: row })
        clearedLines++
      }
    }

    // 檢查列
    for (let col = 0; col < GRID_SIZE; col++) {
      if (newGrid.every(row => row[col] !== 0)) {
        linesToClear.push({ type: 'col', index: col })
        clearedLines++
      }
    }

    if (clearedLines > 0) {
      // 計算得分和動畫
      const { score, animationType } = calculateScoreAndAnimation(clearedLines)
      
      // 顯示消除動畫
      setClearingLines(linesToClear)
      
      // 顯示 Blast 動畫
      if (animationType) {
        setBlastAnimation({
          type: animationType,
          score: score,
          lines: clearedLines
        })
      }
      
      // 延遲消除以顯示動畫
      setTimeout(() => {
        // 實際消除行和列
        linesToClear.forEach(line => {
          if (line.type === 'row') {
            newGrid[line.index] = Array(GRID_SIZE).fill(0)
          } else {
            for (let row = 0; row < GRID_SIZE; row++) {
              newGrid[row][line.index] = 0
            }
          }
        })
        
        setGrid(newGrid)
        setScore(prev => prev + score)
        setClearingLines([])
        
        // 清除 Blast 動畫
        setTimeout(() => {
          setBlastAnimation(null)
        }, 1500)
      }, 500)
    }

    return { newGrid, clearedLines }
  }

  // 處理方塊放置
  const handleBlockPlace = (block: Block, x: number, y: number): void => {
    const result = placeBlock(block, x, y)
    if (result.success && result.newGrid) {
      // 先更新網格
      setGrid(result.newGrid)
      
      // 然後檢查並消除完整的行和列
      const { newGrid: clearedGrid } = checkAndClearLines(result.newGrid)
      setGrid(clearedGrid)
      
      setCurrentBlocks(prev => prev.filter(b => b.id !== block.id))
      
      // 如果沒有方塊了，生成新的
      if (currentBlocks.length === 1) {
        setCurrentBlocks(generateNewBlocks())
      }
      
      // 不在這裡檢查遊戲結束，讓 useEffect 處理
    }
  }



  // 拖拽開始（支援滑鼠和觸控）
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, block: Block): void => {
    e.preventDefault()
    setDraggedBlock(block)
    setIsDragging(true)
    
    // 計算方塊的中心點作為偏移量
    const blockWidth = Math.max(...block.shape.map(row => row.length)) * 22
    const blockHeight = block.shape.length * 22
    
    setDragOffset({
      x: blockWidth / 2,
      y: blockHeight / 2
    })
    
    // 獲取觸控或滑鼠位置
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    // 設置初始位置
    setMousePosition({ x: clientX, y: clientY })
  }

  // 拖拽移動（支援滑鼠和觸控）
  const handleDragMove = (e: MouseEvent | TouchEvent): void => {
    if (!isDragging || !draggedBlock) return

    // 獲取觸控或滑鼠位置
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

    // 更新位置
    setMousePosition({ x: clientX, y: clientY })

    const gameGrid = document.querySelector('.game-grid')
    if (gameGrid) {
      const rect = gameGrid.getBoundingClientRect()
      
      // 擴大檢測範圍，讓預覽更靈敏
      const expandedRect = {
        left: rect.left - 80,
        right: rect.right + 80,
        top: rect.top - 80,
        bottom: rect.bottom + 80
      }
      
      // 檢查滑鼠是否在擴大的範圍內
      if (clientX >= expandedRect.left && clientX <= expandedRect.right &&
          clientY >= expandedRect.top && clientY <= expandedRect.bottom) {
        
        // 計算相對於網格的位置
        const relativeX = clientX - rect.left
        const relativeY = clientY - rect.top
        
        const x = Math.floor(relativeX / CELL_SIZE)
        const y = Math.floor(relativeY / CELL_SIZE)

        // 智能預覽：尋找最佳預覽位置
        const findBestPreviewPosition = (targetX: number, targetY: number): PreviewPosition => {
          // 確保在有效範圍內
          const clampedX = Math.max(0, Math.min(GRID_SIZE - 1, targetX))
          const clampedY = Math.max(0, Math.min(GRID_SIZE - 1, targetY))
          
          // 嘗試原始位置
          if (canPlaceBlock(draggedBlock, clampedX, clampedY)) {
            return { x: clampedX, y: clampedY }
          }
          
          // 嘗試周圍位置
          const offsets = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
          ]
          
          for (const [dx, dy] of offsets) {
            const newX = Math.max(0, Math.min(GRID_SIZE - 1, clampedX + dx))
            const newY = Math.max(0, Math.min(GRID_SIZE - 1, clampedY + dy))
            
            if (canPlaceBlock(draggedBlock, newX, newY)) {
              return { x: newX, y: newY }
            }
          }
          
          return { x: -1, y: -1 }
        }
        
        const bestPosition = findBestPreviewPosition(x, y)
        setPreviewPosition(bestPosition)
      } else {
        setPreviewPosition({ x: -1, y: -1 })
      }
    }
  }

  // 拖拽結束（支援滑鼠和觸控）
  const handleDragEnd = (e: MouseEvent | TouchEvent): void => {
    if (!draggedBlock || !isDragging) return

    // 獲取觸控或滑鼠位置
    const clientX = 'touches' in e ? e.changedTouches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.changedTouches[0].clientY : e.clientY

    const gameGrid = document.querySelector('.game-grid')
    if (gameGrid) {
      const rect = gameGrid.getBoundingClientRect()
      
      // 使用相同的擴大檢測範圍
      const expandedRect = {
        left: rect.left - 80,
        right: rect.right + 80,
        top: rect.top - 80,
        bottom: rect.bottom + 80
      }
      
      // 檢查是否在擴大範圍內
      if (clientX >= expandedRect.left && clientX <= expandedRect.right &&
          clientY >= expandedRect.top && clientY <= expandedRect.bottom) {
        
        const relativeX = clientX - rect.left
        const relativeY = clientY - rect.top
        
        const x = Math.floor(relativeX / CELL_SIZE)
        const y = Math.floor(relativeY / CELL_SIZE)

        // 智能放置：嘗試多個位置
        const tryPlaceAt = (targetX: number, targetY: number): boolean => {
          // 確保在有效範圍內
          const clampedX = Math.max(0, Math.min(GRID_SIZE - 1, targetX))
          const clampedY = Math.max(0, Math.min(GRID_SIZE - 1, targetY))
          
          // 嘗試原始位置
          if (canPlaceBlock(draggedBlock, clampedX, clampedY)) {
            handleBlockPlace(draggedBlock, clampedX, clampedY)
            return true
          }
          
          // 嘗試周圍的位置（容錯機制）
          const offsets = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
          ]
          
          for (const [dx, dy] of offsets) {
            const newX = Math.max(0, Math.min(GRID_SIZE - 1, clampedX + dx))
            const newY = Math.max(0, Math.min(GRID_SIZE - 1, clampedY + dy))
            
            if (canPlaceBlock(draggedBlock, newX, newY)) {
              handleBlockPlace(draggedBlock, newX, newY)
              return true
            }
          }
          
          return false
        }
        
        tryPlaceAt(x, y)
      }
    }

    setDraggedBlock(null)
    setIsDragging(false)
    setPreviewPosition({ x: -1, y: -1 })
  }


  // 添加全域滑鼠和觸控事件監聽器
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleDragMove(e)
    const handleMouseUp = (e: MouseEvent) => handleDragEnd(e)
    const handleTouchMove = (e: TouchEvent) => handleDragMove(e)
    const handleTouchEnd = (e: TouchEvent) => handleDragEnd(e)

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging, draggedBlock])

  // 重新開始遊戲
  const restartGame = (): void => {
    setGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0)))
    setScore(0)
    setGameOver(false)
    setCurrentBlocks(generateNewBlocks())
    setGameEndTime(null)
    setCountdown(30)
  }

  // 繼續遊戲（30秒後自動繼續）
  const continueGame = (): void => {
    setGameOver(false)
    setCurrentBlocks(generateNewBlocks())
    setGameEndTime(null)
    setCountdown(30)
  }

  // 立即重新開始
  const restartNow = (): void => {
    restartGame()
  }

  return (
    <div className="app">
      <div className="game-header">
        <img 
          src="block-blast-logo.png" 
          alt="Block Blast Logo" 
          className="game-logo"
        />
        <div className="score">得分: {score}</div>
      </div>
      
      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-modal">
            <h2>遊戲結束</h2>
            <p className="final-score">最終得分: {score}</p>
            <div className="countdown-container">
              <p className="countdown-text">
                {countdown > 0 ? `等待 ${countdown} 秒後可選擇繼續` : '請選擇繼續遊戲或重新開始'}
              </p>
              <div className="countdown-bar">
                <div 
                  className="countdown-progress" 
                  style={{ width: `${(countdown / 30) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="game-over-buttons">
              <button 
                onClick={continueGame} 
                className={`continue-btn ${countdown > 0 ? 'disabled' : ''}`}
                disabled={countdown > 0}
              >
                {countdown > 0 ? `等待 ${countdown} 秒` : '繼續遊戲'}
              </button>
              <button onClick={restartNow} className="restart-btn">
                重新開始
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blast 動畫 */}
      {blastAnimation && (
        <div className="blast-animation-overlay">
          <div className={`blast-animation ${blastAnimation.type}`}>
            <div className="blast-text">
              {blastAnimation.type === 'blast' && 'BLAST!'}
              {blastAnimation.type === 'double-blast' && 'DOUBLE BLAST!'}
              {blastAnimation.type === 'triple-blast' && 'TRIPLE BLAST!'}
              {blastAnimation.type === 'brilliant-blast' && 'BRILLIANT BLAST!'}
            </div>
            <div className="blast-score">+{blastAnimation.score}</div>
          </div>
        </div>
      )}

      {/* 拖拽中的方塊預覽 */}
      {isDragging && draggedBlock && (
        <div 
          className="dragging-block"
          style={{
            position: 'fixed',
            left: mousePosition.x - dragOffset.x,
            top: mousePosition.y - dragOffset.y,
            pointerEvents: 'none',
            zIndex: 1000,
            transform: 'translate(-50%, -50%)',
            opacity: 0.8
          }}
        >
          {draggedBlock.shape.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              cell ? (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="block-cell"
                  style={{
                    backgroundColor: draggedBlock.color,
                    position: 'absolute',
                    left: colIndex * CELL_SIZE,
                    top: rowIndex * CELL_SIZE,
                    width: CELL_SIZE - 2,
                    height: CELL_SIZE - 2,
                    border: '1px solid #333',
                    borderRadius: '4px'
                  }}
                />
              ) : null
            ))
          )}
        </div>
      )}
      
      <div className="game-container">
        <div className="game-grid">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              // 檢查是否在預覽位置
              const isPreview = isDragging && 
                previewPosition.x >= 0 && 
                previewPosition.y >= 0 &&
                draggedBlock &&
                canPlaceBlock(draggedBlock, previewPosition.x, previewPosition.y) &&
                rowIndex >= previewPosition.y && 
                rowIndex < previewPosition.y + draggedBlock.shape.length &&
                colIndex >= previewPosition.x && 
                colIndex < previewPosition.x + (draggedBlock.shape[0]?.length || 0) &&
                draggedBlock.shape[rowIndex - previewPosition.y] && 
                draggedBlock.shape[rowIndex - previewPosition.y][colIndex - previewPosition.x]

              // 檢查是否在消除的行或列中
              const isClearing = clearingLines.some(line => 
                (line.type === 'row' && line.index === rowIndex) ||
                (line.type === 'col' && line.index === colIndex)
              )

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`grid-cell ${isPreview ? 'preview' : ''} ${isClearing ? 'clearing' : ''}`}
                  style={{
                    backgroundColor: (cell as string) || (isPreview ? draggedBlock.color : '#f0f0f0'),
                    border: cell ? '1px solid #333' : (isPreview ? '2px dashed #ff6b6b' : '1px solid #ddd'),
                    opacity: isPreview ? 0.7 : (isClearing ? 0.3 : 1)
                  }}
                />
              )
            })
          )}
        </div>
        
        <div className="blocks-container">
          <h3>可放置的方塊</h3>
          <div className="blocks-wrapper">
            <div className="blocks">
              {currentBlocks.map(block => (
                <div
                  key={block.id}
                  className="block"
                  onMouseDown={(e) => handleDragStart(e, block)}
                  onTouchStart={(e) => handleDragStart(e, block)}
                  style={{ 
                    cursor: isDragging && draggedBlock?.id === block.id ? 'grabbing' : 'grab',
                    opacity: isDragging && draggedBlock?.id === block.id ? 0.5 : 1,
                    touchAction: 'none'
                  }}
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
                          left: colIndex * 22 + 10,
                          top: rowIndex * 22 + 10,
                          width: 20,
                          height: 20,
                          border: '1px solid #333',
                          borderRadius: '3px'
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
    </div>
  )
}

export default App

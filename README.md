# 🎮 Block Blast 遊戲

一個使用 **React TypeScript** 和 **Vite** 開發的現代化方塊消除遊戲，具有華麗的動畫效果和直觀的操作體驗。

## ✨ 遊戲特色

### 🎯 核心玩法
- **8x8 遊戲網格** - 緊湊而刺激的遊戲體驗
- **智能拖拽系統** - 流暢的拖拽操作和即時預覽
- **點擊快速放置** - 點擊方塊自動放置到最佳位置
- **行/列消除機制** - 填滿整行或整列時自動消除

### 🎊 華麗動畫系統
- **BLAST!** - 消除1排，獲得100分
- **DOUBLE BLAST!** - 同時消除2排，獲得300分
- **TRIPLE BLAST!** - 同時消除3排，獲得500分
- **BRILLIANT BLAST!** - 同時消除4排以上，獲得排數×200分

### 🎨 視覺設計
- **3D 彩色 Logo** - 仿照官方設計的立體標題
- **漸層背景** - 現代化的紫色漸層背景
- **玻璃質感** - 半透明毛玻璃效果的 UI 元素
- **流暢動畫** - 方塊放置、消除、拖拽的視覺效果
- **響應式設計** - 完美支援桌面和行動裝置

### 🎮 遊戲機制
- **智能遊戲結束檢測** - 當無法放置任何方塊時自動檢測
- **30秒等待機制** - 遊戲結束後提供思考時間
- **繼續遊戲選項** - 可選擇繼續或重新開始
- **多樣方塊形狀** - 16種不同的方塊形狀組合

## 📁 專案架構

```
block-blast/
├── public/                          # 靜態資源
│   ├── block-blast-logo.png        # 遊戲 Logo 圖片
│   └── vite.svg                    # Vite 圖標
├── src/                            # 源代碼
│   ├── App.tsx                     # 主要遊戲組件
│   ├── App.css                     # 主要樣式文件
│   ├── index.css                   # 全域樣式
│   └── main.tsx                    # 應用程式入口點
├── tsconfig.json                   # TypeScript 主配置
├── tsconfig.node.json             # Node.js TypeScript 配置
├── vite.config.js                 # Vite 建置配置
├── package.json                   # 專案依賴和腳本
├── package-lock.json              # 鎖定依賴版本
├── eslint.config.js               # ESLint 配置
├── index.html                     # HTML 模板
├── .gitignore                     # Git 忽略文件
└── README.md                      # 專案說明文件
```

### 🏗️ 核心文件說明

#### `src/App.tsx` - 主要遊戲邏輯
```typescript
// 主要功能模組
├── 類型定義 (Block, BlastAnimation, etc.)
├── 遊戲常數 (GRID_SIZE, BLOCK_SHAPES, COLORS)
├── 狀態管理 (useState Hooks)
├── 遊戲邏輯
│   ├── generateNewBlocks()      # 生成新方塊
│   ├── canPlaceBlock()          # 檢查方塊是否可放置
│   ├── placeBlock()             # 放置方塊
│   ├── checkAndClearLines()     # 檢查並消除完整行列
│   └── calculateScoreAndAnimation() # 計算得分和動畫
├── 拖拽系統
│   ├── handleDragStart()        # 開始拖拽
│   ├── handleDragMove()         # 拖拽移動
│   └── handleDragEnd()          # 結束拖拽
├── 遊戲控制
│   ├── handleBlockPlace()       # 處理方塊放置
│   ├── handleBlockClick()       # 點擊放置
│   ├── restartGame()           # 重新開始
│   └── continueGame()          # 繼續遊戲
└── UI 渲染 (JSX)
```

#### `src/App.css` - 樣式系統
```css
├── 基礎佈局
│   ├── .app                    # 主容器
│   ├── .game-header           # 標題區域
│   └── .game-container        # 遊戲容器
├── 遊戲網格
│   ├── .game-grid             # 8x8 網格佈局
│   ├── .grid-cell             # 單個網格格子
│   └── .grid-cell.preview     # 預覽效果
├── 方塊系統
│   ├── .blocks-container      # 方塊容器
│   ├── .block                 # 單個方塊
│   └── .block-cell            # 方塊單元格
├── Blast 動畫
│   ├── .blast-animation-overlay # 動畫覆蓋層
│   ├── .blast-animation       # 動畫容器
│   ├── .blast-text           # Blast 文字
│   └── .blast-score          # 得分顯示
├── 遊戲結束
│   ├── .game-over-overlay    # 結束覆蓋層
│   ├── .game-over-modal      # 結束模態框
│   └── .countdown-container  # 倒數計時
└── 響應式設計
    └── @media queries        # 手機適配
```

## 🎯 遊戲規則

1. **放置方塊**：將下方的方塊拖拽或點擊放置到 8x8 的遊戲網格上
2. **消除機制**：當整行或整列被填滿時，該行/列會自動消除
3. **得分系統**：
   - 1排消除：100分
   - 2排同時消除：300分
   - 3排同時消除：500分
   - 4排以上同時消除：排數 × 200分
4. **遊戲結束**：當無法放置任何方塊時，遊戲結束並提供選擇

## 🚀 快速開始

### 安裝依賴
```bash
npm install
```

### 啟動開發伺服器
```bash
npm run dev
```

### 建置生產版本
```bash
npm run build
```

### TypeScript 類型檢查
```bash
npx tsc --noEmit
```

## 🛠️ 技術架構

### 前端技術棧
- **React 18** - 現代化的 React 框架
- **TypeScript** - 類型安全的 JavaScript
- **Vite** - 快速的建置工具
- **CSS3** - 現代化的樣式和動畫

### 核心依賴
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "typescript": "^5.6.2",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@types/node": "^22.7.4",
    "vite": "^7.1.7"
  }
}
```

### 核心功能
- **React Hooks** - useState, useEffect, useCallback 狀態管理
- **CSS Grid** - 響應式網格佈局系統
- **CSS 動畫** - 關鍵幀動畫和過渡效果
- **事件處理** - 滑鼠拖拽和點擊事件
- **TypeScript 介面** - 完整的類型定義

### 代碼特色
- **模組化設計** - 清晰的組件結構
- **類型安全** - 完整的 TypeScript 類型註解
- **性能優化** - useCallback 和 useMemo 優化
- **可維護性** - 清晰的代碼結構和註釋

## 🎮 遊戲控制

### 操作方式
- **拖拽放置** - 按住方塊並拖拽到網格上，會顯示即時預覽
- **點擊放置** - 點擊方塊自動放置到第一個可用位置
- **遊戲結束** - 30秒等待後可選擇繼續或重新開始

### 視覺反饋
- **拖拽預覽** - 白色發光邊框顯示放置位置
- **消除動畫** - 華麗的 Blast 動畫效果
- **得分顯示** - 動態得分彈出效果

## 📱 瀏覽器支援

- ✅ **Chrome** (推薦)
- ✅ **Firefox**
- ✅ **Safari**
- ✅ **Edge**
- ✅ **行動裝置瀏覽器**

## 🎨 設計靈感

本遊戲的 UI 設計參考了經典的 Block Blast 遊戲，並加入了現代化的視覺效果：
- 3D 立體 Logo 設計
- 華麗的消除動畫效果
- 現代化的玻璃質感 UI
- 流暢的拖拽互動體驗

## 🏆 遊戲目標

挑戰您的空間思維和策略規劃能力！
- 🎯 獲得高分
- 🎊 觸發華麗的 Blast 動畫
- 🧠 規劃最佳的方塊放置策略
- ⏰ 在遊戲結束前盡可能消除更多方塊

## 🔧 開發說明

### 本地開發
1. Clone 專案到本地
2. 安裝依賴：`npm install`
3. 啟動開發伺服器：`npm run dev`
4. 打開瀏覽器訪問 `http://localhost:5173`

### 建置部署
```bash
npm run build    # 建置生產版本
npm run preview  # 預覽生產版本
```

### 代碼檢查
```bash
npx tsc --noEmit  # TypeScript 類型檢查
npm run lint      # ESLint 代碼檢查
```

**準備好體驗最華麗的方塊消除遊戲了嗎？** 🚀

---

*使用 React TypeScript + Vite 開發 | 現代化遊戲體驗*

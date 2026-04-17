# 專案資源 Dashboard 規劃書

## 文件目的
這份文件是提供給負責實作的 AI / 開發助手使用，目標是快速理解產品定位、功能範圍、資訊架構、互動流程、資料模型與實作優先順序，並依此開發一個**個人使用**的「專案資源 Dashboard」。

此產品不是完整的資源管理平台，也不是多人協作系統；它的核心價值是：
- 幫助使用者記住每個專案目前的開發進度。
- 集中查看每個專案的資源託管位置。
- 讓使用者能從單一介面直接跳轉到 GitHub、前端平台、後端平台、資料庫、認證服務、網域管理等頁面。
- 兼具「書籤中心 + 專案狀態備忘錄 + 開發記事板」的作用。

## 產品定位

### 核心問題
使用者同時開發很多專案，而且每個專案的前端、後端、資料庫、驗證服務、網域、程式碼倉庫可能分散在不同平台，容易出現以下問題：
- 忘記某個專案的前端部署在哪個平台。
- 忘記後端 API 或 DB 使用哪個供應商。
- 忘記 GitHub repo、正式站、測試站、管理後台的連結。
- 忘記專案目前做到哪裡、還缺哪些事項。
- 臨時需要進入某個資源頁面時，還要翻紀錄、書籤或搜尋瀏覽器歷史。

### 產品目標
建立一個單人使用的 Dashboard，以「專案卡片 -> 專案詳情 -> 資源卡片 / Todo / Notes」的方式組織資訊。

### 非目標
以下內容**不在第一版範圍內**：
- 不做團隊協作。
- 不做權限角色系統。
- 不做真正的雲端資源監控。
- 不串接各平台 API 自動同步狀態。
- 不做複雜的專案管理流程（如甘特圖、工時、指派）。
- 不做完整 CMS 或知識庫。

## 目標使用者

### 主要使用者
僅限產品擁有者本人。

### 使用情境
- 開始一天工作前，快速確認有哪些專案正在進行。
- 點進某個專案後，快速找到它的 GitHub repo、Vercel、Railway、Supabase、Cloudflare 等入口。
- 查看這個專案目前的 checklist 進度。
- 追加一筆臨時備忘，例如「OAuth redirect URI 還沒補」、「正式網域 DNS 尚未切換」。
- 回頭接手一個過幾週沒碰的 side project 時，可快速恢復上下文。

## 產品原則
- **個人優先**：不為多人協作過度設計。
- **快速進入**：首頁應該在極短時間內幫助使用者找到想進入的專案。
- **資訊可掃描**：每種資源類型要容易辨識，最好有 icon 與標籤。
- **少切換頁面**：專案詳情頁應把資源、todo、記事集中展示。
- **書籤化**：所有重要資源都要可一鍵跳轉。
- **易於手動維護**：比起高度自動化，更重視新增、編輯資訊要夠簡單。
- **視覺風格偏開發者工具**：深色背景、科技感、像 Railway 一樣帶有畫布感與高亮邊框卡片。

## 功能範圍

### 1. 首頁：專案總覽
首頁顯示所有專案卡片，每張卡片代表一個專案。

每張專案卡片至少包含：
- 專案名稱
- 簡短描述
- 狀態（進行中 / 暫停 / 已上線 / 構想中）
- 資源數量摘要
- Todo 完成比例
- 最後更新時間
- 點擊後可進入專案詳情頁

首頁應支援：
- 專案搜尋
- 依狀態篩選
- 依最後更新時間排序
- 依名稱排序
- 新增專案按鈕

### 2. 專案詳情頁
點進專案後，進入該專案的主畫面。這個頁面是日常主要操作區。

專案詳情頁包含三大區塊：
1. 專案基本資訊
2. 資源卡片區
3. Todo 與 Notes 區

### 3. 資源卡片區
每個專案可以有多個資源卡片，卡片是此產品的核心資料單位之一。

每張資源卡片包含：
- title：資源名稱
- category：資源種類
- url：超連結
- note：備註
- icon：依 category 自動顯示對應 icon
- 可點擊直接開啟外部頁面

### 4. 資源類別
第一版固定支援以下資源類別：
- 前端託管平台
- 後端託管平台
- 程式碼庫（GitHub）
- DB
- 使用者認證代理
- 網域

建議系統內部 category key：
- frontend
- backend
- repository
- database
- auth
- domain

建議保留擴充性，未來可加入：
- storage
- queue
- analytics
- monitoring
- docs
- design
- payments
- ai-service

### 5. Todo Checklist
每個專案都有自己的 todo-list。

Todo 項目需求：
- 可新增項目
- 可勾選完成
- 完成後顯示刪除線
- 可刪除項目
- 可依完成 / 未完成篩選
- 顯示總數與完成率

建議補充欄位：
- priority（low / medium / high）
- dueDate（可選）
- tags（可選）

但若要保持第一版簡潔，priority 與 dueDate 可先不做 UI，只在資料模型中預留。

### 6. Notes / 留言板 / 開發記事
每個專案需要一個可持續往下添加的記事區，類似留言板或開發日誌。

需求：
- 可以新增一則 note
- note 以時間倒序或正序顯示
- 每則 note 顯示建立時間
- 適合記錄短備忘、臨時發現、下次接手提示
- 支援純文字即可，第一版不需要 markdown 編輯器

建議：
- 預設使用倒序，讓最近更新最先看到
- 每則 note 以卡片或時間軸樣式呈現

## 資訊架構

### 頁面結構
建議最少頁面結構如下：

1. `/` 首頁：專案列表
2. `/project/:id` 專案詳情頁

如果不想做多頁路由，也可以採用單頁應用：
- Home View：專案卡片牆
- Detail View：切換到選定專案內容

### 導航層級
- 第一層：專案清單
- 第二層：單一專案內部資訊

### 專案詳情頁區塊排序建議
1. 頂部：專案標題、描述、狀態、快速操作
2. 中段：資源卡片區
3. 下段左側：Todo
4. 下段右側：Notes

手機版則改為單欄堆疊：
1. 標題資訊
2. 資源卡片
3. Todo
4. Notes

## 介面與視覺風格

### 視覺方向
整體風格參考 Railway 類型的開發者工具介面，但不需要完全複製。

關鍵風格詞：
- 深色背景
- 畫布感 / 工作台感
- 卡片發光邊緣
- 高對比資訊層級
- 現代、克制、不花俏
- 類似 infra / deploy / dashboard 工具的質感

### 視覺元素建議
- 背景使用深灰到近黑色
- 可加極淡網格、噪點或畫布紋理
- 卡片採深色面板，外框用低彩度高亮邊緣
- hover 時出現微弱 glow 與位移
- icon 以單色或少量分類色區分
- 避免過度鮮豔與過多顏色

### 色彩建議
可採以下方向：
- 背景：#0b0f14 / #0f1117 / #111827 一類
- 卡片：比背景略亮一階
- 邊框：低透明白 + 類霓虹高光
- 主強調色：藍綠 / 青色 / 紫藍擇一，不宜太多
- 成功狀態：綠色
- 暫停狀態：灰色 / 黃色
- 警示：橘色 / 紅色

### 字體與資訊密度
- 整體偏 dashboard 風格，不要太像行銷頁
- 字體清晰、偏中性科技感 sans-serif
- 首頁重視掃描效率
- 詳情頁重視資訊分區與可讀性

## 元件設計

### 專案卡片
用途：首頁顯示專案摘要。

建議內容：
- 專案名稱
- 簡介
- 狀態 badge
- 資源統計（例如 6 resources）
- Todo 完成率（例如 5/8）
- 最後更新時間

互動：
- 整張卡片可點擊
- hover 有邊框高亮 / 陰影 / 微動效

### 資源卡片
用途：在專案詳情頁呈現可跳轉的資源入口。

建議內容：
- icon
- title
- category badge
- note
- 外部連結 icon
- URL 網域簡短顯示（可選）

互動：
- 點擊卡片或按鈕直接開啟連結
- 可提供複製連結按鈕（第二版）
- 可編輯 / 刪除（第一版可先做簡單 modal / drawer）

### Todo 面板
用途：管理該專案待辦事項。

建議內容：
- 面板標題與完成率
- 輸入框 + 新增按鈕
- checklist 列表
- 已完成項目有刪除線與較淡樣式

互動：
- 勾選即更新狀態
- 支援快速新增
- 已完成與未完成可切換顯示

### Notes 面板
用途：記錄持續追加的開發記事。

建議內容：
- 標題
- 多行輸入框
- 發佈按鈕
- note 列表
- 時間戳記

互動：
- 新增後即出現在列表中
- 列表可滾動
- 保持簡單，不做 threaded comments

## Icon 對應建議
資源類型要有穩定的 icon 對應，便於掃描。

建議如下：

| 類型 | key | icon 建議 | 補充 |
|---|---|---|---|
| 前端託管平台 | frontend | Globe / Monitor / Layout | 代表網站前台 |
| 後端託管平台 | backend | Server / Boxes | 代表 API / service |
| 程式碼庫 | repository | GitBranch / Github | GitHub repo |
| 資料庫 | database | Database / Cylinder | DB service |
| 認證代理 | auth | Shield / Key / Lock | Clerk, Auth0, Supabase Auth 等 |
| 網域 | domain | Link / Globe2 / Orbit | DNS, 網域託管 |

若使用 Lucide、Phosphor 或 Heroicons，請建立 category-icon map，避免 icon 使用混亂。

## 關鍵使用流程

### 流程 1：查看專案資源
1. 使用者開啟首頁。
2. 看見所有專案卡片。
3. 點擊其中一個專案。
4. 進入詳情頁後看到所有資源卡片。
5. 點擊資源卡片直接跳轉到相關網站。

### 流程 2：回顧專案進度
1. 進入專案詳情頁。
2. 查看 Todo 面板。
3. 知道目前已完成與未完成項目。
4. 透過 Notes 了解最近一次工作記錄。

### 流程 3：補充新資源
1. 在專案詳情頁點擊新增資源。
2. 填寫 title、category、url、note。
3. 儲存後新增一張資源卡片。
4. 卡片立即可在畫面上點擊使用。

### 流程 4：新增臨時備忘
1. 進入專案詳情頁。
2. 在 Notes 輸入區寫下新備忘。
3. 送出後 note 追加到列表頂端。

## 資料模型建議
以下為建議的基本資料結構，供 AI 實作時參考。

### Project
```ts
interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'paused' | 'launched' | 'idea';
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}
```

### Resource
```ts
interface Resource {
  id: string;
  projectId: string;
  title: string;
  category: 'frontend' | 'backend' | 'repository' | 'database' | 'auth' | 'domain';
  url: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Todo
```ts
interface TodoItem {
  id: string;
  projectId: string;
  text: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
}
```

### Note
```ts
interface ProjectNote {
  id: string;
  projectId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}
```

## 首頁需求細節

### 專案卡片欄位
首頁專案卡片建議顯示：
- 專案名稱
- 一句描述
- 狀態 badge
- 資源總數
- Todo 完成比例
- 最近更新時間

### 首頁操作功能
- 新增專案
- 搜尋專案名稱
- 狀態篩選
- 排序切換

### 空狀態
若尚未建立專案，首頁應顯示友善空狀態：
- 標題：尚未建立任何專案
- 說明：新增第一個專案來整理你的部署與資源連結
- CTA：建立專案

## 專案詳情頁需求細節

### 頂部區塊
顯示：
- 專案名稱
- 簡介
- 狀態
- 建立時間 / 更新時間
- 操作按鈕（編輯專案、刪除專案、新增資源）

### 資源區塊
建議：
- 使用 grid 方式排列資源卡片
- 可依類型分組或全部平鋪
- 每張卡片可直接外連

可考慮兩種呈現方式：
1. 平鋪式：全部資源一起顯示，靠 badge 區分類型
2. 分組式：依 frontend/backend/repository/database/auth/domain 分段顯示

第一版建議平鋪式，較簡單直觀。

### Todo 區塊
需求：
- 新增 todo
- 勾選完成
- 顯示刪除線
- 刪除 todo
- 顯示完成率

### Notes 區塊
需求：
- 新增 note
- 顯示時間
- 顯示內容
- 可持續向下累積

## CRUD 範圍
第一版建議至少支援以下 CRUD：

### Project
- Create
- Read
- Update
- Delete

### Resource
- Create
- Read
- Update
- Delete

### Todo
- Create
- Read
- Update（至少支援 completed 切換）
- Delete

### Note
- Create
- Read
- Delete

若要壓縮工期，可先不做 Note 編輯。

## 技術實作方向建議
這部分不是硬性規定，而是給 AI coding assistant 的建議方向。

### 前端建議
適合用以下任一組合：
- Next.js + React + Tailwind CSS
- Vite + React + Tailwind CSS
- Nuxt / Vue 也可，但若以元件管理與快速生成來說 React 生態較直觀

### 資料儲存建議
如果是給自己使用，第一版可以有三種路線：

#### 路線 A：純前端 + Local DB / local storage
優點：
- 開發快
- 不需後端
- 適合先驗證介面與操作流程

缺點：
- 跨裝置不同步
- 資料可靠性較弱

#### 路線 B：Supabase
優點：
- 很適合個人工具
- 可快速建立 projects / resources / todos / notes 資料表
- 可保有未來擴充空間
- 可順便加入登入

缺點：
- 稍微多一些初始化工作

#### 路線 C：自有後端 + DB
優點：
- 自主性高
- 架構完整

缺點：
- 對這個需求來說可能過重

### 建議採用
若目標是「真的會持續用」，建議採用：
- Frontend：Next.js 或 Vite + React
- UI：Tailwind CSS + component primitives
- DB：Supabase
- Auth：可有可無；若只有自己用，也可先不做登入

## 資料表建議
若採 Supabase，可建立以下 tables：
- projects
- resources
- todos
- notes

### projects
欄位建議：
- id
- name
- description
- status
- created_at
- updated_at

### resources
欄位建議：
- id
- project_id
- title
- category
- url
- note
- created_at
- updated_at

### todos
欄位建議：
- id
- project_id
- text
- completed
- priority
- due_date
- created_at
- updated_at

### notes
欄位建議：
- id
- project_id
- content
- created_at
- updated_at

## 狀態設計建議
專案狀態建議先固定為：
- active：開發中
- paused：暫停
- launched：已上線
- idea：構想中

狀態 badge 顏色建議：
- active：綠 / 青
- paused：灰 / 黃
- launched：藍 / 紫
- idea：中性色

## UI / UX 細節要求

### 快速辨識
- category 必須有 badge 與 icon
- 專案狀態要夠醒目
- 重要連結可直接點擊
- 卡片排版要利於快速掃讀

### 互動細節
- 外部連結需新分頁開啟
- hover 顯示高亮邊框與陰影
- 表單新增操作要足夠快，不要太多步驟
- 刪除操作最好有確認，避免誤刪

### 響應式
- 桌面版以雙欄或三欄 grid 為主
- 手機版改單欄堆疊
- Todo 與 Notes 區塊在手機上要可自然往下滑

## 第一版建議優先順序

### P0：一定要有
- 首頁專案卡片列表
- 專案詳情頁
- 資源卡片 CRUD
- Todo checklist
- Notes 新增與列表
- 外部連結跳轉
- 深色 dashboard 風格

### P1：應該有
- 搜尋 / 篩選 / 排序
- 專案狀態 badge
- Todo 完成率
- 類別 icon map
- 空狀態設計

### P2：之後可加
- 拖曳排序
- 資源分類群組顯示
- 複製連結按鈕
- markdown notes
- tag 系統
- 最近瀏覽專案
- pin 置頂專案
- 多視圖切換（grid / list）

## 可延伸功能
以下可作為未來版本，但不必放入第一版：
- 專案封面顏色 / icon 自訂
- 一鍵複製所有相關資源
- 專案模板
- 匯出 / 匯入 JSON
- 自動偵測 dead link
- 與 GitHub API 整合顯示 repo 資訊
- 與 Vercel / Railway / Supabase API 整合顯示部署狀態
- 每個資源增加 environment 標記（prod / staging / dev）
- 顯示最後部署時間

## 建議開發步驟

### Phase 1：骨架
- 建立基本 layout
- 完成首頁專案卡片
- 完成專案詳情頁框架

### Phase 2：核心功能
- 串接 projects / resources / todos / notes 資料
- 完成 CRUD
- 完成首頁與詳情頁資料流

### Phase 3：體驗優化
- 補搜尋 / 篩選 / 排序
- 補空狀態
- 補 hover / transition / glow 邊框
- 補手機版調整

### Phase 4：細節強化
- icon system
- badge system
- 刪除確認
- 更好的表單體驗

## 驗收標準
完成後，產品至少要達成以下驗收標準：
- 能建立多個專案。
- 首頁能清楚看到所有專案卡片。
- 點進專案後能看到所有資源卡片。
- 每張資源卡片都可直接跳轉到指定網址。
- 每個專案都能維護自己的 todo-list。
- 已完成 todo 可打勾並顯示刪除線。
- 每個專案都能持續追加 notes。
- 整體 UI 具備深色開發者工具風格。
- 桌面與手機版都可正常使用。

## 給 AI 實作者的最後要求
請依照以下原則實作：
- 優先完成可用版本，而不是過度設計。
- 第一版先追求「真的能幫助快速找資源與回想專案狀態」。
- 不要加入與目標無關的大型功能。
- 保持元件化，讓未來容易擴充。
- category、status、card、todo、notes 這幾個核心概念要在程式架構中清楚分離。
- UI 風格要偏向 Railway / infra tooling 的深色工作台感。
- 若遇到功能取捨，優先保留：專案卡片、資源卡片、todo、notes、快速外連。

## 建議直接生成的畫面與元件清單
請 AI 先建立以下畫面與元件：

### Pages
- Project Dashboard Home
- Project Detail View

### Components
- ProjectCard
- ResourceCard
- TodoList
- TodoItem
- NotesPanel
- NoteItem
- StatusBadge
- CategoryBadge
- ResourceFormModal
- ProjectFormModal
- ConfirmDeleteDialog
- EmptyState
- SearchAndFilterBar

## 建議交付順序
1. 先完成靜態 UI 骨架
2. 再串接假資料
3. 確認首頁與詳情頁資訊架構正確
4. 再接上真實資料來源
5. 最後補互動與視覺細節

***

以上規劃請作為實作依據；若實作者需要自行判斷技術細節，請以「個人使用、快速查找、低維護成本、可持續擴充」為最高原則。
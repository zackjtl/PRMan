/**
 * 本機開發：`VITE_API_BASE_URL` 留空，使用相對路徑 `/api`，由 Vite proxy 轉到本機後端。
 * 正式／預覽：設為已部署的 API 基底網址（勿尾隨 `/`）。
 */
function normalizedApiBase(): string {
  return import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '') ?? ''
}

export function apiUrl(path: string): string {
  const base = normalizedApiBase()
  const p = path.startsWith('/') ? path : `/${path}`
  return base ? `${base}${p}` : p
}

/** 供畫面顯示：目前 API 請求使用的基底（或本機 proxy 說明） */
export function apiBaseDescription(): string {
  const base = normalizedApiBase()
  return base ? base : '相對路徑 /api（Vite dev proxy → 本機後端）'
}

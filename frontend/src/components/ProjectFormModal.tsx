import { useState } from 'react'
import { projectsApi } from '@/lib/apiClient'
import type { Project, ProjectStatus } from '@/types'

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'active',   label: '開發中' },
  { value: 'idea',     label: '構想中' },
  { value: 'paused',   label: '暫停' },
  { value: 'launched', label: '已上線' },
]

interface Props {
  onClose: () => void
  onSaved: (project: Project) => void
}

export function ProjectFormModal({ onClose, onSaved }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<ProjectStatus>('active')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('請輸入專案名稱'); return }
    setSaving(true)
    setError('')
    try {
      const { project } = await projectsApi.create({ name: name.trim(), description: description.trim(), status })
      onSaved(project)
    } catch (err) {
      setError(err instanceof Error ? err.message : '建立失敗')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-5"
        style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <h2 className="text-base font-semibold" style={{ color: '#f1f5f9' }}>新增專案</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="專案名稱 *">
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="例：PRMan"
              className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-all"
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.5)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </Field>

          <Field label="描述">
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="一句話說明這個專案..."
              rows={2}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none transition-all"
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(34,211,238,0.5)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </Field>

          <Field label="狀態">
            <div className="flex gap-2 flex-wrap">
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                  style={{
                    background: status === opt.value ? 'rgba(34,211,238,0.15)' : '#1e293b',
                    color: status === opt.value ? '#22d3ee' : '#64748b',
                    border: `1px solid ${status === opt.value ? 'rgba(34,211,238,0.35)' : 'rgba(255,255,255,0.07)'}`,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Field>

          {error && <p className="text-xs" style={{ color: '#f87171' }}>{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors"
              style={{ background: '#1e293b', color: '#64748b', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              取消
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all disabled:opacity-50"
              style={{ background: 'rgba(34,211,238,0.15)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.3)' }}
            >
              {saving ? '建立中...' : '建立'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium" style={{ color: '#64748b' }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  background: '#1e293b',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#e2e8f0',
}

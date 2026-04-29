import { useState } from 'react'
import api from '../api/axios'
import type { Cliente } from '../types'

interface Props {
  onClose: () => void
  onCreado: (cliente: Cliente) => void
}

export default function ModalNuevoCliente({ onClose, onCreado }: Props) {
  const [ruc, setRuc] = useState('')
  const [nombre, setNombre] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!ruc.trim() || !nombre.trim()) { setError('Completá todos los campos.'); return }

    setGuardando(true)
    try {
      const res = await api.post<Cliente>('/clientes', {
        rucOCedula: ruc.trim(),
        nombreRazonSocial: nombre.trim()
      })
      onCreado(res.data)
      onClose()
    } catch {
      setError('No se pudo registrar el cliente.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">

        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Nuevo cliente</h2>
            <p className="text-sm text-gray-400 mt-0.5">Se guardará en la tabla CLIENTES de Oracle</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">RUC o Cédula</label>
            <input
              type="text" required placeholder="Ej: 80012345-6"
              value={ruc} onChange={e => setRuc(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nombre / Razón social</label>
            <input
              type="text" required placeholder="Ej: Distribuidora Río S.A."
              value={nombre} onChange={e => setNombre(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="px-5 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={guardando}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60">
              {guardando ? 'Guardando...' : 'Registrar cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
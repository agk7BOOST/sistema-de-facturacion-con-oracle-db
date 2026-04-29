import { useEffect, useState } from 'react'
import api from './api/axios'
import type { Factura } from './types'
import ModalNuevaFactura from './components/ModalNuevaFactura'
import ModalDetalleFactura from './components/ModalDetalleFactura'
import ModalNuevoCliente from './components/ModalNuevoCliente'

type Modal = 'nueva_factura' | 'detalle_factura' | 'nuevo_cliente' | null

export default function App() {
  const [facturas, setFacturas] = useState<Factura[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<Modal>(null)
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<number | null>(null)
  const [busqueda, setBusqueda] = useState('')

  const cargarFacturas = async () => {
    try {
      const res = await api.get<Factura[]>('/facturas')
      setFacturas(res.data)
    } catch {
      console.error('Error al cargar facturas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargarFacturas() }, [])

  const abrirDetalle = (id: number) => {
    setFacturaSeleccionada(id)
    setModal('detalle_factura')
  }

  const facturasFiltradas = facturas.filter(f =>
    f.numeroFactura.toLowerCase().includes(busqueda.toLowerCase()) ||
    (f.nombreCliente || '').toLowerCase().includes(busqueda.toLowerCase())
  )

  const fmt = (n: number) => Math.round(n).toLocaleString('es-PY')

  const estadoBadge = (estado?: string) => {
    if (estado === 'ANULADA')
      return (
        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-600">
          ANULADA
        </span>
      )
    return (
      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700">
        EMITIDA
      </span>
    )
  }

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <p className="text-base text-gray-400 animate-pulse">Cargando datos de Oracle...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Gestión de facturas</h1>
            <p className="text-sm text-gray-400 mt-1">Sistema transaccional — Oracle XE + Spring Boot</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setModal('nuevo_cliente')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm"
            >
              + Nuevo cliente
            </button>
            <button
              onClick={() => setModal('nueva_factura')}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm"
            >
              + Nueva factura
            </button>
          </div>
        </div>

        {/* Stats rápidos */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard
            label="Total facturas"
            value={facturas.length.toString()}
          />
          <StatCard
            label="Emitidas"
            value={facturas.filter(f => f.estado === 'EMITIDA').length.toString()}
            color="green"
          />
          <StatCard
            label="Anuladas"
            value={facturas.filter(f => f.estado === 'ANULADA').length.toString()}
            color="red"
          />
        </div>

        {/* Buscador */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por número de factura o cliente..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-400">
                <th className="px-5 py-3 font-medium">Nro. Factura</th>
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Fecha</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {facturasFiltradas.map(f => (
                <tr
                  key={f.idFactura}
                  onClick={() => f.idFactura && abrirDetalle(f.idFactura)}
                  className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                >
                  <td className="px-5 py-3.5 font-mono text-gray-800 font-medium text-xs">
                    {f.numeroFactura}
                  </td>
                  <td className="px-5 py-3.5 text-gray-700">
                    {f.nombreCliente || `Cliente #${f.clienteId}`}
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">
                    {f.fechaEmision || '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    {estadoBadge(f.estado)}
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold text-gray-900">
                    ₲ {fmt(f.totalGeneral)}
                  </td>
                </tr>
              ))}
              {facturasFiltradas.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-400">
                    {busqueda ? 'Sin resultados para esa búsqueda.' : 'No hay facturas registradas.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-300 mt-8">
          {facturasFiltradas.length} de {facturas.length} facturas · Hacé clic en una fila para ver el detalle
        </p>
      </div>

      {/* Modales */}
      {modal === 'nueva_factura' && (
        <ModalNuevaFactura
          onClose={() => setModal(null)}
          onCreada={cargarFacturas}
        />
      )}

      {modal === 'detalle_factura' && facturaSeleccionada !== null && (
        <ModalDetalleFactura
          idFactura={facturaSeleccionada}
          onClose={() => { setModal(null); setFacturaSeleccionada(null) }}
          onAnulada={cargarFacturas}
        />
      )}

      {modal === 'nuevo_cliente' && (
        <ModalNuevoCliente
          onClose={() => setModal(null)}
          onCreado={() => {}}
        />
      )}
    </div>
  )
}

// Componente interno de stat card
function StatCard({ label, value, color }: { label: string; value: string; color?: 'green' | 'red' }) {
  const valueClass = color === 'green'
    ? 'text-green-700'
    : color === 'red'
    ? 'text-red-600'
    : 'text-gray-900'

  return (
    <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-sm">
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-semibold mt-1 ${valueClass}`}>{value}</p>
    </div>
  )
}
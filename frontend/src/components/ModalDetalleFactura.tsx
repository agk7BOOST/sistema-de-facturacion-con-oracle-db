import { useEffect, useState } from 'react'
import api from '../api/axios'
import type { Factura } from '../types'

interface Props {
  idFactura: number
  onClose: () => void
  onAnulada: () => void
}

export default function ModalDetalleFactura({ idFactura, onClose, onAnulada }: Props) {
  const [factura, setFactura] = useState<Factura | null>(null)
  const [cargando, setCargando] = useState(true)
  const [anulando, setAnulando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<Factura>(`/facturas/${idFactura}`)
      .then(r => setFactura(r.data))
      .catch(() => setError('No se pudo cargar la factura.'))
      .finally(() => setCargando(false))
  }, [idFactura])

  const handleAnular = async () => {
    if (!confirm('¿Confirmás la anulación de esta factura? Esta acción no se puede deshacer.')) return
    setAnulando(true)
    setError('')
    try {
      await api.put(`/facturas/${idFactura}/anular`)
      onAnulada()
      onClose()
    } catch (err: any) {
      const msg = err.response?.data || 'No se pudo anular.'
      setError(typeof msg === 'string' ? msg : 'No se pudo anular.')
    } finally {
      setAnulando(false)
    }
  }

  const fmt = (n: number) => Math.round(n).toLocaleString('es-PY')

  const estadoBadge = (estado?: string) => {
    if (estado === 'ANULADA')
      return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">ANULADA</span>
    return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">EMITIDA</span>
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Detalle de factura</h2>
            <p className="text-sm text-gray-400 mt-0.5">Datos registrados en Oracle</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        <div className="p-6 space-y-5">

          {cargando && (
            <p className="text-center text-gray-400 py-8 animate-pulse">Cargando desde Oracle...</p>
          )}

          {!cargando && !factura && (
            <p className="text-center text-red-500 py-8">{error || 'Factura no encontrada.'}</p>
          )}

          {factura && (
            <>
              {/* Info cabecera */}
              <div className="grid grid-cols-2 gap-3">

                <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-3">
                  <Row label="Nro. Factura" value={factura.numeroFactura} mono />
                  <Row label="Fecha emisión" value={factura.fechaEmision || '—'} />
                  <Row label="Estado" value={estadoBadge(factura.estado)} />
                </div>

                <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-3">
                  <Row label="Cliente" value={factura.nombreCliente || '—'} />
                  <Row label="RUC / CI" value={factura.rucCliente || '—'} mono />
                  <Row label="ID Cliente" value={`#${factura.clienteId}`} />
                </div>
              </div>

              {/* Tabla de ítems */}
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-200">
                      <th className="px-4 py-3 text-left font-medium">Producto</th>
                      <th className="px-4 py-3 text-right font-medium">Cant.</th>
                      <th className="px-4 py-3 text-right font-medium">Precio unit.</th>
                      <th className="px-4 py-3 text-right font-medium">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {factura.detalles.map((d, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-800">{d.producto}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{d.cantidad}</td>
                        <td className="px-4 py-3 text-right text-gray-600">₲ {fmt(d.precioUnitario)}</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-800">₲ {fmt(d.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totales */}
              <div className="flex justify-end">
                <div className="w-60 space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Total neto</span><span>₲ {fmt(factura.totalNeto)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>IVA (10%)</span><span>₲ {fmt(factura.totalIva)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-gray-900 text-base border-t border-gray-200 pt-2 mt-1">
                    <span>Total</span><span>₲ {fmt(factura.totalGeneral)}</span>
                  </div>
                </div>
              </div>

              {/* Error anulación */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5">
                  {error}
                </div>
              )}

              {/* Acciones */}
              <div className="flex justify-between items-center pt-1">
                <div>
                  {factura.estado === 'EMITIDA' && (
                    <button
                      onClick={handleAnular} disabled={anulando}
                      className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-60"
                    >
                      {anulando ? 'Anulando...' : 'Anular factura'}
                    </button>
                  )}
                </div>
                <button onClick={onClose}
                  className="px-5 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                  Cerrar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper interno para filas de info
function Row({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className={`text-sm text-gray-800 font-medium ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  )
}
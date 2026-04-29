import { useEffect, useState } from 'react'
import api from '../api/axios'
import type { Cliente, Factura, FacturaDetalle } from '../types'

interface Props {
  onClose: () => void
  onCreada: () => void
}

const facturaVacia = (): Factura => ({
  numeroFactura: '',   // lo genera Oracle, se envía vacío
  clienteId: 0,
  totalNeto: 0,
  totalIva: 0,
  totalGeneral: 0,
  detalles: [{ producto: '', cantidad: 1, precioUnitario: 0, subtotal: 0 }]
})

export default function ModalNuevaFactura({ onClose, onCreada }: Props) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [factura, setFactura] = useState<Factura>(facturaVacia())
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<Cliente[]>('/clientes').then(r => {
      setClientes(r.data)
      if (r.data.length > 0) {
        setFactura(prev => ({ ...prev, clienteId: r.data[0].idCliente }))
      }
    })
  }, [])

  // Recalcula totales cada vez que cambian los ítems
  useEffect(() => {
    const neto = factura.detalles.reduce((s, d) => s + (d.subtotal || 0), 0)
    const iva = neto * 0.10
    setFactura(prev => ({ ...prev, totalNeto: neto, totalIva: iva, totalGeneral: neto + iva }))
  }, [factura.detalles])

  const agregarItem = () =>
    setFactura(prev => ({
      ...prev,
      detalles: [...prev.detalles, { producto: '', cantidad: 1, precioUnitario: 0, subtotal: 0 }]
    }))

  const eliminarItem = (i: number) =>
    setFactura(prev => ({ ...prev, detalles: prev.detalles.filter((_, idx) => idx !== i) }))

  const actualizarItem = (i: number, campo: keyof FacturaDetalle, valor: string | number) => {
    const detalles = [...factura.detalles]
    const item = { ...detalles[i], [campo]: valor }
    if (campo === 'cantidad' || campo === 'precioUnitario') {
      const cant = campo === 'cantidad' ? Number(valor) : item.cantidad
      const precio = campo === 'precioUnitario' ? Number(valor) : item.precioUnitario
      item.subtotal = cant * precio
    }
    detalles[i] = item
    setFactura(prev => ({ ...prev, detalles }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (factura.clienteId === 0) { setError('Seleccioná un cliente.'); return }
    if (factura.detalles.length === 0) { setError('Agregá al menos un ítem.'); return }

    setGuardando(true)
    try {
      await api.post('/facturas', factura)
      onCreada()
      onClose()
    } catch (err: any) {
      const msg = err.response?.data || 'Error al guardar la factura.'
      setError(typeof msg === 'string' ? msg : 'Error al guardar la factura.')
    } finally {
      setGuardando(false)
    }
  }

  const fmt = (n: number) => Math.round(n).toLocaleString('es-PY')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Crear nueva factura</h2>
            <p className="text-sm text-gray-400 mt-0.5">El número se genera automáticamente en Oracle</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Selector de cliente */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
              Cliente
            </label>
            {clientes.length === 0 ? (
              <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                No hay clientes registrados. Cerrá este modal y registrá uno primero.
              </p>
            ) : (
              <select
                value={factura.clienteId}
                onChange={e => setFactura(p => ({ ...p, clienteId: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {clientes.map(c => (
                  <option key={c.idCliente} value={c.idCliente}>
                    {c.nombreRazonSocial} — {c.rucOCedula}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Ítems */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Detalle de productos</h3>
              <button type="button" onClick={agregarItem}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                + Agregar ítem
              </button>
            </div>

            <div className="space-y-2">
              {factura.detalles.map((item, i) => (
                <div key={i} className="grid grid-cols-[1fr_72px_104px_88px_28px] gap-2 items-end group">
                  <div>
                    {i === 0 && <label className="text-xs text-gray-400 mb-1 block">Producto</label>}
                    <input
                      type="text" required placeholder="Ej: Teclado mecánico"
                      value={item.producto}
                      onChange={e => actualizarItem(i, 'producto', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    {i === 0 && <label className="text-xs text-gray-400 mb-1 block">Cant.</label>}
                    <input
                      type="number" required min="1"
                      value={item.cantidad}
                      onChange={e => actualizarItem(i, 'cantidad', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    {i === 0 && <label className="text-xs text-gray-400 mb-1 block">Precio unit.</label>}
                    <input
                      type="number" required min="0"
                      value={item.precioUnitario}
                      onChange={e => actualizarItem(i, 'precioUnitario', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    {i === 0 && <label className="text-xs text-gray-400 mb-1 block">Subtotal</label>}
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 font-medium text-right">
                      {fmt(item.subtotal)}
                    </div>
                  </div>
                  <button
                    type="button" onClick={() => eliminarItem(i)}
                    className="pb-0.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-base"
                  >✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* Totales */}
          <div className="flex justify-end">
            <div className="w-60 bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Total neto</span><span>₲ {fmt(factura.totalNeto)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>IVA (10%)</span><span>₲ {fmt(factura.totalIva)}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 text-base border-t border-blue-200 pt-2 mt-1">
                <span>Total</span><span>₲ {fmt(factura.totalGeneral)}</span>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          {/* Acciones */}
          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="px-5 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={guardando || clientes.length === 0}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60">
              {guardando ? 'Procesando...' : 'Procesar transacción'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
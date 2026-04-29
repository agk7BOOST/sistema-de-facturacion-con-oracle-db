export interface FacturaDetalle {
  producto: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

export interface Factura {
  idFactura?: number
  numeroFactura: string
  clienteId: number
  nombreCliente?: string
  rucCliente?: string
  fechaEmision?: string
  estado?: string
  totalNeto: number
  totalIva: number
  totalGeneral: number
  detalles: FacturaDetalle[]
}

export interface Cliente {
  idCliente: number
  rucOCedula: string
  nombreRazonSocial: string
}
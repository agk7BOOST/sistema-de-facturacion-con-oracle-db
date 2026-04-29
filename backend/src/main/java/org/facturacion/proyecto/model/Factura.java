package org.facturacion.proyecto.model;

import java.util.ArrayList;
import java.util.List;

public class Factura {
    private int idFactura;
    private String numeroFactura;
    private int clienteId;

    private String nombreCliente;
    private String rucCliente;
    private String fechaEmision;
    private String estado;

    private double totalNeto;
    private double totalIva;
    private double totalGeneral;

    private List<FacturaDetalle> detalles = new ArrayList<>();

    public Factura() {}

    public int getIdFactura() { return idFactura; }
    public void setIdFactura(int idFactura) { this.idFactura = idFactura; }

    public String getNumeroFactura() { return numeroFactura; }
    public void setNumeroFactura(String numeroFactura) { this.numeroFactura = numeroFactura; }

    public int getClienteId() { return clienteId; }
    public void setClienteId(int clienteId) { this.clienteId = clienteId; }

    public String getNombreCliente() { return nombreCliente; }
    public void setNombreCliente(String nombreCliente) { this.nombreCliente = nombreCliente; }

    public String getRucCliente() { return rucCliente; }
    public void setRucCliente(String rucCliente) { this.rucCliente = rucCliente; }

    public String getFechaEmision() { return fechaEmision; }
    public void setFechaEmision(String fechaEmision) { this.fechaEmision = fechaEmision; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public double getTotalNeto() { return totalNeto; }
    public void setTotalNeto(double totalNeto) { this.totalNeto = totalNeto; }

    public double getTotalIva() { return totalIva; }
    public void setTotalIva(double totalIva) { this.totalIva = totalIva; }

    public double getTotalGeneral() { return totalGeneral; }
    public void setTotalGeneral(double totalGeneral) { this.totalGeneral = totalGeneral; }

    public List<FacturaDetalle> getDetalles() { return detalles; }
    public void setDetalles(List<FacturaDetalle> detalles) { this.detalles = detalles; }

    public void addDetalle(FacturaDetalle detalle) { this.detalles.add(detalle); }
}
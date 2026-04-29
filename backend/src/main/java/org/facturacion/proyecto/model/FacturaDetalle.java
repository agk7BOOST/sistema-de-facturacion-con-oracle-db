package org.facturacion.proyecto.model;

public class FacturaDetalle {
    private String producto;
    private double cantidad;
    private double precioUnitario;
    private double subtotal;

    public FacturaDetalle() {
    }
    public FacturaDetalle(String producto, double cantidad, double precioUnitario, double subtotal) {
        this.producto = producto;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.subtotal = subtotal;
    }
    public String getProducto() { return producto; }
    public double getCantidad() { return cantidad; }
    public double getPrecioUnitario() { return precioUnitario; }
    public double getSubtotal() { return subtotal; }

    public void setProducto(String producto) {
        this.producto = producto;
    }

    public void setCantidad(double cantidad) {
        this.cantidad = cantidad;
    }

    public void setPrecioUnitario(double precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public void setSubtotal(double subtotal) {
        this.subtotal = subtotal;
    }
}
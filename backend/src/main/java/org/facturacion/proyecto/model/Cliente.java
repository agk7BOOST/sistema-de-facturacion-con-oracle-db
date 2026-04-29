package org.facturacion.proyecto.model;

public class Cliente {
    private int idCliente;
    private String rucOCedula;
    private String nombreRazonSocial;

    public Cliente() {}

    public int getIdCliente() { return idCliente; }
    public void setIdCliente(int idCliente) { this.idCliente = idCliente; }

    public String getRucOCedula() { return rucOCedula; }
    public void setRucOCedula(String rucOCedula) { this.rucOCedula = rucOCedula; }

    public String getNombreRazonSocial() { return nombreRazonSocial; }
    public void setNombreRazonSocial(String nombreRazonSocial) { this.nombreRazonSocial = nombreRazonSocial; }
}
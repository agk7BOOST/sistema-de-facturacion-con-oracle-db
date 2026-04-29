package org.facturacion.proyecto.dao;

import org.facturacion.proyecto.model.Factura;
import java.util.List;
import java.util.Optional;

public interface FacturaDAO {
    void registrarFacturaCompleta(Factura factura);
    List<Factura> listarFacturas();

     Optional<Factura> obtenerFacturaPorId(int idFactura);

    boolean anularFactura(int idFactura);
}
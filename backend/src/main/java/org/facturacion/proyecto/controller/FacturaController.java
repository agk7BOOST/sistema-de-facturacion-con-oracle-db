package org.facturacion.proyecto.controller;

import org.facturacion.proyecto.dao.ClienteDAO;
import org.facturacion.proyecto.dao.ClienteDAOImpl;
import org.facturacion.proyecto.dao.FacturaDAO;
import org.facturacion.proyecto.dao.FacturaDAOImpl;
import org.facturacion.proyecto.model.Factura;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/facturas")
@CrossOrigin(origins = "http://localhost:5173")
public class FacturaController {

    private FacturaDAO facturaDAO = new FacturaDAOImpl();
    private ClienteDAO clienteDAO = new ClienteDAOImpl();

     @GetMapping
    public List<Factura> listarTodas() {
        return facturaDAO.listarFacturas();
    }

     @GetMapping("/{id}")
    public ResponseEntity<Factura> obtenerDetalle(@PathVariable int id) {
        return facturaDAO.obtenerFacturaPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

     @PostMapping
    public ResponseEntity<String> crearFactura(@RequestBody Factura nuevaFactura) {

        boolean clienteExiste = clienteDAO.buscarPorId(nuevaFactura.getClienteId()).isPresent();
        if (!clienteExiste) {
            return ResponseEntity.badRequest()
                    .body("El cliente con ID " + nuevaFactura.getClienteId() + " no existe en el sistema.");
        }

        if (nuevaFactura.getDetalles() == null || nuevaFactura.getDetalles().isEmpty()) {
            return ResponseEntity.badRequest().body("La factura debe tener al menos un ítem.");
        }

        try {
            facturaDAO.registrarFacturaCompleta(nuevaFactura);
            return ResponseEntity.ok("Factura creada con éxito en Oracle.");
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
     @PutMapping("/{id}/anular")
    public ResponseEntity<String> anularFactura(@PathVariable int id) {
        boolean anulado = facturaDAO.anularFactura(id);
        if (anulado) {
            return ResponseEntity.ok("Factura anulada correctamente.");
        } else {
            return ResponseEntity.badRequest()
                    .body("No se pudo anular: la factura no existe o ya está anulada.");
        }
    }
}
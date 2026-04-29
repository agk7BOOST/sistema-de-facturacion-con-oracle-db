package org.facturacion.proyecto.controller;

import org.facturacion.proyecto.dao.ClienteDAO;
import org.facturacion.proyecto.dao.ClienteDAOImpl;
import org.facturacion.proyecto.model.Cliente;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "http://localhost:5173")
public class ClienteController {

    private ClienteDAO clienteDAO = new ClienteDAOImpl();

     @GetMapping
    public List<Cliente> listarClientes() {
        return clienteDAO.listarClientes();
    }

     @GetMapping("/{id}")
    public ResponseEntity<Cliente> buscarCliente(@PathVariable int id) {
        return clienteDAO.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

     @PostMapping
    public ResponseEntity<Cliente> crearCliente(@RequestBody Cliente cliente) {
        if (cliente.getRucOCedula() == null || cliente.getRucOCedula().isBlank() ||
                cliente.getNombreRazonSocial() == null || cliente.getNombreRazonSocial().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        Cliente creado = clienteDAO.crearCliente(cliente);
        return ResponseEntity.ok(creado);
    }
}
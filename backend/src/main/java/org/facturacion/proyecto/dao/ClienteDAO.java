package org.facturacion.proyecto.dao;

import org.facturacion.proyecto.model.Cliente;
import java.util.List;
import java.util.Optional;

public interface ClienteDAO {
    List<Cliente> listarClientes();
    Optional<Cliente> buscarPorId(int id);
    Cliente crearCliente(Cliente cliente);
}
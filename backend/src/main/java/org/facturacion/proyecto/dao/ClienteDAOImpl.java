package org.facturacion.proyecto.dao;

import org.facturacion.proyecto.config.ConexionDB;
import org.facturacion.proyecto.model.Cliente;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class ClienteDAOImpl implements ClienteDAO {

    @Override
    public List<Cliente> listarClientes() {
        List<Cliente> lista = new ArrayList<>();
        String sql = "SELECT ID_CLIENTE, RUC_O_CEDULA, NOMBRE_RAZON_SOCIAL FROM CLIENTES ORDER BY ID_CLIENTE";
        try {
            Connection conn = ConexionDB.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Cliente c = new Cliente();
                c.setIdCliente(rs.getInt("ID_CLIENTE"));
                c.setRucOCedula(rs.getString("RUC_O_CEDULA"));
                c.setNombreRazonSocial(rs.getString("NOMBRE_RAZON_SOCIAL"));
                lista.add(c);
            }
            rs.close();
            ps.close();
        } catch (SQLException e) {
            System.err.println("Error al listar clientes");
            e.printStackTrace();
        }
        return lista;
    }

    @Override
    public Optional<Cliente> buscarPorId(int id) {
        String sql = "SELECT ID_CLIENTE, RUC_O_CEDULA, NOMBRE_RAZON_SOCIAL FROM CLIENTES WHERE ID_CLIENTE = ?";
        try {
            Connection conn = ConexionDB.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                Cliente c = new Cliente();
                c.setIdCliente(rs.getInt("ID_CLIENTE"));
                c.setRucOCedula(rs.getString("RUC_O_CEDULA"));
                c.setNombreRazonSocial(rs.getString("NOMBRE_RAZON_SOCIAL"));
                rs.close(); ps.close();
                return Optional.of(c);
            }
            rs.close(); ps.close();
        } catch (SQLException e) {
            System.err.println("Error al buscar cliente por ID");
            e.printStackTrace();
        }
        return Optional.empty();
    }

    @Override
    public Cliente crearCliente(Cliente cliente) {
        String sql = "INSERT INTO CLIENTES (RUC_O_CEDULA, NOMBRE_RAZON_SOCIAL) VALUES (?, ?)";
        try {
            Connection conn = ConexionDB.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql, new String[]{"ID_CLIENTE"});
            ps.setString(1, cliente.getRucOCedula());
            ps.setString(2, cliente.getNombreRazonSocial());
            ps.executeUpdate();
            ResultSet rs = ps.getGeneratedKeys();
            if (rs.next()) {
                cliente.setIdCliente(rs.getInt(1));
            }
            rs.close(); ps.close();
            System.out.println("Cliente creado con ID: " + cliente.getIdCliente());
        } catch (SQLException e) {
            System.err.println("Error al crear cliente");
            e.printStackTrace();
        }
        return cliente;
    }
}
package org.facturacion.proyecto.dao;

import org.facturacion.proyecto.config.ConexionDB;
import org.facturacion.proyecto.model.Factura;
import org.facturacion.proyecto.model.FacturaDetalle;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class FacturaDAOImpl implements FacturaDAO {

    @Override
    public void registrarFacturaCompleta(Factura factura) {
        Connection conn = null;
        PreparedStatement psFactura = null;
        PreparedStatement psDetalle = null;
        ResultSet rs = null;

        try {
            conn = ConexionDB.getConnection();
            conn.setAutoCommit(false);

            String sqlFactura = "INSERT INTO FACTURAS (CLIENTE_ID, TOTAL_NETO, TOTAL_IVA, TOTAL_GENERAL) " +
                    "VALUES (?, ?, ?, ?)";
            psFactura = conn.prepareStatement(sqlFactura, new String[]{"ID_FACTURA"});
            psFactura.setInt(1, factura.getClienteId());
            psFactura.setDouble(2, factura.getTotalNeto());
            psFactura.setDouble(3, factura.getTotalIva());
            psFactura.setDouble(4, factura.getTotalGeneral());
            psFactura.executeUpdate();

            rs = psFactura.getGeneratedKeys();
            int idFacturaGenerado = 0;
            if (rs.next()) {
                idFacturaGenerado = rs.getInt(1);
            }

            String sqlDetalle = "INSERT INTO FACTURA_DETALLES (FACTURA_ID, PRODUCTO_DESC, CANTIDAD, PRECIO_UNITARIO, SUBTOTAL) " +
                    "VALUES (?, ?, ?, ?, ?)";
            psDetalle = conn.prepareStatement(sqlDetalle);
            for (FacturaDetalle item : factura.getDetalles()) {
                psDetalle.setInt(1, idFacturaGenerado);
                psDetalle.setString(2, item.getProducto());
                psDetalle.setDouble(3, item.getCantidad());
                psDetalle.setDouble(4, item.getPrecioUnitario());
                psDetalle.setDouble(5, item.getSubtotal());
                psDetalle.executeUpdate();
            }

            conn.commit();
            System.out.println("Factura registrada con ID: " + idFacturaGenerado + " — número asignado por Oracle.");

        } catch (SQLException e) {
            if (conn != null) {
                try {
                    conn.rollback();
                    System.err.println("ROLLBACK ejecutado.");
                } catch (SQLException ex) { ex.printStackTrace(); }
            }
            throw new RuntimeException("Error al registrar factura: " + e.getMessage(), e);
        } finally {
            try {
                if (rs != null) rs.close();
                if (psFactura != null) psFactura.close();
                if (psDetalle != null) psDetalle.close();
            } catch (SQLException e) { e.printStackTrace(); }
        }
    }

    @Override
    public List<Factura> listarFacturas() {
        List<Factura> lista = new ArrayList<>();
        String sql = "SELECT f.ID_FACTURA, f.NUMERO_FACTURA, f.CLIENTE_ID, " +
                "f.TOTAL_NETO, f.TOTAL_IVA, f.TOTAL_GENERAL, f.ESTADO, " +
                "TO_CHAR(f.FECHA_EMISION, 'DD/MM/YYYY HH24:MI') AS FECHA_EMISION, " +
                "c.NOMBRE_RAZON_SOCIAL " +
                "FROM FACTURAS f " +
                "LEFT JOIN CLIENTES c ON f.CLIENTE_ID = c.ID_CLIENTE " +
                "ORDER BY f.ID_FACTURA DESC";
        try {
            Connection conn = ConexionDB.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Factura f = new Factura();
                f.setIdFactura(rs.getInt("ID_FACTURA"));
                f.setNumeroFactura(rs.getString("NUMERO_FACTURA"));
                f.setClienteId(rs.getInt("CLIENTE_ID"));
                f.setNombreCliente(rs.getString("NOMBRE_RAZON_SOCIAL"));
                f.setTotalNeto(rs.getDouble("TOTAL_NETO"));
                f.setTotalIva(rs.getDouble("TOTAL_IVA"));
                f.setTotalGeneral(rs.getDouble("TOTAL_GENERAL"));
                f.setEstado(rs.getString("ESTADO"));
                f.setFechaEmision(rs.getString("FECHA_EMISION"));
                lista.add(f);
            }
            rs.close(); ps.close();
        } catch (SQLException e) {
            System.err.println("Error al listar facturas");
            e.printStackTrace();
        }
        return lista;
    }

    @Override
    public Optional<Factura> obtenerFacturaPorId(int idFactura) {
        String sqlFactura = "SELECT f.ID_FACTURA, f.NUMERO_FACTURA, f.CLIENTE_ID, " +
                "f.TOTAL_NETO, f.TOTAL_IVA, f.TOTAL_GENERAL, f.ESTADO, " +
                "TO_CHAR(f.FECHA_EMISION, 'DD/MM/YYYY HH24:MI') AS FECHA_EMISION, " +
                "c.NOMBRE_RAZON_SOCIAL, c.RUC_O_CEDULA " +
                "FROM FACTURAS f " +
                "LEFT JOIN CLIENTES c ON f.CLIENTE_ID = c.ID_CLIENTE " +
                "WHERE f.ID_FACTURA = ?";
        String sqlDetalles = "SELECT PRODUCTO_DESC, CANTIDAD, PRECIO_UNITARIO, SUBTOTAL " +
                "FROM FACTURA_DETALLES WHERE FACTURA_ID = ? ORDER BY ID_DETALLE";
        try {
            Connection conn = ConexionDB.getConnection();
            PreparedStatement ps = conn.prepareStatement(sqlFactura);
            ps.setInt(1, idFactura);
            ResultSet rs = ps.executeQuery();
            if (!rs.next()) return Optional.empty();

            Factura f = new Factura();
            f.setIdFactura(rs.getInt("ID_FACTURA"));
            f.setNumeroFactura(rs.getString("NUMERO_FACTURA"));
            f.setClienteId(rs.getInt("CLIENTE_ID"));
            f.setNombreCliente(rs.getString("NOMBRE_RAZON_SOCIAL"));
            f.setRucCliente(rs.getString("RUC_O_CEDULA"));
            f.setTotalNeto(rs.getDouble("TOTAL_NETO"));
            f.setTotalIva(rs.getDouble("TOTAL_IVA"));
            f.setTotalGeneral(rs.getDouble("TOTAL_GENERAL"));
            f.setEstado(rs.getString("ESTADO"));
            f.setFechaEmision(rs.getString("FECHA_EMISION"));
            rs.close(); ps.close();

            PreparedStatement psD = conn.prepareStatement(sqlDetalles);
            psD.setInt(1, idFactura);
            ResultSet rsD = psD.executeQuery();
            while (rsD.next()) {
                FacturaDetalle d = new FacturaDetalle();
                d.setProducto(rsD.getString("PRODUCTO_DESC"));
                d.setCantidad(rsD.getDouble("CANTIDAD"));
                d.setPrecioUnitario(rsD.getDouble("PRECIO_UNITARIO"));
                d.setSubtotal(rsD.getDouble("SUBTOTAL"));
                f.getDetalles().add(d);
            }
            rsD.close(); psD.close();
            return Optional.of(f);

        } catch (SQLException e) {
            System.err.println("Error al obtener factura por ID");
            e.printStackTrace();
        }
        return Optional.empty();
    }

    @Override
    public boolean anularFactura(int idFactura) {
        String sql = "UPDATE FACTURAS SET ESTADO = 'ANULADA' WHERE ID_FACTURA = ? AND ESTADO = 'EMITIDA'";
        try {
            Connection conn = ConexionDB.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, idFactura);
            int filas = ps.executeUpdate();
            ps.close();
            if (filas == 0) {
                System.err.println("No se anuló: factura no existe o ya está anulada.");
                return false;
            }
            System.out.println("Factura " + idFactura + " anulada.");
            return true;
        } catch (SQLException e) {
            System.err.println("Error al anular: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}
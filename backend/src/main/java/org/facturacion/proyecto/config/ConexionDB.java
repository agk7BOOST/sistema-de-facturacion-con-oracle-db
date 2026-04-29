package org.facturacion.proyecto.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConexionDB {
    private static final String URL = "jdbc:oracle:thin:@//localhost:1522/XEPDB1";
    private static final String USER = "FACTU_USER";
    private static final String PASS = "1234"; // La que me confirmaste

    private static Connection connection = null;

    public static Connection getConnection() throws SQLException {
        if (connection == null || connection.isClosed()) {
            try {
                Class.forName("oracle.jdbc.OracleDriver");
                connection = DriverManager.getConnection(URL, USER, PASS);
                System.out.println("Conexión exitosa a Oracle (XEPDB1) como FACTU_USER");
            } catch (ClassNotFoundException e) {
                System.err.println("No se encontró el Driver de Oracle.");
                e.printStackTrace();
            } catch (SQLException e) {
                System.err.println("Error de credenciales o de red (ORA-01017 / ORA-12505).");
                throw e;
            }
        }
        return connection;
    }
}
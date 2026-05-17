import db.DBConnection;
import java.sql.*;

public class TestDB {
    public static void main(String[] args) {
        try {
            Connection conn = DBConnection.getConnection();
            
            if(conn != null) {
                System.out.println("✓ Database connected successfully!");
                
                // Test query
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery("SELECT * FROM users");
                
                System.out.println("\nUsers in database:");
                while(rs.next()) {
                    System.out.println("ID: " + rs.getInt("id") + ", Username: " + rs.getString("username"));
                }
                
                conn.close();
            } else {
                System.out.println("✗ Failed to connect to database");
            }
        } catch(Exception e) {
            System.out.println("✗ Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

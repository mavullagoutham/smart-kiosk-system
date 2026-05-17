package Service;

import db.DBConnection;
import java.sql.*;

public class AuthService {
    public boolean register(String username, String password) {

        try {
            Connection con = DBConnection.getConnection();

            String query = "INSERT INTO users(username,password) VALUES(?,?)";

            PreparedStatement ps =
            con.prepareStatement(query);

            ps.setString(1, username);
            ps.setString(2, password);

            int rows = ps.executeUpdate();

            return rows > 0;

        } catch(Exception e) {
            e.printStackTrace();
        }

        return false;
    }

    public boolean login(String username, String password) {

        try {
            Connection con = DBConnection.getConnection();

            String query =
            "SELECT * FROM users WHERE username=? AND password=?";

            PreparedStatement ps = con.prepareStatement(query);

            ps.setString(1, username);
            ps.setString(2, password);

            ResultSet rs = ps.executeQuery();

            return rs.next();

        } catch(Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}
package Service;

import java.sql.Connection;
import java.sql.ResultSet;
import db.DBConnection;

public class OrderService {

    public static String placeOrder(int userId, String item, int price) {

        try {

            Connection conn = DBConnection.getConnection();

            String query =
                "INSERT INTO orders(user_id,item,price) VALUES(?,?,?)";

            java.sql.PreparedStatement ps =
                conn.prepareStatement(query);

            ps.setInt(1, userId);
            ps.setString(2, item);
            ps.setInt(3, price);

            ps.executeUpdate();

            conn.close();

            return "Order placed successfully!";

        } catch (Exception e) {

            e.printStackTrace();

            return "Error placing order";
        }
    }

    // GET ORDERS
    public static String getOrders(int userId) {

        StringBuilder result = new StringBuilder();

        result.append("[");

        try {

            Connection conn = DBConnection.getConnection();

            String query =
                "SELECT * FROM orders WHERE user_id=?";

            java.sql.PreparedStatement ps =
                conn.prepareStatement(query);

            ps.setInt(1, userId);

            ResultSet rs = ps.executeQuery();

            while (rs.next()) {

                result.append("{")
                      .append("\"id\":").append(rs.getInt("id")).append(",")
                      .append("\"item\":\"").append(rs.getString("item")).append("\",")
                      .append("\"price\":").append(rs.getInt("price"))
                      .append("},");
            }

            if (result.charAt(result.length() - 1) == ',') {
                result.deleteCharAt(result.length() - 1);
            }

            conn.close();

        } catch (Exception e) {

            e.printStackTrace();
        }

        result.append("]");

        return result.toString();
    }

    // TOTAL BILL
    public static int getTotalBill(int userId) {

        int total = 0;

        try {

            Connection conn = DBConnection.getConnection();

            String query =  "SELECT SUM(price) AS total FROM orders WHERE user_id=?";

            java.sql.PreparedStatement ps =
                conn.prepareStatement(query);

            ps.setInt(1, userId);

            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                total = rs.getInt("total");
            }

            conn.close();

        } catch (Exception e) {

            e.printStackTrace();
        }

        return total;
    }
}
package Service;

import db.DBConnection;
import java.sql.*;

public class MenuService {

    public static void getMenu() {
        try {
            Connection conn = DBConnection.getConnection();

            String query = "SELECT * FROM menu";
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(query);

            System.out.println("Menu Items:");

            while (rs.next()) {
                int id = rs.getInt("id");
                String name = rs.getString("item_name");
                int price = rs.getInt("price");

                System.out.println(id + " " + name + " " + price);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public static String getMenuData() {
    StringBuilder result = new StringBuilder();
    result.append("[");

    try {
        Connection conn = DBConnection.getConnection();
        String query = "SELECT * FROM menu";

        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery(query);

        while (rs.next()) {
            result.append("{")
                  .append("\"id\":").append(rs.getInt("id")).append(",")
                  .append("\"name\":\"").append(rs.getString("item_name")).append("\",")
                  .append("\"price\":").append(rs.getInt("price"))
                  .append("},");
        }

        if (result.charAt(result.length() - 1) == ',') {
            result.deleteCharAt(result.length() - 1);
        }

    } catch (Exception e) {
        e.printStackTrace();
    }

    result.append("]");
    return result.toString();
}
}
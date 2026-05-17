package controller;

import com.sun.net.httpserver.*;
import java.io.*;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.regex.*;
import Service.AuthService;
import db.DBConnection;

public class ServerAuthHandler implements HttpHandler {
    AuthService auth = new AuthService();

   @Override
    public void handle(HttpExchange exchange) throws IOException {

    exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
    exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

    if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
        exchange.sendResponseHeaders(204, -1);
        return;
    }

    String path = exchange.getRequestURI().getPath();

    InputStream is = exchange.getRequestBody();
    String body = new String(is.readAllBytes());

    System.out.println("BODY: " + body);

    String username = body.split("\"username\":\"")[1].split("\"")[0];
    String password = body.split("\"password\":\"")[1].split("\"")[0];

    System.out.println("USERNAME = " + username);
    System.out.println("PASSWORD = " + password);

    String response = "";

    try {

        Connection conn = DBConnection.getConnection();

        if (path.equals("/login")) {

            PreparedStatement ps = conn.prepareStatement(
                "SELECT * FROM users WHERE username=? AND password=?"
            );

            ps.setString(1, username);
            ps.setString(2, password);

            ResultSet rs = ps.executeQuery();

            if (rs.next()) {

                response = "{\"success\":true,\"userId\":\"" + rs.getInt("id") + "\",\"token\":\"abc123\"}";

            } else {

                response = "{\"success\":false,\"message\":\"Invalid username or password\"}";
            }

        } else if (path.equals("/register")) {

            PreparedStatement check = conn.prepareStatement(
                "SELECT * FROM users WHERE username=?"
            );

            check.setString(1, username);

            ResultSet checkRs = check.executeQuery();

            if (checkRs.next()) {

                response = "{\"success\":false,\"message\":\"Username already exists\"}";

            } else {

                PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO users(username,password) VALUES(?,?)"
                );

                ps.setString(1, username);
                ps.setString(2, password);

                int rows = ps.executeUpdate();

                if (rows > 0) {

                    response = "{\"success\":true}";

                } else {

                    response = "{\"success\":false}";
                }
            }
        }

        conn.close();

    } catch (Exception e) {

        e.printStackTrace();

        response =  "{\"success\":false,\"message\":\"Server error\"}";
    }

    exchange.sendResponseHeaders(200, response.getBytes().length);

    OutputStream os = exchange.getResponseBody();

    os.write(response.getBytes());

    os.close();
    }
}
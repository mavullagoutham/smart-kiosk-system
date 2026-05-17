package controller;

import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;

public class Main {

    public static void main(String[] args) {

        try {

            HttpServer server =
                    HttpServer.create(new InetSocketAddress(8080),0);

            // Menu APIs
            server.createContext("/getMenu", new Server.MyHandler());

            server.createContext("/placeOrder", new Server.OrderHandler());

            server.createContext("/getOrders", new Server.OrdersHandler());

            server.createContext("/getBill", new Server.BillHandler());

            server.createContext("/getHelp", new Server.HelpHandler());

            // Auth APIs
            server.createContext("/login", new ServerAuthHandler());

            server.createContext("/register", new ServerAuthHandler());

            server.setExecutor(null);

            server.start();

            System.out.println("Server started on port 8080");

        }

        catch (Exception e) {
            e.printStackTrace();
        }
    }
}
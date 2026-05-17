package controller;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import Service.MenuService;
import Service.OrderService;
import Service.AIService;

import java.io.IOException;
import java.net.InetSocketAddress;

public class Server {

    public static void main(String[] args) throws Exception {

        HttpServer server =
            HttpServer.create(new InetSocketAddress(8080), 0);

        server.createContext("/getMenu", new MyHandler());
        server.createContext("/placeOrder", new OrderHandler());
        server.createContext("/getOrders", new OrdersHandler());
        server.createContext("/getBill", new BillHandler());
        server.createContext("/getHelp", new HelpHandler());
        server.createContext("/login", new ServerAuthHandler());
        server.createContext("/register", new ServerAuthHandler());

        server.setExecutor(null);

        server.start();

        System.out.println("Server started at http://localhost:8080");
    }

    // MENU
    public static class MyHandler implements HttpHandler {

        @Override
        public void handle(HttpExchange exchange)
                throws IOException {

            String response = MenuService.getMenuData();

            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");

            exchange.sendResponseHeaders(200, response.length());

            exchange.getResponseBody().write(response.getBytes());

            exchange.getResponseBody().close();
        }
    }

    // PLACE ORDER
    public static class OrderHandler implements HttpHandler {

        @Override
        public void handle(HttpExchange exchange) throws IOException {

            String query = exchange.getRequestURI().getQuery();

            String item = "Unknown";

            int price = 0;

            int userId = 0;

            if (query != null) {

                String[] params = query.split("&");

                for (String param : params) {

                    String[] keyValue = param.split("=");

                    if (keyValue[0].equals("item")) {

                        item = keyValue[1];

                    } else if (keyValue[0].equals("price")) {

                        price = Integer.parseInt(keyValue[1]);

                    } else if (keyValue[0].equals("user")) {

                        userId = Integer.parseInt(keyValue[1]);
                    }
                }
            }

            String response = OrderService.placeOrder(userId, item, price);

            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");

            exchange.sendResponseHeaders(200, response.length());

            exchange.getResponseBody().write(response.getBytes());

            exchange.getResponseBody().close();
        }
    }

    // GET ORDERS
    public static class OrdersHandler implements HttpHandler {

        @Override
        public void handle(HttpExchange exchange) throws IOException {

            String query = exchange.getRequestURI().getQuery();

            int userId = 0;

            if (query != null) {

                String[] params = query.split("&");

                for (String param : params) {

                    String[] keyValue = param.split("=");

                    if (keyValue[0].equals("user")) {

                        userId = Integer.parseInt(keyValue[1]);
                    }
                }
            }

            String response = OrderService.getOrders(userId);

            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");

            exchange.sendResponseHeaders(200, response.length());

            exchange.getResponseBody().write(response.getBytes());

            exchange.getResponseBody().close();
        }
    }

    // BILL
    public static class BillHandler implements HttpHandler {

        @Override
        public void handle(HttpExchange exchange)
                throws IOException {

            String query = exchange.getRequestURI().getQuery();

            int userId = 0;

            if (query != null) {

                String[] params = query.split("&");

                for (String param : params) {

                    String[] keyValue = param.split("=");

                    if (keyValue[0].equals("user")) {
                        userId = Integer.parseInt(keyValue[1]);
                    }
                }
            }

            int total = OrderService.getTotalBill(userId);

            String response = "{\"total\":" + total + "}";

            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");

            exchange.sendResponseHeaders(200, response.length());

            exchange.getResponseBody().write(response.getBytes());

            exchange.getResponseBody().close();
        }
    }

    // AI HELP
    public static class HelpHandler implements HttpHandler {

        @Override
        public void handle(HttpExchange exchange) throws IOException {

            String query = exchange.getRequestURI().getQuery();

            String userQuery = "";

            if (query != null) {

                userQuery = query.split("=")[1];
            }

            String response = AIService.getHelp(userQuery);

            exchange.getResponseHeaders() .add("Access-Control-Allow-Origin", "*");

            exchange.sendResponseHeaders(200, response.length());

            exchange.getResponseBody().write(response.getBytes());

            exchange.getResponseBody().close();
        }
    }
}
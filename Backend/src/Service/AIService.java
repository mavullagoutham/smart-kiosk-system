package Service;

public class AIService {
    public static String getHelp(String query) {
        query = query.toLowerCase();

        if (query.equalsIgnoreCase("hi")) {
            return "Hi 👋 Have a great day! How can I help you?";
        }
        else if (query.contains("suggest")) {
            return "I recommend Burger 🍔 or Pizza 🍕. They are popular!";
        }
        else if (query.contains("order")) {
            return "Go to Menu section and click Order button.";
        }
        
        else if (query.contains("menu")) {
            return "Menu shows available food items.";
        } 
        else {
            return "Please follow instructions on screen.";
        }
    }
}
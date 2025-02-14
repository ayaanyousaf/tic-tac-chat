package com.example.tictactoe;

import java.io.*;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import org.apache.commons.lang3.RandomStringUtils;
import org.json.JSONArray;

/**
 * This is a class that has services
 * In our case, we are using this to generate unique room IDs**/
@WebServlet(name = "chatServlet", value = "/chat-servlet")
public class ChatServlet extends HttpServlet {
    public static Set<String> rooms = ConcurrentHashMap.newKeySet(); // thread-safe set

    private String message;

    /**
     * Method generates unique room codes
     * **/
    public String generatingRandomUpperAlphanumericString(int length) {
        String generatedString = RandomStringUtils.randomAlphanumeric(length).toUpperCase();
        // generating unique room code
        while (rooms.contains(generatedString)){
            generatedString = RandomStringUtils.randomAlphanumeric(length).toUpperCase();
        }
        rooms.add(generatedString);

        return generatedString;
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Determine the type of request: new room, list rooms or removing room list
        String action = request.getParameter("action");

        if ("list".equals(action)) {
            // Return the list of active rooms
            response.setContentType("application/json");
            PrintWriter out = response.getWriter();
            out.println(new JSONArray(rooms).toString());
        }
        else if ("cleanup".equals(action)){
            destroy();
            // Respond to the client
            response.setContentType("text/plain");
            PrintWriter out = response.getWriter();
            out.println("Cleanup completed");
        }
        else {
            // Create a new room
            response.setContentType("text/plain");
            PrintWriter out = response.getWriter();
            out.println(generatingRandomUpperAlphanumericString(5));
        }
    }

    public void destroy() {
        rooms = ConcurrentHashMap.newKeySet(); 
    }
}

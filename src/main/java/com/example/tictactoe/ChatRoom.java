package com.example.tictactoe;

import jakarta.websocket.Session;
import org.json.JSONObject;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ChatRoom {
    private String code;
    private Map<String, Session> userSessions = new ConcurrentHashMap<>();
    private Map<String, String> usernames = new ConcurrentHashMap<>();
    private Map<String, String> userMoods = new ConcurrentHashMap<>();
    private Runnable onEmptyCallback;

    public ChatRoom(String code, Runnable onEmptyCallback) {
        this.code = code;
        this.onEmptyCallback = onEmptyCallback;
    }

    public void addUser(String userID, Session session, String username) {
        userSessions.put(userID, session);
        usernames.put(userID, username);
        userMoods.put(userID, ""); // Start with no mood
        sendMessage(session, "Server", "Welcome " + username + "!");
        broadcastMessage("Server", username + " has joined the chat room.");
    }

    // Send a message only to one user
    private void sendMessage(Session session, String sender, String message) {
        JSONObject jsonMessage = new JSONObject();
        jsonMessage.put("username", sender);
        jsonMessage.put("text", message);
        jsonMessage.put("time", System.currentTimeMillis());
        // Don't include mood in this personal welcome message
        try {
            session.getBasicRemote().sendText(jsonMessage.toString());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void removeUser(String userID) {
        userSessions.remove(userID);
        String username = usernames.remove(userID);
        if (username != null) {
            broadcastMessage("Server", username + " has left the chat room.");
        }
        if (userSessions.isEmpty() && onEmptyCallback != null) {
            onEmptyCallback.run();
        }
    }

    public String getUsername(String userID) {
        return usernames.get(userID);
    }

    // Updated setUserMood method to include logging and broadcast a standard message
    public void setUserMood(String userID, String mood, String moodText) {
        userMoods.put(userID, mood);
        if (!mood.isEmpty()) {
            System.out.println(usernames.get(userID) + " is: " + moodText); // Log the mood with the text including the emoji
            broadcastMessage("Server", usernames.get(userID) + " is feeling " + moodText); // Broadcast the mood text with the emoji
        }
    }

    // Update broadcastMessage in ChatRoom.java to handle user moods more accurately
    public void broadcastMessage(String sender, String message) {
        JSONObject jsonMessage = new JSONObject();
        jsonMessage.put("username", sender);
        jsonMessage.put("text", message);
        jsonMessage.put("time", System.currentTimeMillis());

        if ("Server".equals(sender)) {
            // Server messages do not carry mood information
            jsonMessage.put("mood", JSONObject.NULL);
        } else {
            // For user messages, add the mood if it's not empty
            String mood = userMoods.getOrDefault(sender, ""); // sender should be userID here
            if (!mood.isEmpty()) {
                jsonMessage.put("mood", mood);
            } else {
                jsonMessage.put("mood", "");
            }
        }

        // Broadcasting the message
        String jsonMessageString = jsonMessage.toString();
        userSessions.values().forEach(session -> {
            try {
                session.getBasicRemote().sendText(jsonMessageString);
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }
}
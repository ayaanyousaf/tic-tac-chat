package com.example.tictactoe;

import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import org.json.JSONObject;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@ServerEndpoint(value = "/ws/{roomID}")
public class ChatServer {
    private static final Map<String, ChatRoom> chatRooms = new ConcurrentHashMap<>();
    // Static method to get ChatRoom by room code
    public static ChatRoom getChatRoom(String roomCode) {
        return chatRooms.get(roomCode);
    }

    @OnOpen
    public void open(@PathParam("roomID") String roomID, Session session) {
        chatRooms.computeIfAbsent(roomID, id -> new ChatRoom(id, () -> {
            System.out.println("Room " + id + " is now empty.");
            ChatServlet.rooms.remove(id);
        }));
    }

    @OnMessage
    public void handleMessage(String message, @PathParam("roomID") String roomID, Session session) {
        JSONObject jsonMessage = new JSONObject(message);
        ChatRoom room = chatRooms.get(roomID);

        if (room != null) {
            String type = jsonMessage.optString("type");
            if ("username".equals(type)) {
                // If it's a username message, add the user but do not broadcast
                String username = jsonMessage.getString("username");
                room.addUser(session.getId(), session, username);
            } else if ("mood".equals(type)) {
                // Handle mood update
                String mood = jsonMessage.optString("mood");
                String moodText = jsonMessage.optString("moodText", ""); // Get the mood text which includes the emoji
                String userID = session.getId();
                room.setUserMood(userID, mood, moodText); // Update the mood with the text containing emoji
            } else {
                // For all other messages, broadcast normally
                String username = room.getUsername(session.getId());
                room.broadcastMessage(username, jsonMessage.getString("text"));
            }
        }
    }

    @OnClose
    public void close(@PathParam("roomID") String roomID, Session session) {
        ChatRoom room = chatRooms.get(roomID);
        if (room != null) {
            room.removeUser(session.getId());
        }
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        System.err.println("Error in WebSocket connection: " + throwable.getMessage());
        throwable.printStackTrace();
    }
}

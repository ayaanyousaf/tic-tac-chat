package com.example.tictactoe;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

public class GameServlet extends HttpServlet {
    private final GameService gameService = new GameService();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("action");
        if ("reset".equals(action)) {
            gameService.resetGame();
            response.sendRedirect("tictactoe.html"); // Redirect to the game page
        } else {
            // Old Code to send the game state
            response.setContentType("application/json");
            objectMapper.writeValue(response.getOutputStream(), gameService.getGameState());
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int row;
        int col;
        try {
            // Get move from the request parameters
            row = Integer.parseInt(request.getParameter("row"));
            col = Integer.parseInt(request.getParameter("col"));
        } catch (NumberFormatException e) {
            // If the parameters are not valid integers, set an error response
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("Invalid row or column number.");
            return;
        }

        System.out.println("Received move: row " + row + ", col " + col);
        boolean moveMade = gameService.makeMove(row, col);
        System.out.println("Move made: " + moveMade);

        // Respond with the updated game state or an error message if the move was invalid
        response.setContentType("application/json");
        if (moveMade) {
            // Return the new game state if the move was successful
            objectMapper.writeValue(response.getOutputStream(), gameService.getGameState());
        } else {
            // Set an error response if the move was invalid
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("Invalid move.");
        }
    }
}

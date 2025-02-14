package com.example.tictactoe;

import java.util.Arrays;

public class GameService {
    private GameState gameState;

    public GameService() {
        this.gameState = new GameState();
    }

    public GameState getGameState() {
        return gameState;
    }

    public synchronized boolean makeMove(int row, int col) {
        if (row < 0 || row >= 3 || col < 0 || col >= 3) {
            return false; // Invalid move
        }

        if (gameState.getBoard()[row][col] != '-') {
            return false; // Cell is already occupied
        }

        gameState.getBoard()[row][col] = gameState.getCurrentPlayer();
        boolean won = checkWin();
        boolean draw = checkDraw();

        if (won) {
            gameState.setGameWon(true);
        } else if (draw) {
            gameState.setGameDraw(true);
        } else {
            // Change the turn
            gameState.setCurrentPlayer(gameState.getCurrentPlayer() == 'X' ? 'O' : 'X');
        }
        return true;
    }

    private boolean checkWin() {
        char[][] board = gameState.getBoard();
        // Check rows for a win
        for (int i = 0; i < 3; i++) {
            if (board[i][0] != '-' && board[i][0] == board[i][1] && board[i][0] == board[i][2]) {
                gameState.setWinningLine(Arrays.asList(i + "-0", i + "-1", i + "-2"));
                return true; // Row win
            }
        }
        // Check columns for a win
        for (int j = 0; j < 3; j++) {
            if (board[0][j] != '-' && board[0][j] == board[1][j] && board[0][j] == board[2][j]) {
                gameState.setWinningLine(Arrays.asList("0-" + j, "1-" + j, "2-" + j));
                return true; // Column win
            }
        }
        // Check main diagonal for a win
        if (board[0][0] != '-' && board[0][0] == board[1][1] && board[0][0] == board[2][2]) {
            gameState.setWinningLine(Arrays.asList("0-0", "1-1", "2-2"));
            return true; // Main diagonal win
        }
        // Check anti-diagonal for a win
        if (board[0][2] != '-' && board[0][2] == board[1][1] && board[0][2] == board[2][0]) {
            gameState.setWinningLine(Arrays.asList("0-2", "1-1", "2-0"));
            return true; // Anti-diagonal win
        }
        return false; // No win
    }


    private boolean checkDraw() {
        char[][] board = gameState.getBoard();

        // Check if the board is full
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (board[i][j] == '-') {
                    return false; // There's an empty cell, game is not a draw
                }
            }
        }

        // If the board is full and no one has won, it's a draw
        return true;
    }
    public synchronized void resetGame() {
        this.gameState = new GameState();
    }

}

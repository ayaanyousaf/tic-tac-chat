package com.example.tictactoe;

import java.util.List;

public class GameState {
    private char[][] board;
    private char currentPlayer;
    private boolean gameWon;
    private boolean gameDraw;
    private List<String> winningLine; // No need to initialize here if you're doing it in the constructor

    public GameState() {
        // Initialize the board with '-' indicating empty cells
        board = new char[][]{
                {'-', '-', '-'},
                {'-', '-', '-'},
                {'-', '-', '-'}
        };
        currentPlayer = 'X'; // X starts the game
        gameWon = false;
        gameDraw = false;
        winningLine = null; // Initialize winningLine as null to indicate no win at start
    }

    // Getters and setters
    public char[][] getBoard() {
        return board;
    }

    public char getCurrentPlayer() {
        return currentPlayer;
    }

    public void setCurrentPlayer(char currentPlayer) {
        this.currentPlayer = currentPlayer;
    }

    public boolean isGameWon() {
        return gameWon;
    }

    public void setGameWon(boolean gameWon) {
        this.gameWon = gameWon;
    }

    public boolean isGameDraw() {
        return gameDraw;
    }

    public void setGameDraw(boolean gameDraw) {
        this.gameDraw = gameDraw;
    }

    public List<String> getWinningLine() {
        return winningLine;
    }

    public void setWinningLine(List<String> winningLine) {
        this.winningLine = winningLine;
    }
}

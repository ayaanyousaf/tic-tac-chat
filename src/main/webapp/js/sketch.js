let circles = [];

// Event listener for reset game button
const resetGameButton = document.getElementById("reset-game");
resetGameButton.addEventListener("click", resetAnimation);

function setup() {
    let cnv = createCanvas(windowWidth, windowHeight);
    cnv.parent('game-container');
    noStroke();
    clear(); // Keeps the canvas transparent.
}

function draw() {
    // Loop through and draw circles
    for (let i = circles.length - 1; i >= 0; i--) {
        let circle = circles[i];

        // Increase the size of the circle
        circle.size += 2;
        // Decrease the opacity as it grows
        circle.alpha -= (circle.alpha * 0.01); // Decrease alpha based on its initial value

        // Set the fill color with the updated alpha
        fill(100, 100, 250, circle.alpha);
        // Draw the circle
        ellipse(circle.x, circle.y, circle.size);

        // Remove the circle from the array if it's completely faded
        if (circle.alpha <= 0) {
            circles.splice(i, 1);
        }
    }
}

function mousePressed() {
    // Assuming your game board is centered
    const boardWidth = 300; // total width of the board
    const boardHeight = 300; // total height of the board
    const boardTopLeftX = (windowWidth - boardWidth) / 2;
    const boardTopLeftY = (windowHeight - boardHeight) / 2;

    // Check if the mouse is within the bounds of the game board
    if (
        mouseX > boardTopLeftX &&
        mouseX < boardTopLeftX + boardWidth &&
        mouseY > boardTopLeftY &&
        mouseY < boardTopLeftY + boardHeight
    ) {
        circles.push({ x: mouseX, y: mouseY, size: 0, alpha: 200 });
    }
}

// Resize the canvas when the window is resized
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// Function to reset animation when game is reset
function resetAnimation() {
    clear();
    circles = [];
}

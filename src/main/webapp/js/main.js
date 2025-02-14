document.getElementById('create-room').addEventListener('click', createAndJoinRoom);
document.getElementById('send-message').addEventListener('click', sendMessage);
document.getElementById('chat-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
document.getElementById('mood-select').addEventListener('change', function() {
    const moodText = this.options[this.selectedIndex].text;
    const moodValue = this.value;
    console.log('Sending mood:', moodText);
    if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify({ type: 'mood', mood: moodValue, moodText: moodText }));
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Fetch and display the list of chat rooms when the page loads
    fetchRoomList();
});

let websocket = null;
let currentRoom = null;
let username = null;

function getUsername() {
    // If the username is not already set, prompt for it
    if (!username) {
        username = prompt("Please enter your username:", "HarryPotter");
        // Check if the user clicked "cancel" and handle accordingly
        if (username === null) {
            // User cancelled the prompt, handle as needed
            return false;
        }
    }
    return true;
}

// Allow user to search for rooms by code
document.querySelector('.search-button').addEventListener('click', searchRooms);

// Allow users to also search by pressing 'Enter' key
document.querySelector('.search-bar input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchRooms();
    }
});

// Function for searching rooms. Changes CSS styles to achieve functionality.
function searchRooms() {
    const searchInput = document.querySelector('.search-bar input').value.toUpperCase().trim();
    const roomListElements = document.querySelectorAll('#room-list li');

    roomListElements.forEach(room => {
        const roomCode = room.textContent.toUpperCase().trim();

        if (roomCode.includes(searchInput)) {
            room.style.display = 'block'; // display room if searched for
        }
        else {
            room.style.display = 'none'; // hide room if not in search input
        }
    })
}

// Allow user to refresh rooms
document.querySelector('.refresh-button').addEventListener('click', refreshRooms);
function refreshRooms(){

    fetch('/TicTacToe-1.0-SNAPSHOT/chat-servlet?action=cleanup')
        .then(response => response.text())
        .then(response => {
            console.log(response);
        })
        .catch(error => console.error('Error clearing rooms:', error));

    fetchRoomList();

    document.getElementById("chat-messages").innerHTML = "";
    leaveRoom();
}
function fetchRoomList() {
    fetch('/TicTacToe-1.0-SNAPSHOT/chat-servlet?action=list')
        .then(response => response.json())
        .then(rooms => {
            const roomListElement = document.getElementById('room-list');
            roomListElement.innerHTML = ''; // Clear existing list
            rooms.forEach(roomCode => {
                console.log(`Room: ${roomCode}, Current Room: ${currentRoom}`); // Debugging line
                const listItem = document.createElement('li');
                const actionButton = document.createElement('button');

                if (currentRoom === roomCode) {
                    // Change text to "Leave" if this is the current room
                    actionButton.textContent = `Leave ${roomCode}`;
                    actionButton.addEventListener('click', () => {
                        leaveRoom();
                        fetchRoomList(); // Refresh the list after leaving the room
                    });
                } else {
                    // Otherwise, use "Join"
                    actionButton.textContent = `Join ${roomCode}`;
                    actionButton.addEventListener('click', () => joinRoom(roomCode));
                }

                listItem.appendChild(actionButton);
                roomListElement.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching room list:', error));
}

function createAndJoinRoom() {
    if (getUsername()) {
        // Get the selected mood from the dropdown
        const mood = document.getElementById('mood-select').value;

        fetch('/TicTacToe-1.0-SNAPSHOT/chat-servlet')
            .then(response => response.text())
            .then(roomCode => {
                currentRoom = roomCode; // Set the current room
                document.getElementById('room-id').textContent = roomCode;
                document.getElementById('chat-room').style.display = 'block';
                fetchRoomList(); // Update room list to reflect the change in the button text
                document.querySelectorAll('#room-list button').forEach(button => {
                    if (button.textContent.includes(roomCode)) {
                        button.textContent = `Leave ${roomCode}`;
                        button.removeEventListener('click', joinRoom); // Remove old event listener
                        button.addEventListener('click', leaveRoom); // Add new event listener
                    }
                });
            })
            .catch(error => console.error('Error fetching room code:', error));
    }
}

function joinRoom(roomCode) {
    if (getUsername()) {
        if (websocket !== null) {
            websocket.close();
        }

        currentRoom = roomCode; // Set the current room before establishing a new WebSocket
        document.getElementById('room-id').textContent = roomCode;
        document.getElementById('chat-room').style.display = 'block';

        const wsUrl = `ws://${window.location.hostname}:8080/TicTacToe-1.0-SNAPSHOT/ws/${roomCode}`;
        websocket = new WebSocket(wsUrl);

        websocket.addEventListener('open', function (event) {
            // Retrieve the current mood from the mood selector
            const currentMood = document.getElementById('mood-select').value;
            console.log('Connected to the room:', roomCode);
            // Now mood is defined in this scope
            websocket.send(JSON.stringify({type: 'username', username: username, text: "has joined the chat room.", mood: currentMood}));
            fetchRoomList(); // Fetch the room list after the WebSocket is opened
        });

        // Listen for messages from the server
        websocket.addEventListener('message', function (event) {
            displayMessage(event.data);
        });

        // Handle WebSocket errors
        websocket.addEventListener('error', function (event) {
            console.error('WebSocket error:', event);
        });
    }
}

// Function to leave the current room
function leaveRoom() {
    if (websocket !== null) {
        websocket.close(); // Close the WebSocket connection
        websocket = null;
    }
    currentRoom = null;
    document.getElementById('room-id').textContent = '';
    document.getElementById('chat-room').style.display = 'none';
    document.getElementById('room-list').style.display = 'block'; // Show the room list
    fetchRoomList(); // Refresh the room list
}

function sendMessage() {
    const messageInput = document.getElementById('chat-input');
    const message = messageInput.value.trim();
    if (message && websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify({username: username, text: message}));
        messageInput.value = ''; // Clear the input after sending
    }
}

function displayMessage(data) {
    console.log('Raw message data:', data);
    const chatMessages = document.getElementById('chat-messages');
    let messageData;

    try {
        messageData = JSON.parse(data);
    } catch (error) {
        console.error('Error parsing message data:', error);
        return;
    }

    // Identify if the message is from the current user
    const isCurrentUser = messageData.username === username;

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    // Apply 'from-me' or 'from-them' class depending on the message sender
    messageDiv.classList.add(isCurrentUser ? 'from-me' : 'from-them');

    const senderSpan = document.createElement('span');
    senderSpan.classList.add('sender');
    senderSpan.textContent = isCurrentUser ? 'You' : messageData.username;
    messageDiv.appendChild(senderSpan);

    if (messageData.moodText) {
        const moodSpan = document.createElement('span');
        moodSpan.classList.add('mood');
        moodSpan.textContent = ` ${messageData.moodText}`; // This should include the emoji
        messageDiv.appendChild(moodSpan);
    }

    const messageParagraph = document.createElement('p');
    messageParagraph.textContent = messageData.text;
    messageDiv.appendChild(messageParagraph);

    const timestampSpan = document.createElement('span');
    timestampSpan.classList.add('timestamp');
    timestampSpan.textContent = new Date(messageData.time).toLocaleTimeString();
    messageDiv.appendChild(timestampSpan);

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


window.addEventListener('beforeunload', function() {
    if (websocket) {
        websocket.close();
    }
});
document.addEventListener('DOMContentLoaded', function(event) {
    var dataText = ["ABOUT US:", "CREATED BY: ANAS BAIG, AYAAN YOUSAF, FREZA MAJITHIA, & MARK CHAITRA", "ENJOY ;)"];
    var typingSpeed = 100; // Adjust typing speed as needed
    var eraseSpeed = 50; // Adjust erasing speed as needed
    var delayBeforeTyping = 2000; // Delay before typing next phrase
    var delayBeforeErasing = 1000; // Delay before erasing current phrase

    function typeWriter(text, index, callback) {
        if (index < text.length) {
            document.querySelector(".typing-effect").textContent += text.charAt(index);
            index++;
            setTimeout(function() {
                typeWriter(text, index, callback);
            }, typingSpeed);
        } else {
            setTimeout(callback, delayBeforeErasing);
        }
    }

    function startErasing(callback) {
        var textElement = document.querySelector(".typing-effect");
        var text = textElement.textContent;
        var index = text.length - 1;
        var eraseInterval = setInterval(function() {
            if (index >= 0) {
                textElement.textContent = text.substring(0, index);
                index--;
            } else {
                clearInterval(eraseInterval);
                setTimeout(callback, delayBeforeTyping);
            }
        }, eraseSpeed);
    }

    function animateText(index) {
        if (index < dataText.length) {
            typeWriter(dataText[index], 0, function() {
                startErasing(function() {
                    animateText((index + 1) % dataText.length);
                });
            });
        }
    }

    animateText(0);
});
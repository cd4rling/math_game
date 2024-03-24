$(document).ready(function() {
    let timer;
    let seconds = 10;
    let endGame;
    let timerStarted = false;
    let score = 0;
    let highScore = 0;

    // Function to focus on the input element
    function focusInput() {
        $("#user-answer").focus();
    }

    // Function to update the number limit
    function updateNumberLimit() {
        let numLimit = $("#number-limit").val();
        $("#numLimit").text(numLimit);
    }

    // Function to update the timer text
    function updateTimerText() {
        $("#timer").text(seconds + " seconds left!");
    }

    // Function to start the countdown timer
    function startTimer() {
        clearInterval(timer);
        timer = setInterval(function() {
            seconds--;
            if (seconds >= 0) {
                updateTimerText();
                endGame = false;
            } else {
                clearInterval(timer);
                $("#timer").text("Time's up!");
                endGame = true;
                timerStarted = false;
                seconds = 10;
                endOfGame();
            }
        }, 1000);
    }

    // Function to end the game
    function endOfGame() {
        var message = ["Game over", "Try again"];
        var scoreUpdate = ["Your Score", score];
        var flashColors = ["orange", "white"];
        var index = 0;

        function cycleWords() {
            $(".problemBox").text(message[index]);
            $("#user-answer").val(scoreUpdate[index]);
            if (score === highScore) {
                $("#highScore, #score").css("color", flashColors[index]);
            }
            index = (index + 1) % message.length;
        }

        cycleWords();

        var timer = setInterval(cycleWords, 1500);

        setTimeout(function() {
            clearInterval(timer);
            timerStarted = false;
            seconds = 10;
            score = 0;
            updateTimerText();
            $("#score").text("Score: " + score);
            $("#highScore, #score").css("color", "white");
            endGame = false;
            gamePlay();
        }, 6000);
    }

    // Function to check math operators
    function mathCheck() {
        let parameters = {};
        $('.answerBox .btnMath').each(function() {
            let newProperty = $(this).attr('id');
            parameters[newProperty] = $(this).hasClass('active');
        });
        return parameters;
    }

    // Function to generate random integers
    function getRandomInt() {
        let numLimit = $("#number-limit").val();
        let min = 1;
        let a = Math.floor(Math.random() * (numLimit - min + 1)) + min;
        let b = Math.floor(Math.random() * (numLimit - min + 1)) + min;
        return [a, b];
    }

    // Problem creators
    let problemCreators = {
        add: function(num1, num2) {
            return {
                problem: `${num1} + ${num2}`,
                answer: num1 + num2
            };
        },
        subtract: function(num1, num2) {
            return {
                problem: `${Math.max(num1, num2)} - ${Math.min(num1, num2)}`,
                answer: Math.max(num1, num2) - Math.min(num1, num2)
            };
        },
        multiply: function(num1, num2) {
            return {
                problem: `${num1} x ${num2}`,
                answer: num1 * num2
            };
        },
        divide: function(num1, num2) {
            let result = Math.max(num1, num2) / Math.min(num1, num2);
            if (Number.isInteger(result)) {
                return {
                    problem: `${Math.max(num1, num2)} / ${Math.min(num1, num2)}`,
                    answer: result
                };
            } else {
                // If the result is not an integer, generate new random numbers and try again
                this.getRandomInt();
                return this.divide(this.mathNumbers[0], this.mathNumbers[1]);
            }
        }
        
    };

    // Function to start the game
    function gamePlay() {
        $("#user-answer").val("");
        let mathOperators = mathCheck();
        let operator = Object.keys(mathOperators).find(key => mathOperators[key]);
        if (!operator) {
            alert("Choose a math operator");
            return;
        }
        let [num1, num2] = getRandomInt();
        let problem = problemCreators[operator](num1, num2);
        $(".problemBox").text(problem.problem);
        $("#user-answer").on('input', function(event) {
            let userAnswer = parseInt($(this).val());
            if (userAnswer === problem.answer) {
                $(this).css("color", "green");
                score++;
                $("#score").text("Score: " + score);
                if (score > highScore) {
                    highScore = score;
                    $("#highScore").text("High Score: " + highScore);
                }
                seconds++;
                updateTimerText();
                setTimeout(gamePlay, 500);
            } else {
                $(this).css("color", "red");
            }
        });
    }

    // Event listeners
    window.onload = function() {
        focusInput();
        updateTimerText();
        gamePlay();
        updateNumberLimit();
    }

    $("#number-limit").change(updateNumberLimit);
    $('button').click(function() {
        $(this).toggleClass('active');
        gamePlay();
    });
    $("#user-answer").on('input', function(event) {
        if (!timerStarted) {
            startTimer();
            timerStarted = true;
        }
    });
});

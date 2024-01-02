/*
    Description: Online Quiz App
    Author: Muhammad Hashim
    Date: December 30, 2024
*/

// Global variables
var answerOptions = document.getElementsByClassName("answer-option");
var quizQuestion = document.getElementById("question-text");
var feedbackMessage = document.getElementById("feedback-content");
var marksDisplay = document.getElementById("quiz-marks");
var timerDisplay = document.getElementById("quiz-timer");
var timerInterval;
var userMarks = 0;
var correctAnswer = null;
var isQuizStarted = false;

// Function to generate a random integer between min and max (inclusive)
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate the next quiz question
function generateNextQuestion() {
    let operand1 = getRandomInteger(1, 100);
    let operand2 = getRandomInteger(1, 100);
    const operators = ['+', '-'];
    const operatorIndex = getRandomInteger(0, 1); // 0 for addition, 1 for subtraction
    switch (operators[operatorIndex]) {
        case '+':
            correctAnswer = operand1 + operand2;
            break;
        case '-':
            correctAnswer = operand1 - operand2;
            break;
    }

    // Display the question and answer options
    quizQuestion.textContent = operand1.toString() + " " + operators[operatorIndex] + " " + operand2.toString();
    const correctAnswerIndex = getRandomInteger(0, 3);
    answerOptions[correctAnswerIndex].textContent = correctAnswer.toString();
    for (let i = 0; i < answerOptions.length; i++) {
        if (correctAnswerIndex === i) {
            continue;
        }
        answerOptions[i].textContent = getRandomInteger(-100, 200).toString();
    }
}

// Function to check the user's answer
function checkUserAnswer(selectedOption) {
    if (isQuizStarted && timerDisplay.style.visibility !== "hidden") {
        let selectedAnswer = selectedOption.textContent;
        if (selectedAnswer === correctAnswer.toString()) {
            // If the answer is correct
            userMarks++;
            feedbackMessage.textContent = "Correct Answer";
            feedbackMessage.style.backgroundColor = "rgb(6, 118, 6)";
            updateMarksDisplay();
        } else {
            // If the answer is wrong
            feedbackMessage.textContent = "Wrong. Try Again!";
            feedbackMessage.style.backgroundColor = "rgb(157, 18, 18)";
        }

        // Generate the next question after a short delay
        setTimeout(() => {
            if (isQuizStarted && timerDisplay.style.visibility !== "hidden") {
                generateNextQuestion();
            }
        }, 500);
    } else if (!isQuizStarted) {
        // If the quiz hasn't started
        feedbackMessage.textContent = "First start the quiz";
        feedbackMessage.style.backgroundColor = "orange";
    } else {
        // If the time is up
        feedbackMessage.textContent = "Time's up! Quiz is over.";
        feedbackMessage.style.backgroundColor = "rgb(157, 18, 18)";
    }
}

// Function to update the display of user's marks
function updateMarksDisplay() {
    marksDisplay.textContent = "Marks: " + userMarks;
}

// Function to start the quiz
function startQuiz() {
    const startButton = document.getElementById("start-quiz-btn");
    startButton.textContent = "Reset";
    startButton.onclick = resetQuiz;
    isQuizStarted = true;

    // Generate the first question and start the timer
    generateNextQuestion();
    startQuizTimer();
}

// Function to start the quiz timer
function startQuizTimer() {
    let timerDuration = 60; // Set the initial timer duration in seconds
    timerDisplay.style.visibility = "visible";
    timerInterval = setInterval(function () {
        if (timerDuration < 0) {
            // If time is up, clear the interval and show the quiz score
            clearInterval(timerInterval);
            showQuizScore();
        } else {
            // Update the timer display
            timerDisplay.textContent = "Remaining Time: " + timerDuration + " Sec";
        }
        timerDuration--;
    }, 1000); // Update the timer every second
}

// Function to reset the quiz
const resetQuiz = () => {
    const startButton = document.getElementById("start-quiz-btn");
    startButton.textContent = "Start Quiz";
    startButton.onclick = startQuiz;
    isQuizStarted = false;

    // Clear the question and answer options, reset the timer and marks
    quizQuestion.textContent = "";
    for (let i = 0; i < answerOptions.length; i++) {
        answerOptions[i].textContent = "";
    }
    clearInterval(timerInterval);
    userMarks = 0;
    marksDisplay.textContent = "Marks: ";
    timerDisplay.textContent = "Time Remaining: ";
    timerDisplay.style.visibility = "hidden";

    // Clear the feedback message
    feedbackMessage.textContent = "";
    feedbackMessage.style.backgroundColor = "transparent";

    // Hide the quiz score display
    document.getElementById("quiz-score").style.display = "none";
}

// Function to show the quiz score
function showQuizScore() {
    // Display the quiz score
    const scoreBox = document.getElementById("quiz-score");
    scoreBox.style.display = "flex";
    scoreBox.innerHTML = "QUIZ OVER <br> <br> YOUR MARKS: " + userMarks;

    // Hide correct/incorrect divs
    const correctIncorrectDivs = document.getElementById("feedback-content");
    correctIncorrectDivs.style.display = "none";

    // Hide time remaining
    timerDisplay.style.visibility = "hidden";

    // Reset marks to 0
    userMarks = 0;
    updateMarksDisplay();

    // Auto reset after 10 seconds
    setTimeout(() => {
        // Reset marks div to display and correct/incorrect divs to show
        marksDisplay.style.display = "block";
        correctIncorrectDivs.style.display = "flex";
        resetQuiz();
    }, 10000);
}

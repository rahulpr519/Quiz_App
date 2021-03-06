const question = document.getElementById('question');
const choice = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText')
const scoreText = document.getElementById('score')
const progressBarFull = document.getElementById('progressBarFull')

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch("questions.json").then( res => {
    return res.json();
}).then( loadedQuestions => {
    questions = loadedQuestions;
    startGame()
}).catch( err => {
    console.error('Can not fetch the data from question.json file');
})

//CONSTANTS 
const CURRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

startGame = ()=>{
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    // console.log(availableQuestions);
    getNewQuestion();
};

getNewQuestion = ()=> {

    if(availableQuestions.length ===0 || questionCounter >= MAX_QUESTIONS){
        localStorage.setItem("mostRecentScore",score);
        //go to the end page
        return window.location.assign("/Quiz_App/end.html")
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    // progressText.innerText = questionCounter + "/" + MAX_QUESTIONS;

    // UPDATE THE PROGRESS BAR
    progressBarFull.style.width = `${(questionCounter/MAX_QUESTIONS)*100}%`

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choice.forEach(choice => {
        const number = choice.dataset["number"];
        choice.innerText = currentQuestion["choice" + number];
    });

    availableQuestions.splice(questionIndex,1);
    acceptingAnswers = true
};

choice.forEach(choice => {
    choice.addEventListener("click", e => {
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
        if(classToApply === 'correct'){
            incrementScore(CURRECT_BONUS)
        }
        
        // const classToApply = 'incorrect';
        // if(selectedAnswer == currentQuestion.answer) {
        //     classToApply = 'correct';
        // }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(()=>{

            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        },1000);
    })
})

incrementScore = num => {
    score+=num;
    scoreText.innerText = score;
}

// startGame()
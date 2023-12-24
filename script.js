const moves = document.getElementById("moves-count");
const timevalue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

//Items array
const items = [
    { name: "icecream", image: "icecream.png" },
    { name: "pizza", image: "pizza.png" },
    { name: "pasta", image: "pasta.png" },
    { name: "sandwich", image: "sandwich.png" },
    { name: "taco", image: "taco.png" },
    { name: "wrap", image: "wrap.png" },
    { name: "fries", image: "fries.png" },
    { name: "momos", image: "momos.png" },
    { name: "burger", image: "burger.png" },
    { name: "mojito", image: "mojito.png" }
];

//Initial time, move and win
let seconds = 0;
let minutes = 0;
let moveCount = 0;
let winCount = 0;

//Timer
const timeGenerator = () => {
    seconds += 1;
    if (seconds > 60) {
        minutes += 1;
        seconds = 0;
    }

    //Formatting time before displaying
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    timevalue.innerHTML = `<span>Time: </span>${minutesValue} : ${secondsValue}`;
};

//Calculating moves
const moveCounter = () => {
    moveCount += 1;
    moves.innerHTML = `<span>Moves: </span>${moveCount}`;
};

//Pick random objects from items array
const generateRandom = (size = 4) => {
    //temporary array
    let tempArray = [...items];

    //initialize card values array
    let cardValues = [];

    //size should be double (4*4 matrix)/2 since pairs of objects would exist
    size = (size * size) / 2;

    //Random object selection
    for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValues.push(tempArray[randomIndex]);

        //once selected remove the object from temp array
        tempArray.splice(randomIndex, 1);
    }

    return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
    gameContainer.innerHTML = "";
    cardValues = [...cardValues, ...cardValues];

    //simple shuffle
    cardValues.sort(() => Math.random() - 0.5);

    for (let i = 0; i < size * size; i++) {
        /*
            Create cards
            befor => front side (contains question mark)
            after => back side (contains actual image)
            card-value is a custom attribute which stores the name of the card to match later
        */
        gameContainer.innerHTML += `
            <div class="card-container" card-value="${cardValues[i].name}">
                <div class="card-before"> ? </div>
                <div class="card-after"> 
                    <img src="${cardValues[i].image}" class="image"/>
                </div>
            </div>
       `;
    }

    //grid
    gameContainer.style.gridTemplateColumns = `repeat(${size}, auto)`;

    //cards
    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            /* If selected card is not matched then only run 
            (already matched card when clicked will be ignored) */
            if (!card.classList.contains("matched") && !card.classList.contains("flipped")) {

                //flip the clicked card
                card.classList.add("flipped");

                //if it is the first card (initially firstCard=false)
                if (!firstCard) {
                    //current card will become first card
                    firstCard = card;

                    //current card value become firstCardValue
                    firstCardValue = card.getAttribute("card-value");
                } else {
                    //increment moves since user selected second card
                    moveCounter();

                    //second card and value
                    secondCard = card;
                    let secondsValue = card.getAttribute("card-value");

                    if (firstCardValue == secondsValue) {
                        //if both cards match - both cards would be ignored next time
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");

                        //set firstCard = false since nect card would be first now
                        firstCard = false;

                        //win count increment as user found correct match
                        winCount += 1;

                        //check if wincount == half of card values
                        if (winCount == Math.floor(cardValues.length / 2)) {
                            result.innerHTML = `<h2 style="margin-bottom: 5px;">You Won</h2>
                            <h4 style="margin-bottom: 5px;">Moves: ${moveCount}</h4>`
                            stopGame();
                        }
                    } else {
                        //if card don't match flipp the cards back to normal
                        let [tempFirst, tempSecond] = [firstCard, secondCard];
                        firstCard = false;
                        secondCard = false;
                        let delay = setTimeout(() => {
                            tempFirst.classList.remove("flipped");
                            tempSecond.classList.remove("flipped");
                        }, 900);
                    }
                }
            }else if(card.classList.contains("flipped")){
                alert("Please select another card");
            }
        })
    })
};

//start game
startButton.addEventListener("click", () => {
    moveCount = 0;
    time = 0;

    //controls and buttons visibility
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");

    //start time
    interval = setInterval(timeGenerator, 1000);

    //initial moves
    moves.innerHTML = `<span>Moves: </span>${moveCount}`;
    initializer();
});

//stop game
stopButton.addEventListener("click", (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    seconds = 0;
    minutes = 0;
    timevalue.innerHTML = `<span>Time: </span>0${minutesValue} : 0${secondsValue}`;
    clearInterval(interval);
})
);

//initialize values and func calls
const initializer = () => {
    result.innerText = "";
    winCount = 0;
    let cardValues = generateRandom();
    console.log(cardValues);
    matrixGenerator(cardValues);
};



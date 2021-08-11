let deckId;
let computerScore = 0;
let myScore = 0;
const cardsContainer = document.getElementById("cards");
const newDeckBtn = document.getElementById("new-deck");
const drawCardBtn = document.getElementById("draw-cards");
const message = document.getElementById("message");
const remainingText = document.getElementById("remaining");
const computerScoreEl = document.getElementById("computer-score");
const myScoreEl = document.getElementById("my-score");

drawCardBtn.disabled = true;

async function getDeck() {
    drawCardBtn.disabled = false;
    // message.textContent = "Game of War";
    let response = await fetch(
        "https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/"
    );
    let data = await response.json();
    remainingText.textContent = `Remaining cards: ${data.remaining}`;
    deckId = data.deck_id;
}

function drawCard() {
    fetch(
        `https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`
    )
        .then((res) => res.json())
        .then((data) => {
            remainingText.textContent = `Remaining cards: ${data.remaining}`;
            cardsContainer.children[0].innerHTML = `
                <img src=${data.cards[0].image} class="card" />
            `;
            cardsContainer.children[1].innerHTML = `
                <img src=${data.cards[1].image} class="card" />
            `;
            const winnerText = determineCardWinner(
                data.cards[0],
                data.cards[1]
            );
            message.textContent = winnerText;

            if (data.remaining === 0) {
                drawCardBtn.disabled = true;
                if (computerScore > myScore) {
                    // display "The computer won the game!"
                    message.textContent = "The computer won the game!";
                } else if (myScore > computerScore) {
                    // display "You won the game!"
                    message.textContent = "You won the game!";
                } else {
                    // display "It's a tie game!"
                    message.textContent = "It's a tie game!";
                }
            }
        });
}

function determineCardWinner(card1, card2) {
    const valueOptions = [
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "JACK",
        "QUEEN",
        "KING",
        "ACE",
    ];
    const card1ValueIndex = valueOptions.indexOf(card1.value);
    const card2ValueIndex = valueOptions.indexOf(card2.value);

    let messageStr;
    if (card1ValueIndex > card2ValueIndex) {
        computerScore++;
        computerScoreEl.textContent = `Computer score: ${computerScore}`;
        messageStr = "Computer wins!";
    } else if (card1ValueIndex < card2ValueIndex) {
        myScore++;
        myScoreEl.textContent = `My score: ${myScore}`;
        messageStr = "You win!";
    } else {
        messageStr = "War!";
    }
    return messageStr;
}

newDeckBtn.addEventListener("click", getDeck);
drawCardBtn.addEventListener("click", drawCard);

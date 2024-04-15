const gameLog = document.getElementById("game-log");
const bankText = document.getElementById("bank-text");
const hit = document.getElementById("hit");
const stand = document.getElementById("stand");
const newGame = document.getElementById("game-btn");
const betInput = document.getElementById("bet-input");
const start = document.getElementById("start");
const dealerHandContainer = document.getElementById("dealer-hand");
const cardImagesContainer = document.getElementById("player-hand");

let deck = [...cardDeck];
let betAmount;
let bank = 100;
let hand = [];
let prevHand = [];
let flippedCards = [];
let dealerHand = [];

deck.forEach(card => {
  const img = new Image();
  img.src = card.src;
});

(() => {
  const back1 = new Image();
  back1.src = "https://i.imgur.com/CLvzRZN.png";

  const back2 = new Image();
  back2.src = "https://i.imgur.com/KJzUJmx.png";
})();

const shuffleDeck = () => {
  for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

const drawCard = () => {
  const card = deck.pop();
  return card;
};

const blackjackCheck = () => {
  const total = hand.reduce((acc, card) => acc + card.points, 0);
  if (total < 21) return;
  if (total === 21) {
      log("You got 21!");
  } else if (total > 21) {
      log("You busted.");
      log("Why the fuck did you hit again?");
      log("Did your mother raise a quitter?");
      cardImagesContainer.style.background = "red";
  }
  hit.disabled = true;
}

const renderPlayerCards = () => {
  hand.forEach(card => {
    if (!prevHand.includes(card)) {
      const cardContainer = document.createElement("div");
      cardContainer.classList.add("card");

      const frontContainer = document.createElement("div");
      frontContainer.classList.add("card--front");

      const backContainer = document.createElement("div");
      backContainer.classList.add("card--back");

      const front = document.createElement("img");
      front.src = card.src;

      const back = document.createElement("img");
      back.src = "https://i.imgur.com/CLvzRZN.png";

      frontContainer.appendChild(front);
      backContainer.appendChild(back);
      cardContainer.appendChild(frontContainer);
      cardContainer.appendChild(backContainer);
      cardImagesContainer.appendChild(cardContainer);

      backContainer.addEventListener("click", () => {
        flippedCards.push(card);
        cardContainer.classList.toggle("flip");
        if (flippedCards.length === hand.length) {
          hit.disabled = false;
          stand.disabled = false;
          blackjackCheck();
        }
      });

      prevHand.push(card);
    }
  });
}

const renderDealerCards = () => {
  dealerHand.forEach(card => {
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card");

    const frontContainer = document.createElement("div");
    frontContainer.classList.add("card--front");

    const backContainer = document.createElement("div");
    backContainer.classList.add("card--back");

    const front = document.createElement("img");
    front.src = card.src;

    const back = document.createElement("img");
    back.src = "https://i.imgur.com/KJzUJmx.png";

    frontContainer.appendChild(front);
    backContainer.appendChild(back);
    cardContainer.appendChild(frontContainer);
    cardContainer.appendChild(backContainer);
    dealerHandContainer.appendChild(cardContainer);
  });
}

const log = (info) => {
  const container = document.createElement("div");
  container.innerHTML = info
  gameLog.appendChild(container);
  gameLog.scrollTo(0, gameLog.scrollHeight);
}

log("Welcome to gambling!");
log("I am your trustworthy emotional support bot.")
log("99% of gamblers quit before they win just so you know.");
log("Press new game and have fun!")

newGame.addEventListener("click", () => {
  hand = [];
  prevHand = [];
  flippedCards = [];
  dealerHand = [];
  cardImagesContainer.innerHTML = "";
  cardImagesContainer.style.background = "darkslategray";
  dealerHandContainer.innerHTML = "";
  dealerHandContainer.style.background = "darkslategray";
  log("You created a new game.");
  deck = [...cardDeck];
  log("Deck was created.");
  shuffleDeck();
  log("Deck was shuffled.");

  log("Please input a bet amount ($).");

  newGame.disabled = true;
  start.disabled = false;
});

start.addEventListener("click", () => {
  betAmount = parseInt(betInput.value);
  if (!betAmount) {
    log("You have autism?")
    log("Please key in a valid amount.");
    return;
  } else if (betAmount * 2 > bank) {
    log("You can't afford to bet that amount. You can only bet half your bank.");
    return;
  }

  log("You started the game.")
  log(`You placed a bet of $${betAmount}.`);
  
  hand.push(drawCard());
  hand.push(drawCard());
  log("Dealer dealt you 2 cards.");

  dealerHand.push(drawCard());
  dealerHand.push(drawCard());

  renderPlayerCards();
  renderDealerCards();

  start.disabled = true;
  hit.disabled = true;
  stand.disabled = true;
})

hit.addEventListener("click", () => {
  hit.disabled = true;
  stand.disabled = true;
  
  hand.push(drawCard());
  log("You hit, dealer dealt you a card.");

  renderPlayerCards();
});

stand.addEventListener("click", () => {
  log("You stand.");
  hit.disabled = true;
  stand.disabled = true;

  dealerHandContainer.childNodes.forEach(child => {
      if (child.nodeType === 1) {
          child.classList.toggle('flip');
      }
  });

  const dealerHandTotal = dealerHand.reduce((acc, card) => acc + card.points, 0);
  const total = hand.reduce((acc, card) => acc + card.points, 0)
  log(`Dealer has ${dealerHandTotal} points.`);
  log(`You have ${total} points.`);

  if (dealerHandTotal > 21) {
    dealerHandContainer.style.background = "red";
    log("Dealer busted.");
  }

  if (total > 21 && dealerHandTotal > 21) {
    log("Both you and dealer busted.");
    log("Both also missing a chromosome.")
  } else if (total === dealerHandTotal) {
    log("You tied with dealer, nigger.");
  } else if (total === 21 && dealerHandTotal !== total) {
    log(`You won $${betAmount * 2}(2x)!`);
    bank += betAmount * 2;
    bankText.innerHTML = `Bank: $${bank}`;
  } else if (dealerHandTotal === 21 && total !== dealerHandTotal) {
    log(`You lost $${betAmount * 2}(2x).`);
    log("LOL.");
    bank -= betAmount * 2;
    bankText.innerHTML = `Bank: $${bank}`;
  } else if (total > dealerHandTotal && total < 21) {
    log(`You won $${betAmount}!`);
    bank += betAmount;
    bankText.innerHTML = `Bank: $${bank}`;
  } else if (dealerHandTotal > total && dealerHandTotal < 21) {
    log(`You lost $${betAmount}.`);
    log("Kill yourself.");
    bank -= betAmount;
    bankText.innerHTML = `Bank: $${bank}`;
  } else if (total > 21 && dealerHandTotal < 21) {
    log(`You lost $${betAmount}.`);
    log("You fucking retarded.")
    bank -= betAmount;
    bankText.innerHTML = `Bank: $${bank}`;
  } else if (dealerHandTotal > 21 && total < 21) {
    log(`You won $${betAmount}!`);
    bank += betAmount;
    bankText.innerHTML = `Bank: $${bank}`;
  } else {
    log("Unidentified winning condition, report to dev.");
  }

  if (bank <= 1 ) {
    log("You are now bankrupt and homeless. You should go and borrow some money.");
    return;
  }

  newGame.disabled = false;
});
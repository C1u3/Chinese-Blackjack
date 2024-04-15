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
let dealerPrevHand = [];

(() => {
  deck.forEach(card => {
    const img = new Image();
    img.src = card.src;
  });
  
  const back1 = new Image();
  back1.src = "https://i.imgur.com/CLvzRZN.png";
})();

// Remember to add async and await
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
  if (total === 21) {
    log("You got 21!");
    hit.disabled = true;
  } else if (total > 21) {
    log("You busted.");
    log("Why the fuck did you hit again?");
    hit.disabled = true;
    cardImagesContainer.style.background = "darkred";
  } else {
    log("You can choose to hit (draw a card) or stand (end turn).");
  }
}

const renderPlayerCards = () => {
  hand.forEach(async card => {
    if (prevHand.includes(card)) return;

    prevHand.push(card);
    
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
    
    const clickHandler = () => {
      backContainer.removeEventListener("click", clickHandler);
      flippedCards.push(card);
      cardContainer.classList.toggle("flip");
      if (flippedCards.length === hand.length) {
        hit.disabled = false;
        stand.disabled = false;
        blackjackCheck();
      }
    };

    await wait(1000);
    
    backContainer.addEventListener("click", clickHandler);
  });
}

const renderDealerCards = () => {
  dealerHand.forEach(card => {
    if (dealerPrevHand.includes(card)) return;
    
    dealerPrevHand.push(card);
    
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

newGame.addEventListener("click", async () => {
  newGame.disabled = true;
  
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
  shuffleDeck();

  await wait(1000);
  log("The dealer shuffled the deck.");

  await wait(1000);
  betInput.disabled = false;
  log("Please input a bet amount ($).");

  start.disabled = false;
});

start.addEventListener("click", async () => {
  hit.disabled = true;
  stand.disabled = true;
  
  betAmount = parseInt(betInput.value);
  if (!betAmount) {
    log("You have autism?")
    log("Please key in a valid amount.");
    return;
  } else if (betAmount * 2 > bank) {
    log("You can't afford to bet that amount. You can only bet half your bank.");
    return;
  }

  start.disabled = true;
  betInput.disabled = true;
  
  log(`You placed a bet of $${betAmount}.`);

  await wait(1000);
  dealerHand.push(drawCard());
  renderDealerCards();

  await wait(1000);
  dealerHand.push(drawCard());
  renderDealerCards();

  await wait(1000);
  hand.push(drawCard());
  renderPlayerCards();

  await wait(1000);
  hand.push(drawCard());
  renderPlayerCards();

  log("Click on your cards to reveal them.");
})

hit.addEventListener("click", () => {
  hit.disabled = true;
  stand.disabled = true;
  
  hand.push(drawCard());
  log("You hit, dealer dealt you a card.");

  renderPlayerCards();
});

stand.addEventListener("click", async () => {
  hit.disabled = true;
  stand.disabled = true;
  log("You stand.");

  const total = hand.reduce((acc, card) => acc + card.points, 0);
  
  await wait(1000);
  log(`You have ${total} points.`);

  let dealerHandTotal = dealerHand.reduce((acc, card) => acc + card.points, 0);
  
  while (dealerHandTotal <= 16) {
    dealerHand.push(drawCard());
    dealerHandTotal = dealerHand.reduce((acc, card) => acc + card.points, 0);
    await wait(1000);
    renderDealerCards();
    log("The dealer decided to hit.");
  }

  await wait(2000);
  dealerHandContainer.childNodes.forEach(child => {
      if (child.nodeType === 1) {
          child.classList.toggle('flip');
      }
  });
  log(`Dealer has ${dealerHandTotal} points.`);

  if (dealerHandTotal > 21) {
    dealerHandContainer.style.background = "darkred";
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
const gameLog = document.getElementById("game-log");
const bankText = document.getElementById("bank-text");
const hit = document.getElementById("hit");
const stand = document.getElementById("stand");
const newGame = document.getElementById("game-btn");
const betInput = document.getElementById("bet-input");
const start = document.getElementById("start");
const reshuffle = document.getElementById("reshuffle");
const borrow = document.getElementById("borrow");
const dealerHandContainer = document.getElementById("dealer-hand");
const cardImagesContainer = document.getElementById("player-hand");

borrow.style.display = "none";

let deck = [...cardDeck];
let betAmount;
let bank = 100;
let hand = [];
let prevHand = [];
let flippedCards = [];
let dragon = false;
let dealerHand = [];
let dealerPrevHand = [];
let dealerDragon = false;

(() => {
  deck.forEach(card => {
    const img = new Image();
    img.src = card.src;
  });
  
  const back1 = new Image();
  back1.src = "https://i.imgur.com/CLvzRZN.png";
})();

// Remember to add async and await
const wait = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const disableElements = (elements) => {
  for (let i = 0; i < elements.length; i++) {
    elements[i].disabled = true;
  }
}

const enableElements = (elements) => {
  for (let i = 0; i < elements.length; i++) {
    elements[i].disabled = false;
  }
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

const calculateTotal = (arr) => {
  let total = 0;
  let numberOfAces = 0;

  for (const card of arr) {
    total += card.points;
    if (card.rank === "Ace") {
      numberOfAces++;
    }
  }

  while (total > 21 && numberOfAces > 0) {
    total -= 10;
    numberOfAces--;
  }
  
  return total;
}

const blackjackCheck = () => {
  const total = calculateTotal(hand);
  if (hand.length === 5 && total === 21) {
    hit.disabled = true;
    dragon = true;
    log("YOU GOT A DRAGON BLACKJACK!");
  } else if (total === 21) {
    hit.disabled = true;
    log("You got blackjack!");
  } else if (total > 21) {
    hit.disabled = true;
    log("You busted, your hand is higher than 21.");
    cardImagesContainer.style.background = "darkred";
  } else if (hand.length === 4) {
    log("You are 1 card away from a dragon.");
  } else if (hand.length === 5) {
    hit.disabled = true;
    dragon = true;
    log("DRAGON!");
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
        enableElements([hit, stand]);
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
  const logEntries = gameLog.querySelectorAll('.log-entry');
  logEntries.forEach(entry => entry.classList.remove('new-entry'));
  
  const container = document.createElement("div");
  container.innerHTML = info
  container.classList.add("log-entry", "new-entry");
  gameLog.appendChild(container);
  
  gameLog.scrollTo(0, gameLog.scrollHeight);
}

log("Instructions: Your bank total is at the top of this text. To start playing, press new game. To draw a card, press hit. To end your turn, press stand. The objective of this game is to get 21 points or below, while having more points than the dealer's hand.");

newGame.addEventListener("click", async () => {
  disableElements([newGame]);
  
  hand = [];
  prevHand = [];
  flippedCards = [];
  dragon = false;
  dealerHand = [];
  dealerPrevHand = [];
  dealerDragon = false;
  cardImagesContainer.innerHTML = "";
  cardImagesContainer.style.background = "darkslategray";
  dealerHandContainer.innerHTML = "";
  dealerHandContainer.style.background = "darkslategray";
  
  deck = [...cardDeck];
  shuffleDeck();
  log("The dealer is shuffling the deck.");
  
  await wait(1000);
  log("Deck shuffled.");

  await wait(1000);
  enableElements([betInput, start, reshuffle]);
  log("Please input a bet amount ($).");
});

start.addEventListener("click", async () => {
  disableElements([hit, stand, reshuffle]);
  
  betAmount = parseInt(betInput.value);
  if (!betAmount) {
    log("Please key in a valid amount.");
    return;
  } else if (betAmount > bank) {
    log("You can't afford to bet that amount.");
    return;
  }
  
  disableElements([start, betInput]);

  if (betAmount === bank) {
    log(`You went all in at a bet of $${betAmount}`);
  } else {
    log(`You placed a bet of $${betAmount}.`);
  }

  await wait(500);
  dealerHand.push(drawCard());
  renderDealerCards();

  await wait(500);
  hand.push(drawCard());
  renderPlayerCards();

  await wait(500);
  dealerHand.push(drawCard());
  renderDealerCards();

  await wait(500);
  hand.push(drawCard());
  renderPlayerCards();

  log("Click on your cards to reveal them.");
});

reshuffle.addEventListener("click", async () => {
  disableElements([reshuffle, betInput, start]);
  
  shuffleDeck();
  log("The dealer is reshuffling the deck.");

  await wait(2000);
  enableElements([betInput, start]);
  log("Deck reshuffled.");
})

hit.addEventListener("click", () => {
  disableElements([hit, stand]);
  
  hand.push(drawCard());
  renderPlayerCards();
  log("You hit, dealer dealt you a card.");
});

stand.addEventListener("click", async () => {
  disableElements([hit, stand]);

  const total = calculateTotal(hand);
  log(`You have ${total} points.`);

  let dealerHandTotal = calculateTotal(dealerHand);

  await wait(1000);
  log("It is the dealer's turn.");
  
  while (dealerHandTotal <= 16 && dealerHand.length <= 4) {
    dealerHand.push(drawCard());
    dealerHandTotal = calculateTotal(dealerHand);
    await wait(2000);
    renderDealerCards();
    log("The dealer decided to hit.");
  }

  await wait(2000);
  
  dealerHandContainer.childNodes.forEach(child => {
      if (child.nodeType === 1) {
          child.classList.toggle('flip');
      }
  });
  await wait(500);

  if (dealerHand.length === 5 && dealerHandTotal <= 21) {
    dealerDragon = true;
    log("Dealer got a dragon! (Dev note: I have yet to complete the winning condition for this yet, report to me and refresh if you see this pls.");
  } else {
    log(`Dealer has ${dealerHandTotal} points.`);
  }

  if (dealerHandTotal > 21) {
    dealerHandContainer.style.background = "darkred";
    log("Dealer busted.");
  }

  await wait(2000);
  
  if (dragon) {
    log(`You got a dragon! You won $${betAmount * 2}(2x)!`);
    bank += betAmount * 2;
  } else if (dragon && total === 21) {
    log(`You got a blackjack dragon! You won $${betAmount * 3}(3x)!`);
    bank += betAmount * 3;
  } else if (total > 21 && dealerHandTotal > 21) {
    log("Both you and the dealer busted.");
  } else if (total === dealerHandTotal) {
    log("You tied with the dealer.");
  } else if (total === 21 && dealerHandTotal !== total) {
    log(`You won $${betAmount * 2}(2x)!`);
    bank += betAmount * 2;
  } else if (dealerHandTotal === 21 && total !== dealerHandTotal) {
    log(`You lost $${betAmount * 2}(2x).`);
    bank -= betAmount * 2;
  } else if (total > dealerHandTotal && total < 21) {
    log(`You won $${betAmount}!`);
    bank += betAmount;
  } else if (dealerHandTotal > total && dealerHandTotal < 21) {
    log(`You lost $${betAmount}.`);
    bank -= betAmount;
  } else if (total > 21 && dealerHandTotal < 21) {
    log(`You lost $${betAmount}.`);
    bank -= betAmount;
  } else if (dealerHandTotal > 21 && total < 21) {
    log(`You won $${betAmount}!`);
    bank += betAmount;
  } else {
    log("Unidentified winning condition, report to dev.");
  }

  bankText.innerHTML = `Bank: $${bank}`;

  if (bank <= 0 ) {
    await wait(3000);
    log("You are now bankrupt and homeless. You should go and borrow some money.");
    borrow.style.display = "block";
    return;
  }

  enableElements([newGame]);
});

borrow.addEventListener("click", async () => {
  borrow.style.display = "none";
  log("You decided it was a good idea to borrow some money from a loan shark.");

  const borrowAmount = betAmount * 2;
  bank += borrowAmount;
  await wait(4000);
  bankText.innerHTML = `Bank: $${bank}`;
  log(`You borrowed $${borrowAmount}.`);

  enableElements([newGame]);
})
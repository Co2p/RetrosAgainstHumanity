import '../style/color.scss';
import '../style/layout.scss';
import '../style/retrocard.scss';
import { words } from "../data/words.json";
import { decks } from "../data/card.json";
import { getRandomInt, setRandomSeed } from "./util";
import { Deck } from "./deck";
import { UrlParamsHandler } from "./ParamsHandler";
import { Modal } from "./Modal";
import { P2PManager } from "./peer";

const urlParamsHandler = new UrlParamsHandler();
const modal = new Modal();
let deck = new Deck(decks[urlParamsHandler.getDeckId()], true, true);
const resetButton = document.getElementById("reset");
const aboutButton = document.getElementById("about");
let p2pManager = null;
let p2pEnabled = false;

function drawCardsBasedOnParams(deck) {
    const drawNumber = urlParamsHandler.getDraw();
    for (let index = 0; index < drawNumber; index++) {
        deck.getCardWithoutDrawEvent();
    }
}

function Reset() {
    document.getElementById("cardContainer").innerHTML = "";
    urlParamsHandler.setDraw(0);
    location.reload();
}

function newCardDeck() {
    console.log(this);
    const word = `${words[getRandomInt(words.length)]}${words[getRandomInt(words.length)]}`;
    urlParamsHandler.setCardStack(word);
    updateModal();
    deck = new Deck(decks[urlParamsHandler.getDeckId()], true, true);
    setRandomSeed();
}

function updateModal() {
    const d = decks[urlParamsHandler.getDeckId()];
    modal.setTitle(d.meta.name);
    modal.setText(d.meta.about);
}

function createDropdown() {
    let dropdown = document.createElement("select");
    dropdown.setAttribute("id", "idCardDecks");
    decks.forEach((deck, index) => {
        dropdown.appendChild(createOptionElement(deck, index))
    })
    dropdown.addEventListener("change", (e) => {
        urlParamsHandler.setDeckId(e.target.selectedOptions[0].getAttribute("id"));
        Reset();
    })
    document.getElementById("actionsContainer").append(dropdown)
}

function createOptionElement(deck, index) {
    const option = document.createElement("option");
    if (index == urlParamsHandler.getDeckId()) {
        option.setAttribute("selected", "selected");
    }
    option.setAttribute("id", index);
    option.innerText = deck.meta.name;
    return option;
}

function initializeP2P() {
    p2pManager = new P2PManager();
    
    // Update UI with user info
    p2pManager.on('peerReady', (data) => {
        document.getElementById('currentUser').textContent = data.username;
        document.getElementById('peerId').textContent = `ID: ${data.id}`;
        console.log('P2P ready:', data);
    });
    
    // Handle peer connections
    p2pManager.on('peerConnected', (data) => {
        console.log('Peer connected:', data.peerId);
        updateConnectedUsers();
    });
    
    p2pManager.on('peerDisconnected', (data) => {
        console.log('Peer disconnected:', data.peerId);
        updateConnectedUsers();
    });
    
    p2pManager.on('userInfoReceived', (data) => {
        console.log('User info received:', data);
        updateConnectedUsers();
    });
    
    // Handle incoming card flips
    p2pManager.on('cardFlip', (data) => {
        console.log('Received card flip from', data.fromUsername, ':', data.cardData);
        // Find the card and sync its flip state
        const cardElement = document.getElementById(data.cardData.cardId);
        if (cardElement && cardElement.classList.contains('flipped') !== data.cardData.flipped) {
            cardElement.classList.toggle('flipped');
            showSyncNotification(`${data.fromUsername} flipped a card`);
        }
    });
    
    // Handle incoming card draws
    p2pManager.on('cardDraw', (data) => {
        console.log('Received card draw from', data.fromUsername, ':', data.cardData);
        showSyncNotification(`${data.fromUsername} drew a card`);
    });
}

function updateConnectedUsers() {
    const usersList = document.getElementById('usersList');
    const connectedUsers = p2pManager.getConnectedUsers();
    
    usersList.innerHTML = '';
    connectedUsers.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user.username;
        li.title = `Peer ID: ${user.peerId}`;
        usersList.appendChild(li);
    });
    
    // Update connection status
    const statusDiv = document.getElementById('p2pStatus');
    if (connectedUsers.length > 0) {
        statusDiv.style.backgroundColor = '#e8f5e8';
    } else {
        statusDiv.style.backgroundColor = '#fff5e8';
    }
}

function showSyncNotification(message) {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        z-index: 1000;
        font-size: 14px;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

function enableP2P() {
    p2pEnabled = true;
    document.getElementById('p2pStatus').style.display = 'block';
    initializeP2P();
}

function disableP2P() {
    p2pEnabled = false;
    document.getElementById('p2pStatus').style.display = 'none';
    if (p2pManager) {
        p2pManager.disconnect();
        p2pManager = null;
    }
}


function init() {
    updateModal();
    if (urlParamsHandler.getCardStack() !== null) {
        newCardDeck();
    }

    document.addEventListener("drawCard", (drawPile) => {
        const newDraw = parseInt(urlParamsHandler.getDraw()) + 1;
        console.log(drawPile);
        urlParamsHandler.setDraw(newDraw);
        
        // Broadcast card draw to peers if P2P is enabled
        if (p2pEnabled && p2pManager) {
            p2pManager.broadcastCardDraw({
                timestamp: Date.now(),
                drawCount: newDraw
            });
        }
    }, false);

    // Listen for card flip events
    document.addEventListener("cardFlipped", (event) => {
        if (p2pEnabled && p2pManager) {
            p2pManager.broadcastCardFlip(event.detail);
        }
    }, false);

    drawCardsBasedOnParams(deck);

    resetButton.addEventListener("click", () => {
        Reset();
    });
    
    aboutButton.addEventListener("click", () => {
        modal.show();
    });
    
    // P2P controls
    const p2pCheckbox = document.getElementById("enable_p2p");
    const connectBtn = document.getElementById("connectBtn");
    const peerIdInput = document.getElementById("peerIdInput");
    
    p2pCheckbox.addEventListener("change", (e) => {
        if (e.target.checked) {
            enableP2P();
        } else {
            disableP2P();
        }
    });
    
    connectBtn.addEventListener("click", () => {
        const peerId = peerIdInput.value.trim();
        if (peerId && p2pManager) {
            p2pManager.connectToPeer(peerId);
            peerIdInput.value = '';
        }
    });
    
    peerIdInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            connectBtn.click();
        }
    });
    
    createDropdown();
}


init();
import '../style/card.scss';

export class Card {

    constructor(card, back, flipped) {
        this.text = card.text;
        this.frontClass = card.type;
        this.flipped = flipped ?? false;
        this.back = back;
        let cardDiv = document.createElement("div");
        let frontDiv = document.createElement("div");
        let backDiv = document.createElement("div");
        cardDiv.classList = "card";
        frontDiv.classList = `side front ${this.frontClass}`;
        backDiv.classList = `side back ${this.back.class}`;
        frontDiv.innerHTML = this.text;
        backDiv.innerHTML = this.back.text;
        cardDiv.appendChild(frontDiv);
        cardDiv.appendChild(backDiv);
        this.card = cardDiv;
    }
    
    setBack(back) {
        this.back = back;
    }
    
    addToPage() {
        const container = document.getElementById("cardContainer");
        container.appendChild(this.card);
    }

    hide () {
        this.card.style = "display: none;";
    }

    show () {
        this.card.style = "display: inherit"
    }
}

export class StartCard extends Card {
    constructor(back) {
        super({type: "drawPile", text: ""}, back)
    }
}

class FlippableCard extends Card {
    constructor(card, back) {
        super(card, back);

        this.addRemoveButton();

        this.flipped = false
        this.card.addEventListener("click", () => {
            this.flipCard();
        });
    }

    addRemoveButton() {
        Array.from(this.card.getElementsByClassName("side")).forEach((side) => {
            let removeButton = document.createElement("div");
            removeButton.classList = "remove";
            side.appendChild(removeButton)
            removeButton.addEventListener("click", () => this.hide());
        });
    }

    flipCard() {
        this.card.classList.toggle("flipped");
        this.flipped = !this.flipped;
    }
}

export class FaceDownCard extends FlippableCard {
    constructor(card, back) {
        super(card,back);
        this.flipped = false;
    }

}

export class FaceUpCard extends FlippableCard {
    constructor(card, back) {
        super(card,back);
        this.flipped = true;
    }

    addToPage() {
        const container = document.getElementById("cardContainer");
        container.appendChild(this.card);
        setTimeout(() => this.flipCard(), 100);
    }
}


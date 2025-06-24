import seedrandom from "seedrandom";

export function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

export function getSeededRandomInt(max, seeded) {
    return Math.floor(seeded() * Math.floor(max));
}

export function setRandomSeed(seed) {
    if (!seed) {
        const params = new URLSearchParams(location.search);
        seed = params.get("cardStack");
    }
    if (seed) {
        seedrandom(seed);
    } else {
        throw "noooo"
    }
}

const animalNames = [
    "Cat", "Dog", "Unicorn", "Dragon", "Phoenix", "Tiger", "Lion", "Bear", 
    "Wolf", "Fox", "Rabbit", "Elephant", "Giraffe", "Zebra", "Panda", 
    "Koala", "Kangaroo", "Dolphin", "Whale", "Shark", "Eagle", "Hawk", 
    "Owl", "Parrot", "Penguin", "Flamingo", "Butterfly", "Bee", "Turtle", 
    "Octopus", "Horse", "Deer", "Moose", "Hippo", "Rhino", "Cheetah", 
    "Leopard", "Jaguar", "Lynx", "Raccoon", "Squirrel", "Chipmunk", 
    "Hedgehog", "Otter", "Seal", "Peacock", "Swan", "Duck", "Goose"
];

export function getRandomAnimalName() {
    return animalNames[getRandomInt(animalNames.length)];
}

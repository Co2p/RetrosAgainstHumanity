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
        Math.seedrandom(seed);
    } else {
        throw "noooo"
    }
}

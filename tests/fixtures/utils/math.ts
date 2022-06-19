/**
 * Returns a random integer between min and max-1.
 * @param max Upper limit (excluded) of the random interval
 * @param min Lower limit (included) of the random interval
 */
export const getRandomInt = (min: number = 0, max: number = 1) => {
    return Math.floor(Math.random() * max) + min;
};

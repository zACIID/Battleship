/**
 * Converts the provided date in unix seconds
 * @param d date to convert
 */
export const toUnixSeconds = (d: Date): number => {
    return Math.floor(d.getTime() / 1000);
};

export const fromUnixSeconds = (unixSeconds: number): Date => {
    return new Date(unixSeconds * 1000);
};

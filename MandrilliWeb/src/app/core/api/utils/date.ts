/**
 * Converts the provided date in unix seconds
 * @param d date to convert
 */
export const toUnixSeconds = (d: Date) : number => {
    return d.getTime() / 1000;
}

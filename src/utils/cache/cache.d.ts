declare class Cache {
    private readonly memoized;
    /**
     * Memoize a value so that it can be used again
     * @param {T} val The value to memoize
     * @returns Returns the value
     */
    memo<T>(val: () => T): T;
    isMemo(key: string): boolean;
}
declare const _default: Cache;
export default _default;

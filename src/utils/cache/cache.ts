class Cache {
  private readonly memoized: Map<string, unknown> = new Map();

  /**
   * Memoize a value so that it can be used again
   * @param {T} val The value to memoize
   * @returns Returns the value
   */
  public memo<T>(val: () => T): T {
    const fn = val.toString();
    const memoizedVal = this.memoized.get(fn) as T;
    if (memoizedVal == null) {
      const result = val();
      this.memoized.set(fn, result);
      return result;
    }
    return memoizedVal;
  }

  public isMemo(key: string): boolean {
    return !!this.memoized.get(key);
  }
}

export default new Cache();

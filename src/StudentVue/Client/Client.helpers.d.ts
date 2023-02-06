/**
 * Use concurrency limits to fulfill promises
 * @param poolLimit The concurrency limit
 * @param array An array of Promises
 * @param iteratorFn A map function
 * @returns Returns the results of each promise.
 */
export declare function asyncPoolAll<IN, OUT>(poolLimit: number, array: readonly IN[], iteratorFn: (generator: IN) => Promise<OUT>): Promise<Awaited<OUT>[]>;
/**
 * A short and simplified version of the single-line if-else statement.
 * @param xmlArr The input is a value parsed from the XML parser library. It will be an array
 * @returns Returns undefined or the value of the XML
 */
export declare function optional<T>(xmlArr?: T[]): T | undefined;

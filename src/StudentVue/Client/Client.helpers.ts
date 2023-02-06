import asyncPool from 'tiny-async-pool';

export async function asyncPoolAll<IN, OUT>(
  poolLimit: number,
  array: readonly IN[],
  iteratorFn: (generator: IN) => Promise<OUT>
) {
  const results: Awaited<OUT>[] = [];
  for await (const result of asyncPool(poolLimit, array, iteratorFn)) {
    results.push(result);
  }
  return results;
}

export function optional<T>(xmlArr?: T[]): T | undefined {
  return xmlArr ? xmlArr[0] : undefined;
}

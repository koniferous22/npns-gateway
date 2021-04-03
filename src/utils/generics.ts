export type ArrayElement<T> = T extends Array<infer TT> ? TT : never;

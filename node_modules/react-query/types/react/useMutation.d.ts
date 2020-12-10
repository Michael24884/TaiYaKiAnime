import { MutationResultPair, MutationFunction, MutationConfig } from '../core/types';
export declare function useMutation<TResult, TError = unknown, TVariables = undefined, TSnapshot = unknown>(mutationFn: MutationFunction<TResult, TVariables>, config?: MutationConfig<TResult, TError, TVariables, TSnapshot>): MutationResultPair<TResult, TError, TVariables, TSnapshot>;

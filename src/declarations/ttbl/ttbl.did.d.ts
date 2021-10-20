import type { Principal } from '@dfinity/principal';
export type ChallengeId = bigint;
export interface _SERVICE {
  'acceptChallenge' : (arg_0: ChallengeId) => Promise<string>,
  'completeChallenge' : (arg_0: ChallengeId) => Promise<string>,
  'createChallenge' : (
      arg_0: string,
      arg_1: string,
      arg_2: string,
      arg_3: string,
    ) => Promise<string>,
  'createUser' : (arg_0: string) => Promise<string>,
  'displayChallenge' : (arg_0: ChallengeId) => Promise<string>,
  'exploreLanguage' : (arg_0: string) => Promise<string>,
  'getUser' : (arg_0: string) => Promise<string>,
  'greet' : (arg_0: string, arg_1: bigint, arg_2: bigint) => Promise<string>,
  'learnLanguage' : (arg_0: string) => Promise<string>,
  'pickMeAChallenge' : (arg_0: string) => Promise<string>,
  'setProgress' : (arg_0: ChallengeId, arg_1: bigint) => Promise<string>,
  'suggestChallenge' : (arg_0: string, arg_1: ChallengeId) => Promise<string>,
}

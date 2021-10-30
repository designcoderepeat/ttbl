import type { Principal } from '@dfinity/principal';
export type ChallengeId = bigint;
export type UserId = Principal;
export interface _SERVICE {
  'acceptChallenge' : (arg_0: ChallengeId) => Promise<string>,
  'completeChallenge' : (arg_0: ChallengeId) => Promise<string>,
  'createChallenge' : (
      arg_0: string,
      arg_1: string,
      arg_2: string,
      arg_3: string,
      arg_4: [] | [Array<string>],
      arg_5: string,
    ) => Promise<string>,
  'createEpic' : (
      arg_0: string,
      arg_1: string,
      arg_2: string,
      arg_3: string,
    ) => Promise<string>,
  'createQuest' : (
      arg_0: string,
      arg_1: string,
      arg_2: string,
      arg_3: string,
      arg_4: string,
      arg_5: ChallengeId,
      arg_6: Array<ChallengeId>,
      arg_7: Array<Array<ChallengeId>>,
      arg_8: [] | [UserId],
    ) => Promise<string>,
  'createUser' : (arg_0: string) => Promise<string>,
  'displayChallenge' : (arg_0: ChallengeId) => Promise<string>,
  'enterBabel' : (arg_0: string) => Promise<string>,
  'exploreLanguage' : (arg_0: string) => Promise<string>,
  'finish_campaign' : () => Promise<string>,
  'getUser' : (arg_0: string) => Promise<string>,
  'greet' : (arg_0: string) => Promise<string>,
  'learnLanguage' : (arg_0: string) => Promise<string>,
  'pickMeAChallenge' : (arg_0: string) => Promise<string>,
  'setProgress' : (arg_0: ChallengeId, arg_1: bigint) => Promise<string>,
  'start_campaign' : () => Promise<string>,
  'suggestChallenge' : (arg_0: string, arg_1: ChallengeId) => Promise<string>,
}

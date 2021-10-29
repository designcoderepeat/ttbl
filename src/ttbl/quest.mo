import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Types "./types";
import Time "mo:base/Time";


module {
  public type ChallengeId = Nat;
  type UserId = Types.UserId;

  public class Quest (
    id: ChallengeId,
    questTitle: Text,
    questSubtitle: Text,
    questTrigger: Text,
    beforeQuest: Text, 
    afterQuest: Text,
    rootChallenge: ChallengeId,
    challenges: [ChallengeId],
    challengeGraph: [[ChallengeId]],
    creator: ?UserId) {

    var acception_count: Nat = 0;
    var completion_count: Nat = 0;

    public func getRootChallenge(): ChallengeId {
      rootChallenge
    };

    public func getChallenges(): [ChallengeId] {
      challenges
    };

    public func getChallengeGraph() : [[ChallengeId]] {
      challengeGraph
    };

    public func getTitle() : Text {
      questTitle
    };

    public func getSubtitle() : Text {
      questSubtitle
    };

    public func get_creator() : ?UserId {
      creator
    };

    public func get_acception_count() : Nat {
      acception_count
    };

    public func incr_acception_count() {
      acception_count += 1;
    };

    public func get_completion_count() : Nat {
      completion_count
    };

    public func incr_completion_count() {
      completion_count += 1;
    };
  };

  public func isEq(x: ChallengeId, y: ChallengeId): Bool { x == y };
};

// quest

// Quest is a subtype of Challenge // so that quests can add to challengeDB and get a uniqId
// public class Quest:  { // class DemoQuest = newQuest(?User)                                                                               making it quest for the user makes the game completely personalized
// QuestName: Text,
// QuestId: ChallengeId,
// QuestTrigger: Text, // ex: OnClick("Guru"), OnPlayerAt(pos), on
// RootChallenge: ChallengeId // this is the first quest in the challenge, ex: DemoQuest_Preview
// Challenges: [ChallengeId] // list of list of challenges, the UI wil
// ChallengeGraph: [[ChallengeId]]
// }

import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Types "./types";
import Int "mo:base/Int";
import Nat32 "mo:base/Nat32";
import Challenge "./challenge";
import Quest "./quest";
import Campaign "./campaign";
import Epic "./epic";


module {
  type UserId = Types.UserId;
  type Challenge = Challenge.Challenge;
  type Quest = Quest.Quest;
  type Campaign = Campaign.Campaign;
  type Epic = Epic.Epic;

  type ChallengeId = Challenge.ChallengeId;

  public class ChallengeDB() {
    // The "database" is just a local hash map
    let hashMap = HashMap.HashMap<ChallengeId, Challenge>(1, Challenge.isEq, Int.hash);

    // Motoko does not have random, so get creative!
    var iter = hashMap.entries();

    public func add(challenge: Challenge) {
      hashMap.put(challenge.get_id(), challenge);
    };

    public func get(challenge_id: ChallengeId): ?Challenge {
      hashMap.get(challenge_id)
    };

    public func get_any(): ?Challenge {
      if (hashMap.size() == 0) {
	return null;
      };

      var option : ?(ChallengeId, Challenge) = null;

      // Ege has faith in psuedo randomness provided by 7 iterations.
      for (j in Iter.range(0, 6)) {

        option := iter.next();

        if (Option.isNull(option)) {
          iter := hashMap.entries();
          option := iter.next();
        };
      };

      ?(Option.unwrap(option).1)
    };

    public func accepted(challenge_id: ChallengeId) {
      let challenge = Option.unwrap(hashMap.get(challenge_id));
      challenge.incr_acception_count();
      hashMap.put(challenge.get_id(), challenge);
    };

    public func completed(challenge_id: ChallengeId) {
      let challenge = Option.unwrap(hashMap.get(challenge_id));
      challenge.incr_completion_count();
      hashMap.put(challenge.get_id(), challenge);
    };
  };

  public class QuestDB() {
    // The "database" is just a local hash map
    let hashMap = HashMap.HashMap<ChallengeId, Quest>(1, Challenge.isEq, Int.hash);

    // Motoko does not have random, so get creative!
    var iter = hashMap.entries();

    public func add(quest: Quest) {
      hashMap.put(quest.get_id(), quest);
    };

    public func get(challenge_id: ChallengeId): ?Quest {
      hashMap.get(challenge_id)
    };

    public func get_any(): ?Quest {
      if (hashMap.size() == 0) {
	      return null;
      };

      var option : ?(ChallengeId, Quest) = null;

      // Ege has faith in psuedo randomness provided by 7 iterations.
      for (j in Iter.range(0, 6)) {

        option := iter.next();

        if (Option.isNull(option)) {
          iter := hashMap.entries();
          option := iter.next();
        };
      };

      ?(Option.unwrap(option).1)
    };

    public func accepted(challenge_id: ChallengeId) {
      let quest = Option.unwrap(hashMap.get(challenge_id));
      quest.incr_acception_count();
      hashMap.put(quest.get_id(), quest);
    };

    public func completed(challenge_id: ChallengeId) {
      let quest = Option.unwrap(hashMap.get(challenge_id));
      quest.incr_completion_count();
      hashMap.put(quest.get_id(), quest);
    };
  };

  public class CampaignDB() {
    // The "database" is just a local hash map
    let hashMap = HashMap.HashMap<ChallengeId, Campaign>(1, Challenge.isEq, Int.hash);

    // Motoko does not have random, so get creative!
    var iter = hashMap.entries();

    public func add(campaign: Campaign) {
      hashMap.put(campaign.get_id(), campaign);
    };

    public func get(challenge_id: ChallengeId): ?Campaign {
      hashMap.get(challenge_id)
    };

    public func get_any(): ?Campaign {
      if (hashMap.size() == 0) {
	      return null;
      };

      var option : ?(ChallengeId, Campaign) = null;

      // Ege has faith in psuedo randomness provided by 7 iterations.
      for (j in Iter.range(0, 6)) {

        option := iter.next();

        if (Option.isNull(option)) {
          iter := hashMap.entries();
          option := iter.next();
        };
      };

      ?(Option.unwrap(option).1)
    };

    public func accepted(challenge_id: ChallengeId) {
      let campaign = Option.unwrap(hashMap.get(challenge_id));
      campaign.incr_acception_count();
      hashMap.put(campaign.get_id(), campaign);
    };

    public func completed(challenge_id: ChallengeId) {
      let campaign = Option.unwrap(hashMap.get(challenge_id));
      campaign.incr_completion_count();
      hashMap.put(campaign.get_id(), campaign);
    };
  };

  public class EpicDB() {
    // The "database" is just a local hash map
    let hashMap = HashMap.HashMap<ChallengeId, Epic>(1, Challenge.isEq, Int.hash);

    // Motoko does not have random, so get creative!
    var iter = hashMap.entries();

    public func add(epic: Epic) {
      hashMap.put(epic.get_id(), epic);
    };

    public func get(challenge_id: ChallengeId): ?Epic {
      hashMap.get(challenge_id)
    };

    public func get_any(): ?Epic {
      if (hashMap.size() == 0) {
	      return null;
      };

      var option : ?(ChallengeId, Epic) = null;

      // Ege has faith in psuedo randomness provided by 7 iterations.
      for (j in Iter.range(0, 6)) {

        option := iter.next();

        if (Option.isNull(option)) {
          iter := hashMap.entries();
          option := iter.next();
        };
      };

      ?(Option.unwrap(option).1)
    };

    public func accepted(challenge_id: ChallengeId) {
      let epic = Option.unwrap(hashMap.get(challenge_id));
      epic.incr_acception_count();
      hashMap.put(epic.get_id(), epic);
    };

    public func completed(challenge_id: ChallengeId) {
      let epic = Option.unwrap(hashMap.get(challenge_id));
      epic.incr_completion_count();
      hashMap.put(epic.get_id(), epic);
    };
  };

  func isEq(x: ChallengeId, y: ChallengeId): Bool { x == y };
};

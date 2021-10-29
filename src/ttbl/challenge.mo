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
    
  // public class campaign(
  //   campaignId: ChallengeId, // clone ChallengeId
  //   difficulty: Nat,
  // ) {
  //   var acception_count: Nat = 0;
  //   var completion_count: Nat = 0;
  // };

  // easyCampaigns
  // 1. learn turkish via english - easy
  // 2. learn korean from the squid games - easy 

  // standard campaigns
  // 1. learn german via english
  // 2. learn spanish via english

  // very easy campaigns 
  // 1. learn arabic via english
  // 2. learn tamil via english
  // 3. learn hindi via english
  // 4. learn urdu via english
  // 5. learn russian via english

  // campaign 0 - About the Language
  // quest 1 - history of the Language
  // quest 2 - about the awesome people of the language 
  // quest 2 - why you should learn the Language


  // campaign 1 - alphabet:Quest([params: Text]) params = {vowels, } // keeping it loosely typed seems reasonable here 



  // quest UI will look like the Campagin UI
  // campaign_LearnTamilAlphabet_ViaEnglish_lesson_1: Quest = new Quest(
  //  
  // )
  // quest will be list of widomid/challengeid
  // public class Quest ( // quests are like tasks.. small and contain a list in order of requirements
  // questId: QuestId; // clone ChallengeId
  // []// eac

  // ) {
  //   var acception_count: Nat = 0;
  //   var completion_count: Nat = 0;

  // }

// a



  // public class Wisdom ( // also known as lesson // also decided by user choices
  //   id: WisdomId, // clone ChallengeId
  //   title: Text, 
  //   description: Text,
  //   creator: ?UserId,
  //   wisdomType: Text, // can be made a enum when UI starts to use this

  // ) {
  //   var acception_count: Nat = 0;
  //   var completion_count: Nat = 0;
  // }


  // challenges of type alphabet randomly float around... even from other languages! (turned on for very easy campaigns by default, not for other campaigns)
  //
  public class Challenge ( // also known as battle
    id: ChallengeId,
    title: Text,
    subtitle: Text,
    question: Text,
    challengeType: Text, // can be made enum
    options: ?[Text],
    answer: Text,
    beforeChallenge: Text,
    afterChallenge: Text,
    challengeTrigger: Text, // can be for example: the girl hides random challenges in parts of the map.. 
    // babelSays.. what is the faint noise you hear.. and then you notice a small mushroom somewhere in the scene and get reminded of the girl on clicking it, and the girl speaks a random language and you try to decipher it
    creator: ?UserId) {
 
    var acception_count: Nat = 0;
    var completion_count: Nat = 0;

    public func get_question(): Text {
      question
    };

    public func get_answer(): Text {
      answer
    };

    public func get_id() : Nat {
      id
    };

    public func get_title() : Text {
      title
    };

    public func get_subtitle() : Text {
      subtitle
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

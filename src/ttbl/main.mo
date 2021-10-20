import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";

// local imports
import Random = "Random";
import Challenge "./challenge";
import ChallengeDB "./challengedb";
import DefaultChallenges "./defaultchallenges";
import User "./user";
import Types "./types";

actor { // actor is babel
  type ChallengeId = Types.ChallengeId;
  type ChallengeMetadata = Types.ChallengeMetadata;
  type ChallengeStatus = Types.ChallengeStatus;
  type UserData = Types.UserData;
  type UserId = Types.UserId;
  type Book = Types.Book;
  type LanguageNames = Types.LanguageNames;
  type ThiruKural = Types.ThiruKural;

  let random = Random.new();

  flexible var userDb : User.UserDb = User.UserDb();
  flexible var onlineUserDb : User.UserDb = User.UserDb();
  flexible var challengeDB: ChallengeDB.ChallengeDB = ChallengeDB.ChallengeDB();
  flexible var challengeMetaDataDB: ChallengeDB.ChallengeDB = ChallengeDB.ChallengeDB();

  public func greet(name : Text) : async Text {
      Debug.print("Welcome " # name);
      // return "" # Nat.toText(random.next() % 100) # ", " # Nat.toText(random.next() % 100);
      return "" # Nat.toText(random.next() % 100) # ", " # Nat.toText(random.next() % 100);
  };  


  // var onlineUsers : [(Text, Nat, Nat)] = [];
  
  // public func greet(name : Text, x: Nat, z: Nat) : async Text {
  //     Debug.print("Welcome " # name);
  //     onlineUsers := Array.append<(Text, Nat, Nat)>(onlineUsers, [(name, x, z)]);

  //     for (onlineUser in onlineUsers.vals()) {
  //       Debug.print(onlineUser.0 # ", " # Nat.toText(onlineUser.1) # ", " # Nat.toText(onlineUser.2));
  //     };

  //     Debug.print("Have fun " # name);

  //     // return spawn details
  //     return "" # Nat.toText(random.next() % 100) # ", " # Nat.toText(random.next() % 100);
  // };  

  // ------------------------------- public API
  // NOTE: For rapid prototyping (via dfx or Candid UI) all the functions below return values
  // as human-readable text.  In the final application the public API should return structured
  // data to be proceesed and appropriately displayed by frontend/UI.
  
  // Registers the current IC user as a user of the app, with a system-provided id and the given `username`.
  public shared(msg) func createUser(username: Text) : async Text {
    var userData : UserData = userDb.createOrReturn(msg.caller, username);
    userDataAsText(userData);
  };

  // Accepts the given challenge for the current user (if the user has registered previously).
  public shared(msg) func acceptChallenge(challengeId : ChallengeId) : async Text {
    // Verify the user.
    var userData = switch (userDb.findById(msg.caller)) {
      case (null) { return "user not registered" };
      case (?user) user
    };

    // Verify the challenge.
    let challenge = switch (challengeDB.get(challengeId)) {
      case (null) { return "A challenge with challenge id " # Nat.toText(challengeId) # " does not exist" };
      case (?ch) ch
    };

    let newMetadata : ChallengeMetadata = {
      id = challengeId;
      status = #accepted;
      completionDeadline = 0;  // TODO
      progress = 0;
    };

    let maybestatus = getStatusIfExists(challengeId, userData.challenges);
    switch maybestatus {
      case (?#accepted or ?#inprogress) {
        return "The challenge " # Nat.toText(challengeId) # " is already accepted by user " # userData.name
      };

      case (null or ?#completed or ?#expired) {
        userData := addNewChallenge(userData, newMetadata);
      };

      case (?#suggestion) {
        userData := replaceExistingChallenge(userData, newMetadata, #suggestion);
      };
    };

    userDb.update(userData);
    challengeDB.accepted(challengeId : ChallengeId);
    Debug.print(userDataAsText(userData) # "accepted challenge " # Nat.toText(challengeId));
    "accepted challenge: " # Nat.toText(challengeId) # "\n" # userDataAsText(userData)
  };

  // Suggests on behalf of the current user (if registered) a challenge identfied by `challengeId`
  // to a user with `username` (if multiple such users exist, the first one is picked).
  public shared(msg) func suggestChallenge(username: Text, challengeId: ChallengeId) : async Text {
    // Verify the user
    switch (userDb.findById(msg.caller)) {
      case (null) { return "Please register to be able to suggest challenges to others" };
      case (?user) {}
    };

    // Verify the challenge
    let challenge = switch (challengeDB.get(challengeId)) {
      case (null) { return "A challenge with challenge id " # Nat.toText(challengeId) # " does not exist" };
      case (?ch) ch
    };

    // Verify the recipient
    let users = userDb.findByName(username);
    if (users.size() == 0) {
      return "A user with username " # username # " does not exist";
    };
    let userData = users[0];

    let newMetadata : ChallengeMetadata = {
      id = challengeId;
      status = #suggestion;
      completionDeadline = 0;  // TODO
      progress = 0;
    };

    let maybestatus = getStatusIfExists(challengeId, userData.challenges);
    switch maybestatus {
      case (?#suggestion) {
        return "The challenge " # Nat.toText(challengeId) # " is already suggested to user " # username
      };

      case (?#accepted or ?#inprogress) {
        return "The challenge " # Nat.toText(challengeId) # " is already accepted by user " # username
      };

      case (?#completed or ?#expired or null) {
        userDb.update(addNewChallenge(userData, newMetadata));
      };
    };
    "suggested challenge " # Nat.toText(challengeId) # " to user " # username
  };

  // Marks the specified challenge as completed for the current user
  // (if registered and has previously accepted the specified challenge).
  public shared(msg) func completeChallenge(challengeId : ChallengeId) : async Text {
    // Verify the user
    var userData = switch (userDb.findById(msg.caller)) {
      case (null) { return "user not registered" };
      case (?user) user
    };

    let newMetadata : ChallengeMetadata = {
      id = challengeId;
      status = #completed;
      completionDeadline = 0;  // TODO
      progress = 100;
    };

    let maybestatus = getStatusIfExists(challengeId, userData.challenges);
    switch maybestatus {
      case (null or ?#suggestion or ?#expired or ?#completed) {
        return "The challenge " # Nat.toText(challengeId) # " is not accepted, so it cannot be completed"
      };

      case (?#accepted) {
        userData := replaceExistingChallenge(userData, newMetadata, #accepted);
        userDb.update(userData);
      };

      case (?#inprogress) {
        userData := replaceExistingChallenge(userData, newMetadata, #inprogress);
        userDb.update(userData);
      };
    };

    challengeDB.completed(challengeId : ChallengeId);
    "completed challenge: " # Nat.toText(challengeId) # "\n" # userDataAsText(userData)
  };

  // Returns data of a user with the specified username, if such a user exists.
  // If multiple such users exist, the first found is returned.
  public query func getUser(username : Text) : async Text {
    let users = userDb.findByName(username);
    if (users.size() == 0) {
      return "A user with username " # username # " does not exist";
    };
    let userDataText = userDataAsText(users[0]);
     "querying for user " # username # ":\n" # userDataText
  };

  // Sets the progress of the current user on the specified challenge to the given percentage
  // (if the user is registered and has previously accepted the challenge).
  public shared(msg) func setProgress(challengeId: ChallengeId, newProgress: Nat) : async Text {
    if (newProgress >= 100) {
      return "progress must be less than 100%";
    };

    // Verify the user.
    var userData = switch (userDb.findById(msg.caller)) {
      case (null) { return "user not registered" };
      case (?user) user
    };

    let newMetadata : ChallengeMetadata = {
      id = challengeId;
      status = #inprogress;
      completionDeadline = 0;  // TODO
      progress = newProgress;
    };

    let maybestatus = getStatusIfExists(challengeId, userData.challenges);
    switch maybestatus {
      case (null or ?#suggestion or ?#expired or ?#completed) {
        return "The challenge " # Nat.toText(challengeId) # " is not accepted, so cannot change progress"
      };

      case (?#accepted) {
        userData := replaceExistingChallenge(userData, newMetadata, #accepted);
        userDb.update(userData);
      };

      case (?#inprogress) {
        userData := replaceExistingChallenge(userData, newMetadata, #inprogress);
        userDb.update(userData);
      };
    };
    "updated progress for challenge: " # Nat.toText(challengeId) # "\n" # userDataAsText(userData)
  };

  // Creates on behalf of the current user a new challenge, and adds it to the public challenge DB.
  public shared(msg) func createChallenge(title: Text, description: Text,
    question: Text, answer: Text
  ) : async Text {
    // Verify the user
    let userData = switch (userDb.findById(msg.caller)) {
      case (null) { return "you need to be a registered user to create challenges" };
      case (?user) user
    };
    let username = userData.name;

    let challenge = Challenge.Challenge(challengeCounter.get_new_id(), title, description, question, answer, ?msg.caller);
    challengeDB.add(challenge);
    "A new challenge with id " # Nat.toText(challenge.get_id()) # " is created by user " # username
  };

    // Picks at random an existing challenge from the challenge DB.
  public func pickMeAChallenge(challengeType: Text) : async Text {
    if (challengeType == "Turkish") {
      return pickMeATurkishChallenge();
    };
    return "Ooops nothing found";
  };

  public func exploreLanguage(tags: Text): async Text {
    if (tags == "Tamil|Thirukural") {
      return pickMeAThirukural();
    };
    return "oops nothing found";
  };

  // groupings for Users or challenge (challengeMetaData)
  public func learnLanguage(langauge: Text) : async Text {
    //turkish [(1-2000)] 
    //let validChallengeRanges: [(Nat, Nat)]; 
    //let sizes: [Nat, Nat]; // (lessons vs quizzes)
    var lesson = "";
    for (j in Iter.range(0, 9)) {      
      if (langauge == "Turkish") {
        lesson := lesson # pickMeATurkishChallenge()  # ":" ;
      };
      // Debug.print(lesson);
    };
    
    return lesson;
  };

  // Picks at random an existing challenge from the challenge DB.
   func pickMeATurkishChallenge() :  Text {
    
    switch (challengeDB.get(random.next() % 1960)) {
      case (null) { "There are no challenges in the database" };
      case (?challenge) { challengeAsText(challenge) }
    }
  };

  // Picks at random an existing challenge from the challenge DB.
   func pickMeAThirukural() :  Text {
    switch (challengeDB.get(random.next() % 1330 + 1960)) {
      case (null) { "There are no challenges in the database" };
      case (?challenge) { challengeAsText(challenge) }
    }
  };

    // Returns the given `thirukural` as a human-readable text.
  func kuralAsText(kural: ThiruKural) : Text {
    var kuralText : Text = Nat.toText(kural.number) # "@"  # kural.line1 # "@"  # kural.line2  # "@"  # kural.translation   # "@"  # kural.mv   # "@"  # kural.sp   # "@"  # kural.mk   # "@"  # kural.couplet   # "@"  # kural.explanation # "@"  # kural.transliteration1   # "@"  # kural.transliteration2   # "@"  # kural.paul_name   # "@"  # kural.paul_transliteration   # "@"  # kural.paul_translation   # "@"  # kural.iyal_name   # "@"  # kural.iyal_transliteration   # "@"  # kural.iyal_translation   # "@"  # kural.adikaram_name   # "@"  # kural.adikaram_transliteration   # "@"  # kural.adikaram_translation;
    return kuralText;
  };

  // Returns a description of the challenge identified by `challengeId` (if it exists).
  public query func displayChallenge(challengeId: ChallengeId) : async Text {
    switch (challengeDB.get(challengeId)) {
      case (null) { "A challenge with challenge id " # Nat.toText(challengeId) # " does not exist" };
      case (?challenge) { challengeAsText(challenge) }
    }
  };

  // ------------------------------- internal helpers
  // Generates IDs for challenges.
  flexible object challengeCounter = {
    var count = 0;
    public func get_new_id() : Nat { let id = count; count += 1; id };
    public func get_count() : Nat { count };
  };
  

  // Populate the challenge database with some initial challenges.
  for (tuple in DefaultChallenges.turkishBook.vals()) {
    let desc = "";
    challengeDB.add(
      Challenge.Challenge(
        challengeCounter.get_new_id(),
        "turkish basics", // title
        "learn the word", // desc. add tags
        tuple.0,
        tuple.1,
        null
      ));
  };


  // Populate the challenge database with some initial challenges.
  for (kural in DefaultChallenges.thirukural.vals()) {
    challengeDB.add(Challenge.Challenge(challengeCounter.get_new_id(), "kural_" # Nat.toText(kural.number), kuralAsText(kural), kural.line1 # kural.line2,kural.transliteration1 # kural.transliteration2,null));
  };

  // Comparison of ChallengeStatus-values.
  func eqStatus(s1: ChallengeStatus, s2 : ChallengeStatus) : Bool {
    switch (s1, s2) {
      case (#accepted, #accepted) true;
      case (#completed, #completed) true;
      case (#expired, #expired) true;
      case (#inprogress, #inprogress) true;
      case (#suggestion, #suggestion) true;
      case _ false;
    }
  };

  // Textual representation of ChallengeStatus-values.
  func statusText(s: ChallengeStatus) : Text {
    switch (s) {
      case (#accepted) "accepted";
      case (#completed) "completed";
      case (#expired) "expired";
      case (#inprogress) "inprogress";
      case (#suggestion) "suggestion";
    }
  };

  // Adds the challenge given in `new_cm` to the spefified user's challenges.
  func addNewChallenge(userdata : UserData, new_cm: ChallengeMetadata) : UserData {
    let updated_userdata : UserData = {
      id = userdata.id;
      name = userdata.name;
      location = (userdata.location.0, userdata.location.1);
      challenges = Array.append<ChallengeMetadata>(userdata.challenges, [new_cm]);
      friends = userdata.friends;
    };

    updated_userdata
  };

  // If the user has a challenge metadata with the given id and status, replaces it with the new metadata.
  func replaceExistingChallenge(userdata : UserData, new_cm: ChallengeMetadata, oldStatus: ChallengeStatus) : UserData {
    var cs : [ChallengeMetadata] = [];
    for (cm in userdata.challenges.vals()) {
      if (cm.id == new_cm.id and eqStatus(cm.status, oldStatus)) {
        cs := Array.append<ChallengeMetadata>(cs, [new_cm]);
      } else {
        cs := Array.append<ChallengeMetadata>(cs, [cm]);
      }
    };

    let updated_userdata : UserData = {
      id = userdata.id;
      name = userdata.name;
      location = (userdata.location.0, userdata.location.1);
      challenges = cs;
      friends = userdata.friends;
    };

    updated_userdata;
  };

  // Looks for a challenge identified by `challenge_id` in cm_array, and if found, returns its status.
  func getStatusIfExists (challenge_id: ChallengeId, cm_array: [ChallengeMetadata]) : ?ChallengeStatus {
    func isit(cm: ChallengeMetadata): Bool {
      cm.id == challenge_id
    };
    switch (Array.find<ChallengeMetadata>(cm_array, isit)) {
      case (null) { null };
      case (?cm) { ?cm.status };
    };
  };

  // Returns the given `userData` as a human-readable text.
  func userDataAsText(userData : UserData) : Text {
    
    var userText : Text = "name: " # userData.name # ", Location: [" # (Int.toText(userData.location.0))
        #", " # (Int.toText(userData.location.1))# "], challenges: [";
    for (cm in userData.challenges.vals()) {
      userText := userText # " " # Nat.toText(cm.id) # ":" # statusText(cm.status) # ":" # Nat.toText(cm.progress) # "%"
    };
    return userText # " ]";
  };

  // Returns the given `challenge` as a human-readable text.
  func challengeAsText(challenge: Challenge.Challenge) : Text {
    let id = Nat.toText(challenge.get_id());
    let creator = getUsernameFromOption(challenge.get_creator());
    let acception_count = Nat.toText(challenge.get_acception_count());
    let completion_count = Nat.toText(challenge.get_completion_count());
      
      return id # "," # challenge.get_question() # "," # challenge.get_answer()
      //"{Challenge:" # id 
      //# "\nTitle: " # challenge.get_title()
      //# "\nDescripton: " # challenge.get_description()
      //# "\n Original: "
      // # challenge.get_question()
      //# "\n Translation: " 
      // # ","
      // # challenge.get_answer()
      //#"}"
      //# "\nAccepted " # acception_count # " times\nCompleted " # completion_count # " times"
  };

    // Returns the given `challenge` as a human-readable text.
  func fullChallengeAsText(challenge: Challenge.Challenge) : Text {
    let id = Nat.toText(challenge.get_id());
    let creator = getUsernameFromOption(challenge.get_creator());
    let acception_count = Nat.toText(challenge.get_acception_count());
    let completion_count = Nat.toText(challenge.get_completion_count());
      
      return id # "," # challenge.get_title() 
      # challenge.get_description()
      # challenge.get_question() # "," # challenge.get_answer()
      # acception_count
      # completion_count

      //"{Challenge:" # id 
      //# "\nTitle: " # 
      //# "\nDescripton: " # challenge.get_description()
      //# "\n Original: "
      // # challenge.get_question()
      //# "\n Translation: " 
      // # ","
      // # challenge.get_answer()
      //#"}"
      //# "\nAccepted " # acception_count # " times\nCompleted " # completion_count # " times"
  };


  // Returns username of the specified user (if present).
  func getUsernameFromOption(maybe_user_id : ? UserId) : Text {
    switch (maybe_user_id) {
      case null { "DUAL" };
      case (?user_id) {
        switch (userDb.findById(user_id)) {
          case (null) { "DUAL" };
          case (?user) { user.name };
        }
      }
    }
  }
};
  

  // implement metachallengeservice
  // add the o,h,m encoder
  

  //User Default Options
  // test your french, spanish, german, english (via these other languages)
  // learn numbers (challenges)
  // explore tamil, sanskrit, chinese (sun tzu art of war)

  // a. couplet // transliteration of each each word... (with the whole line and on the top and the meaning in tamil below)
  // final test for kural: guess the adhigaram -> adikaram_translation

  //test, learn, explore

  // 0. 3d worlds
  // 1. create lessons on top of create challenge
  // 2. custom lessons


// how to handle the async nature of the backend?
  // every x frames, the update method can can call the backend
  

  // high level steps: 
  // 1. add terrain 
  // game evolution: RPG
  // you can go valheim route and let users create servers which 
  // 2. for the MMORPG: lots more things have to be considered .. this can come in v2 or v3

  // advantage of common world will be that the universe can act as the NFT store
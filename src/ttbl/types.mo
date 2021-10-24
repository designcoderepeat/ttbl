import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";

module {
  public type UserId = Principal;
  public type ChallengeId = Nat;
  public type Location = (Int, Int);

  public type ChallengeStatus = {
      #accepted; #inprogress; #completed; #expired; #suggestion;
  };

  public type UserProgress = HashMap.HashMap<Text, Text>;

  public type Batte = Challenge;

  public type ChallengeMetadata = {
      id: ChallengeId;
      status: ChallengeStatus;
      completionDeadline: Nat;  // timestamp (unix-style?)
      progress: Nat;  // percent completed (0-100)
  };

  public type UserData = {
    id: UserId;
    name: Text;
    location: Location;
    challenges: [ChallengeMetadata];    
    friends: [UserId];
    // quests: [QuestsMetadata];
    // maxvel: Nat;
    // maxacc: Nat; 
    // inventory: [Text]
    // stats: HashMap // updateStats method will also act as cheat code check
  };
  
  // diff languages can have diff epochs
  type Epoch = {
    #t0; // now   
    #m500; // minus 1000
    #m1000; // minus 1000
  };

  public type LanguageNames = {
    #chinese;
    #hindi;
    #kannada;
    #tamil;
    #turkish;
    #english;
  };

  type Letter = Text;
  type Adage =  Text; // basic building block
  type Information = Text;
  type Tag = Text;

  type Audio = Text;
  type Animation = Text;
  type Glyph = Text;

  type scriptClass = {
    #sylabblic;
    #alphabetic;
  };  

  public type ThiruKural = {
    number: Nat;
    line1: Text;
    line2: Text; 
    translation: Text;
    mv: Text; 
    sp: Text; 
    mk: Text;
    explanation: Text;
    couplet: Text;
    transliteration1: Text;
    transliteration2: Text;
    paul_name: Text;
    paul_transliteration: Text;
    paul_translation: Text;
    iyal_name: Text;
    iyal_transliteration: Text;
    iyal_translation: Text;
    adikaram_name: Text;
    adikaram_transliteration: Text;
    adikaram_translation: Text;
};

  class AlphabetDetails (
    pronunciation: Audio, 
    writingMethod: Animation,
    symbol: Glyph,
    epoch: Epoch,
    scriptStyle: scriptClass  //Tamil script is syllabic rather than alphabetic
    ) {
  };


  public class Book(originalLanguage: LanguageNames,
    originalText: HashMap.HashMap<Text, (Nat, [Adage])>
  ) {};

  class Alphabet (alphabetName: Text, 
    size: Nat, data: HashMap.HashMap<Letter, AlphabetDetails>) {
  };

  public type QuestionAnswers = HashMap.HashMap<Text, Text>;

  class Language (
    languageName: LanguageNames,
    alphabet: Alphabet,
    verses: [Adage],
    books: [Book]
  ) {
    
  };

  class GameMetadata (gameName: Text,
  playerName: Text,
  timePlayed: Text,
  languge: LanguageNames,
  ) {
    
  };

  type LessonType = {
    #simple;
  };

  class Lesson(lessonName: Text, lessonLevel: Nat, 
  lessonType: LessonType
    ) {

    };

  class MCQQuestion(question: Text, 
    options: [Text], correctAnswers: [Text]) {
  
    };



  // not implemented now
  class OneLineAnswer (question: Text, 
      answer: Text, correctAnswer: Text
    ) {

    };

}

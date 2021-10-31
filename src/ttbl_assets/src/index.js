import { ttbl } from "../../declarations/ttbl";
import {StoicIdentity} from "ic-stoic-identity";
const Actor = require("@dfinity/agent").Actor;
const HttpAgent = require("@dfinity/agent").HttpAgent;

const LoaderDiv = document.getElementById("LoaderDiv");
const GameDiv = document.getElementById("GameDiv");

const mainmenu = document.getElementById("mainmenu");
const questControls = document.getElementById("quest-controls");
const controlsMenu = document.getElementById("controls-menu");
const EnterBabelOption = document.getElementById("EnterBabelOption");
const LoginOption = document.getElementById("LoginOption");
const MainMenu = document.getElementById("mainmenu");
const LogInPage = document.getElementById("login");
const LoginButtonStoic = document.getElementById('loginButtonStoic');
const UserProfileOption = document.getElementById('UserProfileOption');
const UserProfilePage = document.getElementById('UserProfile');
const UserProfileDisplayName = document.getElementById('UserProfileDisplayName');
const backToMainMenuFromProfile = document.getElementById("backToMainMenuFromProfile");
var babelTime = 0;
// Make the front end tranisitions stateless

// add annotation to surround console.log with also motoko log
// add logging at begining and end of every funciton
startGameV1();

function startGameV1() {
  attachEventHandlers();
};

function attachEventHandlers() {

//   document.getElementById("continue-learning-girl-btn").addEventListener('click', () => {
//     document.getElementById('quest-ui').style.visibility = 'hidden';
// });

document.getElementById("save-btn").addEventListener('click', () => {
  document.getElementById('quest-ui').style.visibility = 'hidden';
  
  // save progress here

  // show question container below

});

  document.getElementById("continue-learning-btn").addEventListener('click', () => {
      document.getElementById('save-btn').classList.remove('hide');
      document.getElementById('continue-learning-btn').classList.add('hide');

      // hide question-container below
      document.getElementById('question-container').classList.add('hide');

  });

  LoginButtonStoic.addEventListener('click', function (event) {
    console.log(event);
    getUserTextInputAndLogin();
  })

  LoginOption.addEventListener('click', function (event) {
    logInToBabel(event);
  });

  UserProfileOption.addEventListener('click', function (event) {
    hide(MainMenu);
    show(UserProfilePage);
  });

  backToMainMenuFromProfile.addEventListener('click', () => {
    hide(UserProfilePage);
    show(MainMenu);
  });

  // load loader
  EnterBabelOption.addEventListener('click', () => {
    hide(MainMenu);
    show(LoaderDiv);
    show(controlsMenu);
    babelSays("Entering Babel...");
  
    // call the createOrRegisterUser API
  ttbl.enterBabel(userNameLoggedIn).then(result => {
    // get user details from here!
    console.log("New user entered Babel = " + result);
    babelSays(result);
    ttbl.start_campaign(); 
  });
  
});

  // Add an event listener 
document.addEventListener("name-of-event", function(e) {
  console.log(e.detail); // Prints "Example of an event"
  hide(LoaderDiv);
  show(GameDiv);
});

document.getElementById("health-ui").addEventListener('click', () => {
  console.log(e.detail); // Prints "Example of an event"
  show(document.getElementById("ingamemenu"));
});

};

const ShowMainMenu = function showMainMenu() {
  show(MainMenu);
};

function logInToBabel(event) {
  console.log(event);
  hide(MainMenu);
  show(LogInPage);
}

function getUserTextInputAndLogin() {
  var userName = getUserTextInput();
  console.log(userName);
  loginViaStoic(userName);
  hide(LogInPage);
  ShowMainMenu();
  changeOption(LoginOption, UserProfileOption);
}

function changeOption(old, newO) {
  hide(old);
  show(newO);
}

function getUserTextInput() {
  return userInputTerminal.value;
}

function toggle(div) {
  if (div.classList.contains('hide')) {
    div.classList.remove('hide');
  } else {
    div.classList.add('hide');
  }
}

function show(div) {
  div.classList.remove('hide');
};

function hide(div) {
  div.classList.add('hide');
};

const lessonElement = document.getElementById('lessons')
const lessonButtons = document.getElementById('lesson-container')
const startButton = document.getElementById('start-btn')
const startLearningButton = document.getElementById('start-learning-btn');
const continueLearningButton = document.getElementById('continue-learning-btn');
const nextButton = document.getElementById('next-btn')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const questionsElement = document.getElementById('questions')
const answerButtonsElement = document.getElementById('answer-buttons');
const exploretamilButton = document.getElementById('explore-tamil');
// const userInputTerminal = document.getElementById('userInputTerminal');
// const userTerminalButton = document.getElementById('userTerminalButton');

// const goBackDiv = document.getElementById('goBack');
const saveProgressDiv = document.getElementById('saveProgress');


const userChatDiv = document.getElementById('userChat');
const userOptionsDiv = document.getElementById('userOptions');
const loginDiv = document.getElementById('login');
const gameDiv = document.getElementById('game');

const welcomeUserDiv = document.getElementById('welcomeUser');
const welcomeUserInBabel = document.getElementById('welcomeUserInBabel');

const scoreElementDiv = document.getElementById('scoreElement');
// const leaderBoardDiv = document.getElementById('leaderBoard');
const babelConvoDiv = document.getElementById('babelConvo');

// leaderBoardDiv.classList.add('hide');
// goBackDiv.classList.add('hide');
// saveProgressDiv.classList.add('hide');
// userOptionsDiv.classList.add('hide');

// userChatDiv.classList.add('hide');
// gameDiv.classList.add('hide');
// continueLearningButton.classList.add('hide');

function babelSays(msg) {
  document.getElementById("babelConvo").innerText = msg;
}


// userTerminalButton.addEventListener("click", async () => {
//   var userName = userInputTerminal.value;
//   console.log(userName);
//   loginToBabel(userName);
//   gameDiv.classList.remove('hide');
//   loginDiv.classList.add('hide');
// });

const idlFactory = ({ IDL }) => {
  return IDL.Service({
      'greet': IDL.Func([IDL.Text], [IDL.Text], []),
      'greetq': IDL.Func([IDL.Text], [IDL.Text], ['query']),
      'whoami': IDL.Func([], [IDL.Principal], ['query']),
  });
};


// //replace with any canister id
// // console.log("CanisterIds = " + CanisterIds);
const canisterId = "rbsr6-fyaaa-aaaai-aarwa-cai";
// // console.log("CanisterId = " + canisterId);

var userNameLoggedIn = "Cool Money";
var userIdLoggedIn = "";

function loginViaStoic(userName) {
  console.log(userName);
  StoicIdentity.load().then(async identity => {
    if (identity !== false) {
      //ID is a already connected wallet!
    } else {
      //No existing connection, lets make one!
      console.log("Awaiting stoic connection...");
      identity = await StoicIdentity.connect();
      console.log("Got stoic connection... continuining");
    }
    
    //Lets display the connected principal!
    console.log("yooo " + identity.getPrincipal().toText());
    const userId = identity.getPrincipal().toText();

    // call the createOrRegisterUser API
    ttbl.createUser(userName).then(result => {
      // get user details from here!
      console.log("Created user in DB = " + result);
    });
    console.log("holaa " + ttbl.getUser(userName));

    welcomeUserDiv.innerText = userName;
    welcomeUserInBabel.innerText = userName;
    
    // addTextToChatBox('User ' + userName + ' connected');
    
    // document.getElementById("userId").innerText = userId;
    // babelSays("Welcome " + userName + ". It is a pleasure to welcome you, " + get_random(identities));
    // Create an actor canister
    const actor = Actor.createActor(idlFactory, {
     agent: new HttpAgent({
       identity,
     }),
     canisterId,
    });
    
    userIdLoggedIn = userId;
    userNameLoggedIn = userName;
    // Disconnect after
    StoicIdentity.disconnect();
    hide(LogInPage);
    ShowMainMenu();
  });
}

var score = 0;

async function getUserAsync() {
  const users = await ttbl.getUser(userId);
  return users;
}

getUserAsync().then(users => {
  users;
  console.log("users = " + users);
  score = users;
});

var correctAnswers = [];
var wrongAnswers = [];
console.log("User = " + score);


function addTextToChatBox(msg) {
  const newMessage = document.createElement('p');
  newMessage.innerText = msg;
  userChatDiv.appendChild(newMessage);
}

let shuffledQuestions, currentQuestionIndex;

startLearningButton.addEventListener('click', startLearning);

// saveProgressDiv.addEventListener("click", async () => {
//   // Interact with hlo actor, calling the greet method
// var lCorrectAnswers = correctAnswers;
// var lWrongAnswers = wrongAnswers;

// console.log(lCorrectAnswers);
// console.log(lWrongAnswers);

// saveProgressDiv.classList.add("hide");

// lCorrectAnswers.forEach(q => {
//   var a1 =  ttbl.acceptChallenge(q);
//   var a2 =  ttbl.completeChallenge(q);   
//   // console.log(a1 + a2);
// });

// lWrongAnswers.forEach(q => {
//   var a1 =  ttbl.acceptChallenge(q);
//   // console.log(a1);
// });

// });

function startLearning() {
  startLearningButton.classList.add('hide');
  lessonButtons.classList.remove("hide");
  questionsElement.classList.add("hide");

  document.getElementById("test-turkish").addEventListener("click", async () => {
    // Interact with hlo actor, calling the greet method
    lessonButtons.classList.add("hide");
    const lesson = await ttbl.learnLanguage("Turkish");
    console.log(lesson);
    startLesson(lesson, "Quiz")
  });

  document.getElementById("test-german").addEventListener("click", async () => {
    // Interact with hlo actor, calling the greet method
    lessonButtons.classList.add("hide");
    const lesson = await ttbl.learnLanguage("German");
    console.log(lesson);
    startLesson(lesson, "Quiz")
  });
  
  document.getElementById("learn-turkish").addEventListener("click", async () => {
    // Interact with hlo actor, calling the greet method
    lessonButtons.classList.add("hide");
    const lesson = await ttbl.learnLanguage("Turkish");
    console.log(lesson);
    startLesson(lesson, "Lesson")
  });

  document.getElementById("learn-german").addEventListener("click", async () => {
    // Interact with hlo actor, calling the greet method
    lessonButtons.classList.add("hide");
    const lesson = await ttbl.learnLanguage("German");
    console.log(lesson);
    startLesson(lesson, "Lesson")
  });


  document.getElementById("learn-origin-story").addEventListener("click", async () => {
    // Interact with hlo actor, calling the greet method
    lessonButtons.classList.add("hide");
    const lesson = await ttbl.learnOriginStory("English");
    console.log(lesson);
    startLesson(lesson, "OriginStory")
  });

  // document.getElementById("explore-tamil").addEventListener("click", async () => {
  //   // Interact with hlo actor, calling the greet method
  //   const lesson = await ttbl.exploreLanguage("Tamil|Thirukural");
  //   console.log(lesson);
  //   exploreTamil(lesson);
  // });
  
}

function startLesson(syllabus, type) {
  console.log(syllabus);
  syllabus = syllabus.substring(0, syllabus.length - 1);
  correctAnswers = [];
  // scoreElementDiv.innerText = score;
  lessonButtons.classList.add("hide");
  questionsElement.classList.remove("hide");
  // document.getElementById('question-container').classList.remove('hide'); // check this
  formLesson(syllabus, type);
  startButton.classList.remove("hide");
}

function exploreTamil(syllabus) {
  correctAnswers = [];
  scoreElementDiv.innerText = score;
  lessonButtons.classList.add("hide");
  questionsElement.classList.remove("hide");
  formLesson(syllabus, "exploreThirukural");
  startButton.classList.remove("hide");
}

function formLesson(syllabus, type) {
  questions = [];
  if (type == "exploreThirukural") {
    var syllabusforTamil = getSyllabusFromThirukural(syllabus);
    getQuestions(syllabusforTamil, 3).forEach(q => questions.push(q));
  } else if (type == "OriginStory") {
    getQuestionsForOriginStory(syllabus, 0).forEach(q => questions.push(q));
  }
  else if (type == "Quiz") {
    getQuestions(syllabus, 3).forEach(q => questions.push(q));
  } else {
    babelSays("Learn these new words, " + get_random(identities) + ". We will later be quizzed on it");
    // split into 3 quizzes
    var syllabusp1 = syllabus.slice(0, syllabus.length / 3); // lesson is 66% length from the backend
    var syllabusp2 = syllabus.slice(syllabus.length / 3);
    getQuestions(syllabusp1, 0).forEach(q => questions.push(q));
    getQuestions(syllabusp1, 1).forEach(q => questions.push(q));
    getQuestions(syllabusp2, 0).forEach(q => questions.push(q));
    // getQuestions(syllabusp2, 1).forEach(q => questions.push(q));
    getQuestions(syllabus, 3).forEach(q => questions.push(q));
  }
}

function getSyllabusFromThirukural(syllabus) {
  syllabus = syllabus.substring(0, syllabus.length - 1);
  var str = "";
  var strs = syllabus.split(",");
  console.log(strs);
  var id = strs[0];
  var tams = strs[1].split(' ');
  var engs = strs[2].split(' ');
  var qs = [];
  var i = 0;
  var len = tams.length;
  for (let i = 0; i < tams.length; i ++) {
    str =  str  + id + "," + tams[i] + "," + engs[i] + ":";
  }
  return str;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

var options = ["a", "ability", "able", "about", "above", "accept", "according", "account", "across", "act", "action", "activity", "actually", "add", "address", "administration", "admit", "adult", "affect", "after", "again", "against", "age", "agency", "agent", "ago", "agree", "agreement", "ahead", "air", "all", "allow", "almost", "alone", "along", "already", "also", "although", "always", "American", "among", "amount", "analysis", "and", "animal", "another", "answer", "any", "anyone", "anything", "appear", "apply", "approach", "area", "argue", "arm", "around", "arrive", "art", "article", "artist", "as", "ask", "assume", "at", "attack", "attention", "attorney", "audience", "author", "authority", "available", "avoid", "away", "baby", "back", "bad", "bag", "ball", "bank", "bar", "base", "be", "beat", "beautiful", "because", "become", "bed", "before", "begin", "behavior", "behind", "believe", "benefit", "best", "better", "between", "beyond", "big", "bill", "billion", "bit", "black", "blood", "blue", "board", "body", "book", "born", "both", "box", "boy", "break", "bring", "brother", "budget", "build", "building", "business", "but", "buy", "by", "call", "camera", "campaign", "can", "cancer", "candidate", "capital", "car", "card", "care", "career", "carry", "case", "catch", "cause", "cell", "center", "central", "century", "certain", "certainly", "chair", "challenge", "chance", "change", "character", "charge", "check", "child", "choice", "choose", "church", "citizen", "city", "civil", "claim", "class", "clear", "clearly", "close", "coach", "cold", "collection", "college", "color", "come", "commercial", "common", "community", "company", "compare", "computer", "concern", "condition", "conference", "Congress", "consider", "consumer", "contain", "continue", "control", "cost", "could", "country", "couple", "course", "court", "cover", "create", "crime", "cultural", "culture", "cup", "current", "customer", "cut", "dark", "data", "daughter", "day", "dead", "deal", "death", "debate", "decade", "decide", "decision", "deep", "defense", "degree", "Democrat", "democratic", "describe", "design", "despite", "detail", "determine", "develop", "development", "die", "difference", "different", "difficult", "dinner", "direction", "director", "discover", "discuss", "discussion", "disease", "do", "doctor", "dog", "door", "down", "draw", "dream", "drive", "drop", "drug", "during", "each", "early", "east", "easy", "eat", "economic", "economy", "edge", "education", "effect", "effort", "eight", "either", "election", "else", "employee", "end", "energy", "enjoy", "enough", "enter", "entire", "environment", "environmental", "especially", "establish", "even", "evening", "event", "ever", "every", "everybody", "everyone", "everything", "evidence", "exactly", "example", "executive", "exist", "expect", "experience", "expert", "explain", "eye", "face", "fact", "factor", "fail", "fall", "family", "far", "fast", "father", "fear", "federal", "feel", "feeling", "few", "field", "fight", "figure", "fill", "film", "final", "finally", "financial", "find", "fine", "finger", "finish", "fire", "firm", "first", "fish", "five", "floor", "fly", "focus", "follow", "food", "foot", "for", "force", "foreign", "forget", "form", "former", "forward", "four", "free", "friend", "from", "front", "full", "fund", "future", "game", "garden", "gas", "general", "generation", "get", "girl", "give", "glass", "go", "goal", "good", "government", "great", "green", "ground", "group", "grow", "growth", "guess", "gun", "guy", "hair", "half", "hand", "hang", "happen", "happy", "hard", "have", "he", "head", "health", "hear", "heart", "heat", "heavy", "help", "her", "here", "herself", "high", "him", "himself", "his", "history", "hit", "hold", "home", "hope", "hospital", "hot", "hotel", "hour", "house", "how", "however", "huge", "human", "hundred", "husband", "I", "idea", "identify", "if", "image", "imagine", "impact", "important", "improve", "in", "include", "including", "increase", "indeed", "indicate", "individual", "industry", "information", "inside", "instead", "institution", "interest", "interesting", "international", "interview", "into", "investment", "involve", "issue", "it", "item", "its", "itself", "job", "join", "just", "keep", "key", "kid", "kill", "kind", "kitchen", "know", "knowledge", "land", "language", "large", "last", "late", "later", "laugh", "law", "lawyer", "lay", "lead", "leader", "learn", "least", "leave", "left", "leg", "legal", "less", "let", "letter", "level", "lie", "life", "light", "like", "likely", "line", "list", "listen", "little", "live", "local", "long", "look", "lose", "loss", "lot", "love", "low", "machine", "magazine", "main", "maintain", "major", "majority", "make", "man", "manage", "management", "manager", "many", "market", "marriage", "material", "matter", "may", "maybe", "me", "mean", "measure", "media", "medical", "meet", "meeting", "member", "memory", "mention", "message", "method", "middle", "might", "military", "million", "mind", "minute", "miss", "mission", "model", "modern", "moment", "money", "month", "more", "morning", "most", "mother", "mouth", "move", "movement", "movie", "Mr", "Mrs", "much", "music", "must", "my", "myself", "name", "nation", "national", "natural", "nature", "near", "nearly", "necessary", "need", "network", "never", "new", "news", "newspaper", "next", "nice", "night", "no", "none", "nor", "north", "not", "note", "nothing", "notice", "now", "n't", "number", "occur", "of", "off", "offer", "office", "officer", "official", "often", "oh", "oil", "ok", "old", "on", "once", "one", "only", "onto", "open", "operation", "opportunity", "option", "or", "order", "organization", "other", "others", "our", "out", "outside", "over", "own", "owner", "page", "pain", "painting", "paper", "parent", "part", "participant", "particular", "particularly", "partner", "party", "pass", "past", "patient", "pattern", "pay", "peace", "people", "per", "perform", "performance", "perhaps", "period", "person", "personal", "phone", "physical", "pick", "picture", "piece", "place", "plan", "plant", "play", "player", "PM", "point", "police", "policy", "political", "politics", "poor", "popular", "population", "position", "positive", "possible", "power", "practice", "prepare", "present", "president", "pressure", "pretty", "prevent", "price", "private", "probably", "problem", "process", "produce", "product", "production", "professional", "professor", "program", "project", "property", "protect", "prove", "provide", "public", "pull", "purpose", "push", "put", "quality", "question", "quickly", "quite", "race", "radio", "raise", "range", "rate", "rather", "reach", "read", "ready", "real", "reality", "realize", "really", "reason", "receive", "recent", "recently", "recognize", "record", "red", "reduce", "reflect", "region", "relate", "relationship", "religious", "remain", "remember", "remove", "report", "represent", "Republican", "require", "research", "resource", "respond", "response", "responsibility", "rest", "result", "return", "reveal", "rich", "right", "rise", "risk", "road", "rock", "role", "room", "rule", "run", "safe", "same", "save", "say", "scene", "school", "science", "scientist", "score", "sea", "season", "seat", "second", "section", "security", "see", "seek", "seem", "sell", "send", "senior", "sense", "series", "serious", "serve", "service", "set", "seven", "several", "sex", "sexual", "shake", "share", "she", "shoot", "short", "shot", "should", "shoulder", "show", "side", "sign", "significant", "similar", "simple", "simply", "since", "sing", "single", "sister", "sit", "site", "situation", "six", "size", "skill", "skin", "small", "smile", "so", "social", "society", "soldier", "some", "somebody", "someone", "something", "sometimes", "son", "song", "soon", "sort", "sound", "source", "south", "southern", "space", "speak", "special", "specific", "speech", "spend", "sport", "spring", "staff", "stage", "stand", "standard", "star", "start", "state", "statement", "station", "stay", "step", "still", "stock", "stop", "store", "story", "strategy", "street", "strong", "structure", "student", "study", "stuff", "style", "subject", "success", "successful", "such", "suddenly", "suffer", "suggest", "summer", "support", "sure", "surface", "system", "table", "take", "talk", "task", "tax", "teach", "teacher", "team", "technology", "television", "tell", "ten", "tend", "term", "test", "than", "thank", "that", "the", "their", "them", "themselves", "then", "theory", "there", "these", "they", "thing", "think", "third", "this", "those", "though", "thought", "thousand", "threat", "three", "through", "throughout", "throw", "thus", "time", "to", "today", "together", "tonight", "too", "top", "total", "tough", "toward", "town", "trade", "traditional", "training", "travel", "treat", "treatment", "tree", "trial", "trip", "trouble", "true", "truth", "try", "turn", "TV", "two", "type", "under", "understand", "unit", "until", "up", "upon", "us", "use", "usually", "value", "various", "very", "victim", "view", "violence", "visit", "voice", "vote", "wait", "walk", "wall", "want", "war", "watch", "water", "way", "we", "weapon", "wear", "week", "weight", "well", "west", "western", "what", "whatever", "when", "where", "whether", "which", "while", "white", "who", "whole", "whom", "whose", "why", "wide", "wife", "will", "win", "wind", "window", "wish", "with", "within", "without", "woman", "wonder", "word", "work", "worker", "world", "worry", "would", "write", "writer", "wrong", "yard", "yeah", "year", "yes", "yet", "you", "young", "your", "yourself"];
var welldones = ["well done!", "bravo", "nice job commander!", "aye aye", "keep going", "that's correct", "yes indeed", "indeed", "100%", "you got this", "you're a winner", "wow, you are good at this", "can't stop me", "that's correct", "ba dmm tssss", "*clap clap*", "süper", "nice job", "keep it up", "keep going to rescue humanity", "you're smartrer now", "the world is one bit better now", "indeed", "hmm... you're good at this","you’re on the right track now!", "you’ve got it mate", "super!", "that’s right!", "that’s good", "you’re really working hard today", "you are very good at that", "that’s coming along nicely", "good work!", "i’m happy to see you working like that", "that’s much, much better!", "exactly right", "you’re doing that much better today", "you’ve just about got it", "that’s the best you’ve ever done", "you’re doing a good job", "that’s it!", "now you’ve figured it out", "that’s quite an improvement", "great!", "i knew you could do it", "congratulations!", "not bad", "keep working on it", "you’re improving", "now you have it!", "you are learning fast", "good for you!", "couldn’t have done it better myself", "aren’t you proud of yourself?", "one more time and you’ll have it", "you really make my job fun", "that’s the right way to do it", "you’re getting better every day", "you did it that time!", "that’s not half bad", "nice going", "you haven’t missed a thing!", "wow!", "that’s the way!", "keep up the good work", "terrific!", "nothing can stop you now", "that’s the way to do it", "sensational!", "you’ve got your brain in gear today", "that’s better", "that was first class work", "excellent!", "that’s the best ever", "you’ve just about mastered it", "perfect!", "that’s better than ever", "much better!", "wonderful!", "you must have been practicing", "you did that very well", "fine!", "nice going", "you’re really going to town", "outstanding!", "fantastic!", "tremendous!", "that’s how to handle that", "now that’s what i call a fine job", "that’s great", "right on!", "you’re really improving", "you’re doing beautifully!", "superb!", "good remembering", "you’ve got that down pat", "you certainly did well today", "keep it up!", "congratulations you got it right!", "you did a lot of work today", "well look at you go", "that’s it", "i like knowing you", "marvelous!", "i like that", "way to go!", "now you have the hang of it", "you’re doing fine!", "good thinking", "you are really learning a lot", "good going", "i’ve never seen anyone do it better", "you outdid yourself today!", "i think you’ve got it now", "good job", "you figured that out fast", "you remembered!", "that’s really nice", "that kind of work makes me happy", "it’s such a pleasure to teach when you work like that!", "i think you’re doing the right thing", "you must be proud of yourself", "give yourself a pat on the back", "lead us captain", "no wonder the humans chose you"];
var notquites = ["not quite", "try again", "better luck next time", "keep practising", "practise makes perfect", "everyone started somewhere", "if you are in hell, why would you stop? keep going", "practise makes the man perfect", "the master has failed more times than the student", "if a victory is told in enough details, it can not be distinguised from a defeat", "we learn more from our defeats", "retry mission", "that was close", "well.. not quite", "babel says no", "better luck next time", "even the best falter", "hmm... not really", "are you sure? ", "are you sure", "i beg your pardon"];
var identities = ["your highness", "your royal majesty", "your honor", "your majesty", "your grace", "my lord", "your excellency", "your mightiness", "my king", "my ruler", "my emperor", "king of kings", "my king", "my knight", "king", "winner"];

// if learn just one
// if quiz introduce random options

function getQuestionsForOriginStory(syllabus, optionssize) {
  console.log(syllabus);
  const pairs = syllabus.split(":");
  var questions = [];
  pairs.forEach(pair => {
      const qa = pair.split(",");
      const id = qa[0];
      const q = qa[1];
      const a = qa[2];
      if (a != "") {
        options.push(a);
      }
  });

  pairs.forEach(pair => {
    {
      const qa = pair.split(",");
      const id = qa[0];
      const q = qa[1];
      const a = qa[2];
      if (q != "" && a != "") {
        var ques = {
          id: id,
          question:  (id - 1960) + ' :' +  q ,
          answers: [
            { text: '' + a + '', correct: true }
          ]
        };
        // add extra options based on options size
        for (let i = 0; i <optionssize; i++) {

          var wrongoption = options[Math.floor(
            Math.random() * options.length
          )];

          while (wrongoption == a) {
            wrongoption = options[Math.floor(
              Math.random() * options.length
            )];
          }
          var wronganswer = { text: wrongoption, correct: false }
          ques.answers.push(wronganswer);
        }
        // randomize options
        shuffleArray(ques.answers);
        questions.push(ques);
        }
      }
  });
  // shuffleArray(questions);
  return questions;
}

function getQuestions(syllabus, optionssize, _shuffle) {
  const pairs = syllabus.split(":");
  var questions = [];
  pairs.forEach(pair => {
      const qa = pair.split(",");
      const id = qa[0];
      const q = qa[1];
      const a = qa[2];
      if (a != "") {
        options.push(a);
      }
  });

  pairs.forEach(pair => {
    {
      const qa = pair.split(",");
      const id = qa[0];
      const q = qa[1];
      const a = qa[2];
      if (q != "" && a != "") {
        var ques = {
          id: id,
          question: "What does " + q + " mean ?",
          answers: [
            { text: '' + a + '', correct: true }
          ]
        };
        // add extra options based on options size
        for (let i = 0; i <optionssize; i++) {

          var wrongoption = options[Math.floor(
            Math.random() * options.length
          )];

          while (wrongoption == a) {
            wrongoption = options[Math.floor(
              Math.random() * options.length
            )];
          }
          var wronganswer = { text: wrongoption, correct: false }
          ques.answers.push(wronganswer);
        }
        // randomize options
        shuffleArray(ques.answers);
        questions.push(ques);
        }
      }
  });
  shuffleArray(questions);
  return questions;
}

startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', () => {
  currentQuestionIndex++
  setNextQuestion()
})

// function changeBG(e) {
//   const newbg = './bg/images/' + Math.ceil(Math.random() * 58) + '.jpg';
//   e.backgroundImage =  "url(" + newbg + ")";
// }

function changeBGToBabel() {
  const newbg = './bg/bg0.jpeg';
  document.body.style.backgroundImage =  "url(" + newbg + ")";
}


function startGame() {
  // changeBG();
  startButton.classList.add('hide');
  shuffledQuestions = questions;
  currentQuestionIndex = 0;
  questionContainerElement.classList.remove('hide');
  setNextQuestion();
}

function setNextQuestion() {
  resetState()
  showQuestion(shuffledQuestions[currentQuestionIndex])
}

function showQuestion(question) {
  babelSays("Here is challenge " + question.id + ", " + get_random(identities));
  questionElement.innerText = question.question;
  question.answers.forEach(answer => {
    const button = document.createElement('button')
    button.innerText = answer.text
    button.classList.add('btn')
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    // button.addEventListener('click', selectAnswer, question)
    button.addEventListener('click', (e) => ((question) => selectAnswer(e, question))(question));
    answerButtonsElement.appendChild(button)
  })
}

function resetState() {
  clearStatusClass(document.body)
  nextButton.classList.add('hide')
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild)
  }
}

function selectAnswer(e, question) {


  console.log( question);
  const selectedButton = e.target
  const correct = selectedButton.dataset.correct
  if (correct) {
    score ++;
    correctAnswers.push(parseInt(question.id));
    babelSays(get_random(welldones));
  } else {
    wrongAnswers.push(parseInt(question.id));
    babelSays(get_random(notquites) + ", " + get_random(identities));
  }
  setStatusClass(document.body, correct)
  Array.from(answerButtonsElement.children).forEach(button => {
    setStatusClass(button, button.dataset.correct)
  })
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide')
  } else {
    //sleeping for now
    //wait for button press
    console.log("Changing the scene");
    continueLearningButton.classList.remove('hide');
    
    //changeBGToBabel();
  }
}

continueLearningButton.addEventListener("click", async () => {
  // updateUserScores();
  updateScoreBoard();
  continueLearningButton.classList.add('hide');
  startLearningButton.innerText = 'Choose Next mission';
  startLearningButton.classList.remove('hide');
  questionContainerElement.classList.add('hide');
});

function updateScoreBoard() {
  // scoreElementDiv.innerText = score;
  var totalQuestions = correctAnswers.length + wrongAnswers.length;
  
  // hack
  if (totalQuestions > 0)
  babelSays("You got " + correctAnswers.length + " correct out of " + totalQuestions + ", " + get_random(identities));
  saveProgressDiv.classList.remove("hide");
  // updateUserScoreOnUI();
  // updateUserScoreBackend();
}

function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add('correct');
  } else {
    element.classList.add('wrong')
  }
  console.log(score);
}

function clearStatusClass(element) {
  element.classList.remove('correct')
  element.classList.remove('wrong')
}

var questions = [
  {
    question: 'What is 2 + 2?',
    answers: [
      { text: '4', correct: true },
      { text: '22', correct: false }
    ]
  }
]

function get_random (list) {
  return list[Math.floor((Math.random()*list.length))];
}

String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
function () {
    "use strict";
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
            : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
};
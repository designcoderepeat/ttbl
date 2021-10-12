import { ttbl } from "../../declarations/ttbl";
import {StoicIdentity} from "ic-stoic-identity";

const userInputTerminal = document.getElementById('userInputTerminal');
const userTerminalButton = document.getElementById('userTerminalButton');

const loginDiv = document.getElementById('login');
const gameDiv = document.getElementById('game');

gameDiv.classList.add('hide')


userTerminalButton.addEventListener("click", async () => {
  var userName = userInputTerminal.value;
  console.log(userName);
  loginToBabel(userName);
  gameDiv.classList.remove('hide');
  loginDiv.classList.add('hide');
});

function loginToBabel(userName) {
  console.log(userName);
  StoicIdentity.load().then(async identity => {
    if (identity !== false) {
      //ID is a already connected wallet!
    } else {
      //No existing connection, lets make one!
      identity = await StoicIdentity.connect();
    }
    
    //Lets display the connected principal!
    console.log(identity.getPrincipal().toText());
    const userId = identity.getPrincipal().toText();

    // call the createOrRegisterUser API
    ttbl.createUser(userName);
    console.log(ttbl.getUser(userName));

    // document.getElementById("userId").innerText = userId;
    //Create an actor canister
    //const actor = Actor.createActor(idlFactory, {
    //  agent: new HttpAgent({
    //    identity,
    //  }),
    //  canisterId,
    //});
    
    //Disconnect after
    //StoicIdentity.disconnect();
  });
}

const lessonElement = document.getElementById('lessons')
const lessonButtons = document.getElementById('lesson-container')
console.log(lessonButtons)
const startButton = document.getElementById('start-btn')
const startLearningButton = document.getElementById('start-learning-btn')
const nextButton = document.getElementById('next-btn')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const questionsElement = document.getElementById('questions')
const answerButtonsElement = document.getElementById('answer-buttons');

let shuffledQuestions, currentQuestionIndex;

startLearningButton.addEventListener('click', startLearning);

function startLearning() {
  startLearningButton.classList.add('hide')
  lessonButtons.classList.remove("hide")
  questionsElement.classList.add("hide")

  document.getElementById("test-turkish").addEventListener("click", async () => {
    // Interact with hlo actor, calling the greet method
    const lesson = await ttbl.learnLanguage("Turkish");
    console.log(lesson);
    startLesson(lesson, "Quiz")
  });
  
  document.getElementById("test-chinese").addEventListener("click", async () => {
    // Interact with hlo actor, calling the greet method
    const lesson = await ttbl.learnLanguage("Chinese");
    console.log(lesson);
    startLesson(lesson, "Quiz")
  });

  document.getElementById("learn-turkish").addEventListener("click", async () => {
    // Interact with hlo actor, calling the greet method
    const lesson = await ttbl.learnLanguage("Turkish");
    console.log(lesson);
    startLesson(lesson, "Lesson")
  });

  document.getElementById("learn-chinese").addEventListener("click", async () => {
    // Interact with hlo actor, calling the greet method
    const lesson = await ttbl.learnLanguage("Chinese");
    console.log(lesson);
    startLesson(lesson, "Lesson")
  });
}

function startLesson(syllabus, type) {
  lessonButtons.classList.add("hide");
  questionsElement.classList.remove("hide");
  formLesson(syllabus, type);
  startButton.classList.remove("hide")
}

function formLesson(syllabus, type) {
  questions = []; // watch out.. this is stateful
  if (type == "Quiz") {
    getQuestions(syllabus, 1).forEach(q => questions.push(q));
  } else {
    // split into 3 quizzes
    var syllabusp1 = syllabus.slice(0, syllabus.length / 3); // lesson is 66% length from the backend
    var syllabusp2 = syllabus.slice(syllabus.length / 3);
    getQuestions(syllabusp1, 0).forEach(q => questions.push(q));;
    getQuestions(syllabusp1, 1).forEach(q => questions.push(q));;
    getQuestions(syllabusp2, 0).forEach(q => questions.push(q));;
    getQuestions(syllabusp2, 1).forEach(q => questions.push(q));;
    getQuestions(syllabus, 3).forEach(q => questions.push(q));;
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

var options = ["a", "ability", "able", "about", "above", "accept", "according", "account", "across", "act", "action", "activity", "actually", "add", "address", "administration", "admit", "adult", "affect", "after", "again", "against", "age", "agency", "agent", "ago", "agree", "agreement", "ahead", "air", "all", "allow", "almost", "alone", "along", "already", "also", "although", "always", "American", "among", "amount", "analysis", "and", "animal", "another", "answer", "any", "anyone", "anything", "appear", "apply", "approach", "area", "argue", "arm", "around", "arrive", "art", "article", "artist", "as", "ask", "assume", "at", "attack", "attention", "attorney", "audience", "author", "authority", "available", "avoid", "away", "baby", "back", "bad", "bag", "ball", "bank", "bar", "base", "be", "beat", "beautiful", "because", "become", "bed", "before", "begin", "behavior", "behind", "believe", "benefit", "best", "better", "between", "beyond", "big", "bill", "billion", "bit", "black", "blood", "blue", "board", "body", "book", "born", "both", "box", "boy", "break", "bring", "brother", "budget", "build", "building", "business", "but", "buy", "by", "call", "camera", "campaign", "can", "cancer", "candidate", "capital", "car", "card", "care", "career", "carry", "case", "catch", "cause", "cell", "center", "central", "century", "certain", "certainly", "chair", "challenge", "chance", "change", "character", "charge", "check", "child", "choice", "choose", "church", "citizen", "city", "civil", "claim", "class", "clear", "clearly", "close", "coach", "cold", "collection", "college", "color", "come", "commercial", "common", "community", "company", "compare", "computer", "concern", "condition", "conference", "Congress", "consider", "consumer", "contain", "continue", "control", "cost", "could", "country", "couple", "course", "court", "cover", "create", "crime", "cultural", "culture", "cup", "current", "customer", "cut", "dark", "data", "daughter", "day", "dead", "deal", "death", "debate", "decade", "decide", "decision", "deep", "defense", "degree", "Democrat", "democratic", "describe", "design", "despite", "detail", "determine", "develop", "development", "die", "difference", "different", "difficult", "dinner", "direction", "director", "discover", "discuss", "discussion", "disease", "do", "doctor", "dog", "door", "down", "draw", "dream", "drive", "drop", "drug", "during", "each", "early", "east", "easy", "eat", "economic", "economy", "edge", "education", "effect", "effort", "eight", "either", "election", "else", "employee", "end", "energy", "enjoy", "enough", "enter", "entire", "environment", "environmental", "especially", "establish", "even", "evening", "event", "ever", "every", "everybody", "everyone", "everything", "evidence", "exactly", "example", "executive", "exist", "expect", "experience", "expert", "explain", "eye", "face", "fact", "factor", "fail", "fall", "family", "far", "fast", "father", "fear", "federal", "feel", "feeling", "few", "field", "fight", "figure", "fill", "film", "final", "finally", "financial", "find", "fine", "finger", "finish", "fire", "firm", "first", "fish", "five", "floor", "fly", "focus", "follow", "food", "foot", "for", "force", "foreign", "forget", "form", "former", "forward", "four", "free", "friend", "from", "front", "full", "fund", "future", "game", "garden", "gas", "general", "generation", "get", "girl", "give", "glass", "go", "goal", "good", "government", "great", "green", "ground", "group", "grow", "growth", "guess", "gun", "guy", "hair", "half", "hand", "hang", "happen", "happy", "hard", "have", "he", "head", "health", "hear", "heart", "heat", "heavy", "help", "her", "here", "herself", "high", "him", "himself", "his", "history", "hit", "hold", "home", "hope", "hospital", "hot", "hotel", "hour", "house", "how", "however", "huge", "human", "hundred", "husband", "I", "idea", "identify", "if", "image", "imagine", "impact", "important", "improve", "in", "include", "including", "increase", "indeed", "indicate", "individual", "industry", "information", "inside", "instead", "institution", "interest", "interesting", "international", "interview", "into", "investment", "involve", "issue", "it", "item", "its", "itself", "job", "join", "just", "keep", "key", "kid", "kill", "kind", "kitchen", "know", "knowledge", "land", "language", "large", "last", "late", "later", "laugh", "law", "lawyer", "lay", "lead", "leader", "learn", "least", "leave", "left", "leg", "legal", "less", "let", "letter", "level", "lie", "life", "light", "like", "likely", "line", "list", "listen", "little", "live", "local", "long", "look", "lose", "loss", "lot", "love", "low", "machine", "magazine", "main", "maintain", "major", "majority", "make", "man", "manage", "management", "manager", "many", "market", "marriage", "material", "matter", "may", "maybe", "me", "mean", "measure", "media", "medical", "meet", "meeting", "member", "memory", "mention", "message", "method", "middle", "might", "military", "million", "mind", "minute", "miss", "mission", "model", "modern", "moment", "money", "month", "more", "morning", "most", "mother", "mouth", "move", "movement", "movie", "Mr", "Mrs", "much", "music", "must", "my", "myself", "name", "nation", "national", "natural", "nature", "near", "nearly", "necessary", "need", "network", "never", "new", "news", "newspaper", "next", "nice", "night", "no", "none", "nor", "north", "not", "note", "nothing", "notice", "now", "n't", "number", "occur", "of", "off", "offer", "office", "officer", "official", "often", "oh", "oil", "ok", "old", "on", "once", "one", "only", "onto", "open", "operation", "opportunity", "option", "or", "order", "organization", "other", "others", "our", "out", "outside", "over", "own", "owner", "page", "pain", "painting", "paper", "parent", "part", "participant", "particular", "particularly", "partner", "party", "pass", "past", "patient", "pattern", "pay", "peace", "people", "per", "perform", "performance", "perhaps", "period", "person", "personal", "phone", "physical", "pick", "picture", "piece", "place", "plan", "plant", "play", "player", "PM", "point", "police", "policy", "political", "politics", "poor", "popular", "population", "position", "positive", "possible", "power", "practice", "prepare", "present", "president", "pressure", "pretty", "prevent", "price", "private", "probably", "problem", "process", "produce", "product", "production", "professional", "professor", "program", "project", "property", "protect", "prove", "provide", "public", "pull", "purpose", "push", "put", "quality", "question", "quickly", "quite", "race", "radio", "raise", "range", "rate", "rather", "reach", "read", "ready", "real", "reality", "realize", "really", "reason", "receive", "recent", "recently", "recognize", "record", "red", "reduce", "reflect", "region", "relate", "relationship", "religious", "remain", "remember", "remove", "report", "represent", "Republican", "require", "research", "resource", "respond", "response", "responsibility", "rest", "result", "return", "reveal", "rich", "right", "rise", "risk", "road", "rock", "role", "room", "rule", "run", "safe", "same", "save", "say", "scene", "school", "science", "scientist", "score", "sea", "season", "seat", "second", "section", "security", "see", "seek", "seem", "sell", "send", "senior", "sense", "series", "serious", "serve", "service", "set", "seven", "several", "sex", "sexual", "shake", "share", "she", "shoot", "short", "shot", "should", "shoulder", "show", "side", "sign", "significant", "similar", "simple", "simply", "since", "sing", "single", "sister", "sit", "site", "situation", "six", "size", "skill", "skin", "small", "smile", "so", "social", "society", "soldier", "some", "somebody", "someone", "something", "sometimes", "son", "song", "soon", "sort", "sound", "source", "south", "southern", "space", "speak", "special", "specific", "speech", "spend", "sport", "spring", "staff", "stage", "stand", "standard", "star", "start", "state", "statement", "station", "stay", "step", "still", "stock", "stop", "store", "story", "strategy", "street", "strong", "structure", "student", "study", "stuff", "style", "subject", "success", "successful", "such", "suddenly", "suffer", "suggest", "summer", "support", "sure", "surface", "system", "table", "take", "talk", "task", "tax", "teach", "teacher", "team", "technology", "television", "tell", "ten", "tend", "term", "test", "than", "thank", "that", "the", "their", "them", "themselves", "then", "theory", "there", "these", "they", "thing", "think", "third", "this", "those", "though", "thought", "thousand", "threat", "three", "through", "throughout", "throw", "thus", "time", "to", "today", "together", "tonight", "too", "top", "total", "tough", "toward", "town", "trade", "traditional", "training", "travel", "treat", "treatment", "tree", "trial", "trip", "trouble", "true", "truth", "try", "turn", "TV", "two", "type", "under", "understand", "unit", "until", "up", "upon", "us", "use", "usually", "value", "various", "very", "victim", "view", "violence", "visit", "voice", "vote", "wait", "walk", "wall", "want", "war", "watch", "water", "way", "we", "weapon", "wear", "week", "weight", "well", "west", "western", "what", "whatever", "when", "where", "whether", "which", "while", "white", "who", "whole", "whom", "whose", "why", "wide", "wife", "will", "win", "wind", "window", "wish", "with", "within", "without", "woman", "wonder", "word", "work", "worker", "world", "worry", "would", "write", "writer", "wrong", "yard", "yeah", "year", "yes", "yet", "you", "young", "your", "yourself"];

// if learn just one
// if quiz introduce random options
function getQuestions(syllabus, optionssize) {
  const pairs = syllabus.split(":");
  var questions = []; // careful
  pairs.forEach(pair => {
      const qa = pair.split(",");
      const q = qa[0];
      const a = qa[1];
      if (a != "") {
        options.push(a);
      }
  });

  pairs.forEach(pair => {
    {
      const qa = pair.split(",");
      const q = qa[0];
      const a = qa[1];
      if (q != "" && a != "") {
        var ques = {
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

function changeBG() {
  const newbg = './bg/images/' + Math.floor(Math.random() * 60) + '.jpg';
  document.body.style.backgroundImage =  "url(" + newbg + ")";
}

function changeBGToBabel() {
  const newbg = './bg/bg0.jpeg';
  document.body.style.backgroundImage =  "url(" + newbg + ")";
}


function startGame() {
  changeBG();
  startButton.classList.add('hide')
  shuffledQuestions = questions;
  currentQuestionIndex = 0
  questionContainerElement.classList.remove('hide')
  setNextQuestion()
}

function setNextQuestion() {
  resetState()
  showQuestion(shuffledQuestions[currentQuestionIndex])
}

function showQuestion(question) {
  questionElement.innerText = question.question
  question.answers.forEach(answer => {
    const button = document.createElement('button')
    button.innerText = answer.text
    button.classList.add('btn')
    if (answer.correct) {
      button.dataset.correct = answer.correct
    }
    button.addEventListener('click', selectAnswer)
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

function selectAnswer(e) {
  const selectedButton = e.target
  const correct = selectedButton.dataset.correct
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
    consolidateScore();
    startLearningButton.innerText = 'Continue Learning'
    startLearningButton.classList.remove('hide');
    questionContainerElement.classList.add('hide');
    //changeBGToBabel();
  }
}

function consolidateScore() {
  // updateUserScoreOnUI();
  // updateUserScoreBackend();
}

function setStatusClass(element, correct) {
  clearStatusClass(element)
  if (correct) {
    element.classList.add('correct')
  } else {
    element.classList.add('wrong')
  }
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
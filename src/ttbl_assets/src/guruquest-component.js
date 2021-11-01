import {entity} from './entity.js';

const continueButton = document.getElementById('continue-learning-btn');
const startButton = document.getElementById('start-learning-btn');

export const Guruquest_component = (() => {

  const GuruQUEST_TITLE = 'Welcome to Babel seeker';
  const GuruQUEST_TEXT = 'You must be curious if you made it all the way here'; 
  const GuruQUEST_OBJECTIVE = 'Learn The origin stories';
  // const GuruQUEST_QUESTOPTIONS = "";

  class GuruQuestComponent extends entity.Component {
    constructor() {
      super();
      const e = document.getElementById('quest-ui');
      e.classList.add('hide');
    }

    InitComponent() {
      this._RegisterHandler('input.picked', (m) => this._OnPicked(m));
    }

    _AttachHandlers() {
      // on click continue.. start story
      // on finishing demo story attach the rest of the options
    }

    _OnPicked(msg) {

      const e1 = document.getElementById('quest-ui');

      // get this as config from bg

      const newbg = '/bg/images/' + Math.ceil(Math.random() * 58) + '.jpg';
      // const newbg = '/bg/images/' + Math.ceil( parseInt(id) %  58) + '.jpg'; // will be same for the quest... for its lessons and challenges
      // console.log(newbg);


      // unlock other lessons
    //   <div id="lesson-buttons" class="btn-grid">
    //   <button id="learn-origin-story" class="originStory lesson-btn btn"> Learn Origin Story </button>
    //   <button id="test-turkish" class="hide turkishLesson lesson-btn btn"> Test your Türkish </button>
    //   <button id="learn-turkish" class="hide  turkishLesson lesson-btn btn"> Explore Türkish With Babel </button>
    //   <button id="test-german" class="hide  germanLesson lesson-btn btn"> Test your Deutsch </button>
    //   <button id="learn-german" class="hide  germanLesson lesson-btn btn"> Explore German With Babel </button>
    //   <button id="test-spanish" class="hide  spanishLesson lesson-btn btn"> Test your Spanish </button>
    //   <button id="learn-spanish" class="hide  spanishLesson lesson-btn btn"> Explore Spanish With Babel </button>

    //   <button id="test-hindi" class="hide  hindilesson lesson-btn btn"> Test your हिंदी </button>
    //   <button id="learn-hindi" class="hide  hindilesson lesson-btn btn"> Explore हिंदी With Babel </button>
    //   <button id="test-tamil" class="hide  tamillesson lesson-btn btn"> Test your தமிழ் </button>
    //   <button id="learn-tamil" class="hide  tamillesson lesson-btn btn"> Explore தமிழ் With Babel </button>
    //   <button id="back-to-babel-from-learning" class="lesson-btn btn"> Back To Babel </button>
    // </div>

    document.getElementById("test-turkish").classList.remove('hide');
    document.getElementById("learn-turkish").classList.remove('hide');
    document.getElementById("test-german").classList.remove('hide');
    document.getElementById("learn-german").classList.remove('hide');

    document.getElementById("test-spanish").classList.remove('hide');
    document.getElementById("learn-spanish").classList.remove('hide');
    document.getElementById("test-spanish").classList.remove('hide');
    document.getElementById("learn-spanish").classList.remove('hide');

    document.getElementById("test-hindi").classList.remove('hide');
    document.getElementById("learn-hindi").classList.remove('hide');
    document.getElementById("test-tamil").classList.remove('hide');
    document.getElementById("learn-tamil").classList.remove('hide');




      // he's bloody geting picked from behind (hack it now)
      const questNotActive = document.getElementById("quest-ui").classList.contains('hide');
      if (questNotActive) e1.style.backgroundImage =  "url(" + newbg + ")";
      
      document.getElementById('save-btn').classList.add('hide');
      document.getElementById('quest-ui').classList.remove('hide');
    
      const e = document.getElementById('quest-ui');
      e.style.visibility = 'visible';

      this._babelSays('Quest: ' + GuruQUEST_OBJECTIVE);
      continueButton.classList.add('hide');
      startButton.classList.remove('hide');

      // HARDCODE A QUEST
      // read from the quests avilable for user and display them... 
      // here 
      const quest = {
        id: 'DemoQuest_Guru',
        title: GuruQUEST_TITLE,
        text: GuruQUEST_TEXT,
        objective: GuruQUEST_OBJECTIVE,
        // questOptions: GuruQUEST_QUESTOPTIONS,
      };

      this._AddQuestToJournal(quest);
      this._AttachHandlers();

      const guru = this.FindEntity('ui').GetComponent('guru');
      guru.AddComponent(new player_input.PickableComponent());

    }

    _ShowResponses(quest) {

    }

    _AddQuestToJournal(quest) {
      const ui = this.FindEntity('ui').GetComponent('UIController');
      ui.AddQuest(quest);
    }

    _CompleteQuest(quest) {
      // remove from book
      // show effects
      // change the quest values to the next quest details.. in case of campaigns
    }

    _babelSays(msg) {
      const babelConvoDiv = document.getElementById('babelConvo');
      babelConvoDiv.innerText = msg;
    }

  };

  
  return {
      GuruQuestComponent: GuruQuestComponent,
  };
})();
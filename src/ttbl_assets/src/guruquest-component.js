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
      e.style.visibility = 'hidden';
    }

    InitComponent() {
      this._RegisterHandler('input.picked', (m) => this._OnPicked(m));
    }

    _AttachHandlers() {
      // on click continue.. start story
      // on finishing demo story attach the rest of the options
    }

    _OnPicked(msg) {
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
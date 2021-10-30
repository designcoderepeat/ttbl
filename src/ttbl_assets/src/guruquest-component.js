import {entity} from "./entity.js";


export const Guruquest_component = (() => {

  const GuruQUEST_TITLE = 'Hmmm...';
  const GuruQUEST_TEXT = 'Who are you? What do you want?'; 
  const GuruQUEST_OBJECTIVE = 'Learn The origin stories';
  const GuruQUEST_QUESTOPTIONS = "<div class='btn-grid'><button id='quest-continue' class='btn'>Are you.. master Guru?</quest></div>";

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

    }

    _OnPicked(msg) {

      this._babelSays("Quest: " + GuruQUEST_OBJECTIVE);

      // HARDCODE A QUEST

      // read from the quests avilable for user and display them... 
      // here 
      const quest = {
        id: 'DemoQuest_Guru',
        title: GuruQUEST_TITLE,
        text: GuruQUEST_TEXT,
        objective: GuruQUEST_OBJECTIVE,
        questOptions: GuruQUEST_QUESTOPTIONS,
      };

      this._AddQuestToJournal(quest);
      this._AttachHandlers();
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
import {entity} from "./entity.js";


export const quest_component = (() => {

  const _TITLE = 'So you come to Babel...';
  const _TEXT = 'Finally you arrive, traveller. Begin your journey by visiting Master Guru... I hear he lives up North. Beware of the monsters though... use your sword to protect yourself'; 
  const _OBJECTIVE = 'Find Master Guru';
  const _QUESTOPTIONS = "<div class='btn-grid'><button id='quest-continue' class='btn'>Continue Quest</quest></div>";

  class QuestComponent extends entity.Component {
    constructor() {
      super();
      const e = document.getElementById('quest-ui');
      e.style.visibility = 'hidden';
    }

    InitComponent() {
      this._RegisterHandler('input.picked', (m) => this._OnPicked(m));
    }

    _OnPicked(msg) {

      this._babelSays("Quest started...");

      // HARDCODE A QUEST

      // read from the quests avilable for user and display them... 
      // here 
      const quest = {
        id: 'DemoQuest',
        title: _TITLE,
        text: _TEXT,
        objective: _OBJECTIVE,
        questOptions: _QUESTOPTIONS,
      };

      this._AddQuestToJournal(quest);
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
      QuestComponent: QuestComponent,
  };
})();
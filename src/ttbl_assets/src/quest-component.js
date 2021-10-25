import {entity} from "./entity.js";


export const quest_component = (() => {

  const _TITLE = 'Welcome Traveller!';
  const _TEXT = 'Finally you arrive... Begin your journey by visiting Master Guru... I hear he lives up North. Beware of the monsters though... use your sword to protect yourself'; 

  const _QUESTOPTIONS = "Quest Options";

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
      // HARDCODE A QUEST

      // read from the quests avilable for user and display them... 
      // here 
      const quest = {
        id: 'foo',
        title: _TITLE,
        text: _TEXT,
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
      // 
    }

  };

  return {
      QuestComponent: QuestComponent,
  };
})();
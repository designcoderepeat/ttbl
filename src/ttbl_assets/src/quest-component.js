import {entity} from "./entity.js";


export const quest_component = (() => {

  const _TITLE = 'Welcome Traveller!';
  const _TEXT = 'Finally you arrive...'; 

  // quest alone is handled in the UI.. 
  // quest can be of 2(this will keep increasing) type
  // right now.. it is lesson (also known as wisdom or cutscenev0) or challenge
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
      const quest = {
        id: 'foo',
        title: _TITLE,
        text: _TEXT,
      };
      this._AddQuestToJournal(quest);
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
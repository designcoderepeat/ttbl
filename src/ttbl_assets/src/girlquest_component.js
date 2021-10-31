import {entity} from "./entity.js";


export const girlquest_component = (() => {

  const GIRLQUEST_TITLE = 'So you come to Babel...';
  const GIRLQUEST_TEXT = 'Finally you arrive, traveller. Begin your journey by visiting Master Guru... I hear he lives up North. Beware of the monsters though... use your sword to protect yourself. I wonder what secrets he is about to share with you.. He never shares any with me anyway'; 
  const GIRLQUEST_OBJECTIVE = 'Find Master Guru';
  // const GIRLQUEST_QUESTOPTIONS = "<div class='btn-grid'><button id='quest-continue' class='btn'>Continue Quest</quest></div>";

  class GirlQuestComponent extends entity.Component {
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
      const e = document.getElementById('quest-ui');
      e.style.visibility = 'visible';
      this._babelSays("Quest: " + GIRLQUEST_OBJECTIVE);

      // HARDCODE A QUEST

      // read from the quests avilable for user and display them... 
      // here 
      const quest = {
        id: 'DemoQuest',
        title: GIRLQUEST_TITLE,
        text: GIRLQUEST_TEXT,
        objective: GIRLQUEST_OBJECTIVE,
        // questOptions: GIRLQUEST_QUESTOPTIONS,
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
      GirlQuestComponent: GirlQuestComponent,
  };
})();
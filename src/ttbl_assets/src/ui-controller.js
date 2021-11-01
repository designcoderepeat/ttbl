import {entity} from './entity.js';


export const ui_controller = (() => {

  class UIController extends entity.Component {
    constructor(params) {
      super();
      this._params = params;
      this._quests = {};
    }
  
    InitComponent() {
      this._iconBar = {
        stats: document.getElementById('icon-bar-stats'),
        inventory: document.getElementById('icon-bar-inventory'),
        quests: document.getElementById('icon-bar-quests'),
        controls: document.getElementById('icon-bar-controls'),
      };

      this._ui = {
        inventory: document.getElementById('inventory'),
        stats: document.getElementById('stats'),
        quests: document.getElementById('quest-journal-container'),
        controls: document.getElementById('controls-menu'),
        mainmenu: document.getElementById('mainmenu'),
      };

      this._userProfile = {
        userProfile: document.getElementById('health-ui'),
        ingamemenu: document.getElementById('ingamemenu')
      };

      this._iconBar.inventory.onclick = (m) => { this._OnInventoryClicked(m); };
      this._iconBar.stats.onclick = (m) => { this._OnStatsClicked(m); };
      this._iconBar.quests.onclick = (m) => { this._OnQuestsClicked(m); };
      this._iconBar.controls.onclick = (m) => {this._OnControlsClicked(m); };
      this._HideUI();
      this._OnControlsClicked({}); // show controls on new game
    }

    AddQuest(quest) {
      if (quest.id in this._quests) {
        return;
      }

      const e = document.createElement('DIV');
      e.className = 'quest-entry';
      e.id = 'quest-entry-' + quest.id;
      e.innerText = quest.title;
      e.onclick = (evt) => {
        this._OnQuestSelected(quest.id);
      };
      document.getElementById('quest-journal').appendChild(e);

      this._quests[quest.id] = quest;
      this._OnQuestSelected(quest.id);
    }

    _OnQuestSelected(id) {
      const quest = this._quests[id];
      console.log(id);
      console.log(quest);
      const e = document.getElementById('quest-ui');

      // get this as config from bg
      const newbg = '/bg/images/' + Math.ceil(Math.random() * 58) + '.jpg';
      // const newbg = '/bg/images/' + Math.ceil( parseInt(id) %  58) + '.jpg'; // will be same for the quest... for its lessons and challenges
      // console.log(newbg);
      e.style.backgroundImage =  "url(" + newbg + ")";
      
      e.style.visibility = '';

      const qtitle = document.getElementById('quest-text-title');
      qtitle.innerText = quest.title;

      const qtext = document.getElementById('quest-text');
      qtext.innerText = quest.text + "\n\nObjective: " + quest.objective;

      // const qoptions = document.getElementById('quest-options');
      // qoptions.innerHTML = quest.questOptions;

      this._HideUI();
    }

    _HideUI() {
      this._ui.inventory.style.visibility = 'hidden';
      this._ui.stats.style.visibility = 'hidden';
      this._ui.quests.style.visibility = 'hidden';
      this._ui.controls.classList.add("hide");
    }
    
    _OnQuestsClicked(msg) {
      const visibility = this._ui.quests.style.visibility;
      this._HideUI();
      this._ui.quests.style.visibility = (visibility ? '' : 'hidden');
    }

    _OnStatsClicked(msg) {
      const visibility = this._ui.stats.style.visibility;
      this._HideUI();
      this._ui.stats.style.visibility = (visibility ? '' : 'hidden');
    }

    _OnInventoryClicked(msg) {
      const visibility = this._ui.inventory.style.visibility;
      this._HideUI();
      this._ui.inventory.style.visibility = (visibility ? '' : 'hidden');
    }

    _OnControlsClicked(msg) {
      const hidden = this._ui.controls.classList.contains("hide");
      this._HideUI();
      if (hidden) this._ui.controls.classList.remove("hide");
      else this._ui.controls.classList.add("hide");
    }

    _OnLifeClicked(msg) {
      this._ui.mainmenu.classList.remove('hide');
    }

    Update(timeInSeconds) {
    }
  };

  return {
    UIController: UIController,
  };

})();
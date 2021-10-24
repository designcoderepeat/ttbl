var identities = ["your highness", "your royal majesty", "your honor", "your majesty", "your grace", "my lord", "your excellency", "your mightiness", "my king", "my ruler", "my emperor", "king of kings", "my king", "my knight", "king", "winner"];

export const game_consts = (() => {




    class GameConstants {
      constructor() {
        this._ids = 0;
        this._entitiesMap = {};
        this._entities = [];
      }
  
      _GenerateName() {
        this._ids += 1;
  
        return '__name__' + this._ids;
      }
  
      Get(n) {
        return this._entitiesMap[n];
      }
  
      Filter(cb) {
        return this._entities.filter(cb);
      }
  
      Add(e, n) {
        if (!n) {
          n = this._GenerateName();
        }
  
        this._entitiesMap[n] = e;
        this._entities.push(e);
  
        e.SetParent(this);
        e.SetName(n);
      }
  
      SetActive(e, b) {
        const i = this._entities.indexOf(e);
        if (i < 0) {
          return;
        }
  
        this._entities.splice(i, 1);
      }
  
      Update(timeElapsed) {
        for (let e of this._entities) {
          e.Update(timeElapsed);
        }
      }
    }
  
    return {
      EntityManager: EntityManager
    };
  
  })();
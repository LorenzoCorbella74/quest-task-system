import { Quest } from "./Quest";
import { STATUS } from "./models";

export class QuestsManager {
  quests: { [key: string]: Quest } = {};
  history: { [key: string]: Partial<Quest> } = {};
  activeQuest: Quest;

  add(quest: Quest) {
    if (!this.quests[quest.id]) {
      this.quests[quest.id] = null;
    }
    this.quests[quest.id] = quest;
    quest.manager = this;
  }

  selectActiveQuest(questId: string) {
    this.activeQuest = this.quests[questId];
  }

  startAciveQuest() {
    this.activeQuest.start();
  }

  /**
   *  L'idea è controllare tutte le quest in stato RUNNING e non soltanto quella attiva ???? NO
   *  -> il player con le sue azioni influisce solo sulla quest attiva  quindi non ci sarà
   *  modifiche alle altre quest. Se nei task avviene qualcosa quando si deve "ricalcolare"
   * gli effetti sui task di altre quest ???? quando il task è completato?. E'un singolo task
   * che cambia le sorti di altri task (e quindi di altre quest) o una successione di questi??
   */
  update() {
    if (this.activeQuest) {
      this.activeQuest.checkNodes();
      if (this.activeQuest.status === STATUS.COMPLETED) {
        const { path, title } = this.activeQuest;
        this.history[this.activeQuest.id] = { path, title };
        this.activeQuest = null;
      }
    }
  }
}

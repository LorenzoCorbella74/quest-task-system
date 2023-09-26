import { Quest } from "./Quest";
import { STATUS } from "./models";

export class QuestsManager {
  quests: { [key: string]: Quest } = {};                      // dictionary di tutte le quest
  completedQuests: { [key: string]: Partial<Quest> } = {};    // dictionary di quest completate
  cancelledQuests: { [key: string]: Partial<Quest> } = {};    // dictionary di quest cacellate
  activeQuests: Quest[] = [];

  add(quest: Quest) {
    if (!this.quests[quest.id]) {
      this.quests[quest.id] = null;
    }
    this.quests[quest.id] = quest;
    quest.manager = this;
  }

  addToActiveQuests(questId: string) {
    this.quests[questId].start();
    this.activeQuests.push(this.quests[questId]);
  }

  removeFromActiveQuests(questId: string) {
    this.activeQuests.filter(quest => quest.id !== questId);
  }

  /**
   *  L'idea è controllare tutte le quest in stato RUNNING e non soltanto quella attiva ???? NO
   *  -> il player con le sue azioni influisce solo sulla quest attiva  quindi non ci sarà
   *  modifiche alle altre quest. Se nei task avviene qualcosa quando si deve "ricalcolare"
   * gli effetti sui task di altre quest ???? quando il task è completato?. E'un singolo task
   * che cambia le sorti di altri task (e quindi di altre quest) o una successione di questi??
   * 
   * A MENO CHE I TASK POSSANO ANDARE IN PARALLELO QUANDO NON POSSONO INFLUIRE L'UNO SU L'ALTRO
   * (quindi non interressano gli stessi NPC/oggetti)
   */
  update() {
    for (let i = 0; i < this.activeQuests.length; i++) {
      const activeQuest = this.activeQuests[i];
      activeQuest.checkNodes();
    }
  }

  putCompletedQuestInHistory(quest: Quest) {
    const { completedTasks, title, } = quest;
    this.completedQuests[quest.id] = { completedTasks, title };
    // rimuove la quest dalla lista delle attive
    this.removeFromActiveQuests(quest.id);
  }

  manageOtherQuestsIfRequirementsAreMet(quest: Quest) {
    for (const questId in this.quests) {
      if (Object.prototype.hasOwnProperty.call(this.quests, questId)) {
        const quest = this.quests[questId];
        if (quest.requirements.toUnblock.questId === quest.id) {
          quest.status = STATUS.NOT_YET_STARTED;
        }
        let completedTasksIds = quest.completedTasks.map(task => task.id);
        if (completedTasksIds.includes(quest.requirements.toUnblock.taskId)) {
          quest.status = STATUS.NOT_YET_STARTED;
        }
        /* if(player.level >= quest.requirements.level) {
          quest.status = STATUS.NOT_YET_STARTED;
        } */
        if (quest.requirements.toCancel.questId === quest.id) {
          quest.status = STATUS.CANCELLED;
        }
        if (completedTasksIds.includes(quest.requirements.toCancel.taskId)) {
          quest.status = STATUS.CANCELLED;
        }
      }
    }
  }

  /**
  * Calculates the reward earned by the player when the quest is completed.
  * @return {Record<string, number>} - A dictionary of skill rewards earned by the player.
  */
  calculateReward(quest: Quest): { [key: string]: number } {
    let total = quest.completedTasks.reduce((acc, task) => {
      console.log(`In task ${task.key} you have earned XP points!:`, task.rewards);
      return { ...acc, ...task.rewards }
    }, {}); // TODO: qua ci dovrebbe essere un dizionario di skill del player
    return total;
  }


}

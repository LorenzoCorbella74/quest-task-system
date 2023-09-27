import { Task } from "./Task";
import { QuestsManager } from "./QuestsManager";
import { QuestRequirements, STATUS } from "./models";
import { NodeType } from "./models";
import { Graph } from "./Graph";

/**
 * Gestisce la singola quest:
 * - generazione dei suoi task
 * - controllo del suo stato
 */
export class Quest extends Graph<Task> {
  private _id: string;
  currentNodes: Task[] = [];
  status: STATUS = STATUS.BLOCKED;  // stato della quest
  completedTasks: Task[] = [];      // path di task eseguiti con successo
  manager: QuestsManager;

  requirements: {
    toUnblock?: QuestRequirements,
    toCancel?: QuestRequirements,
    level?: number
  } = {};

  constructor(public title: string = "") {
    super();
    this.id = title.replace(/ /g, "_");
  }

  get id() {
    return this._id;
  }

  public set id(str: string) {
    this._id = str.replace(/ /g, "_");
  }

  start() {
    this.status = STATUS.RUNNING;
    this.currentNodes[0] = this.nodes.find((x) => x.type === NodeType.START);
    this.setTasksStatus(STATUS.RUNNING);
  }

  /**
 * Check the nodes and perform necessary actions based on the node status.
 *
 * @return {void} This function does not return a value.
 */
  checkNodes() {
    if (this.status === STATUS.COMPLETED) return;
    if (this.status === STATUS.RUNNING) {
      for (let i = 0; i < this.currentNodes.length; i++) {
        const currentTask = this.currentNodes[i];
        // console.log(currentTask);
        if (currentTask.type === NodeType.END) {
          currentTask.setStatus(STATUS.COMPLETED);
          this.completedTasks.push(currentTask);
          this.status = STATUS.COMPLETED;
          this.onQuestCompleted()
          break;
        }
        if (currentTask.checkIfCompleted()) {
          currentTask.setStatus(STATUS.COMPLETED);
          this.completedTasks.push(currentTask);
          this.currentNodes = this.getNext(currentTask.key);
          this.setTasksStatus(STATUS.RUNNING);
          break;
        }
      }
    }
  }

  /**
 * Set the status of all current nodes to the specified status.
 *
 * @param {STATUS} status - The status to set for all current nodes.
 * @return {void} This function does not return anything.
 */
  private setTasksStatus(status: STATUS): void {
    this.currentNodes.forEach((element) => {
      element.setStatus(status);
    });
  }

  onQuestCompleted() {
    this.manager.calculateReward(this);
    this.manager.putCompletedQuestInHistory(this);
    this.manager.manageOtherQuestsIfRequirementsAreMet(this);
  }
}

import { Task } from "./task";
import { QuestsManager } from "./QuestsManager";
import { STATUS } from "./models";
import { TypeOfInteration, NodeType } from "./models";
import { Graph } from "./Graph";

/**
 * Gestisce la singola quest:
 * - generazione dei suoi task
 * - controllo del suo stato
 */
export class Quest extends Graph<Task> {
  private _id: string;
  currentNodes: Task[] = [];
  status: STATUS = STATUS.NOT_YET_STARTED;
  path: Task[] = []; // path di task eseguiti con successo
  manager: QuestsManager;

  constructor(public title: string = "") {
    super();
    this.id = title;
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

  checkNodes() {
    if (this.status === STATUS.COMPLETED) return;
    if (this.status === STATUS.RUNNING) {
      for (let i = 0; i < this.currentNodes.length; i++) {
        const currentTask = this.currentNodes[i];
        // console.log(currentTask);
        if (currentTask.type === NodeType.END) {
          currentTask.status = STATUS.COMPLETED;
          this.path.push(currentTask);
          this.status = STATUS.COMPLETED;
          this.calculateReward();
          break;
        }
        if (currentTask.checkIfComplete()) {
          currentTask.status = STATUS.COMPLETED;
          this.path.push(currentTask);
          this.currentNodes = this.getNext(currentTask.key);
          this.setTasksStatus(STATUS.RUNNING);
          break;
        }
      }
    }
  }

  private setTasksStatus(status: STATUS): void {
    this.currentNodes.forEach((element) => {
      element.status = status;
      if (element.typeOfInteration === TypeOfInteration.DIALOGUE) {
        element.dialogue.setStatus(STATUS.RUNNING);
      }
    });
  }

  private calculateReward(): number {
    let total = this.path.reduce((acc, task) => acc + task.points, 0);
    console.log(`You have earned ${total} XP points!.`);
    return total;
  }
}

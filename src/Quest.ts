import { Task } from "./Task";
import { QuestsManager } from "./QuestsManager";
import { PossibleTasks, QuestRequirements, STATUS, TypeOfInteration } from "./models";
import { NodeType } from "./models";
import { Graph } from "./Graph";
import { CollectTask } from "./tasks/collect";
import { DeliveryTask } from "./tasks/delivery";
import { DialogueTask } from "./tasks/dialogue";
import { EscortTask } from "./tasks/escort";
import { Entity } from "./entity";

/**
 * Gestisce la singola quest:
 * - generazione dei suoi task
 * - controllo del suo stato
 */
export class Quest extends Graph<PossibleTasks> {
  private _id: string;
  currentNodes: PossibleTasks[] = [];
  status: STATUS = STATUS.BLOCKED;  // stato della quest
  completedTasks: PossibleTasks[] = [];      // path di task eseguiti con successo
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

  override addNode(task: PossibleTasks) {
    this.nodes.push(task);
    task.quest = this;
  }

  start() {
    this.status = STATUS.RUNNING;
    this.currentNodes[0] = this.nodes.find((x) => x.type === NodeType.START);
    this.setTasksStatus(STATUS.RUNNING);
  }

  /** 
   * TODO:
   * Controlla se il giocatore sta interagendo con una entity
   * e tale entity è la stessa entity del task
  */
  playerIsInteractingWith(entity: Entity): boolean {
    return true;
  }

  checkIfCompleted() {
    for (let id = 0; id < this.currentNodes.length; id++) {
      const task = this.currentNodes[id];
      if (this.playerIsInteractingWith(task.entity)) {
        if (task.typeOfInteration === TypeOfInteration.COLLECT) {
          (task as CollectTask).wasFound = true
        }
        if (task.typeOfInteration === TypeOfInteration.DELIVERY) {
          // TODO: si deve controllare che l'entità interagisce con il player
          // ma anche che si possiede l'oggetto da consegnare
          (task as DeliveryTask).wasDelivered = true
        }
        if (task.typeOfInteration === TypeOfInteration.ESCORT) {
          // TODO: si controlla se l'entità ha raggiunto la destinazione
          (task as EscortTask).wasEscorted = true
        }
        if (task.typeOfInteration === TypeOfInteration.DIALOGUE) {
          // dipende dalle scelte dell'utente che
          // setta wasCompleted a true
        }
        if (task.typeOfInteration === TypeOfInteration.FIGHT) {
          // dipende dalla hp dell'entity
        }
        this.checkNodes();
      }
    }
  }

  /**
 * Check the nodes and perform necessary actions based on the node status.
 *
 */
  checkNodes(): void {
    if (this.status === STATUS.COMPLETED_WITH_SUCCESS) return;
    if (this.status === STATUS.RUNNING) {
      for (let i = 0; i < this.currentNodes.length; i++) {
        const currentTask = this.currentNodes[i];
        // console.log(currentTask);
        if (currentTask.checkIfCompletedSuccesfully()) {
          this.completedTasks.push(currentTask);
          if (currentTask.type === NodeType.END) {
            this.status = STATUS.COMPLETED_WITH_SUCCESS;
            this.onQuestCompleted()
            break;
          } else {
            this.currentNodes = this.getNext(currentTask.key).filter(task => task.flow === "POSITIVE");
            this.setTasksStatus(STATUS.RUNNING);
          }
        }
        if (currentTask.checkIfCompletedWithFailure()) {
          // facciamo che il task che può fallire non può mai essere l'ultimo task
          // e che la quest può essere completata anche se dei task sono falliti
          this.currentNodes = this.getNext(currentTask.key).filter(task => task.flow === "NEGATIVE");
          this.setTasksStatus(STATUS.RUNNING);
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
    this.manager.updateOtherQuestsIfRequirementsAreMet(this);
  }
}

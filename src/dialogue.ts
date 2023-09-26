import { v4 as uuidv4 } from "uuid";
import { Graph } from "./Graph";
import { STATUS, NodeType } from "./models";

type Option = {
  text: string; // testo dell'opzione
  checked: boolean; // se è già stata visitata
  link: DialogueNode; // nodo di arrivo
  key: string; // riferimento al nodo di partenza
};

export class DialogueNode {
  id: string;
  type: NodeType;
  key: string; // il testo è la chiave
  options: Option[];
  constructor() {
    this.id = uuidv4();
  }
  addOption(option: Option) {
    this.options.push(option);
  }
}

/**
 * Le azioni in UI definiscono lo stato del dialogo
 */
export class Dialogue extends Graph<DialogueNode> {
  id: string;
  status: STATUS;
  currentNode: DialogueNode;
  constructor() {
    super();
    this.id = uuidv4();
    this.status = STATUS.NOT_YET_STARTED;
  }

  setStatus(status: STATUS) {
    this.status = status;
  }

  start() {
    this.status = STATUS.RUNNING;
    this.currentNode = this.nodes.find((x) => x.type === NodeType.START);
  }

  checkTasks() {
    if (this.status === STATUS.COMPLETED) return;
    if (this.status === STATUS.RUNNING) {
      // console.log(currentTask);
      if (this.currentNode.type === NodeType.END) {
        this.status = STATUS.COMPLETED;
        return true;
      }
      return false;
    }
  }

  checkIfDialogueIsCompleted(taskId: string): boolean {
    if (this.status === STATUS.RUNNING) {
      // TODO
      return true;
    }
    return false;
  }
}

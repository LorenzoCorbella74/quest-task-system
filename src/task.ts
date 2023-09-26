import { Entity } from "./entity";
import { STATUS, TypeOfInteration, NodeType, PlayerSkills, QuestTask } from "./models";
import { v4 as uuidv4 } from "uuid";

export class Task implements QuestTask {
  id: string;
  status: STATUS;
  description: string = "Questo è un task TODO";

  // l'idea è di avere punti 1) generali 2)per singola skill del giocatore
  rewards: PlayerSkills /* = {
    "skill1": 1,
    "skill2": 1
  }; */

  constructor(
    public key: string, // è il name
    public entity: Entity, // entità con cui si interagisce
    public typeOfInteration: TypeOfInteration,
    public type: NodeType = NodeType.NODE
  ) {
    this.id = uuidv4();
    this.status = STATUS.NOT_YET_STARTED;
  }

  get isCompleted(): boolean {
    return this.status === STATUS.COMPLETED;
  }

  checkIfCompleted() {
    if (this.status === STATUS.RUNNING) {
      return this.isCompleted;
    }
  }

  // TODO: SERVE ?????
  onComplete(): void {
    console.log(`Task "${this.key}" completato.`);
  }
}

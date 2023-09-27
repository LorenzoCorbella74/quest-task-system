import { Entity } from "./entity";
import { STATUS, TypeOfInteration, NodeType, PlayerSkills, QuestTask } from "./models";
import { v4 as uuidv4 } from "uuid";

export class Task implements QuestTask {
  id: string;
  private status: STATUS;

  // l'idea è di avere punti da aggiungere per singola skill del giocatore
  /*rewards: PlayerSkills  = {
    "skill1": 1,
    "skill2": 1
  }; */

  constructor(
    public type: NodeType = NodeType.NODE,
    public key: string,         // è il name
    public description: string,  // description
    public entity: Entity, // entità con cui si interagisce
    public typeOfInteration: TypeOfInteration,
    public rewards: PlayerSkills = {}
  ) {
    this.id = uuidv4();
    this.status = STATUS.NOT_YET_STARTED;
  }

  setStatus(status: STATUS) {
    this.status = status;
  }

  get isCompleted(): boolean {
    return this.status === STATUS.COMPLETED;
  }

  checkIfCompleted() {
    return this.isCompleted;
  }
}

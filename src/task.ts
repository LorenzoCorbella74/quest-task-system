import { Graph } from "./Graph";
import { Quest } from "./Quest";
import { Entity } from "./entity";
import { STATUS, TypeOfInteration, NodeType, PlayerSkills, QuestTask, FlowType } from "./models";
import { v4 as uuidv4 } from "uuid";

export class Task implements QuestTask {
  id: string;
  quest: Quest;  // la quest a cui appartiene il task
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
    // public descriptionAfterCompletion:string, // description dopo che il task è stato completato
    public entity: Entity, // entità con cui si interagisce
    public typeOfInteration: TypeOfInteration,
    public rewards: PlayerSkills = {},
    public flow: FlowType = 'POSITIVE'
  ) {
    this.id = uuidv4();
    this.status = STATUS.NOT_YET_STARTED;
  }

  setStatus(status: STATUS) {
    this.status = status;
  }

  checkIfCompletedSuccesfully() {
    return this.status === STATUS.COMPLETED_WITH_SUCCESS;
  }

  checkIfCompletedWithFailure() {
    return this.status === STATUS.COMPLETED_WITH_FAILURE;
  }

}

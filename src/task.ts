import { Entity } from "./entity";
import { STATUS, TypeOfInteration, NodeType } from "./models";
import { v4 as uuidv4 } from "uuid";
import { Dialogue } from "./dialogue";

export class Task {
  id: string;
  status: STATUS;
  description: string = "Questo è un task TODO";

  constructor(
    public key: string, // è il name
    public entity: Entity, // entità con cui si interagisce
    public typeOfInteration: TypeOfInteration,
    public type: NodeType = NodeType.NODE,
    public points: number = 10, // punti guadagnati dal singolo task
    public dialogue?: Dialogue
  ) {
    this.id = uuidv4();
    this.status = STATUS.NOT_YET_STARTED;
    this.linkTaskToEntity(entity, typeOfInteration);
  }

  private linkTaskToEntity(
    entity: Entity,
    typeOfInteration: TypeOfInteration,
    dialogue?: Dialogue
  ) {
    this.entity = entity;
    this.entity.registerTaskAssociation(this.id, typeOfInteration);
    if (dialogue) {
      this.dialogue = dialogue;
    }
  }

  checkIfComplete() {
    if (this.status === STATUS.RUNNING) {
      if (this.typeOfInteration === TypeOfInteration.DIALOGUE) {
        return (
          this.dialogue && this.dialogue.checkIfDialogueIsCompleted(this.id)
        );
      } else {
        return this.entity.checkIfTaskIteractionIsComplete(this.id);
      }
    }
    return false;
  }
}

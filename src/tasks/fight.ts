import { Task } from "../Task";
import { Entity } from "../entity";
import { NodeType, STATUS, TypeOfInteration } from "../models";

export class KillTask extends Task {

    constructor(
        type: NodeType,
        name: string,
        description: string,
        entity: Entity,
    ) {
        super(type, name, description, entity, TypeOfInteration.FIGHT);
    }

    checkIfCompleted() {
        if (this.entity['health'] <= 0) {
            this.setStatus(STATUS.COMPLETED);
        }
        return super.checkIfCompleted()
    }

}
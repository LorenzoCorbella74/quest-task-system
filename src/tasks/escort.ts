import { Task } from "../Task";
import { Entity } from "../entity";
import { NodeType, TypeOfInteration, STATUS } from "../models";

export class EscortTask extends Task {
    constructor(
        type: NodeType,
        name: string,
        description: string,
        entity: Entity,
        public location: { x: number; y: number }
    ) {
        super(type, name, description, entity, TypeOfInteration.ESCORT);
    }

    checkIfCompleted() {
        if (this.entity['wasEscorted']) {
            this.setStatus(STATUS.COMPLETED);
        }
        return super.checkIfCompleted()
    }
}
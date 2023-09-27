import { Task } from "../Task";
import { Entity } from "../entity";
import { NodeType, TypeOfInteration, STATUS } from "../models";

export class CollectTask extends Task {

    constructor(
        type: NodeType,
        name: string,
        description: string,
        entity: Entity,         // l'item da trovare
    ) {
        super(type, name, description, entity, TypeOfInteration.COLLECT);
    }

    checkIfCompleted() {
        if (this.entity['wasFound']) {
            this.setStatus(STATUS.COMPLETED);
        }
        return super.checkIfCompleted()
    }
}
import { Task } from "../Task";
import { Entity } from "../entity";
import { NodeType, TypeOfInteration } from "../models";

export class EscortTask extends Task {
    wasEscorted: boolean = false;
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
        return this.wasEscorted;
    }
}
import { Task } from "../Task";
import { Entity } from "../entity";
import { NodeType, TypeOfInteration } from "../models";

export class CollectTask extends Task {

    wasFound: boolean = false

    constructor(
        type: NodeType,
        name: string,
        description: string,
        entity: Entity,         // l'item da trovare
    ) {
        super(type, name, description, entity, TypeOfInteration.COLLECT);
    }

    checkIfCompleted() {
        return this.wasFound
    }
}
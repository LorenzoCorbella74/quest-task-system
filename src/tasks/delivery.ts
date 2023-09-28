import { Task } from "../Task";
import { Entity } from "../entity";
import { NodeType, TypeOfInteration } from "../models";

export class DeliveryTask extends Task {

    wasDelivered: boolean = false;
    constructor(
        type: NodeType,
        name: string,
        description: string,
        entity: Entity,
        public object: Entity // l'item da consegnare ad "entity"
    ) {
        super(type, name, description, entity, TypeOfInteration.DELIVERY);
    }

    checkIfCompleted() {
        return this.wasDelivered
    }
}
import { Task } from "../Task";
import { Entity } from "../entity";
import { NodeType, TypeOfInteration, STATUS } from "../models";

export class DeliveryTask extends Task {
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
        if (this.object['wasDelivered']) {
            this.setStatus(STATUS.COMPLETED);
        }
        return super.checkIfCompleted()
    }
}
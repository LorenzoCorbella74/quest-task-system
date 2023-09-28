import { Task } from "../Task";
import { Entity } from "../entity";
import { FlowType, NodeType, PlayerSkills, STATUS, TypeOfInteration } from "../models";

export class DeliveryTask extends Task {

    wasDelivered: boolean = false;
    constructor(
        type: NodeType,
        name: string,
        description: string,
        entity: Entity,
        public object: Entity,// l'item da consegnare ad "entity"
        public rewards: PlayerSkills = {},
        public flow: FlowType = 'POSITIVE'
    ) {
        super(type, name, description, entity, TypeOfInteration.DELIVERY, rewards, flow);
    }

    checkIfCompletedSuccesfully() {
        if (this.wasDelivered) {
            this.setStatus(STATUS.COMPLETED_WITH_SUCCESS);
        }
        return super.checkIfCompletedSuccesfully()
    }
}
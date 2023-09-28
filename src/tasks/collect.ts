import { Task } from "../Task";
import { Entity } from "../entity";
import { FlowType, NodeType, PlayerSkills, STATUS, TypeOfInteration } from "../models";

export class CollectTask extends Task {

    wasFound: boolean = false

    constructor(
        public type: NodeType,
        public name: string,
        public description: string,
        public entity: Entity,         // l'item da trovare
        public rewards: PlayerSkills = {},
        public flow: FlowType = 'POSITIVE'
    ) {
        super(type, name, description, entity, TypeOfInteration.COLLECT, rewards, flow);
    }

    checkIfCompletedSuccesfully() {
        if (this.wasFound) {
            this.setStatus(STATUS.COMPLETED_WITH_SUCCESS);
        }
        return super.checkIfCompletedSuccesfully()
    }
}
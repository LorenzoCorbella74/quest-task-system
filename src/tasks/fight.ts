import { Task } from "../Task";
import { Entity } from "../entity";
import { FlowType, NodeType, PlayerSkills, STATUS, TypeOfInteration } from "../models";

export class KillTask extends Task {

    constructor(
        public type: NodeType,
        public name: string,
        public description: string,
        public entity: Entity,
        public rewards: PlayerSkills = {},
        public flow: FlowType = 'POSITIVE'
    ) {
        super(type, name, description, entity, TypeOfInteration.FIGHT, rewards, flow);
    }

    checkIfCompletedSuccesfully() {
        if (this.entity['health'] <= 0) {
            this.setStatus(STATUS.COMPLETED_WITH_SUCCESS);
        }
        return super.checkIfCompletedSuccesfully()
    }

}
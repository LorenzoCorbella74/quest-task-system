import { Task } from "../Task";
import { Entity } from "../entity";
import { FlowType, NodeType, PlayerSkills, STATUS, TypeOfInteration } from "../models";

export class EscortTask extends Task {
    wasEscorted: boolean = false;
    constructor(
        type: NodeType,
        name: string,
        description: string,
        entity: Entity,
        public rewards: PlayerSkills = {},
        public flow: FlowType = 'POSITIVE',
        public location: { x: number; y: number }
    ) {
        super(type, name, description, entity, TypeOfInteration.ESCORT, rewards, flow);
    }
    checkIfCompletedSuccesfully() {
        if (this.wasEscorted) {
            this.setStatus(STATUS.COMPLETED_WITH_SUCCESS);
        }
        return super.checkIfCompletedSuccesfully()
    }
}
export enum TypeOfInteration {
  FIGHT = "FIGHT",
  GATHER = "GATHER",
  DIALOGUE = "DIALOGUE",
  ESCORT = "ESCORT",
  DELIVERY = "DELIVERY"
}

export enum STATUS {
  "BLOCKED" = "BLOCKED",
  "NOT_YET_STARTED" = "NOT_YET_STARTED",
  "RUNNING" = "RUNNING",
  "COMPLETED" = "COMPLETED",
  "CANCELLED" = "CANCELLED"
}

export enum NodeType {
  "NODE" = "NODE",
  "DIALOGUE" = "DIALOGUE",
  "START" = "START",
  "END" = "END"
}

// write a list of skills for a player
export type PlayerSkills = {
  [key: string]: number
}

// Interfaccia per i task
export interface QuestTask {
  checkIfCompleted(): boolean;
  onComplete(): void;
}

export type QuestRequirements = {
  questId: string,
  taskId: string
}

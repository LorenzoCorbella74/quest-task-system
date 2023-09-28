import { CollectTask } from "./tasks/collect";
import { DeliveryTask } from "./tasks/delivery";
import { DialogueTask } from "./tasks/dialogue";
import { EscortTask } from "./tasks/escort";
import { KillTask } from "./tasks/fight";

export enum TypeOfInteration {
  FIGHT = "FIGHT",
  COLLECT = "COLLECT",
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
}

export type QuestRequirements = {
  questId: string,
  taskId: string
}


export type PossibleTasks = CollectTask | EscortTask | DialogueTask | DeliveryTask | KillTask 

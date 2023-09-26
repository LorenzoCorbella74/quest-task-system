import { TypeOfInteration } from "./models";

/**
 * L'Entity può essere un NPC ma anche un ITEM, tutto ciò che
 * interagisce con il player durante le QUEST.
 */
export class Entity {
  taskAssociation: { [key: string]: TypeOfInteration } = {};
  // TODO
  counter: number = Math.ceil(Math.random() * 10);

  constructor(public name: string) {}

  /**
   * Associa l'entità ad una serie di task (ognuno di diverso tipo)
   * @param taskId indica il task a cui mandare il msg di avvenuto completamento
   * @param type  indica il tipo di task per definire il controllo
   */
  registerTaskAssociation(taskId: string, type: TypeOfInteration) {
    this.taskAssociation[taskId] = type;
  }

  checkInteration(interactionType: TypeOfInteration): boolean {
    console.log(`Interaction ${interactionType} with ${this.name}.`);

    /**
     * Implementata diversamente a seconda del tipo di interazione
     */
    this.counter--;
    return this.counter === 0;
  }

  checkIfTaskIteractionIsComplete(taskId: string): boolean {
    if (taskId in this.taskAssociation) {
      return this.checkInteration(this.taskAssociation[taskId]);
    }
    return false;
  }
}

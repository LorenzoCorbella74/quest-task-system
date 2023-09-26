import { v4 as uuidv4 } from "uuid";

/**
 * L'Entity può essere un NPC ma anche un ITEM, tutto ciò che
 * interagisce con il player durante le QUEST.
 */
export class Entity {

  id: string = uuidv4();

  constructor(public name: string) { }

}

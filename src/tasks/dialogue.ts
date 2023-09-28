import { Task } from "../Task";
import { Entity } from "../entity";
import { TypeOfInteration, NodeType, STATUS, FlowType, PlayerSkills } from "../models";

/**
 * Il testo che viene mostrato dovpo aver scelto una opzione
 */
export class Answer {
  options: null = null;
  constructor(public text: string) { }
}

/**
 * Mostra la domanda (ma può essere vuota) e tutte le opzioni di dialogo
 */
export class Question {
  constructor(public text: string | null, public options: DialogOption[] = []) { }
}

/**
 * Una opzione di dialogo può contenere a sua volta un'altra domanda o una risposta o anche niente (che esegue una funzione di output)
 * 
 */
export class DialogOption {
  wasChosen: boolean = false;

  constructor(
    public text: string,  // Opzione che appare a video
    public question: Question | Answer | null,
    public onOptionSelected?: (context: ThisType<DialogueTask>) => void
  ) { }
}


/* 
  Si completa quando l'utente esce dal dialogo o quando si seleziona una opzione di dialogo
  avente un onOptionSelected che NON setta lo stato del task a completato (per quello ci pensa la Quest)
  ma setta il flag del TASK wasCompleted a true
*/

export class DialogueTask extends Task {

  private currentNode: Question | Answer | null;
  private history: Question[] = [];

  wasCompleted: boolean = false;

  constructor(
    type: NodeType,
    name: string,
    description: string,
    entity: Entity,
    public rewards: PlayerSkills = {},
    public flow: FlowType = 'POSITIVE',
    private rootNode: Question
  ) {
    super(type, name, description, entity, TypeOfInteration.DIALOGUE, rewards, flow);
    this.currentNode = rootNode;
  }

  getCurrentNode(): Question | Answer | null {
    return this.currentNode;
  }

  getHistory() {
    return this.history;
  }

  isDialogueQuestion(
    node: Question | Answer | null
  ): node is Question {
    return node instanceof Question;
  }

  chooseOption(optionIndex: number): void {
    if (this.currentNode && this.isDialogueQuestion(this.currentNode)) {
      const chosenOption = this.currentNode?.options[optionIndex];
      if (chosenOption) {
        chosenOption.wasChosen = true;
        if (chosenOption.onOptionSelected) {
          chosenOption.onOptionSelected(this);  // si passa tutto il task
        }
        this.history.push(this.currentNode);
        this.currentNode = chosenOption.question;
      }
    }
  }

  returnToPreviousQuestion(): void {
    const previousQuestion = this.history.pop();
    if (previousQuestion) {
      this.currentNode = previousQuestion;
    }
  }

  reset(): void {
    this.currentNode = this.rootNode;
    this.history = [];
  }

  forceExit(status: STATUS): void {
    this.currentNode = null;
    this.history = [];
    this.setStatus(status);
  }

  /**
   * Dall'esterno si può decidere di cambiare un dialogo 
   * a seguito dell'esito di altri task/quest
   * @param newRootNode 
   */
  changeDialogTree(newRootNode: Question): void {
    this.rootNode = newRootNode;
    this.currentNode = this.rootNode;
    this.history = [];
  }
}


/*

Esempio di applicazione:

https://stackblitz.com/edit/stackblitz-starters-q5mvq2?file=src%2Fmain.ts


// Creare gli oggetti Answer e Question
const question1 = new Question("Cosa vuoi fare?", [
  new DialogOption("Comprare", new Question("Cosa desideri comprare?", [
    new DialogOption("Spada", new Answer("Hai acquistato una spada!"), () => {
      console.log("Hai scelto di comprare una spada.");
    }),
    new DialogOption("Pozioni", new Answer("Hai acquistato delle pozioni!"), () => {
      console.log("Hai scelto di comprare delle pozioni.");
    }),
  ])),
  new DialogOption("Torna indietro", null, () => {
    console.log("Hai scelto di tornare indietro.");
  }),
]);

const question2 = new Question("Come posso aiutarti?", [
  new DialogOption("Chi sei?", new Answer("Sono un mercante itinerante.")),
  new DialogOption("Cosa hai da vendere?", new Answer("Ho molte cose interessanti da mostrarti.")),
]);

// Inizializzare il DialogTree con la prima domanda
const dialogTree = new DialogTree(question1);

// Avanzare nel dialogo
dialogTree.chooseOption(0); // Scegli "Comprare"
dialogTree.chooseOption(0); // Scegli "Spada"
console.log(dialogTree.getCurrentNode().text); // Output: "Hai acquistato una spada!"

// Torna all'opzione precedente
dialogTree.returnToPreviousQuestion();
console.log(dialogTree.getCurrentNode().text); // Output: "Cosa vuoi fare?"

// Esegui l'evento onOptionSelected per l'opzione "Torna indietro"
dialogTree.chooseOption(1); // Scegli "Torna indietro"

// Uscire forzatamente dal dialogo
dialogTree.forceExit();
console.log(dialogTree.getCurrentNode()); // Output: null

// Cambiare l'albero del dialogo
dialogTree.changeDialogTree(question2);
console.log(dialogTree.getCurrentNode().text); // Output: "Come posso aiutarti?"


*/
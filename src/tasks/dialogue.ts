import { Task } from "../Task";
import { Entity } from "../entity";
import { TypeOfInteration, NodeType, STATUS } from "../models";

export class Answer {
  // TODO: oltre al testo ci può essere il file audio...
  constructor(public text: string) { }
}

export class Question {
  wasChosen: boolean = false;

  constructor(
    public text: string,
    public options: DialogOption[] = []
  ) { }
}

export class DialogOption {
  constructor(
    public text: string,
    public question: Question,
    public onChoose?: (context: ThisType<Task>) => void
  ) { }
}

export class DialogueTask extends Task {

  private currentNode: Question;
  private history: Question[] = [];

  constructor(
    type: NodeType,
    name: string,
    description: string,
    entity: Entity,
    private rootNode: Question
  ) {
    super(type, name, description, entity, TypeOfInteration.DIALOGUE);
    this.currentNode = rootNode;
  }

  getCurrentNode(): Question {
    return this.currentNode;
  }

  chooseOption(optionIndex: number): void {
    const chosenOption = this.currentNode.options[optionIndex];
    if (chosenOption) {
      if (chosenOption.onChoose) {
        chosenOption.onChoose(this); // Esegui l'evento onChoose se presente
      }
      this.history.push(this.currentNode);
      this.currentNode = chosenOption.question;
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

  forceExit(): void {
    this.currentNode = null;
    this.history = [];
    this.setStatus(STATUS.COMPLETED);
  }

  changeDialogTree(newRootNode: Question): void {
    this.rootNode = newRootNode;
    this.currentNode = this.rootNode;
    this.history = [];
  }


  /* 
  
    Finisce quando l'utente esce dal dialogo o quando si seleziona una opzione di dialogo
    avente un onChoose che setta lo stato del task a completato
  
  */

}


/*

Esempio di applicazione:

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

// Esegui l'evento onChoose per l'opzione "Torna indietro"
dialogTree.chooseOption(1); // Scegli "Torna indietro"

// Uscire forzatamente dal dialogo
dialogTree.forceExit();
console.log(dialogTree.getCurrentNode()); // Output: null

// Cambiare l'albero del dialogo
dialogTree.changeDialogTree(question2);
console.log(dialogTree.getCurrentNode().text); // Output: "Come posso aiutarti?"


*/
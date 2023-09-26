import "reflect-metadata";
import { Task } from "./task";
import { Entity } from "./entity";
import { Quest } from "./Quest";
import { QuestsManager } from "./QuestsManager";
import { TypeOfInteration, NodeType } from "./models";

/**
 * Esempio di verifica di singola quest
 */
let g = new Quest("La vendetta dello sciacallo");
g.addNode(
  new Task(
    "task1",
    new Entity("Alberto"),
    TypeOfInteration.FIGHT,
    NodeType.START
  )
);
g.addNode(
  new Task(
    "task2",
    new Entity("Actor2"),
    TypeOfInteration.GATHER,
    NodeType.NODE
  )
);
g.addNode(
  new Task(
    "task3",
    new Entity("Actor3"),
    TypeOfInteration.DIALOGUE,
    NodeType.NODE)
);
g.addNode(new Task("task4", new Entity("Actor4"), TypeOfInteration.GATHER));
g.addNode(
  new Task("task5", new Entity("Actor5"), TypeOfInteration.FIGHT, NodeType.END)
);
g.addNode(
  new Task(
    "task6",
    new Entity("Actor6"),
    TypeOfInteration.GATHER,
    NodeType.NODE
  )
);

g.addEdge("task1", "task2");
g.addEdge("task1", "task3");
g.addEdge("task2", "task3");
g.addEdge("task3", "task4");
g.addEdge("task4", "task5");
g.addEdge("task2", "task6");
g.addEdge("task6", "task5");

// console.log("Nodes", g.nodes);
// console.log("Edges", g.edges);
g.log();

const qm = new QuestsManager();
qm.add(g);
qm.addToActiveQuests(g.id);

qm.update();
qm.update();
qm.update();
qm.update();
qm.update();
qm.update();
qm.update();
qm.update();
qm.update();
qm.update();
qm.update();
qm.update();
qm.update();
qm.update();
qm.update();
qm.update();
qm.update();
qm.update();
qm.update();
qm.update();
qm.update();

console.log("All Nodes: ", g.nodes);
// console.log("Nodes PATH to success: ", g.path);
console.log("History: ", qm.completedQuests);

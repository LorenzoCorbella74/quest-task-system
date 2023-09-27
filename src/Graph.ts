import { Task } from "./Task";

export class Graph<T extends Task> {
  nodes: T[];
  edges: Map<string, { start: string; end: string }>; // collegamenti tra task

  constructor() {
    this.nodes = [];
    this.edges = new Map();
  }

  addNode(task: T) {
    this.nodes.push(task);
  }

  updateNode(task: T) {
    this.nodes = this.nodes.map((n) => (n.key === task.key ? task : n));
  }

  removeNode(key: string) {
    // remove the node
    this.nodes = this.nodes.filter((n) => n.key !== key);
    // remove the associated edges
    Array.from(this.edges.values()).forEach(({ start, end }) => {
      if (start === key || end === key) this.edges.delete(`${start}->${end}`);
    });
  }

  findNode(key: string) {
    return this.nodes.find((x) => x.key === key);
  }

  addEdge(start: string, end: string) {
    this.edges.set(`${start}->${end}`, { start, end });
  }
  removeEdge(start: string, end: string) {
    this.edges.delete(`${start}->${end}`);
  }
  // possono essere molti
  getNext(key: string): T[] {
    return Array.from(this.edges.values())
      .reduce((acc, { start, end }) => {
        if (start === key) (acc as Array<any>).push(end);
        return acc;
      }, [])
      .map((key) => this.findNode(key));
  }

  /* ---------------- UTILITY ---------------- */
  logEdges() {
    console.log("Edges: ", Array.from(this.edges.keys()));
  }
}

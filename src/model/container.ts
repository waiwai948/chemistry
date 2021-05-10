import Box from "./box";
import type { Config } from "./box";
import { Konva } from "../Konva";
import type Item from "./item";

export interface ContainerConfig extends Config {
  name: string;
  reaction: () => void;
  addItem: (item: Item) => void;
}

class Container extends Box {
  name: string;
  includes: Item[];
  condition: "normal" | "heating" | "shake" | "cooling";
  constructor(config: ContainerConfig) {
    super(config);
    this.name = config.name;
    this.includes = [];
    this.condition = "normal";
    this.reaction = config?.reaction;
    this.addItem = config?.addItem;
  }
  reaction() {
    console.log("发生反应了！");
  }
  addItem(item: Item) {
    this.includes.push(item);
    this.reaction();
  }
}

export default Container;

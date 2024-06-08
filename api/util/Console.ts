import { Timestamp } from "@skyra/timestamp";
import chalk from "chalk";

export class Console {
  template: Timestamp;

  constructor() {
    this.template = new Timestamp("DD/MM/YYYY @ HH:mm:ss");
  }

  get timestamp() {
    return this.template.display(new Date());
  }

  log(content: any, text?: string, color?: string) {
    color = color?.toLowerCase();
    text = text?.toUpperCase();

    if (text) {
      switch (color) {
        case "green":
          return console.log(`${this.timestamp} ${chalk.green(`[${text}]`)}`, content);
        case "blue":
          return console.log(`${this.timestamp} ${chalk.blue(`[${text}]`)}`, content);
        case "red":
          return console.log(`${this.timestamp} ${chalk.red(`[${text}]`)}`, content);
        case "pink":
          return console.log(`${this.timestamp} ${chalk.magentaBright(`[${text}]`)}`, content);
        case "yellow":
          return console.log(`${this.timestamp} ${chalk.yellowBright(`[${text}]`)}`, content);
        case "orange":
          return console.log(`${this.timestamp} ${chalk.yellow(`[${text}]`)}`, content);
        case "purple":
          return console.log(`${this.timestamp} ${chalk.magenta(`[${text}]`)}`, content);
        case "gray":
          return console.log(`${this.timestamp} ${chalk.gray(`[${text}]`)}`, content);
        case "white":
          return console.log(`${this.timestamp} ${chalk.white(`[${text}]`)}`, content);
        case "black":
          return console.log(`${this.timestamp} ${chalk.black(`[${text}]`)}`, content);
      }

      console.log(`${this.timestamp} [${text}]`, content);
    } else {
      console.log(`${this.timestamp} [LOG]`, content);
    }
  }

  default(...args: any[]) {
    console.log(...args);
  }

  debug(...args: any[]) {
    console.log(`${this.timestamp} ${chalk.blue("[DEBUG]")}`, ...args);
  }

  info(...args: any[]) {
    console.log(`${this.timestamp} ${chalk.green("[INFO]")}`, ...args);
  }

  warn(...args: any[]) {
    console.log(`${this.timestamp} ${chalk.yellow("[WARN]")}`, `${chalk.yellowBright(...args)}`);
  }

  error(...args: any[]) {
    console.log(`${chalk.red("[ERROR]")}`, ...args);
  }
}
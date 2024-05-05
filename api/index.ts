let begin = Date.now();
let end;

import { existsSync, readFileSync, writeFileSync } from "fs";
import { branch, date, long, short } from "git-rev-sync";
import os from "os";
import { join } from "path";
import API from "./server";
import { Console } from "../util/Console";
import { relativeTime } from "../util/Date";

const console = new Console();
const configExists = existsSync(join(__dirname + "/../" + "config.json"));

let cores = 1;

const relativeDate = relativeTime(date().toString());

try {
  cores = Number(process.env.THREADS) || os.cpus().length;
} catch {
  console.warn("Failed to get thread count! Using 1...");
}

console.default("██╗  ██╗██╗   ██╗██╗   ██╗███████╗██╗  ██╗")
console.default("██║  ██║██║   ██║██║   ██║██╔════╝██║  ██║")
console.default("███████║██║   ██║██║   ██║███████╗███████║")
console.default("██╔══██║██║   ██║██║   ██║╚════██║██╔══██║")
console.default("██║  ██║╚██████╔╝╚██████╔╝███████║██║  ██║")
console.default("╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝")
console.default(`huush | ${branch()} - ${short() || "unknown"} | Published ${relativeDate || "unknown time ago"}`);
console.default(`Environment: ${process.env.NODE_ENV || "development"}`); // NODE_ENV=XXXXX ts-node src/index.ts <-- set environment
console.default(`Commit Hash: ${long() || "unknown"}`);
console.default(`Cores: ${os.cpus().length} - Using ${cores} thread(s).`);
console.default(`Running Node.js ${process.version} on ${process.platform} ${process.arch}`);

console.info(`Starting in ${process.env.NODE_ENV || "development"} mode...`);

const port = Number(process.env.PORT) || 3008;
const host = process.env.HOST || "localhost";

console.log(`Worker ${process.pid} started`, "process", "red");
console.log(`Starting with ${cores} thread(s)`, "process", "red");

const server = new API({ port, host });
server
  .start()
  .catch(console.error)
  .then(() => {
    console.log("API server started!", "Server", "blue");
    console.log(`Started API server on ${host}:${port}`, "Server", "blue");
    end = Date.now();

    if (!end || !begin || end - begin < 0) {
      console.error("Failed to get start time!", "Process", "red");
    } else {
      console.log(`Started in ${end - begin}ms`, "Process", "red");
    }
  });
import { traverseDirectory } from "lambert-server";

const extension = Symbol.for("ts-node.register.instance") in process ? "ts" : "js";
const DEFAULT_FILTER = new RegExp("^([^.].*)(?<!.d).(" + extension + ")$");

function registerRoutes(server, root) {
  return traverseDirectory({ dirname: root, recursive: true, filter: DEFAULT_FILTER }, server.registerRoute.bind(server, root));
}

export { registerRoutes };
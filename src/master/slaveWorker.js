import { sendToWorker } from "../common/worker";

export const slaveWorker = new Worker("./slave.js");

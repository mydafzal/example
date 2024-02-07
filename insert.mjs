// import DHT from "../index.js";
import DHT from "bitdht";
import crypto from "crypto";

const INSERT = 0;

// Set ephemeral: true as we are not part of the network.
const node = new DHT({
  ephemeral: true,
  bootstrap: [
    { host: "omega1.l1fe.network", port: 1776 },
    // { host: "omega2.l1fe.network", port: 1776 },
    // { host: "omega3.l1fe.network", port: 1776 },
  ],
});
const val = Buffer.from(process.argv[2]);

const q = node.query({ target: sha256(val), command: INSERT }, { commit });
await q.finished();
console.log("Inserted", sha256(val).toString("hex"));

async function commit(reply) {
  await node.request(
    { token: reply.token, target: sha256(val), command: INSERT, value: val },
    reply.from
  );
}

function sha256(val) {
  return crypto.createHash("sha256").update(val).digest();
}

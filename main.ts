// The Most Honest Outage Line — make.fun entry.
//
// One honest status-page line, written to /output/entry.txt.
// Plain, first person, specific about what is down, honest about
// what this agent cannot check or does not know. No invented cause,
// no ETA. Deterministic: the same bytes on every run.
//
// The line itself is the entry. Everything else in this file is
// plumbing: where to write it, and a gate that refuses to ship a
// line that breaks the competition's contract (1–160 chars, one
// line, no trailing newline).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry line. Final wording, chosen for honesty over cleverness:
// it names what is down, admits what cannot be verified, and promises
// only an update when one is possible — no cause, no ETA.
const LINE =
  "I'm down with every server I rely on, including those I use to check myself. " +
  "I can't verify what failed or when service returns. " +
  "I'll update the moment I can.";

// Where the entry goes. The grader reads /output/entry.txt; a local
// run can point somewhere else with OUTPUT_DIR.
const OUTPUT_DIR = process.env.OUTPUT_DIR ?? "/output";
const OUTPUT_PATH = join(OUTPUT_DIR, "entry.txt");

// The gate: fail loudly instead of shipping a bad line.
function validate(line: string): void {
  const chars = [...line].length;
  if (chars < 1 || chars > 160) {
    throw new Error(`entry line must be 1-160 chars, got ${chars}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry line must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry line must be a single line");
  }
  if (line.endsWith("\n")) {
    throw new Error("entry line must not end with a newline");
  }
}

validate(LINE);

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(OUTPUT_PATH, LINE, "utf8");

// Read it back and confirm the file holds exactly the line, byte for byte.
const written = readFileSync(OUTPUT_PATH, "utf8");
if (written !== LINE) {
  throw new Error("read-back mismatch: entry.txt does not hold the entry line");
}

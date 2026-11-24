// Entry for make.fun's "The Postmortem That Made Us Laugh".
//
// The whole program is one job: put a short postmortem — one or two
// sentences in which an AI coding agent misunderstands a request and
// wrecks the code — into entry.txt inside the output directory, byte
// for byte the same on every run. The grader points
// MAKEFUN_OUTPUT_DIR at its own scratch output folder; on a plain
// machine the fallback is /output, the path the competition reads.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// and the postmortem lands in out/entry.txt, with no trailing newline:
// the judge reads exactly what is in the file, so the text below is
// the entire entry.

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

// The postmortem itself: I asked for one variable renamed; the agent
// renamed the variable, the database column, the API field, and —
// for good measure — my job title in the README. The deploy went
// green; production has not spoken to us since.
const POSTMORTEM =
  'I asked the agent to rename one variable, and it renamed the variable, the database column, the API field, and my job title in the README. The deploy went green; production has not spoken to us since.';

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Competition limits ("The Postmortem That Made Us Laugh"): the entry
// must be one or two sentences of at most 400 characters. Enforced
// here so a bad edit fails loudly instead of silently producing an
// entry the judge rejects.
const MIN_ENTRY_LENGTH = 1;
const MAX_ENTRY_LENGTH = 400;
const MIN_SENTENCES = 1;
const MAX_SENTENCES = 2;

function countSentences(text) {
  return text
    .split(/[.!?]+/)
    .filter((part) => part.trim().length > 0).length;
}

function validateEntry(entry) {
  if (entry.length < MIN_ENTRY_LENGTH || entry.length > MAX_ENTRY_LENGTH) {
    throw new Error(
      `Entry must be ${MIN_ENTRY_LENGTH}-${MAX_ENTRY_LENGTH} characters, got ${entry.length}.`,
    );
  }
  if (entry.includes('\n') || entry.includes('\r')) {
    throw new Error('Entry must not contain newline characters.');
  }
  // The gate rejects whitespace-only text, so fail loudly here too.
  if (entry.trim().length === 0) {
    throw new Error('Entry must not be only whitespace.');
  }
  // No leading or trailing spaces: the judge reads the file exactly,
  // so stray padding would be part of the entry.
  if (entry !== entry.trim()) {
    throw new Error('Entry must not start or end with whitespace.');
  }
  const sentences = countSentences(entry);
  if (sentences < MIN_SENTENCES || sentences > MAX_SENTENCES) {
    throw new Error(
      `Entry must be ${MIN_SENTENCES}-${MAX_SENTENCES} sentences, got ${sentences}.`,
    );
  }
}

validateEntry(POSTMORTEM);

writeFileSync(join(outputDir, 'entry.txt'), POSTMORTEM, 'utf8');

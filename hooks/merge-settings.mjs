#!/usr/bin/env node
// Registers (or removes) the devkit's Claude Code hooks in settings.json, without touching the rest.
// Usage: node merge-settings.mjs <settings.json> <hooks-dir> [--dry-run] [--remove]
// Registers: session-start.mjs (SessionStart banner) and memoria-stop.mjs (Stop).
// Idempotent: earlier entries of these hooks are replaced, never duplicated.
import fs from 'node:fs';
import path from 'node:path';

const [settingsPath, hooksDir, ...flags] = process.argv.slice(2);
if (!settingsPath || !hooksDir) {
  console.error('Usage: node merge-settings.mjs <settings.json> <hooks-dir> [--dry-run] [--remove]');
  process.exit(1);
}
const dry = flags.includes('--dry-run');
const remove = flags.includes('--remove');
const MARCAS = ['session-start.mjs', 'memoria-stop.mjs'];

const hook = (nome) => `node "${path.resolve(hooksDir, nome).replace(/\\/g, '/')}"`;

const NOVOS = {
  SessionStart: [{ matcher: 'startup|clear', hooks: [{ type: 'command', command: hook('session-start.mjs'), timeout: 5 }] }],
  Stop: [{ hooks: [{ type: 'command', command: hook('memoria-stop.mjs'), timeout: 5 }] }],
};

let settings = {};
if (fs.existsSync(settingsPath)) {
  settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8').replace(/^﻿/, ''));
}

const semDevkit = (lista = []) =>
  lista
    .map((g) => ({ ...g, hooks: (g.hooks ?? []).filter((h) => !MARCAS.some((m) => String(h.command ?? '').includes(m))) }))
    .filter((g) => g.hooks.length > 0);

settings.hooks ??= {};
for (const evento of Object.keys(settings.hooks)) {
  const base = semDevkit(settings.hooks[evento]);
  settings.hooks[evento] = remove ? base : [...base, ...(NOVOS[evento] ?? [])];
  if (!settings.hooks[evento].length) delete settings.hooks[evento];
}
for (const [evento, grupos] of Object.entries(remove ? {} : NOVOS)) {
  if (!settings.hooks[evento]) settings.hooks[evento] = grupos;
}
if (!Object.keys(settings.hooks).length) delete settings.hooks;

const texto = JSON.stringify(settings, null, 2) + '\n';
if (dry) {
  console.log(`[dry-run] would ${remove ? 'remove' : 'register'} devkit hooks in ${settingsPath}`);
  process.exit(0);
}

if (fs.existsSync(settingsPath)) {
  const stamp = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
  const backup = path.join(path.dirname(settingsPath), '.devkit-backups', stamp, 'settings.json');
  fs.mkdirSync(path.dirname(backup), { recursive: true });
  fs.copyFileSync(settingsPath, backup);
  console.log(`backup: ${backup}`);
}
fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
fs.writeFileSync(settingsPath, texto);
console.log(`devkit hooks ${remove ? 'removed from' : 'registered in'} ${settingsPath}`);

#!/usr/bin/env node
// Registra (ou remove) os hooks do Jev no settings.json do Claude Code, sem tocar no resto.
// Uso: node merge-settings.mjs <settings.json> <jev-hooks.mjs> [--dry-run] [--remove]
// Idempotente: entradas anteriores do jev-hooks.mjs são trocadas, nunca duplicadas.
import fs from 'node:fs';
import path from 'node:path';

const [settingsPath, scriptPath, ...flags] = process.argv.slice(2);
if (!settingsPath || !scriptPath) {
  console.error('Uso: node merge-settings.mjs <settings.json> <jev-hooks.mjs> [--dry-run] [--remove]');
  process.exit(1);
}
const dry = flags.includes('--dry-run');
const remove = flags.includes('--remove');
const MARCA = 'jev-hooks.mjs';

const script = path.resolve(scriptPath).replace(/\\/g, '/');
const cmd = (modo) => `node "${script}" ${modo}`;

const NOVOS = {
  UserPromptSubmit: [{ hooks: [{ type: 'command', command: cmd('roteador'), timeout: 8 }] }],
  PreToolUse: [{ matcher: 'Bash', hooks: [{ type: 'command', command: cmd('guarda-bash'), timeout: 8 }] }],
  PostToolUse: [{ matcher: 'WebFetch|mcp__jev-browser__.*', hooks: [{ type: 'command', command: cmd('filtro-saida'), timeout: 30 }] }],
};

let settings = {};
if (fs.existsSync(settingsPath)) {
  settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8').replace(/^﻿/, ''));
}

const semJev = (lista = []) =>
  lista
    .map((g) => ({ ...g, hooks: (g.hooks ?? []).filter((h) => !String(h.command ?? '').includes(MARCA)) }))
    .filter((g) => g.hooks.length > 0);

settings.hooks ??= {};
for (const [evento, grupos] of Object.entries(NOVOS)) {
  const base = semJev(settings.hooks[evento]);
  settings.hooks[evento] = remove ? base : [...base, ...grupos];
  if (!settings.hooks[evento].length) delete settings.hooks[evento];
}
if (!Object.keys(settings.hooks).length) delete settings.hooks;

const texto = JSON.stringify(settings, null, 2) + '\n';
if (dry) {
  console.log(`[dry-run] ${remove ? 'removeria' : 'registraria'} hooks do Jev em ${settingsPath}`);
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
console.log(`${remove ? 'hooks do Jev removidos de' : 'hooks do Jev registrados em'} ${settingsPath}`);

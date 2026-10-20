// =============================================================================
// SHELL COMMAND REGISTRY
// =============================================================================
// Data only. The composable in useShell.ts interprets `action`, so this file
// stays free of DOM and Vue imports and can be reasoned about on its own.
//
// Every command here navigates somewhere real. The palette is a secondary
// shortcut onto content that is already reachable from the page navigation,
// so there are no decorative or easter-egg commands.
//
// Targets are section ids present in the prerendered homepage markup, so a
// command never depends on JavaScript having run to move the reader.
// =============================================================================

export type ShellAction =
  | { kind: 'scroll'; target: string; message: string }
  | { kind: 'navigate'; href: string; message: string }
  | { kind: 'external'; href: string; message: string }
  | { kind: 'status'; message: string };

export interface ShellCommand {
  /** Canonical name typed at the palette filter. */
  name: string;
  /** Alternative names that resolve to the same action. */
  aliases?: string[];
  /** One-line description shown beside the name. */
  summary: string;
  action: ShellAction;
}

export const SHELL_COMMANDS: ShellCommand[] = [
  {
    name: 'projects',
    aliases: ['work', 'ls'],
    summary: 'Go to projects',
    action: { kind: 'scroll', target: 'projects', message: '→ projects' }
  },
  {
    name: 'shadowplay',
    aliases: ['featured'],
    summary: 'Go to ShadowPlay',
    action: { kind: 'scroll', target: 'projects', message: '→ ShadowPlay' }
  },
  {
    name: 'about',
    aliases: ['bio'],
    summary: 'Go to about',
    action: { kind: 'scroll', target: 'about', message: '→ about' }
  },
  {
    name: 'contact',
    summary: 'Go to contact',
    action: { kind: 'scroll', target: 'contact', message: '→ contact' }
  },
  {
    name: 'github',
    aliases: ['repo', 'source'],
    summary: 'Open the GitHub profile',
    action: { kind: 'external', href: 'https://github.com/aoyn1xw', message: '→ github.com/aoyn1xw' }
  },
  {
    name: 'telegram',
    aliases: ['tg', 'message'],
    summary: 'Open the Telegram chat',
    action: { kind: 'external', href: 'https://t.me/ayon1xw', message: '→ t.me/ayon1xw' }
  },
  {
    name: 'socials',
    summary: 'Open the social links page',
    action: { kind: 'external', href: 'https://guns.lol/ayon1xw', message: '→ guns.lol/ayon1xw' }
  },
  {
    name: 'Games',
    aliases: ['games'],
    summary: 'Open the arcade',
    action: { kind: 'external', href: 'https://anoma.ly/arcade/', message: '→ anoma.ly/arcade/' }
  },
  {
    name: 'commissions',
    aliases: ['hire'],
    summary: 'Open the commissions page',
    action: { kind: 'navigate', href: '/commissions.html', message: '→ /commissions.html' }
  },
  {
    name: 'terms',
    summary: 'Open the commission terms',
    action: { kind: 'navigate', href: '/commission-terms.html', message: '→ /commission-terms.html' }
  },
  {
    name: 'top',
    aliases: ['home'],
    summary: 'Back to the top',
    action: { kind: 'scroll', target: 'identity', message: '→ top' }
  },
  {
    name: 'help',
    aliases: ['?', 'commands'],
    summary: 'List available commands',
    action: {
      kind: 'status',
      message:
        'projects · shadowplay · about · contact · github · telegram · socials · commissions · terms · top'
    }
  }
];

/** Resolve a typed token to a command, honouring aliases. */
export function resolveCommand(input: string): ShellCommand | undefined {
  const token = input.trim().toLowerCase();
  if (!token) return undefined;
  return SHELL_COMMANDS.find(
    command => command.name === token || command.aliases?.includes(token)
  );
}

/**
 * Subsequence match used by the palette filter: "prj" matches "projects".
 * Returns null when the query does not match, so callers can rank by density.
 */
export function fuzzyScore(candidate: string, query: string): number | null {
  if (!query) return 0;
  const haystack = candidate.toLowerCase();
  const needle = query.toLowerCase();
  if (haystack.startsWith(needle)) return 1000 - haystack.length;
  let cursor = 0;
  let score = 0;
  let streak = 0;
  for (const character of needle) {
    const found = haystack.indexOf(character, cursor);
    if (found === -1) return null;
    streak = found === cursor ? streak + 1 : 0;
    score += 10 + streak * 5 - Math.min(found - cursor, 8);
    cursor = found + 1;
  }
  return score;
}

/** Rank commands for the palette against a free-text query. */
export function filterCommands(query: string): ShellCommand[] {
  if (!query.trim()) return SHELL_COMMANDS;
  return SHELL_COMMANDS
    .map(command => {
      const score = Math.max(
        fuzzyScore(command.name, query) ?? -Infinity,
        ...(command.aliases ?? []).map(alias => fuzzyScore(alias, query) ?? -Infinity)
      );
      return { command, score };
    })
    .filter(entry => entry.score > -Infinity)
    .sort((a, b) => b.score - a.score)
    .map(entry => entry.command);
}
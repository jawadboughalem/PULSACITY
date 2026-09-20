import { join } from 'node:path';

/** `content/` sits beside the app; Next runs server code with the app as its cwd. */
export function contentDir(...segments: string[]): string {
  return join(process.cwd(), 'content', ...segments);
}

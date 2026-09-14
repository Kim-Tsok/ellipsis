/**
 * Derive a short, human title from raw content that was never given one -
 * used for pings (which are captured without a title) both when they're
 * promoted to a Note and when they're labeled as a node on the graph.
 */
export function deriveTitleFromContent(content: string): string {
  const firstLine =
    content
      .split('\n')
      .map((line) => line.trim())
      .find(Boolean) ?? '';
  const base = firstLine || content.trim();

  if (base.length <= 60) return base || 'Untitled';

  const truncated = base.slice(0, 60);
  const lastSpace = truncated.lastIndexOf(' ');
  return `${truncated.slice(0, lastSpace > 20 ? lastSpace : 60)}…`;
}

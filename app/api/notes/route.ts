import { readdir } from 'node:fs/promises';
import path from 'node:path';

const NOTES_DIRECTORY = path.join(process.cwd(), 'notes', 'chapters');

function getChapterOrder(slug: string) {
  const match = slug.match(/chapter-(\d+)/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

export async function GET() {
  try {
    const entries = await readdir(NOTES_DIRECTORY, { withFileTypes: true });

    const notes = entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
      .map((entry) => entry.name.replace(/\.md$/, ''))
      .sort((a, b) => getChapterOrder(a) - getChapterOrder(b) || a.localeCompare(b));

    return Response.json({ notes });
  } catch {
    return Response.json({ notes: [] });
  }
}

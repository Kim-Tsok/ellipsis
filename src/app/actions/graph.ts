'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/auth'; // Adjust to your BetterAuth server setup
import { headers } from 'next/headers';
import { deriveTitleFromContent } from '@/lib/text';

async function getAuthenticatedUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error('Unauthorized');
  return session.user;
}

export type GraphNodeType = 'note' | 'ping';

export interface GraphNode {
  id: string;
  type: GraphNodeType;
  label: string;
  preview: string;
  createdAt: Date;
}

export interface GraphEdge {
  source: string;
  target: string;
  // 0 (unrelated) - 1 (near duplicate). Derived from cosine distance.
  strength: number;
}

/**
 * Builds the "connected thoughts" graph: every Note and Ping the user has
 * with an embedding becomes a node, and each node is linked to its
 * nearest semantic neighbors (across BOTH tables) via pgvector distance.
 * This is what the graph view on /app renders.
 */
export async function getGraphData(): Promise<{
  nodes: GraphNode[];
  edges: GraphEdge[];
}> {
  const user = await getAuthenticatedUser();

  const rawNodes: Array<{
    id: string;
    type: GraphNodeType;
    title: string | null;
    content: string;
    createdAt: Date;
  }> = await prisma.$queryRaw`
    SELECT "id", 'note'::text AS "type", "title", "content", "createdAt"
    FROM "Note"
    WHERE "userId" = ${user.id} AND "embedding" IS NOT NULL
    UNION ALL
    SELECT "id", 'ping'::text AS "type", NULL::text AS "title", "content", "createdAt"
    FROM "Ping"
    WHERE "userId" = ${user.id} AND "embedding" IS NOT NULL
  `;

  if (rawNodes.length === 0) {
    return { nodes: [], edges: [] };
  }

  // Nearest neighbors per node, across both tables, via a lateral join on
  // cosine distance. Capped at 4 per node to keep the graph legible;
  // duplicate (undirected) edges are collapsed below.
  const rawEdges: Array<{
    source_id: string;
    target_id: string;
    distance: number;
  }> = await prisma.$queryRaw`
    WITH nodes AS (
      SELECT "id", "embedding"
      FROM "Note"
      WHERE "userId" = ${user.id} AND "embedding" IS NOT NULL
      UNION ALL
      SELECT "id", "embedding"
      FROM "Ping"
      WHERE "userId" = ${user.id} AND "embedding" IS NOT NULL
    )
    SELECT n1."id" AS source_id, neighbor."id" AS target_id, neighbor.distance
    FROM nodes n1
    CROSS JOIN LATERAL (
      SELECT n2."id", (n1."embedding" <=> n2."embedding") AS distance
      FROM nodes n2
      WHERE n2."id" != n1."id"
      ORDER BY n1."embedding" <=> n2."embedding"
      LIMIT 4
    ) neighbor
    -- Only keep genuinely related pairs, so unrelated captures stay
    -- unconnected instead of forcing 4 links on every node.
    WHERE neighbor.distance < 0.6;
  `;

  const nodes: GraphNode[] = rawNodes.map((n) => ({
    id: n.id,
    type: n.type,
    label: n.title || deriveTitleFromContent(n.content),
    preview: n.content.slice(0, 240),
    createdAt: n.createdAt,
  }));

  const seen = new Set<string>();
  const edges: GraphEdge[] = [];

  for (const e of rawEdges) {
    const key = [e.source_id, e.target_id].sort().join('::');
    if (seen.has(key)) continue;
    seen.add(key);

    edges.push({
      source: e.source_id,
      target: e.target_id,
      strength: Math.max(0, 1 - Number(e.distance)),
    });
  }

  return { nodes, edges };
}

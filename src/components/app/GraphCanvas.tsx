'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Sparkles, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { getGraphData, type GraphNode, type GraphEdge } from '@/app/actions/graph';
import { convertPingToNote, deletePing } from '@/app/actions/pings';

// --- Simulation types -------------------------------------------------
// Kept separate from the server's GraphNode/GraphEdge so position/velocity
// state can live on plain objects that we mutate directly each tick,
// without fighting React's immutability on every animation frame.

interface SimNode extends GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx: number | null; // pinned position while dragging
  fy: number | null;
}

interface SimEdge {
  source: string;
  target: string;
  strength: number;
}

const NOTE_COLOR = '#4FA1AF';
const PING_COLOR = '#c9a86a';
const NOTE_RADIUS = 9;
const PING_RADIUS = 5;

// Tunable physics constants. Small, legible motion over raw accuracy.
const REPEL = 1400;
const SPRING = 0.02;
const CENTER_PULL = 0.015;
const DAMPING = 0.82;
const ALPHA_DECAY = 0.992;
const MIN_ALPHA = 0.006;

interface GraphCanvasProps {
  // Bump this from a parent (e.g. after CaptureBar saves a new ping) to
  // refetch nodes/edges and re-seed the simulation.
  refreshSignal?: number;
}

export function GraphCanvas({ refreshSignal = 0 }: GraphCanvasProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const nodesRef = useRef<SimNode[]>([]);
  const edgesRef = useRef<SimEdge[]>([]);
  const alphaRef = useRef(1);
  const rafRef = useRef<number | null>(null);

  const dragRef = useRef<{ id: string; moved: boolean } | null>(null);
  const panRef = useRef<{ x: number; y: number } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [, setTick] = useState(0); // forces a re-render each animation frame
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [selected, setSelected] = useState<SimNode | null>(null);
  const [actionPending, setActionPending] = useState<'note' | 'expand' | 'discard' | null>(null);
  const [counts, setCounts] = useState({ notes: 0, pings: 0 });

  const size = useMemo(() => {
    if (typeof window === 'undefined') return { width: 800, height: 600 };
    const el = containerRef.current;
    return { width: el?.clientWidth || 800, height: el?.clientHeight || 600 };
  }, [isLoading]);

  const stepSimulation = useCallback(() => {
    const nodes = nodesRef.current;
    const edges = edgesRef.current;
    const alpha = alphaRef.current;
    const cx = size.width / 2;
    const cy = size.height / 2;

    if (alpha < MIN_ALPHA || nodes.length === 0) {
      rafRef.current = null;
      return;
    }

    // Repulsion between every pair (fine for the node counts a personal
    // knowledge base accumulates; revisit with quadtree if that changes).
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let distSq = dx * dx + dy * dy;
        if (distSq < 1) distSq = 1;
        const dist = Math.sqrt(distSq);
        const force = (REPEL * alpha) / distSq;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        a.vx -= fx;
        a.vy -= fy;
        b.vx += fx;
        b.vy += fy;
      }
    }

    // Springs along edges - closer semantic neighbors pull tighter.
    for (const edge of edges) {
      const a = nodes.find((n) => n.id === edge.source);
      const b = nodes.find((n) => n.id === edge.target);
      if (!a || !b) continue;

      const restLength = 60 + (1 - edge.strength) * 140;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const displacement = dist - restLength;
      const force = SPRING * displacement * alpha;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      a.vx += fx;
      a.vy += fy;
      b.vx -= fx;
      b.vy -= fy;
    }

    for (const node of nodes) {
      if (node.fx !== null && node.fy !== null) {
        node.x = node.fx;
        node.y = node.fy;
        node.vx = 0;
        node.vy = 0;
        continue;
      }

      node.vx += (cx - node.x) * CENTER_PULL * alpha;
      node.vy += (cy - node.y) * CENTER_PULL * alpha;
      node.vx *= DAMPING;
      node.vy *= DAMPING;
      node.x += node.vx;
      node.y += node.vy;
    }

    alphaRef.current *= ALPHA_DECAY;
    setTick((t) => t + 1);
    rafRef.current = requestAnimationFrame(stepSimulation);
  }, [size.width, size.height]);

  const reheat = useCallback(
    (amount = 0.35) => {
      alphaRef.current = Math.max(alphaRef.current, amount);
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(stepSimulation);
      }
    },
    [stepSimulation],
  );

  useEffect(() => {
    async function load() {
      try {
        const { nodes, edges } = await getGraphData();
        const cx = size.width / 2;
        const cy = size.height / 2;

        // Seed positions on a golden-angle spiral so nothing starts
        // stacked directly on top of anything else.
        nodesRef.current = nodes.map((n, i) => {
          const angle = i * 2.399963;
          const radius = 12 * Math.sqrt(i + 1);
          return {
            ...n,
            x: cx + Math.cos(angle) * radius,
            y: cy + Math.sin(angle) * radius,
            vx: 0,
            vy: 0,
            fx: null,
            fy: null,
          };
        });
        edgesRef.current = edges;
        setCounts({
          notes: nodes.filter((n) => n.type === 'note').length,
          pings: nodes.filter((n) => n.type === 'ping').length,
        });

        alphaRef.current = 1;
        rafRef.current = requestAnimationFrame(stepSimulation);
      } catch (err) {
        console.error('Failed to load graph:', err);
      } finally {
        setIsLoading(false);
      }
    }
    setIsLoading(true);
    load();

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshSignal]);

  // --- Pointer -> graph-space helpers ----------------------------------

  const screenToGraph = useCallback(
    (clientX: number, clientY: number) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      return {
        x: (clientX - rect.left - transform.x) / transform.scale,
        y: (clientY - rect.top - transform.y) / transform.scale,
      };
    },
    [transform],
  );

  const handleNodePointerDown = (e: React.PointerEvent, node: SimNode) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    dragRef.current = { id: node.id, moved: false };
    reheat(0.25);
  };

  const handleBackgroundPointerDown = (e: React.PointerEvent) => {
    panRef.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragRef.current) {
      const { id } = dragRef.current;
      const node = nodesRef.current.find((n) => n.id === id);
      if (node) {
        const { x, y } = screenToGraph(e.clientX, e.clientY);
        node.fx = x;
        node.fy = y;
        dragRef.current.moved = true;
        reheat(0.2);
      }
      return;
    }

    if (panRef.current) {
      setTransform((t) => ({ ...t, x: e.clientX - panRef.current!.x, y: e.clientY - panRef.current!.y }));
    }
  };

  const handlePointerUp = (node?: SimNode) => {
    if (dragRef.current) {
      const { id, moved } = dragRef.current;
      const simNode = nodesRef.current.find((n) => n.id === id);
      if (simNode) {
        simNode.fx = null;
        simNode.fy = null;
      }
      if (!moved && node) {
        setSelected(node);
      }
      dragRef.current = null;
    }
    panRef.current = null;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    setTransform((t) => ({
      ...t,
      scale: Math.min(2.5, Math.max(0.35, t.scale + delta * t.scale)),
    }));
  };

  // --- Ping actions from the side panel ---------------------------------

  const removeNode = (id: string) => {
    nodesRef.current = nodesRef.current.filter((n) => n.id !== id);
    edgesRef.current = edgesRef.current.filter((e) => e.source !== id && e.target !== id);
    setSelected(null);
    reheat(0.3);
  };

  const handleSaveAsNote = async (node: SimNode) => {
    setActionPending('note');
    try {
      const res = await convertPingToNote(node.id);
      if (res?.success) {
        removeNode(node.id);
        router.push(`/app/notes/${res.noteId}`);
      }
    } catch (err) {
      console.error('Failed to convert ping:', err);
    } finally {
      setActionPending(null);
    }
  };

  const handleExpandIntoNote = async (node: SimNode) => {
    setActionPending('expand');
    try {
      const res = await convertPingToNote(node.id);
      if (res?.success) {
        removeNode(node.id);
        router.push(`/app/notes/${res.noteId}?expand=1`);
      }
    } catch (err) {
      console.error('Failed to expand ping:', err);
    } finally {
      setActionPending(null);
    }
  };

  const handleDiscard = async (node: SimNode) => {
    setActionPending('discard');
    try {
      await deletePing(node.id);
      removeNode(node.id);
    } catch (err) {
      console.error('Failed to discard ping:', err);
    } finally {
      setActionPending(null);
    }
  };

  const nodes = nodesRef.current;
  const edges = edgesRef.current;
  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  return (
    <>
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      {/* Header */}
      <div className="pointer-events-none absolute left-8 top-8 z-20">
        <h1 className="font-instrument-serif text-4xl text-[#1a1a1a]">Your Graph</h1>
        <div className="pointer-events-auto mt-2 flex items-center gap-2">
          <span className="rounded-full border border-[#4FA1AF]/25 bg-white/80 px-3 py-1 text-xs text-[#3a7c86] backdrop-blur-sm">
            {counts.notes} notes
          </span>
          <span className="rounded-full border border-[#c9a86a]/30 bg-white/80 px-3 py-1 text-xs text-[#96793f] backdrop-blur-sm">
            {counts.pings} pings
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : nodes.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <p className="font-instrument-serif text-2xl text-gray-400">Nothing to connect yet</p>
          <p className="mt-1 text-sm text-gray-400">Capture a few pings and notes, and they'll show up here.</p>
        </div>
      ) : (
        <svg
          ref={svgRef}
          className="h-full w-full cursor-grab active:cursor-grabbing"
          onPointerDown={handleBackgroundPointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={() => handlePointerUp()}
          onPointerLeave={() => handlePointerUp()}
          onWheel={handleWheel}
        >
          <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
            {edges.map((edge) => {
              const a = nodeById.get(edge.source);
              const b = nodeById.get(edge.target);
              if (!a || !b) return null;
              return (
                <line
                  key={`${edge.source}-${edge.target}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="#8fb9bf"
                  strokeWidth={1}
                  strokeOpacity={0.15 + edge.strength * 0.35}
                />
              );
            })}

            {nodes.map((node) => {
              const isNote = node.type === 'note';
              const radius = isNote ? NOTE_RADIUS : PING_RADIUS;
              const isSelected = selected?.id === node.id;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onPointerDown={(e) => handleNodePointerDown(e, node)}
                  onPointerUp={() => handlePointerUp(node)}
                  className="cursor-pointer"
                >
                  {isSelected && (
                    <circle r={radius + 6} fill="none" stroke={isNote ? NOTE_COLOR : PING_COLOR} strokeWidth={1.5} strokeOpacity={0.5} />
                  )}
                  <circle
                    r={radius}
                    fill={isNote ? NOTE_COLOR : PING_COLOR}
                    fillOpacity={isNote ? 0.9 : 0.75}
                    stroke="white"
                    strokeWidth={1.5}
                  />
                  {isNote && (
                    <text
                      x={radius + 6}
                      y={4}
                      fontSize={11}
                      fill="#41494b"
                      className="pointer-events-none select-none"
                      style={{ fontFamily: 'var(--font-instrument-serif, serif)' }}
                    >
                      {node.label.length > 28 ? `${node.label.slice(0, 28)}…` : node.label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      )}

      {/* Side panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute right-6 top-6 z-30 w-80 rounded-2xl border border-gray-100 bg-white/95 p-5 shadow-xl backdrop-blur-md"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <span
                className="rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide"
                style={{
                  color: selected.type === 'note' ? NOTE_COLOR : '#96793f',
                  backgroundColor: selected.type === 'note' ? '#eef8f9' : '#faf3e6',
                }}
              >
                {selected.type === 'note' ? 'Note' : 'Ping'}
              </span>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 transition-colors hover:text-gray-600"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <h3 className="font-instrument-serif text-xl text-[#1a1a1a] line-clamp-2">{selected.label}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#687577] line-clamp-5">{selected.preview}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {selected.type === 'note' ? (
                <Link
                  href={`/app/notes/${selected.id}`}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-[#1a1a1a] shadow-sm transition-colors hover:border-[#4FA1AF] hover:text-[#4FA1AF]"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open note
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => handleSaveAsNote(selected)}
                    disabled={actionPending !== null}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-[#1a1a1a] shadow-sm transition-colors hover:border-[#4FA1AF] hover:text-[#4FA1AF] disabled:opacity-50"
                  >
                    {actionPending === 'note' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
                    Save as note
                  </button>
                  <button
                    onClick={() => handleExpandIntoNote(selected)}
                    disabled={actionPending !== null}
                    className="flex items-center gap-2 rounded-lg border border-[#4FA1AF]/40 bg-[#f4fafb] px-3 py-1.5 text-sm text-[#1f777f] shadow-sm transition-colors hover:border-[#4FA1AF] disabled:opacity-50"
                  >
                    {actionPending === 'expand' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                    Expand into note
                  </button>
                  <button
                    onClick={() => handleDiscard(selected)}
                    disabled={actionPending !== null}
                    className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-[#8a5555] transition-colors hover:bg-[#fff5f5] disabled:opacity-50"
                  >
                    {actionPending === 'discard' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    Discard
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
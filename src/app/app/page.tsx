'use client';

import { useState } from 'react';
import { DotPanel } from '@/components/app/DotPanel';
import { CaptureBar } from '@/components/app/CaptureBar';
import { GraphCanvas } from '@/components/app/GraphCanvas';

export default function AppGraphPage() {
  // Bumping this reloads the graph's nodes/edges - the simplest way to
  // fold a freshly captured ping into the simulation without hand-rolling
  // incremental layout logic for a single new node.
  const [refreshSignal, setRefreshSignal] = useState(0);

  return (
    <div className="flex h-full w-full flex-col">
      <DotPanel>
        <div className="relative h-full w-full flex-1">
          <GraphCanvas refreshSignal={refreshSignal} />
        </div>

        <CaptureBar onCaptured={() => setRefreshSignal((n) => n + 1)} />
      </DotPanel>
    </div>
  );
}

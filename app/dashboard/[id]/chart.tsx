"use client";

import { useState } from "react";

// Only `/dashboard/[id]` renders this component. The string stands in for a large dependency.
const WORDS = Array.from(
  { length: 4000 },
  (_, i) => `HEAVY_MARKER_word_${i}_${(i * 7919) % 10007}`,
);

export default function Chart({
  id,
  onEvent,
}: {
  id: string;
  onEvent: (event: string) => void;
}) {
  const [index, setIndex] = useState(0);
  return (
    <button
      onClick={() => {
        onEvent("click");
        setIndex((index + 1) % WORDS.length);
      }}
    >
      {id} {WORDS[index]}
    </button>
  );
}

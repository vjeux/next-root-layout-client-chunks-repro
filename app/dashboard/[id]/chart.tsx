"use client";

import { useState } from "react";
import { CHART_LIBRARY } from "./chart-library";

// Only `/dashboard/[id]` renders this component.
export default function Chart({
  id,
  onEvent,
}: {
  id: string;
  onEvent: (event: string) => void;
}) {
  const [offset, setOffset] = useState(0);
  return (
    <button
      onClick={() => {
        onEvent("click");
        setOffset((offset + 8) % CHART_LIBRARY.length);
      }}
    >
      {id} {CHART_LIBRARY.slice(offset, offset + 8)}
    </button>
  );
}

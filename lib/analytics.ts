"use client";

// A client-only helper module (no component), like an analytics tracker.
export function track(event: string) {
  console.log("ANALYTICS_MARKER", event);
}

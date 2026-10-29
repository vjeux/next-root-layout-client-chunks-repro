// A server utility that loads its error path on demand.
export function loadData() {
  void import("./on-error");
  return "ok";
}

import { track } from "../../../lib/analytics";
import Chart from "./chart";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <Chart id={id} onEvent={track} />;
}

import { loadData } from "../lib/data";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The root layout reaches `lib/analytics.ts` only through the server-side `import()` in
  // `lib/data.ts`.
  loadData();
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import Counter from "./counter";

// `/` renders only a small client component. It never renders the dashboard page's component.
export default function Home() {
  return <Counter />;
}

import type { GreetingResult } from "@/types/greeting";

interface GreetingProps {
  greeting: GreetingResult | null;
}

export function Greeting({ greeting }: GreetingProps) {
  if (!greeting) return null;

  return (
    <div className="mb-8 text-center">
      <h2 className="mb-2 text-2xl font-bold text-foreground">{greeting.message}</h2>
      {greeting.subMessage && (
        <p className="text-lg text-text-secondary">{greeting.subMessage}</p>
      )}
    </div>
  );
}

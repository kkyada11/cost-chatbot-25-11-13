import { useGreeting } from "@/hooks/useGreeting";
import { Greeting } from "./Greeting";

export function EmptyState() {
  const greeting = useGreeting();

  return (
    <div className="flex h-full flex-col items-center justify-center p-8">
      <Greeting greeting={greeting} />
      <div className="max-w-2xl text-center">
        <p className="mb-6 text-text-secondary">
          경비 청구 관련 질문을 자유롭게 해주세요.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-sidebar p-4 text-left">
            <p className="text-sm text-foreground">💡 예시 질문</p>
            <p className="mt-2 text-sm text-text-secondary">교통비 청구는 어떻게 하나요?</p>
          </div>
          <div className="rounded-lg border border-border bg-sidebar p-4 text-left">
            <p className="text-sm text-foreground">📝 예시 질문</p>
            <p className="mt-2 text-sm text-text-secondary">식비 영수증 제출 방법은?</p>
          </div>
        </div>
      </div>
    </div>
  );
}

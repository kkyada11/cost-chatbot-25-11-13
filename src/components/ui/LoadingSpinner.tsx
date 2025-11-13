export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div
      className={`${sizes[size]} animate-spin rounded-full border-primary border-t-transparent`}
      role="status"
      aria-label="로딩 중"
    />
  );
}

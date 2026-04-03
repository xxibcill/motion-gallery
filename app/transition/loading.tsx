export default function TransitionLoading() {
  return (
    <div className="grid gap-8">
      <div className="h-28 animate-pulse rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-1)]" />
      <div className="h-[30rem] animate-pulse rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-1)]" />
    </div>
  );
}

export default function TransitionLoading() {
  return (
    <div className="grid gap-8">
      <div className="h-28 animate-pulse rounded-[2rem] border border-white/10 bg-white/[0.04]" />
      <div className="h-[30rem] animate-pulse rounded-[2rem] border border-white/10 bg-white/[0.03]" />
    </div>
  );
}

"use client";

interface DemoOption {
  value: string;
  label: string;
}

interface DemoToolbarProps<T extends string> {
  eyebrow: string;
  options: Array<DemoOption & { value: T }>;
  activeValue: T;
  onSelect: (value: T) => void;
  actionLabel: string;
  onAction: () => void;
  actionHint: string;
  className?: string;
}

export function DemoToolbar<T extends string>({
  eyebrow,
  options,
  activeValue,
  onSelect,
  actionLabel,
  onAction,
  actionHint,
  className = "",
}: DemoToolbarProps<T>) {
  return (
    <div
      role="group"
      aria-label={eyebrow}
      className={`flex flex-col gap-4 rounded-[1.75rem] border border-white/10 bg-black/25 p-4 backdrop-blur-md lg:flex-row lg:items-center lg:justify-between ${className}`}
    >
      <div className="space-y-2">
        <p className="text-[0.65rem] uppercase tracking-[0.28em] text-white/40">
          {eyebrow}
        </p>
        <div className="overflow-x-auto pb-1">
          <div className="flex min-w-max flex-wrap gap-2">
          {options.map((option) => {
            const isActive = option.value === activeValue;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onSelect(option.value)}
                aria-pressed={isActive}
                className={`rounded-full border px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09101d] ${
                  isActive
                    ? "border-white/25 bg-white/14 text-white"
                    : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                {option.label}
              </button>
            );
          })}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-2 text-sm text-white/58 lg:items-end">
        <button
          type="button"
          onClick={onAction}
          className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-white transition-colors hover:border-white/25 hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09101d]"
        >
          {actionLabel}
        </button>
        <p>{actionHint}</p>
      </div>
    </div>
  );
}

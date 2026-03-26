"use client";

interface ShowcaseOption<T extends string> {
  value: T;
  label: string;
}

interface ShowcaseControllerProps<
  TMode extends string,
  TSpeed extends string,
  TIntensity extends string,
> {
  modeOptions: Array<ShowcaseOption<TMode>>;
  activeMode: TMode;
  onModeSelect: (value: TMode) => void;
  speedOptions: Array<ShowcaseOption<TSpeed>>;
  activeSpeed: TSpeed;
  onSpeedSelect: (value: TSpeed) => void;
  intensityOptions: Array<ShowcaseOption<TIntensity>>;
  activeIntensity: TIntensity;
  onIntensitySelect: (value: TIntensity) => void;
  replayLabel: string;
  onReplay: () => void;
  replayHint: string;
  reducedMotionEnabled: boolean;
  activeModeSummary: string;
}

interface ControlGroupProps<T extends string> {
  label: string;
  options: Array<ShowcaseOption<T>>;
  activeValue: T;
  onSelect: (value: T) => void;
}

function ControlGroup<T extends string>({
  label,
  options,
  activeValue,
  onSelect,
}: ControlGroupProps<T>) {
  return (
    <div className="space-y-2">
      <p className="text-[0.65rem] uppercase tracking-[0.28em] text-white/40">
        {label}
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
                    ? "border-cyan-200/28 bg-cyan-200/14 text-white"
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
  );
}

export function ShowcaseController<
  TMode extends string,
  TSpeed extends string,
  TIntensity extends string,
>({
  modeOptions,
  activeMode,
  onModeSelect,
  speedOptions,
  activeSpeed,
  onSpeedSelect,
  intensityOptions,
  activeIntensity,
  onIntensitySelect,
  replayLabel,
  onReplay,
  replayHint,
  reducedMotionEnabled,
  activeModeSummary,
}: ShowcaseControllerProps<TMode, TSpeed, TIntensity>) {
  return (
    <section className="grid gap-4 rounded-[1.75rem] border border-white/10 bg-black/25 p-4 backdrop-blur-md lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:p-5">
      <div className="space-y-4">
        <ControlGroup
          label="Transition Modes"
          options={modeOptions}
          activeValue={activeMode}
          onSelect={onModeSelect}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <ControlGroup
            label="Speed"
            options={speedOptions}
            activeValue={activeSpeed}
            onSelect={onSpeedSelect}
          />
          <ControlGroup
            label="Intensity"
            options={intensityOptions}
            activeValue={activeIntensity}
            onSelect={onIntensitySelect}
          />
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-cyan-200/18 bg-cyan-200/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.24em] text-cyan-50/80">
              Flagship Controller
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.65rem] uppercase tracking-[0.24em] text-white/55">
              {reducedMotionEnabled ? "Reduced Motion On" : "Motion Expanded"}
            </span>
          </div>
          <p className="text-sm leading-6 text-white/72">{activeModeSummary}</p>
        </div>

        <div className="flex flex-col items-start gap-2">
          <button
            type="button"
            onClick={onReplay}
            className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm text-white transition-colors hover:border-white/25 hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09101d]"
          >
            {replayLabel}
          </button>
          <p className="text-sm leading-6 text-white/56">{replayHint}</p>
        </div>
      </div>
    </section>
  );
}

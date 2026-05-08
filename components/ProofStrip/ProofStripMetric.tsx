interface ProofStripMetricProps {
  value: string;
  label: string;
}

export function ProofStripMetric({ value, label }: ProofStripMetricProps) {
  return (
    <div data-metric className="min-w-0" data-reveal>
      <dt className="font-display font-semibold text-foreground text-base sm:text-lg leading-tight tracking-tight">
        {value}
      </dt>
      <dd className="mt-1 text-muted text-xs sm:text-sm leading-snug">{label}</dd>
    </div>
  );
}

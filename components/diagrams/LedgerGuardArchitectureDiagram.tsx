/** Static SVG — uses currentColor for theme compatibility. */

export function LedgerGuardArchitectureDiagram() {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border/70 bg-background/40 px-2 py-3 sm:px-4 sm:py-4">
      <svg
        viewBox="0 0 520 268"
        className="mx-auto block h-auto w-full max-w-[520px] text-foreground"
        role="img"
        aria-labelledby="ledgerguard-arch-title"
      >
        <title id="ledgerguard-arch-title">
          LedgerGuard architecture: frontend talks to API and database; API enqueues work for AI
          workers via queues; workers feed verification; internal callbacks return to the API under
          domain rules.
        </title>
        <defs>
          <marker
            id="lg-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L8,4 L0,8 z" fill="currentColor" opacity="0.9" />
          </marker>
        </defs>

        <rect
          x="200"
          y="8"
          width="96"
          height="34"
          rx="6"
          fill="currentColor"
          fillOpacity="0.07"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text x="248" y="29" textAnchor="middle" fill="currentColor" fontSize="11" fontFamily="inherit">
          Frontend
        </text>

        <rect
          x="200"
          y="62"
          width="96"
          height="38"
          rx="6"
          fill="currentColor"
          fillOpacity="0.07"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text x="248" y="84" textAnchor="middle" fill="currentColor" fontSize="11" fontFamily="inherit">
          API (domain)
        </text>

        <rect
          x="352"
          y="62"
          width="96"
          height="38"
          rx="6"
          fill="currentColor"
          fillOpacity="0.07"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text x="400" y="84" textAnchor="middle" fill="currentColor" fontSize="11" fontFamily="inherit">
          Database
        </text>

        <rect
          x="72"
          y="136"
          width="88"
          height="34"
          rx="6"
          fill="currentColor"
          fillOpacity="0.07"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text x="116" y="157" textAnchor="middle" fill="currentColor" fontSize="11" fontFamily="inherit">
          Queues
        </text>

        <rect
          x="232"
          y="132"
          width="112"
          height="42"
          rx="6"
          fill="currentColor"
          fillOpacity="0.07"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text x="288" y="152" textAnchor="middle" fill="currentColor" fontSize="11" fontFamily="inherit">
          AI workers
        </text>
        <text x="288" y="166" textAnchor="middle" fill="currentColor" fontSize="10" opacity="0.8">
          OCR · extraction
        </text>

        <rect
          x="176"
          y="206"
          width="168"
          height="44"
          rx="6"
          fill="currentColor"
          fillOpacity="0.07"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text x="260" y="228" textAnchor="middle" fill="currentColor" fontSize="11" fontFamily="inherit">
          Verification loop
        </text>
        <text x="260" y="242" textAnchor="middle" fill="currentColor" fontSize="10" opacity="0.8">
          human review · reconcile
        </text>

        <line
          x1="248"
          y1="42"
          x2="248"
          y2="60"
          stroke="currentColor"
          strokeWidth="1.25"
          markerEnd="url(#lg-arrow)"
          opacity="0.85"
        />
        <line
          x1="296"
          y1="81"
          x2="350"
          y2="81"
          stroke="currentColor"
          strokeWidth="1.25"
          markerEnd="url(#lg-arrow)"
          opacity="0.85"
        />
        <line
          x1="232"
          y1="100"
          x2="140"
          y2="134"
          stroke="currentColor"
          strokeWidth="1.25"
          markerEnd="url(#lg-arrow)"
          opacity="0.85"
        />
        <line
          x1="160"
          y1="153"
          x2="230"
          y2="153"
          stroke="currentColor"
          strokeWidth="1.25"
          markerEnd="url(#lg-arrow)"
          opacity="0.85"
        />
        <line
          x1="288"
          y1="174"
          x2="260"
          y2="204"
          stroke="currentColor"
          strokeWidth="1.25"
          markerEnd="url(#lg-arrow)"
          opacity="0.85"
        />
        <path
          d="M 176 228 L 110 228 L 110 81 L 198 81"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          markerEnd="url(#lg-arrow)"
          opacity="0.75"
        />
        <text x="72" y="198" fill="currentColor" fontSize="9" opacity="0.65">
          internal callbacks
        </text>
      </svg>
    </div>
  );
}

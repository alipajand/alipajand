/** Static SVG — uses currentColor for theme compatibility. */

export function McpWorkflowDiagram() {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border/70 bg-background/40 px-2 py-3 sm:px-4 sm:py-4">
      <svg
        viewBox="0 0 440 200"
        className="mx-auto block h-auto w-full max-w-[440px] text-foreground"
        role="img"
        aria-labelledby="mcp-workflow-title"
      >
        <title id="mcp-workflow-title">
          MCP workflow: the editor invokes an MCP server that runs lint, types, and tests; results
          feed back into the editor in a tight feedback loop.
        </title>
        <defs>
          <marker
            id="mcp-arrow"
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
          x="16"
          y="72"
          width="92"
          height="40"
          rx="6"
          fill="currentColor"
          fillOpacity="0.07"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="62"
          y="92"
          textAnchor="middle"
          fill="currentColor"
          fontSize="11"
          fontFamily="inherit"
        >
          Editor
        </text>
        <text x="62" y="106" textAnchor="middle" fill="currentColor" fontSize="10" opacity="0.75">
          Cursor
        </text>

        <rect
          x="148"
          y="64"
          width="118"
          height="56"
          rx="6"
          fill="currentColor"
          fillOpacity="0.07"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="207"
          y="88"
          textAnchor="middle"
          fill="currentColor"
          fontSize="11"
          fontFamily="inherit"
        >
          MCP server
        </text>
        <text x="207" y="104" textAnchor="middle" fill="currentColor" fontSize="10" opacity="0.75">
          tools · project context
        </text>

        <rect
          x="306"
          y="52"
          width="118"
          height="80"
          rx="6"
          fill="currentColor"
          fillOpacity="0.07"
          stroke="currentColor"
          strokeWidth="1"
        />
        <text
          x="365"
          y="76"
          textAnchor="middle"
          fill="currentColor"
          fontSize="11"
          fontFamily="inherit"
        >
          Lint · types · tests
        </text>
        <text x="365" y="94" textAnchor="middle" fill="currentColor" fontSize="10" opacity="0.75">
          same scripts as CI
        </text>
        <text x="365" y="114" textAnchor="middle" fill="currentColor" fontSize="10" opacity="0.75">
          structured output
        </text>

        <line
          x1="108"
          y1="92"
          x2="146"
          y2="92"
          stroke="currentColor"
          strokeWidth="1.25"
          markerEnd="url(#mcp-arrow)"
          opacity="0.85"
        />
        <line
          x1="266"
          y1="92"
          x2="304"
          y2="92"
          stroke="currentColor"
          strokeWidth="1.25"
          markerEnd="url(#mcp-arrow)"
          opacity="0.85"
        />

        <path
          d="M 365 132 Q 200 188 62 120"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeDasharray="4 3"
          markerEnd="url(#mcp-arrow)"
          opacity="0.75"
        />
        <text x="200" y="178" textAnchor="middle" fill="currentColor" fontSize="10" opacity="0.7">
          feedback loop
        </text>
      </svg>
    </div>
  );
}

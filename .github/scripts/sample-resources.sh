#!/usr/bin/env sh
# Runs a command while sampling CPU load and memory every 2 seconds, then writes the peaks to the
# job summary. Exits with the command's status. Usage: sample-resources.sh <label> <command...>
set -u

label="$1"
shift
samples="${RUNNER_TEMP:-/tmp}/resources-$$.log"

(
  while :; do
    load=$(cut -d ' ' -f 1 /proc/loadavg)
    available=$(awk '/^MemAvailable:/ { print $2 }' /proc/meminfo)
    echo "$load $available"
    sleep 2
  done
) > "$samples" &
sampler=$!

"$@"
status=$?

kill "$sampler" 2> /dev/null
cpus=$(nproc)
total=$(awk '/^MemTotal:/ { print $2 }' /proc/meminfo)
summary=$(awk -v cpus="$cpus" -v total="$total" -v label="$label" '
  NR == 1 { minavail = $2 }
  { if ($1 > peak) peak = $1; if ($2 < minavail) minavail = $2 }
  END {
    printf "%s: %d samples, peak 1-min load %.2f on %d CPUs, peak memory in use %.1f of %.1f GiB\n",
      label, NR, peak, cpus, (total - minavail) / 1048576, total / 1048576
  }' "$samples")
echo "$summary"
if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then
  echo "- $summary" >> "$GITHUB_STEP_SUMMARY"
fi
rm -f "$samples"
exit "$status"

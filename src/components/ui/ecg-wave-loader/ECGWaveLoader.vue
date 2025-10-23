<template>
  <svg
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="block"
    v-bind="$attrs"
    aria-label="Loading"
    role="img"
  >
    <defs>
      <clipPath :id="clipId">
        <rect
          :x="0"
          :y="0"
          :width="width"
          :height="height"
          :rx="rounded ? radius : 0"
          :ry="rounded ? radius : 0"
        />
      </clipPath>
      <filter :id="glowId" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <g :clip-path="`url(#${clipId})`">
      Baseline waveform
      <path
        ref="baselinePath"
        :d="pathD"
        stroke="currentColor"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
        :opacity="baselineOpacity"
      />

      Tracer glow (optional)
      <path
        v-if="glow"
        ref="tracerGlow"
        :d="pathD"
        stroke="currentColor"
        :stroke-width="strokeWidth * 2.4"
        stroke-linecap="round"
        stroke-linejoin="round"
        :opacity="0.35"
        :filter="`url(#${glowId})`"
      />

      Tracer segment
      <path
        ref="tracerPath"
        :d="pathD"
        stroke="currentColor"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      Moving dot (optional)
      <g v-if="showDot" ref="dotEl">
        <circle
          :r="strokeWidth * 1.1"
          fill="currentColor"
          :filter="glow ? `url(#${glowId})` : undefined"
        />
      </g>
    </g>
  </svg>
</template>

<script setup lang="js">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";

const props = defineProps({
  width: { type: Number, default: 320 },
  height: { type: Number, default: 72 },
  strokeWidth: { type: Number, default: 2 },
  // Duration for one full sweep along the path
  speedMs: { type: Number, default: 1400 },
  // Fraction of total path length to display as the bright tracer segment (0..1)
  tracerLength: { type: Number, default: 0.12 },
  baselineOpacity: { type: Number, default: 0.25 },
  showDot: { type: Boolean, default: false },
  glow: { type: Boolean, default: false },
  rounded: { type: Boolean, default: true },
});

const radius = 10;

// Unique IDs for defs to avoid collisions if multiple instances are on the page
const uid = Math.random().toString(36).slice(2);
const clipId = `ecg-clip-${uid}`;
const glowId = `ecg-glow-${uid}`;

const baselinePath = ref(null);
const tracerPath = ref(null);
const tracerGlow = ref(null);
const dotEl = ref(null);

const cycles = 2; // how many ECG cycles across the width

const pathD = computed(() =>
  generateECGPath(props.width, props.height, cycles),
);

function generateECGPath(w, h, nCycles = 3) {
  // Build a clean ECG-like path: baseline → small rise → tall spike → undershoot → recover hump → baseline
  const yMid = h * 0.5;
  const amp = h * 0.38;
  const under = h * 0.18;
  const seg = w / nCycles;

  let d = `M 0 ${yMid}`;
  for (let i = 0; i < nCycles; i++) {
    const x0 = i * seg;
    const x1 = x0 + seg * 0.1; // baseline lead-in
    const x2 = x0 + seg * 0.18; // small pre-rise
    const x3 = x0 + seg * 0.28; // tall spike top
    const x4 = x0 + seg * 0.34; // undershoot bottom
    const x5 = x0 + seg * 0.42; // return toward baseline
    const x6 = x0 + seg * 0.56; // gentle recovery hump peak
    const x7 = x0 + seg * 0.72; // back to baseline
    const x8 = x0 + seg; // cycle end

    // baseline
    d += ` L ${x1} ${yMid}`;

    // small pre-rise curve
    d += ` C ${x0 + seg * 0.12} ${yMid}, ${x0 + seg * 0.16} ${yMid - amp * 0.15}, ${x2} ${yMid - amp * 0.2}`;

    // tall spike up, then undershoot down
    d += ` L ${x3} ${yMid - amp}`;
    d += ` L ${x4} ${yMid + under}`;

    // quick return
    d += ` L ${x5} ${yMid + under * 0.2}`;

    // recovery hump (smooth curve back to baseline)
    d += ` C ${x5 + seg * 0.05} ${yMid - amp * 0.1}, ${x6 - seg * 0.05} ${yMid - amp * 0.12}, ${x6} ${yMid - amp * 0.08}`;
    d += ` C ${x6 + seg * 0.06} ${yMid - amp * 0.04}, ${x7 - seg * 0.06} ${yMid - amp * 0.02}, ${x7} ${yMid}`;

    // finish to cycle end on baseline
    d += ` L ${x8} ${yMid}`;
  }
  return d;
}

let rafId = 0;
let startTs = 0;
let pathLen = 0;
let segLen = 0;

function applyDash(p, glowEl) {
  if (!p) return;
  p.style.strokeDasharray = `${segLen} ${pathLen}`;
  // Initialize off-screen offset so first painted frame is stable
  p.style.strokeDashoffset = `${pathLen - 0.001}`;
  if (glowEl) {
    glowEl.style.strokeDasharray = `${segLen} ${pathLen}`;
    glowEl.style.strokeDashoffset = `${pathLen - 0.001}`;
  }
}

function loop(now) {
  if (!startTs) startTs = now;
  const elapsed = (now - startTs) % props.speedMs;
  const progress = elapsed / props.speedMs;
  // Move the tracer forward along the path; epsilon avoids landing exactly on the boundary
  const epsilon = 0.0001;
  const offset = (1 - progress + epsilon) * pathLen;

  if (tracerPath.value) {
    tracerPath.value.style.strokeDashoffset = `${offset}`;
  }
  if (tracerGlow.value) {
    tracerGlow.value.style.strokeDashoffset = `${offset}`;
  }

  // optional dot
  if (props.showDot && baselinePath.value && dotEl.value) {
    // Leading edge of the tracer segment
    const head = (pathLen - offset + segLen) % pathLen;
    const pt = baselinePath.value.getPointAtLength(head);
    dotEl.value.setAttribute("transform", `translate(${pt.x}, ${pt.y})`);
  }

  rafId = requestAnimationFrame(loop);
}

onMounted(async () => {
  await nextTick();
  // Measure after SVG has rendered
  if (!baselinePath.value) return;
  pathLen = baselinePath.value.getTotalLength();
  segLen = Math.max(12, Math.min(pathLen * props.tracerLength, pathLen - 1));

  applyDash(tracerPath.value, tracerGlow.value);

  // Double rAF to avoid first-frame stutter after styles are applied
  requestAnimationFrame(() => {
    requestAnimationFrame((ts) => {
      startTs = ts;
      rafId = requestAnimationFrame(loop);
    });
  });
});

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId);
});
</script>

<style scoped>
/* No extra styles needed; color inherits via currentColor */
</style>

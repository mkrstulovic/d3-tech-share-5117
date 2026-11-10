<script lang="ts">
  import * as d3 from 'd3';
  import { onMount } from 'svelte';
  import Scatter from '#lib/Scatter.svelte';
  import Line from '#lib/Line.svelte';
  import type { PrintHistory, WeeklyPrintCount } from '../types.d';

  let prints: PrintHistory[] = $state([]);
  let weeklyCounts: WeeklyPrintCount[] = $state([]);
  let dateRange: [Date, Date] | undefined = $state();

  const visiblePrints = $derived.by(() => {
    if (!dateRange) return prints;
    const [start, end] = dateRange;
    return prints.filter((print) => print.startTime >= start && print.startTime < end);
  });

  async function loadCsv() {
    prints = await d3.csv('./prints.csv', (row) => ({
      startTime: new Date(row.startTime),
      actualPrintTime: Number(row.actualPrintTime),
      calculatedPrintTime: Number(row.calculatedPrintTime)
    }));

    weeklyCounts = await d3.csv('./weekly_prints.csv', (row) => ({
      weekStart: new Date(row.weekStart),
      printCount: Number(row.printCount)
    }));
  }

  onMount(() => {
    loadCsv();
  });
</script>

<div class="container">
  <h1>D3 fundamentals</h1>

  {#if prints.length > 0 && weeklyCounts.length > 0}
    <h2>Scatter plot</h2>
    <p>Showing {visiblePrints.length} of {prints.length} print jobs.</p>
    <Scatter {prints} {visiblePrints} />

    <h2>Line graph</h2>
    <p>Drag across the line graph to filter the scatter plot.</p>
    <Line data={weeklyCounts} bind:dateRange />
  {/if}
</div>

<style>
  .container {
    max-width: 640px;
    margin: 0 auto;
    padding: 16px;
    font-family: system-ui, sans-serif;
  }
</style>

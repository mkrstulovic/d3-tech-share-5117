<script lang="ts">
  import * as d3 from "d3";
  import Scatter from "#lib/Scatter.svelte";
  import Line from "#lib/Line.svelte";
  import { onMount } from "svelte";
  import type { PrintHistory } from "../types.d";


  let prints: PrintHistory[] = $state([]);

  let weekRange: [Date, Date] | undefined = $state();

  function getWeek(date: Date) {
    const yearStart = new Date(date.getFullYear(), 0 ,1)
    const days = (date.getTime() - yearStart.getTime()) / 86400000

    const week_number = Math.ceil((days + yearStart.getDay() + 1) / 7)
    // console.log("Date " + date.toString() + " --> " + week_number)
    // console.log(yearStart.getTime())

    return week_number
  }

  function getWeeklyCountArray(prints: PrintHistory[]) {
    let weekCount: { [week: number]: number } = {};
    const allWeeks = [...new Set(prints.map((d) => getWeek(d.startTime)))];
    for (let week of allWeeks) {
      weekCount[week] = prints.filter(
        (d) => getWeek(d.startTime) == week,
      ).length;
    }

    // Convert the map to an array of { week, count } objects
    const weekCountArray = Object.entries(weekCount).map(([week, count]) => ({
      x: new Date(1767247200000 + (week * 7 * 86400000)),
      y: count as number,
    }));

    // Sort the array by week in ascending order
    weekCountArray.sort((a, b) => (a.x < b.x ? -1 : 1));
    console.log(weekCountArray)
    return weekCountArray;
  }

  let weekCountArray = $derived(getWeeklyCountArray(prints));

  type TAxisSelection = {
    x: keyof PrintHistory;
    y: keyof PrintHistory;
    size: keyof PrintHistory;
  };

  let axisSelection: TAxisSelection = $state({
    x: "startTime",
    y: "actualPrintTime",
    size: "costs",
  });

  // Function to load the CSV
  async function loadCsv() {
    try {
      const csvUrl = "./Prusa.csv";
      prints = await d3.csv(csvUrl, (row) => {
        // all values are strings, so use row conversion function to format them
        return {
          ...row,
          startTime: new Date(row.startTime),
          actualPrintTime: Number(row.actualPrintTime),
          calculatedPrintTime: Number(row.calculatedPrintTime),
          filamentUsed: Number(row.filamentUsed),
          costs: Number(row.costs),
        } as PrintHistory;
      });

      console.log("Loaded CSV Data:", prints);
    } catch (error) {
      console.error("Error loading CSV:", error);
    }
  }
  // Call the loader when the component mounts
  onMount(loadCsv);

  let attrOptions = $derived(prints[0] ? Object.keys(prints[0]) : []);
</script>

<div class="container">
  <h1>Summer Movies</h1>

  <p>Here are {prints.length == 0 ? "..." : prints.length + " "} prints</p>
  {#if prints.length > 0}
    <div class="selectors">
      <!-- selectors for three axis -->
      X Axis:
      <select bind:value={axisSelection.x}>
        {#each attrOptions as key}
          <option value={key}>{key}</option>
        {/each}
      </select>

      Y Axis:
      <select bind:value={axisSelection.y}>
        {#each attrOptions.filter((d) => d != "genres") as key}
          <option value={key}>{key}</option>
        {/each}
      </select>

      Size:
      <select bind:value={axisSelection.size}>
        {#each attrOptions.filter((d) => d != "genres") as key}
          <option value={key}>{key}</option>
        {/each}
      </select>
    </div>

    <Scatter
      prints={weekRange
        ? prints.filter((d) => d.startTime <= weekRange![1] && d.startTime >= weekRange![0])
        : prints}
      x={axisSelection.x}
      y={axisSelection.y}
      size={axisSelection.size}
    />
    <br />

    <Line data={weekCountArray} bind:weekRange />
  {/if}
</div>

<style>
  .container {
    width: 60vw;
    margin: 10px auto;
    padding: 10px;
  }
</style>
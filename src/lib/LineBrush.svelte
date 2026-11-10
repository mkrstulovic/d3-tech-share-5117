<script lang="ts">
  import * as d3 from 'd3';
  import type { WeeklyPrintCount } from '../types';

  // We need to additionally define the dataRange type, as we are going to select a start and end date to filter on.
  type TProps = {
    data: WeeklyPrintCount[];
    dateRange: [Date, Date] | undefined;
  };
  let { data, dateRange = $bindable() }: TProps = $props();
  let svgElement: SVGSVGElement | undefined = $state();

  const width = 600;
  const height = 220;
  const margin = { top: 20, right: 20, bottom: 40, left: 60 };

  $effect(() => {
    if (!svgElement) return;
    const svg = d3.select(svgElement);

    const xScale = d3
      .scaleTime()
      .domain([data[0].weekStart, d3.timeWeek.offset(data[data.length - 1].weekStart, 1)])
      .range([margin.left, width - margin.right]);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (week) => week.printCount) || 1])
      .range([height - margin.bottom, margin.top]);

    svg.select<SVGGElement>('.x-axis').call(d3.axisBottom(xScale).ticks(12));
    svg.select<SVGGElement>('.y-axis').call(d3.axisLeft(yScale).ticks(4));

    const line = d3
      .line<WeeklyPrintCount>()
      .x((week) => xScale(week.weekStart))
      .y((week) => yScale(week.printCount));

    svg.select('.series').datum(data).attr('d', line);

    // This is the key difference!
    // We need to set a dimension for the brush, the boundaries, and and effect when the brush ends.
    // In this case we get the selection on the range (the physical SVG) and convert it to the domain (actual dates)
    // If there is no selection, we do not define a filter.
    const brush = d3
      .brushX()
      .extent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.bottom]
      ])
      .on('brush end', (event) => {
        const selection = event.selection as [number, number] | null;
        dateRange = selection
          ? [xScale.invert(selection[0]), xScale.invert(selection[1])]
          : undefined;
      });

    svg.select<SVGGElement>('.brush').call(brush);
  });
</script>

<!-- This is the same as the normal line chart, but now we added a group for the brush! -->
<svg bind:this={svgElement} {width} {height}>
  <path class="series" fill="none" stroke="#E46DAC" stroke-width="2" />
  <g class="x-axis" transform="translate(0, {height - margin.bottom})" />
  <g class="y-axis" transform="translate({margin.left}, 0)" />
  <g class="brush" />
  <text x={width / 2} y={height - 5} text-anchor="middle">Week starting Sunday</text>
  <text transform="rotate(-90)" x={-height / 2} y={16} text-anchor="middle">Print jobs</text>
</svg>

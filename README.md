# D3 Tech Demo

This demo shows 3D printing jobs from University of Minnesota students and faculty using Prusa and Bambu printers. The scatter plot compares estimated and actual duration in hours, and the line graph shows jobs started each week.

## Run locally

With Node.js and npm installed, run these commands at the project root.

```sh
npm i
npm run dev
```

Open [`http://localhost:5173/`](http://localhost:5173/).

## Interactivity

Set `visInteractivity` in `src/routes/+page.svelte`.

- `false` (default) shows a date picker to filter the scatter plot.
- `true` lets you drag across the line chart to filter the scatter plot and hover over a point to see job details.

## Learn more about D3

- Official setup guide with a first chart: [Getting started](https://d3js.org/getting-started)
- Practical guides to selections, scales, and interactions: [D3 in Depth](https://www.d3indepth.com/)
- Browse working charts and their code: [Observable D3 gallery](https://observablehq.com/@d3/gallery)
- Find D3 functions by name or module: [API index](https://d3js.org/api)
- Map data to positions and draw labeled ticks: [Scales](https://d3js.org/d3-scale) and [axes](https://d3js.org/d3-axis)
- Bind data to elements and add, update, or remove marks: [Data joins](https://d3js.org/d3-selection/joining)
- Turn a series of values into a path: [Line generator](https://d3js.org/d3-shape/line)
- Respond to hover and other pointer events: [Event handling](https://d3js.org/d3-selection/events)
- Let users select a range by dragging: [Brushing](https://d3js.org/d3-brush)

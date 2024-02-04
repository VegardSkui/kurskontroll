import "./style.css";
import * as d3 from "d3";

const groups = [
  {
    color: "#57b7e9",
    value: 3000,
  },
  {
    color: "#f3d3e5",
    value: 4000,
  },
  {
    color: "#a1c145",
    value: 5000,
  },
  {
    color: "#d2d0cf",
    value: 6000,
  },
  {
    color: "#fdf491",
    value: 7000,
  },
  {
    color: "#e38db3",
    value: 8000,
  },
  {
    color: "#efc7b5",
    value: 9000,
  },
  {
    color: "#fae64d",
    value: 10000,
  },
  {
    color: "#b1d3b7",
    value: 11000,
  },
  {
    color: "#e6a037",
    value: 12000,
  },
];

const valueFormatter = Intl.NumberFormat("no");

// Build buttons to increase values
const increaseButtons = document.createElement("div");
increaseButtons.className = "buttons";
for (let d of groups) {
  let btn = document.createElement("button");
  btn.innerText = "INC";
  btn.onclick = () => {
    d.value += 1000;
    drawChart();
  };
  increaseButtons.append(btn);
}

// Build buttons to decrease values
const decreaseButtons = document.createElement("div");
decreaseButtons.className = "buttons";
for (let d of groups) {
  let btn = document.createElement("button");
  btn.innerText = "DEC";
  btn.onclick = () => {
    d.value = Math.max(d.value - 1000, 0);
    drawChart();
  };
  decreaseButtons.append(btn);
}

const x = d3
  .scaleBand()
  .domain(groups.map(d => d.color))
  .padding(0.2);

const y = d3.scaleLinear();

const svg = d3.create("svg");

// Add groups for the bars and bar texts
const bars = svg.append("g");
const barTexts = svg.append("g").classed("bar-texts", true);

// Add groups for the x- and y-axes
const xAxis = svg.append("g")
const yAxis = svg.append("g")

const marginTop = 20;
const marginRight = 0;
const marginBottom = 10;
const marginLeft = 50;

function drawChart() {
  const width = window.innerWidth;
  const height = window.innerHeight - 50;

  // Update the overall size of the SVG
  svg
    .attr("width", width)
    .attr("height", height);

  // Update the range of x and y in order to make the chart responsive. Also
  // update the domain of y since the values might have changed.
  x.range([marginLeft, width - marginRight]);
  y.range([height - marginBottom, marginTop])
    .domain([0, Math.max(d3.max(groups, (d) => d.value)!, 10_000)]);

  // Update the bars and their texts
  bars
    .selectAll("rect")
    .data(groups)
    .join("rect")
    .attr("y", d => y(d.value))
    .attr("fill", d => d.color)
    .attr("x", d => x(d.color)!)
    .attr("width", x.bandwidth())
    .attr("height", d => y(0) - y(d.value))
  barTexts
    .selectAll("text")
    .data(groups)
    .join("text")
    .attr("x", d => x(d.color)! + x.bandwidth() / 2)
    .attr("y", d => y(d.value) - 4)
    .attr("text-anchor", "middle")
    .text(d => valueFormatter.format(d.value));

  // Update the x- and y-axes
  xAxis
    .attr("transform", `translate(0, ${height - marginBottom})`)
    .call(d3.axisBottom(x).tickFormat(_x => "").tickSizeOuter(0));
  yAxis
    .attr("transform", `translate(${marginLeft}, 0)`)
    .call(d3.axisLeft(y).tickFormat(y => valueFormatter.format(y.valueOf())));
}

// Initialize the chart immediately and redraw when the window is resized
drawChart();
window.addEventListener("resize", drawChart);

document
  .querySelector<HTMLDivElement>("#app")!
  .append(increaseButtons, svg.node()!, decreaseButtons);

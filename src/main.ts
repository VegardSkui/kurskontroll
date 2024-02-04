import "./style.css";
import * as d3 from "d3";
import initialGroups from "./groups.json";

type Group = {
  color: string;
  value: number;
};

/** Load persisted groups from `localStorage`. */
function loadGroups(): Group[] | null {
  try {
    return JSON.parse(localStorage.getItem("groups") || "null")
  } catch {
    return null;
  }
}

/** Save groups to `localStorage`. */
function saveGroups(groups: Group[]): void {
  localStorage.setItem("groups", JSON.stringify(groups));
}

// Load previously saved groups or default to initial values
const groups: Group[] = loadGroups() || initialGroups;

const valueFormatter = Intl.NumberFormat("no");

// Build buttons to increase values
const increaseButtons = document.createElement("div");
increaseButtons.className = "buttons";
for (let d of groups) {
  let btn = document.createElement("button");
  btn.innerText = "\u2b06\ufe0f"; // Up Arrow Emoji
  btn.onclick = () => {
    d.value += 1000;
    drawChart();
    saveGroups(groups);
  };
  increaseButtons.append(btn);
}

// Build buttons to decrease values
const decreaseButtons = document.createElement("div");
decreaseButtons.className = "buttons";
for (let d of groups) {
  let btn = document.createElement("button");
  btn.innerText = "\u2b07\ufe0f"; // Down Arrow Emoji
  btn.onclick = () => {
    d.value = Math.max(d.value - 1000, 0);
    drawChart();
    saveGroups(groups);
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
  // Resize the SVG to fill the entire chart container (which is using flexbox
  // to dynamically fill the main section of the page)
  const width = chartContainer.clientWidth;
  const height = chartContainer.clientHeight;
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

const chartContainer = document.createElement("div");
chartContainer.id = "chart-container";
chartContainer.append(svg.node()!);

document
  .querySelector<HTMLDivElement>("#app")!
  .append(increaseButtons, chartContainer, decreaseButtons);

// Initialize the chart immediately and redraw when the window is resized
drawChart();
screen.orientation.addEventListener("change", drawChart);
window.addEventListener("resize", drawChart);

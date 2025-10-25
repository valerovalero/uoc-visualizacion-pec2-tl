// Tamaño del contenedor
const timelineHeight = 800;

const container = d3.select("#timeline");

// Cargar CSV
d3.csv("data/World Important Dates.csv").then(data => {

  // Convertir fechas y filtrar por año >= 2000
  const events = data
    .map(d => ({
      name: d["Name of Incident"],
      year: +d["Year"],
      month: +d["Month"],
      date: +d["Date"],
      country: d["Country"],
      type: d["Type of Event"]
    }))
    .filter(d => d.year >= 2000)
    .sort((a, b) => a.year - b.year);

  // Escala vertical
  const yScale = d3.scaleLinear()
    .domain([d3.min(events, d => d.year), d3.max(events, d => d.year)])
    .range([0, timelineHeight]);

  // Crear eventos en el timeline
  container.selectAll(".event")
    .data(events)
    .enter()
    .append("div")
    .attr("class", "event")
    .style("top", d => yScale(d.year) + "px")
    .html(d => `<strong>${d.year}-${String(d.month).padStart(2, "0")}-${String(d.date).padStart(2, "0")}</strong><br>${d.name}<br>${d.country}`);

  // Crear etiquetas de años (cada 5 años)
  const years = d3.range(d3.min(events, d => d.year), d3.max(events, d => d.year)+1, 5);
  container.selectAll(".year-label")
    .data(years)
    .enter()
    .append("div")
    .attr("class", "year-label")
    .style("top", d => yScale(d) + "px")
    .text(d => d);

}).catch(err => console.error(err));

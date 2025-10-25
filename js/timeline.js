const timelineHeight = 800;
const container = d3.select("#timeline");

// Cargar CSV
d3.csv("data/World Important Dates.csv").then(data => {

  const events = data
    .map(d => ({
      name: d["Name of Incident"],
      year: +d["Year"],
      month: +d["Month"],
      date: +d["Date"],
      country: d["Country"]
    }))
    .filter(d => d.year >= 2000)
    .sort((a, b) => new Date(a.year, a.month - 1, a.date) - new Date(b.year, b.month - 1, b.date));

  if (events.length === 0) {
    console.warn("No hay eventos a partir del año 2000.");
    return;
  }

  const minYear = d3.min(events, d => d.year);
  const maxYear = d3.max(events, d => d.year);

  // Escala vertical por año
  const yScale = d3.scaleLinear()
    .domain([minYear, maxYear])
    .range([0, timelineHeight]);

  // Agrupar eventos por año
  const eventsByYear = d3.group(events, d => d.year);

  // Para cada año, mostrar solo **una ficha** (el primer evento si hay)
  for (let year = minYear; year <= maxYear; year++) {
    const yearEvents = eventsByYear.get(year) || [];
    const event = yearEvents[0] || { name: "", country: "" }; // Si no hay evento, valores vacíos
    const topPos = yScale(year);

    container.append("div")
      .attr("class", "event")
      .style("top", topPos + "px")
      .style("width", "350px")
      .html(`<strong>${year}</strong> - ${event.name} - ${event.country}`);  }

  // Crear etiquetas de año (cada 5 años)
  const years = d3.range(minYear, maxYear + 1, 5);
  container.selectAll(".year-label")
    .data(years)
    .enter()
    .append("div")
    .attr("class", "year-label")
    .style("top", d => yScale(d) + "px")
    .text(d => d);

}).catch(err => console.error(err));

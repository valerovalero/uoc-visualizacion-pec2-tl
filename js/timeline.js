const timelineHeight = 800;
const container = d3.select("#timeline");

// Cargar CSV
d3.csv("World Important Dates.csv").then(data => {

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
    .sort((a, b) => new Date(a.year, a.month - 1, a.date) - new Date(b.year, b.month - 1, b.date));

  if (events.length === 0) {
    console.warn("No hay eventos a partir del año 2000.");
    return;
  }

  // Escala vertical según el año
  const minYear = d3.min(events, d => d.year);
  const maxYear = d3.max(events, d => d.year);
  const yScale = d3.scaleLinear()
    .domain([minYear, maxYear + 1]) // +1 para dejar espacio al último año
    .range([0, timelineHeight]);

  // Agrupar eventos por año
  const eventsByYear = d3.group(events, d => d.year);

  // Crear eventos en el timeline
  eventsByYear.forEach((eventsInYear, year) => {
    const yearY = yScale(year);
    const spacing = 25; // separación vertical entre eventos del mismo año

    eventsInYear.forEach((event, i) => {
      container.append("div")
        .attr("class", "event")
        .style("top", (yearY + i * spacing) + "px")
        .html(`<strong>${event.year}</strong><br>${event.name}<br>${event.country}`);
    });
  });

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

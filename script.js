// external json
var obj = new Object();
var error = new Object();
$.getJSON("books.js")
  .done(function (data) {
    obj = data;
  })
  .error(function (err) {
    error = err;
  });

// mapbox

mapboxgl.accessToken =
  "pk.eyJ1IjoiZG9tbGV0IiwiYSI6ImNscXNhNnd1ZTNvczUya3BoaGx5MGgwM2cifQ.Alj-V3JuDlT8TWGC4Xui_g";

var map = new mapboxgl.Map({
  container: "map",
  projection: "globe",
  style: "mapbox://styles/domlet/clqx1hpcj000k01rc3ihn75lf",
  // style: 'mapbox://styles/mapbox/satellite-v9',
  center: [-96, 37.8], // Example center coordinates (longitude, latitude)
  maxZoom: 10,
  minZoom: 2,
  zoom: 4,
  renderWorldCopies: false,
});
let hoveredPolygonId = null; // for mouseover effect

map.on("style.load", () => {
  map.addSource("mapbox-dem", {
    type: "raster-dem",
    url: "mapbox://mapbox.mapbox-terrain-dem-v1",
    tileSize: 512,
    maxzoom: 14,
  });
  // https://docs.mapbox.com/mapbox-gl-js/guides/globe/#atmosphere-styling
  map.setFog({
    color: "rgb(186, 210, 235)", // Lower atmosphere
    "high-color": "rgb(36, 92, 223)", // Upper atmosphere
    "horizon-blend": 0.02, // Atmosphere thickness (default 0.2 at low zooms)
    "space-color": "rgb(11, 11, 25)", // Background color
    "star-intensity": 0.6, // Background star brightness (default 0.35 at low zoooms )
  });
  // add the DEM source as a terrain layer with exaggerated height
  map.setTerrain({ source: "mapbox-dem", exaggeration: 50 });
});

map.on("load", () => {
  map.resize();

  // Add a new source using geoJSON
  map.addSource("states", {
    type: "geojson",
    data: "us_states.geojson",
  });

  // state fill colors
  map.addLayer(
    {
      id: "state-fills",
      type: "fill",
      source: "states",
      layout: {},
      paint: {
        "fill-color": "#fff",
        /*
          "fill-color": [
          "match",
          ["get", "STATE_NAME"],
          ["California", "Rhode Island", "Mississippi", "New York", "Texas", "West Virginia", "Utah", "Minnesota", "Florida", "Washington", "Maine", "Delaware", "South Carolina", "Michigan", "Missouri"],
          "#c9daad",
          ["Nevada", "Oklahoma", "Nebraska", "Connecticut", "Virginia", "Indiana", "Alaska"],
          "#fba05a",
          ["Wyoming", "Louisiana", "Kansas", "Arizona", "Tennessee", "Oregon", "Illinois", "New Jersey", "North Dakota", "Vermont"],
          "#d5bdd5",
          ["Colorado", "Alabama", "Wisconsin", "South Dakota", "Idaho", "Kentucky", "Massachusetts", "Arkansas", "North Carolina", "Hawaii", "Pennsylvania"],
          "#ffa8b1",
          ["New Mexico", "Ohio", "New Hampshire", "Iowa", "Montana", "Georgia", "Maryland"],
          "#ffdfbe",
          "hsla(0, 30%, 31%, 0.65)" // fallback
          ],
          */
        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0.5,
          0,
        ],
      },
    },
    "hillshade"
  );
  // state borders
  map.addLayer({
    id: "state-borders",
    type: "line",
    source: "states",
    layout: {},
    paint: {
      "line-color": "#000",
      "line-width": 2,
    },
  });
  // state labels
  map.addLayer({
    id: "state-labels",
    type: "symbol",
    source: "states",
    layout: {
      "text-field": ["to-string", ["get", "STATE_NAME"]],
      "text-font": ["Dancing Script Regular", "Arial Unicode MS Regular"],
    },
    paint: {},
  });

  // When the user moves their mouse over the state-fill layer, we'll update the
  // feature state for the feature under the mouse.
  map.on("mousemove", "state-fills", (e) => {
    if (e.features.length > 0) {
      if (hoveredPolygonId !== null) {
        map.setFeatureState(
          { source: "states", id: hoveredPolygonId },
          { hover: false }
        );
      }
      hoveredPolygonId = e.features[0].id;
      map.setFeatureState(
        { source: "states", id: hoveredPolygonId },
        { hover: true }
      );
    }
  });

  // When the mouse leaves the state-fill layer, update the feature state of the
  // previously hovered feature.
  map.on("mouseleave", "state-fills", () => {
    if (hoveredPolygonId !== null) {
      map.setFeatureState(
        { source: "states", id: hoveredPolygonId },
        { hover: false }
      );
    }
    hoveredPolygonId = null;
  });

  // popups
  map.on("click", "state-fills", (e) => {
    // Copy coordinates array.
    const coordinates = e.features[0].geometry.coordinates.slice();
    const stateName = e.features[0].properties.STATE_NAME;
    const result = obj.find((obj) => {
      return obj.state_long === stateName;
    });
    new mapboxgl.Popup()
      .setLngLat(coordinates[0][0])
      .setHTML(
        (document.getElementsByClassName("mapboxgl-popup-content").innerHTML =
          "<h4>" +
          stateName +
          " #" +
          result.state_num +
          " (" +
          result.state_ratified_year +
          ")</h4 > " +
          "<h2>" +
          result.title +
          '</h2><a href="' +
          result.url +
          '" target="_blank"><img src="' +
          result.img +
          '" alt="" /></a><h3> by ' +
          result.author +
          "</h3><p>" +
          result.description +
          "<hr><p><strong>Published:</strong> " +
          result.published +
          "</p><p><strong>Pages: </strong>" +
          result.pagecount +
          "</p><p><strong>Average rating:</strong> " +
          result.average_rating +
          "</p><p><a href='" +
          result.audiobook_url +
          "'>Audiobook</a></p>")
      )
      .addTo(map);
  });
});

import logo from "./logo.svg";
import "./App.css";
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken =
  "pk.eyJ1IjoiY2JhdHRlbnBsb3dyaWdodCIsImEiOiJjbG1ybHg0YXowMXNxMm1xY2hmNHFhN243In0.9oNc1GPQFf9qqxck4IJMnA";

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-122.662323);
  const [lat, setLat] = useState(45.523751);
  const [zoom, setZoom] = useState(9);
  const bounds = [
    [-123.069003, 45.395273],
    [-122.303707, 45.612333],
  ];

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
      maxBounds: bounds,
    });
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  }, []);

  const start = [-122.662323, 45.523751];
  const getRoute = async () => {
    const data = {
      waypoints: [
        {
          location: [-84.518399, 39.134126],
          name: "",
        },
        {
          location: [-84.511987, 39.102638],
          name: "East 6th Street",
        },
      ],
      routes: [
        {
          legs: [
            {
              steps: [],
              weight: 1332.6,
              distance: 4205,
              summary: "",
              duration: 1126,
            },
          ],
          weight_name: "cyclability",
          geometry: {
            coordinates: [
              [-84.518399, 39.134126],
              [-84.51841, 39.133781],
              [-84.520024, 39.133456],
              [-84.520321, 39.132597],
              [-84.52085, 39.128019],
              [-84.52036, 39.127901],
              [-84.52094, 39.122783],
              [-84.52022, 39.122713],
              [-84.520768, 39.120841],
              [-84.519639, 39.120268],
              [-84.51233, 39.114141],
              [-84.512652, 39.11311],
              [-84.512399, 39.112216],
              [-84.513232, 39.112084],
              [-84.512127, 39.107599],
              [-84.512904, 39.107489],
              [-84.511692, 39.102682],
              [-84.511987, 39.102638],
            ],
            type: "LineString",
          },
          weight: 1332.6,
          distance: 4205,
          duration: 1126,
        },
      ],
      code: "Ok",
    };
    const route = data.geometry.coordinates;
    const geojson = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: route,
      },
    };
    if (map.getSource("route")) {
      map.getSource("route").setData(geojson);
    } else {
      map.addLayer({
        id: "route",
        type: "line",
        source: {
          type: "geojson",
          data: geojson,
        },
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#3887be",
          "line-width": 5,
          "line-opacity": 0.75,
        },
      });
    }
  };
  //   map.on("load", () => {
  //     // make an initial directions request that
  //     // starts and ends at the same location
  //     getRoute(start);

  //     // Add starting point to the map
  //     map.addLayer({
  //       id: "point",
  //       type: "circle",
  //       source: {
  //         type: "geojson",
  //         data: {
  //           type: "FeatureCollection",
  //           features: [
  //             {
  //               type: "Feature",
  //               properties: {},
  //               geometry: {
  //                 type: "Point",
  //                 coordinates: start,
  //               },
  //             },
  //           ],
  //         },
  //       },
  //       paint: {
  //         "circle-radius": 10,
  //         "circle-color": "#3887be",
  //       },
  //     });
  //     // this is where the code from the next step will go
  //   });

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default App;

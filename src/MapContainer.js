import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

const MapContainer = ({ ordersList }) => {
  mapboxgl.accessToken = process.env.REACT_APP_API_KEY;

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-84.518399);
  const [lat, setLat] = useState(39.134126);
  const [zoom, setZoom] = useState(9);
  const stops = [];
  const bounds = [
    [-123.069003, 45.395273],
    [-122.303707, 45.612333]
  ];
  const depotLocation = [-84.518399, 39.134126];

  const [waypoints, setWaypoints] = useState([]);

  const getWaypoints = () => {
    // get ordersList
    // For each order get coordinates array out of object
    // For each coordinates array add to waypoints string
    // each set of coordinates seperated by a semicolon
    // longitude and latitude seperated by a comma
    const orders = ordersList;
    console.log(orders);
    for (let order of orders) {
      const coordinates = order.coordinates;
      console.log(coordinates);
      stops.push(coordinates);
      console.log(stops);
    }
    setWaypoints(stops.join(";"));
    console.log(waypoints);
  };

  //
  useEffect(() => {
    getWaypoints();
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom
      // maxBounds: bounds
    });
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    // On map load get directions and plot markers onto map
    map.current.on("load", () => {
      getRoute(depotLocation, waypoints);
      // Add starting point to the map
      const start = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: depotLocation
            }
          }
        ]
      };
      if (map.current.getLayer("start")) {
        map.current.getSource("start").setData(start);
      } else {
        map.current.addLayer({
          id: "start",
          type: "circle",
          source: {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "Point",
                    coordinates: depotLocation
                  }
                }
              ]
            }
          },
          paint: {
            "circle-radius": 10,
            "circle-color": "#3887be"
          }
        });
      }

      //   adding endpoint to map
      const end = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: depotLocation
            }
          }
        ]
      };
      if (map.current.getLayer("end")) {
        map.current.getSource("end").setData(end);
      } else {
        map.current.addLayer({
          id: "end",
          type: "circle",
          source: {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "Point",
                    coordinates: [-84.511987, 39.102638]
                  }
                }
              ]
            }
          },
          paint: {
            "circle-radius": 10,
            "circle-color": "#f30"
          }
        });
      }
      const newWaypoints = [
        [-84.5215, 39.1085],
        [-84.5059, 39.1327],
        [-84.5314, 39.1505],
        [-84.5424, 39.1373]
      ];
      // adding waypoints to map
      for (let i = 0; i < newWaypoints.length; i++) {
        console.log(newWaypoints[i]);
        const waypoint = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: newWaypoints[i]
              }
            }
          ]
        };
        if (map.current.getLayer(`${waypoint[i]}`)) {
          map.current.getSource(`${waypoint[i]}`).setData(waypoint[i]);
        } else {
          map.current.addLayer({
            id: `${waypoint[i]}`,
            type: "circle",
            source: {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: [
                  {
                    type: "Feature",
                    properties: {},
                    geometry: {
                      type: "Point",
                      coordinates: newWaypoints[i]
                    }
                  }
                ]
              }
            },
            paint: {
              "circle-radius": 10,
              "circle-color": "#98fb98"
            }
          });
        }
      }
    });
  }, []);

  // sends request to Direction API for direction JSON object
  const getRoute = async (depotLocation, waypoints) => {
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${depotLocation[0]},${depotLocation[1]};-84.5215,39.1085;-84.5059,39.1327;-84.5314,39.1505;-84.5424,39.1373;${depotLocation[0]},${depotLocation[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
      { method: "GET" }
    );

    const json = await query.json();
    const data = json.routes[0];
    //   const dummyData = {
    //     waypoints: [
    //       {
    //         location: [-84.518399, 39.134126],
    //         name: ""
    //       },
    //       {
    //         location: [-84.511987, 39.102638],
    //         name: "East 6th Street"
    //       },
    //       {
    //         location: [-84.510287, 39.10356],
    //         name: ""
    //       }
    //     ],
    //     routes: [
    //       {
    //         legs: [
    //           {
    //             steps: [],
    //             weight: 1332.6,
    //             distance: 4205,
    //             summary: "",
    //             duration: 1126
    //           }
    //         ],
    //         weight_name: "cyclability",
    //         geometry: {
    //           coordinates: [
    //             [-84.518399, 39.134126],
    //             [-84.51841, 39.133781],
    //             [-84.520024, 39.133456],
    //             [-84.520321, 39.132597],
    //             [-84.52085, 39.128019],
    //             [-84.52036, 39.127901],
    //             [-84.52094, 39.122783],
    //             [-84.52022, 39.122713],
    //             [-84.520768, 39.120841],
    //             [-84.519639, 39.120268],
    //             [-84.51233, 39.114141],
    //             [-84.512652, 39.11311],
    //             [-84.512399, 39.112216],
    //             [-84.513232, 39.112084],
    //             [-84.512127, 39.107599],
    //             [-84.512904, 39.107489],
    //             [-84.511692, 39.102682],
    //             [-84.511987, 39.102638]
    //           ],
    //           type: "LineString"
    //         },
    //         weight: 1332.6,
    //         distance: 4205,
    //         duration: 1126
    //       }
    //     ],
    //     code: "Ok"
    //   };
    const route = data.geometry.coordinates;
    const geojson = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: route
      }
    };
    // if the route already exists on the map, we'll reset it using setData
    if (map.current.getSource("route")) {
      map.current.getSource("route").setData(geojson);
    }
    // otherwise, we'll make a new request
    else {
      map.current.addLayer({
        id: "route",
        type: "line",
        source: {
          type: "geojson",
          data: geojson
        },
        layout: {
          "line-join": "round",
          "line-cap": "round"
        },
        paint: {
          "line-color": "#3887be",
          "line-width": 5,
          "line-opacity": 0.75
        }
      });
    }
  };

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
};

export default MapContainer;

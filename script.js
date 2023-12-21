    
    // Define constants and variables
    const busRoutesFile = 'busRoutes.json';
    let userName = '';
    let isStudent = false;
    let map;
    let busRoutes;

    // Function to greet the user based on the time of day
    async function findBusRoutes(startTransit, endTransit) {
      const response = await fetch(busRoutesFile);
      busRoutes = await response.json();
    
      const availableRoutes = [];
    
      const startNode = { transit: startTransit, parent: null, bus: null, distance: 0, fare: 0 };
      const queue = [startNode];
      const visitedRoutes = new Set(); // Keep track of visited routes
    
      while (queue.length > 0) {
        const currentNode = queue.shift();
    
        if (currentNode.transit === endTransit) {
          const route = buildRoute(currentNode);
          availableRoutes.push(route);
        }
    
        const currentRoutes = busRoutes.filter(route =>
          route.transits.some(transit => transit.name === currentNode.transit)
        );
    
        // Check for a direct route
        const directRoute = currentRoutes.find(route =>
          route.transits.some(transit => transit.name === endTransit)
        );
    
        if (directRoute) {
          const directTransit = directRoute.transits.find(transit => transit.name === endTransit);
          const directNode = {
            transit: directTransit.name,
            parent: currentNode,
            bus: directRoute.busName,
            distance: currentNode.distance + (directTransit.distance || 0),
            fare: calculateFare(currentNode.distance + (directTransit.distance || 0)),
          };
          availableRoutes.push(buildRoute(directNode));
        } else {
          for (const route of currentRoutes) {
            const nextTransits = route.transits.slice(
              route.transits.findIndex(transit => transit.name === currentNode.transit) + 1
            );
    
            for (const nextTransit of nextTransits) {
              const isDirectRoute = nextTransit.name === endTransit && route.busName === currentNode.bus;
    
              if (isDirectRoute || route.busName !== currentNode.bus) {
                const distance = currentNode.distance + (nextTransit.distance || 0);
                const fare = calculateFare(distance);
    
                const newNode = {
                  transit: nextTransit.name,
                  parent: currentNode,
                  bus: isDirectRoute ? currentNode.bus : route.busName,
                  distance: distance,
                  fare: fare,
                };
    
                const routeKey = `${currentNode.transit}-${newNode.transit}-${newNode.bus}`;
                if (!visitedRoutes.has(routeKey)) {
                  queue.push(newNode);
                  visitedRoutes.add(routeKey);
                }
              }
            }
          }
        }
      }
    
      return availableRoutes;
    }
    





// Function to build a textual route based on transit nodes
function buildRoute(node) {
  const route = [];
  let currentNode = node;
  let directBus = false;

  // Create a set to keep track of visited transit locations
  const visitedTransits = new Set();

  while (currentNode !== null) {
    if (currentNode.bus) {
      const nextNode = currentNode.parent;

      if (directBus || !nextNode || nextNode.bus !== currentNode.bus) {
        // Suggest a direct bus if already in a direct route or changing to a different bus
        route.unshift(`Catch ${currentNode.bus} and reach ${currentNode.transit}`);
        visitedTransits.add(currentNode.transit);
        directBus = true;
      }
    } else {
      // Check if the transit has already been visited
      if (!visitedTransits.has(currentNode.transit)) {
        route.unshift(`Get to ${currentNode.transit}`);
        visitedTransits.add(currentNode.transit);
      }
    }

    currentNode = currentNode.parent;
  }

  // Only append fare and distance information if there are changes in the route
  if (route.length > 1) {
    route[route.length - 1] += ` (Fare: Rs ${node.fare}, Distance: ${node.distance} km)`;
  }

  return route;
}





// Function to calculate fare based on distance and student status

    function calculateFare(distance) {
      let fare = 0;

      if (distance <= 5) {
        fare = 20;
      } else if (distance <= 10) {
        fare = 27;
      } else if (distance <= 15) {
        fare = 32;
      } else if (distance <= 20) {
        fare = 35;
      } else {
        fare = 40;
      }

      if (isStudent) {
        fare *= 0.55; // Apply 45% discount for students
      }

      return fare;
    }


    // Function to find and display available bus routes

 async function findAndDisplayRoutes() {
  const startTransit = document.getElementById('startTransit').value;
  const endTransit = document.getElementById('endTransit').value;

  const availableRoutes = await findBusRoutes(startTransit, endTransit);

  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '';

  if (availableRoutes.length > 0) {
    const heading = document.createElement('h2');
    heading.textContent = `Available routes from ${startTransit} to ${endTransit}:`;
    resultDiv.appendChild(heading);

    const ul = document.createElement('ul');

    for (const route of availableRoutes) {
      const li = document.createElement('li');
      li.classList.add('route-info');
      const routeText = route.join(', and then ');
      li.textContent = routeText;
      ul.appendChild(li);
    }

    resultDiv.appendChild(ul);

    // Plot bus route on the map
    plotBusRoute(startTransit, endTransit); // Pass the start and end transit values
  } else {
    const message = document.createElement('p');
    message.textContent = `No route available from ${startTransit} to ${endTransit}.`;
    resultDiv.appendChild(message);
  }
}



// Function to toggle student discount

    function toggleStudentDiscount() {
      isStudent = document.getElementById('studentDiscount').checked;
    }


    // Function to plot bus route on the map

 function plotBusRoute(startTransit, endTransit) {
  if (map) {
    map.remove();
  }

  map = L.map('map').setView([27.7172, 85.3240], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);

  const startTransitInfo = busRoutes.flatMap(route => route.transits).find(item => item.name === startTransit);
  const endTransitInfo = busRoutes.flatMap(route => route.transits).find(item => item.name === endTransit);

  const startMarker = L.marker([startTransitInfo.latitude, startTransitInfo.longitude])
    .addTo(map)
    .bindPopup(startTransitInfo.name);

  const endMarker = L.marker([endTransitInfo.latitude, endTransitInfo.longitude])
    .addTo(map)
    .bindPopup(endTransitInfo.name);

  const start = [startTransitInfo.longitude, startTransitInfo.latitude];
  const end = [endTransitInfo.longitude, endTransitInfo.latitude];

  const directionsRequest = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf62483609c9b3df73484dabfd19a46bde9e85&start=${start[0]},${start[1]}&end=${end[0]},${end[1]}`;

  fetch(directionsRequest)
    .then(response => response.json())
    .then(data => {
      const routeCoordinates = data.features[0].geometry.coordinates;

      const routeLine = L.polyline(routeCoordinates.map(coord => [coord[1], coord[0]]), { color: 'blue', weight: 5, opacity: 0.7 }).addTo(map);

      const group = new L.featureGroup([startMarker, endMarker, routeLine]);
      map.fitBounds(group.getBounds().pad(0.2));

      // Get user's location and display marker
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
          const userLatLng = [position.coords.latitude, position.coords.longitude];

          // Custom icon for user's location marker
          const userIcon = L.icon({
            iconUrl: 'location-icon.png',
            iconSize: [44, 44],
            iconAnchor: [16, 32]
          });

          const userMarker = L.marker(userLatLng, { icon: userIcon }).addTo(map);
          group.addLayer(userMarker);
        });
      }
    });
}








//  variables to store transit options
let transitOptions = [];
let filteredStartTransitOptions = [];
let filteredEndTransitOptions = [];

//  event listeners to input fields
const startTransitInput = document.getElementById('startTransit');
startTransitInput.addEventListener('input', handleStartTransitInput);

const endTransitInput = document.getElementById('endTransit');
endTransitInput.addEventListener('input', handleEndTransitInput);

// Handle input in the starting transit input field
function handleStartTransitInput() {
  const userInput = startTransitInput.value.trim();
  filteredStartTransitOptions = filterTransitOptions(userInput);
  showStartTransitOptions();
}

// Functions to handle input and filter transit options
function handleEndTransitInput() {
  const userInput = endTransitInput.value.trim();
  filteredEndTransitOptions = filterTransitOptions(userInput);
  showEndTransitOptions();
}

// Function to filter transit options based on user input
function filterTransitOptions(userInput) {
  return transitOptions.filter(transit => transit.toLowerCase().includes(userInput.toLowerCase()));
}

// Functions to show filtered transit options in the dropdown
function showStartTransitOptions() {
  const dropdown = document.getElementById('startTransitDropdown');
  dropdown.innerHTML = '';

  filteredStartTransitOptions.forEach(option => {
    const div = document.createElement('div');
    div.classList.add('dropdown-option');
    div.textContent = option;
    div.addEventListener('click', () => {
      startTransitInput.value = option;
      dropdown.innerHTML = '';
    });
    dropdown.appendChild(div);
  });
}

// Show filtered ending transit options in the dropdown

function showEndTransitOptions() {
  const dropdown = document.getElementById('endTransitDropdown');
  dropdown.innerHTML = '';

  filteredEndTransitOptions.forEach(option => {
    const div = document.createElement('div');
    div.classList.add('dropdown-option');
    div.textContent = option;
    div.addEventListener('click', () => {
      endTransitInput.value = option;
      dropdown.innerHTML = '';
    });
    dropdown.appendChild(div);
  });
}

// Function to fetch transit options from JSON file

async function fetchTransitOptions() {
  const response = await fetch(busRoutesFile);
  busRoutes = await response.json();

  // Extract unique transit names using Set
  const uniqueTransitNames = new Set(busRoutes.flatMap(route => route.transits.map(transit => transit.name)));

  transitOptions = Array.from(uniqueTransitNames);
}

// Call the fetchTransitOptions function to populate the transit options
fetchTransitOptions();



# Sahayatri App Documentation (Version 1.0)

## Table of Contents
1. **Introduction**
2. **Getting Started**
    - Prerequisites
    - Installation
3. **App Overview**
    - Purpose
    - Features
4. **Usage Guide**
    - Greeting the User
    - Finding Bus Routes
    - Student Discount
    - Viewing Routes on the Map
5. **Technical Details**
    - File Structure
    - JavaScript Functions
    - CSS Styling
6. **APIs and External Services**
7. **Troubleshooting**
8. **Future Enhancements**
9. **Contributing**
10. **License**

---

## 1. Introduction

The Sahayatri App is a comprehensive bus transit planner designed to assist users in finding bus routes, calculating fares, and displaying directions on an interactive map. This documentation will guide you through the installation, usage, and technical aspects of the app.

## 2. Getting Started

### Prerequisites

To use the Sahayatri App, you need the following prerequisites:

- A modern web browser (e.g., Chrome, Firefox, or Safari).
- Internet access to fetch bus route data and map information.

### Installation

1. Download the Sahayatri App files (HTML, JavaScript, CSS, and JSON) to your local machine.

2. Open the `index.html` file in a web browser to launch the app.

## 3. App Overview

### Purpose

The Sahayatri App serves as a convenient tool for users to:

- Find bus routes between two transit points.
- Calculate bus fares based on distance traveled.
- Toggle a student discount for discounted fares.
- View selected routes on an interactive map.

### Features

- User-friendly interface with input fields and a map display.
- Dynamic greeting based on the time of day.
- Auto-completion for transit inputs.
- Route information including bus changes, fares, and distances.
- Interactive map with markers for starting and ending points.

## 4. Usage Guide

### Greeting the User

Upon opening the app, a greeting message will appear. The app will automatically greet you with "Good morning," "Good afternoon," or "Good evening" based on the current time of day. If it's your first time using the app, you will be prompted to enter your name, which will be stored for future visits.

### Finding Bus Routes

1. Start by entering your starting transit point in the "Starting Transit" input field.

2. Similarly, enter your ending transit point in the "Ending Transit" input field.

3. Click the "Find Route" button to discover available bus routes.

4. The app will display a list of available routes, including information about bus changes, fares, and distances.

### Student Discount

- You can toggle the "Are you a student?" checkbox to apply a 45% discount to the calculated fare.

### Viewing Routes on the Map

- After finding a route, the app will display it on an interactive map. You can view markers for the starting and ending points as well as the route itself.

## 5. Technical Details

### File Structure

- `index.html`: The main HTML file that structures the app's layout and content.
- `busRoutes.json`: JSON data containing bus route information.
- `script.js`: JavaScript file responsible for the app's functionality.
- `style.css`: CSS file for styling the app's elements.

### JavaScript Functions

The `script.js` file contains various functions, including:

- `greetUser()`: Greets the user based on the time of day.
- `findBusRoutes(startTransit, endTransit)`: Finds available bus routes.
- `buildRoute(node)`: Constructs textual representations of bus routes.
- `calculateFare(distance)`: Calculates fares based on distance.
- `findAndDisplayRoutes()`: Retrieves user inputs and displays available routes.
- `toggleStudentDiscount()`: Toggles the student discount.
- `plotBusRoute(startTransit, endTransit)`: Displays routes on the map.
- Auto-completion functions for transit inputs.

### CSS Styling

- The `style.css` file defines the app's styling, including buttons, labels, input fields, and map display.
- Media queries are used for responsive design on smaller screens.

## 6. APIs and External Services

- The Sahayatri App uses Leaflet.js for map functionality.
- It fetches driving directions from the OpenRouteService API.

## 7. Troubleshooting

- In case of issues, ensure you have an internet connection for fetching map data and directions.
- Verify that the provided transit points exist in the `busRoutes.json` file.

## 8. Future Enhancements

- Potential future enhancements may include real-time bus tracking, additional transit options, and improved user interface.

## 9. Contributing

- If you wish to contribute to the Sahayatri App, feel free to submit pull requests or open issues on the project's repository.

## 10. License

- The Sahayatri App is open-source software released under the [MIT License](LICENSE).

---

This documentation provides an in-depth understanding of the Sahayatri App, including installation, usage, technical details, and future plans. Enjoy using the app, and feel free to contribute to its development!
# PlacesFinder

PlacesFinder is a powerful application that allows users to search for interesting places in their vicinity. Whether you're looking for restaurants, parks, museums, or any other type of place, PlacesFinder has got you covered.

## Features

- **Search**: Easily search for places based on keywords, categories, or specific locations.
- **Filters**: Refine your search results by applying transportation filters such as bycicling, walking, public transportation, ...
- **Map View**: Visualize the search results on an interactive map, making it easier to locate and explore nearby places.
- **Detailed Information**: Get detailed information about each place, including photos, reviews, contact details, and opening hours.
- **Navigation**: Get directions to a place using integrated navigation services.

## Getting Started

To get started with PlacesFinder, follow these steps:

1. Clone the repository: `$ git clone https://github.com/your-username/PlacesFinder.git`
2. Install the required dependencies: `$ npm install`
3. Configure the API keys: Open the `config.js` file and replace the placeholder API keys with your own keys.
4. Start the application: `$ npm start`
5. Access the application in your browser at `http://localhost:3000`.

### Google API key

The Google API key is required to access the Google Maps and Places APIs, which are used by the application to display maps, search for places, and retrieve detailed information about those places.

Here are the steps to obtain a Google API key and replace it in the index.html script:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing project.
3. Enable the necessary APIs: Google Maps JavaScript API and Google Places API.
4. Go to the "Credentials" section in the left sidebar.
5. Click on the "Create Credentials" button and select "API key".
6. Copy the generated API key.
7. Open the `index.html` file in your code editor.
8. Look for the following line of code:
   ```html
   <script src="https://maps.googleapis.com/maps/api/js?key=KEY&libraries=places"></script>
   ```
9. Replace the KEY placeholder with your own API key.

Once you have replaced the `KEY` variable with your Google API key, the PlacesFinder application will be able to communicate with the Google Maps and Places APIs, allowing you to search for places, view maps, and access detailed information about those places.

## Contributing

If you'd like to contribute to PlacesFinder, please follow these guidelines:

1. Fork the repository.
2. Create a new branch: `$ git checkout -b feature/your-feature-name`
3. Make your changes and commit them: `$ git commit -am 'Add some feature'`
4. Push to the branch: `$ git push origin feature/your-feature-name`
5. Submit a pull request.

## License

PlacesFinder is released under the MIT License. See the [LICENSE](./LICENSE.md) file for more details.

## Contact

If you have any questions or suggestions, feel free to reach out to us at Kjell.vandenbossche@student.hogent.be.

Happy exploring with PlacesFinder!

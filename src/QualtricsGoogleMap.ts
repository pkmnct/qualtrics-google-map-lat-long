interface Map {
    css?: string;
    options?: google.maps.MapOptions;
    markers?: {
        autocomplete?: {
            enabled: boolean;
            css?: string;
            invalidLocationAlertText: string;
        },
        options: google.maps.MarkerOptions;
    }[];
}

interface Question {
    id: string;
    container: Node;
    map: Map;
}

const initGoogleMapsQuestion = (
  id: Question['id'],
  container: Question['container'],
  map: Question['map'],
): void | Error => {
  // Find the dataBox and hide it
  const dataBox = document.getElementById('QR~' + id) as HTMLInputElement | null;
  if (!dataBox) {
    return new Error(`Could not find input for question with id ${id}.`);
  }
  // TODO: perhaps show a loader here
  dataBox.style.display = 'none';

  // Function to set the dataBox to a lat/lng
  const setLatLng = (LatLng: google.maps.LatLng) => {
    dataBox.value = JSON.stringify(LatLng);
  };

  // Create the map node
  const mapObject = document.createElement('div');
  mapObject.setAttribute('id', `${id}-map`);
  if (map.css) {
    mapObject.setAttribute('style', map.css);
  }
  container.appendChild(mapObject);

  // Initialize the Google Map
  const googleMap = new google.maps.Map(mapObject, map.options);

    // Initialize the Markers
    map.markers?.forEach((marker, index) => {
      const mapMarker = new google.maps.Marker(marker.options);
      if (marker.autocomplete?.enabled) {
        // TODO: user mapMarker title as field title, or add title option, or use marker icon
        const locationInput = document.createElement('input');
        locationInput.setAttribute('id', `${id}-${index}-locationInput`);
        if (marker.autocomplete.css) {
          mapObject.setAttribute('style', marker.autocomplete.css);
        }
        container.appendChild(locationInput);

        // Load the places API
        const locationAutocomplete = new google.maps.places.Autocomplete(locationInput);

        // Whenever the inputs change, set the locationLatLong and pan the map to the location
        google.maps.event.addListener(locationAutocomplete, 'place_changed', () => {
          const place = locationAutocomplete.getPlace();

          if (place.geometry) {
            mapMarker.setPosition(place.geometry.location);
            googleMap.panTo(place.geometry.location);
            setLatLng(place.geometry.location);
          } else {
            alert(marker.autocomplete?.invalidLocationAlertText || 'Invalid Location');
          }
        });
      }
      // When the marker is clicked, store the lat/lng
      google.maps.event.addListener(mapMarker, 'click', event => {
        setLatLng(event.latLng);
      });
      // When the pin is dragged, store the lat/lng where it ends
      google.maps.event.addListener(mapMarker, 'dragend', event => {
        setLatLng(event.latLng);
      });

    });
};

// Typescript doesn't allow augmentation of the global scope except in modules, but we need to expose this to the global scope
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.initGoogleMapsQuestion = initGoogleMapsQuestion;
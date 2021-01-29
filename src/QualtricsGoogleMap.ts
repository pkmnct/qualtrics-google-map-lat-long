interface Map {
  css?: string;
  options: google.maps.MapOptions;
  markers?: {
    autocomplete?: {
      enabled: boolean;
      label: string;
      css?: string;
      labelCss?: string;
      invalidLocationAlertText: string;
    },
    options: google.maps.MarkerOptions;
  }[];
}

interface Question {
  id: string;
  container: Element;
  map: Map;
}

const initGoogleMapsQuestion = (
  id: Question['id'],
  container: Question['container'],
  map: Question['map'],
): void | Error => {
  // Find the dataBox and hide it
  const dataBox = document.getElementById(`QR~${id}`) as HTMLInputElement | null;
  if (!dataBox) {
    return new Error(`Could not find input for question with id ${id}.`);
  }
  dataBox.style.display = 'none';

  // Find the QuestionBody to append to
  const questionBody = container.querySelector('.QuestionBody') || container;

  // Initialize data storage or load from existing data in field
  const value: { [key: number]: google.maps.LatLng } = dataBox.value !== '' ? JSON.parse(dataBox.value) : {};

  // Function to set the dataBox to a lat/lng
  const setLatLng = (key: number, latLng: google.maps.LatLng) => {
    value[key] = latLng;
    dataBox.value = JSON.stringify(value);
  };

  const styles = document.createElement('style');
  document.head.appendChild(styles);

  // Create the map node
  const mapObject = document.createElement('div');
  mapObject.setAttribute('id', `${id}-map`);
  if (map.css) {
    styles.innerText += `#${id}-map {${map.css}}`;
    mapObject.setAttribute('style', map.css);
  } else {
    styles.innerText += `#${id}-map {height: 300px;}`;
  }
  questionBody.appendChild(mapObject);

  // Initialize the Google Map
  const googleMap = new google.maps.Map(mapObject, map.options);

  // Initialize the Markers
  map.markers?.forEach((marker, index) => {
    // Create the marker
    const mapMarker = new google.maps.Marker({
      ...marker.options,
      map: googleMap,
      position: index in value ? value[index] : marker.options.position || map.options.center,
    });

    if (marker.autocomplete?.enabled) {
      const inputId = `${id}-${index}-locationInput`;

      // Make the label for the autocomplete
      const locationLabel = document.createElement('label');
      locationLabel.setAttribute('for', inputId);
      locationLabel.setAttribute('id', `${inputId}-label`);
      locationLabel.setAttribute('class', 'QuestionText');
      if (marker.autocomplete.labelCss) {
        styles.innerText += `#${inputId}-label {${marker.autocomplete.labelCss}}`;
      }
      locationLabel.innerText = marker.autocomplete.label || marker.options.title || `Marker ${marker.options.label ? marker.options.label : index}`;
      questionBody.appendChild(locationLabel);

      // Make the autocomplete
      const locationInput = document.createElement('input');
      locationInput.setAttribute('id', inputId);
      locationInput.setAttribute('class', 'InputText');
      if (marker.autocomplete.css) {
        styles.innerText += `#${id}-${index}-locationInput {${marker.autocomplete.css}}`;
      }
      questionBody.appendChild(locationInput);

      // Load the places API
      const locationAutocomplete = new google.maps.places.Autocomplete(locationInput);

      // Whenever the inputs change, set the locationLatLong and pan the map to the location
      google.maps.event.addListener(locationAutocomplete, 'place_changed', () => {
        const place = locationAutocomplete.getPlace();

        if (place.geometry) {
          mapMarker.setPosition(place.geometry.location);
          googleMap.panTo(place.geometry.location);
          setLatLng(index, place.geometry.location);
        } else {
          alert(marker.autocomplete?.invalidLocationAlertText || 'Invalid Location');
        }
      });
    }

    // If there is only one marker, allow setting its position by clicking the map
    const draggableMarkerCount = map.markers?.filter(marker => marker.options.draggable).length;
    if (draggableMarkerCount === 1) {
      // When the map is clicked, move the marker and update stored position
      google.maps.event.addListener(googleMap, 'click', event => {
        setLatLng(index, event.latLng);
        mapMarker.setPosition(event.latLng);
      });
    }

    // When the marker is dragged, store the lat/lng where it ends
    google.maps.event.addListener(mapMarker, 'dragend', event => {
      setLatLng(index, event.latLng);
    });
  });
};

// Typescript doesn't allow augmentation of the global scope except in modules, but we need to expose this to the global scope
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.initGoogleMapsQuestion = initGoogleMapsQuestion;
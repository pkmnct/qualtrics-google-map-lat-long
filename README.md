# Qualtrics Google Map Lat/Long Collector

#### Getting Started
Create or open a Qualtrics survey. You must be able to add JavaScript to a question for this code to work (it will not work on trial accounts where this feature is unavailable).

#### Making a Lat/Long Collection Question
Start by making a new _Text Entry_ question. Ensure that the text type used is single line. You can treat this question like you would any other (ex. require a response, change the title, etc.). It is recommended that you provide instructions in the question (see _Using the Question_ below).

On the left side of the question, click the gear and select _Add JavaScript..._

Select everything in the box and clear it. The JavaScript box should be empty before pasting the code.

Copy the JavaScript from the [file](https://github.com/pkmnct/qualtrics-google-map-lat-long/blob/master/QualtricsGoogleMapLatLong.js) and paste it in the box. You can also get older versions of the code from [releases](https://github.com/pkmnct/qualtrics-google-map-lat-long/releases).

At the top of the pasted code, find the section labeled _Enter your Google Map API key in this variable._

Replace the text _Your Key_ with your own API key. You must enable the Maps JavaScript API, and if you are using the Autocomplete Field, you must also enable the Places API (see Google's documentation: _[Get Maps JavaScript API Key](https://developers.google.com/maps/documentation/javascript/get-api-key)_ and _[Get Places API Key](https://developers.google.com/places/web-service/get-api-key)_).

Scroll down to the section labeled _Variables_ and edit the variables as needed.

Click Save. Test the question before sending out the survey. If you have any issues, see _Troubleshooting_ below.

#### Using the Question
By default, an autocomplete field is created to assist in finding a location. Responders can enter a location into this field and the map will snap its marker to that location. They can then fine-tune the response by dragging the marker to a specific location (such as a door to a building).

If you would like to disable the autocomplete field, set the variable _enableAutocompleteField_ to _false_. Users can then just drag the pin to the desired location.

The result is collected in the Qualtrics question field as a JSON object. It will be in the format as follows:

`{"lat": "38.8951", "long": "-77.0364"}`

#### Updating with New Releases
When a [new version of the code is released](https://github.com/pkmnct/qualtrics-google-map-lat-long/releases), you should replace the code in all questions that use it. If different versions of the code are used in the same survey, you may run into issues. Make sure to note any variable changes you had made.

#### Troubleshooting

##### The map doesn't show after adding it to the question
The map will only show up in the actual survey, not in the back-end of Qualtrics. Try to preview or take the survey.

##### The map only shows on the first question
This is a known issue with earlier versions of the code. Update the code in **all questions** that use it.

##### The map or autocomplete field search shows "_This page can't load Google Maps correctly_" or "_For development purposes only_"
This usually indicates an issue with your API key. Make sure you set the API key variable. Check that the API key has access to both the Maps JavaScript API, and if you are using the Autocomplete Field, the Places API. If you are still having trouble, follow [Google's API key troubleshooting steps](https://developers.google.com/maps/documentation/javascript/error-messages).

##### Responses are not saving
Ensure that the text type used on your form is single line. [See Issue #6](https://github.com/pkmnct/qualtrics-google-map-lat-long/issues/6).

##### I'm still having problems
Make sure you are using the latest version of the code (see _Updating with New Releases_ above). If that doesn't help, see if an [issue](https://github.com/pkmnct/qualtrics-google-map-lat-long/issues) has been created for the problem you are facing already. If not, you can [create a new issue](https://github.com/pkmnct/qualtrics-google-map-lat-long/issues).

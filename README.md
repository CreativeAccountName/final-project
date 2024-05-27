# final-project
This is my final Project for the Spring 2024 CanCode Communities JavaScript Fundamentals course.

## Average Color Finder

### What It Does
This tool performs async/await get requests to search for a movie poster from <a href="https://www.themoviedb.org/"><b>The Movie Database</b></a> using their Search API and displays the first result with a colored border and an additional visual element providing the RGB values for user reference. The user can instead upload an image from their own device.

To get the average color value from a given image, I employed the <a href="https://lokeshdhakar.com/projects/color-thief/"><b>Color Thief API</b></a> by Lokesh Dhukar. 

### How To Use
Either click the <b>"Upload File"</b> button and browse to your desired image file and select "open" <b>or</b> type a movie title into the <b>Movie Title</b> text field and click the <b>Search</b> button. The tool will do the rest.

### Known Issues
<ul>
<li>Large files may take a long time to load.</li>
<li>Only the first result from the Search API request is used. This may lead to images unrelated to your intended film loading into view, depending on the search result.</li>
<li>Gibberish, misspelled titles, or titles not listed in the database may return an unrelated image or produce no results.</li>
</ul>

## Credits
<p>This product uses the Color Thief API by Lokesh under the MIT License (MIT)<br>
Copyright (c) 2015 Lokesh Dhakar</p>


<p>This product uses the TMDB API but is not endorsed or certified by TMDB.<br>
    <a href="https://www.themoviedb.org">
      <img id="logo"
        src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_2-9665a76b1ae401a510ec1e0ca40ddcb3b0cfe45f1d51b77a308fea0845885648.svg"
        alt="Logo for The Movie Database.">
    </a>
</p>
const wrapper = document.querySelector(".wrapper"),
  InputPart = wrapper.querySelector(".input-part"),
  CityText = InputPart.querySelector(".city-text"),
  InputField = InputPart.querySelector("input"),
  LocationBtn = InputPart.querySelector("button"),
  wIcon = document.querySelector(".weather-details img");
//wIcon = document.querySelector(".weather_image_icon");
// LocationBtn = InputPart.querySelector(".location-btn");   //if we take Location-btn as classname it return error like TypeError: LocationBtn is null

let api;

InputField.addEventListener("keyup", (e) => {
  //  if user pressed Enter btn then input value is not empty
  if (e.key == "Enter" && InputField.value != "") {
    RequestAPI(InputField.value);
  }
});

// Location btn using geolocation API
LocationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your browser not support geolocation API.");
  }
});

function onSuccess(position) {
  let Latitude = position.coords.latitude;
  let Longitude = position.coords.longitude;
  // const { Latitude, Longitude } = position.coords; // getting latitude and longitude from user device via geoloaciotn API

  api = `https://api.openweathermap.org/data/2.5/weather?lat=${Latitude}&lon=${Longitude}&units=metric&appid=5d647fbd0d9cae0b0d64f0d77ffac791`;
  FetchData();
}

function onError(error) {
  CityText.innerText = error.message;
  CityText.classList.add("error");
}

function FetchData() {
  CityText.innerText = "Getting Weather Details...";
  CityText.classList.add("loading");
  fetch(api)
    .then((Response) => Response.json())
    .then((result) => weatherDetails(result));
}

function RequestAPI(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=5d647fbd0d9cae0b0d64f0d77ffac791`;
  FetchData();
}

function weatherDetails(info) {
  CityText.classList.replace("loading", "error");
  if (info.cod == "404") {
    CityText.innerText = `"${InputField.value}" isn't a valid city name `;
  } else if (info.cod == "400") {
    var weather_section = document.querySelector(".weather-details");
    weather_section.classList.add("d-none");
    weather_section.classList.remove("d-flex");
  } else {
    CityText.classList.remove("loading", "error");
    wrapper.classList.add("active");

    //  code for weather icons
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;

    console.log(info.weather[0]);
    // let id = info.weather[0].id;
    // let Description = info.weather[0].description;

    if (id == 800) {
      wIcon.src = "Images/clear.png";
    } else if (id >= 200 && id <= 232) {
      wIcon.src = "Images/storm.png";
    } else if (id >= 600 && id <= 622) {
      wIcon.src = "Images/snow.png";
    } else if (id >= 701 && id <= 781) {
      wIcon.src = "Images/haze.png";
    } else if (id >= 801 && id <= 804) {
      wIcon.src = "Images/cloudy(1).png";
    } else if ((id >= 300 && id <= 321)(id >= 500 && id <= 531)) {
      wIcon.src = "Images/rain.png";
    } else {
      alert("else function");
      //wIcon.src = "Images/rain.png";
    }

    var weather_section = document.querySelector(".weather-details");
    weather_section.classList.remove("d-none");
    weather_section.classList.add("d-flex");
    //wIcon.src = "Images/rain.png";

    document.querySelector(".temperature .current_temp").innerText =
      info.main.temp;
    document.querySelector(".temperature .feel_like_temp").innerText =
      info.main.feels_like;
    document.querySelector(".humidity .humidity_data").innerText =
      info.main.humidity + "%";
    document.querySelector(".weather.description").innerText =
      info.weather[0].main;
    document.querySelector(".location .location-name").innerText =
      info.name + ", " + info.sys.country;
  }
}

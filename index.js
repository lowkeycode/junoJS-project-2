$searchBtn = $(".search-button");
$weather = $(".weather");
$search = $(".search");
$box = $(".box");
$heroImgContainer = $(".hero-container");
$heroImg = $(".hero-container__img");
$title = $('.title');
$logo = $('.logo');
let lat;
let lng;

const handleClose = function (e) {
  $heroImgContainer = $(".hero-container");
  $heroImgContainer.removeClass('marginalize');
  $heroImg = $(".hero-container__img");
  $heroImg.attr("src", './img/aas-hero.jpg');
  $logo.removeClass('skooch');
  $title.removeClass('skooch');
  $weather.empty();
  $weather.addClass("hide");
  $box.removeClass("box-display");
  $search.removeClass("hide");
  lat = lng = undefined;
};

const renderMap = function () {
  const myMap = L.map("weather__map").setView([lat, lng], 13);

  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      minZoom: 9,
      maxZoom: 11,
      id: "mapbox/outdoors-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        "pk.eyJ1IjoibG93a2V5Y29kZSIsImEiOiJja29uMnRkOTcwNmx6MnhwaHZtMzloeWs2In0.t2Kl5vjXD17B_caNpFJWCg",
    }
  ).addTo(myMap);

  return myMap;
};

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;

const getWeatherBackground = async function (weatherData) {

  try {
    $heroImgContainer.addClass("marginalize");
    $logo.addClass('skooch');
    $title.addClass('skooch');
    const superSecretKey = "ZPnBuAWa6RtJh9NzLdZjhURL9jwQ7Li7sIXqpympOqs";
    console.log(weatherData.weather[0].description);

    const data = await $.ajax({
      url: `https://api.unsplash.com/search/photos?client_id=${superSecretKey}&page=1&query=${weatherData.weather[0].main}%20weather`,
      method: "GET",
      dataType: "json",
    });
    const randomIndex = randomInt(0, 9);
    const weatherBackgroundUrl = data.results[randomIndex].urls.full;

    $heroImg.attr("src", weatherBackgroundUrl);
  } catch (error) {
    console.log(error);
  }
};

const renderCity = function (data) {
  const icon = data.weather[0].icon;
  const celsius = Math.round(data.main.temp - 273.15);

  $search.addClass("hide");
  $box.addClass("box-display");
  $weather.removeClass("hide");

  $weather.append(`
    <div class="weather__location">
      <div class="weather__location--name">${data.name}, ${data.sys.country}</div>
      <div class="weather__location--close">
        <img class="close" src="./img/close.svg" alt="Close searched city">
      </div>
    </div>

    <div class="weather__temp">
      <div class="weather__temp--copy">Temperature</div>
      <div class="weather__temp--deg">${celsius}&deg;C</div>
    </div>

    <div class="weather__forecast">
      <figure class="weather__forecast--icon">
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather symbol">
      </figure>
      <div class="weather__forecast--copy">${data.weather[0].main}</div>
    </div>

    <div class="weather__map" id="weather__map">
      MAP 
    </div>
  `);
  renderMap();

  $closeBtn = $(".weather__location--close");
  $closeBtn.on("click", handleClose);
};

const getWeather = async function () {
  try {
    const $city = $(".search-input").val();

    if (!$city) {
      alert("Please select a city!");
      return;
    }

    const superSecretKey = "e9108d4762c5ac46b2c2d8c47fb0b923";
    const data = await $.ajax({
      url: `https://api.openweathermap.org/data/2.5/weather?q=${$city}&appid=${superSecretKey}`,
      method: "GET",
      dataType: "json",
    });

    lat = data.coord.lat;
    lng = data.coord.lon;
    console.log(lat, lng);

    renderCity(data);
    await getWeatherBackground(data);

    $(".search-input").val("");
    console.log(data);
  } catch (err) {
    console.log(err);
    alert("City not found. Please try again!");
    $(".search-input").val("");
  }
};

$searchBtn.on("click", getWeather);
$(document).on("keypress", function (e) {
  if (e.key === "Enter") getWeather();
});

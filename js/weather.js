const weatherForm = document.querySelector("#weather-form");
const weatherCity = document.querySelector("#weather-city");
const weatherSearch = document.querySelector("#weather-search");
const weatherStatus = document.querySelector("#weather-status");
const weatherCard = document.querySelector("#weather-card");
let clockTimer = 0;

function cityTime(timeZone) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: timeZone
  }).format(new Date());
}

function stopClock() {
  window.clearInterval(clockTimer);
  clockTimer = 0;
}

function startClock(timeElement, timeZone) {
  stopClock();
  function tick() {
    timeElement.textContent = cityTime(timeZone);
  }
  tick();
  clockTimer = window.setInterval(tick, 1000);
}

function clearResult() {
  stopClock();
  if (!weatherCard) return;
  weatherCard.hidden = true;
  weatherCard.replaceChildren();
}

function showLoadError() {
  stopClock();
  if (weatherStatus) {
    weatherStatus.hidden = true;
    weatherStatus.textContent = "";
  }
  if (!weatherCard) return;
  weatherCard.hidden = false;
  weatherCard.replaceChildren();
  const note = document.createElement("span");
  note.className = "weather-error";
  note.textContent = "Could not load weather. Check the city name or try again.";
  weatherCard.append(note);
}

function showStatus(message) {
  clearResult();
  if (!weatherStatus) return;
  weatherStatus.hidden = false;
  weatherStatus.textContent = message;
}

let weatherRequest = 0;

function choosePlace(results, region) {
  if (!results || !results.length) return null;
  if (!region) return results[0];
  const wanted = region.toLowerCase();
  const match = results.find((place) => {
    return [place.admin1, place.admin2, place.country, place.country_code].some((value) => {
      return String(value || "").toLowerCase() === wanted;
    });
  });
  return match || results[0];
}

async function loadWeather(city) {
  if (!weatherStatus) return;
  const requestId = ++weatherRequest;
  const raw = String(city || "").trim();
  const pieces = raw.split(",").map((part) => part.trim()).filter(Boolean);
  const cityName = pieces[0] || raw;
  const region = pieces.slice(1).join(", ");
  const stillCurrent = () => requestId === weatherRequest;

  showStatus("Looking up weather...");
  if (weatherSearch) weatherSearch.classList.add("is-loading");

  try {
    let place;
    try {
      const geoResponse = await fetch(
        "https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(cityName) + "&count=10&language=en"
      );
      if (!stillCurrent()) return;
      if (!geoResponse.ok) throw new Error("Geocoding failed");
      const geoData = await geoResponse.json();
      place = choosePlace(geoData.results, region);
    } catch (error) {
      if (!stillCurrent()) return;
      showLoadError();
      return;
    }

    if (!place) {
      if (!stillCurrent()) return;
      showStatus("City not found — try another spelling");
      return;
    }

    try {
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=" +
          place.latitude +
          "&longitude=" +
          place.longitude +
          "&current=temperature_2m&temperature_unit=fahrenheit&timezone=auto"
      );
      if (!stillCurrent()) return;
      if (!response.ok) throw new Error("Forecast failed");
      const data = await response.json();
      if (!data.current || typeof data.current.temperature_2m !== "number") {
        throw new Error("Forecast missing temperature");
      }
      const temperature = Math.round(data.current.temperature_2m);

      clearResult();
      weatherStatus.hidden = true;
      weatherStatus.textContent = "";
      weatherCard.hidden = false;

      const placeName = document.createElement("span");
      placeName.className = "weather-place";
      placeName.textContent = place.admin1 ? place.name + ", " + place.admin1 : place.name;

      const reading = document.createElement("span");
      reading.className = "weather-temp";
      reading.textContent = temperature + "°";

      const time = document.createElement("span");
      time.className = "weather-time";
      weatherCard.append(placeName, reading, time);
      try {
        if (data.timezone) startClock(time, data.timezone);
        else time.textContent = data.current.time;
      } catch (error) {
        time.textContent = data.current.time;
      }
    } catch (error) {
      if (!stillCurrent()) return;
      showLoadError();
    }
  } finally {
    if (stillCurrent() && weatherSearch) weatherSearch.classList.remove("is-loading");
  }
}

if (weatherForm) {
  weatherForm.addEventListener("submit", (event) => {
    event.preventDefault();
    loadWeather(weatherCity.value);
  });

  loadWeather("Columbus");
}

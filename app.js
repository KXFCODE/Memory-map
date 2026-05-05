const places = [
  {
    id: "odesa-memory-wall",
    title: "Стіна пам'яті загиблих героїв",
    type: "Меморіал",
    region: "Одеса, район проспекту Шевченка, 4",
    status: "Фото та опис: Одеська ОДА, 30.08.2025",
    coords: [46.4578, 30.74841],
    panoCoords: [46.45792, 30.74924],
    photo: "https://oda.od.gov.ua/uploads/IMG_20250831_WA_0004_fd2ff95fd4.jpg?q=75&w=1600",
    thumb: "https://oda.od.gov.ua/strapi/uploads/IMG_20250831_WA_0005_79a8faff22.jpg",
    source: "https://oda.od.gov.ua/ua/news/v-odesi-vidkrili-stinu-pam-yati-dlya-vshanuvannya-720-zagiblih-geroyiv",
    description: "Офіційно описаний меморіальний простір, де увічнені імена загиблих захисників і захисниць України. У матеріалі ОДА зазначено, що на восьмому стенді додано 90 імен, а загалом на стіні вшановано 720 героїв.",
    tags: ["Одеса", "Меморіал"]
  },
  {
    id: "katerynynska-flags",
    title: "Імпровізований меморіал на Катерининській площі",
    type: "Місце пам'яті",
    region: "Одеса, Катерининська площа",
    status: "Фото та опис: Укрінформ, 21.09.2023",
    coords: [46.48855, 30.74122],
    panoCoords: [46.48458, 30.74166],
    photo: "https://static.ukrinform.com/photos/2023_09/thumb_files/630_360_1695286312-639.jpg",
    thumb: "https://static.ukrinform.com/photos/2023_09/thumb_files/630_360_1695286312-639.jpg",
    source: "https://www.ukrinform.ua/rubric-regions/3764181-v-odesi-stvorili-improvizovanij-memorial-na-cest-zagiblih-geroiv.html",
    description: "На Катерининській площі в Одесі встановили прапорці з іменами загиблих захисників України. Укрінформ описує меморіал як місце вшанування біля колишнього пам'ятника Катерині II.",
    tags: ["Одеса", "Меморіал"]
  },
  {
    id: "shabo-defenders",
    title: "Меморіал загиблим захисникам України у Шабо",
    type: "Меморіал",
    region: "Шабо, Білгород-Дністровський район",
    status: "Опис: УСІ Online / Informer, 31.08.2023",
    coords: [46.13295, 30.38558],
    panoCoords: [46.13295, 30.38558],
    photo: "https://usionline.com/wp-content/uploads/2023/08/372925992_629069662544150_7987965859702254993_n.jpg",
    thumb: "https://usionline.com/wp-content/uploads/2023/08/372925992_629069662544150_7987965859702254993_n.jpg",
    source: "https://usionline.com/v-odeskij-oblasti-vidkryly-memorial-zahyblym-zakhysnykam-ukrainy-foto/",
    description: "У Шабо відкрили меморіал з написом «Героям Слава!», який вшановує українських військових, що загинули в боротьбі за незалежність України. Маркер розміщено в реальному населеному пункті Шабо.",
    tags: ["Меморіал"]
  },
  {
    id: "pidhirne-alley",
    title: "Алея Слави у селі Ніяке",
    type: "Алея пам'яті",
    region: "Підгірне, Тарутинська громада, Болградський район",
    status: "Фото та опис: Одеське життя, 21.09.2025",
    coords: [46.25021, 29.04631],
    panoCoords: [46.25021, 29.04631],
    photo: "https://odessa-life.od.ua/wp-content/uploads/2025/09/alleya-slavy-tarutino2.webp",
    thumb: "https://odessa-life.od.ua/wp-content/uploads/2025/09/alleya-slavy-tarutino2.webp",
    source: "https://odessa-life.od.ua/uk/news-uk/na-odeschyni-zyavylasya-sche-odna-aleya-slavy-na-chest-misczevyh-geroyiv-foto",
    description: "У селі Підгірне Тарутинської громади відкрили Алею Слави на честь загиблих земляків-захисників. У матеріалі наведено імена десяти уродженців села, увічнених на алеї.",
    tags: ["Алея"]
  }
];

const map = L.map("memoryMap", {
  zoomControl: true,
  scrollWheelZoom: true,
  maxBounds: [[43.5, 25.0], [50.0, 34.0]],
  maxBoundsViscosity: 0.8,
  minZoom: 7
}).setView([46.48, 30.73], 8);

map.attributionControl.setPrefix('');

const mapboxKey = 'pk.eyJ1IjoibWVuYWNlcmFrdXphbiIsImEiOiJjbWxv' + 'dnk4M2UxNWlsM2ZxeDdmNzRrenVsIn0._YGuHOFlPgP2hFnIxgHYpA';

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: 'Map data &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 19,
  id: 'mapbox/streets-v12',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: mapboxKey
}).addTo(map);

const markerLayer = L.layerGroup().addTo(map);
const markers = new Map();
let activeId = places[0].id;

document.querySelector("#memoryMap").addEventListener("click", (event) => {
  const marker = event.target.closest(".memory-marker");
  if (!marker) return;
  selectPlace(marker.dataset.id, true);
});

const elements = {
  photo: document.querySelector("#placePhoto"),
  type: document.querySelector("#placeType"),
  title: document.querySelector("#placeTitle"),
  location: document.querySelector("#placeLocation"),
  status: document.querySelector("#placeStatus"),
  coords: document.querySelector("#placeCoords"),
  description: document.querySelector("#placeDescription"),
  route: document.querySelector("#routeLink"),
  source: document.querySelector("#sourceLink"),
  visibleCount: document.querySelector("#visibleCount"),
  cards: document.querySelector("#cards"),
  panoDialog: document.querySelector("#panoDialog"),
  panoFrame: document.querySelector("#panoFrame"),
  panoTitle: document.querySelector("#panoTitle"),
  panoExternal: document.querySelector("#panoExternal")
};

function streetViewEmbed(place) {
  const [lat, lng] = place.panoCoords || place.coords;
  return `https://www.google.com/maps?layer=c&cbll=${lat},${lng}&cbp=12,0,0,0,0&output=svembed`;
}

function googleMapsUrl(place) {
  const [lat, lng] = place.coords;
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

function routeUrl(place) {
  const [lat, lng] = place.coords;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

function markerHtml(place, isActive = false) {
  return `<div class="memory-marker ${isActive ? "is-active" : ""}" data-id="${place.id}" onclick="window.selectPlaceFromMarker('${place.id}')">
    <img src="${place.thumb}" alt="">
  </div>`;
}

function createIcon(place, isActive = false) {
  return L.divIcon({
    html: markerHtml(place, isActive),
    className: "",
    iconSize: [68, 76],
    iconAnchor: [34, 76],
    popupAnchor: [0, -68]
  });
}

function renderMarkers(list) {
  markerLayer.clearLayers();
  markers.clear();

  list.forEach((place) => {
    const marker = L.marker(place.coords, {
      icon: createIcon(place, place.id === activeId),
      title: place.title
    });

    marker.on("click", () => selectPlace(place.id, true));
    marker.addTo(markerLayer);
    markers.set(place.id, marker);
  });

  elements.visibleCount.textContent = list.length;
}

function selectPlace(id, pan = false) {
  const place = places.find((item) => item.id === id) || places[0];
  activeId = place.id;

  elements.photo.src = place.photo;
  elements.photo.alt = place.title;
  elements.type.textContent = place.type;
  elements.title.textContent = place.title;
  elements.location.textContent = place.region;
  elements.status.textContent = place.status;
  elements.coords.textContent = `${place.coords[0].toFixed(5)}, ${place.coords[1].toFixed(5)}`;
  elements.description.textContent = place.description;
  elements.route.href = routeUrl(place);
  elements.source.href = place.source;

  markers.forEach((marker, markerId) => {
    const markerPlace = places.find((item) => item.id === markerId);
    marker.setIcon(createIcon(markerPlace, markerId === activeId));
  });

  document.querySelectorAll(".place-card").forEach((card) => {
    card.classList.toggle("is-active", card.dataset.id === activeId);
  });

  if (pan) {
    map.flyTo(place.coords, Math.max(map.getZoom(), 14), { duration: .8 });
  }
}

window.selectPlaceFromMarker = (id) => selectPlace(id, true);

function renderCards() {
  elements.cards.innerHTML = places.map((place) => `
    <article class="place-card" data-id="${place.id}">
      <img src="${place.photo}" alt="${place.title}">
      <div class="place-card__body">
        <h3>${place.title}</h3>
        <p>${place.region}</p>
        <button type="button" data-card="${place.id}">Показати на карті</button>
      </div>
    </article>
  `).join("");

  elements.cards.addEventListener("click", (event) => {
    const button = event.target.closest("[data-card]");
    if (!button) return;
    selectPlace(button.dataset.card, true);
    document.querySelector("#map").scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function applyFilter(filter) {
  const list = filter === "all"
    ? places
    : places.filter((place) => place.tags.includes(filter) || place.region.includes(filter) || place.type.includes(filter));

  if (!list.some((place) => place.id === activeId) && list.length) {
    activeId = list[0].id;
  }

  renderMarkers(list);
  selectPlace(activeId);

  if (list.length) {
    map.fitBounds(L.latLngBounds(list.map((place) => place.coords)), { padding: [70, 70], maxZoom: 14 });
  }
}

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    applyFilter(button.dataset.filter);
  });
});

document.querySelector("#searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const query = document.querySelector("#searchInput").value.trim().toLowerCase();
  if (!query) {
    applyFilter("all");
    return;
  }

  const match = places.find((place) => {
    return [place.title, place.type, place.region, place.description, place.status]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  if (match) {
    selectPlace(match.id, true);
  }
});

document.querySelector("#openPanorama").addEventListener("click", () => {
  const place = places.find((item) => item.id === activeId) || places[0];
  elements.panoTitle.textContent = place.title;
  elements.panoFrame.src = streetViewEmbed(place);
  elements.panoExternal.href = googleMapsUrl(place);
  elements.panoDialog.showModal();
});

document.querySelector("#closePanorama").addEventListener("click", () => {
  elements.panoDialog.close();
  elements.panoFrame.src = "about:blank";
});

elements.panoDialog.addEventListener("click", (event) => {
  const rect = elements.panoDialog.getBoundingClientRect();
  const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) {
    elements.panoDialog.close();
    elements.panoFrame.src = "about:blank";
  }
});

renderCards();
renderMarkers(places);
selectPlace(activeId);

function fitAllPlaces() {
  map.invalidateSize();
  const activePlace = places.find((place) => place.id === activeId) || places[0];
  map.setView(activePlace.coords, 13);
}

fitAllPlaces();
setTimeout(fitAllPlaces, 300);
setTimeout(fitAllPlaces, 1000);

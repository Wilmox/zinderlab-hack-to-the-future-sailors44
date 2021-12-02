const myHeaders = new Headers();
const SIDEBAR = document.getElementById("sideBar");
var suspectsContainer = document.getElementById("suspectsContainer");

const startDay = '2021-12-01';
const endDay = '2021-12-02';

console.log(endDay + "T01:00:00Z");

const startMurderTime = new Date(endDay + "T01:00:00Z");
const endMurderTime = new Date(endDay + "T02:00:00Z");

myHeaders.append("userId", "sailors44980");

const requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

var motives = [];
var suspects = [];
var cars = [];
var alibis = [];
var prints = [];

fetch(`https://htf-2021.zinderlabs.com/motive`, requestOptions)
  .then(response => response.json())
  .then(result => 
    {
    motives = result;
    onFetchComplete();
  })
  .catch(error => console.log('error', error));

fetch("https://htf-2021.zinderlabs.com/suspect", requestOptions)
  .then(response => response.json())
  .then(result =>  {
    suspects = result;
    onFetchComplete();
  })
  .catch(error => console.log('error', error));

fetch("https://htf-2021.zinderlabs.com/car", requestOptions)
.then(response => response.json())
.then(result =>  {
  cars = result;
  onFetchComplete();
})
.catch(error => console.log('error', error));

fetch("https://htf-2021.zinderlabs.com/alibi", requestOptions)
.then(response => response.json())
.then(result =>  {
  alibis = result;
})
.catch(error => console.log('error', error));

fetch("https://htf-2021.zinderlabs.com/fingerprint/Insulinespuit", requestOptions)
.then(response => response.json())
.then(result =>  {
  prints = result["fingerprints"];
})
.catch(error => console.log('error', error));
  
function onFetchComplete() {
  if (motives.length > 0 && suspects.length > 0 && cars.length > 0) {
    renderSuspects(suspects, motives);
  }
}

async function fetchCarSightings(licenseplate) {
  let sighting = await fetch(`https://htf-2021.zinderlabs.com/sighting/car/${licenseplate}`, requestOptions)
  .then(response => response.json())
  .then(result =>  {
    return result;
  })
  .catch(error => console.log('error', error));
  return sighting;
}

async function fetchSuspectSightings(suspectId) {
  let sighting = await fetch(`https://htf-2021.zinderlabs.com/sighting/suspect/${suspectId}`, requestOptions)
  .then(response => response.json())
  .then(result =>  {
    return result;
  })
  .catch(error => console.log('error', error));
  return sighting;
}

function renderSuspects() {
  row = createRow();
  suspects.forEach(suspect => {
    let motive = motives.find(motive => motive["suspectId"] == suspect["id"]);
    let car = cars.find(car => car["owner"] == suspect["name"]);
    col = createCol();
    col.appendChild(createSuspectCard(suspect, motive));
    row.appendChild(col);
  });
  suspectsContainer.appendChild(row);
}

function createRow() {
  row = document.createElement("div");
  row.classList.add("row", "row-cols-5");
  return row;
}

function createCol() {
  col = document.createElement("div");
  col.classList.add("col", "p-2");
  return col;
}

function createSuspectCard(suspectJSON, motiveJSON) {
  card = document.createElement("div");
  card.classList.add("card", "h-100");

  image = document.createElement("img");
  image.classList.add("card-image-top", "w-100");
  image.setAttribute("src", suspectJSON["imgSrc"]);

  cardBody = document.createElement("div");
  cardBody.classList.add("card-body", "d-flex", "flex-column");

  cardTitle = document.createElement("h5");
  cardTitle.classList.add("card-title");
  cardTitle.innerHTML = suspectJSON["name"];

  cardText = document.createElement("p");
  cardText.classList.add("card-text")
  if (motiveJSON) {
    cardText.innerHTML= motiveJSON["text"];
    cardText.classList.add("text-danger");
  } else {
    cardText.innerHTML = "Geen motief.";
  }

  cardButton = document.createElement("a");
  cardButton.classList.add("btn", "btn-warning", "mt-auto");
  cardButton.setAttribute('id', 'cardButton');
  cardButton.setAttribute('onClick', 'openSideBar("' + suspectJSON["id"] + '")')
  cardButton.innerHTML = "Investigate \u{1F50D}";

  badge = document.createElement("span");
  badge.classList.add("position-absolute", "top-0", "start-98", "translate-middle", "badge", "rounded-pill", "bg-danger", "fs-6");
  badge.setAttribute('id', 'badge_' + suspectJSON["id"]);
  badge.innerHTML = "?";

  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardText);
  cardBody.appendChild(cardButton);
  card.appendChild(image);
  card.appendChild(cardBody);
  card.appendChild(badge);
  return card;
}

async function openSideBar(suspectId) {
  const SUSPECT = suspects.find(suspect => suspect["id"] == suspectId);
  suspectHeading = document.getElementById('suspectHeading');
  if (prints.includes(suspectId)) {
    suspectHeading.innerHTML = SUSPECT['name'] +  " \u{1F489}";
  } else {
    suspectHeading.innerHTML = SUSPECT['name'];
  }

  suspectMotive = document.getElementById('suspectMotive');
  try {
    suspectMotive.innerHTML =  motives.find(motive => motive["suspectId"] == suspectId).text;
    suspectMotive.classList.add('text-danger');
  } catch {
    suspectMotive.innerHTML =  "Geen motief";
    suspectMotive.classList.remove('text-danger');
  }


  let car = cars.find(car => car["owner"] == suspects.find(suspect => suspect["id"] == suspectId).name);
  if (car) {
    document.getElementById('carHeader').innerHTML = "Car info:"
    suspectCarInfo = document.getElementById('carInfo');
    suspectCarInfo.innerHTML = "";
    for (key in car) {
      if (key != "owner") {
        listItem = document.createElement('li')
        listItem.innerHTML = key + ": " + car[key];
        suspectCarInfo.append(listItem)
      }
    }
  } else {
    document.getElementById('carHeader').innerHTML = "No car info";
    document.getElementById('carInfo').innerHTML = '';
  }
  let suspectAlibi = document.getElementById('suspectAlibi');
  let alibiStatus = document.getElementById('alibiStatus');

  let verifyAlibyButton = document.getElementById("verifyAliby");
  
  suspectAlibi.classList.remove('text-success');
  suspectAlibi.classList.remove('text-danger');
  suspectAlibi.classList.remove('text-warning');
  let alibi = alibis.find(alibi => alibi["suspectId"] == suspectId);
  if (alibi != undefined) {
    verifyAlibyButton.disabled = false;
    verifyAlibyButton.setAttribute('onclick', 'verifyAlibi("' + alibi.id +'")');
    if (alibi.verified) {
      if (alibi.correct) {
        alibiStatus.innerHTML = "Verified & correct alibi:";
        suspectAlibi.classList.add('text-success');
      } else {
        alibiStatus.innerHTML = "Verified & false alibi:";
        suspectAlibi.classList.add('text-danger');
      }
      suspectAlibi.innerHTML = alibi.description;
      verifyAlibyButton.disabled = true;
    } else {
      alibiStatus.innerHTML = "Not verified alibi:";
      suspectAlibi.classList.add('text-warning');
      suspectAlibi.innerHTML = alibi.description;
    } 
  } else {
    alibiStatus.innerHTML = "";
    suspectAlibi.classList.add('text-danger');
    suspectAlibi.innerHTML = "Geen alibi";
    verifyAlibyButton.disabled = true;
  }
  
  updateSuspectSightingsTable(SUSPECT);

  susBar = document.getElementById('susBar');
  susness = await calculateSusness(SUSPECT);
  susBar.setAttribute("style", `height: ${susness}%`);
  susBar.setAttribute("aria-valuenow", susness);
  susBar.innerHTML = susness;

  SIDEBAR.style.width = "15%";
}

const closeSideBar = () => {
  SIDEBAR.style.width = "0%";
}

async function calculateSusness(suspect) {
  let motive = motives.find(motive => motive["suspectId"] == suspect["id"]);
  let car = cars.find(car => car["owner"] == suspect["name"]);
  let sighting = undefined;
  if (car && car["licenseplate"]) {
    sighting = await fetchCarSightings(car["licenseplate"]);
  }

  let susScore = 50;

  if (sighting) {
    console.log(sighting);
    console.log(startDay + "T" + sighting["startTime"] + "Z");
    const arriveTime = new Date(startDay + "T" + sighting["startTime"] + "Z");
    const leaveTime = new Date(endDay + "T" + sighting["endTime"] + "Z");

    console.log(arriveTime);
    console.log(startMurderTime);
    console.log(endMurderTime);
    console.log(leaveTime);
    console.log(arriveTime < startMurderTime);
    console.log(leaveTime > endMurderTime);
    console.log(arriveTime > startMurderTime);
    console.log(arriveTime < endMurderTime);

    if (arriveTime < startMurderTime && leaveTime > endMurderTime) {
      susScore += 20;
    } else if (arriveTime > startMurderTime && leaveTime > endMurderTime && arriveTime < endMurderTime) {
      susScore += 10;
    } else if (arriveTime < startMurderTime && leaveTime < endMurderTime && leaveTime > startMurderTime) {
      susScore += 10;
    } else {
      susScore -= 10;
    }
  }

  if (prints.includes(suspect["id"])) {
    susScore += 20;
  }

  let suspectBadge = document.getElementById('badge_' + suspect["id"]);
  suspectBadge.innerHTML = susScore;

  return susScore;
}

async function updateSuspectSightingsTable(suspect) {
  let car = cars.find(car => car["owner"] == suspect["name"]);
  let suspectSightings = await fetchSuspectSightings(suspect["id"]);
  let sightings = [];
  if (car && car[["licenseplate"]]) {
    let carSightings = await fetchCarSightings(car["licenseplate"]);
    sightings = carSightings.concat(suspectSightings);
    console.log(carSightings);
  } else {
    sightings = suspectSightings;
  }
  let suspectSightingsTable = document.getElementById('suspectSightings');
  suspectSightingsTable.innerHTML = "";

  sightings.sort((a, b) => (a.startTime > b.startTime) ? 1 : -1);

  console.log(suspect);
  console.log(sightings);

  headerRow = document.createElement("tr");
  headerTime = document.createElement("th");
  headerTime.innerHTML = "Tijdstip";
  headerLocation = document.createElement("th");
  headerLocation.innerHTML = "Locatie";
  headerRow.appendChild(headerTime);
  headerRow.appendChild(headerLocation);
  suspectSightingsTable.appendChild(headerRow);
  sightings.forEach(sighting => {
    row = document.createElement("tr");
    tdTime = document.createElement("td");
    tdTime.innerHTML = sighting["startTime"] + " - " + sighting["endTime"];
    tdLocation = document.createElement("td");
    tdLocation.innerHTML = sighting["location"];
    row.appendChild(tdTime);
    row.appendChild(tdLocation);
    suspectSightingsTable.appendChild(row);
  });
}

function verifyAlibi(alibiId) {
  const putRequestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: {"alibiId": "'"+alibiId+"'"}
  }
  fetch("https://htf-2021.zinderlabs.com/alibi/verify", putRequestOptions)
  .catch(error => console.log('error', error));
}
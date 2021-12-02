const myHeaders = new Headers();
var suspectsContainer = document.getElementById("suspectsContainer");

myHeaders.append("userId", "sailors44980");

const requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

var motives = [];
var suspects = [];
var cars = [];

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
  
function onFetchComplete() {
  if (motives.length > 0 && suspects.length > 0 && cars.length > 0) {
    renderSuspects(suspects, motives)
  }
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
  var susScore = 10;
  card = document.createElement("div");
  card.classList.add("card", "h-100");

  image = document.createElement("img");
  image.classList.add("card-image-top", "w-100");
  image.setAttribute("src", suspectJSON["imgSrc"]);

  cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  cardTitle = document.createElement("h5");
  cardTitle.classList.add("card-title");
  cardTitle.innerHTML = suspectJSON["name"];

  cardText = document.createElement("p");
  cardText.classList.add("card-text")
  if (motiveJSON) {
    cardText.innerHTML= motiveJSON["text"];
    cardText.classList.add("text-danger")
    susScore += 5;
  } else {
    cardText.innerHTML = "Geen motief."
    susScore -= 3;
  }

  cardButton = document.createElement("a");
  cardButton.classList.add("btn", "btn-warning");
  cardButton.setAttribute('id', 'cardButton');
  cardButton.setAttribute('onClick', 'openSideBar("' + suspectJSON["id"] + '")')
  cardButton.innerHTML = "Investigate \u{1F50D}";

  badge = document.createElement("span");
  badge.classList.add("position-absolute", "top-0", "start-98", "translate-middle", "badge", "rounded-pill", "bg-danger", "fs-6");
  badge.innerHTML = susScore;

  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardText);
  cardBody.appendChild(cardButton);
  card.appendChild(image);
  card.appendChild(cardBody);
  card.appendChild(badge);
  return card;
}

const openSideBar = (suspectId) => {
  const SUSPECT = "";
  document.getElementById("sideBar").style.width = "15%";
}

const closeSideBar = () => {
  document.getElementById("sideBar").style.width = "0%";
}

function getSuspect(suspectId) {
  const SUSPECT = null;
  fetch("https://htf-2021.zinderlabs.com/suspect/" + suspectId, requestOptions)
  .then(response => response.json())
  .then(result =>  {
    SUSPECT = result;
    onFetchComplete();
  })
}

function calculateSusness(suspect) {
  let motive = motives.find(motive => motive["suspectId"] == suspect["id"]);
  let car = cars.find(car => car["owner"] == suspect["name"]);

  if (motiveJSON) {
    cardText.innerHTML= motiveJSON["text"];
    cardText.classList.add("text-danger")
    susScore += 5;
  } else {
    cardText.innerHTML = "Geen motief."
    susScore -= 3;
  }
  
}

getSuspect("ca692dc4-b029-41ae-95d9-f731e0f22309");
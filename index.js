document.addEventListener("DOMContentLoaded", () => {
  try {
    fetch(
      "http://data.goteborg.se/RiverService/v1.1/MeasureSites/b9098f14-4d94-49bd-8c7b-2c15ab9c370e?format=json"
    ).then(async response => {
      let json = await response.json();
      console.log(json);
      renderMeasureSites(json);
      renderformName(json);
      // Get dates entered in search field
      document
        .getElementById("fromDate")
        .addEventListener("input", getFromDate);
      document.getElementById("toDate").addEventListener("input", getToDate);
      document
        .getElementById("selectId")
        .addEventListener("input", getSelectId);
      document
        .querySelector(".container")
        .addEventListener("click", expandSite); // Show modal with more site info on click
      window.addEventListener("submit", expandSite); // Search and show results in modal
      window.addEventListener("click", windowOnClick); // Close modal when user clicks outside of modal
    });
  } catch (error) {
    console.error(error);
  }
});

let renderMeasureSites = measureSites => {
  measureSites.forEach((measureSite, index) => {
    //create a cardDiv
    let container = document.querySelector(".container");
    let siteCard = document.createElement("div");
    siteCard.className = "card";
    siteCard.id = "s" + index;
    container.appendChild(siteCard);

    // create <p> and add name from array
    let siteNameParagraph = document.createElement("p");
    siteNameParagraph.className = "siteName";
    siteNameParagraph.innerText = measureSite.Description;
    siteCard.appendChild(siteNameParagraph);
    // create <p> for  flow content
    let siteFlowParagraph = document.createElement("p");
    siteFlowParagraph.className = "flowValue";
    let measureParameter = getMeasureParameter(
      measureSite.MeasureParameters,
      "Tapping" || "Flow"
    );
    siteFlowParagraph.innerText = measureParameter;
    siteCard.appendChild(siteFlowParagraph);
  });
};

let getMeasureParameter = (measureParameters, code) => {
  let result = measureParameters.filter(
    measureParameter => measureParameter.Code == code
  );
  let parameter = result[0];
  if (parameter == undefined) {
    return "inget värde";
  } else {
    return parameter.CurrentValue;
  }
};
// Get input information from form

// Dates:
let fromDate;
let toDate;

// Sites:
function renderformName(measureSites) {
  let select = document.getElementById("selectId");

  measureSites.forEach(item => {
    let option = document.createElement("option");
    option.setAttribute("value", `${item.Code}`);
    option.innerHTML = `
    <span>${item.Description}</span>
    `;
    select.appendChild(option);
  });
}
// hämtar code value på mätplatsen
let selectId;
function getSelectId(e) {
  selectId = e.target.value;
  e.preventDefault();
  console.log(selectId);
}

// api-kall, idé för hämtning
function getMeasureSiteInfo() {
  fetch(
    `http://data.goteborg.se/RiverService/v1.1/Measurements/b9098f14-4d94-49bd-8c7b-2c15ab9c370e/${selectId}/${MeasureParameter}/${fromDate}/${toDate}?format=json`
  ).then(async response => {
    let json = await response.json();
    console.log(json);
    renderGetSite(json);
  });
}

let renderGetSite = function(info) {
  // Ska rendera info till modalfönster som öppnas när fomrulär fyllts i.
};

function getFromDate(event) {
  fromDate = event.target.value;
  event.preventDefault();
}

function getToDate(event) {
  toDate = event.target.value;
  event.preventDefault();
}
// Max value (to) should be yesterday
// Gör en function som hämtar dagens datum, sätt maxValue för toDate till den avriabeln.
let today = new Date();
let dateNow = document.getElementById("toDate");
dateNow.max = today.toLocaleDateString("sv-SE");
dateNow.defaultValue = today.toLocaleDateString("sv-SE");
console.log(dateNow);

// Default from value is one month ago
var fromDay = new Date(today);
//Change it so that it is 30 days in the past.
var pastDate = fromDay.getDate() - 30;
fromDay.setDate(pastDate);
let dateFrom = document.getElementById("fromDate");
dateFrom.defaultValue = fromDay.toLocaleDateString("sv-SE");
console.log(dateFrom);

// Expand measure site when clicked
function expandSite() {
  if (event.target.nodeName === "DIV") {
    let sId = event.target.parentNode.parentNode.id;
    let id = parseInt(sId.replace("s", ""));
    let site = getSite(id);
    createSiteModal(site);
  }
}

// Creating the modals
let modal = document.querySelector(".modal");
let modalContent = document.querySelector(".modalContent");

function createSiteModal(site) {
  modalContent.innerHTML = `
  <form class="searchMeasureSitesModal">
  <fieldset>
    <legend>Sökparametrar:</legend>
    <label id="measureSitesModal">Mätplats</label>
    <select name="measureSites" id="selectIdModal">

    </select>
    <label for="fromDateModal">Startdatum:</label>
    <input type="date" name="fromDate" id="fromDateModal" />
    <label for="toDateModal">Slutdatum:</label>
    <input type="date" name="toDate" id="toDateModal" />
    <fieldset class="checkboxesModal">
      <legend>Mätvärden:</legend>
      <label for="flowModal">Flöde/Tappning</label>
      <input type="checkbox" name="Flow" id="flowModal" />
      <label for="levelModal">Nivå</label>
      <input type="checkbox" name="Level" id="levelModal" />
      <label for="levelDownstreamModal">Nivå nedströms</label>
      <input type="checkbox" name="LevelDownstream" id="levelDownstreamModal"/>
      <label for="rainFallModal">Nederbörd</label>
      <input type="checkbox" name="RainFall" id="rainFallModal" />
    </fieldset>
    <button type="submit">Visa värden</button>
  </fieldset>
  `;
  toggleModal();
}

//  Toggling the modals
function toggleModal() {
  modal.classList.toggle("showModal");
}

function windowOnClick(event) {
  if (event.target === modal) {
    toggleModal();
  }
}

//Start-idé för hur man ska hitta vilka checkboxes som ska synas
function disableCheckbox(measureSites) {
  measureSites.forEach(function(measureSite) {
    if (measureSite.MeasureParameter.Code != checkbox.name) {
      document.getElementsByName("checkbox").disabled = true;
    } else {
      document.getElementById("checkbox").disabled = false;
    }
  });
}

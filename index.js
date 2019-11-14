document.addEventListener("DOMContentLoaded", () => {
  try {
    fetch(
      "http://data.goteborg.se/RiverService/v1.1/MeasureSites/b9098f14-4d94-49bd-8c7b-2c15ab9c370e?format=json"
    ).then(async response => {
      let json = await response.json();
      renderMeasureSites(json);

      // Show modal with more site info on click
      document.querySelector(".container").addEventListener("click", () => {
        expandSite(event, json, selectedId);
      });

      // Search and show results in modal
      document
        .querySelector(".searchMeasureSitesModal")
        .addEventListener("input", () => {
          createSiteModal(event.target);
        });
    });

    // Close modal when user clicks outside of it
    window.addEventListener("click", windowOnClick);
  } catch (error) {
    console.error(error);
  }
});

let measureSiteFlowType = {};

let renderMeasureSites = measureSites => {
  measureSites.forEach(measureSite => {
    //create a cardDiv
    let container = document.querySelector(".container");
    let siteCard = document.createElement("div");
    siteCard.className = "card";
    siteCard.id = measureSite.Code;
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
      measureSite.Code,
      measureSite.MeasureParameters,
      ["Tapping", "Flow"]
    );
    siteFlowParagraph.innerText = measureParameter;
    siteCard.appendChild(siteFlowParagraph);
  });
};

let getMeasureParameter = (measureSiteCode, measureParameters, code) => {
  let result = measureParameters.filter(measureParameter =>
    code.includes(measureParameter.Code)
  );
  let parameter = result[0];
  if (parameter == undefined) {
    return "inget värde";
  } else {
    measureSiteFlowType[measureSiteCode] = parameter.Code;
    return parameter.CurrentValue + " m³";
  }
};

// Expand measure site modal when card is clicked
let selectedId;
function expandSite(event, json, selectedId) {
  if (event.target.className === "card") {
    selectedId = event.target.id;
  } else if (event.target.nodeName === "P") {
    selectedId = event.target.parentElement.id;
  }
  renderFormNameModal(json, selectedId); // Render measuresite names to select menu
  let selectedParameter = document.querySelector(
    ".checkboxesModal input[type='radio']:checked"
  ).id;
  getMeasureSiteInfo(
    selectedId,
    fromDateString,
    toDateString,
    selectedParameter
  );
  toggleModal();
}

// Render measuresite names in form:
function renderFormNameModal(measureSites, selectedId) {
  let selectModal = document.getElementById("selectIdModal");
  measureSites.forEach(item => {
    let option = document.createElement("option");
    option.value = `${item.Code}`;
    if (option.value == selectedId) {
      option.selected = true;
    }
    option.innerHTML = `
    <span>${item.Description}</span>
    `;
    selectModal.appendChild(option);
  });
}

// Get json data after search
function getMeasureSiteInfo(selectId, fromDate, toDate, selectedParameter) {
  if (
    selectedParameter === "Flow" &&
    measureSiteFlowType[selectId] !== undefined
  ) {
    selectedParameter = measureSiteFlowType[selectId];
  }
  fetch(
    `http://data.goteborg.se/RiverService/v1.1/Measurements/b9098f14-4d94-49bd-8c7b-2c15ab9c370e/${selectId}/${selectedParameter}/${fromDate}/${toDate}?format=json`
  ).then(async response => {
    let json = await response.json();

    renderGetSite(json);
  });
}

// Rendera info till modalfönster som öppnas när formulär fyllts i.
let renderGetSite = function(jsonInfo) {
  let table = document.querySelector(".tbody");
  table.innerHTML = "";
  jsonInfo.forEach(item => {
    let timeStamp = item.TimeStamp;
    let timeTodate = timeStamp.substring(6, 24);
    let timestampDate = new Date(parseInt(timeTodate)).toLocaleDateString(
      "sv-SE"
    );
    let tr = document.createElement("tr");
    tr.classList.add("tr-space");
    tr.innerHTML = `
        <td>${item.Value}</td>
        <td>${timestampDate}</td>
      `;
    table.appendChild(tr);
  });
};

// Gör en function som hämtar dagens datum, sätt maxValue för toDate till den variabeln.
let today = new Date();
let dateNow = document.getElementById("toDateModal");
dateNow.max = today.toLocaleDateString("sv-SE");
let toDateString = today.toLocaleDateString("sv-SE");
dateNow.defaultValue = toDateString;

// Default from value is one month ago
var fromDay = new Date(today);
//Change it so that it is 30 days in the past.
var pastDate = fromDay.getDate() - 30;
fromDay.setDate(pastDate);
let dateFrom = document.getElementById("fromDateModal");
let fromDateString = fromDay.toLocaleDateString("sv-SE");
dateFrom.defaultValue = fromDateString;

// Creating the modals
let modal = document.querySelector(".modal");
let modalContent = document.querySelector(".modalContent");

function createSiteModal(form) {
  let selectId = document.querySelector("#selectIdModal").value;
  let fromDate = document.querySelector("#fromDateModal").value;
  let toDate = document.querySelector("#toDateModal").value;
  let selectedParameter = document.querySelector(
    ".checkboxesModal input[type='radio']:checked"
  ).id;

  getMeasureSiteInfo(selectId, fromDate, toDate, selectedParameter);
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

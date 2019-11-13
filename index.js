document.addEventListener("DOMContentLoaded", () => {
  try {
    fetch(
      "http://data.goteborg.se/RiverService/v1.1/MeasureSites/b9098f14-4d94-49bd-8c7b-2c15ab9c370e?format=json"
    ).then(async response => {
      let json = await response.json();
      console.log(json);
      renderMeasureSites(json);
      renderFormName(json);

      document.querySelector(".container").addEventListener("click", expandSite); // Show modal with more site info on click
      renderFormNameModal(json); // Render measuresite names to select menu

      // Search and show results in modal
      document.addEventListener("submit", () => {
        event.preventDefault();
        createSiteModal(event.target);
      });
    });

    // Listen to search events in modal and get entered data
    window.addEventListener("click", windowOnClick); // Close modal when user clicks outside of modal
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
    siteCard.id = measureSite.Code;
    // siteCard.id = "s" + index;
    container.appendChild(siteCard);

    // create <p> and add name from array
    let siteNameParagraph = document.createElement("p");
    siteNameParagraph.className = "siteName";
    siteNameParagraph.innerText = measureSite.Description;
    siteCard.appendChild(siteNameParagraph);
    // create <p> for  flow content
    let siteFlowParagraph = document.createElement("p");
    siteFlowParagraph.className = "flowValue";
    let measureParameter = getMeasureParameter(measureSite.MeasureParameters, [
      "Tapping",
      "Flow"
    ]);
    siteFlowParagraph.innerText = measureParameter;
    siteCard.appendChild(siteFlowParagraph);
  });
};

let getMeasureParameter = (measureParameters, code) => {
  let result = measureParameters.filter(measureParameter =>
    code.includes(measureParameter.Code)
  );
  let parameter = result[0];
  if (parameter == undefined) {
    return "inget värde";
  } else {
    return parameter.CurrentValue;
  }
};
// checkboxes
let checkboxes = document.querySelectorAll(
  ".searchMeasureSites input[type=checkbox]"
);
let emptyArr = [];

function handleCheck(e) {
  if (e.target.checked) {
    emptyArr.push(e.target.id);
  } else {
    let findId = emptyArr.find(id => {
      console.log(id.Code === e.target.id);
    });
    emptyArr.splice(findId, 1);
  }
}

checkboxes.forEach(checkbox => checkbox.addEventListener("click", handleCheck));

// Render measuresite names in form:
function renderFormName(measureSites) {
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

function renderFormNameModal(measureSites) {
  let selectModal = document.getElementById("selectIdModal");
  measureSites.forEach(item => {
    let option = document.createElement("option");
    option.setAttribute("value", `${item.Code}`);
    option.innerHTML = `
    <span>${item.Description}</span>
    `;
    selectModal.appendChild(option);
  });
}

// api-kall, idé för hämtning
function getMeasureSiteInfo(selectId, fromDate, toDate, selectedParameters) {
  document.getElementById("searchResults").innerText = ""
  //TODO: Update modal selectors with fromDate, toDate, selectId
  selectedParameters.forEach(selectedParameter => {
    fetch(
      `http://data.goteborg.se/RiverService/v1.1/Measurements/b9098f14-4d94-49bd-8c7b-2c15ab9c370e/${selectId}/${selectedParameter}/${fromDate}/${toDate}?format=json`
    ).then(async response => {
      let json = await response.json();
      console.log(json);
      renderGetSite(json);
    });
  })

}

// Rendera info till modalfönster som öppnas när formulär fyllts i.
let renderGetSite = function (jsonInfo) {
  document.getElementById("searchResults").innerText += jsonInfo;
};

// Max value (to) should be yesterday
// Gör en function som hämtar dagens datum, sätt maxValue för toDate till den variabeln.
let today = new Date();
let dateNow = document.getElementById("toDate");
dateNow.max = today.toLocaleDateString("sv-SE");
let dateToString = today.toLocaleDateString("sv-SE");
let datetoModal = document.getElementById("toDateModal")
datetoModal.defaultValue = dateToString;
dateNow.defaultValue = dateToString;
console.log(dateNow);

// Default from value is one month ago
var fromDay = new Date(today);
//Change it so that it is 30 days in the past.
var pastDate = fromDay.getDate() - 30;
fromDay.setDate(pastDate);
let dateFrom = document.getElementById("fromDate");
let dateFromString = fromDay.toLocaleDateString("sv-SE");
dateFrom.defaultValue = dateFromString;
let datefromModal = document.getElementById("fromDateModal")
datefromModal.defaultValue = dateFromString;
console.log(datefromModal);
console.log(dateFrom);

// Expand measure site modal when card is clicked
let id;

function expandSite(event) {
  let selectId;
  if (event.target.className === 'card') {
    selectId = event.target.id;

  } else if (event.target.nodeName === 'P') {
    selectId = event.target.parentElement.id;
  };
  getMeasureSiteInfo(selectId, dateFromString, dateToString, ["Level"]);
  toggleModal();
}

// Creating the modals
let modal = document.querySelector(".modal");
let modalContent = document.querySelector(".modalContent");

function createSiteModal(form) {
  let selectId = form.querySelector("select[name='measureSites']").value;
  let fromDate = form.querySelector("input[name='fromDate']").value;
  let toDate = form.querySelector("input[name='toDate']").value;
  let selectedParameterBoxes = form.querySelectorAll(".checkboxes input[type='checkbox']:checked");
  console.log("Selected params", selectedParameterBoxes);
  // TODO: figure out how to get names from checkboxes
  let selectedParameters = selectedParameterBoxes.forEach(param => param.name);
  getMeasureSiteInfo(selectId, fromDate, toDate, /*selectedParameters*/ ["Level"])
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
  measureSites.forEach(function (measureSite) {
    if (measureSite.MeasureParameter.Code != checkbox.name) {
      document.getElementsByName("checkbox").disabled = true;
    } else {
      document.getElementById("checkbox").disabled = false;
    }
  });
}
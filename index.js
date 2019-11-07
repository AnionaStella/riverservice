document.addEventListener('DOMContentLoaded', () => {
  try {
    fetch('http://data.goteborg.se/RiverService/v1.1/MeasureSites/b9098f14-4d94-49bd-8c7b-2c15ab9c370e?format=json')
      .then(async response => {
        let json = await response.json();
        console.log(json);
        renderMeasureSites(json);
        renderformName(json);
        // Get dates entered in search field
        document.getElementById('fromDate').addEventListener('input', getFromDate);
        document.getElementById('toDate').addEventListener('input', getToDate);
      
      document.addEventListener('click', expandSite); // Show modal with more site info on click
      window.addEventListener('submit', expandSite); // Search and show results in modal
      window.addEventListener('click', windowOnClick); // Close modal when user clicks outside of modal
      })
  } catch (error) {
    console.error(error);
  }
})


let renderMeasureSites = measureSites => {
  measureSites.forEach((measureSite, index) => {
    //create a cardDiv
    let container = document.querySelector(".container");
    let siteCard = document.createElement("div");
    siteCard.className = "card";
    siteCard.id = 's' + index;
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
    option.innerHTML = `
    ${item.Description}
    `;
    select.appendChild(option);
  });
}

// api-kall, idé för hämtning
function getMeasureSiteInfo() {
  fetch(
    `http://data.goteborg.se/RiverService/v1.1/Measurements/b9098f14-4d94-49bd-8c7b-2c15ab9c370e/${MeasureSite}/${MeasureParameter}/${fromDate}/${toDate}?format=json`
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
// Default from value is one month ago
<<<<<<< HEAD
=======


// Expand measure site when clicked
function expandSite () {
  if (event.target.nodeName === "DIV") {
    let sId = event.target.parentNode.parentNode.id;
    let id = parseInt(sId.replace('s', ''));
    let site = getSite(id);
    createSiteModal(site);            
  };
}

// Creating the modals
let modal = document.querySelector('.modal');
let modalContent = document.querySelector('.modalContent');


function createSiteModal(site) {
  modalContent.innerHTML = `
  <form class="searchMeasureSites">
  <fieldset>
    <legend>Sökparametrar:</legend>
    <label id="measureSites">Mätplats</label>
    <select name="measureSites" id="selectId">
      <!-- <option value="Mätplatsens namn" id="Mätplatsens namn">Mätplatsens namn</option> -->
    </select>
    <label for="fromDate">Startdatum:</label>
    <input type="date" name="fromDate" id="fromDate" />
    <label for="toDate">Slutdatum:</label>
    <input type="date" name="toDate" id="toDate" />
    <fieldset class="checkboxes">
      <legend>Mätvärden:</legend>
      <label for="flow">Flöde/Tappning</label>
      <input type="checkbox" name="flow" id="flow" />
      <label for="level">Nivå</label>
      <input type="checkbox" name="level" id="level" />
      <label for="levelDownstream">Nivå nedströms</label>
      <input type="checkbox" name="levelDownstream" id="levelDownstream"/>
      <label for="rainFall">Nederbörd</label>
      <input type="checkbox" name="rainFall" id="rainFall" />
    </fieldset>
    <button type="submit">Visa värden</button>
  </fieldset>
  `;
  toggleModal();
}

//  Toggling the modals
function toggleModal() {
  modal.classList.toggle('showModal');
}

function windowOnClick(event) {
  if (event.target === modal) {
    toggleModal();
  }
}
>>>>>>> 36764346addaa0b7645ee732cc3593837e303a8d

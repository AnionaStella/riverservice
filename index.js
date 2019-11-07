document.addEventListener('DOMContentLoaded', () => {
  fetch('http://data.goteborg.se/RiverService/v1.1/MeasureSites/b9098f14-4d94-49bd-8c7b-2c15ab9c370e?format=json')
    .then(async response => {
      let json = await response.json();
      console.log(json);
      renderMeasureSites(json);
      // Get dates entered in search field
      document.getElementById('fromDate').addEventListener('input', getFromDate);
      document.getElementById('toDate').addEventListener('input', getToDate);
    })
})




let renderMeasureSites = measureSites => {
  measureSites.forEach(measureSite => {
    //create a cardDiv
    let siteCard = document.createElement("div");
    siteCard.className = "card";
    document.body.appendChild(siteCard);
    // create <p> and add name from array
    let siteNameParagraph = document.createElement("p");
    siteNameParagraph.className = "siteName";
    siteNameParagraph.innerText = measureSite.Description;
    siteCard.appendChild(siteNameParagraph);
    // create <p> for  flow content
    let siteFlowParagraph = document.createElement("p");
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
renderformName();


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

let renderGetSite = function (info) {
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
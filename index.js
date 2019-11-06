document.addEventListener('DOMContentLoaded', () => {
  fetch('http://data.goteborg.se/RiverService/v1.1/MeasureSites/b9098f14-4d94-49bd-8c7b-2c15ab9c370e?format=json')
    .then(async response => {
      let json = await response.json();
      console.log(json);
      renderMeasureSites(json);
    })
})

let renderMeasureSites = (measureSites) => {

  measureSites.forEach(measureSite => {
    //create a cardDiv
    let siteCard = document.createElement('div');
    siteCard.className = 'card';
    document.body.appendChild(siteCard);
    // create <p> and add name from array
    let siteNameParagraph = document.createElement('p');
    siteNameParagraph.className = 'siteName';
    siteNameParagraph.innerText = measureSite.Description;
    siteCard.appendChild(siteNameParagraph);
    // create <p> for  flow content
    let siteFlowParagraph = document.createElement('p');
    let measureParameter = getMeasureParameter(measureSite.MeasureParameters, 'Tapping' || 'Flow');
    siteFlowParagraph.innerText = measureParameter;
    siteCard.appendChild(siteFlowParagraph);
  });
}

let getMeasureParameter = (measureParameters, code) => {
  let result = measureParameters.filter(measureParameter => measureParameter.Code == code);
  let parameter = result[0];
  if (parameter == undefined) {
    return "inget värde";
  } else {
    return parameter.CurrentValue;
  }
}
// Get input information from form

let renderformName = (function (measureSites) {
  let formMeasureSites = [];
  let sites = document.getElementById('measureSites');
  return measureSites.forEach(function (measureSite) {
    formMeasureSites.push(measureSite);
    formMeasureSites.name = measureSite.Description;
    sites = formMeasureSites;
  })
})

// console-loggar info från formuläret
let fromDate = document.getElementById('fromDate');
console.log(fromDate.value)
let toDate = document.getElementById('toDate');
console.log(toDate.value)

// api-kall, idé för hämtning
function getMeasureSiteInfo() {
  fetch(`http://data.goteborg.se/RiverService/v1.1/Measurements/b9098f14-4d94-49bd-8c7b-2c15ab9c370e/${MeasureSite}/${MeasureParameter}/${fromDate}/${toDate}?format=json`)
    .then(async response => {
      let json = await response.json();
      console.log(json);
      renderGetSite(json);
    })
}

let renderGetSite = (function (info) {
  // Ska rendera info till modalfönster som öppnas när fomrulär fyllts i.
})

// Max value (to) should be yesterday
// Default from value is one month ago
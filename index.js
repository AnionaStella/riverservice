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
    siteFlowParagraph.innerText = measureParameter.Description + " " + measureParameter.CurrentValue;
    siteCard.appendChild(siteFlowParagraph);
  });
}

let getMeasureParameter = (measureParameters, code) => {
  return measureParameters.filter(measureParameter => measureParameter.Code == code)
}
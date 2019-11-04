document.addEventListener('DOMContentLoaded', () => {
    fetch('http://data.goteborg.se/RiverService/v1.1/MeasureSites/b9098f14-4d94-49bd-8c7b-2c15ab9c370e?format=json')
        .then(async response => {
            let json = await response.json();
            console.log(json);
        })
})
const map = L.map('map').setView([42, 12], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

document.getElementById('filterButton').addEventListener('click', () => {
    const file = document.getElementById('kmlFile').files[0];
    const regioneCode = document.getElementById('regioneCode').value;

    if (file && regioneCode) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const kml = event.target.result;
            const filteredKml = filterKml(kml, regioneCode);
            displayKml(filteredKml);
        };
        reader.readAsText(file);
    } else {
        alert('Seleziona un file KML e inserisci un codice regione.');
    }
});

function filterKml(kml, regioneCode) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(kml, 'text/xml');
    const placemarks = xml.getElementsByTagName('Placemark');
    const filteredPlacemarks = [];

    for (let i = 0; i < placemarks.length; i++) {
        const description = placemarks[i].getElementsByTagName('description')[0]?.textContent;
        if (description && description.includes(`CODREG=${regioneCode}`)) {
            filteredPlacemarks.push(placemarks[i]);
        }
    }

    const filteredKml = createKml(filteredPlacemarks);
    return filteredKml;
}

function createKml(placemarks) {
    let kml = '<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2">\n<Document>';
    placemarks.forEach(placemark => {
        kml += new XMLSerializer().serializeToString(placemark);
    });
    kml += '</Document>\n</kml>';
    return kml;
}

function displayKml(kml) {
    const geojson = toGeoJSON.kml(new DOMParser().parseFromString(kml, 'text/xml'));
    L.geoJSON(geojson).addTo(map);
}

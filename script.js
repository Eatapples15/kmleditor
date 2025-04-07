document.getElementById('filterButton').addEventListener('click', () => {
    const file = document.getElementById('kmlFile').files[0];
    const regioneCode = document.getElementById('regioneCode').value;

    if (file && regioneCode) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const kml = event.target.result;
            const filteredKml = filterKml(kml, regioneCode);
            downloadKml(filteredKml, `comuni_regione_${regioneCode}.kml`);
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

function downloadKml(kml, filename) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/xml;charset=utf-8,' + encodeURIComponent(kml));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

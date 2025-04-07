document.getElementById('filterButton').addEventListener('click', () => {
    const file = document.getElementById('kmlFile').files[0];
    const regioneCode = "17"; // Codice regione Basilicata

    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const kml = event.target.result;
            const filteredKml = filterKml(kml, regioneCode);
            downloadKml(filteredKml, `comuni_basilicata.kml`);
        };
        reader.readAsText(file);
    } else {
        alert('Seleziona un file KML.');
    }
});

function filterKml(kml, regioneCode) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(kml, 'text/xml');
    const placemarks = xml.getElementsByTagName('Placemark');
    const filteredPlacemarks = [];

    for (let i = 0; i < placemarks.length; i++) {
        const simpleData = placemarks[i].getElementsByTagName('SimpleData');
        for (let j = 0; j < simpleData.length; j++) {
            if (simpleData[j].getAttribute('name') === 'cod_reg' && simpleData[j].textContent === regioneCode) {
                filteredPlacemarks.push(placemarks[i]);
                break; // Non c'è bisogno di cercare altri SimpleData in questo Placemark
            }
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
    const blob = new Blob([kml], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const element = document.createElement('a');
    element.setAttribute('href', url);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(url); // Libera la memoria
}

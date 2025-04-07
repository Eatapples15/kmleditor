document.getElementById('extractButton').addEventListener('click', () => {
    const file = document.getElementById('kmlFile').files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const kml = event.target.result;
            extractComuni(kml);
        };
        reader.readAsText(file);
    } else {
        alert('Seleziona un file KML.');
    }
});

function extractComuni(kml) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(kml, 'text/xml');
    const schemaDataList = xml.getElementsByTagName('SchemaData');
    const comuniList = document.getElementById('comuniList');
    comuniList.innerHTML = ''; // Pulisci la lista precedente

    for (let i = 0; i < schemaDataList.length; i++) {
        const schemaData = schemaDataList[i];
        const simpleDataList = schemaData.getElementsByTagName('SimpleData');
        let comune = '';
        let proCom = '';

        for (let j = 0; j < simpleDataList.length; j++) {
            const simpleData = simpleDataList[j];
            if (simpleData.getAttribute('name') === 'comune') {
                comune = simpleData.textContent;
            } else if (simpleData.getAttribute('name') === 'pro_com') {
                proCom = simpleData.textContent;
            }
        }

        if (comune && proCom) {
            const listItem = document.createElement('li');
            listItem.textContent = `${comune} (${proCom})`;
            comuniList.appendChild(listItem);
        }
    }
}

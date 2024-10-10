'use strict';
const tabs = document.querySelectorAll('[data-id]');
const contents = document.querySelectorAll('[data-content]');
let dossier_select = document.getElementById("keyword");
let fichier_select = document.getElementById("file-selected");

let cook_file = document.getElementById("start_cooking");
let download_file = document.getElementById("download_file");

let prompt_phind = document.getElementById("prompt");

let id = 0;

tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
        tabs[id].classList.remove('active');
        tab.classList.add('active');
        id = tab.getAttribute('data-id');
        contents.forEach(function (box) {
            box.classList.add('hide');
            if (box.getAttribute('data-content') == id){
                box.classList.remove('hide');
                box.classList.add('show');
            }
        });
    });
});

// récupérer tous les mots-clés
fetch(`${serverUrl}/get-search-folders`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    }
})
    .then(response => response.json())
    .then(data => {
        afficheDossiers(data.folders)
    })
    .catch(error => {
        console.error('Erreur lors de la communication avec le serveur :', error);
    });


function afficheDossiers(dossiers){
    for(let dossier of dossiers){
        var option = document.createElement("option");
        option.value = dossier;
        option.text = dossier;
        dossier_select.appendChild(option);
    }
}

// quand on sélectionne un dossier :
dossier_select.addEventListener("change", function(){
    let dossier = dossier_select.options[dossier_select.selectedIndex];
    let postData = {
        folder: dossier.value
    }

    fetch(`${serverUrl}/get-files`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
    })
        .then(response => response.json())
        .then(data => {
            afficheFichiers(data.fichiers)
        })
        .catch(error => {
            console.error('Erreur lors de la communication avec le serveur :', error);
        });
})


function afficheFichiers(fichiers){
    // Supprime tous les enfants de l'élément <select>
    while(fichier_select.firstChild) {
        fichier_select.removeChild(fichier_select.firstChild);
    }

    for(let fichier of fichiers){
        var option = document.createElement("option");
        option.value = fichier;
        option.text = fichier;
        fichier_select.appendChild(option);
    }
}

// quand on clique sur "Analyser" :
cook_file.addEventListener("click", function(){
    processFile()
})


function downloadFile(folder, filename) {
    if(folder && filename){
        let filepath = `../recherches/${folder}/${filename}`;
        let link = document.createElement("a");
        link.href = filepath;
        link.download = filepath;
        link.click();
    }
}


download_file.addEventListener("click", function(){
    let dossier = dossier_select.options[dossier_select.selectedIndex].value;
    let fichier = fichier_select.options[fichier_select.selectedIndex].value;
    downloadFile(dossier, fichier);
})


function processFile() {
    let fichier = fichier_select.options[fichier_select.selectedIndex].value;

    const formData = new FormData();
    formData.append('fichier', fichier);

    if(environnement.checked){
        formData.append('environnement', 'oui');
    }
    if(sentiment.checked){
        formData.append('sentiment', 'oui');
    }
    if(animal.checked){
        formData.append('animal', 'oui');
        formData.append('prompt', prompt_phind.value);
    }

    fetch(`${serverUrl}/process-file`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // if (data.result == 'ok') {
        //     console.log('File processed successfully');
        //     console.log(data.lst_animaux);
        // } else {
        //     console.error('File processing failed');
        // }
    })
    .catch(error => console.error('Error:', error));
}
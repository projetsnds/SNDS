
//bouton lancer recherche
let startButton = document.getElementById("start-button");

const body = document.querySelector("body")

//checkbox sn
// let xcb = document.getElementById("x-cb");
let ytcb = document.getElementById("yt-cb");
let redditcb = document.getElementById("reddit-cb");
let igcb = document.getElementById("ig-cb");
let fkrcb = document.getElementById("fkr-cb");

//X
// let xsearch = document.getElementById("x-search");
// let xcountry = document.getElementById("x-country");
// let xtradbtn = document.getElementById("x-btn-trad");
// let xstartdate = document.getElementById("x-start-date");
// let xenddate = document.getElementById("x-end-date");
// let xnbposts = document.getElementById("x-nb");
// let xduree = document.getElementById("x-duree");
// let x_post_duration = 0.15;

let gl_duree;
let gl_rs;

// YT
let ytsearch = document.getElementById("yt-search");
let ytcountry = document.getElementById("yt-country");
let yttradbtn = document.getElementById("yt-btn-trad");
let ytstartdate = document.getElementById("yt-start-date");
let ytenddate = document.getElementById("yt-end-date");
let ytnbvideos = document.getElementById("yt-nb");
let ytduree = document.getElementById("yt-duree");
let yttoggle = document.getElementById("yt-toggleButton")
let yt_post_duration = 1;
let ytmax = 2500;
let ytmaxduree = "41min 40s";

// Reddit
let redditsearch = document.getElementById("reddit-community");
let redditcountry = document.getElementById("reddit-country");
let reddittradbtn = document.getElementById("reddit-btn-trad");
let redditstartdate = document.getElementById("reddit-start-date");
let redditenddate = document.getElementById("reddit-end-date");
let redditnbposts = document.getElementById("reddit-nb");
let redditpopulaires = document.getElementById("reddit-populaires");
let redditrecents = document.getElementById("reddit-recents");
let redditduree = document.getElementById("reddit-duree");
let redditadd = document.getElementById("reddit-add");
let reddit_post_duration = 0.015;

//instagram
let igsearch = document.getElementById("ig-search");
let igcountry = document.getElementById("ig-country");
let igtradbtn = document.getElementById("ig-btn-trad");
let igenddate = document.getElementById("ig-end-date");
let ignbposts = document.getElementById("ig-nb");
let igduree = document.getElementById("ig-duree");
let ig_post_duration = 0.068;

// Flickr
let fkrsearch = document.getElementById("fkr-search");
let fkrcountry = document.getElementById("fkr-country");
let fkrtradbtn = document.getElementById("fkr-btn-trad");
let fkrstartdate = document.getElementById("fkr-start-date");
let fkrenddate = document.getElementById("fkr-end-date");
let fkrnbposts = document.getElementById("fkr-nb");
let fkrduree = document.getElementById("fkr-duree");
let fkr_post_duration = 1;



var searchInputs = document.getElementsByClassName('search_social');

// Itérer sur chaque élément ayant la classe 'search_social'
for (var i = 0; i < searchInputs.length; i++) {
    (function() {
        var inputElement = searchInputs[i];
        var errorMessage = inputElement.nextElementSibling;

        inputElement.addEventListener('input', function(event) {
            var inputValue = event.target.value;
            var sanitizedValue = inputValue.replace(/[\/\\\-]/g, '');
    
            // Vérifier si la valeur saisie contient les caractères interdits
            if (inputValue !== sanitizedValue) {
                // Afficher le message d'erreur
                errorMessage.style.display = 'block';
            } else {
                // Masquer le message d'erreur s'il n'y a pas de caractères interdits
                errorMessage.style.display = 'none';
            }
    
            // Mettre à jour la valeur du champ avec la version sans caractères interdits
            event.target.value = sanitizedValue;
        });
    })();
}


// modification de l'estimation du temps des requêtes lorsque l'on modifie le nombre de posts
// xnbposts.addEventListener("input", function(){
//     durationEstimation(xduree, x_post_duration, xnbposts.value)
// })

ytnbvideos.addEventListener("input", function () {
    durationEstimation(ytduree, yt_post_duration, ytnbvideos.value)
    gl_duree = ytduree.innerText
    gl_rs = "yt"
})

redditnbposts.addEventListener("input", function () {
    durationEstimation(redditduree, reddit_post_duration, redditnbposts.value)
    gl_duree = redditduree.innerText
    gl_rs = "reddit"
})

ignbposts.addEventListener("input", function () {
    durationEstimation(igduree, ig_post_duration, ignbposts.value)
    gl_duree = igduree.innerText
    gl_rs = "ig"
})

fkrnbposts.addEventListener("input", function () {
    durationEstimation(fkrduree, fkr_post_duration, fkrnbposts.value)
    gl_duree = fkrduree.innerText
    gl_rs = "fkr"
})



// affichage des langues pour chaque réseau social
// xcountry.addEventListener("click", function(){
//     toggleLangs(xsearch, "Twitter", xcountry);
// });

ytcountry.addEventListener("click", function () {
    toggleLangs(ytsearch, "YouTube", ytcountry);
});

redditcountry.addEventListener("click", function () {
    toggleLangs(redditsearch, "Reddit", redditcountry);
});

igcountry.addEventListener("click", function () {
    toggleLangs(igsearch, "Instagram", igcountry);
});

fkrcountry.addEventListener("click", function () {
    toggleLangs(fkrsearch, "Flickr", fkrcountry);
});


// affichage des communautés Reddit selon la langue choisie
redditsearch.addEventListener("click", function () {
    getCommunities(selected_langs["reddit"], redditsearch)
})

// ajouter une nouvelle communauté Reddit
redditadd.addEventListener("click", function(){
    addCommunity()
})


// fonction qui remplace tous les champs par ceux de l'élément de l'historique demandé
function remplacerParRecherche(btn_clicked, recherche) {
    for (let cle in recherche) {
        // si c'est une checkbox :
        if (cle.includes("cb")) {
            document.getElementById(cle).checked = recherche[cle]
        }
        // si c'est la communauté Reddit :
        else if (cle.includes("community")) {
            selected_community = recherche[cle]
            if (recherche[cle] != "") {
                document.getElementById(cle).innerText = recherche[cle]
            }
        }
        // si c'est un pays :
        else if (cle.includes("country")) {
            let network = cle.split('-')[0]
            selected_langs[network] = recherche[cle]
            if (recherche[cle] != "") {
                let img = `img/pays/${recherche[cle]}.png`
                document.getElementById(cle).innerHTML = `<img src="${img}" alt="${recherche[cle]}" style="height: 20px; width: auto;">`
            }
        }
        else {
            document.getElementById(cle).value = recherche[cle]
        }
    }
    if (btn_clicked.classList.contains("search-not-selected")) {
        btn_clicked.classList.remove("search-not-selected")
        btn_clicked.classList.add("search-selected")
        for (let btn of document.querySelectorAll(".lm-search")) {
            if (btn.innerText != btn_clicked.innerText && btn.classList.contains("search-selected")) {
                btn.classList.remove("search-selected")
                btn.classList.add("search-not-selected")
            }
        }
    }
}




// fonction qui affiche l'historique des recherches sur l'interface
function afficheHistorique(recherches) {
    const container = document.querySelector(".left-menu");

    for (let recherche in recherches) {
        let btnContainer = document.createElement("div");
        btnContainer.classList.add("search-item");

        let btn = create("button", btnContainer, recherche, ["lm-search", "search-not-selected"]);
        

        // Création des trois petits points pour le menu contextuel
        let ellipsis = document.createElement("span");
        ellipsis.classList.add("ellipsis");
        ellipsis.textContent = "⋮";

        // Ajout des trois petits points au conteneur de bouton
        btnContainer.appendChild(ellipsis);

        // Gestionnaire d'événements pour ouvrir le menu contextuel
        ellipsis.addEventListener("click", (event) => {
            event.stopPropagation();
            //Si le menu est déjà ouvert, on le ferme
            const existingMenu = document.querySelector(".context-menu");
            if (existingMenu) {
                console.log("existingMenu", existingMenu)
                existingMenu.parentNode.removeChild(existingMenu);
            }
            else {
                ouvrirMenuContextuel(btnContainer, recherche);
            }   
        });

        // Ajout du conteneur de bouton au conteneur principal
        container.appendChild(btnContainer);

        // Gestionnaire d'événements pour supprimer la recherche
        function supprimerRecherche(recherche) {
            event.stopPropagation(); 
            supprimerRecherche(recherche); 
            container.removeChild(btnContainer); 
        }

        // Gestionnaire d'événements pour remplacer par la recherche
        function remplacerParRecherche(btn, recherche) {
            remplacerParRecherche(btn, recherche)
        }
    }
}



function ouvrirMenuContextuel(container, recherche) {
    // Créer le menu contextuel
    const menu = document.createElement("div");
    menu.classList.add("context-menu");

    // Créer les options du menu
    const supprimerOption = document.createElement("div");
    supprimerOption.textContent = "Supprimer";
    supprimerOption.addEventListener("click", () => {
        supprimerRecherche(recherche);
        container.parentNode.removeChild(container);
        menu.parentNode.removeChild(menu);
    });

    const telechargerOption = document.createElement("div");
    telechargerOption.textContent = "Télécharger";
    telechargerOption.addEventListener("click", () => {
        //appel au serveur pour récupérer les fichiers
        fetch(`${serverUrl}/full-name-historique`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            data.forEach(dir => {
                //si le nom du fichier contient la recherche
                if(dir.includes(recherche)){
                    //telechargement du fichier
                    let link = document.createElement("a");
                    link.href = "recherches/"+dir;
                    link.download = dir;
                    link.click();
                }
            })
        });
    });

    // Ajouter les options au menu
    menu.appendChild(supprimerOption);
    menu.appendChild(telechargerOption);

    // Ajouter le menu au DOM
    container.appendChild(menu);

    // Positionner le menu juste à droite des trois points
    const rect = container.getBoundingClientRect();
    menu.style.top = `${rect.top+10}px`;
    menu.style.left = `${rect.right+10}px`;

    // Fermer le menu contextuel lorsque l'utilisateur clique en dehors de celui-ci
    document.addEventListener("click", fermerMenuContextuel);

    function fermerMenuContextuel(event) {
        if (!menu.contains(event.target)) {
            menu.parentNode.removeChild(menu);
            document.removeEventListener("click", fermerMenuContextuel);
        }
    }
    
}





// Fonction qui supprime dans l'historique JSON la recherche demandée
function supprimerRecherche(recherche) {
    fetch(`${serverUrl}/supprimer-recherche`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ recherche: recherche })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Erreur lors de la suppression de l\'historique.');
        }
    })
    .then(data => {
        console.log(data.text); 
    })
    .catch(error => {
        console.error('Erreur:', error);
    });
}

//fonction pour le basculement du bouton all
function toggleInput(input, button, socialmax) {

    if (input.disabled) {
        input.disabled = false;
        input.classList.remove('greyed-out');
        button.textContent = 'all';
        button.style.backgroundColor = '';

    } else {
        input.disabled = true;
        input.classList.add('greyed-out');
        button.textContent = 'annuler';
        button.style.backgroundColor = 'red';
        input.value = socialmax
        ytduree.innerText = ytmaxduree
    }
}

//bouton all 
yttoggle.addEventListener("click", function () {
    toggleInput(ytnbvideos, yttoggle, ytmax)
})



const serverUrl = 'http://localhost:5000';

// on récupère direct l'historique
fetch(`${serverUrl}/lire-historique`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    }
})
    .then(response => response.json())
    .then(data => {
        afficheHistorique(data.text)
    })
    .catch(error => {
        console.error('Erreur lors de la communication avec le serveur :', error);
    });




startButton.addEventListener("click", function () {
    showLoadingPopup();

    // if (xcb.checked) {
    //     console.log("Recherche sur x");
    //     const postData = {
    //         xsearch: xsearch.value,
    //         xcountry: selected_langs["twitter"],
    //         xstartdate: xstartdate.value,
    //         xenddate: xenddate.value,
    //         xnbposts: xnbposts.value
    //     }

    //     fetch(`${serverUrl}/x-search`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(postData),
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log('Réponse du serveur :', data);
    //         hideLoadingPopup();
    //     })
    //     .catch(error => { 
    //         hideLoadingPopup();
    //         fetch(`${serverUrl}/logs`)
    //         .then(response => {return response.text()})
    //         .then(data => {
    //             handleErrorPopup(data); 
    //         })
    //     });
    // }
    if (ytcb.checked) {
        console.log("Recherche sur yt");

        const postData = {
            ytsearch: ytsearch.value,
            ytcountry: countryLanguageMap[selected_langs["youtube"]],
            ytstartdate: ytstartdate.value,
            ytenddate: ytenddate.value,
            ytnbvideos: ytnbvideos.value
        }

        // Envoyer la valeur au serveur
        fetch(`${serverUrl}/yt-search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        })
            .then(response => response.json())
            .then(data => {
                hideLoadingPopup();
                console.log('Réponse du serveur :', data);
                // Afficher le popup
                var successPopup = document.getElementById('success-popup');
                successPopup.style.display = 'block';
                handleErrorPopup('La recherche a été effectuée avec succès !');
            })
            .catch(error => {
                hideLoadingPopup();
                fetch(`${serverUrl}/logs`)
                    .then(response => { return response.text() })
                    .then(data => {
                        handleErrorPopup(data);
                    })
            });
    }
    if (redditcb.checked) {
        let reddit_sort = "populaires";

        if(redditrecents.checked){
            reddit_sort = redditrecents.value;
        }

        console.log("Recherche sur reddit");
        const postData = {
            search: selected_community,
            redditstartdate: redditstartdate.value,
            redditenddate: redditenddate.value,
            redditnbposts: redditnbposts.value,
            redditsort: reddit_sort
        }


        fetch(`${serverUrl}/reddit-search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        })
            .then(response => response.json())
            .then(data => {
                hideLoadingPopup();
                console.log('Réponse du serveur :', data);
                handleErrorPopup('La recherche a été effectuée avec succès !');
            })
            .catch(error => {
                console.log("ça marche pas")
                hideLoadingPopup();
                fetch(`${serverUrl}/logs`)
                    .then(response => { return response.text() })
                    .then(data => {
                        handleErrorPopup(data); // Passer le texte de la réponse à la fonction handleErrorPopup
                    })
            });
    }
    if (igcb.checked) {
        console.log("Recherche sur yt");

        const postData = {
            search: igsearch.value,
            nbposts: ignbposts.value,
        }

        // Envoyer la valeur au serveur
        fetch(`${serverUrl}/ig-search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        })
            .then(response => response.json())
            .then(data => {
                hideLoadingPopup();
                console.log('Réponse du serveur :', data);
                handleErrorPopup('La recherche a été effectuée avec succès !');
            })
            .catch(error => {
                hideLoadingPopup();
                fetch(`${serverUrl}/logs`)
                    .then(response => { return response.text() })
                    .then(data => {
                        handleErrorPopup(data);
                    })
            });
    }
    if (fkrcb.checked) {
        console.log("Recherche sur Flickr");
        const postData = {
            fkrsearch: fkrsearch.value,
            fkrcountry: selected_langs["flickr"],
            fkrstartdate: fkrstartdate.value,
            fkrenddate: fkrenddate.value,
            fkrnbposts: fkrnbposts.value
        }


        fetch(`${serverUrl}/fkr-search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        })
            .then(response => response.json())
            .then(data => {
                hideLoadingPopup();
                console.log('Réponse du serveur :', data);
                handleErrorPopup('La recherche a été effectuée avec succès !');
            })
            .catch(error => {
                console.log("ça marche pas")
                hideLoadingPopup();
                fetch(`${serverUrl}/logs`)
                    .then(response => { return response.text() })
                    .then(data => {
                        handleErrorPopup(data); // Passer le texte de la réponse à la fonction handleErrorPopup
                    })
            });
    }

    // on écrit dans l'historique
    const historiqueData = {
        //"x-cb": xcb.checked,
        "yt-cb": ytcb.checked,
        "reddit-cb": redditcb.checked,
        "ig-cb": igcb.checked,
        "fkr-cb": fkrcb.checked,
        //"x-search": xsearch.value,
        //"x-country": selected_langs["twitter"],
        //"x-start-date": xstartdate.value,
        //"x-end-date": xenddate.value,
        //"x-nb": parseInt(xnbposts.value),
        "yt-search": ytsearch.value,
        "yt-country": selected_langs["youtube"],
        "yt-start-date": ytstartdate.value,
        "yt-end-date": ytenddate.value,
        "yt-nb": parseInt(ytnbvideos.value),
        "reddit-community": selected_community,
        "reddit-country": selected_langs["reddit"],
        "reddit-start-date": redditstartdate.value,
        "reddit-end-date": redditenddate.value,
        "reddit-nb": parseInt(redditnbposts.value),
        "ig-search": igsearch.value,
        "ig-country": selected_langs["instagram"],
        "ig-end-date": igenddate.value,
        "ig-nb": parseInt(ignbposts.value),
        "fkr-search": fkrsearch.value,
        "fkr-country": selected_langs["flickr"],
        "fkr-start-date": fkrstartdate.value,
        "fkr-end-date": fkrenddate.value,
        "fkr-nb": parseInt(fkrnbposts.value)
    }

    fetch(`${serverUrl}/ecrire-historique`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(historiqueData),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Réponse du serveur :', data);
        })
        .catch(error => {
            console.error('Erreur lors de la communication avec le serveur :', error);
        });
});


//popup d'erreur 
function handleErrorPopup(msg) {
    // Afficher le message d'erreur
    var popupMessage = document.getElementById("popup-message");
    if (msg.includes("500")) {
        popupMessage.innerHTML = "Oups, un problème est survenu au niveau du serveur (Erreur 500)";
    } else if (msg.includes("400")) {
        popupMessage.innerHTML = "Oups, la page que vous avez demandé est introuvable (Erreur 404)";
    } else if (msg.includes("404")) {
        popupMessage.innerHTML = "Oups, la syntaxe de la requête effectuée est incorrecte (Erreur 400)";
    } else if (msg.includes("network")) {
        popupMessage.innerHTML = "Oups, un problème de réseau est survenu";
    } else {
        popupMessage.innerHTML = msg;
    }

    // Afficher le popup
    var popupDiv = document.getElementById("popup");
    popupDiv.classList.add("show");

    // Supprimer le popup après 5 secondes
    setTimeout(function () {
        popupDiv.classList.remove("show");
    }, 5000);
}

document.querySelector(".buttonStop").addEventListener("click", function () {
    fetch(`${serverUrl}/stop-server`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (response.ok) {
                console.log('Server will stop after completing current task.');
            } else {
                console.error('Failed to send stop request to server.');
            }
        })
        .catch(error => {
            console.error('Error while sending stop request to server:', error);
        });
});


// Fonction pour afficher le pop-up de chargement
function showLoadingPopup() {
    // Afficher l'overlay
    document.querySelector('.overloading').style.display = 'block';

    // Compteur de post
    cpt = 0;

    // Séparer la durée en heures, minutes et secondes
    let duree = gl_duree.split(" ");
    let heures = 0;
    let minutes = 0;
    let secondes = 0;

    // Si le tableau a 3 éléments, cela signifie qu'il y a des heures, des minutes et des secondes
    if (duree.length === 3) {
        heures = parseInt(duree[0]);
        minutes = parseInt(duree[1]);
        secondes = parseInt(duree[2]);
    } else if (duree.length === 2) {
        // Si le tableau a 2 éléments, cela signifie qu'il y a soit des minutes et des secondes, soit des heures et des minutes
        if (duree[0].includes("h")) {
            heures = parseInt(duree[0]);
            minutes = parseInt(duree[1]);
        } else {
            minutes = parseInt(duree[0]);
            secondes = parseInt(duree[1]);
        }
    } else {
        // Sinon, il n'y a qu'une seule unité de temps (heures, minutes ou secondes)
        if (duree[0].includes("h")) {
            heures = parseInt(duree[0]);
        } else if (duree[0].includes("min")) {
            minutes = parseInt(duree[0]);
        } else if (duree[0].includes("s")) {
            secondes = parseInt(duree[0]);
        }
    }

    // Convertir toutes les unités en secondes
    let total = heures * 3600 + minutes * 60 + secondes;

    let interval = setInterval(function () {
        total--;
        if (total <= 0) {
            clearInterval(interval);
            hideLoadingPopup();
        }

        // Calculer les heures, les minutes et les secondes restantes
        heures = Math.floor(total / 3600);
        minutes = Math.floor((total % 3600) / 60);
        secondes = total % 60;

        // Formatage pour afficher avec deux chiffres
        let formattedTime = heures.toString().padStart(2, '0') + "h " +
                            minutes.toString().padStart(2, '0') + "min " +
                            secondes.toString().padStart(2, '0') + "s";

        // Afficher le temps restant
        document.querySelector('.txt-loading').innerHTML = formattedTime;
        if(gl_rs == "yt"){
            cpt += 1
            document.querySelector('.nb-posts').innerHTML = cpt + " / " + ytnbvideos.value;
        }
        if(gl_rs == "reddit"){
            cpt += 67
            document.querySelector('.nb-posts').innerHTML = cpt + " / " + redditnbposts.value;
        }
        if(gl_rs == "ig"){
            cpt += 15
            document.querySelector('.nb-posts').innerHTML = cpt + " / " + ignbposts.value;
        }
        if(gl_rs == "fkr"){
            cpt += 1
            document.querySelector('.nb-posts').innerHTML = cpt + " / " + fkrnbposts.value;
        }
    }, 1000);

}

// Fonction pour cacher le pop-up de chargement
function hideLoadingPopup() {
    // Cacher l'overlay
    document.querySelector('.overloading').style.display = 'none';
}


// Fonction pour calculer la durée totale de la recherche
function calculateTotalDuration() {
    let totalDuration = 0;
    // if (xcb.checked) {
    //     totalDuration += x_post_duration * xnbposts.value;
    // }
    if (ytcb.checked) {
        totalDuration += yt_post_duration * ytnbvideos.value;
    }
    if (redditcb.checked) {
        totalDuration += reddit_post_duration * redditnbposts.value;
    }
    return totalDuration;
}


// Gestion bouton IA
document.querySelector(".IA_button").addEventListener("click", function () {
    window.location.href = "IA/index2.html";
});


// modifier la config
function updateConfig(key, champ){
    let postData = {
        cle: key,
        valeur: champ.value
    }

    fetch(`${serverUrl}/update-config`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
    })
        .then(response => {
            if (response.ok) {
                console.log('La clé a bien été modifiée');
            } else {
                console.error("La clé n' pas pu être modifiée");
            }
        })
        .catch(error => {
            console.error('Erreur lors de la communication avec le serveur :', error);
        });
}

// popup de config
function toggleConfigPopup(config_list, config){
    // YouTube
    let yt = create("div", config_list, null, ["network-config"])
    let yt_title = create("div", yt, null, ["network-config-title"])
    create("h2", yt_title, "YouTube")
    let yt_subtitle = create("div", yt, null, ["network-config-key"])

    // YouTube config
    let yt_config = create("div", yt_subtitle, null, ["network-config-div"])
    let yt_label = create("label", yt_config, "Clé d'API", ["api-key"])
    let yt_input = createChamp(yt_config, "text", "yt-api-key")
    yt_input.value = config["YOUTUBE_API_KEY"]
    let yt_button = create("button", yt_config, "Appliquer", ["api-key-button"], "yt-api-button")
    yt_button.addEventListener("click", function(){updateConfig("YOUTUBE_API_KEY", yt_input)})

    // Reddit
    let reddit = create("div", config_list, null, ["network-config"])
    let reddit_title = create("div", reddit, null, ["network-config-title"])
    create("h2", reddit_title, "Reddit")
    let reddit_subtitle = create("div", reddit, null, ["network-config-key"])

    // Reddit config
    let reddit_config_id = create("div", reddit_subtitle, null, ["network-config-div"])
    let reddit_id = create("label", reddit_config_id, "Client ID", ["api-key"])
    let reddit_id_input = createChamp(reddit_config_id, "text", "reddit-client-id")
    reddit_id_input.value = config["REDDIT_CLIENT_ID"]
    let reddit_id_button = create("button", reddit_config_id, "Appliquer", ["api-key-button"], "reddit-client-id-button")
    reddit_id_button.addEventListener("click", function(){updateConfig("REDDIT_CLIENT_ID", reddit_id_input)})

    let reddit_config_secret = create("div", reddit_subtitle, null, ["network-config-div"])
    let reddit_secret = create("label", reddit_config_secret, "Client Secret", ["api-key"])
    let reddit_secret_input = createChamp(reddit_config_secret, "text", "reddit-client-secret")
    reddit_secret_input.value = config["REDDIT_CLIENT_SECRET"]
    let reddit_secret_button = create("button", reddit_config_secret, "Appliquer", ["api-key-button"], "reddit-client-secret-button")
    reddit_secret_button.addEventListener("click", function(){updateConfig("REDDIT_CLIENT_SECRET", reddit_secret_input)})

    let reddit_config_agent = create("div", reddit_subtitle, null, ["network-config-div"])
    let reddit_agent = create("label", reddit_config_agent, "User Agent", ["api-key"])
    let reddit_agent_input = createChamp(reddit_config_agent, "text", "reddit-user-agent")
    reddit_agent_input.value = config["REDDIT_USER_AGENT"]
    let reddit_agent_button = create("button", reddit_config_agent, "Appliquer", ["api-key-button"], "reddit-user-agent-button")
    reddit_agent_button.addEventListener("click", function(){updateConfig("REDDIT_USER_AGENT", reddit_agent_input)})
    
    // Instagram
    let insta = create("div", config_list, null, ["network-config"])
    let insta_title = create("div", insta, null, ["network-config-title"])
    create("h2", insta_title, "Instagram")
    let insta_subtitle = create("div", insta, null, ["network-config-key"])
    
    // Instagram config
    let insta_config_user = create("div", insta_subtitle, null, ["network-config-div"])
    let insta_user = create("label", insta_config_user, "User ID", ["api-key"])
    let insta_user_input = createChamp(insta_config_user, "text", "insta-user")
    insta_user_input.value = config["INSTA_USER_ID"]
    let insta_user_button = create("button", insta_config_user, "Appliquer", ["api-key-button"], "insta-user-button")
    insta_user_button.addEventListener("click", function(){updateConfig("INSTA_USER_ID", insta_user_input)})

    let insta_config_key = create("div", insta_subtitle, null, ["network-config-div"])
    let insta_key = create("label", insta_config_key, "Clé d'API", ["api-key"])
    let insta_key_input = createChamp(insta_config_key, "text", "insta-key")
    insta_key_input.value = config["INSTA_API_TOKEN"]
    let insta_key_button = create("button", insta_config_key, "Appliquer", ["api-key-button"], "insta-key-button")
    insta_key_button.addEventListener("click", function(){updateConfig("INSTA_API_TOKEN", insta_key_input)})

    // Flickr
    let flickr = create("div", config_list, null, ["network-config"])
    let flickr_title = create("div", flickr, null, ["network-config-title"])
    create("h2", flickr_title, "Flickr")
    let flickr_subtitle = create("div", flickr, null, ["network-config-key"])
    
    // Flickr config
    let flickr_config_key = create("div", flickr_subtitle, null, ["network-config-div"])
    let flickr_key = create("label", flickr_config_key, "Clé d'API", ["api-key"])
    let flickr_key_input = createChamp(flickr_config_key, "text", "flickr-key")
    flickr_key_input.value = config["FLICKR_API_KEY"]
    let flickr_key_button = create("button", flickr_config_key, "Appliquer", ["api-key-button"], "flickr-key-button")
    flickr_key_button.addEventListener("click", function(){updateConfig("FLICKR_API_KEY", flickr_key_input)})

    let flickr_config_secret = create("div", flickr_subtitle, null, ["network-config-div"])
    let flickr_secret = create("label", flickr_config_secret, "Clé secrète", ["api-key"])
    let flickr_secret_input = createChamp(flickr_config_secret, "text", "flickr-secret")
    flickr_secret_input.value = config["FLICKR_API_SECRET"]
    let flickr_secret_button = create("button", flickr_config_secret, "Appliquer", ["api-key-button"], "flickr-secret-button")
    flickr_secret_button.addEventListener("click", function(){updateConfig("FLICKR_API_SECRET", flickr_secret_input)})
}

// configuration des clés d'API
let config_button = document.getElementById("config_button");

config_button.addEventListener("click", function(){
    const overlay = create("div", body, null, ["overlay"])

    overlay.onclick = e => {
        e.stopPropagation()
        e.target.remove()
    }

    let config_list = create("div", overlay, null, ["country-list-visible"], "country-list")

    config_list.onclick = e => {
        e.stopPropagation()
    }

    fetch(`${serverUrl}/get-config`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            toggleConfigPopup(config_list, data)
        })
        .catch(error => {
            console.error('Erreur lors de la communication avec le serveur :', error);
        });
})
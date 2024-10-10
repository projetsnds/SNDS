const serverUrl = 'http://localhost:5000';

let train_model = document.getElementById("train_model");
let nb_epochs = document.getElementById("epochs-count");

// Gestion bouton HOME
document.querySelector(".HOME_button").addEventListener("click", function () {
    window.location.href = "../index.html";
});


// entraîner le modèle
train_model.addEventListener("click", function(){
    let postData = {
        epochs: nb_epochs.value
    }

    fetch(`${serverUrl}/train-model`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.text)
        })
        .catch(error => {
            console.error('Erreur lors de la communication avec le serveur :', error);
        });
})

// fonction qui crée un élément HTML
function create(tagName, container, text=null, classNames=null, id=null, src=null, alt=null){
    let elt = container.appendChild(document.createElement(tagName))
    text ? elt.appendChild(document.createTextNode(text)) : elt
    classNames ? classNames.forEach(className => elt.classList.add(className)) : elt
    id ? elt.id = id : elt
    src ? elt.src = src : elt
    alt ? elt.alt = alt : elt
    return elt
}

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
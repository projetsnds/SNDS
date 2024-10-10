const langs = ["USA", "Espagne", "France", "Italie", "Portugal", "Allemagne", "Turquie", "Russie", "Thailande", "Vietnam", "Arabie Saoudite", "Afrique du Sud"]

let selected_langs = {
    "twitter":"",
    "youtube":"",
    "reddit":"",
    "instagram":"",
    "flickr":""
}

const countryLanguageMap = {
    "USA": "en",
    "Espagne": "es",
    "France": "fr",
    "Italie": "it",
    "Portugal": "pt",
    "Allemagne": "de",
    "Turquie": "tr",
    "Russie": "ru",
    "Thailande": "th",
    "Vietnam": "vi",
    "Arabie Saoudite": "ar",
    "Afrique du Sud": "af"
};

// communauté Reddit sélectionnée
let selected_community = ""


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

// fonction qui crée un élément de type input
function createChamp(container, type="text", name= null, placeholder=null){

    let champ = container.appendChild(document.createElement("input"))

    type ? champ.setAttribute("type", type) : champ
    name ? champ.setAttribute("name", name) : champ
    placeholder ? champ.setAttribute("placeholder", placeholder) : champ

    return champ
}


// Paramètres : liste de pays (NodeList de HTMLElement qui contiennent chacun le drapeau du pays et son nom), et un mot cherché (string)
// Résultat : rend invisible tous les pays qui ne commencent pas par le mot cherché
function modifyLangList(lst_countries, search){
    for(let country of lst_countries){
        let lang = country.querySelector(".country-name").innerText.toLowerCase()

        // si la langue courante ressemble au mot cherché :
        if(lang.startsWith(search.toLowerCase())){
            if(country.classList.contains("invisible")){
                country.classList.remove("invisible")
                country.classList.add("country")
            }
        }
        else{
            if(country.classList.contains("country")){
                country.classList.remove("country")
                country.classList.add("invisible")
            }
        }
    }
}

// Paramètres : nom de réseau social (string), et bouton depuis lequel on a cliqué (HTMLElement) pour afficher le pannel des langues
// Résultat : crée et affiche le pannel des langues pour le réseau social spécifié, met en évidence le pays sélectionné



function traduction(inputElement,targetLanguage) {

    // URL de base pour l'API Google Translate
    let apiUrlBase = 'https://translate.googleapis.com/translate_a/single';

    // Paramètres de requête pour l'API
    let params = new URLSearchParams({
        client: 'gtx',
        sl: 'auto', // Source language auto-detection
        tl: countryLanguageMap[targetLanguage], // Target language
        dt: 't', // Text translation type
        q: inputElement.value
    });

    // Effectuer une requête GET à l'API Google Translate
    fetch(`${apiUrlBase}?${params.toString()}`)
        .then(response => response.json())
        .then(data => {
            // Extraire le texte traduit
            let translatedText = data[0][0][0];

            // Afficher la traduction dans l'élément d'entrée
            inputElement.value = translatedText;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function toggleLangs(inputElement, network, btn){

    if (!inputElement) {
        console.error('Input element or target language is missing');
    }

    const overlay = create("div", body, null, ["overlay"])

    overlay.onclick = e => {
        e.stopPropagation()
        e.target.remove()
    }

    let country_list = create("div", overlay, null, ["country-list-visible"], "country-list")

    country_list.onclick = e => {
        e.stopPropagation()
    }

    // titre
    let country_list_title = create("div", country_list, null, null, "country-list-title")
    let titre = create("h2", country_list_title, "Choisir au moins une langue pour ")
    let span = create("span", titre, network, null, "country-list-network")
    let search = createChamp(country_list_title, "text", "country-search", "Rechercher...")

    // liste des langues
    let all_countries = create("div", country_list, null, null, "all-countries")

    for(let lang of langs){
        let country = create("div", all_countries, null, ["country"], lang.substring(0,2).toLowerCase())
        create("img", country).src = `img/pays/${lang.toLowerCase()}.png`
        create("div", country, lang, ["country-name"])
    }

    let countries = document.querySelectorAll(".country")

    // modifier la liste des langues quand on cherche un mot
    search.addEventListener("input", () => modifyLangList(countries, search.value))

    for(let langue of countries){

        let name = langue.querySelector(".country-name").innerText

        // si la langue est demandée pour ce réseau social :
        if(selected_langs[`${network.toLowerCase()}`] == name){
            langue.style.backgroundColor = "#91DF89"
        }
        else{
            langue.style.backgroundColor = ""
        }

        let flagImg = langue.querySelector("img")
        flagImg.src = `img/pays/${name.toLowerCase()}.png`; // Assurez-vous que le chemin est correct
        flagImg.alt = name;

        langue.addEventListener("click", function(){
            if(selected_langs[`${network.toLowerCase()}`] == name){
                selected_langs[`${network.toLowerCase()}`] = ""
                langue.style.backgroundColor = ""
            }
            else{
                for(let l of countries){
                    l.style.backgroundColor = ""
                }

                selected_langs[`${network.toLowerCase()}`] = name
                langue.style.backgroundColor = "#91DF89"
            }

            if(selected_langs[`${network.toLowerCase()}`] == ""){
                btn.innerText = `Choisir...`
            }
            else{
                let flagUrl = flagImg.src;
                btn.innerHTML = `<img src="${flagUrl}" alt="${name}" style="height: 20px; width: auto;">`;
            }
        })
    }

    // bouton pour valider la langue sélectionnée
    let valider = create("button", country_list, "Valider", null, "country-validate")

    valider.addEventListener("click", function(){

        // Reddit ne possède pas de mot-clé à traduire
        if(!inputElement.id.startsWith('reddit')){
            traduction(inputElement, selected_langs[`${network.toLowerCase()}`]);
        }
        else{
            selected_community = ""
            document.getElementById("reddit-community").innerText = "Choisir..."
        }
        country_list.remove()
        overlay.remove()
    })
}



// fonction qui récupère les communautés Reddit
function getCommunities(langue, btn){
    fetch(`${serverUrl}/subreddits`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            toggleCommunities(data, langue, btn)
        })
        .catch(error => {
            console.error('Erreur lors de la communication avec le serveur :', error);
        });
}


function deleteCommunity(container, country, name){
    const postData = {
        pays: country,
        nom: name
    }

    fetch(`${serverUrl}/delete-subreddit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    })
        .then(response => response.json())
        .then(data => {
            container.remove()
        })
        .catch(error => {
            console.error('Erreur lors de la communication avec le serveur :', error);
        });
}


// fonction qui affiche les communautés Reddit sur l'interface
function toggleCommunities(communities, langue, btn){

    if(langue == ""){
        return;
    }

    const overlay = create("div", body, null, ["overlay"])

    overlay.onclick = e => {
        e.stopPropagation()
        e.target.remove()
    }

    let country_list = create("div", overlay, null, ["country-list-visible"], "country-list")

    country_list.onclick = e => {
        e.stopPropagation()
    }

    // titre
    let country_list_title = create("div", country_list, null, null, "country-list-title")
    let titre = create("h2", country_list_title, "Choisir une communauté pour la langue : ")
    let span = create("span", titre, langue, null, "country-list-network")

    // liste des communautés
    let all_communities = create("div", country_list, null, null, "all-communities")

    for(let community of communities[langue]){
        let community_container = create("div", all_communities, null, ["community"])
        create("div", community_container, community["nom"], ["community-name"])
        create("div", community_container, community["nb_membres"], ["community-members"])

        // supprimer la communauté
        let del_commu = create("div", community_container, "⋮", ["community-delete"])
        del_commu.addEventListener("click", function(){
            let menu = document.querySelector(".community-menu")

            if(menu){
                menu.remove()
            }
            else{
                let new_menu = create("div", del_commu, null, ["context-menu", "community-menu"])
                create("div", new_menu, "Supprimer").addEventListener("click", function(){
                    deleteCommunity(community_container, langue, community["nom"])
                })
            }
        })
    }

    if(communities[langue].length == 0){
        create("div", all_communities, "Aucune communauté disponible pour cette langue", ["rouge"])
    }

    let reddit_communities = document.querySelectorAll(".community")

    for(let communaute of reddit_communities){

        let name = communaute.querySelector(".community-name").innerText

        // si la langue est demandée pour ce réseau social :
        if(selected_community == name){
            communaute.style.backgroundColor = "#91DF89"
        }
        else{
            communaute.style.backgroundColor = ""
        }

        communaute.addEventListener("click", function(){
            if(selected_community == name){
                selected_community = ""
                communaute.style.backgroundColor = ""
            }
            else{
                for(let l of reddit_communities){
                    l.style.backgroundColor = ""
                }

                selected_community = name
                communaute.style.backgroundColor = "#91DF89"
            }

            if(selected_community == ""){
                btn.innerText = `Choisir...`
            }
            else{
                btn.innerHTML = `${selected_community.substring(0, 9)}...`;
            }
        })
    }

    // bouton pour valider la langue sélectionnée
    let valider = create("button", country_list, "Valider", null, "community-validate")

    valider.addEventListener("click", function(){
        country_list.remove()
        overlay.remove()
    })
}


// fonction qui demande à l'utilisateur d'ajouter une communauté Reddit
function addCommunity(){

    const overlay = create("div", body, null, ["overlay"])

    overlay.onclick = e => {
        e.stopPropagation()
        e.target.remove()
    }

    let country_list = create("div", overlay, null, ["country-list-visible"], "country-list")

    country_list.onclick = e => {
        e.stopPropagation()
    }

    // pays de la communauté
    let country_list_title = create("div", country_list, null, null, "subreddit-country")
    create("p", country_list_title, "Pays associé à la communauté")
    let lst = create("select", country_list_title, null, null, ["selected-country"])
    for(let lang of langs){
        create("option", lst, lang).value = lang
    }

    // nom de la communauté
    let community_name = create("div", country_list, null, null, "subreddit-name")
    create("p", community_name, "Nom de la communauté")
    let name = createChamp(community_name, "text", "name-to-add", "Nom de la communauté...")

    // nombre de membres
    let community_members = create("div", country_list, null, null, "subreddit-members")
    create("p", community_members, "Nombre de membres")
    let nb = createChamp(community_members, "number", "nb-members")

    // bouton pour valider la langue sélectionnée
    let valider = create("button", country_list, "Valider", null, "community-validate")

    valider.addEventListener("click", function(){

        const postData = {
            pays: lst.value,
            nom: name.value,
            nb_membres: nb.value
        }

        fetch(`${serverUrl}/add-subreddit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        })
            .then(response => response.json())
            .then(data => {
                country_list.remove()
                overlay.remove()
            })
            .catch(error => {
                console.error('Erreur lors de la communication avec le serveur :', error);
            });
    })
}
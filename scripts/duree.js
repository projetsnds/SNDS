// Paramètres : une durée en secondes (float)
// Résultat : convertit le nombre de secondes en une durée précise (nombre d'heures, de minutes, de secondes)
function secondsToDuration(secondes){
    let res = ""

    let heures = Math.floor(secondes / 3600)
    let secondesRestantes = secondes % 3600

    let minutes = Math.floor(secondesRestantes / 60)
    let secondesFinales = secondesRestantes % 60
    let secondesFinalesEntieres = secondesFinales.toFixed(0)

    if(secondesFinalesEntieres == 60){
        minutes++
        secondesFinalesEntieres = 0
    }

    if(heures > 0){
        res += `${heures}h `
    }
    if(minutes > 0){
        res += `${minutes}min `
    }
    if(minutes == 0 && heures == 0){
        res += `${secondesFinales}s`
    }
    else if(secondesFinalesEntieres > 0){
        res += `${secondesFinalesEntieres}s`
    }

    return res
}

// Paramètres : réseau social (HTMLElement), durée de récupération d'un post (float), nombre de posts demandés (int)
// Résultat : renvoie l'estimation du temps d'exécution total de la requête pour le réseau social spécifié
function durationEstimation(reseau_src, post_duration, nb_posts){

    if(nb_posts){
        let duration = (post_duration * parseInt(nb_posts)).toFixed(2)
        reseau_src.innerText = secondsToDuration(duration)
    }
    else{
        reseau_src.innerText = ""
    }
}
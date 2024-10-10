const serverUrl = 'http://localhost:5000';
//recupere le bouton 
let download_button = document.getElementById("download_button");
//la liste des reseaux 
let list_reseau = ["reddit","youtube"]

let body = document.querySelector("body")

let div_left_menu = document.querySelector(".left-menu");

fetch(`${serverUrl}/get-download`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }
})
.then(response => response.json())
.then(data => {
    data.forEach(dir => {

        let down_div = document.createElement("div");
        let down_button = document.createElement("button");
        let down_p = document.createElement("p");
        down_p.innerText= dir.split("/")[2]+" :";
        down_button.innerText ="download"
        down_button.classList.add("select-country");

        //fontion pour telecharger les fichiers 
        down_button.addEventListener("click", function(){
            for(let i = 0 ; i < list_reseau.length; i++){
                file = list_reseau[i]
                const link = document.createElement("a");
                link.style.display = "none";
                link.href = dir.slice(3);
                link.download = file+".csv";
                document.body.appendChild(link);
                link.click();
            }
        })
        down_div.appendChild(down_p);
        down_div.appendChild(down_button);
        div_left_menu.appendChild(down_div);
    }); 

})
.catch(error => {
    console.error('Erreur lors de la communication avec le serveur :', error);
});




        

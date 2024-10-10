from datetime import datetime
import os

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import sys
import logging
import re
import json

class Flag:
    def __init__(self):
        self.flag = False

    def set_flag(self, value):
        self.flag = value
        
    def get_flag(self):
        return self.flag

stop_flag = Flag()
stop_flag.set_flag(False)

import json

#instagram
sys.path.append("../python/instagram")
from snds_instagram import *

# youtube
sys.path.append("../python/youtube/")
from Youtube import *


# reddit
sys.path.append("../python/reddit/")
from reddit import *

# x
# sys.path.append("../python/twitter/")
# from index import *
# from logger import Logger

# flickr
sys.path.append("../python/flickr/")
from flickr import *

# IA
sys.path.append("../IA/")
from process_file import categorize_data_from_file
from modele import get_modele


# ajouter une recherche (json) dans l'historique
def ajouter_recherche(donnees):
    nb_recherches_max = 30
    
    # on donne un titre à la recherche
    # if donnees.get("x-search") != "":
    #     titre = donnees.get("x-search")
    if donnees.get("yt-search") != "":
        titre = donnees.get("yt-search")
    elif donnees.get("reddit-community") != "":
        titre = donnees.get("reddit-community")
    elif donnees.get("ig-search") != "":
        titre = donnees.get("ig-search")
    elif donnees.get("fkr-search") != "":
        titre = donnees.get("fkr-search")
    else:
        titre = "Sans titre"
    
    script_dir = os.path.dirname(__file__)
    
    fichier = os.path.join(script_dir, '..', 'recherches', "historique.json")
        
    # on lit l'historique des recherches
    with open(fichier, "r") as f:
        historique = json.load(f)
       
    # si l'historique n'a pas atteint sa limite de taille : 
    if len(historique) < nb_recherches_max:
        
        # on ajoute le mot recherché à la fin
        if titre in list(historique.keys()):
            del historique[titre]
        historique[titre] = donnees
    else:
        if titre in list(historique.keys()):
            del historique[titre]
        else:
            # on supprime la plus ancienne recherche effectuée
            del historique[list(donnees.keys())[0]]
            
        historique[titre] = donnees
        
    with open(fichier, "w", encoding="utf-8") as f:
        json.dump(historique, f, indent=4)
    
  


app = Flask(__name__)
CORS(app)


# Configuration du logging
logging.basicConfig(filename='flask.log', level=logging.WARNING,
                    format='%(asctime)s - %(levelname)s - %(message)s')

# Ajout d'un gestionnaire de log pour la sortie standard (terminal)
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)  # Niveau de log pour la sortie standard
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
console_handler.setFormatter(formatter)
logging.getLogger('').addHandler(console_handler)


@app.route('/hello-world')
def hello_world():
    return "Hello world !"


@app.route('/get-search-folders', methods=['POST'])
def get_search_folders():
    chemin_courant = os.path.dirname(__file__)
    chemin_dossiers = os.path.join(chemin_courant, '..', 'recherches')
    res = [d for d in os.listdir(chemin_dossiers)]
    res.remove('historique.json')
    return json.dumps({'folders': res})

@app.route('/get-files', methods=['POST'])
def get_files():
    data = request.get_json()
    dossier = data.get('folder')
    
    chemin_courant = os.path.dirname(__file__)
    chemin_fichiers = os.path.join(chemin_courant, '..', 'recherches', dossier)
    res = [f for f in os.listdir(chemin_fichiers)]
    return json.dumps({'fichiers': res})


@app.route('/process-file', methods=['POST'])
def process_file():
    try:
        filename = request.form.get("fichier")
         
        sujet_match = re.search(r'^(.+?)-(.+?)-(\d{4}-\d{2}-\d{2})\.xlsx$', filename)
        if sujet_match:
            reseau = sujet_match.group(1)
            sujet = sujet_match.group(2)
        else:
            raise ValueError("Le nom du fichier n'est pas au format attendu.")
                
        fichier = f"../recherches/{sujet}/{filename}"
        
        if reseau == "reddit":
            col_entree = "titre"
        elif reseau == "instagram":
            col_entree = "caption"
        else:
            col_entree = "description"
                                
        environnement = request.form.get("environnement")
        sentiment = request.form.get("sentiment")  
        animal = request.form.get("animal")
        prompt = None
              
        lst_categories = []
        
        if environnement:
            lst_categories.append("environnement")
        if sentiment:
            lst_categories.append("sentiment")
        if animal:
            lst_categories.append("animal")
            prompt = request.form.get("prompt")

        res = categorize_data_from_file(fichier, col_entree, lst_categories, prompt)

        return jsonify({"message": "File processed successfully", "lst_animaux": res})
    except Exception as e:
        return jsonify({"error": str(e)})



@app.route('/train-model', methods=['POST'])
def train_model():
    data = request.get_json()
    epochs = int(data.get('epochs'))
    
    chemin = os.path.dirname(__file__)
    fichier_modele = os.path.join(chemin, '..', 'IA', "modele.h5")
    
    print(fichier_modele)
    
    if os.path.exists(fichier_modele):
        os.remove(fichier_modele)
    
    get_modele(nb_epochs=epochs)

    return {'text': f'Le modèle a bien été entraîné sur {epochs} epochs'}


@app.route('/get-config', methods=['POST'])
def get_config():
    
    with open('config.json', 'r') as f:
        return json.load(f)
    
@app.route('/update-config', methods=['POST'])
def update_config():
    data = request.get_json()
    cle = data.get('cle')
    valeur = data.get('valeur')

    with open('config.json', 'r') as f:
        config = json.load(f)
        
    config[cle] = valeur
    
    with open('config.json', 'w') as f:
        json.dump(config, f, indent=4)
    
    return {'text': 'La clé a bien été modifiée'}


@app.route('/post-text', methods=['POST'])
def post_text():
    data = request.get_json()
    text = data.get('text')

    return {'text': text}


@app.route('/lire-historique', methods=['POST'])
def lire_historique():
    
    script_dir = os.path.dirname(__file__)
    
    fichier = os.path.join(script_dir, '..', 'recherches', "historique.json")
        
    with open(fichier, "r") as f:
        donnees = json.load(f)
        
    return json.dumps({'text': donnees})


@app.route('/ecrire-historique', methods=['POST'])
def ecrire_historique():
    data = request.get_json()
    
    script_dir = os.path.dirname(__file__)
    
    fichier = os.path.join(script_dir, '..', 'recherches', "historique.json")
        
    ajouter_recherche(data)
        
    return {'text': "recherche ajoutée avec succès"}

@app.route('/supprimer-recherche', methods=['POST'])
def supprimer_historique():
    script_dir = os.path.dirname(__file__)
    
    fichier = os.path.join(script_dir, '..', 'recherches', "historique.json")
    
    # Charger le fichier JSON
    with open(fichier, 'r') as f:
        historique = json.load(f)
        
        # Récupérer la recherche à supprimer depuis la requête
        recherche = request.json.get('recherche')
        
        # Vérifier si la recherche existe dans l'historique
        if recherche in historique:
            # Supprimer la recherche de l'historique
            del historique[recherche]
            print(f"La recherche '{recherche}' a été supprimée de l'historique.")
        else:
            print("La recherche spécifiée n'existe pas dans l'historique.")
    
    # Écrire les modifications dans le fichier JSON
    with open(fichier, 'w') as f:
        json.dump(historique, f)
        
    return {'text': "historique supprimé avec succès"}

# @app.route('/x-search', methods=['POST'])
# def x_search():
#     data = request.get_json()
#     log = Logger()
#     try:
#         conf = load_conf()
#     except Exception:
#         log.warning("Sorry and error occured, Please check your config file")
#         input("\n\tPress any key to exit...")
#     else:
#         dico_country = {'France' : 'fr', 'USA' : 'en', 'Espagne' : 'es', 'Italie' : 'it', 'Allemagne' : 'de', 'Portugal' : 'pt'}
#         main(conf, log, data['xsearch'],data['xstartdate'],data['xenddate'],dico_country[data['xcountry']],int(data['xnbposts']),4)
#         log.warning("Done!")
    
#     return data

@app.route('/logs')
def get_last_log_line():
    filter_and_rewrite_log_file('flask.log')
    with open('flask.log', 'r') as f:
        lines = f.readlines()
        last_line = lines[-1] if lines else ''  # Récupère la dernière ligne ou une chaîne vide si le fichier est vide
    return jsonify({'last_log_line': last_line})

@app.route('/yt-search', methods=['POST'])
def yt_search():
    data = request.get_json()
    
    #ouvrir le fichier de configuration 
    with open('config.json', 'r') as f:
        config = json.load(f)
    
    api_key = config["YOUTUBE_API_KEY"]
    #api_key = "AIzaSyDtUgSvGF0OkrI1sn92qZnIf5az0A9h4TI"
    get_youtube_data(data['ytsearch'], int(data['ytnbvideos']), api_key,
                     data['ytstartdate'], data['ytenddate'], data['ytcountry'])
    return data


@app.route('/reddit-search', methods=['POST'])
def reddit_search():
    data = request.get_json()

    communaute = data.get("search")
    date_debut = datetime.strptime(data.get("redditstartdate"), '%Y-%m-%d')
    date_fin = datetime.strptime(data.get("redditenddate"), '%Y-%m-%d')
    tri = data.get("redditsort")
    nb_posts = int(data.get("redditnbposts"))

    get_reddit_posts(communaute, date_debut, date_fin, tri, nb_posts)
    
    return data

@app.route('/ig-search', methods=['POST'])
def instagram_search():
    data = request.get_json()

    mot_cle = data.get("search")
    nb_req = int(data.get("nbposts"))//50
    id_search = getHashtagID(mot_cle)
    getNbPosts(mot_cle,id_search,nb_req)
    
    return data
    
    
@app.route('/fkr-search', methods=['POST'])
def flickr_search():
    data = request.get_json()

    mot_cle = data.get("fkrsearch")
    langue = data.get("fkrcountry")
    date_debut = datetime.strptime(data.get("fkrstartdate"), '%Y-%m-%d')
    date_fin = datetime.strptime(data.get("fkrenddate"), '%Y-%m-%d')
    nb_posts = int(data.get("fkrnbposts"))
    
    get_flickr_posts(mot_cle, date_debut, date_fin, nb_posts)
    
    return data

@app.route('/subreddits', methods=['POST'])
def get_subreddits():
    with open("../python/reddit/sub_reddit_name.json", "r", encoding="utf-8") as f:
        data = json.load(f)
        
    return data


def subreddit_members_tostring(nb_membres):
    if nb_membres < 10000:
        return str(nb_membres)
    
    reste = round(nb_membres / 1000, 2)
    nb_chiffres = len(str(int(reste)))
    
    if nb_chiffres < 4:
        return f"{reste}k"
    else:
        return f"{round(reste/1000, 2)}M"
    

@app.route('/add-subreddit', methods=['POST'])
def add_subreddit():
    data = request.get_json()
    
    pays = data.get("pays")
    nom = data.get("nom")
    nb_membres = subreddit_members_tostring(int(data.get("nb_membres")))
    filepath = "../python/reddit/sub_reddit_name.json"
    
    with open(filepath, 'r', encoding="utf-8") as f:
        subreddits = json.load(f)
    
    # ajouter le subreddit
    subreddits[pays].append({"nom": nom, "nb_membres": nb_membres})
    
    # écraser l'ancienne version
    with open(filepath, 'w', encoding="utf-8") as file:
        json.dump(subreddits, file, indent=4, ensure_ascii=False)
        
    return data


@app.route('/delete-subreddit', methods=['POST'])
def delete_subreddit():
    data = request.get_json()
    
    pays = data.get("pays")
    nom = data.get("nom")
    filepath = "../python/reddit/sub_reddit_name.json"
    
    with open(filepath, 'r', encoding="utf-8") as f:
        subreddits = json.load(f)
    
    # supprimer le subreddit
    for item in subreddits[pays]:
        if item["nom"] == nom:
            subreddits[pays].remove(item)
    
    # écraser l'ancienne version
    with open(filepath, 'w', encoding="utf-8") as file:
        json.dump(subreddits, file, indent=4, ensure_ascii=False)
        
    return data
    

@app.route('/stop-server', methods=['POST'])
def stop_server():
    stop_flag.set_flag(True)    
    return 'Server will stop after completing current task.'



def filter_and_rewrite_log_file(input_file):
    with open(input_file, 'r') as file:
        lines = file.readlines()

    filtered_lines = [line for line in lines if "INFO" in line]

    with open(input_file, 'w') as file:
        file.writelines(filtered_lines)



@app.route('/full-name-historique', methods=['GET'])
def download_directories(path = "../recherches/"):
    res = []
    for folder in os.listdir(path):
        if not "." in folder :
            for file in os.listdir(path+folder+"/"):
                res.append(folder+"/"+ file)
    return res
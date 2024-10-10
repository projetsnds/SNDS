from datetime import datetime
import os
import praw
from openpyxl import Workbook
import json 

#ouverture du fichier de configuration 
def get_config():
    with open('../flask/config.json', 'r') as f:
        config = json.load(f)
    return config

config = get_config()

reddit_client_id = config["REDDIT_CLIENT_ID"]
reddit_client_secret = config["REDDIT_CLIENT_SECRET"]
reddit_user_agent = config["REDDIT_USER_AGENT"]

"""
# credentials
reddit_client_id = 'chjZ4cMH_SAiCSYHdxy6Bg'
reddit_client_secret = 'YcjNG0bSnZIHEks1I4mbyZRSeT7UhQ'
reddit_user_agent = "MyRedditScraper/1.0 (by u/ElectroJuif)"
"""
# instance de l'API
reddit = praw.Reddit(client_id=reddit_client_id,
                     client_secret=reddit_client_secret,
                     user_agent=reddit_user_agent)


# fonction qui lance la recherche
def get_reddit_posts(communaute, date_debut, date_fin, tri, nb_posts):

    # récupération des posts sur le subreddit spécifié
    subreddit = reddit.subreddit(communaute)
    
    if tri == "populaires":
        posts = subreddit.top(limit=nb_posts)
    else:
        posts = subreddit.hot(limit=nb_posts)
    
    # dossier courant
    script_dir = os.path.dirname(__file__)
    
    # récupération du fichier de sortie
    output_dir = os.path.join(script_dir, '..', '..', 'recherches', communaute)
    output_file = f"reddit-{communaute}-{datetime.now().strftime('%Y-%m-%d')}.xlsx"
    output = os.path.join(output_dir, output_file)
        
    # créer le répertoire s'il n'existe pas
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
 
    # Initialiser un nouveau classeur
    wb = Workbook()
    ws = wb.active
    
    ws.append(["titre", "description", "date", "nb_likes", "nb_commentaires"])
    
    # on vide le fichier
    with open(output, 'w', newline='') as f:
        pass
    
    list_post = []
    for post in posts:
        date = datetime.fromtimestamp(post.created_utc)
        
        # si le post est dans l'intervalle des dates :
        if date_debut <= date <= date_fin:
            ws.append([post.title, post.selftext, date.strftime("%Y-%m-%d %H:%M:%S"), post.score, post.num_comments])
            wb.save(output)
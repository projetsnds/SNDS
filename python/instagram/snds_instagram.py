import requests
import json
import os
from app import stop_flag
from datetime import datetime
from Excel import Excel

graphURL = "https://graph.facebook.com/"

#CONFIG
configFile = "../../flask/config.json"
with open(configFile, 'r') as cf:
    config = json.load(cf)
    userID = config['INSTA_USER_ID']
    APItoken = config['INSTA_API_TOKEN']

def getHashtagID(hashtag):
    """
    Fonction pour récupérer l'ID de l'hashtag Instagram que l'on souhaite interroger

    Args:
        hashtag (str): L'hashtag demandé

    Returns:
        str : L'ID de l'hashtag Instagram
    """
    url = graphURL
    url += "ig_hashtag_search?"       #URL de recherche
    url += "user_id="+userID          #ID de l'utilisateur
    url += "&q="+hashtag              #Hashtag
    url += "&access_token="+APItoken  #Token d'API

    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        id = data['data'][0]['id']
        print("ID du hashtag récupéré : "+id)
        return id
    else:
        print("Erreur sur la requête : ", response.json())

def addToFile(filename, data):
    script_dir = os.path.dirname(__file__)
    output_dir = os.path.join(script_dir, '..', '..', 'recherches', filename)
    output_file = f"instagram-{filename}-{datetime.now().strftime('%Y-%m-%d')}.json"
    output = os.path.join(output_dir, output_file)
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    file_exists = os.path.exists(output)
    if file_exists and os.stat(output).st_size != 0:
        with open(output, "r", encoding="utf-8") as f:
            file_content = f.read()
        modified_content = file_content[:-1]
        data = data[1:]
        data = ","+data
        file_content = modified_content + data
        with open(output, "w", encoding="utf-8") as f:
            f.write(file_content)
    else:
        with open(output, "w", encoding="utf-8") as f:
            f.write(data)

def getInstagramPosts(hashtagID,next=None):
    """
    Fonction pour récupérer les posts à partir de l'ID d'un hashtag

    Args:
        hashtagID (str): L'ID de l'hashtag demandé

    Return:
        dict : Le resultat
    """
    if(next==None):
        url = graphURL
        url += hashtagID+"/"                                                       #ID du hashtag
        url += "top_media?"                                                        #Trié par média les plus populaires
        url += "user_id="+userID                                                   #ID de l'utilisateur
        url += "&fields=id,media_type,comments_count,caption,like_count,timestamp,permalink" #Les champs à récuperer
        url += "&access_token="+APItoken                                           #Token d'API
        url += "&limit=50"                                                         #50 posts par requête
    else:
        url = next
    print("Requête en cours : Top media")
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        print("Requête reçue avec succès")
        return data
    else:
        print("Erreur sur la requête : ", response.json())
        
def getNbPosts(mot_cle, hashtagID, nbRequest):
    next = None
    print("Début récupération posts")
    print("ID Hashtag : "+hashtagID)
    print("NB Requêtes : "+str(nbRequest))
    i = 0
    data = []
    condition = True 
    if nbRequest != -1:
        condition = i < nbRequest
    while condition:
        if stop_flag.get_flag() == True:
            break
        print("Requête no_"+str(i))
        responseJSON = getInstagramPosts(hashtagID, next)
        data.extend(responseJSON['data'])
        # Définition des clés avec des valeurs par défaut pour chaque élément de 'data'
        json_str = json.dumps(data, ensure_ascii=False)
        
        date = datetime.today().strftime("%d-%m-%Y")
        addToFile(mot_cle, json_str)
        next = responseJSON['paging']['next']
        print("Page suivante : " + next)
        i += 1
        condition = i < nbRequest


    # Enregistrer dans un fichier excel
    keys = ['id','media_type', 'comments_count', 'caption','like_count','timestamp','permalink']
    Excel(data, keys, mot_cle)
    print("Fin récupération de posts")

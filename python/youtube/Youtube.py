import requests
import os 
import json
import csv
import time
import configparser
from datetime import datetime
from YoutubeClass import Youtube
from YtExcel import Excel
from unidecode import unidecode
from app import stop_flag


def clean_string(input_str: str) -> str:
   """
   Nettoie une chaîne de caractères en supprimant les caractères non ASCII.

   Args:
       input_str (str): La chaîne de caractères à nettoyer.

   Returns:
       str: La chaîne de caractères nettoyée.
   """
   if input_str is not None:
       return unidecode(input_str)
   else:
       return ""


def convert_date(date_string: str) -> str:
    """
    Convertit une chaîne de caractères représentant une date en format ISO.

    Args:
        date_string (str): La chaîne de caractères à convertir.

    Returns:
        str: La date convertie au format ISO.
    """
    components = date_string.split()
    if len(components) == 1:
        components.append('00:00:00')
    elif len(components) == 2:
        time_parts = components[1].split(':')
        if len(time_parts) == 1:
            time_parts.extend(['00', '00'])
        elif len(time_parts) == 2:
            time_parts.append('00')
        components[1] = ':'.join(time_parts)
    date_object = datetime.strptime(' '.join(components), "%Y-%m-%d %H:%M:%S")
    return date_object.isoformat()+"Z"


def convert_date_format(input_date: str) -> str:
   """
   Convertit une date au format ISO en une autre chaîne de caractères représentant une date.

   Args:
       input_date (str): La date à convertir.

   Returns:
       str: La date convertie.
   """
   datetime_obj = datetime.strptime(input_date, "%Y-%m-%dT%H:%M:%SZ")
   output_date = datetime_obj.strftime("%Y-%m-%d %H:%M:%S")
   return output_date




def get_youtube_data(keyword: str, max_videos: int, api_key: str, start_date: str, end_date: str, langue : str) -> list:
    """
    Récupère les données des vidéos YouTube correspondant à un mot-clé donné.

    Cette fonction effectue plusieurs requêtes à l'API YouTube pour obtenir les données des vidéos correspondant à un mot-clé donné.
    Elle renvoie une liste de dictionnaires contenant les informations sur chaque vidéo.

    Args:
        keyword (str): Le mot-clé utilisé pour filtrer les vidéos.
        max_videos (int): Le nombre maximum de vidéos à récupérer.
        api_key (str): La clé API utilisée pour accéder à l'API YouTube.
        start_date (str): La date de début pour filtrer les vidéos.
        end_date (str): La date de fin pour filtrer les vidéos.

    Returns:
        list: Une liste de dictionnaires contenant les informations sur chaque vidéo.
    """

    try:
        dateDebut = convert_date(start_date)
        dateFin = convert_date(end_date)
    except ValueError:
        dateDebut = None
        dateFin = None

    start_time = time.time()

    base_url = "https://www.googleapis.com/youtube/v3/search"
    videos = []
    videoCount = 0
    nextToken = None

    
    res = 0
    
    while len(videos) < max_videos  and stop_flag.get_flag() == False :
        try:
            """
            params = {
                'part': 'snippet',
                'maxResults': 50 if max_videos - len(videos) > 50 else max_videos - len(videos),
                'q': keyword,
                'key': api_key,
                'publishedAfter': dateDebut,
                'publishedBefore': dateFin,
                'relevanceLanguage' : langue
            }
            """
            params = {
                'part': 'snippet',
                'q': keyword,
                'key': api_key,
                'publishedAfter': dateDebut,
                'publishedBefore': dateFin,
                'relevanceLanguage' : langue
            }

            if nextToken:
                params['pageToken'] = nextToken
            
            response = requests.get(base_url, params=params)
            listVideo = response.json()
            nextToken = listVideo.get('nextPageToken') 
            videoCount = 0 
            
            for item in listVideo['items']:
                if item['id']['kind'] == 'youtube#video':
                    video_id = item['id']['videoId']
                    
                    url = "https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id="+str(video_id)+"&key="+api_key

                    res_get = requests.get(url).json()

                    data = res_get['items'][0]

                    video = Youtube(data)

                                        
                    #informations sur la chaîne 

                    url_channel = "https://www.googleapis.com/youtube/v3/channels?part=statistics&id="+ video.channelID +"&key="+api_key
                    
                    json_channel = requests.get(url_channel).json()
                    
                    channel = json_channel['items'][0]

                    data = {}
                    data["id"] = clean_string(video_id)
                    data["titre"] = clean_string(video.title)
                    data["description"] = clean_string(video.description)
                    data["auteur"] = clean_string(video.channelTitle)
                    data["tags"] = [clean_string(tag) for tag in video.tags]
                    data["langue"] = clean_string(video.localized)
                    data["duree"] = video.duration
                    data["nombre d'abonnees"] = channel["statistics"]["subscriberCount"]
                    data["nombre de videos"] = channel["statistics"]["videoCount"]
                    data["nombre de j'aime"] = video.likes
                    data["nombre de vues"] = video.viewcount
                    data["nombre de commentaires"] = video.comments
                    data["date de publication"] = convert_date_format(video.published)


                    videos.append(data)


                    directory_path = "../recherches/" + keyword

            
                    if not os.path.exists(directory_path):
                        os.makedirs(directory_path)

                    with open(directory_path + "/youtube-" + keyword + "-" + datetime.now().strftime("%Y-%m-%d") + ".json", "w") as f:
                        json.dump(videos, f, indent=4)
                    
                    keys = ['id', 'titre', 'description', 'auteur', 'tags', 'langue', 'duree', 'nombre d\'abonnees', 'nombre de videos', 'nombre de j\'aime', 'nombre de vues', 'nombre de commentaires','date de publication']

                    Excel(videos,keys,keyword)

                    
                    res += 1
                    videoCount += 1
                        
        
        except KeyError:
            break
        
    end_time = time.time()
    elapsed_time = end_time - start_time
    
    hours, remainder = divmod(elapsed_time, 3600)
    minutes, seconds = divmod(remainder, 60)

    print(f"{int(res)} video(s) en : {int(hours)} heures, {int(minutes)} minutes, {seconds:.2f} secondes")



    return videos





def main():
    """
    Fonction principale qui demande à l'utilisateur de saisir des informations et 
    appelle la fonction get_youtube_data pour récupérer les données des vidéos YouTube.

    Cette fonction demande à l'utilisateur de saisir un mot-clé de vidéo à rechercher, 
    le nombre de vidéos à récupérer, la date de début et la date de fin. 
    
    Elle lit ensuite la clé API depuis un fichier de configuration et appelle 
    la fonction get_youtube_data avec ces informations.
    """
    
    keyword = input("Donnez le mot clé de la vidéo à rechercher : \n")
    max_videos = int(input("Donnez le nombre de vidéo à récupérer : \n"))
    langue = input("Donnez la langue de la vidéo : \n")
    

    start_date = input("Donnez la date de début (YYYY-MM-DD hh:mm:ss) : \n")

    end_date =  input("Donnez la date de fin (YYYY-MM-DD hh:mm:ss) : \n")
    
        

    print(".... En train de récupérer vos données .... ")

    get_youtube_data(keyword,max_videos,api_key,start_date,end_date,langue)

    
if __name__ == "__main__":
    main()



   
    


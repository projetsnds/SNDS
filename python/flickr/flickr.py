from flickrapi import FlickrAPI
from datetime import datetime
import os
from openpyxl import Workbook
from lxml import etree
import xml.etree.ElementTree as ET
import json

#ouverture du fichier de configuration 
def get_config():
    with open('../flask/config.json', 'r') as f:
        config = json.load(f)
    return config

config = get_config()

api_key = config["FLICKR_API_KEY"]
api_secret = config["FLICKR_API_SECRET"] 

"""
# clé d'API
api_key = u'eb777b971ec4bf879a5680632a95e8b3'
api_secret = u'ad039e78b2b8e075'
"""
# initialisation de l'API
flickr = FlickrAPI(api_key, api_secret)

# fonction qui récupère le pays d'une géo-localisation
def get_country(localisation):
    # Trouver la dernière occurrence de la virgule
    country_index = localisation.rfind(',')
    
    # Vérifier si une virgule a été trouvée
    if country_index != -1:
        # Diviser la chaîne à partir de la dernière virgule et renvoyer la partie après
        resultat = localisation[country_index + 1:]
        # Supprimer le premier caractère s'il s'agit d'un espace
        return resultat.lstrip(' ')
    else:
        # Si aucune virgule n'est trouvée, renvoyer une chaîne vide ou un message approprié
        return localisation

# fonction qui récupère les posts
def get_flickr_posts(mot_cle, date_debut, date_fin, nb_posts):
    
    search_results = flickr.photos.search(text=mot_cle, per_page=nb_posts, min_upload_date=date_debut ,max_upload_date=date_fin, sort='interestingness-desc')

    photos = search_results.findall('photos/photo')

    # dossier courant
    script_dir = os.path.dirname(__file__)

    # récupération du fichier de sortie
    output_dir = os.path.join(script_dir, '..', '..', 'recherches', mot_cle)
    output_file = f"flickr-{mot_cle}-{datetime.now().strftime('%Y-%m-%d')}.xlsx"
    output = os.path.join(output_dir, output_file)
        
    # créer le répertoire s'il n'existe pas
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    # Initialiser un nouveau classeur
    wb = Workbook()
    ws = wb.active
        
    ws.append(['titre', 'description', 'date', 'localisation', 'pays', 'nb_vues', 'nb_likes', 'nb_commentaires', 'url'])
        
    # on vide le fichier
    with open(output, 'w', newline='') as f:
        pass

    # pour chaque photo récupérée :
    for photo in photos:
        photo_id = photo.get('id')
        
        photo_details = flickr.photos.getInfo(photo_id=photo_id)
        photo_likes = flickr.photos.getFavorites(photo_id=photo_id)
        
        detail = photo_details.find('photo')
        owner = detail.find('owner')
        comments = detail.find('comments')
        nb_likes = photo_likes.find('photo')
        
        xml_string = etree.tostring(photo_details, encoding='utf-8').decode('utf-8')
        url = ET.fromstring(xml_string).find('.//urls').find('url')
        
        desc = ET.fromstring(xml_string).find('.//description').text
        
        date = datetime.fromtimestamp(int(detail.get('dateuploaded')))
        
        localisation = owner.get('location')
        country = get_country(localisation)
        
        ws.append([photo.get('title'), desc, date.strftime("%Y-%m-%d %H:%M:%S"), localisation, country, detail.get('views'), nb_likes.get('total'), comments.text, url.text])
        
        wb.save(output)
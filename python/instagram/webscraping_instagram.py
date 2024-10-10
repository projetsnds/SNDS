from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import requests
import json
import os
import re
import time
import threading
from datetime import datetime

options = Options()
options.add_argument('--headless')
driver_path = 'chromedriver' #driver chromium pour linux

json_posts = []
json_posts_dates = []
lock_json_posts = threading.Lock()
lock_json_posts_dates = threading.Lock()


"""
fonction get_localisation

renvoie le post avec la localisation scrappée
"""
def get_localisation(post):
    #Recup page
    driver = webdriver.Chrome(executable_path=driver_path,options=options)
    driver.get(post.get('permalink'))
    page_content = driver.page_source
    localisation = ''
    timeout = 500 #on attend 7 secondes max que la page charge

    #tant que la page n'a pas totalement chargé, on loop
    regexloc = r'href="/explore/locations/.*?">(.*?)</a>'

    try:
        WebDriverWait(driver, timeout).until(EC.presence_of_element_located((By.CLASS_NAME, "_aagv")))
        page_content = driver.page_source
        resultat = re.search(regexloc,page_content)
        if resultat:
            localisation = resultat.group(1)
            if(re.search(r'<',localisation)):
                localisation = ''
                print('x', end='')
            else:
                print('O', end='')
    except TimeoutException:
        localisation = ''
        print('X', end='')
    driver.quit()
    post['location'] = localisation
    return post

def addToFile(filename, data):
    file_exists = os.path.exists(filename)
    if file_exists and os.stat(filename).st_size != 0:
        with open(filename, "r") as f:
            file_content = f.read()
        modified_content = file_content[:-1]
        data = data[1:]
        data = ","+data
        file_content = modified_content + data
        with open(filename, "w") as f:
            f.write(file_content)
    else:
        with open(filename, "a+") as f:
            f.write(data)

#recupere un post dans la list des posts
def get_post():
    global json_posts
    post = None
    lock_json_posts.acquire()
    try:
        if len(json_posts) != 0:
            post = json_posts.pop(0)
    finally:
        lock_json_posts.release()
    return post

#ajoute la localisations dans tout les posts de
def get_all_loc():
    global json_posts_dates
    post = get_post()
    while post is not None:
        post = get_localisation(post)
        lock_json_posts_dates.acquire()
        try:
            json_posts_dates.append(post)
        finally:
            lock_json_posts_dates.release()
        jsonarr = []
        jsonarr.append(post)
        json_str = json.dumps(jsonarr, ensure_ascii=False)
        addToFile("result.json",json_str)
        with open("rest.json", "w") as fichier:
            json.dump(json_posts, fichier)
        post = get_post()

# Fonction pour lancer les threads
def lance_threads(nb_threads):
    threads = []
    for _ in range(nb_threads):
        thread = threading.Thread(target=get_all_loc)
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()
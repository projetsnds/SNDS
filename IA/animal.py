from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import re
from bs4 import BeautifulSoup

def analyze_animals(feuille, columns_index, phrases, pre_prompt):
    
    options = webdriver.ChromeOptions()
    options.add_argument("--disable-dev-shm-usage")
    
    # Ouvrir une nouvelle fenêtre Chrome
    driver = webdriver.Chrome(options=options)

    # Accéder à la page web
    driver.get("https://phind.com/search?home=true")

    # Afficher un prompt et attendre la réponse de l'utilisateur
    prompt = "I will send a list of sentences in square brackets '[' and ']' evoking living beings. " + pre_prompt.strip() + " For each sentence, don't give any argument, just write the result in this form: 'sentence' <=> 'result'. List each sentence and result line by line (in a <li> tag). Here's the list of sentences :"

    for phrase in phrases:
        prompt += f" [{phrase['texte']}] "
            
    # Envoyer la requête de recherche dans le champ de recherche
    champ_recherche = driver.find_element(By.CSS_SELECTOR, "textarea")
    champ_recherche.clear()
    champ_recherche.send_keys(prompt)

    # time.sleep(5)

    # Appuyer sur la touche Entrée pour lancer la recherche
    champ_recherche.send_keys(Keys.ENTER)
    # submit = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
    # submit.click()

    element = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "div[class='fs-5']")))

    time.sleep(0.2 * len(phrases))

    # Obtenir les résultats de la recherche
    soup = BeautifulSoup(element.get_attribute('innerHTML'), 'html.parser')

    list_items = soup.find_all('li')

    # Imprimer le contenu de chaque élément <li>
    i = 0
    for item in list_items:
        resultat = re.search(r'^.*<=>(.*)$', item.text.strip())
        if resultat:
            feuille.cell(row=phrases[i]['indice'], column=columns_index["animal"]).value = resultat.group(1)
        
        i += 1

    # Fermer la fenêtre Chrome
    driver.quit()
    
    return soup.prettify()
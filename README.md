# Avant Propos
*Les développeurs du projet SNDS souhaitent informer que toute mauvaise utilisation de l'application par les utilisateurs ne relève pas de leur responsabilité. Bien que l'application soit conçue avec des fonctionnalités et des outils destinés à un usage responsable et éthique, les développeurs ne peuvent garantir le comportement des utilisateurs. Il est de la responsabilité individuelle de chaque utilisateur de faire un usage approprié de l'application, en respectant les lois, les réglementations et les politiques de chaque plateforme sociale, ainsi que les principes éthiques et moraux. Les développeurs restent disponibles pour fournir des conseils et une assistance technique, mais ne peuvent être tenus responsables des actions des utilisateurs.*


# Installation : 

### Mise en place du serveur Flask

Dans le projet SNDS, nous utilisons un serveur Flask pour exécuter les scripts Python nécessaires à la collecte de données à partir des différents réseaux sociaux, ainsi que pour gérer les requêtes provenant de l'interface utilisateur. Cette approche permet une séparation claire des responsabilités entre le backend (serveur Flask) et le frontend (interface web), ce qui rend le système modulaire et facile à maintenir.

#### Architecture
L'architecture du projet SNDS repose sur une division en deux parties distinctes :

**Serveur Flask (Backend)**: Ce serveur exécute les scripts Python responsables de la collecte de données à partir des réseaux sociaux tels qu'Instagram, YouTube, Reddit, etc. Il reçoit les requêtes HTTP de l'interface utilisateur et traite les données en conséquence. Le serveur Flask utilise Flask-CORS pour gérer les requêtes cross-origin, permettant ainsi à l'interface web de communiquer avec lui sans rencontrer de problèmes de sécurité liés à la politique same-origin.

**Serveur Web (Frontend)** : L'interface utilisateur est hébergée sur un serveur web, généralement en local (localhost) lors du développement ou sur un serveur distant lors du déploiement en production. Cette interface web est accessible par les utilisateurs finaux via un navigateur web. Elle envoie des requêtes HTTP au serveur Flask pour déclencher des actions telles que la recherche de données sur les réseaux sociaux ou la récupération de l'historique des recherches.


### Installation d'un serveur Flask

Pour installer un serveur Flask sur votre machine, suivez ces étapes :

1. Assurez-vous d'avoir Python installé sur votre système.
2. Ouvrez une fenêtre de terminal.
3. Utilisez pip pour installer Flask en exécutant la commande suivante :
`pip install Flask`
4. Une fois Flask installé, vous pouvez exécutez le serveur Flask en exécutant la commande dans le bon répertoire de fichier :
`python3 -m flask --app .\app.py run`


### Installation de l'API YouTube Data API v3 sur Google Cloud Platform

#### Étape 1 : Créer un projet Google Cloud Platform

1. Rendez-vous sur la console Google Cloud Platform : [https://console.cloud.google.com/](https://console.cloud.google.com/).
2. Connectez-vous avec votre compte Google.
3. Cliquez sur "Créer un projet".
4. Donnez un nom à votre projet et cliquez sur "Créer".

#### Étape 2 : Activer l'API YouTube Data API v3

1. Dans la barre de navigation latérale, cliquez sur "APIs et services".
2. Dans la barre de recherche, tapez "YouTube Data API v3".
3. Cliquez sur le résultat de la recherche.
4. Cliquez sur "Activer".

#### Étape 3 : Obtenir la clé de l'API

1. Dans la barre de navigation latérale de la page "APIs et services", cliquez sur "Identifiants".
2. Cliquez sur "Créer des identifiants" en haut de la page.
3. Sélectionnez "Clé API".
4. Copiez la clé API.

#### Étape 4 : Afficher le quota

1. Dans la page "APIs et services activés", cliquez sur "YouTube Data API v3".
2. Cliquez sur "Quotas et limites du système".
3. Vous verrez le quota par jour qui est de 2500 normalement.

#### Étape 5 : Utiliser l'API YouTube Data API v3

Pour plus d'informations sur l'utilisation de l'API YouTube Data API v3, veuillez consulter la documentation officielle :
- [YouTube Data API v3](https://developers.google.com/youtube/v3/)

#### Note :
- Si vous n'arrivez plus à récupérer des données, pensez à changer la clé de l'API ou à regarder le quota s'il est épuisé.
- Dans le cas échéant, changez de compte pour avoir un nouveau quota ou alors attendez une journée pour le renouvellement du quota.

### Manuel d'Installation de l'API Reddit

#### Étape 1: Créer un compte Reddit

1. Allez sur le site [Reddit](https://www.reddit.com/) et cliquez sur "S'inscrire" en haut à droite de la page d'accueil.
2. Remplissez le formulaire d'inscription avec vos informations personnelles et choisissez un nom d'utilisateur et un mot de passe.
3. Une fois inscrit, connectez-vous à votre compte Reddit.

#### Étape 2: Créer une Application Reddit

1. Allez sur la page des [applications Reddit](https://www.reddit.com/prefs/apps).
2. En bas de la page, sous la section "Créer une nouvelle application", cliquez sur "Créer une application".
3. Remplissez les champs requis :
   - **Nom de l'application**: Choisissez un nom pour votre application (par exemple, "MyRedditScraper").
   - **Type d'application**: Sélectionnez "script".
   - **Description**: Ajoutez une brève description de votre application (facultatif).
   - **URI de redirection**: Vous pouvez laisser ce champ vide pour une application de type "script".
4. Cochez la case "Je suis d'accord avec les conditions d'utilisation" et cliquez sur "Créer une application".

#### Étape 3: Obtenir les Identifiants de l'Application

1. Une fois l'application créée, vous serez redirigé vers une page affichant les détails de votre application.
2. Notez les identifiants suivants :
   - **REDDIT_CLIENT_ID**: C'est l'identifiant client de votre application Reddit.
   - **REDDIT_CLIENT_SECRET**: C'est le secret client de votre application Reddit.
   - **REDDIT_USER_AGENT**: C'est l'utilisateur associé à votre application Reddit.
3. Ces identifiants seront nécessaires pour accéder à l'API Reddit depuis votre script Python.

#### Étape 4: Utiliser les Identifiants dans votre Script Python

1. Dans votre script Python, utilisez les identifiants que vous avez obtenus pour créer une instance de l'API Reddit :
   ```python
   import praw

   reddit_client_id = 'Votre_Client_ID'
   reddit_client_secret = 'Votre_Client_Secret'
   reddit_user_agent = "MyRedditScraper/1.0 (by u/VotreNomUtilisateur)"

   reddit = praw.Reddit(client_id=reddit_client_id,
                        client_secret=reddit_client_secret,
                        user_agent=reddit_user_agent)```


### Manuel d'Installation de l'API Instagram

#### Étape 1: Créer un Compte Développeur Instagram

1. Allez sur le site [Instagram Developer](https://www.instagram.com/developer/) et connectez-vous à votre compte Instagram.
2. Cliquez sur "Gérer les applications" pour accéder à la section des développeurs.
3. Si c'est la première fois que vous utilisez l'API Instagram, vous devrez vous inscrire comme développeur en cliquant sur le bouton "Inscrire une nouvelle application".
4. Remplissez les détails requis pour votre application, y compris le nom, la description, le site Web, etc.
5. Une fois que vous avez rempli les détails, acceptez les conditions de service et cliquez sur "S'inscrire".

#### Étape 2: Créer une Application Instagram

1. Après avoir enregistré votre compte développeur, vous serez redirigé vers le tableau de bord des développeurs.
2. Cliquez sur "Gérer" à côté de votre application pour accéder à ses paramètres.
3. Dans les paramètres de votre application, vous trouverez l'ID de client de votre application et le secret de client.
4. Notez ces identifiants car ils seront nécessaires pour utiliser l'API Instagram dans votre script Python.

#### Étape 3: Configurer l'Accès à l'API Instagram

1. Dans votre script Python, utilisez les identifiants de votre application pour effectuer des requêtes à l'API Instagram :
   - **INSTA_USER_ID**: C'est l'identifiant client de votre application Instagram.
   - **INSTA_API_TOKEN**: Vous devez obtenir un jeton d'API valide pour accéder à certaines fonctionnalités de l'API Instagram.

#### Étape 4: Utiliser l'API Instagram dans votre Script Python

1. Utilisez les fonctions fournies par l'API Instagram dans votre script Python pour interagir avec les données Instagram :
   - `getHashtagID`: Pour obtenir l'ID d'un hashtag Instagram spécifié.
   - `getInstagramPosts`: Pour récupérer les posts à partir de l'ID d'un hashtag.
   - `getNbPosts`: Pour récupérer un nombre spécifié de posts à partir de l'ID d'un hashtag.

2. Assurez-vous d'importer le module `requests` dans votre script pour effectuer des requêtes HTTP vers l'API Instagram.


### Manuel d'Installation de l'API Flickr

#### Étape 1: Créer un compte Flickr

1. Allez sur [Flickr](https://www.flickr.com) et inscrivez-vous (si ce n'est pas déjà fait).

#### Étape 2: Créer une Application Flickr

1. Allez sur [Flickr Services](https://www.flickr.com/services/apps/create/) et demandez une clé d'API.
2. Choisissez une clé non-commerciale.
3. Entrez vos informations demandées dans le formulaire, puis soumissez-le.
4. Sauvegardez bien la clé d'API et la clé secrète ainsi générées.

#### Étape 3: Configurer l'Accès à l'API Flickr

1. Dans le fichier config.json, mettez à jour les 2 clés de votre application pour effectuer des requêtes à l'API Flickr :
   - **FLICKR_API_KEY**: C'est la clé d'API de votre application Flickr.
   - **FLICKR_API_SECRET**: C'est la clé secrète de votre application Flickr.

#### Étape 4: Utiliser l'API Flickr dans votre Script Python

1. Utilisez les fonctions fournies par l'API Flickr dans votre script Python pour interagir avec les données :
   - `get_country`: Pour obtenir le pays associé à une localisation.
   - `get_flickr_posts`: Pour récupérer les posts à partir d'un mot-clé spécifié.

2. Assurez-vous d'importer le module `FlickrAPI` dans votre script pour effectuer des requêtes vers l'API Flickr.


# Documentation du projet de Web Scraping
## Introduction
Cette documentation fournit des informations sur le fonctionnement et l'utilisation du projet de webscraping "Social Network Data Scouting" (SNDS). Ce projet a pour objectif de collecter des données à partir de différents réseaux sociaux tels que Instagram, YouTube, Reddit, Flickr, en utilisant des scripts Python.

## HTML (index.html)

Le fichier HTML `index.html` constitue l'interface utilisateur principale du projet SNDS. Voici une brève description des composants de cette page :

- **Barre de navigation supérieure** : Cette barre contient un bouton pour afficher le logger.
- **Barre de chargement** : Cette barre indique l'état de chargement de la recherche en cours et permet d'arrêter la recherche.
- **Conteneur principal** : Ce conteneur contient les différents menus pour effectuer des recherches sur différents réseaux sociaux.
- **Conteneur de gauche** : Ce conteneur affiche les recherches effectuées et permet de sélectionner le réseau social à rechercher.
- **Conteneur de log** : Ce conteneur affiche les logs de l'application.
- **Conteneurs de recherche pour chaque réseau social** : Ces conteneurs contiennent les champs de recherche spécifiques à chaque réseau social.
- **Bouton vers l'interface IA** : ce bouton (en haut à droite) permet de basculer vers la page permettant de manipuler les réseaux de neurones.
- **Bouton vers la configuration des API** : ce bouton (en bas à droite) permet de modifier - si nécessaire - les différentes clés d'API utilisées.


Le fichier HTML `index2.html` constitue l'interface utilisateur d'utilisation des divers réseaux de neurones. Voici une brève description des composants de cette page :

- **Conteneur de catégories à analyser** : ce conteneur contient les différentes catégories susceptibles d'être analysées par nos réseaux de neurones.
- **Conteneur du mot-clé** : ce conteneur indique le mot-clé dans lequel l'utilisateur souhaite effectuer une analyse.
- **Conteneur du fichier Excel** : ce conteneur indique le fichier Excel que l'utilisateur souhaite analyser.
- **Conteneur des caractéristiques du réseau de neurones** : ce conteneur indique les caractéristiques du réseau de neurones utilisé pour analyser les types d'environnement.
- **Conteneur du prompt** : ce conteneur affiche le prompt qui sera envoyé à Phind pour analyser les types d'animal.
- **Bouton d'analyse** : ce bouton permet de lancer l'analyse du fichier Excel demandé sur les catégories sélectionnées.
- **Bouton vers l'interface principale** : ce bouton permet de revenir à la page principale du site web.


# Réseaux sociaux
## Instagram
### Récupération des données Instagram avec `snds_instagram.py`

Le script Python `snds_instagram.py` est conçu pour récupérer des données à partir d'Instagram en utilisant l'API Instagram. Voici un aperçu détaillé de son fonctionnement :

1. **Initialisation de l'API Instagram** :
   - Le script utilise l'API Instagram pour interagir avec la plateforme Instagram et récupérer les données requises.

2. **Obtention de l'ID d'un hashtag** :
   - La fonction `getHashtagID(hashtag)` permet de récupérer l'ID d'un hashtag Instagram spécifié. Cet ID est nécessaire pour effectuer des requêtes ultérieures sur les posts associés à cet hashtag.

3. **Ajout de données à un fichier** :
   - La fonction `addToFile(filename, data)` gère l'ajout de données à un fichier spécifié. Elle vérifie d'abord si le fichier existe et s'il contient déjà des données. Si le fichier existe et n'est pas vide, les nouvelles données sont ajoutées à la suite des données existantes.

4. **Récupération des posts Instagram** :
   - La fonction `getInstagramPosts(hashtagID, next)` récupère les posts associés à un hashtag donné à partir de son ID. Elle peut également prendre un paramètre optionnel `next` qui permet de paginer les résultats si nécessaire.
   - Cette fonction envoie une requête à l'API Instagram pour obtenir les posts les plus populaires associés à l'ID de l'hashtag spécifié.
   - Les données des posts récupérés comprennent des informations telles que l'ID, le type de média, le nombre de commentaires, le texte de la légende, le nombre de likes, la date de publication.

5. **Gestion de plusieurs requêtes** :
   - La fonction `getNbPosts(hashtagID, nbRequest)` gère la récupération de plusieurs posts associés à un hashtag. Elle prend en compte le nombre de requêtes spécifié par l'utilisateur et effectue les requêtes nécessaires pour obtenir tous les posts désirés.

6. **Enregistrement des données dans des fichiers JSON** :
   - Les données des posts récupérés sont enregistrées dans des fichiers JSON pour un stockage et une utilisation ultérieurs. Chaque fichier JSON est nommé en fonction de l'ID de l'hashtag associé aux posts.

`snds_instagram.py` récupére des données à partir d'Instagram en utilisant des hashtags spécifiés. Il simplifie le processus de collecte et de stockage des données pour une utilisation ultérieure.



## YouTube
### Documentation du système de récupération de données YouTube

Ce système est conçu pour récupérer des informations sur les vidéos YouTube en fonction de mots-clés spécifiés, de dates de début et de fin, etc. Il est composé de plusieurs fichiers Python qui travaillent ensemble pour accomplir cette tâche.

### Fichiers et Fonctions

#### Youtube.py

Le fichier `Youtube.py` contient les fonctions principales pour interagir avec l'API YouTube et récupérer les données des vidéos.

##### Fonctions Utilitaires

- `clean_string(input_str: str) -> str` : Cette fonction nettoie une chaîne de caractères en supprimant les caractères non ASCII.
- `convert_date(date_string: str) -> str` : Convertit une chaîne de caractères représentant une date en format ISO.
- `convert_date_format(input_date: str) -> str` : Convertit une date au format ISO en une autre chaîne de caractères représentant une date.

##### Fonction Principale

- `get_youtube_data(keyword: str, max_videos: int, api_key: str, start_date: str, end_date: str, langue: str) -> list` : Cette fonction récupère les données des vidéos YouTube correspondant à un mot-clé donné. Elle effectue plusieurs requêtes à l'API YouTube pour obtenir les données des vidéos. Les paramètres incluent le mot-clé à rechercher, le nombre maximum de vidéos à récupérer, les dates de début et de fin, la langue, et la clé API YouTube.

#### Excel.py

Le fichier `Excel.py` contient une fonction pour générer un fichier Excel à partir des données récupérées des vidéos YouTube.

#### Youtube-Class.py

Le fichier `Youtube-Class.py` contient la définition de la classe `Youtube`, qui représente une vidéo YouTube et ses attributs.

#### Classe Youtube

- `__init__(self, data: dict)` : Le constructeur de la classe `Youtube` prend un dictionnaire contenant les données de la vidéo YouTube et initialise les attributs de la vidéo.
- Méthodes pour obtenir différents attributs de la vidéo, tels que le titre, la description, le nom du canal, les tags, la localisation, la durée, l'ID du canal, le nombre de "j'aime", le nombre de vues, le nombre de commentaires et la date de publication.



## Reddit
Le script `reddit.py` permet de récupérer les posts depuis un subreddit spécifié sur Reddit en utilisant l'API PRAW (Python Reddit API Wrapper) et de les sauvegarder dans un fichier Excel.

#### Configuration des identifiants Reddit

Avant d'utiliser ce script, assurez-vous d'avoir configuré correctement les identifiants requis pour accéder à l'API Reddit. Vous devez fournir les informations suivantes dans le script :

- `reddit_client_id`: L'identifiant client de votre application Reddit.
- `reddit_client_secret`: Le secret client de votre application Reddit.
- `reddit_user_agent`: L'agent utilisateur que vous utilisez pour accéder à l'API Reddit.

Assurez-vous d'avoir créé une application sur Reddit et d'avoir généré les identifiants appropriés (voir installation).

#### Fonction `get_reddit_posts`

La fonction `get_reddit_posts` est la fonction principale du script qui récupère les posts depuis un subreddit spécifié sur Reddit.

- **Arguments** :
  - `communaute` : Le nom du subreddit à partir duquel récupérer les posts.
  - `date_debut` : La date de début de l'intervalle de temps pour récupérer les posts.
  - `date_fin` : La date de fin de l'intervalle de temps pour récupérer les posts.
  - `nb_posts` : Le nombre maximum de posts à récupérer.

- **Fonctionnalités** :
  - Récupère les posts à partir du subreddit spécifié en utilisant l'API PRAW.
  - Filtre les posts en fonction de l'intervalle de temps spécifié.
  - Crée un fichier Excel contenant les informations des posts récupérés, telles que le titre, la description, la date, le nombre de likes et le nombre de commentaires.

- **Sortie** :
  - Un fichier Excel contenant les informations des posts récupérés, nommé selon le format "reddit-{nom_subreddit}-{date}.xlsx", où `{nom_subreddit}` est le nom du subreddit et `{date}` est la date au format YYYY-MM-DD.



## Flickr
Le script `flickr.py` permet de récupérer les posts sur un mot-clé spécifié sur Flickr en utilisant l'API FlickrAPI, et de les sauvegarder dans un fichier Excel.

#### Configuration des identifiants Flickr

Avant d'utiliser ce script, assurez-vous d'avoir configuré correctement les identifiants requis pour accéder à l'API Flickr. Vous devez fournir les informations suivantes dans le script :

- `api_key`: La clé d'API de votre application Flickr.
- `api_secret`: La clé secrète de votre application Flickr.

Assurez-vous d'avoir créé une application sur Flickr et d'avoir généré les identifiants appropriés (voir installation).

#### Fonction `get_flickr_posts`

La fonction `get_flickr_posts` est la fonction principale du script qui récupère les posts sur un mot-clé spécifié.

- **Arguments** :
  - `mot_cle` : Le mot-clé à partir duquel récupérer les posts.
  - `date_debut` : La date de début de l'intervalle de temps pour récupérer les posts.
  - `date_fin` : La date de fin de l'intervalle de temps pour récupérer les posts.
  - `nb_posts` : Le nombre maximum de posts à récupérer.

- **Fonctionnalités** :
  - Récupère les posts à partir du mot-clé spécifié en utilisant l'API FlickrAPI.
  - Filtre les posts en fonction de l'intervalle de temps spécifié.
  - Crée un fichier Excel contenant les informations des posts récupérés, telles que le titre, la description, la date, la localisation, le pays,  le nombre de vues, le nombre de likes, le nombre de commentaires, et l'url.

- **Sortie** :
  - Un fichier Excel contenant les informations des posts récupérés, nommé selon le format "flickr-{mot-clé}-{date}.xlsx", où `{mot-clé}` est le mot-clé spécifié et `{date}` est la date au format YYYY-MM-DD.


# Réseaux de neurones
## Keras
La bibliothèque `keras` permet de créer et entraîner notre propre réseau de neurones, à l'aide de notre dataset `training.csv`.

#### Configuration du réseau de neurones

Dans le script `modele.py`, nous créons un réseau de neurones composé de :

- 1 couche d'entrée de 1000 vecteurs-mots.
- 3 couches cachées de 64 neurones chacune.
- 1 couche de sortie d'un neurone.

Ce réseau de neurones est entraîné pour effectuer de la classification binaire de phrases sur le type d'environnement (terrestre ou aquatique). Nous avons, pour cela, créé un dataset dans le fichier `training.csv`, contenant plusieurs centaines de phrases d'entraînement.
Le modèle est alors sauvegardé dans le fichier `modele.h5`.

Assurez-vous d'avoir installé les bibliothèques `keras` et `tensorflow`.

#### Fonction `get_modele`

La fonction `get_modele` est la fonction principale du script qui entraîne le modèle, ou l'utilise pour analyser des types d'environnement.

- **Arguments** :
  - `nb_epochs` : Le nombre d'epochs souhaité pour entraîner le modèle.

- **Fonctionnalités** :
  - Entraîne le modèle si le fichier `modele.h5` n'existe pas ou a été supprimé.

- **Sortie** :
  - Le modèle généré ou sauvegardé, ainsi que le tokenizer des phrases d'entrée du dataset.

#### Fonction `make_prediction`

La fonction `make_prediction` permet d'effectuer une prédiction sur une phrase ne provenant pas du dataset, par le modèle préalablement entraîné.

- **Arguments** :
  - `modele` : Le modèle entraîné.
  - `tokenizer` : Le tokenizer généré par le dataset.
  - `phrase` : La phrase à analyser.

- **Fonctionnalités** :
  - Utilise le modèle pour prédire le type d'environnement associé à la phrase.

- **Sortie** :
  - Le type d'environnement prédit (terrestre si la prédiction est proche de 0, aquatique si elle est proche de 1).



## SIA (Sentiment Intensity Analyzer)
La bibliothèque `SentimentIntensityAnalyzer` permet de déterminer le sentiment prédominant d'une phrase (négative, neutre, positive).

#### Configuration du réseau de neurones

Dans le script `sentiment.py`, nous séparons la phrase entre chacun de ses mots grâce à la bibliothèque `TextBlob`.
Dans le script `process_file.py`, nous initialisons notre instance de SIA.

Assurez-vous d'avoir installé les bibliothèques `SentimentIntensityAnalyzer` et `TextBlob`.

#### Fonction `predict_sentiment`

La fonction `predict_sentiment` est la fonction principale du script qui analyse le sentiment prédominant d'une phrase.

- **Arguments** :
  - `phrase` : La phrase à analyser.
  - `sia` : L'instance de SIA pour analyser la phrase.

- **Fonctionnalités** :
  - Détermine le sentiment prédominant de la phrase.

- **Sortie** :
  - Le choix du sentiment (positif, plutôt positif, neutre, plutôt négatif, négatif) avec le score associé.

#### Fonction `choose_sentiment`

La fonction `choose_sentiment` permet de choisir le sentiment selon le score calculé par SIA.

- **Arguments** :
  - `blob` : L'ensemble des mots de la phrase.
  - `polarite` : La polarité générale de la phrase, calculée par SIA.
  - `sia` : L'instance de SIA.

- **Fonctionnalités** :
  - Tranche la sortie numérique de la polarité en 5 sentiments possibles (proche de -1 = négatif, proche de 1 = positif, etc).

- **Sortie** :
  - Le sentiment, son score, et la liste des mots déterminants.

#### Fonction `mots_determinants`

La fonction `mots_determinants` permet de renvoyer la liste des mots déterminants d'une phrase non neutre.

- **Arguments** :
  - `blob` : L'ensemble des mots de la phrase.
  - `sia` : L'instance de SIA.
  - `sentiment` : Le sentiment prédominant calculé.

- **Fonctionnalités** :
  - Affiche les mots qui ont permis à SIA de déterminer le sentiment général de la phrase.

- **Sortie** :
  - La liste des mots déterminants.



## Phind
La bibliothèque `selenium` permet d'ouvrir un webdriver et d'envoyer un prompt de chaque phrase à analyser vers le site web Phind.

#### Configuration du prompt

Dans le script `animal.py`, nous écrivons un pré-prompt permettant de formater le prompt, et le format de la réponse attendue
Ce pré-prompt peut être partiellement personnalisé par l'utilisateur, selon la liste d'éléments qu'il souhaite prédire.

Assurez-vous d'avoir installé la bibliothèque `selenium`.

#### Fonction `analyze_animals`

La fonction `analyze_animals` est la fonction principale du script qui analyse le type d'animal d'une phrase.

- **Arguments** :
  - `feuille` : La feuille du fichier Excel d'où proviennent les phrases à analyser.
  - `columns_index` : Le dictionnaire contenant l'indice de la case 'animal'.
  - `phrases` : liste de dictionnaires contenant le contenu textuel de chaque phrase, et son numéro de colonne dans le fichier Excel.
  - `pre_prompt` : partie personnalisable du prompt envoyé à Phind.

- **Fonctionnalités** :
  - Détermine le type d'animal évoqué dans une phrase.

- **Sortie** :
  - Le fichier Excel modifié avec les types d'animaux prédits.
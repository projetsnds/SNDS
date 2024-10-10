La récupération de posts sur instagram se fait en deux étapes :

1ERE :
Récupération des posts sur l'API
On fait une première requête pour récuperer l'ID du hashtag sur lequel on veut récuperer des posts
Puis, on fait des requête top_media avec cet id pour en récuperer le maximum
A la fin de la requête se trouve un curseur next contenant l'url de la prochaine requête

A noter qu'à partir d'un moment (a partir de 50 requêtes environ), ce curseur sera le même en boucle, on arrête donc la
recherche

2EME:
La localisation n'est par récupérable via l'API, si on veut la récupérer, il faut faire du webscraping.
On lance des webdriver en parallèles avec selenium pour que cela soit plus rapide pour la récuperation des localisations

Problèmes rencontrés :
Le webscraping a 100% est impossible sur Instagram, sur le site web, le maximum de posts qu'on peut afficher pour un hashtag est de 25 environ.
Attention a ne pas trop lancer de Threads pour le webscraping des localisations, sinon Instagram vous bloquera

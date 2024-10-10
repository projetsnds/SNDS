import isodate
from langdetect import detect
from langdetect import lang_detect_exception

class Youtube:
    """
    Classe représentant une vidéo YouTube.

    Attributes:
        data (dict): Les données de la vidéo YouTube.
        title (str): Le titre de la vidéo.
        description (str): La description de la vidéo.
        channelTitle (str): Le nom du canal de la vidéo.
        tags (list): Les tags de la vidéo.
        localized (str): La localisation de la vidéo.
        duration (str): La durée de la vidéo.
        channelID (str): L'identifiant du canal de la vidéo.
        likes (str): Le nombre de "j'aime" de la vidéo.
        viewcount (str): Le nombre de vues de la vidéo.
        comments (str): Le nombre de commentaires de la vidéo.
        published (str): La date de publication de la vidéo.
    """
    def __init__(self, data: dict):
        """
        Constructeur de la classe Youtube.

        Args:
            data (dict): Les données de la vidéo YouTube.
        """
        self.data = data
        self.title = self.get_title()
        self.description = self.get_description()
        self.channelTitle = self.get_channelTitle()
        self.tags = self.get_tags()
        self.localized = self.get_location()
        self.duration = self.get_duration()
        self.channelID = self.get_channelID()
        self.likes = self.get_likes()
        self.viewcount = self.get_views()
        self.comments = self.get_comments()
        self.published = self.get_date()

    def get_title(self) -> str:
        """
        Obtient le titre de la vidéo.

        Returns:
            str: Le titre de la vidéo.
        """
        try:
            return self.data['snippet']['title']
        except KeyError:
            return ""

    def get_description(self) -> str:
        """
        Obtient la description de la vidéo.

        Returns:
            str: La description de la vidéo.
        """
        try:
            return self.data['snippet']['description']
        except KeyError:
            return ""

    def get_channelTitle(self) -> str:
        """
        Obtient le nom du canal de la vidéo.

        Returns:
            str: Le nom du canal de la vidéo.
        """
        try:
            return self.data['snippet']['channelTitle']
        except KeyError:
            return ""

    def get_tags(self) -> list:
        """
        Obtient les tags de la vidéo.

        Returns:
            list: Les tags de la vidéo.
        """
        try:
            return self.data['snippet']['tags']
        except KeyError:
            return []

    def get_location(self) -> str:
        """
        Obtient la localisation de la vidéo.

        Returns:
            str: La localisation de la vidéo.
        """
        try:
            return detect(self.data['snippet']['localized']['description'])
        except (KeyError,lang_detect_exception.LangDetectException):
            return ""

    def get_duration(self) -> str:
        """
        Obtient la durée de la vidéo.

        Returns:
            str: La durée de la vidéo.
        """
        try:
            duration = isodate.parse_duration(self.data['contentDetails']['duration'])
            hours, remainder = divmod(duration.total_seconds(), 3600)
            minutes, seconds = divmod(remainder, 60)
            return "{:02}:{:02}:{:02}".format(int(hours), int(minutes), int(seconds))
        except KeyError:
            return ""

    def get_channelID(self) -> str:
        """
        Obtient l'identifiant du canal de la vidéo.

        Returns:
            str: L'identifiant du canal de la vidéo.
        """
        try : 
            return self.data['snippet']['channelId']
        except KeyError:
            return ""

    def get_likes(self) -> str:
        """
        Obtient le nombre de "j'aime" de la vidéo.

        Returns:
            str: Le nombre de "j'aime" de la vidéo.
        """
        try : 
            return self.data['statistics']['likeCount']
        except KeyError:
            return ""

    def get_views(self) -> str:
        """
        Obtient le nombre de vues de la vidéo.

        Returns:
            str: Le nombre de vues de la vidéo.
        """
        try : 
            return self.data['statistics']['viewCount']
        except KeyError:
            return ""

    def get_comments(self) -> str:
        """
        Obtient le nombre de commentaires de la vidéo.

        Returns:
            str: Le nombre de commentaires de la vidéo.
        """
        try : 
            return self.data['statistics']['commentCount']
        except KeyError:
            return ""

    def get_date(self) -> str:
        """
        Obtient la date de publication de la vidéo.

        Cette méthode tente d'extraire la date de publication de la vidéo à partir des données de la vidéo.
        Si la clé 'publishedAt' n'est pas présente dans les données, elle renvoie une chaîne vide.

        Returns:
            str: La date de publication de la vidéo sous forme de chaîne de caractères.
        """
        try : 
            return self.data['snippet']['publishedAt']
        except KeyError:
            return ""

from textblob import TextBlob

# fonction qui renvoie la liste des mots déterminants d'une phrase non-neutre
def mots_determinants(blob, sia, sentiment):
  res = []
  for mot in blob.words:
    polarity = sia.polarity_scores(str(mot))
    if polarity['compound'] > 0.0 and sentiment == "positif":
      res.append(mot)
    elif polarity['compound'] < 0.0 and sentiment == "négatif":
      res.append(mot)  
    
  return res


# fonction qui catégorise une phrase selon sa polarité
def choose_sentiment(blob, polarite, sia):
  if polarite > 0.75:
    return f'positif ({polarite:.2f}) {mots_determinants(blob, sia, "positif")}'
  elif polarite > 0.25:
    return f'plutôt positif ({polarite:.2f}) {mots_determinants(blob, sia, "positif")}'
  elif polarite > -0.25:
    return f'neutre ({polarite:.2f})'
  elif polarite > -0.75:
    return f'plutôt négatif ({polarite:.2f}) {mots_determinants(blob, sia, "négatif")}'
  else:
    return f'négatif ({polarite:.2f}) {mots_determinants(blob, sia, "négatif")}'


# fonction qui prédit la polarité d'une phrase
def predict_sentiment(phrase, sia):
    blob = TextBlob(phrase)
    polarite = sia.polarity_scores(phrase)['compound']
    return choose_sentiment(blob, polarite, sia)

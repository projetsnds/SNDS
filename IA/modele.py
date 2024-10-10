from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.optimizers import Adam
from keras.models import load_model
from keras.preprocessing.sequence import pad_sequences
from keras.models import Sequential
from keras.layers import Dense, Flatten, Embedding
import numpy as np
import sys
import os
import pandas as pd

sys.stdout.reconfigure(encoding='utf-8')

# taille maximale des mots
max_words = 1000
max_length = 500

aquatique = 1
terrestre = 0

# nom du modèle et du dataset utilisé
MODEL_NAME = "modele.h5"
DATASET_NAME = "training.csv"

def get_modele(nb_epochs=200):
    # si on a déjà un modèle sauvegardé :
    if os.path.exists(f"../IA/{MODEL_NAME}"):
        model = load_model(f"../IA/{MODEL_NAME}", compile=False)
    else:
        # initialisation du modèle
        model = Sequential()

        # Embedding => utilisée pour traiter le langage naturel (analyse la sémantique de la phrase et la transforme en vecteur-mot)
        # Dense => densément connectée, chaque neurone est connecté à tous les neurones de sa couche précédente

        # couche de neurones d'entrée, des vecteurs-mots (phrase à analyser)
        model.add(Embedding(max_words, 100))

        # 3 couches cachées (chaque couche composée de 64 neurones)
        model.add(Dense(units=64))
        model.add(Dense(units=64))
        model.add(Dense(units=64))

        # on aplatit la dernière couche pour qu'elle soit en 2D (et non en 3D)
        model.add(Flatten())

        # couche de sortie (1 neurone, qui indique le résultat)
        model.add(Dense(units=1, activation='sigmoid'))


    # on ouvre le dataset permettant d'entraîner le modèle
    tests = pd.read_csv(f'../IA/dataset/{DATASET_NAME}', encoding='utf-8')

    # phrases d'exemples (pour entraîner le modèle)
    entree = tests['phrase'].tolist()

    # résultats attendus pour ces exemples
    sortie = tests['resultat'].tolist()

    # outil qui transforme les phrases en token (1 par mot)
    tokenizer = Tokenizer(num_words=max_words)
    tokenizer.fit_on_texts(entree)

    # représenter les token sous forme d'entiers (appelés séquences). Le mot i vaudra l'entier i dans le vocabulaire
    sequences = tokenizer.texts_to_sequences(entree)

    # transformer les séquences en un tableau 2D (s'assurer que chaque séquence est de même longueur + importance des matrices)
    data = pad_sequences(sequences, maxlen=max_length)

    # transformer les valeurs de sortie en un tableau NumPy (matrice)
    sortie = np.array(sortie)

    # on compile le modèle (loss = fonction utilisée pour déterminer la proportion des erreurs pendant la phase d'entraînement)
    model.compile(loss="binary_crossentropy", optimizer=Adam(learning_rate=0.001), metrics=['accuracy'])


    if not os.path.exists(f"../IA/{MODEL_NAME}"):
        # on entraîne le modèle sur 200 epochs (1 epoch = 1 cycle d'entraînement)
        # à chaque epoch, le modèle se précise et les erreurs se minimisent
        model.fit(x=data, y=sortie, epochs=nb_epochs)
        model.save(f"../IA/{MODEL_NAME}", save_format='h5')
        
    return model, tokenizer


# fonction qui fait effectuer une prédiction du modèle sur une phrase
def make_prediction(modele, tokenizer, phrase):
    sequence = tokenizer.texts_to_sequences([phrase])
    data = pad_sequences(sequence, maxlen=500)
    prediction = modele.predict(data)
    pred = prediction[0][0]
    return f"{'terrestre' if pred < 0.50 else 'aquatique'} ({pred:.2f})"
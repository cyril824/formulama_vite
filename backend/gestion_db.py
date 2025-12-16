import sqlite3
import datetime 
import os

# Chemin vers la base de données (utilise '../data/' pour remonter au dossier formula_vite/data/)
DB_NAME = '../data/documents.db' 

def supprimer_document(doc_id: int):
    """
    Supprime un enregistrement de document de la base de données par son ID.
    """
    conn = None
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        
        # Requête DELETE : utilise l'ID pour identifier la ligne
        suppression_query = "DELETE FROM documents WHERE id = ?"
        
        cursor.execute(suppression_query, (doc_id,))
        conn.commit()
        
        # Vérifie si une ligne a été affectée (si l'ID existait)
        return cursor.rowcount > 0 

    except sqlite3.Error as e:
        print(f"🛑 Erreur lors de la suppression du document ID {doc_id} : {e}")
        return False
    finally:
        if conn:
            conn.close()

def initialiser_base_de_donnees():
    """Crée le fichier DB et la table 'documents' s'ils n'existent pas."""
    conn = None
    try:
        # Assurez-vous que le répertoire 'data' existe
        os.makedirs(os.path.dirname(DB_NAME), exist_ok=True)
        
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        
        creation_table_query = """
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom_fichier TEXT NOT NULL,
            chemin_local TEXT NOT NULL,
            categorie TEXT NOT NULL,
            date_ajout DATETIME
        );
        """
        cursor.execute(creation_table_query)
        conn.commit()
        print(f"✅ Base de données '{DB_NAME}' initialisée avec succès.")

    except sqlite3.Error as e:
        print(f"🛑 Erreur lors de l'initialisation de la base de données : {e}")
    except Exception as e:
        print(f"🛑 Erreur système lors de l'initialisation : {e}")
    finally:
        if conn:
            conn.close()

def ajouter_document(nom, chemin, categorie):
    """Ajoute un enregistrement de document."""
    conn = None
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        
        insertion_query = """
        INSERT INTO documents (nom_fichier, chemin_local, categorie, date_ajout)
        VALUES (?, ?, ?, ?)
        """
        data = (
            nom,
            chemin,
            categorie,
            # Correction de la syntaxe de datetime
            datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S") 
        )

        # Exécute la requête
        cursor.execute(insertion_query, data)
        conn.commit()
        
        # Récupère l'ID du document inséré
        doc_id = cursor.lastrowid
        return doc_id

    except sqlite3.Error as e:
        print(f"🛑 Erreur lors de l'ajout du document '{nom}' : {e}")
        return False
    finally:
        if conn:
            conn.close()

def recuperer_documents_par_categorie(categorie):
    """Récupère tous les documents pour une catégorie donnée."""
    conn = None
    documents = []
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()

        select_query = """
        SELECT id, nom_fichier, chemin_local, date_ajout 
        FROM documents
        WHERE categorie = ?
        ORDER BY date_ajout DESC
        """
        
        # Utilise la catégorie pour filtrer
        cursor.execute(select_query, (categorie,))
        documents = cursor.fetchall()

    except sqlite3.Error as e:
        print(f"🛑 Erreur lors de la récupération pour la catégorie '{categorie}' : {e}")
        
    finally:
        if conn:
            conn.close()
            
    return documents

def recuperer_4_derniers_documents():
    """
    Récupère les 4 documents les plus récemment ajoutés, quelle que soit leur catégorie.
    Ceci est utilisé pour l'aperçu sur la page d'accueil (Dashboard).
    """
    conn = None
    documents = []
    try:
        conn = sqlite3.connect(DB_NAME)
        # Permet d'accéder aux colonnes par leur nom (comme un dictionnaire)
        conn.row_factory = sqlite3.Row 
        cursor = conn.cursor()

        select_query = """
        SELECT id, nom_fichier, chemin_local, categorie, date_ajout 
        FROM documents
        ORDER BY date_ajout DESC
        LIMIT 4
        """
        
        # Exécute la requête sans filtre spécifique
        cursor.execute(select_query)
        # Convertit les lignes (sqlite3.Row) en une liste de dictionnaires/objets
        documents = [dict(row) for row in cursor.fetchall()]

    except sqlite3.Error as e:
        print(f"🛑 Erreur lors de la récupération des 4 derniers documents : {e}")
        
    finally:
        if conn:
            conn.close()
            
    return documents


# --- NOUVELLE FONCTION DE DIAGNOSTIC ---
def diagnostiquer_fichiers_locaux(data_folder_path):
    """
    Liste les fichiers présents dans le dossier de données local.
    Ceci est utilisé pour vérifier la casse et l'existence des fichiers sur le serveur.
    """
    try:
        # Liste tous les fichiers et dossiers dans DATA_FOLDER_PATH
        all_items = os.listdir(data_folder_path)
        # Filtre pour ne garder que les fichiers (pas les dossiers) et les fichiers pertinents
        local_files = [item for item in all_items if os.path.isfile(os.path.join(data_folder_path, item)) and not item.startswith('.')]
        return {
            "dossier_recherche": data_folder_path,
            "fichiers_locaux": local_files,
            "statut": "SUCCÈS"
        }
    except FileNotFoundError:
        return {
            "dossier_recherche": data_folder_path,
            "fichiers_locaux": [],
            "statut": "ERREUR: Dossier de données introuvable par le serveur Python."
        }
    except Exception as e:
        return {
            "dossier_recherche": data_folder_path,
            "fichiers_locaux": [],
            "statut": f"ERREUR INCONNUE: {str(e)}"
        }
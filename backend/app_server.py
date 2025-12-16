import flask
from flask import Flask, request, jsonify, send_from_directory, abort
from flask_cors import CORS
import os 
from werkzeug.utils import secure_filename 
import urllib.parse 

# Importe toutes les fonctions nécessaires
from gestion_db import ajouter_document, recuperer_documents_par_categorie, supprimer_document, initialiser_base_de_donnees, recuperer_4_derniers_documents, diagnostiquer_fichiers_locaux 

# 1. Configuration de l'application Flask
app = Flask(__name__)
CORS(app) 

# --- DÉFINITION DU CHEMIN DU DOSSIER DE DONNÉES ---
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_FOLDER_PATH = os.path.join(PROJECT_ROOT, 'data')
# ----------------------------------------------------

# --- FONCTION UTILITAIRE POUR LE MIME TYPE ---
def get_mimetype(filename):
    """Détermine le MIME type basé sur l'extension du fichier."""
    if filename.lower().endswith('.pdf'):
        return 'application/pdf'
    elif filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
        return 'image/' + filename.split('.')[-1]
    else:
        return 'application/octet-stream'


# 2. Point d'accès de base
@app.route('/')
def home():
    return "Serveur API Python pour Formulama actif!"

# 3. Endpoint pour ajouter un document (Méthode POST) - GÈRE L'UPLOAD DU FICHIER
@app.route('/api/documents/ajouter', methods=['POST'])
def api_ajouter_document():
    if 'file' not in request.files:
        return jsonify({"error": "Aucun fichier n'a été envoyé."}), 400
        
    f = request.files['file']
    categorie = request.form.get('categorie')
    
    if not categorie:
        return jsonify({"error": "Catégorie manquante."}), 400
    
    # Sécurisation du nom de fichier
    filename = secure_filename(f.filename)

    # 1. Sauvegarde physique du fichier dans le dossier /data
    file_path = os.path.join(DATA_FOLDER_PATH, filename)
    
    try:
        if not os.path.exists(DATA_FOLDER_PATH):
            os.makedirs(DATA_FOLDER_PATH) 
            
        f.save(file_path) 
        print(f"✅ Fichier sauvegardé physiquement à: {file_path}")
        
    except Exception as e:
        print(f"🛑 Erreur de sauvegarde du fichier: {e}")
        return jsonify({"error": f"Échec de la sauvegarde physique du fichier sur le serveur: {e}"}), 500

    # 2. Enregistrement dans la base de données
    simulated_path = f"//localhost/data/{filename}" 
    doc_id = ajouter_document(filename, simulated_path, categorie)
    
    if doc_id:
        return jsonify({"message": "Document et BDD mis à jour avec succès", "id": doc_id}), 201 
    else:
        return jsonify({"error": "Erreur lors de l'insertion dans la base de données"}), 500

# 4. Endpoint pour récupérer les documents par catégorie (Méthode GET)
@app.route('/api/documents/<categorie>', methods=['GET'])
def api_recuperer_documents(categorie):
    documents = recuperer_documents_par_categorie(categorie)
    return jsonify(documents), 200

# Endpoint pour récupérer les 4 documents récents
@app.route('/api/documents/recents', methods=['GET'])
def api_recuperer_documents_recents():
    try:
        documents = recuperer_4_derniers_documents()
        return jsonify(documents), 200
    except Exception as e:
        print(f"Erreur lors de la récupération des documents récents: {e}")
        return jsonify({"error": "Erreur interne du serveur lors de la récupération des documents récents"}), 500

# Endpoint de diagnostic
@app.route('/api/documents/diagnostiquer-fichiers', methods=['GET'])
def api_diagnostiquer_fichiers():
    diagnostic_result = diagnostiquer_fichiers_locaux(DATA_FOLDER_PATH)
    return jsonify(diagnostic_result), 200

# --- ENDPOINT FINAL POUR CONSULTER LE FICHIER (CORRIGÉ POUR SÉCURITÉ) ---
@app.route('/api/documents/ouvrir/<filename>', methods=['GET'])
def api_ouvrir_document(filename):
    """
    Sert le fichier statique demandé à partir du dossier de données.
    """
    try:
        # Décodage de l'URL pour gérer les espaces (%20)
        decoded_filename = urllib.parse.unquote(filename)
        
        full_path = os.path.join(DATA_FOLDER_PATH, decoded_filename)
        
        print(f"\n--- DEBUG D'OUVERTURE ---")
        print(f"Fichier demandé (décodé) : {decoded_filename}")
        
        if not os.path.exists(full_path):
            print(f"ERREUR PHYSIQUE: Fichier introuvable à : {full_path}")
            abort(404) 

        print(f"Fichier trouvé : Tentative d'envoi.")
        
        # Utilise send_from_directory pour servir le fichier
        response = send_from_directory(
            directory=DATA_FOLDER_PATH,
            path=decoded_filename, # Utilise le nom décodé
            as_attachment=False,
            mimetype=get_mimetype(decoded_filename)
        )
        
        # 🚨 CORRECTION CRITIQUE : Supprime les en-têtes de sécurité qui bloquent l'iFrame
        # Les en-têtes sont ajoutés à l'objet 'response' retourné par send_from_directory
        response.headers['X-Frame-Options'] = 'ALLOWALL'
        response.headers['Content-Security-Policy'] = "frame-ancestors 'self' http://localhost:* https://localhost:*;"
        
        print(f"-------------------------\n")
        return response
    
    except Exception as e:
        # Gère les erreurs internes
        print(f"Erreur générale lors de l'ouverture du document {filename}: {e}")
        return jsonify({"error": f"Erreur interne du serveur lors de l'ouverture: {e}"}), 500


# 5. Endpoint pour supprimer un document (Méthode DELETE)
@app.route('/api/documents/<int:doc_id>', methods=['DELETE'])
def api_supprimer_document(doc_id):
    if supprimer_document(doc_id):
        return jsonify({"message": f"Document ID {doc_id} supprimé."}), 200
    else:
        return jsonify({"error": f"Impossible de supprimer le document ID {doc_id}. Introuvable ou erreur interne."}), 404

# 6. Lancement du serveur
if __name__ == '__main__':
    initialiser_base_de_donnees()
    print(f"\n[INFO] Dossier de documents configuré : {DATA_FOLDER_PATH}\n")
    app.run(debug=True, host="0.0.0.0", port=5001)
# Mise à jour : niveaux, matières et validation des comptes

Aucun nouveau package à installer (pas de `npm install`).

## 1. Arrêter les serveurs
Dans les deux terminaux (back-end et front-end) : Ctrl + C.

## 2. Copier les fichiers
Extraire ce zip dans le dossier `plateforme-quiz-sprint1` (celui qui contient `backend` et `frontend`)
et accepter le remplacement des fichiers existants.

## 3. Mettre à jour la base de données
1. pgAdmin : clic droit sur la base `quiz_platform` > Query Tool.
2. Ouvrir `backend/db/02_validation_niveaux.sql` (icône dossier de la fenêtre) ou coller son contenu.
3. Exécuter avec le bouton ▶. Les comptes déjà créés passent automatiquement en « valide ».

## 4. Compte administrateur
Un compte déjà passé en admin reste valide. Sinon, après vous être inscrit, exécuter dans pgAdmin :

    UPDATE users SET role = 'admin', statut = 'valide' WHERE email = 'votre@email.com';

## 5. Relancer
    cd backend
    npm run dev

et, dans un second terminal :

    cd frontend
    npm run dev

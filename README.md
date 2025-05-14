# Todo Kanban App - Application de gestion de tâches

![Angular](https://img.shields.io/badge/Angular-18.0.0-dd0031.svg)
![Material](https://img.shields.io/badge/Angular%20Material-18.0.0-3f51b5.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4.2-007acc.svg)
![RxJS](https://img.shields.io/badge/RxJS-7.8.0-c2185b.svg)

Une application moderne de gestion de tâches (Todo List) avec une interface Kanban, développée avec Angular 18 et Angular Material. L'application permet de créer, éditer, déplacer et supprimer des tâches entre deux colonnes : "À faire" et "Terminées".

## Fonctionnalités

- **Interface Kanban** : Visualisation claire des tâches à faire et terminées
- **Glisser-déposer** : Déplacement des tâches entre les colonnes par drag & drop
- **Recherche en temps réel** : Filtrage des tâches dans les deux colonnes
- **Notifications** : Feedback visuel pour toutes les actions utilisateur
- **Responsive Design** : Interface adaptée à tous les appareils

## Prérequis

- Node.js (version 18.x ou supérieure)
- npm (version 9.x ou supérieure)
- Angular CLI (version 18.x)
- Backend Express.js exposant une API de gestion de tâches

## Installation

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/votre-username/todo-kanban-app.git
   cd todo-kanban-app
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Démarrez l'application en mode développement :
   ```bash
   npm start
   ```

4. Ouvrez votre navigateur à l'adresse `http://localhost:4200`

## Structure du projet

L'application suit l'architecture standalone d'Angular 18, recommandée depuis Angular 17+ :

```
todo-kanban-app/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── kanban-board/        # Composant principal avec vue Kanban
│   │   │   ├── todo-item/           # Carte représentant une tâche
│   │   │   └── todo-form/           # Formulaire d'ajout/édition de tâche
│   │   ├── models/
│   │   │   └── todo.model.ts        # Interface TypeScript pour les tâches
│   │   ├── services/
│   │   │   ├── todo.service.ts      # Service pour la gestion des tâches
│   │   │   └── notification.service.ts  # Service pour les notifications
│   │   ├── interceptors/
│   │   │   └── error.interceptor.ts  # Intercepteur pour gestion des erreurs
│   │   ├── pipes/
│   │   │   └── filter-todos.pipe.ts  # Pipe pour filtrer les tâches
│   │   ├── directives/
│   │   │   └── auto-focus.directive.ts  # Directive pour focus automatique
│   │   ├── app.component.ts         # Composant racine
│   │   ├── app.routes.ts            # Configuration des routes
│   │   └── app.config.ts            # Configuration de l'application
│   ├── assets/                      # Images et autres fichiers statiques
│   ├── styles.scss                  # Styles globaux
│   └── main.ts                      # Point d'entrée de l'application
├── proxy.conf.json                  # Configuration du proxy pour le backend
└── ...
```

## Caractéristiques techniques

- **Architecture Standalone Angular 18** : Utilisation de l'approche moderne sans NgModules
- **Angular Material** : Composants UI modernes et accessibles
- **RxJS** : Gestion réactive des données et de l'état
- **CDK Drag & Drop** : Fonctionnalité de glisser-déposer performante
- **Formulaires réactifs** : Validation et gestion avancée des formulaires
- **Intercepteurs HTTP** : Gestion centralisée des erreurs
- **Pipes personnalisés** : Filtrage efficace des données
- **Directives personnalisées** : Amélioration de l'expérience utilisateur

## Fonctionnalités détaillées

### 1. Interface Kanban
- Deux colonnes distinctes pour les tâches à faire et terminées
- Compteurs de tâches dans chaque colonne
- Indicateurs visuels pour les tâches terminées

### 2. Gestion des tâches
- Ajout de nouvelles tâches avec titre et description
- Édition des tâches existantes
- Suppression de tâches
- Changement de statut (à faire/terminée) par glisser-déposer

### 3. Recherche et filtrage
- Recherche en temps réel avec debounce
- Filtrage indépendant dans chaque colonne

### 4. Feedback utilisateur
- Notifications pour toutes les actions (création, édition, suppression, changement de statut)
- Gestion des erreurs avec messages appropriés

## Auteur

Billy Ndihokubwayo

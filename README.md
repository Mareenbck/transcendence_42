# 🏓 ft_transcendence

> Projet final du tronc commun de l'école 42 - Une application web fullstack de Pong multijoueur avec chat en temps réel, gestion d'amis et authentification.

**ft_transcendence** est le dernier projet du tronc commun de 42. L'objectif est de créer une **Single Page Application (SPA)** permettant de jouer au jeu **Pong** en ligne contre d'autres joueurs, avec un système de **chat en temps réel**, une **gestion d'amis**, des **profils utilisateurs** et une **authentification sécurisée**.

Le projet est entièrement conteneurisé avec **Docker**.

## ✨ Fonctionnalités

- 🏓 **Jeu Pong** — Matchmaking et parties en temps réel via WebSockets
- 💬 **Chat en temps réel** — Channels publics/privés, messages directs, commandes d'administration
- 👤 **Profil utilisateur** — Avatar, statistiques de jeu, historique des parties
- 🤝 **Système d'amis** — Ajout/suppression d'amis, statut en ligne/hors-ligne
- 🔐 **Authentification** — Système d'auth sécurisé avec JWT
- ⚙️ **Paramètres** — Personnalisation du profil et des préférences
- 📱 **SPA** — Navigation fluide sans rechargement de page

## 🛠 Stack technique

### Frontend
| Technologie | Utilisation |
|---|---|
| **React** (TypeScript) | Framework UI |
| **Vite** | Bundler / Dev Server |
| **MUI (Material UI)** | Bibliothèque de composants |
| **CSS** | Styles personnalisés |

### Backend
| Technologie | Utilisation |
|---|---|
| **NestJS** (TypeScript) | Framework API REST & WebSockets |
| **Prisma** | ORM pour la base de données |
| **PostgreSQL** | Base de données relationnelle |
| **Socket.io** | Communication temps réel (via Gateway) |

### DevOps
| Technologie | Utilisation |
|---|---|
| **Docker** & **Docker Compose** | Conteneurisation |
| **Makefile** | Automatisation des commandes |

### Répartition des langages
```
TypeScript  ████████████████████░░░  84.3%
CSS         ███░░░░░░░░░░░░░░░░░░░░  14.2%
Autres      ░░░░░░░░░░░░░░░░░░░░░░░   1.5%
```

## 📸 Captures d'écran

| Page d'accueil | Accueil connecté |
|:-:|:-:|
| ![Accueil](img/acceuil.png) | ![Accueil 2](img/acceuil2.png) |

| Jeu Pong | Chat |
|:-:|:-:|
| ![Game](img/game.png) | ![Chat](img/chat.png) |

| Profil | Paramètres |
|:-:|:-:|
| ![Profil](img/profil.png) | ![Settings](img/settings.png) |

---

## 📦 Prérequis

- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/)
- [Make](https://www.gnu.org/software/make/)

---

## 🚀 Installation & Lancement

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/Mareenbck/transcendence_42v2.git
   cd transcendence_42v2
   ```

2. **Configurer les variables d'environnement**
   ```bash
   # Éditer le fichier api/.env avec vos propres valeurs
   cp api/.env.example api/.env
   ```

3. **Lancer l'application**
   ```bash
   make
   ```

4. **Accéder à l'application**
   | Service | URL |
   |---|---|
   | Frontend | [http://localhost:8080](http://localhost:8080) |
   | API Backend | [http://localhost:3000](http://localhost:3000) |
   | Prisma Studio | [http://localhost:5555](http://localhost:5555) |
   | PostgreSQL | `localhost:5432` |

---

---

## 🔧 Variables d'environnement

Créer un fichier `.env` dans le dossier `api/` avec les variables suivantes :

```env
# Base de données PostgreSQL
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_database
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}

# JWT
JWT_SECRET=your_jwt_secret

# Application
APP_PORT=3000
```

---

## 🐳 Services Docker

L'application est composée de **3 services** orchestrés via Docker Compose :

```
┌─────────────────────────────────────────────┐
│              Docker Network                 │
│            (transcendence)                  │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │ Frontend │  │   API    │  │ PostgreSQL│  │
│  │  (React) │  │ (NestJS) │  │           │  │
│  │  :8080   │──│  :3000   │──│  :5432    │  │
│  │          │  │  :5555   │  │           │  │
│  │          │  │  :8001   │  │           │  │
│  └──────────┘  └──────────┘  └───────────┘  │
└─────────────────────────────────────────────┘
```

---



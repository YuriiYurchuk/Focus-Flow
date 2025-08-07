# 🧠 FocusFlow

**FocusFlow** — це сучасний вебдодаток для трекінгу завдань із підтримкою таймера, досягнень та збереженням продуктивності. Додаток побудовано з фокусом на UX, адаптивність та підтримку користувачів у досягненні цілей.

![FocusFlow Preview](./preview.png)

---

## 🚀 Демо

🌐 **Веб:** https://focus-flow-lake-theta.vercel.app

📽️ **Відео-демо:** https://www.youtube.com/watch?v=NsliJFHnK9A

---

## 🛠️ Використані технології

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3068B7?style=for-the-badge)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![Date-fns](https://img.shields.io/badge/Date--fns-770C56?style=for-the-badge)
![Lucide React](https://img.shields.io/badge/Lucide-F56565?style=for-the-badge&logo=lucide&logoColor=white)

--- 

## ✨ Основний функціонал

- 📋 **Управління завданнями** — створення та видалення завдань
- ⏱️ **Вбудований таймер** — з можливістю паузи та продовження
- 🧩 **Система досягнень** — мотиваційна система нагород
- 🌓 **Перемикач теми** — світла та темна теми
- 🔐 **Безпечна автентифікація** — через Firebase Authentication
- ☁️ **Хмарне збереження** — синхронізація між пристроями через Firestore
- 📱 **Адаптивний дизайн** — ідеально працює на всіх пристроях

---

## 🔧 Локальний запуск



### 1. Клонувати репозиторій

```bash
git clone https://github.com/YuriiYurchuk/Focus-Flow.git
cd Focus-Flow
```

### 2. Встановити залежності

```bash
npm install
```

### 3. Налаштувати Firebase


1. Створіть проект у [Firebase Console](https://console.firebase.google.com/)
2. Увімкніть **Authentication** та **Firestore Database**
3. **Налаштуйте правила для Firestore:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /tasks/{taskId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      match /activityLogs/{logId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }

    match /achievements/{document=**} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

4. **Налаштуйте змінні середовища:**
   - Перейменуйте файл `.env.example` на `.env`
   - Додайте ваші Firebase ключі:

```env
VITE_FIREBASE_API_KEY=тут_твій_apiKey
VITE_FIREBASE_AUTH_DOMAIN=тут_твій_authDomain
VITE_FIREBASE_PROJECT_ID=тут_твій_projectId
VITE_FIREBASE_STORAGE_BUCKET=тут_твій_storageBucket
VITE_FIREBASE_MESSAGING_SENDER_ID=тут_твій_messagingSenderId
VITE_FIREBASE_APP_ID=тут_твій_appId
```

### 4. Запустити скрип на створення досягнень

```bash
# Створення початкових досягнень у Firestore
node scripts/seedAchievements.js
```

### 5. Запустити проект

```bash
npm run dev
```
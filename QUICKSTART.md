# 🚀 QUICK START - Anonimowy System Czatu

## Kroki do uruchomienia (5 minut)

### 1️⃣ Instalacja Node.js (jeśli nie masz)
Pobierz z: https://nodejs.org/

### 2️⃣ Otwórz terminal w folderze CHAT APP

```bash
cd c:\Users\igord\Documents\GitHub\CHAT APP
```

### 3️⃣ Zainstaluj zależności

```bash
npm install
```

To zainstaluje Express i CORS.

### 4️⃣ Uruchom serwer

```bash
npm start
```

Powinieneś zobaczyć:
```
╔════════════════════════════════════════╗
║   Anonymous Chat Server Running        ║
║   http://localhost:3000                ║
║   Log file: .../SQL/log.json           ║
╚════════════════════════════════════════╝
```

### 5️⃣ Otwórz aplikację w przeglądarce

```
http://localhost:3000/chat.html
```

## Co się stało? 🎉

✅ **Serwer Node.js** działa na porcie 3000  
✅ **Chat HTML** ładuje się z backendu  
✅ **JS Chat System** łączy się z API  
✅ **Wiadomości** zapisują się do `SQL/log.json`  

## Testowanie

1. Wpisz coś w input
2. Kliknij "Send" lub naciśnij Enter
3. Wiadomość pojawi się w chat box'ie
4. Sprawdź `SQL/log.json` - wiadomość tam jest!

## W przypadku błędów

### Błąd: "port 3000 already in use"
Zmień port w `server.js`:
```javascript
const PORT = 3001; // Zmień na inny
```

### Błąd: "npm: command not found"
Node.js nie jest zainstalowany. Pobierz z nodejs.org

### Wiadomości się nie wysyłają
1. Otwórz DevTools (F12)
2. Sprawdź Console - czy są błędy?
3. Sprawdź czy serwer działa

## Pliki które się zmieniły

```
✨ Nowe pliki:
  - server.js              (Backend serwer)
  - package.json          (Zależności)
  - JS/chat-system.js     (Frontend logika)
  - SQL/log.json          (Przechowywanie wiadomości)
  - README.md             (Full dokumentacja)
  - QUICKSTART.md         (To jest ten plik!)

📝 Zmienione pliki:
  - chat.html             (Dodano script tag)
  - CSS/chat.css          (Nowe stylizacje)
```

## Architektura

```
Browser
   ↓
chat.html + chat-system.js (Frontend)
   ↓
HTTP Requests to localhost:3000
   ↓
server.js (Express Backend)
   ↓
SQL/log.json (Przechowywanie)
```

## Funkcje API

| Metoda | Endpoint | Opis |
|--------|----------|------|
| GET | `/api/messages` | Pobierz wszystkie wiadomości |
| POST | `/api/messages` | Wyślij nową wiadomość |
| DELETE | `/api/messages/:id` | Usuń wiadomość |
| DELETE | `/api/messages` | Usuń wszystko |
| GET | `/api/stats` | Statystyki |

## Development mode z auto-reload

```bash
npm run dev
```

To używa `nodemon` do automatycznego restartowania przy zmianach.

## Przydatne komendy

```bash
# Sprawdzić status Node.js
node --version

# Sprawdzić status npm
npm --version

# Wyczyścić node_modules i reinstalować
rm -r node_modules
npm install
```

---

**Gotowe!** System czatu jest uruchomiony. Pisz wiadomości! 💬

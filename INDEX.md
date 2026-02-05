# 📚 DOKUMENTACJA - Anonymous Chat System

Witaj! Tutaj znajdziesz wszystkie informacje o systemie czatu.

## 🚀 Szybki Start (5 minut)

Jeśli chcesz **natychmiast** uruchomić aplikację:

👉 **[QUICKSTART.md](QUICKSTART.md)** - Start w 5 minut  
👉 **[WINDOWS_SETUP.md](WINDOWS_SETUP.md)** - Setup na Windows

## 📖 Pełna Dokumentacja

### 1. **[README.md](README.md)** - Główna dokumentacja
   - Przegląd funkcjonalności
   - Struktura plików
   - Instalacja i uruchomienie
   - Customizacja
   - API overview

### 2. **[API.md](API.md)** - Dokumentacja API
   - Wszystkie endpoints
   - Przykłady request/response
   - Testy z curl i JavaScript
   - Status codes i błędy
   - Postman integration

### 3. **[WINDOWS_SETUP.md](WINDOWS_SETUP.md)** - Setup na Windows
   - Instalacja Node.js
   - Krok po kroku instrukcje
   - Rozwiązywanie problemów
   - PowerShell komendy
   - Zaawansowana konfiguracja

## 🏗️ Architektura Projektu

```
CHAT APP/
├── 📄 server.js                    # Backend Express server
├── 📄 package.json                 # Zależności Node.js
├── 📄 chat.html                    # Frontend HTML
├── 📁 CSS/
│   ├── chat.css                    # Stylizacja czatu
│   └── style.css                   # Globalny styl + animacje
├── 📁 JS/
│   └── chat-system.js              # Frontend logika
├── 📁 SQL/
│   ├── log.json                    # Przechowywanie wiadomości (!)
│   └── log.example.json            # Przykład z test datą
├── 📁 HTML/                        # (Puste - do rozszerzenia)
├── 📄 .env.example                 # Konfiguracja example
├── 📄 .gitignore                   # Git ignore rules
├── 📄 README.md                    # Pełna dokumentacja
├── 📄 API.md                       # API dokumentacja
├── 📄 QUICKSTART.md                # Szybki start
└── 📄 WINDOWS_SETUP.md             # Windows instrukcje
```

## ⚙️ Jak to Działa?

### Frontend (Browser)
```
User types → chat-system.js → Fetch API → Backend
```

### Backend (Node.js)
```
Express Server (port 3000)
  ↓
GET  /api/messages      → Read from log.json
POST /api/messages      → Write to log.json
DELETE /api/messages/:id → Delete from log.json
```

### Storage (JSON)
```
SQL/log.json
{
  "messages": [
    { id, nick, pic, text, timestamp }
  ]
}
```

## 📋 Funkcjonalności

✅ **Anonimowe wiadomości** - Każdy to "Anonymous"  
✅ **Real-time wyświetlanie** - Wiadomości w live  
✅ **Przechowywanie** - Wszystkie wiadomości w JSON  
✅ **Animacje** - Płynne przejścia i efekty  
✅ **Responsywny design** - Działa na telefonie  
✅ **Kolorowe bubbles** - 3 różne gradientu kolorów  
✅ **Avatary** - Dynamiczne ikonki dla każdego  
✅ **Timestamps** - "5m ago", "2h ago", itp  
✅ **Validacja** - Pusty tekst nie przejdzie  
✅ **Polling** - Auto-update co 2 sekundy  

## 🎨 Wygląd

### Motyw
- Dark mode (czarny background #0a0a0a)
- Białe teksty
- Fioletowe, niebieskie, pomarańczowe akcenty
- Glassmorphism (blur effect)
- Smooth shadows

### Message Bubbles
```
┌─────────────────────┐
│ Anonymous  10m ago  │
├─────────────────────┤
│ Oto moja wiadomość! │
└─────────────────────┘
```

## 💻 Wymagania

- **Node.js** v12+
- **npm** (idzie z Node.js)
- **Modern browser** (Chrome, Edge, Firefox, Safari)

## 🔧 Instalacja (TL;DR)

```bash
# 1. Otwórz terminal w folderze
cd "C:\Users\igord\Documents\GitHub\CHAT APP"

# 2. Zainstaluj zależności
npm install

# 3. Uruchom serwer
npm start

# 4. Otwórz przeglądarkę
# http://localhost:3000/chat.html
```

## 🧪 Testing

### Test 1: Wyślij wiadomość
1. Otwórz http://localhost:3000/chat.html
2. Wpisz coś w input
3. Kliknij Send
4. Powinnaś zobaczyć wiadomość

### Test 2: Sprawdź log.json
1. Otwórz `SQL/log.json`
2. Powinna być tam Twoja wiadomość
3. Format: `{id, nick, pic, text, timestamp}`

### Test 3: API z curl
```bash
# Wszystkie wiadomości
curl http://localhost:3000/api/messages

# Wyślij wiadomość
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"nick":"Anonymous","text":"Hello!"}'
```

## 🐛 Debug Mode

Otwórz DevTools (F12) → Console → zobacz logi

```javascript
// Ręcznie załaduj wiadomości
fetch('/api/messages').then(r => r.json()).then(console.log)

// Wyślij test wiadomość
fetch('/api/messages', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({nick:'Anonymous',text:'Test'})
}).then(r => r.json()).then(console.log)
```

## 📚 Pliki Źródłowe

### server.js (Node.js Backend)
- Express server na port 3000
- Obsługuje GET/POST/DELETE
- Czyta/pisze do log.json
- Status: **PRODUKCYJNY**

### chat-system.js (Frontend Logic)
- Pobiera wiadomości co 2 sekundy
- Wysyła nowe wiadomości
- Renderuje message bubbles
- Animacje i efekty
- Status: **PRODUKCYJNY**

### chat.css (Styling)
- Message bubbles z gradientami
- Animacje slide-in
- Responsive design
- Avatar styling
- Status: **PRODUKCYJNY**

## 🎯 Funkcje API

| Endpoint | Metoda | Opis |
|----------|--------|------|
| `/api/messages` | GET | Wszystkie wiadomości |
| `/api/messages` | POST | Nowa wiadomość |
| `/api/messages/:id` | DELETE | Usuń wiadomość |
| `/api/messages` | DELETE | Usuń wszystko |
| `/api/stats` | GET | Statystyki |

Pełna dokumentacja: **[API.md](API.md)**

## 🚀 Production Deployment

Aby wdrożyć do produkcji:

1. Zainstaluj PM2: `npm install -g pm2`
2. Uruchom: `pm2 start server.js`
3. Setup autostart: `pm2 startup && pm2 save`
4. Monitoruj: `pm2 logs`

## 🔐 Security Notes

⚠️ **Aktualna wersja**:
- Brak rate limitingu
- Brak input sanitizacji (XSS risk!)
- Brak user authentication

**Do produkcji dodaj**:
- Rate limiting
- Input validation/sanitization
- User authentication
- HTTPS
- CORS restrictions

## 📱 Browser Support

| Browser | Status |
|---------|--------|
| Chrome | ✅ Pełny |
| Edge | ✅ Pełny |
| Firefox | ✅ Pełny |
| Safari | ✅ Pełny |
| IE 11 | ❌ Nie |

## 🎓 Nauka

Jeśli chcesz się nauczyć:

1. **JavaScript Fetch API** - `chat-system.js`
2. **Express.js** - `server.js`
3. **REST API design** - `API.md`
4. **CSS animations** - `chat.css`
5. **DOM manipulation** - `chat-system.js`

## ❓ FAQ

**P: Gdzie przechowywane są wiadomości?**  
O: W `SQL/log.json` - zwykły plik JSON

**P: Czy mogę zmienić port?**  
O: Tak, w `server.js` zmień: `const PORT = 3001`

**P: Jak dodać authentication?**  
O: Dodaj middleware w `server.js` do POST route'ów

**P: Czy mogę zmienić kolory?**  
O: Tak, w `CSS/chat.css` zmień gradient values

**P: Jak wymazyć wszystkie wiadomości?**  
O: `DELETE /api/messages` lub ręcznie `SQL/log.json`

## 📞 Support

Jeśli coś nie działa:

1. Sprawdź czy Node.js jest zainstalowany: `node --version`
2. Sprawdź czy port 3000 jest wolny
3. Usuń `node_modules` i reinstaluj: `npm install`
4. Sprawdź czy serwer wypisuje błędy
5. Otwórz DevTools (F12) i sprawdź Console

## 📝 Wersja

```
Anonymous Chat System v1.0.0
Release Date: 2026-02-05
Status: Stable
```

## 📄 Licencja

MIT - Używaj swobodnie w projektach komercyjnych i niekomercyjnych

---

## 🎯 Następne Kroki

1. **Szybki start?** → [QUICKSTART.md](QUICKSTART.md)
2. **Windows setup?** → [WINDOWS_SETUP.md](WINDOWS_SETUP.md)
3. **Pełna dokumentacja?** → [README.md](README.md)
4. **API details?** → [API.md](API.md)

---

**Gotowe! Zarabiaj pieniądze na swoim chacie! 💬💰**

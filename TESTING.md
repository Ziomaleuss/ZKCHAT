# 🧪 TESTOWANIE SYSTEMU CZATU

Kompletny przewodnik po testowaniu anonimowego systemu czatu.

## Pre-Test Checklist

- [ ] Node.js zainstalowany (`node --version`)
- [ ] npm zainstalowany (`npm --version`)
- [ ] Terminal otwarty w folderze `CHAT APP`
- [ ] Port 3000 jest wolny
- [ ] Przeglądarka otwarta i gotowa

## TEST 1: Instalacja zależności ✅

### Krok 1: Zainstaluj packages
```bash
npm install
```

**Oczekiwany rezultat:**
```
added 52 packages, and audited 53 packages in 45s
```

**Jeśli błąd:** Sprawdź czy npm jest zainstalowany
```bash
npm --version
```

---

## TEST 2: Uruchomienie serwera ✅

### Krok 1: Start server
```bash
npm start
```

**Oczekiwany rezultat:**
```
╔════════════════════════════════════════╗
║   Anonymous Chat Server Running        ║
║   http://localhost:3000                ║
║   Log file: .../SQL/log.json           ║
╚════════════════════════════════════════╝
```

### Krok 2: Weryfikuj że serwer żyje
W nowym terminalu:
```bash
curl http://localhost:3000/api/messages
```

**Oczekiwany rezultat:**
```json
{"messages":[]}
```

---

## TEST 3: Frontend - Otwórz stronę ✅

### Krok 1: Otwórz aplikację
Wpisz w przeglądarce:
```
http://localhost:3000/chat.html
```

**Oczekiwany rezultat:**
- Strona się ładuje
- Widzisz "Anonymous Chat Room"
- Widzisz input field i przycisk "Send"
- Chat box pokazuje "No messages yet..."

### Krok 2: Sprawdź DevTools
Naciśnij `F12`, przejdź do `Console`

**Oczekiwany rezultat:**
- Brak czerwonych błędów
- Możesz zobaczyć logi (jeśli są)

---

## TEST 4: Wyślij wiadomość (Frontend) ✅

### Krok 1: Wpisz wiadomość
Kliknij na input field i wpisz:
```
Hello! This is my first message!
```

### Krok 2: Wyślij (2 sposoby)
- **Opcja A:** Kliknij przycisk "Send"
- **Opcja B:** Naciśnij Enter

**Oczekiwany rezultat:**
1. Wiadomość znika z input field'u
2. W chat box pojawia się wiadomość z:
   - Avatar (kolorowa kulka)
   - Nickname: "Anonymous"
   - Czas: "just now"
   - Text: "Hello! This is my first message!"
3. Wiadomość ma animację slide-in

### Krok 3: Sprawdź czy działa polling
Czekaj 2 sekundy - wiadomość powinna zostać

**Jeśli wiadomość znikła:** Problem z pollingiem API

---

## TEST 5: Sprawdź log.json ✅

### Krok 1: Otwórz plik
Przejdź do: `SQL/log.json`

### Krok 2: Sprawdź zawartość
**Oczekiwany format:**
```json
{
  "messages": [
    {
      "id": 1,
      "nick": "Anonymous",
      "pic": "https://ui-avatars.com/api/?name=Anonymous&background=667eea&color=fff&size=40",
      "text": "Hello! This is my first message!",
      "timestamp": "2026-02-05T14:32:10.123Z"
    }
  ]
}
```

**Sprawdzenia:**
- [ ] Plik zawiera JSON (nie tekst)
- [ ] `messages` jest array'em
- [ ] Twoja wiadomość jest w środku
- [ ] Wszystkie pola są wypełnione
- [ ] `timestamp` to ISO format

---

## TEST 6: API Testing (curl) ✅

### Test 6a: GET wszystkich wiadomości

```bash
curl http://localhost:3000/api/messages
```

**Oczekiwany rezultat:**
```json
{
  "messages": [
    {
      "id": 1,
      "nick": "Anonymous",
      "pic": "...",
      "text": "Hello! This is my first message!",
      "timestamp": "..."
    }
  ]
}
```

### Test 6b: POST nowa wiadomość

```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "nick": "Anonymous",
    "text": "Test message from curl!"
  }'
```

**Oczekiwany rezultat:**
```json
{
  "success": true,
  "message": {
    "id": 2,
    "nick": "Anonymous",
    "pic": "...",
    "text": "Test message from curl!",
    "timestamp": "..."
  }
}
```

**Weryfikacja:** Sprawdź chat.html - nowa wiadomość powinna się pojawić!

### Test 6c: DELETE konkretna wiadomość

```bash
curl -X DELETE http://localhost:3000/api/messages/2
```

**Oczekiwany rezultat:**
```json
{
  "success": true,
  "message": "Message deleted"
}
```

**Weryfikacja:**
1. W przeglądarce wiadomość ID 2 powinna zniknąć
2. W `log.json` powinna być tylko ID 1

### Test 6d: GET statystyki

```bash
curl http://localhost:3000/api/stats
```

**Oczekiwany rezultat:**
```json
{
  "totalMessages": 1,
  "messagesPerUser": {}
}
```

---

## TEST 7: Stress Test (wiele wiadomości) ✅

### Krok 1: Wyślij 10 wiadomości

W przeglądarce wysyłaj po kolei:
```
1. First message
2. Second message
3. Third message
... itd do 10
```

Lub z curl:
```bash
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/messages \
    -H "Content-Type: application/json" \
    -d "{\"nick\":\"Anonymous\",\"text\":\"Message $i\"}"
done
```

**Oczekiwany rezultat:**
- Wszystkie 10 wiadomości w chat box'ie
- Chat box scrolluje do dołu automatycznie
- Każda wiadomość ma inny kolor (gradient)
- `log.json` zawiera 10+ wiadomości

### Krok 2: Sprawdź performance
- [ ] Chat nie "laguje"
- [ ] Scroll jest płynny
- [ ] Brak error'ów w Console

---

## TEST 8: Responsywność (Mobile) ✅

### Krok 1: Otwórz DevTools responsive mode
- Chrome: `Ctrl+Shift+M`
- Firefox: `Ctrl+Shift+M`

### Krok 2: Zmień viewport
Wybierz:
- iPhone 12
- iPad
- Custom resolution (375x667)

### Krok 3: Test funkcjonalności
- [ ] Wiadomości widoczne
- [ ] Input field się nie rozjeżdża
- [ ] Send button widoczny
- [ ] Avatar wyświetla się prawidłowo
- [ ] Scroll działa

---

## TEST 9: Błędy i Edge Cases ✅

### Test 9a: Pusta wiadomość

Spróbuj wysłać pusty tekst
```
[klikasz Send bez wpisania czegokolwiek]
```

**Oczekiwany rezultat:**
- Notification: "Please type a message!"
- Wiadomość NIE zostaje wysłana
- log.json się NIE zmienia

### Test 9b: Spacja

Wpisz tylko spacje i wyślij:
```
"     "
```

**Oczekiwany rezultat:**
- Wiadomość NIE zostaje wysłana (tekst jest trimmed)
- Notification pojawia się

### Test 9c: Długi tekst

Wpisz bardzo długą wiadomość (500+ znaków):
```
Lorem ipsum dolor sit amet, consectetur adipiscing elit...
```

**Oczekiwany rezultat:**
- Wiadomość zostaje wysłana
- Text wrap się prawidłowo
- Bubble nie robi się zbyt duży

### Test 9d: Znaki specjalne

Wpisz znaki specjalne:
```
!@#$%^&*()_+{}:"<>?|~`
```

**Oczekiwany rezultat:**
- Wiadomość zostaje wysłana
- Znaki wyświetlają się prawidłowo
- Brak error'ów

---

## TEST 10: Persistence (Restart server) ✅

### Krok 1: Wyślij 3 wiadomości
```
1. Message before restart
2. Another message
3. Final test message
```

### Krok 2: Stop server
W terminalu gdzie działa serwer:
```
Ctrl+C
```

### Krok 3: Sprawdź log.json
Powinien zawierać 3 wiadomości

### Krok 4: Restart server
```bash
npm start
```

### Krok 5: Otwórz chat.html w przeglądarce

**Oczekiwany rezultat:**
- Wszystkie 3 wiadomości nadal są widoczne!
- Dane nie zostały utracone
- log.json jest taki sam

---

## TEST 11: Multiple Tabs ✅

### Krok 1: Otwórz chat.html w 2 tab'ach
- Tab 1: `http://localhost:3000/chat.html`
- Tab 2: `http://localhost:3000/chat.html` (nowa karta)

### Krok 2: Wyślij wiadomość w Tab 1

**Oczekiwany rezultat:**
- Tab 1: Wiadomość pojawia się natychmiast
- Tab 2: Wiadomość pojawia się w ciągu 2 sekund (polling)
- Oba tab'y pokazują tę samą wiadomość

### Krok 3: Wyślij wiadomość w Tab 2

**Oczekiwany rezultat:**
- Tab 2: Wiadomość pojawia się natychmiast
- Tab 1: Wiadomość pojawia się w ciągu 2 sekund
- Obie wiadomości w log.json

---

## TEST 12: Network - DevTools Network Tab ✅

### Krok 1: Otwórz DevTools
F12 → Network tab

### Krok 2: Wyślij wiadomość

**Oczekiwany rezultat:**
Powinieneś zobaczyć:
1. POST `/api/messages` (201 Created)
2. GET `/api/messages` (200 OK) - polling

Każdy request:
- [ ] Status: 200 lub 201
- [ ] Response JSON jest valid
- [ ] Czas response < 100ms

---

## TEST 13: Kolory i Animacje ✅

### Test 13a: Kolory message bubbles

Wyślij 6 wiadomości po kolei

**Oczekiwany rezultat:**
```
Msg 1: Purpurowy bubble (gradient)
Msg 2: Pomarańczowy bubble
Msg 3: Niebieski bubble
Msg 4: Purpurowy bubble (znowu)
Msg 5: Pomarańczowy
Msg 6: Niebieski
```

Każdy bubble ma inny kolor na podstawie `nth-child`

### Test 13b: Animacje

**Oczekiwany rezultat:**
- [ ] Wiadomości slide'ują od dołu (animation: slideInMessage)
- [ ] Avatar ma shadow
- [ ] Hover effect na bubble'ie
- [ ] Timestamp jest mały i szary

---

## TEST 14: Browser Compatibility ✅

Testuj na:

### Chrome
```
Version: 121+
Expected: ✅ Wszystko działa
```

### Firefox
```
Version: 123+
Expected: ✅ Wszystko działa
```

### Edge
```
Version: 121+
Expected: ✅ Wszystko działa
```

### Safari (macOS/iOS)
```
Expected: ✅ Wszystko działa (jeśli dostępne)
```

---

## TEST 15: File System ✅

### Krok 1: Sprawdź strukturę folderów

```
CHAT APP/
├── server.js           [exists]
├── package.json        [exists]
├── chat.html           [exists]
├── JS/
│   └── chat-system.js  [exists]
├── CSS/
│   ├── chat.css        [exists]
│   └── style.css       [exists]
└── SQL/
    ├── log.json        [exists]
    └── log.example.json [exists]
```

### Krok 2: Sprawdzenie permissions
- [ ] log.json można czytać
- [ ] log.json można pisać
- [ ] server.js można uruchomić

---

## FINAL CHECKLIST ✅

- [ ] Serwer się uruchamia bez błędów
- [ ] Strona się ładuje
- [ ] Wiadomości się wysyłają
- [ ] Wiadomości są w log.json
- [ ] API endpoints działają
- [ ] Polling co 2 sekundy działa
- [ ] Animacje są płynne
- [ ] Responsive design działa
- [ ] Brak error'ów w Console
- [ ] Multiple tabs synchronizują się
- [ ] Dane persist po restarcie
- [ ] Kolory są prawidłowe
- [ ] Avatary się wyświetlają

## Score

Jeśli przeszedłeś WSZYSTKIE TESTY: **100% READY** 🎉

---

## Raportowanie Błędów

Jeśli coś nie przeszło:

1. **Skopiuj błąd z Console (F12)**
2. **Sprawdź terminal serwera** - czy są błędy?
3. **Sprawdź Network tab** - status code?
4. **Sprawdź log.json** - czy plik jest valid JSON?

---

## Performance Targets

| Metric | Target | Twój test |
|--------|--------|-----------|
| Page Load | < 1s | __ |
| Send Message | < 200ms | __ |
| Poll Update | < 500ms | __ |
| Animation | 60fps | __ |

---

**Powodzenia w testach! 🧪**

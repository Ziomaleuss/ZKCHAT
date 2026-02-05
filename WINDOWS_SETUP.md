# 🖥️ INSTRUKCJA INSTALACJI NA WINDOWS

## Wymagania Wstępne

- Windows 10+ (najlepiej Windows 11)
- Administrator dostęp
- Przeglądarka (Chrome, Edge, Firefox)

## Krok 1: Instalacja Node.js

### Opcja A: Automatycznie (Polecane)

```powershell
# Otwórz PowerShell jako Administrator
choco install nodejs
```

Jeśli nie masz `choco`:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Opcja B: Ręcznie

1. Przejdź do https://nodejs.org/
2. Pobierz LTS (Long Term Support)
3. Uruchom instalator
4. Następnie, następnie, zainstaluj

### Weryfikacja instalacji

```powershell
node --version
npm --version
```

Powinieneś zobaczyć numery wersji.

---

## Krok 2: Nawiguj do folderu projektu

```powershell
cd "C:\Users\igord\Documents\GitHub\CHAT APP"
```

Lub use Tab do autokompletacji ścieżki.

---

## Krok 3: Zainstaluj zależności

```powershell
npm install
```

Będzie trwać ~30-60 sekund. Powinieneś zobaczyć:
```
added 52 packages, and audited 53 packages in 45s
```

---

## Krok 4: Uruchom serwer

### Development (z auto-reload)
```powershell
npm run dev
```

### Production
```powershell
npm start
```

Powinieneś zobaczyć:
```
╔════════════════════════════════════════╗
║   Anonymous Chat Server Running        ║
║   http://localhost:3000                ║
║   Log file: C:\...\SQL\log.json        ║
╚════════════════════════════════════════╝
```

---

## Krok 5: Otwórz aplikację

Kliknij lub wpisz w przeglądarkę:
```
http://localhost:3000/chat.html
```

🎉 **GOTOWE!** Czat powinien być uruchomiony!

---

## Rozwiązywanie Problemów

### ❌ "npm: command not found"

**Przyczyna:** Node.js nie zainstalowany  
**Rozwiązanie:** Zainstaluj Node.js (Krok 1)

### ❌ "Port 3000 already in use"

**Przyczyna:** Inny program używa portu  
**Rozwiązanie 1:** Zamknij inne aplikacje Node.js

**Rozwiązanie 2:** Zmień port w `server.js`:
```javascript
// Linia 5:
const PORT = 3001; // Lub inny wolny port
```

Potem uruchom ponownie `npm start`

### ❌ "Cannot find module 'express'"

**Przyczyna:** Zależności nie zainstalowane  
**Rozwiązanie:**
```powershell
npm install
npm start
```

### ❌ Połączenie odrzucone na localhost:3000

**Przyczyna:** Serwer nie działa  
**Rozwiązanie:**
1. Upewnij się że uruchomiłeś `npm start`
2. Sprawdź czy w PowerShell nie ma błędu
3. Poczekaj 3-5 sekund na start

### ❌ Wiadomości się nie wysyłają

**Debug:**

1. Otwórz DevTools (F12 w przeglądarce)
2. Przejdź do `Console` tab
3. Sprawdzić czy są czerwone błędy
4. Przejdź do `Network` tab
5. Wyślij wiadomość
6. Sprawdzić czy POST request pojawi się w Network

Jeśli request pokazuje błąd, problem jest w API.

---

## Polecane narzędzia

### VSCode Extensions
```powershell
# Zainstaluj VSCode
choco install vscode

# Przydatne extensions:
# - REST Client (do testowania API)
# - Thunder Client
# - JSON Formatter
```

### Postman (do testowania API)
```powershell
choco install postman
```

---

## Zaawansowane

### Uruchamianie w tle

Aby serwer działał w tle nawet po zamknięciu PowerShell:

```powershell
# Zainstaluj PM2
npm install -g pm2

# Uruchom z PM2
pm2 start server.js

# Automatycznie restart po reboot
pm2 startup
pm2 save
```

### Logowanie

Wszystkie logi serwera pojawią się w PowerShell i w `SQL/log.json`.

```powershell
# Realtime logs (jeśli używasz PM2)
pm2 logs server
```

### Customowy PORT

```powershell
# Uruchom na konkretnym porcie
$env:PORT=3001; npm start
```

---

## Szybkie komandy

```powershell
# Status NPM
npm list

# Update dependencies
npm update

# Reinstaluj wszystko
rm -r node_modules
npm install

# Wyczyść cache
npm cache clean --force

# Sprawdź vulnerabilities
npm audit

# Napraw security issues
npm audit fix
```

---

## Firewall (jeśli nie działał localhost)

1. Windows Security → Firewall & network protection
2. Allow an app through firewall
3. Add Node.js do listy
4. Zrestart serwer

---

## Backup danych

Ważne - backup `SQL/log.json`:

```powershell
# Backup do folderu
Copy-Item "SQL\log.json" "SQL\log.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
```

---

## Zakonczenie serwera

W PowerShell gdzie działa serwer:
```
Ctrl + C
```

Serwer się wyłączy.

---

## Wsparcie

Jeśli coś nie działa:
1. Sprawdź czy Node.js jest zainstalowany
2. Usuń `node_modules` i reinstaluj
3. Sprawdź port 3000 jest wolny
4. Restartuj PowerShell

---

**Powodzenia! 🚀 Chat powinien być gotowy.**

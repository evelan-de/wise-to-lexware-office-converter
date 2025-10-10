# 🚀 Installation - Wise zu LexOffice Konverter

## Für nicht-technische Nutzer

### Option A: Web-Version verwenden (EMPFOHLEN ✨)

Die Web-Version funktioniert in jedem Browser ohne Installation:

1. **Doppelklicken** Sie auf `WiseLexOfficeWeb.command`
2. **Browser öffnet sich** automatisch
3. **Fertig!** Sie können jetzt Dateien konvertieren

Falls der Browser sich nicht öffnet, gehen Sie manuell zu: http://localhost:8888

### Option B: Kommandozeilen-Version verwenden

Für technisch versierte Nutzer:

```bash
python3 wise_to_lexoffice.py ihre_wise_export.csv
```

### Option C: Desktop-App installieren (benötigt tkinter)

#### Schritt 1: Python mit tkinter installieren

1. Öffnen Sie **Terminal** (zu finden unter Programme → Dienstprogramme)
2. Geben Sie ein: `python3 --version`
3. Drücken Sie Enter

**Falls Python nicht installiert ist:**
- Besuchen Sie [python.org](https://www.python.org/downloads/)
- Laden Sie Python für macOS herunter
- Führen Sie das Installationsprogramm aus

### Schritt 2: App einrichten

1. **Laden Sie den Projektordner herunter** (falls noch nicht geschehen)

2. **Öffnen Sie Terminal** und navigieren Sie zum Projektordner:
   ```bash
   cd ~/Downloads/wise-lexoffice-import
   ```
   (Passen Sie den Pfad an, wo Sie den Ordner gespeichert haben)

3. **Führen Sie das Setup aus:**
   ```bash
   python3 setup_mac_app.py
   ```

4. **Wählen Sie Option 2** (Einfachen Launcher erstellen)
   - Tippen Sie `2` und drücken Sie Enter

### Schritt 3: App verwenden

Nach der Installation finden Sie im Ordner eine Datei:
**`WiseLexOfficeKonverter.command`**

- **Doppelklicken** Sie auf diese Datei zum Starten der App
- Falls eine Sicherheitswarnung erscheint:
  1. Gehen Sie zu **Systemeinstellungen** → **Sicherheit**
  2. Klicken Sie auf **Trotzdem öffnen**

## 🎯 So verwenden Sie die App

1. **App starten:** Doppelklick auf `WiseLexOfficeKonverter.command`

2. **Wise CSV importieren:**
   - Ziehen Sie Ihre Wise CSV-Datei ins Fenster ODER
   - Klicken Sie auf den Bereich zum Auswählen

3. **Konvertieren:** Klicken Sie auf den blauen "Konvertieren" Button

4. **Fertig!** Die konvertierte Datei wird automatisch gespeichert

## 📍 Tipp für einfachen Zugriff

Ziehen Sie `WiseLexOfficeKonverter.command` in Ihren **Programme-Ordner** oder auf den **Schreibtisch** für schnellen Zugriff.

## ❓ Hilfe bei Problemen

### Die App startet nicht
- Stellen Sie sicher, dass Python 3 installiert ist
- Rechtsklick auf die Datei → "Öffnen" (umgeht Sicherheitssperre)

### "Berechtigung verweigert" Fehler
Führen Sie im Terminal aus:
```bash
chmod +x WiseLexOfficeKonverter.command
```

### Andere Probleme
- Starten Sie Ihren Mac neu
- Stellen Sie sicher, dass die Wise CSV-Datei korrekt ist

## 🔄 Updates

Um die App zu aktualisieren, laden Sie einfach die neueste Version herunter und führen Sie das Setup erneut aus.
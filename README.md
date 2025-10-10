# Wise zu LexOffice CSV Konverter

🚀 **Einfache Web-App** zum Konvertieren von Wise CSV-Exporten für LexOffice - keine Installation erforderlich!

## Funktionen

- ✅ Konvertiert Datumsformat (29-08-2025 → 29.08.2025)
- ✅ Konvertiert Zahlenformat (1318.79 → 1318,79)
- ✅ Ordnet Transaktionsparteien korrekt zu
- ✅ Kombiniert Beschreibung und Zahlungsreferenz
- ✅ Fügt Fremdbetrag und Wise-ID als Zusatzinfo hinzu

## 🎯 Schnellstart (Web-Version)

1. **Doppelklick** auf `WiseLexOfficeWeb.command`
2. **Browser öffnet sich** mit der App
3. **CSV hochladen** und konvertieren
4. **Fertig!** Datei wird automatisch heruntergeladen

## Alternative Verwendung (Kommandozeile)

### 1. Wise-Transaktionen exportieren

1. Loggen Sie sich in Ihr Wise-Konto ein
2. Navigieren Sie zu **Kontostand** → **Kontoauszüge**
3. Wählen Sie den gewünschten Zeitraum
4. Exportieren Sie als **CSV**

### 2. Konvertierung durchführen

```bash
# Standard-Konvertierung (erstellt lexoffice_import_<timestamp>.csv)
python3 wise_to_lexoffice.py wise_export.csv

# Mit spezifischer Ausgabedatei
python3 wise_to_lexoffice.py wise_export.csv -o mein_import.csv

# Hilfe anzeigen
python3 wise_to_lexoffice.py -h
```

### 3. In LexOffice importieren

1. Öffnen Sie LexOffice
2. Navigieren Sie zu **Banking** → **Import**
3. Wählen Sie **CSV-Import**
4. Laden Sie die konvertierte Datei hoch

## Datenfeld-Mapping

| Wise Export | LexOffice Import |
|------------|------------------|
| Date | Buchungstag, Valuta |
| Amount | Betrag (mit Komma) |
| Payer Name / Payee Name | Auftraggeber/Empfänger |
| Description + Payment Reference | Verwendungszweck |
| Exchange To Amount + TransferWise ID | Zusatzinfo |

## Beispiel-Ausgabe

**Wise Export (Original):**
```
Date: 29-08-2025
Amount: -1318.79 EUR
Description: Geld überwiesen an Person1
Payment Reference: Invoice 054
Exchange To Amount: 87500.00 PHP
```

**LexOffice Import (Konvertiert):**
```
Buchungstag: 29.08.2025
Betrag: -1318,79
Verwendungszweck: Geld überwiesen an Person1 | Ref: Invoice 054
Zusatzinfo: Fremdbetrag: 87500,00 PHP | Wise ID: TRANSFER-123456
```

## Hinweise

- Bei **DEBIT-Transaktionen** wird "Kontoinhaber" als Auftraggeber gesetzt
- Bei **CREDIT-Transaktionen** wird "Kontoinhaber" als Empfänger gesetzt
- Die Ausgabedatei verwendet **Semikolon (;)** als Trennzeichen
- Alle Beträge werden mit **Komma** als Dezimaltrennzeichen formatiert
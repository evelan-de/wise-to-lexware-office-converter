import { BlogArticle } from '@/types/blog';

export const blogArticles: BlogArticle[] = [
  {
    slug: 'wise-kontoauszug-lexware-office-importieren',
    title: 'Wise Kontoauszug in Lexware Office importieren: Schritt-für-Schritt Anleitung',
    description: 'Lernen Sie, wie Sie Ihren Wise Kontoauszug als CSV exportieren und in Lexware Office importieren. Mit unserem kostenlosen Konverter-Tool und detaillierter Anleitung.',
    publishedAt: '2024-11-15',
    author: {
      name: 'Evelan GmbH',
      url: 'https://evelan.de',
    },
    keywords: [
      'Wise Kontoauszug',
      'Lexware Office Import',
      'CSV Konverter',
      'Wise Export',
      'Bankimport',
      'Buchhaltung',
      'TransferWise',
    ],
    category: 'tutorial',
    readingTime: 8,
    featured: true,
    content: `
## Warum Wise-Transaktionen in Lexware Office importieren?

Als Freelancer oder Selbstständiger mit internationalen Kunden ist Wise oft die erste Wahl für Zahlungsempfang und Überweisungen. Die niedrigen Gebühren und echten Wechselkurse machen es zur idealen Lösung für grenzüberschreitende Zahlungen.

Allerdings bietet Lexware Office keine direkte Bankanbindung zu Wise an. Das bedeutet, Sie müssen Ihre Wise-Transaktionen manuell importieren – und genau hier kommt unser kostenloser Konverter ins Spiel.

## Das Problem: Unterschiedliche CSV-Formate

Wise exportiert Transaktionen im CSV-Format, aber dieses Format ist nicht direkt mit Lexware Office kompatibel:

| Wise-Format | Lexware Office-Format |
|-------------|----------------------|
| Datum: 29-09-2024 | Datum: 29.09.2024 |
| Betrag: 1234.56 | Betrag: 1234,56 |
| Trennzeichen: Komma | Trennzeichen: Semikolon |

Unser Konverter übernimmt diese Transformation automatisch.

## Schritt 1: Wise CSV-Export erstellen

1. Melden Sie sich bei **Wise** an
2. Klicken Sie auf **Transaktionen** → **Kontoauszüge und Berichte**
3. Wählen Sie **Auszüge** → **Benutzerdefiniert**
4. Wählen Sie den gewünschten Zeitraum
5. Wählen Sie **CSV** als Format
6. Klicken Sie auf **Kontoauszug erstellen**

**Wichtig:** Wise erlaubt maximal 365 Tage pro Export. Für längere Zeiträume müssen Sie mehrere Exporte erstellen.

## Schritt 2: CSV mit unserem Konverter umwandeln

1. Öffnen Sie unseren [Wise zu Lexware Office Konverter](/)
2. Ziehen Sie Ihre CSV-Datei in den Upload-Bereich
3. Das Tool validiert automatisch Ihre Datei
4. Prüfen Sie die Vorschau Ihrer Transaktionen
5. Die konvertierte Datei wird automatisch heruntergeladen

### Was unser Konverter macht:

- ✅ Konvertiert das Datumsformat (DD-MM-YYYY → DD.MM.YYYY)
- ✅ Wandelt Beträge ins deutsche Format um (1234.56 → 1234,56)
- ✅ Ändert das Trennzeichen (Komma → Semikolon)
- ✅ Erstellt die korrekte Spaltenstruktur für Lexware Office
- ✅ Schützt vor CSV-Injection-Angriffen

## Schritt 3: In Lexware Office importieren

1. Öffnen Sie **Lexware Office**
2. Gehen Sie zu **Banking** → **Konten**
3. Erstellen Sie ein **Offline-Konto** (falls noch nicht vorhanden)
4. Klicken Sie auf die **drei Punkte** → **Umsätze importieren**
5. Laden Sie die konvertierte CSV-Datei hoch
6. Ordnen Sie die Spalten zu (wird meist automatisch erkannt)
7. Bestätigen Sie den Import

## Wichtiger Hinweis zu Duplikaten

**Lexware Office prüft beim CSV-Import nicht auf Duplikate!**

Führen Sie daher Buch darüber, welche Zeiträume Sie bereits importiert haben. Unser Tipp:

1. Notieren Sie das Datum der letzten importierten Transaktion
2. Exportieren Sie bei Wise nur Transaktionen ab dem Folgetag
3. So vermeiden Sie doppelte Buchungen

## Vorteile unseres Konverters

- **100% kostenlos** – keine versteckten Kosten
- **Datenschutz** – alle Daten bleiben in Ihrem Browser
- **Keine Registrierung** – sofort nutzbar
- **Open Source** – transparent und vertrauenswürdig

## Fazit

Mit unserem kostenlosen Wise zu Lexware Office Konverter sparen Sie Zeit und vermeiden Fehler beim manuellen Anpassen der CSV-Dateien. Die Konvertierung dauert nur Sekunden und Ihre Daten verlassen niemals Ihren Browser.

[Jetzt Wise-Transaktionen konvertieren →](/)
    `,
  },
  {
    slug: 'wise-geschaeftskonto-freelancer-internationale-kunden',
    title: 'Wise für Freelancer: Das ideale Geschäftskonto für internationale Kunden',
    description: 'Erfahren Sie, warum Wise das beste Geschäftskonto für deutsche Freelancer mit internationalen Kunden ist. Niedrige Gebühren, echte Wechselkurse und Multi-Währungs-Konten.',
    publishedAt: '2024-11-10',
    author: {
      name: 'Evelan GmbH',
      url: 'https://evelan.de',
    },
    keywords: [
      'Wise Geschäftskonto',
      'Freelancer Deutschland',
      'internationale Zahlungen',
      'Multi-Währung',
      'TransferWise Business',
      'Freelancer Konto',
    ],
    category: 'guide',
    readingTime: 10,
    content: `
## Warum Freelancer ein spezielles Konto für internationale Zahlungen brauchen

Als Freelancer in Deutschland mit Kunden aus dem Ausland stehen Sie vor besonderen Herausforderungen:

- Hohe Gebühren bei internationalen Überweisungen
- Ungünstige Wechselkurse bei traditionellen Banken
- Lange Wartezeiten bis das Geld ankommt
- Komplizierte SWIFT-Überweisungen

Hier kommt Wise ins Spiel – eine moderne Lösung, die speziell für internationale Zahlungen optimiert ist.

## Was ist Wise?

Wise (früher TransferWise) ist ein Finanzdienstleister mit Sitz in London, der internationale Überweisungen zu echten Wechselkursen anbietet. Mit über 14 Millionen Kunden weltweit und monatlichen Transfers von über 16 Milliarden Dollar ist Wise eine etablierte Alternative zu traditionellen Banken.

## Vorteile von Wise für Freelancer

### 1. Echte Wechselkurse ohne Aufschlag

Traditionelle Banken verstecken ihre Gebühren oft im Wechselkurs. Wise verwendet den echten Mittelkurs (mid-market rate) – den gleichen Kurs, den Sie bei Google finden.

**Beispielrechnung bei 1.000 USD → EUR:**

| Anbieter | Wechselkurs | Sie erhalten |
|----------|-------------|--------------|
| Wise | 1,08 (echt) | ~925 EUR |
| Traditionelle Bank | 1,05 (mit Aufschlag) | ~857 EUR |

**Ersparnis: ~68 EUR pro 1.000 USD!**

### 2. Multi-Währungs-Konto

Mit Wise erhalten Sie lokale Kontodaten in über 10 Währungen:

- **EUR** – Europäische IBAN
- **USD** – Amerikanische Kontodaten (ACH/Wire)
- **GBP** – Britische Kontodaten
- **AUD, CAD, NZD** und weitere

Das bedeutet: Ihr US-Kunde überweist auf Ihr US-Konto in Dollar, und Sie zahlen nur dann Gebühren, wenn Sie das Geld in Euro umtauschen möchten.

### 3. Keine monatlichen Grundgebühren

Anders als viele Geschäftskonten hat Wise keine monatlichen Gebühren. Sie zahlen nur für tatsächlich durchgeführte Transaktionen.

### 4. Schnelle Zahlungen

Internationale Überweisungen sind oft innerhalb von 1-2 Werktagen abgeschlossen – manchmal sogar innerhalb von Stunden.

## Wise Business vs. Wise Personal

Für Freelancer empfehlen wir das **Wise Business**-Konto:

| Feature | Personal | Business |
|---------|----------|----------|
| Multi-Währung | ✅ | ✅ |
| Lokale Kontodaten | ✅ | ✅ |
| Rechnungsstellung | ❌ | ✅ |
| Team-Zugang | ❌ | ✅ |
| API-Zugang | ❌ | ✅ |
| Batch-Zahlungen | ❌ | ✅ |

## Wise in der Buchhaltung mit Lexware Office

Da Wise keine direkte Integration mit Lexware Office bietet, müssen Sie Ihre Transaktionen manuell importieren. Unser kostenloser [Wise zu Lexware Office Konverter](/) macht diesen Prozess einfach:

- Exportieren Sie Ihre Transaktionen als CSV aus Wise
- Laden Sie die Datei in unseren Konverter
- Importieren Sie die konvertierte Datei in Lexware Office

So haben Sie alle Ihre Wise-Transaktionen sauber in Ihrer Buchhaltung.

## Fazit

Wise ist für Freelancer mit internationalen Kunden nahezu unverzichtbar. Die niedrigen Gebühren, echten Wechselkurse und lokalen Kontodaten in verschiedenen Währungen machen es zur idealen Lösung für grenzüberschreitende Zahlungen.

Mit unserem kostenlosen Konverter wird auch die Buchhaltung mit Lexware Office zum Kinderspiel.

[Wise-Transaktionen für Lexware Office konvertieren →](/)
    `,
  },
  {
    slug: 'lexware-office-offline-konto-drittbanken-neobanken',
    title: 'Offline-Konten in Lexware Office: So binden Sie Drittbanken und Neobanken ein',
    description: 'Anleitung zum Einrichten von Offline-Konten in Lexware Office für Banken ohne direkte Anbindung wie Wise, N26, Revolut oder ausländische Banken.',
    publishedAt: '2024-11-05',
    author: {
      name: 'Evelan GmbH',
      url: 'https://evelan.de',
    },
    keywords: [
      'Lexware Office Offline-Konto',
      'Drittbank',
      'Neobank',
      'N26 Lexware',
      'Revolut Buchhaltung',
      'Wise Lexware Office',
      'CSV Import',
    ],
    category: 'tutorial',
    readingTime: 7,
    content: `
## Warum brauche ich ein Offline-Konto in Lexware Office?

Lexware Office bietet automatische Bankanbindungen für über 4.000 Banken in Deutschland. Aber was, wenn Ihre Bank nicht dabei ist? Typische Beispiele:

- **Wise** – Keine direkte Anbindung verfügbar
- **Revolut** – Eingeschränkte Unterstützung
- **Ausländische Banken** – Meist keine Anbindung
- **Spezielle Geschäftskonten** – Je nach Anbieter

In diesen Fällen erstellen Sie ein **Offline-Konto** und importieren Ihre Transaktionen manuell per CSV.

## Offline-Konto in Lexware Office anlegen

### Schritt 1: Neues Konto erstellen

1. Öffnen Sie Lexware Office
2. Navigieren Sie zu **Finanzen** → **Konten**
3. Klicken Sie auf **+ Konto hinzufügen**

### Schritt 2: Offline-Konto wählen

1. Wählen Sie **Konto ohne Anbindung anlegen**
2. Klicken Sie auf **Weiter**

### Schritt 3: Kontodaten eingeben

Geben Sie folgende Informationen ein:

- **Kontoname** – z.B. "Wise EUR Geschäftskonto"
- **IBAN** – Ihre Wise IBAN (beginnt mit DE oder BE)
- **Währung** – EUR (oder die Hauptwährung des Kontos)
- **Eröffnungssaldo** – Der aktuelle Kontostand

**Tipp:** Verwenden Sie aussagekräftige Namen, besonders wenn Sie mehrere Konten haben.

## CSV-Import einrichten

Nach dem Erstellen des Offline-Kontos können Sie Transaktionen per CSV importieren.

### So importieren Sie CSV-Dateien:

1. Klicken Sie bei Ihrem Offline-Konto auf die **drei Punkte**
2. Wählen Sie **Umsätze importieren**
3. Laden Sie Ihre CSV-Datei hoch
4. Ordnen Sie die Spalten zu (einmalig)
5. Bestätigen Sie den Import

### Erforderliche Spalten für Lexware Office:

| Spalte | Beschreibung | Beispiel |
|--------|--------------|----------|
| Buchungstag | Datum der Transaktion | 29.09.2024 |
| Betrag | Positive oder negative Zahl | -123,45 |
| Verwendungszweck | Beschreibung | Rechnung 2024-001 |

Optional können Sie auch Auftraggeber/Empfänger hinzufügen.

## Das Problem mit unterschiedlichen CSV-Formaten

Jede Bank exportiert CSV-Dateien in einem anderen Format:

| Bank | Datumsformat | Dezimaltrennzeichen | Spaltentrennzeichen |
|------|--------------|---------------------|---------------------|
| Wise | DD-MM-YYYY | Punkt | Komma |
| N26 | YYYY-MM-DD | Punkt | Komma |
| Revolut | DD/MM/YYYY | Punkt | Komma |
| Lexware Office | DD.MM.YYYY | Komma | Semikolon |

Bevor Sie importieren können, müssen Sie die CSV-Datei konvertieren.

## Lösung: Automatische Konvertierung

Für **Wise** bieten wir einen kostenlosen Online-Konverter:

[Wise zu Lexware Office Konverter →](/)

Der Konverter:
- Wandelt das Datumsformat automatisch um
- Konvertiert Beträge ins deutsche Format
- Erstellt die richtige Spaltenstruktur
- Funktioniert direkt im Browser (keine Daten werden hochgeladen)

## Tipps für die regelmäßige Nutzung

### 1. Fester Rhythmus

Importieren Sie Transaktionen in regelmäßigen Abständen (z.B. wöchentlich oder monatlich). So behalten Sie den Überblick.

### 2. Duplikate vermeiden

**Wichtig:** Lexware Office prüft nicht auf Duplikate! Führen Sie Buch darüber, welche Zeiträume Sie bereits importiert haben.

Unser Tipp: Erstellen Sie eine einfache Tabelle:

| Konto | Letzter Import | Bis Datum |
|-------|----------------|-----------|
| Wise EUR | 01.11.2024 | 31.10.2024 |
| Wise USD | 01.11.2024 | 31.10.2024 |

### 3. Kategorisierung nutzen

Nach dem Import können Sie Transaktionen in Lexware Office kategorisieren und mit Belegen verknüpfen. Das erleichtert die spätere Steuererklärung.

## Vorteile von Offline-Konten

- ✅ **Flexibilität** – Jede Bank nutzbar
- ✅ **Kontrolle** – Sie bestimmen, was importiert wird
- ✅ **Datenschutz** – Keine permanente Bankverbindung nötig
- ✅ **Multi-Währung** – Separate Konten für verschiedene Währungen

## Fazit

Offline-Konten in Lexware Office sind die perfekte Lösung für Banken ohne direkte Anbindung. Mit dem richtigen Konverter (wie unserem Wise-Tool) wird der CSV-Import zum Kinderspiel.

[Jetzt Wise-Transaktionen konvertieren →](/)
    `,
  },
  {
    slug: 'internationale-zahlungen-freelancer-buchhaltung',
    title: 'Internationale Zahlungen als Freelancer: Buchhaltung richtig organisieren',
    description: 'Praktische Tipps für deutsche Freelancer zur Organisation internationaler Zahlungen. Zahlungsmethoden, Währungsmanagement und Buchhaltung mit Lexware Office.',
    publishedAt: '2024-10-28',
    author: {
      name: 'Evelan GmbH',
      url: 'https://evelan.de',
    },
    keywords: [
      'internationale Zahlungen',
      'Freelancer Buchhaltung',
      'Währungsumrechnung',
      'Wise Freelancer',
      'Lexware Office',
      'Multi-Währung',
    ],
    category: 'guide',
    readingTime: 8,
    content: `
## Die Herausforderung internationaler Zahlungen

Als Freelancer in Deutschland mit internationalen Kunden stehen Sie vor praktischen Herausforderungen:

- Welche Zahlungsmethode ist die günstigste?
- Wie manage ich verschiedene Währungen?
- Wie dokumentiere ich Wechselkurse?
- Wie halte ich meine Buchhaltung übersichtlich?

Dieser Leitfaden gibt praktische Tipps zur Organisation.

## Zahlungsmethoden im Vergleich

### Überblick der Optionen

| Methode | Vorteile | Nachteile |
|---------|----------|-----------|
| **Wise** | Niedrige Gebühren, echte Kurse, lokale Kontodaten | Keine direkte Lexware-Anbindung |
| **PayPal** | Weit verbreitet, schnell | Hohe Gebühren (ca. 3-4%) |
| **SWIFT-Überweisung** | Klassisch, zuverlässig | Hohe Gebühren, langsam |
| **Stripe** | Für wiederkehrende Zahlungen | Gebühren, Einrichtungsaufwand |

### Warum Wise für Freelancer ideal ist

Wise bietet lokale Bankverbindungen in über 10 Ländern:

- US-Kunden überweisen auf Ihr US-Konto
- UK-Kunden auf Ihr UK-Konto
- EU-Kunden auf Ihre EUR-IBAN

Sie zahlen nur Gebühren, wenn Sie Währungen umtauschen möchten.

### Gebührenvergleich bei 1.000 USD

| Anbieter | Typische Gebühren | Sie erhalten ca. |
|----------|-------------------|------------------|
| Wise | ~5 EUR | ~920 EUR |
| PayPal | ~35 EUR | ~890 EUR |
| Bank (SWIFT) | ~25-50 EUR | ~875 EUR |

## Währungsmanagement

### Dokumentation der Wechselkurse

Bei Zahlungen in Fremdwährung sollten Sie den Wechselkurs dokumentieren:

- **Wise** zeigt bei jeder Transaktion den exakten Kurs
- Speichern Sie Screenshots oder PDF-Belege
- Notieren Sie Datum und Kurs in Ihrer Buchhaltung

### Praktischer Workflow

- Zahlungen in der Originalwährung empfangen
- Nur bei Bedarf in Euro umtauschen
- Wechselkurs bei Umtausch dokumentieren

## Buchhaltung mit Lexware Office organisieren

### Separate Konten anlegen

Für jede Währung/Bank ein eigenes Konto in Lexware Office:

- Wise EUR Geschäftskonto
- Wise USD Konto
- PayPal EUR

### Regelmäßiger Import

- Wöchentlich oder monatlich Transaktionen exportieren
- Mit unserem [Wise Konverter](/) umwandeln
- In Lexware Office importieren
- Transaktionen kategorisieren

### Belege verknüpfen

Verknüpfen Sie Zahlungseingänge mit den entsprechenden Rechnungen. So haben Sie alles sauber dokumentiert.

## Checkliste für internationale Zahlungen

### Bei der Rechnungsstellung

- [ ] Internationale Bankverbindung angegeben (IBAN/BIC oder lokale Details)
- [ ] Währung klar ausgewiesen
- [ ] Zahlungsziel definiert

### Bei Zahlungseingang

- [ ] Wechselkurs dokumentiert
- [ ] Transaktion in Buchhaltung erfasst
- [ ] Beleg gespeichert

### Regelmäßig

- [ ] Transaktionen in Lexware Office importieren
- [ ] Kontenabgleich durchführen
- [ ] Belege verknüpfen

## Fazit

Mit den richtigen Tools ist die Verwaltung internationaler Zahlungen gut zu bewältigen. Wise als Zahlungsanbieter und Lexware Office als Buchhaltungssoftware sind eine praktische Kombination für Freelancer.

Mit unserem kostenlosen Konverter wird der regelmäßige Import Ihrer Wise-Transaktionen zum Kinderspiel.

[Wise-Transaktionen für Lexware Office konvertieren →](/)
    `,
  },
  {
    slug: 'csv-import-lexware-office-fehler-vermeiden',
    title: 'CSV-Import in Lexware Office: Häufige Fehler und wie Sie sie vermeiden',
    description: 'Die häufigsten Probleme beim CSV-Import in Lexware Office und wie Sie sie lösen. Formatierungsfehler, Encoding-Probleme und Tipps zur Fehlerbehebung.',
    publishedAt: '2024-10-20',
    author: {
      name: 'Evelan GmbH',
      url: 'https://evelan.de',
    },
    keywords: [
      'CSV Import Fehler',
      'Lexware Office CSV',
      'Formatierungsfehler',
      'UTF-8 BOM',
      'CSV Trennzeichen',
      'Datumsformat CSV',
    ],
    category: 'tips',
    readingTime: 6,
    content: `
## Warum schlägt mein CSV-Import in Lexware Office fehl?

Der CSV-Import in Lexware Office ist eine praktische Funktion, aber auch eine häufige Fehlerquelle. In diesem Artikel zeigen wir die typischen Probleme und deren Lösungen.

## Die 5 häufigsten Fehler

### 1. Falsches Trennzeichen

**Problem:** Lexware Office erwartet Semikolon (;) als Trennzeichen, aber Ihre Datei verwendet Komma (,).

**Symptom:** Alle Daten erscheinen in der ersten Spalte oder die Spaltenzuordnung funktioniert nicht.

**Lösung:**
- Öffnen Sie die CSV in einem Texteditor
- Ersetzen Sie alle Kommas durch Semikolons
- Oder nutzen Sie unser Konverter-Tool, das dies automatisch macht

### 2. Falsches Datumsformat

**Problem:** Verschiedene Banken verwenden unterschiedliche Datumsformate.

| Bank | Format | Beispiel |
|------|--------|----------|
| Wise | DD-MM-YYYY | 29-09-2024 |
| Viele US-Banken | MM/DD/YYYY | 09/29/2024 |
| ISO-Standard | YYYY-MM-DD | 2024-09-29 |
| **Lexware Office** | **DD.MM.YYYY** | **29.09.2024** |

**Lösung:** Konvertieren Sie das Datum ins deutsche Format mit Punkten.

### 3. Falsches Dezimaltrennzeichen

**Problem:** Beträge wie "1234.56" werden nicht erkannt.

**Lexware Office erwartet:**
- Dezimaltrennzeichen: Komma (,)
- Tausendertrennzeichen: Punkt (.) oder keines
- Beispiel: 1.234,56 oder 1234,56

**Falsch:** 1234.56 oder 1,234.56

**Lösung:** Ersetzen Sie den Punkt durch ein Komma in der Betragsspalte.

### 4. Encoding-Probleme (Umlaute)

**Problem:** Umlaute (ä, ö, ü) und Sonderzeichen werden falsch dargestellt.

**Symptom:** "Müller" wird zu "M�ller" oder "MÃ¼ller"

**Lösung:**
- Speichern Sie die Datei als **UTF-8 mit BOM**
- In Excel: Speichern unter → CSV UTF-8 (durch Trennzeichen getrennt)
- In unserem Konverter ist dies automatisch richtig

### 5. Fehlende Pflichtfelder

**Problem:** Lexware Office benötigt bestimmte Spalten.

**Erforderliche Spalten:**
- Buchungstag (Datum)
- Betrag
- Verwendungszweck

**Achtung:** Der Verwendungszweck darf **nicht leer** sein!

**Lösung:** Stellen Sie sicher, dass alle Transaktionen einen Verwendungszweck haben.

## So prüfen Sie Ihre CSV-Datei

### 1. Mit Texteditor öffnen

Öffnen Sie die Datei mit einem einfachen Texteditor (Notepad++, VS Code):

**Gut:**
\`\`\`
Buchungstag;Betrag;Verwendungszweck
29.09.2024;-123,45;Rechnung 2024-001
\`\`\`

**Schlecht:**
\`\`\`
Buchungstag,Betrag,Verwendungszweck
29-09-2024,123.45,Rechnung 2024-001
\`\`\`

### 2. Encoding prüfen

In Notepad++ können Sie das Encoding unten rechts sehen:
- ✅ UTF-8 (BOM)
- ❌ ANSI
- ❌ UTF-8 (ohne BOM)

### 3. Zeilenenden prüfen

Windows-Zeilenenden (CRLF) funktionieren am besten mit Lexware Office.

## Unser Konverter: Alle Probleme automatisch gelöst

Unser [Wise zu Lexware Office Konverter](/) kümmert sich um alle diese Probleme:

✅ Korrektes Trennzeichen (Semikolon)
✅ Deutsches Datumsformat (DD.MM.YYYY)
✅ Deutsche Betragsformatierung (Komma)
✅ UTF-8 Encoding mit BOM
✅ Windows-Zeilenenden (CRLF)
✅ Alle Pflichtfelder korrekt befüllt

## Tipps für einen erfolgreichen Import

### Vor dem Import:

1. **Testlauf** – Importieren Sie erst wenige Transaktionen
2. **Backup** – Sichern Sie Ihre Lexware-Daten
3. **Zeitraum prüfen** – Keine Duplikate importieren

### Beim Import:

1. **Spaltenzuordnung prüfen** – Stimmt die Zuordnung?
2. **Vorschau nutzen** – Sehen die Daten korrekt aus?
3. **Bei Fehlern abbrechen** – Lieber neu starten als fehlerhafte Daten importieren

### Nach dem Import:

1. **Stichprobe** – Prüfen Sie einige Transaktionen
2. **Saldo vergleichen** – Stimmt der Kontostand?
3. **Dokumentieren** – Notieren Sie den importierten Zeitraum

## Fehlerbehebung: Spezifische Fehlermeldungen

### "Die Datei enthält ungültige Zeichen"

**Ursache:** Falsches Encoding oder Sonderzeichen
**Lösung:** Als UTF-8 mit BOM speichern

### "Datum konnte nicht erkannt werden"

**Ursache:** Falsches Datumsformat
**Lösung:** In DD.MM.YYYY konvertieren

### "Betrag konnte nicht erkannt werden"

**Ursache:** Punkt statt Komma als Dezimaltrennzeichen
**Lösung:** Punkt durch Komma ersetzen

### "Pflichtfeld fehlt"

**Ursache:** Leere Zellen in erforderlichen Spalten
**Lösung:** Alle Pflichtfelder befüllen

## Fazit

CSV-Import-Probleme in Lexware Office sind ärgerlich, aber lösbar. Mit dem richtigen Format oder einem automatischen Konverter sparen Sie Zeit und Nerven.

Nutzen Sie unseren kostenlosen [Wise zu Lexware Office Konverter](/) – er kümmert sich um alle Formatierungsprobleme automatisch!

[Jetzt Wise-CSV konvertieren →](/)
    `,
  },
];

// Get all articles sorted by date
export function getAllArticles(): BlogArticle[] {
  return [...blogArticles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// Get a single article by slug
export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return blogArticles.find((article) => article.slug === slug);
}

// Get featured articles
export function getFeaturedArticles(): BlogArticle[] {
  return blogArticles.filter((article) => article.featured);
}

// Get articles by category
export function getArticlesByCategory(category: BlogArticle['category']): BlogArticle[] {
  return blogArticles.filter((article) => article.category === category);
}

// Get all article slugs (for static generation)
export function getAllArticleSlugs(): string[] {
  return blogArticles.map((article) => article.slug);
}

# CLAUDE.md - Project Context for AI Assistants

## Project Overview

**Name**: Wise to Lexware Office Bank Statement Converter
**Type**: Next.js 15 Web Application
**Status**: ✅ **Production Ready** - Fully implemented and tested
**Purpose**: Convert Wise CSV exports to Lexware Office electronic bank statement import format - completely in-browser

**Target Lexware Office Feature**: Banking → Accounts → Import Transactions (CSV import)
**Lexware Office Documentation**: [Import Electronic Bank Statement via CSV File](https://help.lexware.de/de-form/articles/9555940-import-elektronischer-kontoauszug-uber-csv-datei)

---

## Current Status

### ✅ Completed Features:

1. **Core Conversion Logic** (`src/lib/converter.ts`)
   - Date format conversion (dd-mm-yyyy → dd.mm.yyyy)
   - Amount format conversion with German locale (Intl.NumberFormat)
   - Transaction party determination (DEBIT/CREDIT)
   - CSV formula injection prevention
   - Exchange rate information preservation
   - Complete validation with detailed error messages

2. **CSV Utilities** (`src/lib/csv-utils.ts`)
   - Papaparse integration for CSV parsing
   - UTF-8 BOM handling
   - German error messages for all CSV parsing errors
   - Lexware Office CSV generation (semicolon delimiter, CRLF line endings)
   - File download with proper encoding
   - Date-based filename generation

3. **UI Components**:
   - **FileUpload** - Drag & drop upload with validation
   - **ErrorAlert** - Error display with dismiss functionality
   - **StatsCard** - Statistics display with German locale formatting
   - **SuccessMessage** - Success confirmation
   - Shadcn UI integration (Alert, Card, Button)

4. **Main Application** (`src/app/page.tsx`)
   - Complete conversion workflow
   - State management for upload/conversion/download
   - Error handling with user-friendly German messages
   - Live statistics during processing
   - Automatic file download

5. **Test Suite** (73 tests, 76% coverage)
   - Jest + React Testing Library setup
   - 39 tests for converter.ts (100% coverage)
   - 13 tests for csv-utils.ts (89% coverage)
   - 10 tests for file-upload.tsx (87% coverage)
   - 3 tests for error-alert.tsx (100% coverage)
   - 10 tests for stats-card.tsx (100% coverage)
   - 8 tests for success-message.tsx (100% coverage)

6. **Test Data Generator** (`scripts/generate-wise-export.js`)
   - Generate random Wise export CSV files
   - Realistic German names, amounts, transaction types
   - Configurable size (small/medium/large)

7. **Documentation**:
   - `README.md` - User-facing documentation
   - `docs/TESTING.md` - Comprehensive testing guide
   - `docs/ROADMAP.md` - Future feature planning
   - `scripts/README.md` - Test data generator documentation

### 📊 Test Coverage:

| Category | Statements | Branches | Functions | Lines |
|----------|-----------|----------|-----------|-------|
| **Overall** | 76.01% | 64.42% | 76% | 76.33% |
| **lib/** | 95.1% ✅ | 78.26% | 100% ✅ | 96.06% ✅ |
| **components/** | 86.36% ✅ | 65% | 72.72% | 90.47% ✅ |

---

## Tech Stack

### Frontend:
- **Next.js 15** - App Router
- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling

### Libraries:
- **Papaparse** - CSV Parsing ✅
- **React Dropzone** - File Upload UI ✅
- **Shadcn UI** - Component Library ✅
- **Lucide React** - Icons ✅
- **next-themes** - Dark/Light mode theme management ✅

### Analytics:
- **Umami Analytics** - Privacy-friendly, self-hosted analytics ✅
  - Self-hosted on analytics.evelan.de
  - No cookies, no personal data collection
  - GDPR compliant
  - Script loaded via Next.js rewrites (/stats/* → analytics.evelan.de/*)

### Testing:
- **Jest** - Test framework ✅
- **React Testing Library** - Component testing ✅
- **@testing-library/jest-dom** - Custom matchers ✅

### Deployment:
- **Vercel** - Hosting (optimized for Next.js)
- **Environment Variables**:
  - `NEXT_PUBLIC_UMAMI_WEBSITE_ID` - Umami website tracking ID

---

## Project Structure

```
wise-lexoffice-import/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Next.js App Layout
│   │   ├── page.tsx                # Main converter page
│   │   ├── globals.css             # Global styles
│   │   └── favicon.ico             # App icon
│   ├── components/
│   │   ├── __tests__/              # Component tests (31 tests)
│   │   │   ├── error-alert.test.tsx
│   │   │   ├── file-upload.test.tsx
│   │   │   ├── stats-card.test.tsx
│   │   │   └── success-message.test.tsx
│   │   ├── ui/                     # Shadcn UI components
│   │   │   ├── alert.tsx
│   │   │   ├── button.tsx
│   │   │   └── card.tsx
│   │   ├── analytics.tsx           # Umami Analytics integration
│   │   ├── error-alert.tsx         # Error display component
│   │   ├── file-upload.tsx         # File upload with drag & drop
│   │   ├── footer.tsx              # Footer with links
│   │   ├── stats-card.tsx          # Statistics display
│   │   ├── success-message.tsx     # Success confirmation
│   │   ├── theme-provider.tsx      # Theme context provider (next-themes)
│   │   └── theme-switcher.tsx      # Dark/Light mode toggle button
│   ├── types/
│   │   └── umami.d.ts              # Umami Analytics TypeScript types
│   └── lib/
│       ├── __tests__/              # Core logic tests (52 tests)
│       │   ├── converter.test.ts   # 39 tests
│       │   └── csv-utils.test.ts   # 13 tests
│       ├── constants.ts            # Error messages, constants
│       ├── converter.ts            # Core conversion logic
│       ├── csv-utils.ts            # CSV parsing/generation
│       └── utils.ts                # Utility functions
├── docs/
│   ├── examples/
│   │   ├── Lexoffice-import-example.csv
│   │   └── WISE-export-example.csv
│   ├── TESTING.md                  # Testing documentation
│   └── ROADMAP.md                  # Future features
├── scripts/
│   ├── generate-wise-export.js     # Test data generator
│   └── README.md                   # Generator documentation
├── public/                         # Static assets
├── jest.config.js                  # Jest configuration
├── jest.setup.js                   # Jest global setup
├── components.json                 # Shadcn UI config
├── eslint.config.mjs               # ESLint configuration
├── next.config.ts                  # Next.js configuration
├── postcss.config.mjs              # PostCSS configuration
├── tsconfig.json                   # TypeScript configuration
├── README.md                       # Main documentation
└── CLAUDE.md                       # This file
```

---

## Core Conversion Logic

### Data Structure

#### Wise CSV Input Fields:
- `TransferWise ID` - Unique transaction ID
- `Date` - Date in format `dd-mm-yyyy`
- `Date Time` - Full timestamp
- `Amount` - Amount with dot as decimal separator (negative for DEBIT)
- `Currency` - Currency (e.g. EUR)
- `Description` - Transaction description
- `Payment Reference` - Payment reference
- `Running Balance` - Account balance after transaction
- `Exchange From` - Source currency for currency exchange
- `Exchange To` - Target currency for currency exchange
- `Exchange Rate` - Exchange rate
- `Exchange To Amount` - Amount in target currency
- `Payer Name` - Name of payer (for incoming transactions)
- `Payee Name` - Name of payee (for outgoing transactions)
- `Payee Account Number` - Payee's account number
- `Merchant` - Merchant name (for card transactions)
- `Card Last Four Digits` - Last 4 digits of card
- `Card Holder Full Name` - Card holder name
- `Attachment` - Attachment URL
- `Note` - Transaction note
- `Total fees` - Transaction fees
- `Transaction Type` - `DEBIT` or `CREDIT`
- `Transaction Details Type` - Transaction subtype
- CSV delimiter: Comma (`,`)

#### Lexware Office CSV Output Fields:

**Format matches Lexware Office's "Import Electronic Bank Statement via CSV File" specification:**

Required columns:
1. `Buchungstag` - Booking date (format: `DD.MM.YYYY`)
2. `Valuta` - Value date (format: `DD.MM.YYYY`, typically same as booking date)
3. `Auftraggeber/Zahlungsempfänger` - Sender/Payer name
4. `Empfänger/Zahlungspflichtiger` - Recipient/Payee name
5. `Vorgang/Verwendungszweck` - Transaction purpose/description (required - cannot be empty)
6. `Betrag` - Amount with comma as decimal separator (positive or negative)
7. `Zusatzinfo (optional)` - Additional information field (optional)

**Technical specifications**:
- CSV delimiter: Semicolon (`;`)
- Line endings: CRLF (`\r\n`) - Windows format
- Encoding: UTF-8 with BOM
- Date format: `DD.MM.YYYY` (e.g., `29.09.2025`)
- Amount format: German locale with comma (e.g., `1234,56` or `-553,76`)
- No duplicate detection: Lexware Office does not check for duplicates during import

**Important**: This format is specifically for Lexware Office's manual CSV import feature, accessible via:
Banking → Accounts → [Select Account] → Import Transactions

### Key Functions

1. **convertDate(date: string): string**
   - Converts `dd-mm-yyyy` to `dd.mm.yyyy`
   - Returns empty string for invalid dates

2. **convertAmount(amount: string): string**
   - Uses `Intl.NumberFormat('de-DE')` for proper German locale
   - No thousands separator (required by Lexware Office)
   - Always 2 decimal places

3. **determineTransactionParties(transactionType, payerName, payeeName)**
   - Returns `{ payer, payee }` based on transaction type
   - DEBIT: `{ payer: 'Kontoinhaber', payee: payeeName }`
   - CREDIT: `{ payer: payerName, payee: 'Kontoinhaber' }`

4. **sanitizeCSVField(value: string): string**
   - Prevents CSV formula injection
   - Escapes fields starting with `=`, `+`, `-`, `@`, `\t`, `\r`

5. **validateRow(row: WiseRow): string[]**
   - Validates required fields (Date, Amount, Transaction Type)
   - Returns array of error messages

6. **convertWiseToLexware Office(wiseData: WiseRow[]): Lexware OfficeRow[]**
   - Main conversion function
   - Validates all rows
   - Applies all transformations
   - Returns converted data

7. **calculateStats(wiseData: WiseRow[]): ConversionStats**
   - Calculates total/debit/credit counts
   - Calculates total amount
   - Returns statistics object

### Error Handling

All error messages are in German for end users:

- **TooManyFields**: "Die CSV-Datei enthält zu viele Spalten..."
- **TooFewFields**: "Die CSV-Datei enthält zu wenige Spalten..."
- **UndetectableDelimiter**: "Die CSV-Datei hat ein ungültiges Format..."
- **Missing Headers**: "Folgende erforderliche Spalten fehlen: [columns]"
- **Empty File**: "Die Datei enthält keine Transaktionen"
- **Invalid Row**: Detailed validation errors per field

---

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Generate test data
npm run generate:wise              # Custom
npm run generate:wise:small        # 10 transactions
npm run generate:wise:medium       # 50 transactions
npm run generate:wise:large        # 500 transactions
```

---

## Privacy & Security

- ✅ **No server-side processing** - all operations in browser
- ✅ **No data storage** - files only kept temporarily in memory
- ✅ **No data transmission** - no network requests for conversion
- ✅ **CSV injection prevention** - sanitizes all output fields
- ✅ **GDPR compliant** - no processing of data on servers
- ✅ **Privacy-friendly analytics** - Umami self-hosted (no cookies, no personal data)
- ✅ **Open source** - verifiable code

### Analytics Implementation

**Umami Analytics Integration**:
- Self-hosted on analytics.evelan.de
- Script loaded via Next.js rewrites: `/stats/*` → `https://analytics.evelan.de/*`
- Only enabled in production mode
- Website ID: 570f9c50-cbeb-42b2-a457-65e24f8dbcc2
- No cookies, no personal data collection
- GDPR and privacy compliant
- TypeScript types provided for custom event tracking

---

## Localization

- **Documentation**: English (for developers)
- **UI/Interface**: German (for end users)
- **Code comments**: English
- **Git commits**: English
- **Error messages**: German (user-facing)

---

## Example Transaction

**Input (Wise CSV)**:
```csv
TransferWise ID,Date,Date Time,Amount,Currency,Description,Payment Reference,Running Balance,Exchange From,Exchange To,Exchange Rate,Payer Name,Payee Name,Payee Account Number,Merchant,Card Last Four Digits,Card Holder Full Name,Attachment,Note,Total fees,Exchange To Amount,Transaction Type,Transaction Details Type
TRANSFER-123,29-09-2025,29-09-2025 16:02:46.004,-553.76,EUR,Test payment,Invoice 22,4315.50,,,,,,,,,,,,,,DEBIT,TRANSFER
```

**Output (Lexware Office CSV)**:
```csv
Buchungstag;Valuta;Auftraggeber/Zahlungsempfänger;Empfänger/Zahlungspflichtiger;Vorgang/Verwendungszweck;Betrag;Zusatzinfo (optional)
29.09.2025;29.09.2025;Kontoinhaber;John Doe;Test payment | Ref: Invoice 22;-553,76;Wise ID: TRANSFER-123
```

---

## Testing Strategy

### Unit Tests
- Core business logic (converter.ts) - 100% statement coverage
- CSV utilities (csv-utils.ts) - 89% coverage
- All critical paths tested

### Component Tests
- File upload validation and interaction
- Error display and dismissal
- Statistics formatting with German locale
- Success message rendering

### Test Data
- Generated test files with realistic data
- Multiple transaction types (DEBIT, CREDIT, CARD, etc.)
- German names and realistic amounts
- Exchange rates for international transfers

### Coverage Goals (All Achieved ✅)
- lib/: >90% (achieved: 95.1%)
- components/: >80% (achieved: 86.36%)
- Overall: >75% (achieved: 76.01%)

---

## Future Enhancements

See `docs/ROADMAP.md` for planned features:
- Multi-file batch processing
- Advanced filtering options
- Transaction categorization
- Data visualization
- Export format options
- And more...

---

## Development Environment

- **Node Version**: v20+ recommended
- **Package Manager**: npm
- **IDE**: VS Code recommended with ESLint extension
- **Development Server**: `npm run dev` (port 3000)
- **TypeScript**: Strict mode enabled

---

**Last Updated**: 2025-10-13
**Status**: Production Ready
**Author**: [Evelan](https://evelan.de)
**Developed by**: Andreas Straub

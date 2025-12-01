# WISE to Lexware Office Bank Statement Converter

🚀 **Production-ready web app** for converting WISE CSV exports to Lexware Office electronic bank statement import format - completely in your browser!

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Tests-169%20passing-success)](./docs/TESTING.md)
[![Coverage](https://img.shields.io/badge/Coverage-87%25-green)](./docs/TESTING.md)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/github/stars/evelan-de/wise-to-lexware-office-converter?style=social)](https://github.com/evelan-de/wise-to-lexware-office-converter)

## ✨ Features

### Core Functionality
- 📁 **Drag & Drop** upload for CSV files with instant validation
- ⚡ **Lightning fast** conversion entirely in browser (no server needed)
- 🔒 **100% Privacy** - your financial data never leaves your device
- 💰 **Live statistics** - see totals, debits, and credits in real-time
- ✅ **Automatic validation** - detailed error messages in German
- 🎯 **CSV injection prevention** - secure output formatting
- 🌍 **German locale** - proper formatting for Lexware Office (commas, date format)

### Data Preview & Validation (New!)
- 👁️ **Interactive data preview** - review all transactions before conversion
- ✏️ **Inline row editing** - fix errors directly in the browser
- 🔍 **Smart filtering** - filter by validation status (valid/warnings/errors)
- 🔎 **Full-text search** - search across all transaction fields
- 📊 **Validation summary** - see errors, warnings, and valid rows at a glance
- ⚠️ **Detailed validation** - check dates, amounts, transaction types, and more
- 🔄 **Comparison view** - side-by-side view of Wise input → Lexware Office output
- 📋 **Pagination** - handle large files with smooth pagination

### User Experience
- 🎨 **Modern UI** built with Shadcn/ui and Tailwind CSS
- 🌓 **Dark/Light Mode** - toggle between themes based on your preference or system setting
- 📊 **Statistics dashboard** showing transaction breakdown
- 🔄 **Smart detection** of DEBIT/CREDIT transactions
- 💱 **Exchange rate preservation** in additional info field
- 📥 **Automatic download** with date-based filename
- 🚨 **User-friendly errors** with actionable messages in German
- 🦶 **Professional footer** with ImmuniWeb security badge (Grade A)
- 📄 **Legal pages** - comprehensive Datenschutz and Impressum pages
- 🌐 **Fully German** - all UI elements and documentation in German

### Developer Experience
- 🧪 **Comprehensive test suite** - 169 tests with 87% coverage
- 📝 **Full documentation** - testing guide, roadmap, technical specs
- 🛠️ **Test data generator** - create random Wise exports for development
- 🔍 **Type-safe** - TypeScript with strict mode
- ✨ **Linted & formatted** - ESLint configuration included

## 🛠 Tech Stack

### Frontend Framework
- **Next.js 16** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript 5** - Full type safety throughout

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful, accessible component library
- **Lucide React** - Crisp icon library
- **next-themes** - Theme management for dark/light mode

### Data Processing
- **Papaparse** - Robust CSV parsing with error handling
- **React Dropzone** - File upload with drag & drop
- **Intl.NumberFormat** - Proper German locale formatting

### Testing & Quality
- **Jest** - Test framework with 169 passing tests
- **React Testing Library** - Component testing best practices
- **@testing-library/jest-dom** - Custom DOM matchers

### Deployment
- **Vercel** - Optimized hosting for Next.js applications

## 🚀 Deployment

This app is optimized for Vercel deployment:

1. Fork or clone this repository
2. Connect your repository to Vercel
3. Configure environment variables (optional - only needed for analytics):
   - `NEXT_PUBLIC_UMAMI_WEBSITE_ID` - Your Umami website ID
4. Deploy with one click!

Or use the deploy button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/evelan-de/wise-to-lexware-office-converter)

### Build Requirements
- Node.js 20+ recommended
- npm (comes with Node.js)

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Umami Analytics (optional)
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id
```

The app is fully static after build - no server-side processing required.

## 💻 Local Development

### Quick Start

```bash
# Clone the repository
git clone https://github.com/evelan-de/wise-to-lexware-office-converter.git
cd wise-to-lexware-office-converter

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

### Available Commands

```bash
# Development
npm run dev              # Start development server (port 3000)
npm run build            # Build for production
npm start                # Start production server

# Testing
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report

# Test Data Generation
npm run generate:wise              # Custom (prompts for details)
npm run generate:wise:small        # 10 transactions
npm run generate:wise:medium       # 50 transactions
npm run generate:wise:large        # 500 transactions

# Custom generation
node scripts/generate-wise-export.js <count> <filename>
```

See [scripts/README.md](./scripts/README.md) for test data generator details.

### Project Structure

```
wise-to-lexware-office-converter/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Main converter page
│   │   ├── layout.tsx         # App layout with footer
│   │   ├── datenschutz/       # Privacy policy page
│   │   ├── impressum/         # Imprint page
│   │   └── hilfe/             # Help page
│   ├── components/             # React components
│   │   ├── file-upload.tsx    # Drag & drop upload
│   │   ├── stats-card.tsx     # Statistics display
│   │   ├── error-alert.tsx    # Error messages
│   │   ├── success-message.tsx # Success confirmation
│   │   ├── footer.tsx         # Reusable footer component
│   │   ├── preview/           # Data preview components
│   │   │   ├── preview-container.tsx  # Main preview orchestrator
│   │   │   ├── data-table.tsx         # Interactive data table
│   │   │   ├── comparison-view.tsx    # Side-by-side comparison
│   │   │   └── row-editor.tsx         # Inline row editing
│   │   └── ui/                # Shadcn components
│   └── lib/                    # Core logic
│       ├── converter.ts        # Conversion logic
│       ├── csv-utils.ts        # CSV parsing/generation
│       ├── validation.ts       # Data validation logic
│       ├── filters.ts          # Filtering & sorting utilities
│       └── constants.ts        # Constants & messages
├── docs/                       # Documentation
├── scripts/                    # Utility scripts
└── tests/                      # Test files (169 tests)
```

## 📝 Usage

### What This Tool Does

This converter transforms Wise CSV exports into the specific format required by **Lexware Office's "Import Electronic Bank Statement via CSV File"** feature. This is useful when:
- You want to import historical Wise transactions into Lexware Office
- Automatic bank connection is not available or not working
- You need to manually add specific Wise transactions to Lexware Office

### Step-by-Step Guide

1. **Export from Wise**
   - Log into your Wise account
   - Navigate to Statements & Documents
   - Select your desired date range
   - Download statement as CSV file

2. **Upload to Converter**
   - Visit the converter app
   - Drag & drop your Wise CSV file into the upload area
   - Or click to browse and select the file
   - Maximum file size: 5 MB

3. **Preview & Validate** (New!)
   - Review all your transactions in an interactive table
   - See validation status: ✅ valid, ⚠️ warnings, ❌ errors
   - Click on status badges to filter by validation state
   - Use the search bar to find specific transactions
   - Edit any row directly by clicking the edit button
   - Switch to "Comparison View" to see Wise → Lexware Office transformation

4. **Fix Issues (if any)**
   - Rows with errors are highlighted in red
   - Click "Edit" to fix issues like missing dates or invalid amounts
   - Warnings (yellow) are informational and won't block conversion
   - All changes are validated in real-time

5. **Convert & Download**
   - Click "Konvertieren & Herunterladen" when ready
   - Conversion happens instantly in your browser
   - File downloads automatically
   - Filename format: `lexoffice_import_YYYY-MM-DD.csv`

6. **Import to Lexware Office**
   - Log into your Lexware Office account
   - Navigate to **Banking → Accounts**
   - Select your bank account
   - Click **"Import Transactions"**
   - Upload the converted CSV file
   - Map columns if prompted (should auto-detect)
   - Review and confirm the import

### ⚠️ Important Notes

**Duplicate Transactions**: Lexware Office's CSV import does not automatically check for duplicates. Before importing:
- Check your Lexware Office account for existing transactions from the same period
- Only import transactions that are not already present
- Keep track of which date ranges you've already imported

**Recommended Workflow**:
1. Note the last transaction date in your Lexware Office account
2. Export Wise transactions from the day after that date
3. Convert and import the new transactions
4. Update your records with the new last transaction date

### Validation & Error Handling

**File Validation:**
- ✅ File type (must be .csv)
- ✅ File size (max 5 MB)
- ✅ CSV structure (correct columns)

**Row-Level Validation:**
- ✅ **Date** - Format (dd-mm-yyyy), valid date, future date warning
- ✅ **Amount** - Numeric format, zero amount warning
- ✅ **Transaction Type** - Must be DEBIT or CREDIT
- ✅ **TransferWise ID** - Warning if missing
- ✅ **Payer/Payee Name** - Warning if missing based on transaction type
- ✅ **Description** - Warning if both description and reference are empty

**Validation Severity:**
- ❌ **Errors** - Block conversion, must be fixed (highlighted red)
- ⚠️ **Warnings** - Informational, don't block conversion (highlighted yellow)
- ✅ **Valid** - Ready for conversion (highlighted green)

Error messages are displayed in German with specific details about what went wrong.

## 🔄 Conversion Details

### Lexware Office CSV Format

The converter creates a CSV file matching **Lexware Office's electronic bank statement import specification**:

**Required Columns** (as per Lexware Office documentation):
1. **Buchungstag** - Booking date (DD.MM.YYYY format)
2. **Valuta** - Value date (DD.MM.YYYY format)
3. **Auftraggeber/Zahlungsempfänger** - Sender/Payer name
4. **Empfänger/Zahlungspflichtiger** - Recipient/Payee name
5. **Vorgang/Verwendungszweck** - Transaction purpose/description
6. **Betrag** - Amount (German format with comma as decimal separator)
7. **Zusatzinfo (optional)** - Additional information (optional field)

**Format Specifications**:
- Delimiter: Semicolon (`;`)
- Line Endings: Windows CRLF (`\r\n`)
- Encoding: UTF-8 with BOM
- Date Format: `DD.MM.YYYY` (e.g., `29.09.2025`)
- Amount Format: German locale with comma (e.g., `1.234,56` or `-553,76`)

### Field Mapping

| Wise Field | Lexware Office Field | Transformation |
|-----------|-----------------|----------------|
| Date | Buchungstag | `29-09-2025` → `29.09.2025` |
| Date | Valuta | Same as Buchungstag |
| Amount | Betrag | `1318.79` → `1318,79` (German locale) |
| Transaction Type | Auftraggeber/Empfänger | Based on DEBIT/CREDIT |
| Payer/Payee Name | Auftraggeber/Empfänger | Determined by type |
| Description + Reference | Vorgang/Verwendungszweck | Combined with separator |
| Exchange info + Wise ID | Zusatzinfo (optional) | Optional additional info |

### Key Transformations

1. **Date Format**
   - Input: `dd-mm-yyyy` (e.g., `29-09-2025`)
   - Output: `dd.mm.yyyy` (e.g., `29.09.2025`)

2. **Amount Format**
   - Input: Dot decimal (e.g., `1318.79`)
   - Output: Comma decimal (e.g., `1318,79`)
   - No thousands separator
   - Always 2 decimal places

3. **Transaction Parties**
   - **DEBIT** (withdrawal):
     - Auftraggeber: `Kontoinhaber` (account holder)
     - Empfänger: Payee name from Wise
   - **CREDIT** (deposit):
     - Auftraggeber: Payer name from Wise
     - Empfänger: `Kontoinhaber` (account holder)

4. **CSV Format**
   - Input delimiter: Comma (`,`)
   - Output delimiter: Semicolon (`;`)
   - Output line endings: CRLF (`\r\n`) - Windows format
   - UTF-8 encoding with BOM

5. **Security**
   - All fields sanitized to prevent CSV injection attacks
   - Fields starting with `=`, `+`, `-`, `@` are escaped

### Example Conversion

**Input (Wise CSV)**:
```csv
TransferWise ID,Date,Amount,Description,Payment Reference,Transaction Type,...
TRANSFER-123,29-09-2025,-553.76,Test payment,Invoice 22,DEBIT,...
```

**Output (Lexware Office CSV)**:
```csv
Buchungstag;Valuta;Auftraggeber/Zahlungsempfänger;Empfänger/Zahlungspflichtiger;Vorgang/Verwendungszweck;Betrag;Zusatzinfo (optional)
29.09.2025;29.09.2025;Kontoinhaber;John Doe;Test payment | Ref: Invoice 22;-553,76;Wise ID: TRANSFER-123
```

## 🔒 Privacy & Security

### Data Protection
- ✅ **Client-side only** - all processing happens in your browser
- ✅ **No server uploads** - files never transmitted to any server
- ✅ **No data storage** - files kept temporarily in memory only
- ✅ **Privacy-friendly analytics** - Umami self-hosted analytics (no cookies, no personal data)
- ✅ **No third-party requests** - conversion works offline
- ✅ **Open source** - code is publicly verifiable

### Analytics
This app uses **[Umami Analytics](https://umami.is/)**, a privacy-friendly, GDPR-compliant analytics solution:
- ✅ **Self-hosted** on our own infrastructure (analytics.evelan.de)
- ✅ **No cookies** - no tracking cookies are set
- ✅ **No personal data** - IP addresses are anonymized
- ✅ **GDPR compliant** - meets all European privacy regulations
- ✅ **Open source** - Umami is open source and auditable
- ✅ **Minimal data** - only page views and basic usage statistics

We use analytics solely to understand how the app is used and to improve the user experience. Your financial data is never tracked or analyzed.

### Security Features
- ✅ **CSV injection prevention** - sanitizes all output fields
- ✅ **Input validation** - checks file type, size, and format
- ✅ **Type safety** - TypeScript prevents common bugs
- ✅ **Error handling** - graceful handling of malformed data

### GDPR Compliance
- ✅ **No data processing** - app doesn't process personal data on servers
- ✅ **No data transmission** - all operations are local
- ✅ **No cookies** - no tracking or persistent storage
- ✅ **User control** - user decides when to upload/download

## 🧪 Testing

### Test Coverage

The app has comprehensive test coverage:

- **169 tests** across all critical functionality
- **87% overall coverage** (exceeds target)
- **90% coverage** of core business logic (lib/)
- **89% coverage** of UI components

### Test Structure

```
tests/
├── lib/
│   ├── converter.test.ts      # Core conversion logic
│   ├── csv-utils.test.ts      # CSV parsing/generation
│   ├── validation.test.ts     # Data validation
│   └── filters.test.ts        # Filtering & sorting
└── components/
    ├── file-upload.test.tsx   # File upload validation
    ├── error-alert.test.tsx   # Error display
    ├── stats-card.test.tsx    # Statistics formatting
    ├── success-message.test.tsx # Success UI
    └── preview/
        ├── data-table.test.tsx  # Data table interactions
        └── row-editor.test.tsx  # Row editing functionality
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode (auto-rerun on changes)
npm run test:watch

# Coverage report
npm run test:coverage
```

See [docs/TESTING.md](./docs/TESTING.md) for detailed testing documentation.

## 📚 Documentation

- **[Testing Guide](./docs/TESTING.md)** - Comprehensive testing documentation, coverage goals, best practices
- **[Roadmap](./docs/ROADMAP.md)** - Planned features and enhancements for future releases
- **[CLAUDE.md](./CLAUDE.md)** - Technical context and implementation details for AI assistants
- **[Test Data Generator](./scripts/README.md)** - Documentation for generating random Wise export files

## 🗺️ Roadmap

See [docs/ROADMAP.md](./docs/ROADMAP.md) for the complete feature roadmap.

### ✅ Recently Completed
- 🌓 **Dark/Light Mode** - Theme switcher with system preference detection
- 👁️ **Data Preview & Validation** - Interactive preview with inline editing
- 🔍 **Search & Filter** - Full-text search and status filtering
- 🔄 **Comparison View** - Side-by-side Wise → Lexware Office transformation

### Planned Features
- 📦 Multi-file batch processing
- 📊 Transaction categorization
- 📈 Data visualization and charts
- 🎛️ Custom export formats
- 🌐 Multi-language support
- 💾 Browser storage for preferences

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report Bugs** - Open an issue with detailed reproduction steps
2. **Suggest Features** - Share your ideas in the issues section
3. **Submit PRs** - Fork, make changes, and submit a pull request
4. **Improve Docs** - Help make documentation clearer
5. **Write Tests** - Increase test coverage

### Development Guidelines

- Write tests for new features
- Follow TypeScript best practices
- Use existing code style (ESLint)
- Update documentation as needed
- Keep commits focused and descriptive

## 📄 License

MIT License - free to use for private and commercial purposes.

See [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- CSV parsing by [Papaparse](https://www.papaparse.com/)
- Icons from [Lucide](https://lucide.dev/)

---

**Made with ❤️ by [Evelan](https://evelan.de) for Wise & Lexware Office users**

*Convert your Wise transactions to Lexware Office format in seconds - privately and securely in your browser.*

## 💼 Sponsor

This project is developed and maintained by **[Evelan](https://evelan.de)** - Your partner for modern web applications and digital solutions.

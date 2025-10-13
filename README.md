# WISE to Lexware Office Bank Statement Converter

🚀 **Production-ready web app** for converting WISE CSV exports to Lexware Office electronic bank statement import format - completely in your browser!

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Tests-73%20passing-success)](./docs/TESTING.md)
[![Coverage](https://img.shields.io/badge/Coverage-76%25-green)](./docs/TESTING.md)
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

### User Experience
- 🎨 **Modern UI** built with Shadcn/ui and Tailwind CSS
- 📊 **Statistics dashboard** showing transaction breakdown
- 🔄 **Smart detection** of DEBIT/CREDIT transactions
- 💱 **Exchange rate preservation** in additional info field
- 📥 **Automatic download** with date-based filename
- 🚨 **User-friendly errors** with actionable messages in German

### Developer Experience
- 🧪 **Comprehensive test suite** - 73 tests with 76% coverage
- 📝 **Full documentation** - testing guide, roadmap, technical specs
- 🛠️ **Test data generator** - create random Wise exports for development
- 🔍 **Type-safe** - TypeScript with strict mode
- ✨ **Linted & formatted** - ESLint configuration included

## 🛠 Tech Stack

### Frontend Framework
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript 5** - Full type safety throughout

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful, accessible component library
- **Lucide React** - Crisp icon library

### Data Processing
- **Papaparse** - Robust CSV parsing with error handling
- **React Dropzone** - File upload with drag & drop
- **Intl.NumberFormat** - Proper German locale formatting

### Testing & Quality
- **Jest** - Test framework with 73 passing tests
- **React Testing Library** - Component testing best practices
- **@testing-library/jest-dom** - Custom DOM matchers

### Deployment
- **Vercel** - Optimized hosting for Next.js applications

## 🚀 Deployment

This app is optimized for Vercel deployment:

1. Fork or clone this repository
2. Connect your repository to Vercel
3. Deploy with one click - no environment variables needed!

Or use the deploy button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/evelan-de/wise-to-lexware-office-converter)

### Build Requirements
- Node.js 20+ recommended
- npm (comes with Node.js)

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
│   │   └── layout.tsx         # App layout
│   ├── components/             # React components
│   │   ├── file-upload.tsx    # Drag & drop upload
│   │   ├── stats-card.tsx     # Statistics display
│   │   ├── error-alert.tsx    # Error messages
│   │   ├── success-message.tsx # Success confirmation
│   │   └── ui/                # Shadcn components
│   └── lib/                    # Core logic
│       ├── converter.ts        # Conversion logic
│       ├── csv-utils.ts        # CSV parsing/generation
│       └── constants.ts        # Constants & messages
├── docs/                       # Documentation
├── scripts/                    # Utility scripts
└── tests/                      # Test files (73 tests)
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

3. **Convert**
   - File is validated automatically (structure, required fields)
   - Conversion happens instantly in your browser
   - See live statistics: total transactions, debits, credits, and total amount
   - All data stays on your device - no server upload

4. **Download**
   - Converted file downloads automatically
   - Filename format: `lexoffice_import_YYYY-MM-DD.csv`
   - File is ready for Lexware Office import

5. **Import to Lexware Office**
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

The app validates:
- ✅ File type (must be .csv)
- ✅ File size (max 5 MB)
- ✅ CSV structure (correct columns)
- ✅ Required fields (Date, Amount, Transaction Type)
- ✅ Data format (valid dates, numbers, types)

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
- ✅ **No analytics** - no tracking of usage or data
- ✅ **No third-party requests** - conversion works offline
- ✅ **Open source** - code is publicly verifiable

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

- **73 tests** across all critical functionality
- **76% overall coverage** (exceeds target)
- **95% coverage** of core business logic
- **86% coverage** of UI components

### Test Structure

```
tests/
├── lib/
│   ├── converter.test.ts      # 39 tests - core conversion logic
│   └── csv-utils.test.ts      # 13 tests - CSV parsing/generation
└── components/
    ├── file-upload.test.tsx   # 10 tests - file upload validation
    ├── error-alert.test.tsx   # 3 tests - error display
    ├── stats-card.test.tsx    # 10 tests - statistics formatting
    └── success-message.test.tsx # 8 tests - success UI
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

See [docs/ROADMAP.md](./docs/ROADMAP.md) for the complete feature roadmap. Highlights:

### Planned Features
- 📦 Multi-file batch processing
- 🔍 Advanced filtering and search
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

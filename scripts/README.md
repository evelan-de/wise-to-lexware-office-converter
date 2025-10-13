# Scripts

Utility scripts for development and testing.

## generate-wise-export.js

Generate random Wise export CSV files for testing the converter.

### Usage

**Direct Node.js execution:**

```bash
# Generate 25 transactions (default)
node scripts/generate-wise-export.js

# Generate specific number of transactions
node scripts/generate-wise-export.js 100

# Generate with custom output filename
node scripts/generate-wise-export.js 50 my-export.csv
```

**Using npm scripts:**

```bash
# Generate 25 transactions (default output: wise-export-generated.csv)
npm run generate:wise

# Generate small test file (10 transactions)
npm run generate:wise:small

# Generate medium test file (50 transactions)
npm run generate:wise:medium

# Generate large test file (500 transactions)
npm run generate:wise:large
```

### Generated Data

The script generates realistic random Wise transactions with:

- **Transaction Types**: DEBIT and CREDIT
- **Currencies**: EUR, USD, GBP, PHP, THB, JPY
- **Transaction Detail Types**: TRANSFER, CARD, MONEY_ADDED, CONVERSION, UNKNOWN
- **German names** for Payer/Payee
- **Realistic amounts** between 50-2000 EUR (DEBIT) or 100-10000 EUR (CREDIT)
- **Exchange rates** for international transfers
- **Bank account numbers** from various banks (CIMB, UB, BDO, BPI, etc.)
- **Card transactions** with merchant names
- **Invoice references** in various formats
- **Running balance** that updates with each transaction
- **Fees** for debit transactions
- **Timestamps** in Wise format (dd-mm-yyyy HH:mm:ss.SSS)

### Examples

Generate a test file for development:

```bash
npm run generate:wise:small
# Output: docs/examples/wise-export-small.csv (10 transactions)
```

Generate a stress test file:

```bash
node scripts/generate-wise-export.js 1000 stress-test.csv
# Output: stress-test.csv (1000 transactions, ~200 KB)
```

### Output Format

The generated CSV matches the exact structure of Wise export files:

```csv
TransferWise ID,Date,Date Time,Amount,Currency,Description,...
TRANSFER-1234567890,29-09-2025,"29-09-2025 16:02:46.004",-553.76,EUR,...
```

All 23 columns are included with proper CSV escaping for special characters.

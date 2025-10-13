#!/usr/bin/env node

/**
 * Generate random Wise export CSV files for testing
 *
 * Usage:
 *   node scripts/generate-wise-export.js [count] [outputFile]
 *
 * Examples:
 *   node scripts/generate-wise-export.js 50
 *   node scripts/generate-wise-export.js 100 my-export.csv
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DEFAULT_COUNT = 25;
const DEFAULT_OUTPUT = 'wise-export-generated.csv';

// Data pools for random generation
const TRANSACTION_TYPES = ['DEBIT', 'CREDIT'];
const CURRENCIES = ['EUR', 'USD', 'GBP', 'PHP', 'THB', 'JPY'];
const BANKS = ['CIMB', 'UB', 'BDO', 'BPI', 'SB', 'PNB'];

const FIRST_NAMES = [
  'Max', 'Anna', 'Peter', 'Maria', 'Hans', 'Sophie', 'Klaus', 'Emma',
  'Thomas', 'Laura', 'Michael', 'Sarah', 'Andreas', 'Julia', 'Stefan',
  'Lisa', 'Christian', 'Nina', 'Martin', 'Jessica', 'Daniel', 'Michelle'
];

const LAST_NAMES = [
  'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner',
  'Becker', 'Schulz', 'Hoffmann', 'Koch', 'Bauer', 'Richter', 'Klein',
  'Wolf', 'Schröder', 'Neumann', 'Schwarz', 'Zimmermann', 'Braun'
];

const MERCHANTS = [
  'Amazon', 'Google', 'Microsoft', 'Apple', 'Netflix', 'Spotify',
  'Dropbox', 'Adobe', 'Zoom', 'Slack', 'Stripe', 'PayPal', 'GitHub'
];

const DESCRIPTIONS_DEBIT = [
  'Geld überwiesen an',
  'Zahlung an',
  'Überweisung an',
  'Bezahlung für Dienstleistung',
  'Rechnung bezahlt an'
];

const DESCRIPTIONS_CREDIT = [
  'Einzahlung auf das Konto',
  'Geld erhalten von',
  'Gehalt',
  'Rückerstattung',
  'Cashback',
  'Zinsen'
];

const DETAIL_TYPES = [
  'TRANSFER',
  'CARD',
  'MONEY_ADDED',
  'CONVERSION',
  'UNKNOWN'
];

// Helper functions
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 2) {
  const value = Math.random() * (max - min) + min;
  return parseFloat(value.toFixed(decimals));
}

function randomItem(array) {
  return array[randomInt(0, array.length - 1)];
}

function randomDate(startDate, endDate) {
  const start = startDate.getTime();
  const end = endDate.getTime();
  const timestamp = start + Math.random() * (end - start);
  const date = new Date(timestamp);

  // Format: dd-mm-yyyy
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

function randomDateTime(date) {
  const hours = String(randomInt(0, 23)).padStart(2, '0');
  const minutes = String(randomInt(0, 59)).padStart(2, '0');
  const seconds = String(randomInt(0, 59)).padStart(2, '0');
  const millis = String(randomInt(0, 999)).padStart(3, '0');

  return `${date} ${hours}:${minutes}:${seconds}.${millis}`;
}

function generateTransferId(type) {
  if (type === 'BALANCE_CASHBACK') {
    // UUID format for cashback
    const hex = () => Math.floor(Math.random() * 16).toString(16);
    return `BALANCE_CASHBACK-${[...Array(8)].map(hex).join('')}-${[...Array(4)].map(hex).join('')}-${[...Array(4)].map(hex).join('')}-${[...Array(4)].map(hex).join('')}-${[...Array(12)].map(hex).join('')}`;
  }
  return `TRANSFER-${randomInt(1000000000, 9999999999)}`;
}

function generateAccountNumber(bank) {
  const length = randomInt(10, 16);
  let number = '';
  for (let i = 0; i < length; i++) {
    number += randomInt(0, 9);
  }
  return `(${bank}) ${number}`;
}

function generatePersonName() {
  return `${randomItem(FIRST_NAMES)} ${randomItem(LAST_NAMES)}`;
}

function generateInvoiceReference() {
  const types = [
    `Invoice ${randomInt(1, 99)}`,
    `INV-${String(randomInt(1, 9999)).padStart(7, '0')}`,
    `Rechnung ${randomInt(1000, 9999)}`,
    `RG-${randomInt(100, 999)}`
  ];
  return randomItem(types);
}

function generateCardNumber() {
  return String(randomInt(1000, 9999));
}

function generateTransaction(index, runningBalance, previousDate) {
  const transactionType = randomItem(TRANSACTION_TYPES);
  const isDebit = transactionType === 'DEBIT';
  const currency = 'EUR';

  // Determine transaction detail type based on random chance
  let detailType;
  const rand = Math.random();
  if (isDebit) {
    if (rand < 0.7) detailType = 'TRANSFER';
    else if (rand < 0.9) detailType = 'CARD';
    else detailType = 'CONVERSION';
  } else {
    if (rand < 0.5) detailType = 'MONEY_ADDED';
    else if (rand < 0.7) detailType = 'TRANSFER';
    else detailType = 'UNKNOWN';
  }

  // Generate amount
  let amount;
  if (isDebit) {
    amount = -randomFloat(50, 2000);
  } else {
    amount = randomFloat(100, 10000);
  }

  // Update running balance
  runningBalance += amount;

  // Generate date (same or previous day)
  const date = previousDate || randomDate(new Date(2025, 0, 1), new Date());
  const dateTime = randomDateTime(date);

  // Generate exchange info for international transfers
  const hasExchange = isDebit && Math.random() > 0.3;
  let exchangeFrom = '';
  let exchangeTo = '';
  let exchangeRate = '';
  let exchangeToAmount = '';

  if (hasExchange) {
    exchangeFrom = currency;
    exchangeTo = randomItem(CURRENCIES.filter(c => c !== currency));
    exchangeRate = randomFloat(40, 150, 5);
    exchangeToAmount = Math.abs(amount * exchangeRate).toFixed(2);
  }

  // Generate names based on transaction type
  let payerName = '';
  let payeeName = '';
  let payeeAccountNumber = '';

  if (detailType === 'TRANSFER') {
    if (isDebit) {
      payeeName = generatePersonName();
      payeeAccountNumber = generateAccountNumber(randomItem(BANKS));
    } else {
      payerName = generatePersonName();
    }
  }

  // Generate description
  let description;
  if (detailType === 'CARD') {
    description = `Card payment to ${randomItem(MERCHANTS)}`;
  } else if (detailType === 'MONEY_ADDED') {
    description = randomItem(DESCRIPTIONS_CREDIT);
  } else if (isDebit) {
    description = `${randomItem(DESCRIPTIONS_DEBIT)} ${payeeName}`;
  } else {
    description = randomItem(DESCRIPTIONS_CREDIT);
  }

  // Generate payment reference
  let paymentReference = '';
  if (detailType === 'TRANSFER' && isDebit) {
    paymentReference = generateInvoiceReference();
  }

  // Generate card info for card transactions
  let merchant = '';
  let cardLastFour = '';
  let cardHolderName = '';

  if (detailType === 'CARD') {
    merchant = randomItem(MERCHANTS);
    cardLastFour = generateCardNumber();
    cardHolderName = generatePersonName();
  }

  // Calculate fees
  const totalFees = isDebit ? randomFloat(2, 15, 2) : 0;

  // Generate transfer ID
  const transferId = detailType === 'UNKNOWN' && !isDebit
    ? generateTransferId('BALANCE_CASHBACK')
    : generateTransferId('TRANSFER');

  return {
    'TransferWise ID': transferId,
    'Date': date,
    'Date Time': dateTime,
    'Amount': amount.toFixed(2),
    'Currency': currency,
    'Description': description,
    'Payment Reference': paymentReference,
    'Running Balance': runningBalance.toFixed(2),
    'Exchange From': exchangeFrom,
    'Exchange To': exchangeTo,
    'Exchange Rate': exchangeRate ? exchangeRate.toFixed(5) : '',
    'Payer Name': payerName,
    'Payee Name': payeeName,
    'Payee Account Number': payeeAccountNumber,
    'Merchant': merchant,
    'Card Last Four Digits': cardLastFour,
    'Card Holder Full Name': cardHolderName,
    'Attachment': '',
    'Note': '',
    'Total fees': totalFees > 0 ? totalFees.toFixed(2) : '',
    'Exchange To Amount': exchangeToAmount,
    'Transaction Type': transactionType,
    'Transaction Details Type': detailType
  };
}

function escapeCSVField(field) {
  if (field === null || field === undefined) return '';

  const str = String(field);

  // If field contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

function generateCSV(count) {
  const headers = [
    'TransferWise ID', 'Date', 'Date Time', 'Amount', 'Currency',
    'Description', 'Payment Reference', 'Running Balance',
    'Exchange From', 'Exchange To', 'Exchange Rate',
    'Payer Name', 'Payee Name', 'Payee Account Number',
    'Merchant', 'Card Last Four Digits', 'Card Holder Full Name',
    'Attachment', 'Note', 'Total fees', 'Exchange To Amount',
    'Transaction Type', 'Transaction Details Type'
  ];

  // Start with a reasonable running balance
  let runningBalance = randomFloat(5000, 20000);

  // Generate transactions in reverse chronological order
  const transactions = [];
  let currentDate = null;

  for (let i = 0; i < count; i++) {
    const transaction = generateTransaction(i, runningBalance, currentDate);
    transactions.push(transaction);
    runningBalance = parseFloat(transaction['Running Balance']);

    // Sometimes use the same date for multiple transactions
    if (Math.random() > 0.3) {
      currentDate = transaction['Date'];
    } else {
      currentDate = null;
    }
  }

  // Build CSV content
  let csv = headers.map(escapeCSVField).join(',') + '\n';

  transactions.forEach(transaction => {
    const row = headers.map(header => escapeCSVField(transaction[header]));
    csv += row.join(',') + '\n';
  });

  return csv;
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const count = args[0] ? parseInt(args[0], 10) : DEFAULT_COUNT;
  const outputFile = args[1] || DEFAULT_OUTPUT;

  if (isNaN(count) || count < 1) {
    console.error('Error: Count must be a positive number');
    process.exit(1);
  }

  console.log(`Generating ${count} random Wise transactions...`);

  const csv = generateCSV(count);
  const outputPath = path.resolve(process.cwd(), outputFile);

  fs.writeFileSync(outputPath, csv, 'utf8');

  console.log(`✓ Successfully generated ${outputFile}`);
  console.log(`  Location: ${outputPath}`);
  console.log(`  Transactions: ${count}`);
  console.log(`  Size: ${(csv.length / 1024).toFixed(2)} KB`);
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { generateCSV, generateTransaction };

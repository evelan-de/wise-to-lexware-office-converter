#!/usr/bin/env python3

import csv
import sys
from datetime import datetime
import argparse
import os

def convert_date_format(date_str):
    try:
        date_obj = datetime.strptime(date_str, '%d-%m-%Y')
        return date_obj.strftime('%d.%m.%Y')
    except:
        return ''

def convert_amount_format(amount_str):
    try:
        amount = float(amount_str)
        return f'{amount:.2f}'.replace('.', ',')
    except:
        return '0,00'

def determine_transaction_party(transaction_type, payer_name, payee_name):
    if transaction_type == 'DEBIT':
        auftraggeber = 'Kontoinhaber'
        empfaenger = payee_name if payee_name else ''
    else:
        auftraggeber = payer_name if payer_name else ''
        empfaenger = 'Kontoinhaber'

    return auftraggeber, empfaenger

def convert_wise_to_lexoffice(input_file, output_file):
    transactions = []

    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)

        for row in reader:
            date = convert_date_format(row['Date'])

            if not date:
                continue

            amount = convert_amount_format(row['Amount'])

            auftraggeber, empfaenger = determine_transaction_party(
                row['Transaction Type'],
                row.get('Payer Name', ''),
                row.get('Payee Name', '')
            )

            verwendungszweck_parts = []
            if row['Description']:
                verwendungszweck_parts.append(row['Description'])
            if row['Payment Reference']:
                verwendungszweck_parts.append(f"Ref: {row['Payment Reference']}")

            verwendungszweck = ' | '.join(verwendungszweck_parts)

            zusatzinfo = ""
            if row.get('Exchange To Amount'):
                exchange_amount = convert_amount_format(row['Exchange To Amount'])
                zusatzinfo = f"Fremdbetrag: {exchange_amount} {row.get('Exchange To', '')}"

            if row['TransferWise ID']:
                if zusatzinfo:
                    zusatzinfo += f" | Wise ID: {row['TransferWise ID']}"
                else:
                    zusatzinfo = f"Wise ID: {row['TransferWise ID']}"

            transactions.append({
                'Buchungstag': date,
                'Valuta': date,
                'Auftraggeber/Zahlungsempfänger': auftraggeber,
                'Empfänger/Zahlungspflichtiger': empfaenger,
                'Vorgang/Verwendungszweck': verwendungszweck,
                'Betrag': amount,
                'Zusatzinfo (optional)': zusatzinfo
            })

    with open(output_file, 'w', encoding='utf-8', newline='') as f:
        fieldnames = [
            'Buchungstag',
            'Valuta',
            'Auftraggeber/Zahlungsempfänger',
            'Empfänger/Zahlungspflichtiger',
            'Vorgang/Verwendungszweck',
            'Betrag',
            'Zusatzinfo (optional)'
        ]

        writer = csv.DictWriter(f, fieldnames=fieldnames, delimiter=';')
        writer.writeheader()
        writer.writerows(transactions)

    return len(transactions)

def main():
    parser = argparse.ArgumentParser(
        description='Konvertiert Wise CSV-Exporte in das LexOffice Bankimport-Format'
    )
    parser.add_argument(
        'input_file',
        help='Pfad zur Wise CSV-Exportdatei'
    )
    parser.add_argument(
        '-o', '--output',
        help='Pfad zur Ausgabedatei (Standard: lexoffice_import_<timestamp>.csv)',
        default=None
    )

    args = parser.parse_args()

    if not os.path.exists(args.input_file):
        print(f"Fehler: Eingabedatei '{args.input_file}' nicht gefunden.")
        sys.exit(1)

    if args.output:
        output_file = args.output
    else:
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output_file = f'lexoffice_import_{timestamp}.csv'

    try:
        count = convert_wise_to_lexoffice(args.input_file, output_file)
        print(f"Erfolgreich {count} Transaktionen konvertiert.")
        print(f"Ausgabedatei: {output_file}")
    except Exception as e:
        print(f"Fehler bei der Konvertierung: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
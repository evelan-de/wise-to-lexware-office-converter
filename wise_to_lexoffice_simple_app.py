#!/usr/bin/env python3

import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import os
import csv
from datetime import datetime
import threading

# Import conversion logic
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


class WiseToLexOfficeApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Wise zu LexOffice Konverter")
        self.root.geometry("650x480")
        self.root.resizable(False, False)

        # Configure style
        self.root.configure(bg='#f5f5f7')

        # Variables
        self.input_file = None
        self.output_file = None

        self.setup_ui()

    def setup_ui(self):
        # Main container
        main_frame = tk.Frame(self.root, bg='#f5f5f7', padx=40, pady=30)
        main_frame.pack(fill=tk.BOTH, expand=True)

        # Title
        title_label = tk.Label(
            main_frame,
            text="Wise zu LexOffice Konverter",
            font=('Helvetica', 26, 'bold'),
            bg='#f5f5f7',
            fg='#1c1c1e'
        )
        title_label.pack(pady=(0, 5))

        subtitle_label = tk.Label(
            main_frame,
            text="Konvertiert Wise CSV-Exporte für LexOffice",
            font=('Helvetica', 13),
            bg='#f5f5f7',
            fg='#8e8e93'
        )
        subtitle_label.pack(pady=(0, 30))

        # Step 1: Input file
        step1_frame = tk.Frame(main_frame, bg='#f5f5f7')
        step1_frame.pack(fill=tk.X, pady=(0, 20))

        step1_label = tk.Label(
            step1_frame,
            text="① Wise CSV-Datei auswählen",
            font=('Helvetica', 15, 'bold'),
            bg='#f5f5f7',
            fg='#1c1c1e'
        )
        step1_label.pack(anchor=tk.W, pady=(0, 10))

        # File selection area
        file_frame = tk.Frame(step1_frame, bg='white', relief=tk.SOLID, borderwidth=1)
        file_frame.pack(fill=tk.X, pady=(0, 5))

        file_inner = tk.Frame(file_frame, bg='white', padx=15, pady=15)
        file_inner.pack(fill=tk.X)

        self.file_label = tk.Label(
            file_inner,
            text="Keine Datei ausgewählt",
            font=('Helvetica', 12),
            bg='white',
            fg='#8e8e93'
        )
        self.file_label.pack(side=tk.LEFT, fill=tk.X, expand=True)

        browse_button = tk.Button(
            file_inner,
            text="Durchsuchen...",
            font=('Helvetica', 12),
            command=self.browse_file,
            bg='#007AFF',
            fg='white',
            relief=tk.FLAT,
            padx=20,
            pady=8,
            cursor="hand2"
        )
        browse_button.pack(side=tk.RIGHT)

        # Step 2: Output
        step2_frame = tk.Frame(main_frame, bg='#f5f5f7')
        step2_frame.pack(fill=tk.X, pady=(0, 30))

        step2_label = tk.Label(
            step2_frame,
            text="② Speicherort (optional)",
            font=('Helvetica', 15, 'bold'),
            bg='#f5f5f7',
            fg='#1c1c1e'
        )
        step2_label.pack(anchor=tk.W, pady=(0, 10))

        output_frame = tk.Frame(step2_frame, bg='#f5f5f7')
        output_frame.pack(fill=tk.X)

        self.output_label = tk.Label(
            output_frame,
            text="Automatisch: lexoffice_import_[datum].csv",
            font=('Helvetica', 11),
            bg='#f5f5f7',
            fg='#8e8e93'
        )
        self.output_label.pack(side=tk.LEFT)

        change_button = tk.Button(
            output_frame,
            text="Ändern",
            font=('Helvetica', 11),
            command=self.browse_output,
            fg='#007AFF',
            bg='#f5f5f7',
            relief=tk.FLAT,
            cursor="hand2"
        )
        change_button.pack(side=tk.LEFT, padx=(10, 0))

        # Convert button
        button_frame = tk.Frame(main_frame, bg='#f5f5f7')
        button_frame.pack(pady=(0, 20))

        self.convert_button = tk.Button(
            button_frame,
            text="Konvertieren",
            font=('Helvetica', 16, 'bold'),
            command=self.convert,
            bg='#34C759',
            fg='white',
            relief=tk.FLAT,
            padx=50,
            pady=12,
            state=tk.DISABLED,
            cursor="hand2"
        )
        self.convert_button.pack()

        # Status
        self.status_label = tk.Label(
            main_frame,
            text="Bereit",
            font=('Helvetica', 12),
            bg='#f5f5f7',
            fg='#8e8e93'
        )
        self.status_label.pack(pady=(0, 10))

        # Progress bar
        self.progress = ttk.Progressbar(
            main_frame,
            mode='indeterminate',
            length=400
        )

        # Help text
        help_label = tk.Label(
            main_frame,
            text="Exportieren Sie Ihre Transaktionen aus Wise als CSV,\ndann konvertieren Sie sie hier für LexOffice.",
            font=('Helvetica', 10),
            bg='#f5f5f7',
            fg='#8e8e93',
            justify=tk.CENTER
        )
        help_label.pack(side=tk.BOTTOM)

    def browse_file(self):
        filename = filedialog.askopenfilename(
            title="Wise CSV-Datei auswählen",
            filetypes=[
                ("CSV Dateien", "*.csv"),
                ("Alle Dateien", "*.*")
            ]
        )
        if filename:
            self.set_input_file(filename)

    def set_input_file(self, filepath):
        self.input_file = filepath
        filename = os.path.basename(filepath)

        self.file_label.config(
            text=f"✓ {filename}",
            fg='#34C759'
        )
        self.convert_button.config(state=tk.NORMAL)
        self.status_label.config(text="Bereit zum Konvertieren")

        # Set default output
        if not self.output_file:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            self.output_file = os.path.join(
                os.path.dirname(filepath),
                f'lexoffice_import_{timestamp}.csv'
            )
            self.output_label.config(
                text=f"Speichern als: lexoffice_import_{timestamp}.csv"
            )

    def browse_output(self):
        filename = filedialog.asksaveasfilename(
            title="Speicherort für LexOffice-Import",
            defaultextension=".csv",
            filetypes=[
                ("CSV Dateien", "*.csv"),
                ("Alle Dateien", "*.*")
            ]
        )
        if filename:
            self.output_file = filename
            self.output_label.config(
                text=f"Speichern als: {os.path.basename(filename)}"
            )

    def convert(self):
        if not self.input_file:
            messagebox.showerror(
                "Fehler",
                "Bitte wählen Sie eine Wise CSV-Datei aus."
            )
            return

        # Show progress
        self.progress.pack(pady=(0, 10))
        self.progress.start(10)
        self.convert_button.config(state=tk.DISABLED)
        self.status_label.config(text="Konvertiere...", fg='#FF9500')

        # Run conversion in thread
        thread = threading.Thread(target=self.run_conversion)
        thread.start()

    def run_conversion(self):
        try:
            count = convert_wise_to_lexoffice(self.input_file, self.output_file)
            self.root.after(0, self.conversion_success, count)
        except Exception as e:
            self.root.after(0, self.conversion_error, str(e))

    def conversion_success(self, count):
        self.progress.stop()
        self.progress.pack_forget()
        self.convert_button.config(state=tk.NORMAL)

        self.status_label.config(
            text=f"✓ {count} Transaktionen konvertiert!",
            fg='#34C759'
        )

        result = messagebox.askyesno(
            "Erfolg!",
            f"✅ {count} Transaktionen wurden erfolgreich konvertiert.\n\n"
            f"Datei gespeichert als:\n{os.path.basename(self.output_file)}\n\n"
            "Möchten Sie den Ordner öffnen?"
        )

        if result:
            os.system(f'open -R "{self.output_file}"')

    def conversion_error(self, error):
        self.progress.stop()
        self.progress.pack_forget()
        self.convert_button.config(state=tk.NORMAL)

        self.status_label.config(
            text="Fehler bei der Konvertierung",
            fg='#FF3B30'
        )

        messagebox.showerror(
            "Fehler",
            f"Die Datei konnte nicht konvertiert werden:\n\n{error}\n\n"
            "Stellen Sie sicher, dass es eine gültige Wise CSV-Datei ist."
        )


def main():
    root = tk.Tk()
    app = WiseToLexOfficeApp(root)

    # Center window
    root.update_idletasks()
    width = root.winfo_width()
    height = root.winfo_height()
    x = (root.winfo_screenwidth() // 2) - (width // 2)
    y = (root.winfo_screenheight() // 2) - (height // 2)
    root.geometry(f'{width}x{height}+{x}+{y}')

    root.mainloop()


if __name__ == '__main__':
    main()
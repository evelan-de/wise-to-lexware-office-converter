#!/usr/bin/env python3

import os
import csv
from datetime import datetime
import webbrowser
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse
import tempfile
import threading
import time

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


HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wise zu LexOffice Konverter</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 600px;
            width: 100%;
            padding: 40px;
        }

        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 32px;
        }

        .subtitle {
            color: #666;
            margin-bottom: 40px;
            font-size: 16px;
        }

        .upload-area {
            border: 3px dashed #ddd;
            border-radius: 10px;
            padding: 40px;
            text-align: center;
            margin-bottom: 30px;
            background: #f8f9fa;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .upload-area:hover {
            border-color: #667eea;
            background: #f0f4ff;
        }

        .upload-area.dragover {
            border-color: #667eea;
            background: #e8efff;
        }

        .upload-icon {
            font-size: 48px;
            margin-bottom: 20px;
        }

        .upload-text {
            font-size: 18px;
            color: #555;
            margin-bottom: 10px;
        }

        .upload-subtext {
            font-size: 14px;
            color: #999;
        }

        #fileInput {
            display: none;
        }

        .file-info {
            background: #f0f4ff;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: none;
        }

        .file-info.show {
            display: block;
        }

        .file-name {
            font-weight: 600;
            color: #333;
        }

        .convert-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 40px;
            font-size: 18px;
            font-weight: 600;
            border-radius: 50px;
            cursor: pointer;
            display: none;
            width: 100%;
            transition: transform 0.2s;
        }

        .convert-btn:hover {
            transform: translateY(-2px);
        }

        .convert-btn.show {
            display: block;
        }

        .convert-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .status {
            text-align: center;
            margin-top: 20px;
            padding: 15px;
            border-radius: 8px;
            display: none;
        }

        .status.show {
            display: block;
        }

        .status.success {
            background: #d4edda;
            color: #155724;
        }

        .status.error {
            background: #f8d7da;
            color: #721c24;
        }

        .status.processing {
            background: #fff3cd;
            color: #856404;
        }

        .download-btn {
            background: #28a745;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            margin-top: 10px;
        }

        .steps {
            margin-top: 40px;
            padding-top: 30px;
            border-top: 1px solid #e0e0e0;
        }

        .step {
            display: flex;
            align-items: flex-start;
            margin-bottom: 15px;
        }

        .step-number {
            background: #667eea;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-right: 15px;
            flex-shrink: 0;
        }

        .step-text {
            color: #555;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Wise → LexOffice</h1>
        <p class="subtitle">Konvertiert Ihre Wise CSV-Exporte für LexOffice</p>

        <div class="upload-area" id="uploadArea">
            <div class="upload-icon">📁</div>
            <div class="upload-text">Wise CSV hier ablegen</div>
            <div class="upload-subtext">oder klicken zum Auswählen</div>
        </div>

        <input type="file" id="fileInput" accept=".csv">

        <div class="file-info" id="fileInfo">
            <span>Ausgewählte Datei: </span>
            <span class="file-name" id="fileName"></span>
        </div>

        <button class="convert-btn" id="convertBtn">Konvertieren</button>

        <div class="status" id="status"></div>

        <div class="steps">
            <div class="step">
                <div class="step-number">1</div>
                <div class="step-text">Exportieren Sie Ihre Transaktionen aus Wise als CSV</div>
            </div>
            <div class="step">
                <div class="step-number">2</div>
                <div class="step-text">Laden Sie die CSV-Datei hier hoch</div>
            </div>
            <div class="step">
                <div class="step-number">3</div>
                <div class="step-text">Klicken Sie auf Konvertieren und laden Sie das Ergebnis herunter</div>
            </div>
        </div>
    </div>

    <script>
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const fileInfo = document.getElementById('fileInfo');
        const fileName = document.getElementById('fileName');
        const convertBtn = document.getElementById('convertBtn');
        const status = document.getElementById('status');

        let selectedFile = null;

        // Click to select file
        uploadArea.addEventListener('click', () => fileInput.click());

        // File selection
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type === 'text/csv') {
                selectFile(file);
            } else {
                showStatus('Bitte wählen Sie eine CSV-Datei', 'error');
            }
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');

            const file = e.dataTransfer.files[0];
            if (file && file.type === 'text/csv') {
                selectFile(file);
            } else {
                showStatus('Bitte wählen Sie eine CSV-Datei', 'error');
            }
        });

        function selectFile(file) {
            selectedFile = file;
            fileName.textContent = file.name;
            fileInfo.classList.add('show');
            convertBtn.classList.add('show');
            status.classList.remove('show');
        }

        // Convert button
        convertBtn.addEventListener('click', async () => {
            if (!selectedFile) return;

            convertBtn.disabled = true;
            showStatus('Konvertiere...', 'processing');

            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                const response = await fetch('/convert', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'lexoffice_import_' + new Date().getTime() + '.csv';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);

                    const result = response.headers.get('X-Transaction-Count');
                    showStatus(`✅ Erfolgreich ${result} Transaktionen konvertiert!`, 'success');
                } else {
                    const error = await response.text();
                    showStatus(`❌ Fehler: ${error}`, 'error');
                }
            } catch (error) {
                showStatus(`❌ Fehler: ${error.message}`, 'error');
            } finally {
                convertBtn.disabled = false;
            }
        });

        function showStatus(message, type) {
            status.textContent = message;
            status.className = 'status show ' + type;
        }
    </script>
</body>
</html>
"""


class ConversionHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(HTML_TEMPLATE.encode())
        else:
            self.send_error(404)

    def do_POST(self):
        if self.path == '/convert':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)

                # Parse multipart form data
                boundary = self.headers['Content-Type'].split('boundary=')[1].encode()
                parts = post_data.split(b'--' + boundary)

                csv_content = None
                for part in parts:
                    if b'Content-Disposition: form-data' in part and b'name="file"' in part:
                        # Extract CSV content
                        content_start = part.find(b'\r\n\r\n') + 4
                        content_end = part.rfind(b'\r\n')
                        csv_content = part[content_start:content_end]
                        break

                if not csv_content:
                    raise Exception("Keine CSV-Datei gefunden")

                # Save uploaded file temporarily
                with tempfile.NamedTemporaryFile(mode='wb', suffix='.csv', delete=False) as tmp_input:
                    tmp_input.write(csv_content)
                    input_path = tmp_input.name

                # Create output file
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                output_path = tempfile.mktemp(suffix='.csv')

                # Convert
                count = convert_wise_to_lexoffice(input_path, output_path)

                # Read converted file
                with open(output_path, 'rb') as f:
                    converted_content = f.read()

                # Clean up
                os.unlink(input_path)
                os.unlink(output_path)

                # Send response
                self.send_response(200)
                self.send_header('Content-type', 'text/csv; charset=utf-8')
                self.send_header('Content-Disposition', f'attachment; filename="lexoffice_import_{timestamp}.csv"')
                self.send_header('X-Transaction-Count', str(count))
                self.end_headers()
                self.wfile.write(converted_content)

            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(str(e).encode())
        else:
            self.send_error(404)

    def log_message(self, format, *args):
        # Suppress default logging
        pass


def open_browser(port):
    time.sleep(1)
    webbrowser.open(f'http://localhost:{port}')


def main():
    # Try to find an available port
    import socket
    for port in range(8888, 8900):
        try:
            test_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            test_socket.bind(('', port))
            test_socket.close()
            break
        except OSError:
            continue

    server_address = ('', port)
    httpd = HTTPServer(server_address, ConversionHandler)

    print("=" * 60)
    print("Wise zu LexOffice Konverter - Web Version")
    print("=" * 60)
    print(f"\n✅ Server läuft auf: http://localhost:{port}")
    print("\n📌 Der Browser öffnet sich automatisch...")
    print("\n❌ Zum Beenden: Ctrl+C drücken")
    print("=" * 60)

    # Open browser in a separate thread
    browser_thread = threading.Thread(target=lambda: open_browser(port))
    browser_thread.daemon = True
    browser_thread.start()

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\nServer beendet.")
        httpd.shutdown()


if __name__ == '__main__':
    main()
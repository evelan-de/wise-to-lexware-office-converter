#!/bin/bash
# Wise to LexOffice Web Converter Launcher

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    osascript -e 'display dialog "Python 3 ist nicht installiert. Bitte installieren Sie Python von python.org" buttons {"OK"} default button 1 with icon stop'
    exit 1
fi

# Get the directory of this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Clear screen and show instructions
clear
echo "============================================================"
echo "           Wise zu LexOffice Konverter - Web Version"
echo "============================================================"
echo ""
echo "📌 Der Browser öffnet sich gleich automatisch..."
echo ""
echo "Falls nicht, öffnen Sie manuell: http://localhost:8888"
echo ""
echo "❌ Zum Beenden dieses Fenster schließen oder Ctrl+C drücken"
echo "============================================================"
echo ""

# Run the web application
cd "$DIR"
python3 wise_to_lexoffice_web.py
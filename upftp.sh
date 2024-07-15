#!/bin/bash

echo " "
echo " ██▓ ▄▄▄▄    ██▓     █████▒▄▄▄█████▓ ██▓███  "
echo "▓██▒▓█████▄ ▓██▒   ▓██   ▒ ▓  ██▒ ▓▒▓██░  ██▒"
echo "▒██▒▒██▒ ▄██▒██▒   ▒████ ░ ▒ ▓██░ ▒░▓██░ ██▓▒"
echo "░██░▒██░█▀  ░██░   ░▓█▒  ░ ░ ▓██▓ ░ ▒██▄█▓▒ ▒"
echo "░██░░▓█  ▀█▓░██░   ░▒█░      ▒██▒ ░ ▒██▒ ░  ░"
echo "░▓  ░▒▓███▀▒░▓      ▒ ░      ▒ ░░   ▒▓▒░ ░  ░"
echo " ▒ ░▒░▒   ░  ▒ ░    ░          ░    ░▒ ░     "
echo " ▒ ░ ░    ░  ▒ ░    ░ ░      ░      ░░       "
echo " ░   ░       ░                               "
echo "          ░                                  "
echo " "

# Variables
USER=""
PASS=""
HOST=""
LOCAL_DIR="./www"
REMOTE_DIR="./"
# REMOTE_DIR="./public_html"

# Comprobar si lftp está instalado
if ! command -v lftp &> /dev/null; then
    echo "lftp no está instalado. Instalando lftp..."
    sudo pacman -S --noconfirm lftp

    if [ $? -ne 0 ]; then
        echo "Error al instalar lftp. Saliendo..."
        exit 1
    fi
fi

# Validar y pedir valores si no están establecidos
if [ -z "$USER" ]; then
    read -p "Nombre de usuario FTP no establecido. Ingrese un nombre de usuario: " USER
    echo
fi

if [ -z "$HOST" ]; then
    read -p "Dirección IP o nombre de host no establecido. Ingrese el host: " HOST
    echo
fi

if [ -z "$LOCAL_DIR" ]; then
    read -p "Directorio local no establecido. Ingrese el directorio local: " LOCAL_DIR
    echo
fi

if [ -z "$REMOTE_DIR" ]; then
    read -p "Directorio remoto no establecido. Ingrese el directorio remoto: " REMOTE_DIR
    echo
fi

# Solicitar la contraseña si no está establecida
if [ -z "$PASS" ]; then
    read -sp "Contraseña FTP para $USER: " PASS
    echo
fi

# Ejecutar lftp
lftp -f "
set ssl:verify-certificate no
open ftp://$USER:$PASS@$HOST
cd $REMOTE_DIR
mirror -R $LOCAL_DIR .
bye
"

# Guardar los valores en la configuración
echo "Guardando los valores en la configuración..."
cat <<EOF > config.txt
USER="$USER"
HOST="$HOST"
LOCAL_DIR="$LOCAL_DIR"
REMOTE_DIR="$REMOTE_DIR"
EOF

echo "Configuración guardada en config.txt"

# Credenciales de Configuración

Este archivo contiene las credenciales necesarias para configurar el servicio. 
**IMPORTANTE**: Crea un archivo `.env` en la raíz del proyecto con estas variables.

## Variables de Entorno

```bash
# Configuración del servidor
PORT=3099
NODE_ENV=development

# ElevenLabs API
ELEVENLABS_API_KEY=sk_982fb590861db2209f173fe44c0466d34e1cca4a02ededb8
ELEVENLABS_BASE_URL=https://api.elevenlabs.io

# Twilio Configuration
TWILIO_ACCOUNT_SID=AC727ff240e4ea5eed57698f598aecf3d4
TWILIO_AUTH_TOKEN=cdbe96eebe074fb7d2a8d65947ccbc4e
```

## Cómo crear el archivo .env

1. Copia el contenido de arriba
2. Crea un archivo llamado `.env` en la raíz del proyecto
3. Pega el contenido
4. Guarda el archivo

El archivo `.env` está en `.gitignore` por seguridad y no se subirá al repositorio.


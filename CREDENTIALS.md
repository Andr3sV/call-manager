# Credenciales de Configuración

Este archivo contiene las credenciales necesarias para configurar el servicio. 
**IMPORTANTE**: Crea un archivo `.env` en la raíz del proyecto con estas variables.

## Variables de Entorno

```bash
# Configuración del servidor
PORT=3099
NODE_ENV=development

# ElevenLabs API
ELEVENLABS_API_KEY=tu_api_key_aqui
ELEVENLABS_BASE_URL=https://api.elevenlabs.io

# Twilio Configuration
TWILIO_ACCOUNT_SID=tu_account_sid_aqui
TWILIO_AUTH_TOKEN=tu_auth_token_aqui
```

## Cómo crear el archivo .env

1. Copia el contenido de arriba
2. Crea un archivo llamado `.env` en la raíz del proyecto
3. Pega el contenido
4. Guarda el archivo

El archivo `.env` está en `.gitignore` por seguridad y no se subirá al repositorio.


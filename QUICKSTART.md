# 🚀 Quick Start Guide

Guía rápida para poner en marcha el servicio en menos de 5 minutos.

## 1. Instalar dependencias

```bash
npm install
```

## 2. Configurar credenciales

Copia las credenciales desde `CREDENTIALS.md` y crea un archivo `.env` en la raíz:

```bash
# Crea el archivo .env
touch .env
```

Luego pega este contenido en `.env`:

```bash
PORT=3000
NODE_ENV=development
ELEVENLABS_API_KEY=sk_982fb590861db2209f173fe44c0466d34e1cca4a02ededb8
ELEVENLABS_BASE_URL=https://api.elevenlabs.io
TWILIO_ACCOUNT_SID=AC727ff240e4ea5eed57698f598aecf3d4
TWILIO_AUTH_TOKEN=cdbe96eebe074fb7d2a8d65947ccbc4e
```

## 3. Ejecutar en modo desarrollo

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:3099`

## 4. Probar el servicio

### Opción A: Health Check rápido

```bash
curl http://localhost:3099/health
```

Deberías ver:
```json
{
  "status": "ok",
  "timestamp": "2025-10-04T...",
  "service": "call-manager"
}
```

### Opción B: Disparar llamadas de prueba

```bash
curl -X POST http://localhost:3099/api/batch-calling/submit \
  -H "Content-Type: application/json" \
  -d '{
    "call_name": "Test desde Quick Start",
    "agent_id": "TU_AGENT_ID",
    "agent_phone_number_id": "TU_PHONE_NUMBER_ID",
    "recipients": [
      {
        "phone_number": "+1234567890",
        "dynamic_variables": {
          "nombre": "Usuario Test"
        }
      }
    ]
  }'
```

**Importante**: Reemplaza `TU_AGENT_ID` y `TU_PHONE_NUMBER_ID` con tus IDs reales de ElevenLabs.

## 5. Endpoints disponibles

Una vez el servidor esté corriendo, tienes acceso a:

- **Health Check**: `GET http://localhost:3099/health`
- **Disparar llamadas**: `POST http://localhost:3099/api/batch-calling/submit`
- **Cancelar batch**: `POST http://localhost:3099/api/batch-calling/:batchId/cancel`
- **Consultar batch**: `GET http://localhost:3099/api/batch-calling/:batchId`

## 6. Ejemplos adicionales

Abre el archivo `examples/requests.http` en VSCode con la extensión REST Client para ver más ejemplos.

O consulta `examples/simbiosia-integration.ts` para ver cómo integrar desde Simbiosia.

## Solución de problemas

### Error: "ELEVENLABS_API_KEY no está configurada"

- Verifica que el archivo `.env` existe en la raíz del proyecto
- Verifica que las credenciales están correctamente copiadas

### Error: "Cannot find module"

```bash
# Reinstala las dependencias
rm -rf node_modules
npm install
```

### El servidor no arranca

- Verifica que el puerto 3099 no esté en uso
- Puedes cambiar el puerto en `.env`: `PORT=4000`

### Error al disparar llamadas

- Verifica que tu `agent_id` y `agent_phone_number_id` son correctos
- Verifica que tu API key de ElevenLabs es válida
- Revisa los logs del servidor para más detalles

## Próximos pasos

1. Lee el `README.md` completo para documentación detallada
2. Explora `examples/simbiosia-integration.ts` para ver patrones de integración
3. Revisa `examples/requests.http` para más ejemplos de requests

## ¿Necesitas ayuda?

Consulta el `README.md` para documentación completa o contacta al equipo de desarrollo.


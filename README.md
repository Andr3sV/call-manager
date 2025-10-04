# Call Manager - Servicio de Integración con ElevenLabs

Servicio REST API para integración con ElevenLabs Conversational AI Batch Calling. Este servicio permite a Simbiosia disparar, cancelar y consultar batch de llamadas a través de ElevenLabs.

## 🚀 Características

- **Disparar Llamadas en Batch**: Envía múltiples llamadas simultáneamente
- **Cancelar Llamadas**: Cancela batch de llamadas en progreso
- **Consultar Estado**: Obtiene información detallada de batch de llamadas
- **Validación de Datos**: Validación automática de requests
- **Manejo de Errores**: Gestión robusta de errores con mensajes descriptivos
- **TypeScript**: Código tipado para mayor seguridad

## 📋 Requisitos

- Node.js >= 18.x
- npm >= 9.x
- Cuenta en ElevenLabs con API Key
- Cuenta en Twilio (opcional, según phone_provider)

## 🔧 Instalación

1. **Clonar el repositorio**:
```bash
cd call-manager
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:

Crea un archivo `.env` en la raíz del proyecto (ver `CREDENTIALS.md` para las credenciales):

```bash
PORT=3000
NODE_ENV=development
ELEVENLABS_API_KEY=tu_api_key
ELEVENLABS_BASE_URL=https://api.elevenlabs.io
TWILIO_ACCOUNT_SID=tu_account_sid
TWILIO_AUTH_TOKEN=tu_auth_token
```

4. **Compilar TypeScript** (opcional para producción):
```bash
npm run build
```

## 🏃 Ejecución

### Modo desarrollo (con hot-reload):
```bash
npm run dev
```

### Modo producción:
```bash
npm run build
npm start
```

El servidor se iniciará en `http://localhost:3099`

## 📡 Endpoints API

### Base URL
```
http://localhost:3099/api/batch-calling
```

### 1. Disparar Batch de Llamadas

**POST** `/api/batch-calling/submit`

Envía un batch de llamadas a múltiples destinatarios.

#### Request Body:
```json
{
  "call_name": "Campaña Marketing Octubre",
  "agent_id": "tu_agent_id",
  "agent_phone_number_id": "tu_phone_number_id",
  "recipients": [
    {
      "phone_number": "+1234567890",
      "dynamic_variables": {
        "nombre": "Juan",
        "empresa": "Acme Corp",
        "producto": "Premium Plan"
      }
    },
    {
      "phone_number": "+0987654321",
      "dynamic_variables": {
        "nombre": "María",
        "empresa": "Tech Inc",
        "producto": "Basic Plan"
      }
    }
  ],
  "scheduled_time_unix": 1696435200,
  "phone_provider": "twilio"
}
```

#### Parámetros:
- `call_name` (string, requerido): Nombre descriptivo del batch
- `agent_id` (string, requerido): ID del agente de ElevenLabs
- `agent_phone_number_id` (string, requerido): ID del número de teléfono
- `recipients` (array, requerido): Lista de destinatarios con sus números y variables dinámicas
  - `phone_number` (string, requerido): Número de teléfono en formato E.164
  - `dynamic_variables` (object, opcional): Variables personalizadas para cada llamada
- `scheduled_time_unix` (number, opcional): Timestamp Unix para programar las llamadas (null = inmediato)
- `phone_provider` (string, opcional): "twilio" o "sip_trunk" (null = default)

#### Response (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "batch_abc123",
    "phone_number_id": "phone_xyz789",
    "name": "Campaña Marketing Octubre",
    "agent_id": "agent_123",
    "created_at_unix": 1696431600,
    "scheduled_time_unix": 1696435200,
    "total_calls_dispatched": 0,
    "total_calls_scheduled": 2,
    "last_updated_at_unix": 1696431600,
    "status": "pending",
    "agent_name": "Mi Agente",
    "phone_provider": "twilio"
  }
}
```

#### Ejemplo cURL:
```bash
curl -X POST http://localhost:3099/api/batch-calling/submit \
  -H "Content-Type: application/json" \
  -d '{
    "call_name": "Campaña Test",
    "agent_id": "tu_agent_id",
    "agent_phone_number_id": "tu_phone_number_id",
    "recipients": [
      {
        "phone_number": "+1234567890",
        "dynamic_variables": {
          "nombre": "Juan"
        }
      }
    ],
    "scheduled_time_unix": null,
    "phone_provider": "twilio"
  }'
```

---

### 2. Cancelar Batch de Llamadas

**POST** `/api/batch-calling/:batchId/cancel`

Cancela un batch de llamadas en ejecución y marca todos los destinatarios como cancelados.

#### URL Parameters:
- `batchId` (string, requerido): ID del batch a cancelar

#### Response (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "batch_abc123",
    "phone_number_id": "phone_xyz789",
    "name": "Campaña Marketing Octubre",
    "agent_id": "agent_123",
    "created_at_unix": 1696431600,
    "scheduled_time_unix": 1696435200,
    "total_calls_dispatched": 5,
    "total_calls_scheduled": 10,
    "last_updated_at_unix": 1696432000,
    "status": "cancelled",
    "agent_name": "Mi Agente",
    "phone_provider": "twilio"
  }
}
```

#### Ejemplo cURL:
```bash
curl -X POST http://localhost:3099/api/batch-calling/batch_abc123/cancel
```

---

### 3. Consultar Información del Batch

**GET** `/api/batch-calling/:batchId`

Obtiene información detallada de un batch incluyendo todos los destinatarios y su estado.

#### URL Parameters:
- `batchId` (string, requerido): ID del batch a consultar

#### Response (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "batch_abc123",
    "phone_number_id": "phone_xyz789",
    "name": "Campaña Marketing Octubre",
    "agent_id": "agent_123",
    "created_at_unix": 1696431600,
    "scheduled_time_unix": 1696435200,
    "total_calls_dispatched": 2,
    "total_calls_scheduled": 2,
    "last_updated_at_unix": 1696432000,
    "status": "in_progress",
    "agent_name": "Mi Agente",
    "recipients": [
      {
        "id": "recipient_1",
        "phone_number": "+1234567890",
        "status": "completed",
        "created_at_unix": 1696431600,
        "updated_at_unix": 1696432000,
        "conversation_id": "conv_123"
      },
      {
        "id": "recipient_2",
        "phone_number": "+0987654321",
        "status": "in_progress",
        "created_at_unix": 1696431600,
        "updated_at_unix": 1696432000,
        "conversation_id": "conv_456"
      }
    ],
    "phone_provider": "twilio"
  }
}
```

#### Ejemplo cURL:
```bash
curl http://localhost:3099/api/batch-calling/batch_abc123
```

---

### 4. Health Check

**GET** `/health`

Verifica que el servicio está funcionando correctamente.

#### Response (200 OK):
```json
{
  "status": "ok",
  "timestamp": "2025-10-04T12:00:00.000Z",
  "service": "call-manager"
}
```

---

## 📊 Estados de Batch

Los batch de llamadas pueden tener los siguientes estados:

- `pending`: El batch está programado pero aún no ha comenzado
- `in_progress`: El batch está ejecutándose actualmente
- `completed`: Todas las llamadas del batch se han completado
- `failed`: El batch ha fallado
- `cancelled`: El batch ha sido cancelado

## 📊 Estados de Recipients

Cada destinatario individual puede tener estos estados:

- `pending`: La llamada está programada pero no ha comenzado
- `in_progress`: La llamada está en curso
- `completed`: La llamada se completó exitosamente
- `failed`: La llamada falló
- `cancelled`: La llamada fue cancelada

## 🔒 Seguridad

- Las credenciales se almacenan en variables de entorno
- El archivo `.env` está excluido del control de versiones
- Se utilizan headers de seguridad con Helmet
- CORS habilitado para permitir requests desde Simbiosia

## 🛠️ Tecnologías

- **Node.js** + **TypeScript**: Runtime y lenguaje
- **Express**: Framework web
- **Axios**: Cliente HTTP para llamadas a ElevenLabs API
- **express-validator**: Validación de requests
- **dotenv**: Manejo de variables de entorno
- **helmet**: Seguridad HTTP headers
- **cors**: Cross-Origin Resource Sharing

## 📝 Estructura del Proyecto

```
call-manager/
├── src/
│   ├── config/
│   │   └── env.ts              # Configuración de variables de entorno
│   ├── controllers/
│   │   └── batch-calling.controller.ts  # Controladores de endpoints
│   ├── routes/
│   │   └── batch-calling.routes.ts      # Definición de rutas
│   ├── services/
│   │   └── elevenlabs.service.ts        # Servicio de integración con ElevenLabs
│   ├── types/
│   │   └── elevenlabs.types.ts          # Tipos TypeScript
│   ├── app.ts                  # Configuración de Express
│   └── server.ts              # Punto de entrada
├── dist/                      # Código compilado (generado)
├── .env                       # Variables de entorno (no versionado)
├── .env.example              # Plantilla de variables de entorno
├── CREDENTIALS.md            # Credenciales del proyecto
├── package.json
├── tsconfig.json
└── README.md
```

## 🧪 Testing

Para probar los endpoints, puedes usar:

1. **cURL** (ejemplos arriba)
2. **Postman** o **Insomnia**
3. **Thunder Client** (extensión de VSCode)

### Collection de Postman

Importa estos endpoints a Postman:

```
POST http://localhost:3099/api/batch-calling/submit
POST http://localhost:3099/api/batch-calling/:batchId/cancel
GET  http://localhost:3099/api/batch-calling/:batchId
GET  http://localhost:3099/health
```

## ⚠️ Manejo de Errores

Todos los endpoints retornan errores en el siguiente formato:

```json
{
  "success": false,
  "error": "Descripción del error"
}
```

Códigos de estado HTTP:
- `200`: Éxito
- `400`: Error de validación en el request
- `404`: Recurso no encontrado
- `500`: Error interno del servidor

## 🔗 Referencias

- [ElevenLabs Batch Calling API](https://elevenlabs.io/docs/api-reference/batch-calling/create)
- [ElevenLabs Cancel Endpoint](https://elevenlabs.io/docs/api-reference/batch-calling/cancel)
- [ElevenLabs Get Endpoint](https://elevenlabs.io/docs/api-reference/batch-calling/get)

## 📄 Licencia

ISC

## 👥 Soporte

Para preguntas o problemas, contacta al equipo de desarrollo.

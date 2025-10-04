# 🧪 Prueba del Servicio

## ✅ Servidor en Ejecución

El servidor está corriendo en: **http://localhost:3099**

---

## 🎯 Prueba Rápida

### 1. Health Check
```bash
curl http://localhost:3099/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-04T...",
  "service": "call-manager"
}
```

---

## 📞 Prueba de Integración con ElevenLabs

### Paso 1: Obtener tus IDs de ElevenLabs

Necesitas:
1. **agent_id**: ID de tu agente en ElevenLabs
2. **agent_phone_number_id**: ID del número de teléfono configurado

Puedes obtenerlos desde el dashboard de ElevenLabs.

### Paso 2: Disparar una llamada de prueba

Reemplaza `TU_AGENT_ID` y `TU_PHONE_NUMBER_ID` con tus valores reales:

```bash
curl -X POST http://localhost:3099/api/batch-calling/submit \
  -H "Content-Type: application/json" \
  -d '{
    "call_name": "Prueba desde Call Manager",
    "agent_id": "TU_AGENT_ID",
    "agent_phone_number_id": "TU_PHONE_NUMBER_ID",
    "recipients": [
      {
        "phone_number": "+1234567890",
        "dynamic_variables": {
          "nombre": "Usuario de Prueba",
          "empresa": "Simbiosia",
          "mensaje": "Esta es una llamada de prueba"
        }
      }
    ],
    "scheduled_time_unix": null,
    "phone_provider": "twilio"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "id": "batch_xxx",
    "name": "Prueba desde Call Manager",
    "status": "pending",
    "total_calls_scheduled": 1,
    ...
  }
}
```

### Paso 3: Consultar el estado del batch

Usa el `id` que recibiste en la respuesta anterior:

```bash
curl http://localhost:3099/api/batch-calling/batch_xxx
```

### Paso 4: (Opcional) Cancelar el batch

```bash
curl -X POST http://localhost:3099/api/batch-calling/batch_xxx/cancel
```

---

## 📋 Checklist de Prueba

- [ ] Health check funciona
- [ ] Puedes disparar un batch de llamadas
- [ ] Puedes consultar el estado de un batch
- [ ] Puedes cancelar un batch
- [ ] Las credenciales de ElevenLabs están configuradas correctamente

---

## 🔍 Verificar Logs del Servidor

Los logs del servidor se muestran en la terminal donde ejecutaste `npm run dev`. Si ves algún error, revisa:

1. Las credenciales en `.env`
2. Que tu API key de ElevenLabs sea válida
3. Que el agent_id y phone_number_id existan en tu cuenta

---

## 🚀 Siguiente Paso: Integración con Simbiosia

Una vez que las pruebas funcionen, Simbiosia puede consumir estos endpoints desde su aplicación.

Ver `examples/simbiosia-integration.ts` para ejemplos de código.


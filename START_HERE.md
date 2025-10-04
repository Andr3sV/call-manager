# 🚀 COMIENZA AQUÍ - Call Manager

## ✅ El servicio está LISTO y FUNCIONANDO

**URL del servicio**: http://localhost:3099

---

## 🎯 ¿Qué hace este servicio?

Este servicio permite a **Simbiosia** disparar, cancelar y consultar llamadas en batch usando la API de **ElevenLabs Conversational AI**.

---

## 📡 Los 3 Endpoints que Simbiosia Usará

### 1️⃣ Disparar Llamadas
```
POST http://localhost:3099/api/batch-calling/submit
```
Envía un batch de llamadas a múltiples contactos con variables personalizadas.

### 2️⃣ Cancelar Batch
```
POST http://localhost:3099/api/batch-calling/:batchId/cancel
```
Cancela un batch de llamadas en progreso.

### 3️⃣ Consultar Estado
```
GET http://localhost:3099/api/batch-calling/:batchId
```
Obtiene información detallada del batch y el estado de cada llamada.

---

## 🏃‍♂️ Prueba Rápida (30 segundos)

El servidor ya está corriendo. Pruébalo ahora:

```bash
curl http://localhost:3099/health
```

Deberías ver:
```json
{
  "status": "ok",
  "timestamp": "...",
  "service": "call-manager"
}
```

---

## 📚 Documentación Completa

| Archivo | Descripción |
|---------|-------------|
| **RESUMEN.md** | 📋 Resumen completo del proyecto |
| **README.md** | 📖 Documentación detallada de la API |
| **QUICKSTART.md** | ⚡ Inicio rápido en 5 minutos |
| **TEST.md** | 🧪 Guía de pruebas paso a paso |
| **CREDENTIALS.md** | 🔐 Información de credenciales |
| **examples/requests.http** | 💻 Ejemplos para REST Client (VSCode) |
| **examples/simbiosia-integration.ts** | 🔗 Código para integrar desde Simbiosia |

---

## 🔥 Ejemplo Rápido para Simbiosia

```typescript
// Desde tu código en Simbiosia
import axios from 'axios';

// Disparar llamadas
const response = await axios.post('http://localhost:3099/api/batch-calling/submit', {
  call_name: 'Campaña Marketing',
  agent_id: 'tu_agent_id',
  agent_phone_number_id: 'tu_phone_id',
  recipients: [
    {
      phone_number: '+1234567890',
      dynamic_variables: {
        nombre: 'Juan Pérez',
        empresa: 'Acme Corp'
      }
    }
  ],
  scheduled_time_unix: null,  // null = inmediato
  phone_provider: 'twilio'
});

// Guardar el ID del batch
const batchId = response.data.data.id;

// Consultar estado
const status = await axios.get(`http://localhost:3099/api/batch-calling/${batchId}`);

// Cancelar si es necesario
const cancel = await axios.post(`http://localhost:3099/api/batch-calling/${batchId}/cancel`);
```

---

## ⚙️ Configuración

El servicio está configurado con:
- ✅ Puerto: **3099**
- ✅ API Key de ElevenLabs: Configurada
- ✅ Credenciales de Twilio: Configuradas
- ✅ Variables de entorno: Listas en `.env`

---

## 🎓 Próximos Pasos

1. **LEE** el archivo **RESUMEN.md** para entender el proyecto completo
2. **PRUEBA** los endpoints usando **TEST.md** como guía
3. **REVISA** `examples/simbiosia-integration.ts` para ver código de ejemplo
4. **INTEGRA** desde Simbiosia usando los ejemplos proporcionados

---

## 📞 Información Clave

### Para ElevenLabs necesitas:
- `agent_id`: ID de tu agente conversacional
- `agent_phone_number_id`: ID del número de teléfono configurado

Obtén estos valores desde tu dashboard de ElevenLabs.

### Estados de Batch:
- `pending` - Programado, no iniciado
- `in_progress` - En ejecución
- `completed` - Completado
- `failed` - Falló
- `cancelled` - Cancelado

---

## 🛠️ Comandos Útiles

```bash
# Arrancar el servidor
npm run dev

# Compilar para producción
npm run build

# Ejecutar en producción
npm start

# Detener el servidor
pkill -f "ts-node-dev"

# Ver logs
# Los logs se muestran en la terminal donde ejecutaste npm run dev
```

---

## 💡 Tips

1. Usa **REST Client** en VSCode para probar con `examples/requests.http`
2. Todos los responses tienen formato: `{ success: true/false, data/error: ... }`
3. El servicio valida automáticamente todos los parámetros
4. Los errores son descriptivos y fáciles de debuggear

---

## 🆘 ¿Problemas?

1. Revisa **QUICKSTART.md** > Sección "Solución de problemas"
2. Verifica los logs del servidor
3. Confirma que las credenciales en `.env` son correctas
4. Prueba el health check primero

---

## ✨ Características Destacadas

- ✅ Validación automática de requests
- ✅ Manejo robusto de errores
- ✅ TypeScript para seguridad
- ✅ Documentación completa
- ✅ Ejemplos de código
- ✅ CORS habilitado
- ✅ Headers de seguridad
- ✅ Docker ready

---

**🎉 ¡El servicio está listo para integrarse con Simbiosia!**

**Estado**: 🟢 ACTIVO en http://localhost:3099


# 🐛 Issue Resuelto: Error al Cancelar Batch

## 📋 Problema Reportado

Cuando Simbiosia intentaba cancelar un batch de llamadas, el servicio Call Manager devolvía un error 500 con un mensaje no útil:

```json
{
  "success": false,
  "error": "Error al cancelar batch de llamadas: [object Object] (Status: 400)"
}
```

**Código de respuesta**: `500 Internal Server Error`

---

## 🔍 Causa Raíz

El problema tenía dos partes:

### 1. Manejo Incorrecto de Errores de ElevenLabs

El servicio no estaba parseando correctamente los errores que devolvía la API de ElevenLabs. Cuando ElevenLabs devolvía un error 400, nuestro código intentaba mostrar el objeto de error directamente, resultando en `[object Object]`.

```typescript
// ❌ ANTES (Código problemático)
const message = errorData?.detail || errorData?.message || defaultMessage;
// Si errorData era un objeto complejo, mostraba "[object Object]"
```

### 2. Códigos HTTP Incorrectos

Cuando ElevenLabs devolvía un error 400 (Bad Request), nuestro servicio lo envolvía en un error 500 (Internal Server Error), lo cual era incorrecto.

---

## ✅ Solución Implementada

### 1. Mejor Parseo de Errores

Ahora el servicio maneja múltiples formatos de error de ElevenLabs:

```typescript
// ✅ DESPUÉS (Código mejorado)
if (errorData) {
  if (typeof errorData === "string") {
    message = errorData;
  } else if (errorData.detail) {
    message = errorData.detail;
  } else if (errorData.message) {
    message = errorData.message;
  } else {
    // Convertir objeto complejo a JSON legible
    message = JSON.stringify(errorData);
  }
}
```

### 2. Códigos HTTP Correctos

El servicio ahora devuelve el código HTTP apropiado según el error de ElevenLabs:

- **400** (Bad Request) → Si ElevenLabs devuelve 400
- **404** (Not Found) → Si el batch no existe
- **500** (Internal Server Error) → Solo para errores reales del servidor

```typescript
// Determinar código de estado apropiado
let statusCode = 500;
if (errorMessage.includes("Status: 400")) {
  statusCode = 400;
} else if (errorMessage.includes("Status: 404")) {
  statusCode = 404;
}
```

### 3. Logs Detallados para Debugging

Ahora el servicio registra información detallada en los logs de Railway:

```typescript
console.log(`🔄 Solicitud de cancelación para batch: ${batchId}`);
console.error(`❌ Error al cancelar batch:`, {
  status: error.response?.status,
  statusText: error.response?.statusText,
  data: error.response?.data,
  url: error.config?.url,
});
```

---

## 📊 Respuestas Ahora

### Cancelación Exitosa (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "btcal_xxx",
    "status": "cancelled",
    ...
  },
  "message": "Batch cancelado exitosamente"
}
```

### Error 400 - Batch No Se Puede Cancelar

```json
{
  "success": false,
  "error": "Error al cancelar batch de llamadas: Batch cannot be cancelled in current state (Status: 400)"
}
```

**Código HTTP**: `400` (ya no 500)

### Error 404 - Batch No Existe

```json
{
  "success": false,
  "error": "Error al cancelar batch de llamadas: Batch not found (Status: 404)"
}
```

**Código HTTP**: `404`

---

## 🎯 Para el Desarrollador de Simbiosia

### Lo que cambió:

1. **Mensajes de error claros**: Ahora verás el error real de ElevenLabs en lugar de `[object Object]`

2. **Códigos HTTP correctos**:

   - Antes: Siempre `500`
   - Ahora: `400`, `404`, o `500` según el error real

3. **Mejor manejo en Simbiosia**: Puedes diferenciar errores:
   ```typescript
   try {
     await cancelBatch(batchId);
   } catch (error) {
     if (error.response?.status === 400) {
       // El batch no se puede cancelar (ya cancelado, ya completado, etc.)
       console.log("Batch no se puede cancelar:", error.response.data.error);
     } else if (error.response?.status === 404) {
       // El batch no existe
       console.log("Batch no encontrado");
     } else {
       // Error real del servidor
       console.log("Error del servidor");
     }
   }
   ```

### ¿Por qué ElevenLabs devuelve 400 al cancelar?

Posibles razones:

- ✅ **Batch ya cancelado**: No se puede cancelar dos veces
- ✅ **Batch completado**: Todas las llamadas ya terminaron
- ✅ **Estado no cancelable**: El batch está en un estado que no permite cancelación
- ✅ **Sin llamadas activas**: No hay llamadas en progreso para cancelar

### Recomendación para Simbiosia:

Antes de intentar cancelar, consulta el estado del batch:

```typescript
// 1. Consultar estado primero
const batchInfo = await getBatchInfo(batchId);

// 2. Verificar si se puede cancelar
if (
  batchInfo.data.status === "in_progress" ||
  batchInfo.data.status === "pending"
) {
  // Intentar cancelar
  await cancelBatch(batchId);
} else {
  // No se puede cancelar
  console.log(`Batch ya está en estado: ${batchInfo.data.status}`);
}
```

---

## 🔄 Deploy

- **Fecha**: 4 de Octubre 2025
- **Versión**: Desplegada en Railway
- **Estado**: ✅ Productivo
- **URL**: https://call-manager-production.up.railway.app

---

## 🧪 Para Probar

```bash
# Intentar cancelar un batch
curl -X POST https://call-manager-production.up.railway.app/api/batch-calling/btcal_xxx/cancel

# Ahora verás mensajes de error claros y códigos HTTP correctos
```

---

## 📝 Notas Adicionales

- Los logs en Railway ahora muestran información detallada de cada intento de cancelación
- Si encuentras otro error, revisa los logs en Railway para ver el mensaje exacto de ElevenLabs
- El servicio ahora es más robusto y fácil de debuggear

---

**✅ Issue Resuelto y Desplegado**

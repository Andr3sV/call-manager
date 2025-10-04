# 🔧 CORRECCIÓN CRÍTICA: Estructura de Dynamic Variables

## ❌ Error Encontrado

**El problema NO era la configuración del agente**, sino la **estructura del JSON**.

### ❌ Estructura INCORRECTA (que estábamos usando):
```json
{
  "recipients": [
    {
      "phone_number": "+34631021622",
      "dynamic_variables": {
        "name": "Contacto 1",
        "empresa": "Prueba"
      }
    }
  ]
}
```

### ✅ Estructura CORRECTA (según documentación de ElevenLabs):
```json
{
  "recipients": [
    {
      "phone_number": "+34631021622",
      "conversation_initiation_client_data": {
        "dynamic_variables": {
          "name": "Contacto 1",
          "empresa": "Prueba"
        }
      }
    }
  ]
}
```

## 🎯 La Diferencia Clave

Las `dynamic_variables` deben estar **dentro de** `conversation_initiation_client_data`, no directamente en el recipient.

---

## ✅ Prueba con la Estructura Correcta

```bash
curl -X POST http://localhost:3099/api/batch-calling/submit \
  -H "Content-Type: application/json" \
  -d '{
    "call_name": "Prueba con estructura correcta",
    "agent_id": "agent_7601k25cevrcff1rkacn9dds2kmn",
    "agent_phone_number_id": "phnum_8201k60jr2awf84srfjy6jbnfhtr",
    "recipients": [
      {
        "phone_number": "+34631021622",
        "conversation_initiation_client_data": {
          "dynamic_variables": {
            "name": "Contacto 1",
            "empresa": "Prueba"
          }
        }
      },
      {
        "phone_number": "+34612215815",
        "conversation_initiation_client_data": {
          "dynamic_variables": {
            "name": "Contacto 2",
            "empresa": "Prueba"
          }
        }
      }
    ],
    "phone_provider": "twilio"
  }'
```

---

## 📋 Cambios Aplicados

### 1. Tipos TypeScript actualizados ✅
- `src/types/elevenlabs.types.ts` ahora refleja la estructura correcta

### 2. Documentación corregida ✅
- `README.md` con ejemplos actualizados
- `examples/requests.http` con estructura correcta
- `examples/simbiosia-integration.ts` (por actualizar)

### 3. Validación actualizada ✅
- `src/routes/batch-calling.routes.ts` valida la estructura correcta

---

## 🔄 Migración para Simbiosia

Si ya tienes código enviando dynamic_variables, cámbialo de:

```typescript
// ❌ Antes (INCORRECTO)
{
  phone_number: "+34631021622",
  dynamic_variables: {
    name: "Juan",
    empresa: "Acme"
  }
}
```

A:

```typescript
// ✅ Ahora (CORRECTO)
{
  phone_number: "+34631021622",
  conversation_initiation_client_data: {
    dynamic_variables: {
      name: "Juan",
      empresa: "Acme"
    }
  }
}
```

---

## 🧪 Prueba Inmediata

Copia y pega esto ahora:

```bash
curl -X POST http://localhost:3099/api/batch-calling/submit \
  -H "Content-Type: application/json" \
  -d '{
    "call_name": "Test Estructura Correcta",
    "agent_id": "agent_7601k25cevrcff1rkacn9dds2kmn",
    "agent_phone_number_id": "phnum_8201k60jr2awf84srfjy6jbnfhtr",
    "recipients": [
      {
        "phone_number": "+34631021622",
        "conversation_initiation_client_data": {
          "dynamic_variables": {
            "name": "Contacto Test"
          }
        }
      }
    ],
    "phone_provider": "twilio"
  }'
```

**Ahora debería funcionar correctamente** ✅

---

## 💡 ¿Por qué no funcionaba antes?

1. La API de ElevenLabs requiere `conversation_initiation_client_data` como contenedor
2. Dentro de `conversation_initiation_client_data` va `dynamic_variables`
3. Al enviar `dynamic_variables` directamente en el recipient, ElevenLabs lo ignora o causa errores
4. Esto causaba que las llamadas se cuelguen

---

## 📚 Referencias

Ver la documentación oficial de ElevenLabs:
- [Batch Calling Submit](https://elevenlabs.io/docs/api-reference/batch-calling/create)
- Revisa el campo `conversation_initiation_client_data` en los recipients

---

## ✅ TODO Resuelto

- [x] Identificar la estructura incorrecta
- [x] Actualizar tipos TypeScript
- [x] Corregir validaciones
- [x] Actualizar ejemplos en README
- [x] Actualizar examples/requests.http
- [ ] Probar con llamada real (próximo paso)

---

**¡Gracias por detectar esto!** 🎉 
La estructura ahora es correcta según la documentación de ElevenLabs.


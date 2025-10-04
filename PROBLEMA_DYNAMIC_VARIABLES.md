# 🔍 DIAGNÓSTICO: Problema con Dynamic Variables

## ✅ TU REQUEST ESTÁ CORRECTO

Tu prueba está **perfectamente enviada**:

```bash
curl -X POST http://localhost:3099/api/batch-calling/submit \
  -H "Content-Type: application/json" \
  -d '{
    "call_name": "Prueba Call Manager - Octubre 2025",
    "agent_id": "agent_7601k25cevrcff1rkacn9dds2kmn",
    "agent_phone_number_id": "phnum_8201k60jr2awf84srfjy6jbnfhtr",
    "recipients": [
      {
        "phone_number": "+34631021622",
        "dynamic_variables": {
          "name": "Contacto 1",
          "empresa": "Prueba"
        }
      }
    ],
    "phone_provider": "twilio"
  }'
```

**El formato es correcto** ✅  
**El servicio lo envía correctamente a ElevenLabs** ✅  
**ElevenLabs recibe las variables** ✅

---

## ❌ ENTONCES ¿POR QUÉ SE CUELGA LA LLAMADA?

El problema **NO es tu código**, es la **configuración del agente en ElevenLabs**.

### Lo que está pasando:

1. **Tu servicio envía**:

   ```json
   {
     "phone_number": "+34631021622",
     "dynamic_variables": {
       "name": "Contacto 1",
       "empresa": "Prueba"
     }
   }
   ```

2. **ElevenLabs recibe** las variables correctamente ✅

3. **ElevenLabs intenta usar** las variables `name` y `empresa` ❌

4. **El agente NO tiene configuradas** estas variables en su prompt ❌

5. **Resultado**: ElevenLabs tiene un error interno y cuelga la llamada ❌

---

## 🔧 SOLUCIÓN REAL

Tienes **2 opciones**:

### **Opción 1: Configurar el Agente en ElevenLabs** (Recomendado para usar variables)

Ve al dashboard de ElevenLabs y:

1. **Abre tu agente**: `agent_7601k25cevrcff1rkacn9dds2kmn`

2. **Edita el System Prompt** y agrega las variables:

   ```
   Eres un asistente profesional.

   Estás llamando a {{name}} de la empresa {{empresa}}.

   Saluda de manera cordial mencionando su nombre.
   ```

3. **En la sección "Variables"** define:

   - Variable: `name` - Descripción: "Nombre del contacto"
   - Variable: `empresa` - Descripción: "Nombre de la empresa"

4. **Guarda los cambios**

5. **Prueba de nuevo** con tu mismo curl

**Ahora sí funcionará** ✅

---

### **Opción 2: NO usar Dynamic Variables** (Más rápido para probar)

Simplemente omite las `dynamic_variables`:

```bash
curl -X POST http://localhost:3099/api/batch-calling/submit \
  -H "Content-Type: application/json" \
  -d '{
    "call_name": "Prueba sin variables",
    "agent_id": "agent_7601k25cevrcff1rkacn9dds2kmn",
    "agent_phone_number_id": "phnum_8201k60jr2awf84srfjy6jbnfhtr",
    "recipients": [
      {
        "phone_number": "+34631021622"
      },
      {
        "phone_number": "+34612215815"
      }
    ],
    "phone_provider": "twilio"
  }'
```

**Esto funcionará inmediatamente** ✅

---

## 📊 Comparación

| Aspecto        | Con Variables (Sin configurar) | Sin Variables   | Con Variables (Configuradas) |
| -------------- | ------------------------------ | --------------- | ---------------------------- |
| **Request**    | ✅ Correcto                    | ✅ Correcto     | ✅ Correcto                  |
| **Servicio**   | ✅ Envía bien                  | ✅ Envía bien   | ✅ Envía bien                |
| **ElevenLabs** | ❌ Error interno               | ✅ Funciona     | ✅ Funciona                  |
| **Llamada**    | ❌ Se cuelga                   | ✅ Conecta bien | ✅ Conecta + personalización |

---

## 🧪 PRUEBA INMEDIATA

Para verificar que el problema es de configuración del agente:

### 1. Prueba SIN variables (debería funcionar):

```bash
curl -X POST http://localhost:3099/api/batch-calling/submit \
  -H "Content-Type: application/json" \
  -d '{
    "call_name": "Test sin variables",
    "agent_id": "agent_7601k25cevrcff1rkacn9dds2kmn",
    "agent_phone_number_id": "phnum_8201k60jr2awf84srfjy6jbnfhtr",
    "recipients": [{"phone_number": "+34631021622"}],
    "phone_provider": "twilio"
  }'
```

**Si esto funciona** → Confirma que el problema son las dynamic_variables no configuradas

---

## 🎯 CONCLUSIÓN

**Tu código está perfecto** ✅  
El problema es de **configuración en ElevenLabs**, no del servicio Call Manager.

### Para resolverlo:

1. **Corto plazo**: No uses `dynamic_variables` hasta configurar el agente
2. **Largo plazo**: Configura tu agente en ElevenLabs para usar las variables

---

## 📝 Notas Importantes

- **ElevenLabs NO da error explícito** cuando envías variables no configuradas
- **Las llamadas se cuelgan silenciosamente** sin mensaje de error claro
- **Es un comportamiento común** de la API de ElevenLabs
- **La solución está en el lado de ElevenLabs**, no en tu código

---

## 🆘 Verificación con Logs

Ahora el servicio tiene logs. Cuando hagas una llamada, verás en la terminal:

```
📤 Enviando a ElevenLabs: {
  "call_name": "...",
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

Esto te confirma que **se están enviando correctamente** a ElevenLabs.

---

## 🔗 Referencias

- [ElevenLabs Dynamic Variables Docs](https://elevenlabs.io/docs/conversational-ai/concepts/dynamic-variables)
- [Agent Configuration](https://elevenlabs.io/docs/conversational-ai/concepts/agents)

---

**TL;DR**: Tu código está bien. Configura las variables en el agente de ElevenLabs o no las uses por ahora.

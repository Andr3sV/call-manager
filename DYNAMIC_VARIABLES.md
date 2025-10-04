# 🔧 Guía de Dynamic Variables en ElevenLabs

## 🚨 Problema Común: Llamadas que se Cuelgan

### Síntoma
Las llamadas se establecen correctamente pero **se cuelgan inmediatamente** cuando se contestan si usas `dynamic_variables`.

### Causa
El agente de ElevenLabs **no está configurado** para recibir y usar dynamic variables en su prompt.

---

## ✅ Soluciones

### **Opción 1: No usar dynamic_variables (Más Simple)**

Realiza llamadas sin variables dinámicas:

```bash
curl -X POST http://localhost:3099/api/batch-calling/submit \
  -H "Content-Type: application/json" \
  -d '{
    "call_name": "Llamadas sin variables",
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

### **Opción 2: Usar el flag include_dynamic_variables**

Puedes incluir las variables en el request pero deshabilitarlas:

```bash
curl -X POST http://localhost:3099/api/batch-calling/submit \
  -H "Content-Type: application/json" \
  -d '{
    "call_name": "Llamadas sin variables dinámicas",
    "agent_id": "agent_7601k25cevrcff1rkacn9dds2kmn",
    "agent_phone_number_id": "phnum_8201k60jr2awf84srfjy6jbnfhtr",
    "recipients": [
      {
        "phone_number": "+34631021622",
        "dynamic_variables": {
          "nombre": "Juan"
        }
      }
    ],
    "include_dynamic_variables": false,
    "phone_provider": "twilio"
  }'
```

Con `include_dynamic_variables: false`, el servicio **eliminará automáticamente** todas las dynamic_variables antes de enviar a ElevenLabs.

### **Opción 3: Configurar el Agente en ElevenLabs (Recomendado a largo plazo)**

Para poder usar dynamic_variables correctamente:

#### 1. Ve al Dashboard de ElevenLabs
   - Accede a tu agente conversacional
   - Edita la configuración del agente

#### 2. Actualiza el Prompt del Agente

Incluye las variables en el prompt usando la sintaxis `{{variable}}`:

**Ejemplo de prompt:**

```
Eres un asistente de ventas profesional. 

Tu objetivo es contactar a {{nombre}} de la empresa {{empresa}} 
para ofrecerle nuestro {{producto}}.

Saluda al cliente de manera amigable usando su nombre.
```

#### 3. Define las Variables en la Configuración

En la sección de "Variables" del agente, define:
- `nombre`: Nombre del contacto
- `empresa`: Nombre de la empresa
- `producto`: Producto a ofrecer

#### 4. Guarda y Prueba

Una vez configurado, las llamadas funcionarán con dynamic_variables:

```bash
curl -X POST http://localhost:3099/api/batch-calling/submit \
  -H "Content-Type: application/json" \
  -d '{
    "call_name": "Llamadas con variables",
    "agent_id": "agent_7601k25cevrcff1rkacn9dds2kmn",
    "agent_phone_number_id": "phnum_8201k60jr2awf84srfjy6jbnfhtr",
    "recipients": [
      {
        "phone_number": "+34631021622",
        "dynamic_variables": {
          "nombre": "Juan Pérez",
          "empresa": "Acme Corp",
          "producto": "Plan Premium"
        }
      }
    ],
    "phone_provider": "twilio"
  }'
```

---

## 🧪 Testing: Comparación de Requests

### ❌ Con Variables (Sin configurar el agente)
```json
{
  "call_name": "Test",
  "agent_id": "agent_xxx",
  "agent_phone_number_id": "phnum_xxx",
  "recipients": [
    {
      "phone_number": "+34631021622",
      "dynamic_variables": {
        "nombre": "Juan"
      }
    }
  ]
}
```
**Resultado**: La llamada se cuelga al contestar ❌

### ✅ Sin Variables
```json
{
  "call_name": "Test",
  "agent_id": "agent_xxx",
  "agent_phone_number_id": "phnum_xxx",
  "recipients": [
    {
      "phone_number": "+34631021622"
    }
  ]
}
```
**Resultado**: La llamada funciona correctamente ✅

### ✅ Con Variables pero deshabilitadas
```json
{
  "call_name": "Test",
  "agent_id": "agent_xxx",
  "agent_phone_number_id": "phnum_xxx",
  "recipients": [
    {
      "phone_number": "+34631021622",
      "dynamic_variables": {
        "nombre": "Juan"
      }
    }
  ],
  "include_dynamic_variables": false
}
```
**Resultado**: Las variables se ignoran, la llamada funciona ✅

---

## 📋 Checklist para Usar Dynamic Variables

- [ ] El agente en ElevenLabs tiene un prompt que usa `{{variable}}`
- [ ] Las variables están definidas en la configuración del agente
- [ ] Las variables enviadas coinciden con las definidas en el agente
- [ ] Has probado con una llamada de prueba

---

## 💡 Recomendación

**Para empezar**: Usa llamadas **sin dynamic_variables** hasta que configures correctamente tu agente en ElevenLabs.

**Para producción**: Configura tu agente en ElevenLabs para aprovechar la personalización de llamadas con dynamic_variables.

---

## 🔍 Debugging

Si las llamadas se siguen colgando:

1. **Verifica el agente en ElevenLabs**: 
   - ¿El prompt usa las variables?
   - ¿Las variables están definidas?

2. **Prueba sin variables primero**:
   ```bash
   # Sin variables
   curl -X POST http://localhost:3099/api/batch-calling/submit \
     -H "Content-Type: application/json" \
     -d '{ ..., "recipients": [{"phone_number": "+34631021622"}] }'
   ```

3. **Consulta los logs de ElevenLabs**:
   - Ve al dashboard de ElevenLabs
   - Revisa los logs de las conversaciones
   - Busca errores relacionados con variables

---

## 📞 Ejemplos Prácticos

### Ejemplo 1: Recordatorios (Sin variables)
```json
{
  "call_name": "Recordatorios de Citas",
  "agent_id": "agent_7601k25cevrcff1rkacn9dds2kmn",
  "agent_phone_number_id": "phnum_8201k60jr2awf84srfjy6jbnfhtr",
  "recipients": [
    {"phone_number": "+34631021622"},
    {"phone_number": "+34612215815"}
  ],
  "phone_provider": "twilio"
}
```

### Ejemplo 2: Ventas (Con variables configuradas)
```json
{
  "call_name": "Campaña Ventas",
  "agent_id": "agent_configurado_con_variables",
  "agent_phone_number_id": "phnum_8201k60jr2awf84srfjy6jbnfhtr",
  "recipients": [
    {
      "phone_number": "+34631021622",
      "dynamic_variables": {
        "nombre": "Juan",
        "empresa": "TechCorp",
        "producto": "CRM Premium",
        "descuento": "20%"
      }
    }
  ],
  "phone_provider": "twilio"
}
```

---

## 🆘 Soporte

Si después de seguir esta guía sigues teniendo problemas:
1. Contacta al soporte de ElevenLabs
2. Verifica la configuración de tu agente
3. Prueba con llamadas manuales desde el dashboard de ElevenLabs primero


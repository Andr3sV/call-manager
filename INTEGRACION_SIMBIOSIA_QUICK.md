# ⚡ Integración Rápida para Simbiosia

## 🎯 Lo Esencial en 5 Minutos

### URL del Servicio

```
https://call-manager-production.up.railway.app/api/batch-calling
```

---

## 📞 Disparar Llamadas (Lo Único que Necesitas)

### JavaScript/TypeScript

```typescript
import axios from "axios";

const response = await axios.post(
  "https://call-manager-production.up.railway.app/api/batch-calling/submit",
  {
    call_name: "Mi Campaña",
    agent_id: "agent_2401k62pf0zdfbdbatjs81prh8ka",
    agent_phone_number_id: "phnum_5501k6qntkmyfq69yfj3xs8rw4kh",
    recipients: [
      {
        phone_number: "+34631021622",
        conversation_initiation_client_data: {
          dynamic_variables: {
            name: "Juan",
            empresa: "Acme",
          },
        },
      },
    ],
    phone_provider: "sip_trunk",
  }
);

const batchId = response.data.data.id; // Guarda esto para consultar después
```

### Python

```python
import requests

response = requests.post(
    'https://call-manager-production.up.railway.app/api/batch-calling/submit',
    json={
        'call_name': 'Mi Campaña',
        'agent_id': 'agent_2401k62pf0zdfbdbatjs81prh8ka',
        'agent_phone_number_id': 'phnum_5501k6qntkmyfq69yfj3xs8rw4kh',
        'recipients': [
            {
                'phone_number': '+34631021622',
                'conversation_initiation_client_data': {
                    'dynamic_variables': {
                        'name': 'Juan',
                        'empresa': 'Acme'
                    }
                }
            }
        ],
        'phone_provider': 'sip_trunk'
    }
)

batch_id = response.json()['data']['id']
```

---

## 📊 Consultar Estado

```typescript
const response = await axios.get(
  `https://call-manager-production.up.railway.app/api/batch-calling/${batchId}`
);

console.log(response.data.data.status); // pending, in_progress, completed
console.log(response.data.data.recipients); // Array con estado de cada llamada
```

---

## 🛑 Cancelar Batch

```typescript
await axios.post(
  `https://call-manager-production.up.railway.app/api/batch-calling/${batchId}/cancel`
);
```

---

## ✅ Eso es Todo

Tres endpoints simples:

1. **POST** `/submit` - Disparar llamadas
2. **GET** `/:batchId` - Consultar estado
3. **POST** `/:batchId/cancel` - Cancelar

Ver `DOCS_PARA_SIMBIOSIA.md` para documentación completa.

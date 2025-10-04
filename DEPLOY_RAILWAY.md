# 🚀 Deploy en Railway - Guía Completa

## ✅ Paso 1: Preparar el Repositorio

### 1.1 Inicializar Git (si no lo has hecho)

```bash
cd /Users/andresvillamizar/repos/call-manager
git init
git add .
git commit -m "Initial commit: Call Manager service"
```

### 1.2 Crear repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre: `call-manager`
3. Descripción: "Servicio de integración con ElevenLabs para Simbiosia"
4. **Privado** (recomendado, tiene credenciales sensibles)
5. Crea el repositorio

### 1.3 Subir a GitHub

```bash
git remote add origin https://github.com/TU_USUARIO/call-manager.git
git branch -M main
git push -u origin main
```

---

## 🚂 Paso 2: Deploy en Railway

### 2.1 Crear cuenta en Railway

1. Ve a https://railway.app
2. Regístrate con tu cuenta de GitHub (es gratis)
3. Confirma tu email

### 2.2 Crear nuevo proyecto

1. Click en **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Conecta tu cuenta de GitHub si es necesario
4. Selecciona el repositorio `call-manager`
5. Click en **"Deploy Now"**

### 2.3 Configurar Variables de Entorno

En el dashboard de Railway:

1. Ve a la pestaña **"Variables"**
2. Agrega estas variables una por una:

```
NODE_ENV=production
PORT=3099
ELEVENLABS_API_KEY=tu_elevenlabs_api_key_aqui
ELEVENLABS_BASE_URL=https://api.elevenlabs.io
TWILIO_ACCOUNT_SID=tu_twilio_account_sid_aqui
TWILIO_AUTH_TOKEN=tu_twilio_auth_token_aqui
```

3. Click **"Add"** después de cada variable

### 2.4 Configurar Build y Start Commands

Railway debería detectarlos automáticamente, pero verifica:

- **Build Command**: `npm run build`
- **Start Command**: `npm start`

Si no los detecta:

1. Ve a **"Settings"**
2. En **"Build Command"**: `npm run build`
3. En **"Start Command"**: `npm start`

### 2.5 Esperar el Deploy

El deploy tomará 2-3 minutos. Verás logs en tiempo real.

Cuando termine, verás: ✅ **Deployed**

---

## 🌐 Paso 3: Obtener la URL del Servicio

### 3.1 Generar URL pública

1. En el dashboard del proyecto, ve a **"Settings"**
2. Scroll hasta **"Networking"**
3. Click en **"Generate Domain"**
4. Railway te dará una URL como: `https://call-manager-production.up.railway.app`

### 3.2 Probar el servicio

```bash
# Reemplaza con tu URL de Railway
curl https://call-manager-production.up.railway.app/health
```

Deberías ver:

```json
{
  "status": "ok",
  "timestamp": "2025-10-04T...",
  "service": "call-manager"
}
```

---

## ✅ Paso 4: Configurar en Simbiosia

Ahora Simbiosia puede usar esta URL:

**Base URL**: `https://call-manager-production.up.railway.app/api/batch-calling`

### Ejemplo de uso desde Simbiosia:

```typescript
// En Simbiosia
const CALL_MANAGER_URL = 'https://call-manager-production.up.railway.app/api/batch-calling';

// Disparar llamadas
const response = await axios.post(`${CALL_MANAGER_URL}/submit`, {
  call_name: 'Campaña desde Simbiosia',
  agent_id: 'agent_xxx',
  agent_phone_number_id: 'phnum_xxx',
  recipients: [...],
  phone_provider: 'sip_trunk'
});
```

---

## 🔄 Paso 5: Auto-Deploy (Opcional pero Recomendado)

Railway ya está configurado para auto-deploy. Cada vez que hagas `git push`:

```bash
# Hacer cambios
git add .
git commit -m "Actualización del servicio"
git push

# Railway automáticamente:
# 1. Detecta el push
# 2. Hace build
# 3. Despliega la nueva versión
```

---

## 📊 Monitoreo

### Ver logs en tiempo real:

1. En Railway dashboard
2. Ve a **"Deployments"**
3. Click en el deployment activo
4. Verás logs en tiempo real

### Comandos útiles:

```bash
# Ver logs
railway logs

# Conectar a la terminal del container
railway shell
```

---

## 💰 Costos

**Railway - Tier Gratuito:**

- $5 USD de crédito mensual (gratis)
- ~500 horas de ejecución
- Perfecto para este servicio

**Si excedes el tier gratuito:**

- ~$5-10 USD/mes dependiendo del uso
- Solo pagas por lo que usas

---

## 🔒 Seguridad

### Consideraciones importantes:

1. ✅ El `.env` NO se sube a GitHub (está en `.gitignore`)
2. ✅ Las variables de entorno están en Railway
3. ⚠️ Considera agregar autenticación si lo necesitas
4. ⚠️ Railway genera HTTPS automáticamente

### Agregar autenticación básica (opcional):

Si quieres que solo Simbiosia pueda usar el servicio, puedes agregar un API Key.

---

## 🧪 Prueba Completa

Una vez desplegado:

```bash
# 1. Health check
curl https://TU-URL.up.railway.app/health

# 2. Disparar llamadas
curl -X POST https://TU-URL.up.railway.app/api/batch-calling/submit \
  -H "Content-Type: application/json" \
  -d '{
    "call_name": "Test desde Railway",
    "agent_id": "agent_2401k62pf0zdfbdbatjs81prh8ka",
    "agent_phone_number_id": "phnum_5501k6qntkmyfq69yfj3xs8rw4kh",
    "recipients": [
      {
        "phone_number": "+34631021622",
        "conversation_initiation_client_data": {
          "dynamic_variables": {
            "name": "Test Deploy"
          }
        }
      }
    ],
    "phone_provider": "sip_trunk"
  }'

# 3. Consultar batch
curl https://TU-URL.up.railway.app/api/batch-calling/BATCH_ID
```

---

## 🆘 Troubleshooting

### El servicio no arranca:

1. Verifica las variables de entorno en Railway
2. Revisa los logs: `railway logs`
3. Verifica que el `PORT` esté configurado

### Error de build:

```bash
# Localmente, verifica que compile:
npm run build
npm start
```

### No genera URL:

1. Ve a Settings > Networking
2. Click en "Generate Domain"

---

## ✅ Checklist Final

- [ ] Repositorio en GitHub
- [ ] Proyecto creado en Railway
- [ ] Variables de entorno configuradas
- [ ] Deploy exitoso
- [ ] URL pública generada
- [ ] Health check funciona
- [ ] Prueba de llamada exitosa
- [ ] URL configurada en Simbiosia

---

## 🎉 ¡Listo!

Tu servicio Call Manager está ahora desplegado y listo para ser usado por Simbiosia.

**URL del servicio**: `https://TU-URL.up.railway.app/api/batch-calling`

Comparte esta URL con el equipo de Simbiosia para que puedan integrarla.

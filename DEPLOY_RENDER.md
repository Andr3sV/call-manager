# 🚀 Deploy en Render - Guía Alternativa

## Si prefieres usar Render en lugar de Railway

Render es otra excelente opción, muy similar a Railway.

---

## ✅ Paso 1: Preparar el Repositorio

### 1.1 Subir a GitHub (si no lo has hecho)

```bash
cd /Users/andresvillamizar/repos/call-manager
git init
git add .
git commit -m "Initial commit: Call Manager service"
git remote add origin https://github.com/TU_USUARIO/call-manager.git
git branch -M main
git push -u origin main
```

---

## 🎨 Paso 2: Deploy en Render

### 2.1 Crear cuenta

1. Ve a https://render.com
2. Regístrate con GitHub (gratis)
3. Confirma tu email

### 2.2 Crear nuevo Web Service

1. Click en **"New +"** > **"Web Service"**
2. Conecta tu repositorio de GitHub `call-manager`
3. Dale permiso a Render para acceder al repo

### 2.3 Configurar el servicio

Llena el formulario:

- **Name**: `call-manager`
- **Region**: Selecciona el más cercano (ej: Frankfurt para Europa)
- **Branch**: `main`
- **Root Directory**: (déjalo vacío)
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Instance Type**: `Free` (para empezar)

### 2.4 Agregar Variables de Entorno

Scroll hasta **"Environment Variables"** y agrega:

```
NODE_ENV=production
PORT=3099
ELEVENLABS_API_KEY=tu_elevenlabs_api_key_aqui
ELEVENLABS_BASE_URL=https://api.elevenlabs.io
TWILIO_ACCOUNT_SID=tu_twilio_account_sid_aqui
TWILIO_AUTH_TOKEN=tu_twilio_auth_token_aqui
```

### 2.5 Crear el servicio

Click en **"Create Web Service"**

El deploy tomará 3-5 minutos.

---

## 🌐 Paso 3: Obtener URL

Render automáticamente te da una URL:

`https://call-manager.onrender.com`

### Probar:

```bash
curl https://call-manager.onrender.com/health
```

---

## 📊 Diferencias: Railway vs Render

| Característica    | Railway            | Render               |
| ----------------- | ------------------ | -------------------- |
| **Tier Gratuito** | $5 USD crédito/mes | 750 hrs/mes          |
| **Velocidad**     | ⚡⚡⚡ Muy rápido  | ⚡⚡ Rápido          |
| **Facilidad**     | ⭐⭐⭐⭐⭐         | ⭐⭐⭐⭐             |
| **Auto-deploy**   | ✅ Sí              | ✅ Sí                |
| **Logs**          | ✅ Excelentes      | ✅ Buenos            |
| **Precio**        | Pay-as-you-go      | Free tier amplio     |
| **Cold starts**   | ❌ No              | ⚠️ Sí (en free tier) |

### ⚠️ Importante sobre Render Free Tier:

- El servicio **se duerme** después de 15 minutos de inactividad
- La primera llamada después de dormir tarda ~30-60 segundos (cold start)
- Para producción real, considera el plan Starter ($7/mes) sin cold starts

---

## 🎯 Recomendación Final

**Para desarrollo/pruebas**: Render (free tier generoso)
**Para producción**: Railway (sin cold starts, más rápido)

---

## ✅ Configurar en Simbiosia

**Base URL**: `https://call-manager.onrender.com/api/batch-calling`

```typescript
const CALL_MANAGER_URL = "https://call-manager.onrender.com/api/batch-calling";
```

---

## 🆘 Troubleshooting Render

### Cold starts muy lentos:

- Considera upgradear a Starter plan ($7/mes)
- O usa Railway (no tiene cold starts)

### Servicio se apaga:

- Normal en free tier después de 15 min sin actividad
- Se reactiva automáticamente con la siguiente request

---

**Ambas opciones son excelentes**, pero Railway es mi recomendación para este proyecto. 🚂

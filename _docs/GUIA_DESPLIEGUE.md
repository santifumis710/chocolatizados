# Guía de Despliegue - Chocolatizados

¡Felicitaciones por terminar la página! Al tener una arquitectura moderna (Frontend Next.js + Backend FastAPI + Base de datos), el despliegue es un poco diferente a una web simple, pero te da mucha más potencia.

Aquí tienes las 2 mejores opciones para publicar tu web:

---

## Opción 1: La "Stack Moderna" (Recomendada)
**Frontend en Vercel + Backend y Base de Datos en Railway**

Esta es la combinación estándar de la industria. Vercel son los creadores de Next.js (tu frontend) y Railway es excelente para Python y bases de datos.

### Ventajas
- **Vercel** optimiza tu frontend automáticamente (imágenes, velocidad mundial).
- **Railway** hace que ejecutar Python y Postgres sea tan fácil como hacer clic en "Deploy".
- Ambas tienen planes gratuitos o muy baratos para empezar.

### Pasos

1. **Sube tu código a GitHub**
   - Crea un repositorio en GitHub.
   - Sube todo tu proyecto (`git push`).

2. **Backend (Railway)**
   - Ve a [Railway.app](https://railway.app/) y loguéate con GitHub.
   - Crea un "New Project" -> "Deploy from GitHub repo".
   - Selecciona tu repositorio.
   - **Configuración importante**:
     - Railway detectará Python automáticamente.
     - Debes configurar las "Variables de Entorno" (Environment Variables) copiando las de tu `.env` (DATABASE_URL, etc.).
     - Agrega una base de datos PostgreSQL dentro de Railway (clic derecho -> New -> Database -> Postgres).
     - Railway te dará una `DATABASE_URL` interna. Úsala en tus variables.
     - **Comando de inicio**: Asegúrate de que Railway ejecute: `uvicorn src.backend.main:app --host 0.0.0.0 --port $PORT`

3. **Frontend (Vercel)**
   - Ve a [Vercel.com](https://vercel.com) y loguéate con GitHub.
   - "Add New" -> "Project" -> Importa tu repositorio.
   - **Configuración**:
     - **Root Directory**: Edita esto y selecciona `src/frontend`. Esto es clave porque tu frontend no está en la raíz.
     - **Environment Variables**:
       - `NEXT_PUBLIC_API_URL`: Aquí pones la URL que te dio Railway (ej: `https://chocolatizados-backend.railway.app`).
   - Clic en "Deploy".

---

## Opción 2: Todo en uno (Render)
**Frontend y Backend en Render.com**

Si prefieres tener todo en un solo lugar.

### Pasos
1. Sube tu código a GitHub.
2. Crea una cuenta en [Render.com](https://render.com).
3. Crea un **Web Service (Backend)**:
   - Conecta tu repo.
   - Root Directory: `.`
   - Build Command: `pip install -r src/backend/requirements.txt`
   - Start Command: `uvicorn src.backend.main:app --host 0.0.0.0 --port 10000`
4. Crea una **PostgreSQL Database** en Render y conéctala al Backend.
5. Crea un **Static Site (Frontend)**:
   - Conecta tu repo.
   - Root Directory: `src/frontend`.
   - Build Command: `npm install && npm run build`.
   - Publish directory: `.next` o `out`.

---

## checklist Pre-Despliegue

Antes de subir, asegura:

1. **Base de Datos**: Tu `DATABASE_URL` en producción será distinta a la local. No subas tu `.env` local a GitHub.
2. **CORS**: En `src/backend/main.py`, asegúrate de agregar la URL de tu dominio de producción (ej: `https://chocolatizados.vercel.app`) a los `allow_origins`.
3. **Imágenes**: Si guardas imágenes subidas por usuarios (como la de hero que editamos), en servicios como Vercel/Railway los archivos locales se borran cada vez que actualizas ("haces deploy").
   - *Solución*: Para una web real, se recomienda usar un servicio de almacenamiento como **Cloudinary** o **AWS S3** para las imágenes de productos si vas a subirlas dinámicamente.
   - Si las imágenes son fijas (parte del código), no hay problema.

¿Te gustaría que te ayude a preparar el repositorio de Git para empezar?

# UniBarTech S.A.S — Sitio Web Corporativo
## 🔥 Versión con Firebase (documentos visibles para todos)

---

## ✅ ¿Qué cambió?

El sistema ahora usa **Firebase** en lugar de `localStorage`.  
Esto significa que los documentos que sube el administrador son **visibles para TODOS** los usuarios desde cualquier dispositivo y navegador.

---

## 🚀 PASO A PASO — Configurar Firebase (GRATIS)

### PASO 1 — Crear proyecto Firebase

1. Ve a 👉 **https://console.firebase.google.com**
2. Inicia sesión con tu cuenta Google
3. Clic en **"Agregar proyecto"** (o "Add project")
4. Nombre: `unibartech-web` → Clic en **Continuar**
5. Puedes desactivar Google Analytics si no lo necesitas
6. Clic en **"Crear proyecto"**

---

### PASO 2 — Activar Realtime Database

1. En el menú izquierdo busca **"Realtime Database"** (dentro de "Compilación")
2. Clic en **"Crear base de datos"**
3. Elige la región más cercana (ej. `us-central1`)
4. Selecciona **"Iniciar en modo de prueba"** → Clic en **Habilitar**

> ⚠️ El modo de prueba dura 30 días. Luego debes ir a **Reglas** y pegar esto:
> ```json
> {
>   "rules": {
>     ".read": true,
>     ".write": true
>   }
> }
> ```
> Después clic en **Publicar**. (Para producción real se recomienda autenticación)

---

### PASO 3 — Activar Firebase Storage

1. En el menú izquierdo busca **"Storage"** (dentro de "Compilación")
2. Clic en **"Comenzar"**
3. Selecciona **"Iniciar en modo de prueba"** → Clic en **Siguiente**
4. Elige la región (la misma que la base de datos) → Clic en **Listo**

> ⚠️ Igual que la DB, después de 30 días ve a **Reglas** en Storage y pon:
> ```
> rules_version = '2';
> service firebase.storage {
>   match /b/{bucket}/o {
>     match /{allPaths=**} {
>       allow read, write: if true;
>     }
>   }
> }
> ```
> Clic en **Publicar**

---

### PASO 4 — Obtener las credenciales de tu proyecto

1. En Firebase Console, clic en el **ícono de engranaje ⚙️** (arriba a la izquierda)
2. Selecciona **"Configuración del proyecto"**
3. Baja hasta la sección **"Tus apps"**
4. Si no hay app, clic en el ícono **`</>`** (Web)
5. Nombre de la app: `unibartech-web` → Clic en **Registrar app**
6. Verás un bloque de código como este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "unibartech-web.firebaseapp.com",
  databaseURL: "https://unibartech-web-default-rtdb.firebaseio.com",
  projectId: "unibartech-web",
  storageBucket: "unibartech-web.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

7. **Copia TODOS esos valores**

---

### PASO 5 — Pegar credenciales en el archivo

1. Abre el archivo **`firebase-config.js`** con cualquier editor de texto (Bloc de notas, VS Code, etc.)
2. Reemplaza cada valor con el tuyo:

```javascript
const firebaseConfig = {
  apiKey:            "AIzaSy...",          // ← pega tu valor
  authDomain:        "tu-proyecto.firebaseapp.com",
  databaseURL:       "https://tu-proyecto-default-rtdb.firebaseio.com",
  projectId:         "tu-proyecto",
  storageBucket:     "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abc..."
};

firebase.initializeApp(firebaseConfig);  // ← NO borres esta línea
```

3. Guarda el archivo

---

### PASO 6 — Subir todo a GitHub Pages

1. Ve a tu repositorio en GitHub
2. Sube TODOS los archivos de esta carpeta (incluyendo `firebase-config.js`)
3. Espera ~2 minutos y visita tu sitio

¡Listo! Ahora los documentos se guardan en Firebase y **todos los usuarios los verán** desde cualquier dispositivo.

---

## 📁 Archivos del proyecto

```
unibartech-web/
├── index.html           ← Página principal
├── quienes-somos.html   ← Quiénes somos
├── documentos.html      ← Repositorio público de documentos
├── admin.html           ← Panel de administración
├── firebase-config.js   ← ⚠️ AQUÍ van tus credenciales Firebase
├── docs.js              ← Lógica del sistema de documentos (Firebase)
├── docs.css             ← Estilos del módulo de documentos
├── style.css            ← Estilos globales
├── main.js              ← JavaScript general
├── logo.png             ← Logo UniBarTech
└── hero.jpg             ← Imagen principal
```

---

## 🔐 Contraseña de Administrador

La contraseña por defecto es:
```
Unibar2025!
```
Para cambiarla: abre `docs.js` y busca:
```javascript
const ADMIN_PASS = 'Unibar2025!';
```

---

## 📦 Plan gratuito de Firebase (Spark)

| Recurso              | Límite gratuito     |
|----------------------|---------------------|
| Realtime Database    | 1 GB almacenado     |
| Realtime Database    | 10 GB transferencia |
| Storage              | 5 GB almacenado     |
| Storage              | 1 GB/día descarga   |

Más que suficiente para documentos corporativos.

---

**UniBarTech S.A.S** · NIT: 901.874.563-2 · Bogotá, Colombia  
📧 contacto@unibartech.com · 📞 601 610 6709

// ═══════════════════════════════════════════════════════════
//  UniBarTech — firebase-config.js
//  ⚠️  REEMPLAZA ESTOS VALORES CON LOS DE TU PROYECTO FIREBASE
// ═══════════════════════════════════════════════════════════

const firebaseConfig = {
  apiKey:            "PEGA-AQUI-TU-apiKey",
  authDomain:        "PEGA-AQUI-TU-authDomain",
  databaseURL:       "PEGA-AQUI-TU-databaseURL",
  projectId:         "PEGA-AQUI-TU-projectId",
  storageBucket:     "PEGA-AQUI-TU-storageBucket",
  messagingSenderId: "PEGA-AQUI-TU-messagingSenderId",
  appId:             "PEGA-AQUI-TU-appId"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar Storage
const storage = firebase.storage();

// Variable global para datos cacheados
let cachedData = { folders: [], documents: [] };
let dataListeners = [];

// Función para obtener datos (la usa admin.html y docs.js)
function getData() {
  return cachedData;
}

// Cargar datos iniciales desde Firebase
firebase.database().ref('unibartech').on('value', (snapshot) => {
  const data = snapshot.val() || {};
  
  // Procesar carpetas
  cachedData.folders = [];
  if (data.folders) {
    cachedData.folders = Object.entries(data.folders).map(([id, val]) => ({
      id, ...val
    }));
  }
  
  // Procesar documentos
  cachedData.documents = [];
  if (data.documents) {
    cachedData.documents = Object.entries(data.documents).map(([id, val]) => ({
      id, ...val
    }));
  }
  
  // Notificar a todos los listeners
  dataListeners.forEach(callback => callback(cachedData));
  
  // Actualizar UI si existe la función
  if (typeof adminRenderContent === 'function') {
    adminRenderContent();
  }
  if (typeof renderDocs === 'function') {
    renderDocs();
  }
});

// Función para suscribirse a cambios
function onDataChange(callback) {
  dataListeners.push(callback);
  callback(cachedData);
  
  // Retornar función para cancelar suscripción
  return () => {
    dataListeners = dataListeners.filter(cb => cb !== callback);
  };
}

// Función para formatear fecha (la usan varios archivos)
function formatDate(timestamp) {
  if (!timestamp) return 'Fecha desconocida';
  const date = new Date(timestamp);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

// Función para escapar HTML
function escHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Función para generar IDs únicos
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Función para mostrar notificaciones
function showToast(msg) {
  // Puedes implementar un toast más elegante después
  alert(msg);
}

// Función para obtener color hex de carpeta
function folderColorHex(color) {
  const colors = {
    blue: '#0078D4',
    green: '#107C10',
    red: '#D13438',
    orange: '#CA5010',
    purple: '#5C2D91',
    teal: '#008272',
    gold: '#986F0B'
  };
  return colors[color] || '#0078D4';
}

// Función para icono SVG de carpeta
function folderSVG(color) {
  return '📁';
}

// Función para icono de archivo
function fileIconSVG(filename) {
  return '📄';
}

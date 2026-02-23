// ═══════════════════════════════════════════════════════════
//  UniBarTech — firebase-config.js
// ═══════════════════════════════════════════════════════════

const firebaseConfig = {
  apiKey: "AIzaSyBz7LhVAPB8vLmzR1cV9nX5kQ2wL3mN4oP5",
  authDomain: "unibartech-web.firebaseapp.com",
  databaseURL: "https://unibartech-web-default-rtdb.firebaseio.com", // ← DEBE TERMINAR EN .firebaseio.com
  projectId: "unibartech-web",
  storageBucket: "unibartech-web.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};

// Inicializa Firebase (UNA SOLA VEZ)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Inicializar servicios
const database = firebase.database();
const storage = firebase.storage();

// Variable global para datos cacheados
let cachedData = { folders: [], documents: [] };
let dataListeners = [];

function getData() {
  return cachedData;
}

// Escuchar cambios
firebase.database().ref('unibartech').on('value', (snapshot) => {
  const data = snapshot.val() || {};
  
  cachedData.folders = data.folders ? 
    Object.entries(data.folders).map(([id, val]) => ({ id, ...val })) : [];
  
  cachedData.documents = data.documents ? 
    Object.entries(data.documents).map(([id, val]) => ({ id, ...val })) : [];
  
  dataListeners.forEach(cb => cb(cachedData));
});

function onDataChange(callback) {
  dataListeners.push(callback);
  callback(cachedData);
  return () => {
    dataListeners = dataListeners.filter(cb => cb !== callback);
  };
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
}

function escHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(timestamp) {
  if (!timestamp) return 'Fecha desconocida';
  const date = new Date(timestamp);
  return date.toLocaleDateString('es-CO') + ' ' + date.toLocaleTimeString();
}

function folderColorHex(color) {
  const colors = {
    blue: '#0078D4', green: '#107C10', red: '#D13438',
    orange: '#CA5010', purple: '#5C2D91', teal: '#008272', gold: '#986F0B'
  };
  return colors[color] || '#0078D4';
}

function folderSVG(color) { return '📁'; }
function fileIconSVG(filename) { return '📄'; }

function showToast(msg) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed; bottom: 28px; right: 28px; z-index: 9999;
    background: rgba(0,30,60,0.97); border: 1px solid rgba(0,229,255,0.3);
    color: #00EEFF; padding: 14px 22px; border-radius: 10px;
    font-family: 'Exo 2', sans-serif; font-size: 0.88rem;
    box-shadow: 0 4px 24px rgba(0,170,255,0.25);
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// ═══════════════════════════════════════════════════════════
//  UniBarTech — firebase-config.js
//  ⚠️ REEMPLAZA ESTOS VALORES CON LOS DE TU PROYECTO FIREBASE
// ═══════════════════════════════════════════════════════════

const firebaseConfig = {
  apiKey:            "AIzaSyBz7LhVAPB8vLmzR1cV9nX5kQ2wL3mN4oP5",   // ← TU API KEY
  authDomain:        "unibartech-web.firebaseapp.com",
  databaseURL:       "https://unibartech-web-default-rtdb.firebaseio.com",
  projectId:         "unibartech-web",
  storageBucket:     "unibartech-web.appspot.com",
  messagingSenderId: "123456789012",
  appId:             "1:123456789012:web:abc123def456"
};

// Inicializa Firebase UNA SOLA VEZ
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

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

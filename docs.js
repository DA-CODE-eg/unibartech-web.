// ═══════════════════════════════════════════════════════════
//  UniBarTech — docs.js  (Solo Firebase Realtime Database)
//  Sin Firebase Storage — archivos guardados como base64
// ═══════════════════════════════════════════════════════════

const ADMIN_PASS = 'Unibar2025!';
let isAdmin = false;
let globalData = { folders: [], documents: [] };

function initFirebaseListeners() {
  // Solo escuchar metadata (sin dataUrl para no saturar)
  firebase.database().ref('unibartech').on('value', snap => {
    const val = snap.val() || {};
    const foldersObj = val.folders   || {};
    const docsObj    = val.documents || {};

    globalData.folders = Object.entries(foldersObj)
      .map(([id, f]) => ({ id, ...f }))
      .sort((a, b) => (a.ts||0) - (b.ts||0));

    globalData.documents = Object.entries(docsObj)
      .map(([id, d]) => ({
        id,
        name:     d.name,
        desc:     d.desc,
        author:   d.author,
        folderId: d.folderId,
        size:     d.size,
        ts:       d.ts,
        hasFile:  !!d.dataUrl
      }))
      .sort((a, b) => (a.ts||0) - (b.ts||0));

    if (document.getElementById('rootView'))         renderPublic();
    if (document.getElementById('adminContentRows')) adminRenderContent();
  });
}

function getData() { return globalData; }

async function viewDoc(docId, docName) {
  showToast('⏳ Cargando documento...');
  try {
    const snap = await firebase.database().ref('unibartech/documents/' + docId + '/dataUrl').once('value');
    const dataUrl = snap.val();
    if (!dataUrl) { alert('Sin archivo adjunto.'); return; }
    const ext = (docName||'').split('.').pop().toLowerCase();
    if (ext === 'pdf' || dataUrl.includes('application/pdf')) {
      const win = window.open('', '_blank');
      win.document.write('<html><body style="margin:0"><iframe src="' + dataUrl + '" style="width:100%;height:100vh;border:none;"></iframe></body></html>');
    } else if (['png','jpg','jpeg','gif','webp'].includes(ext)) {
      const win = window.open('', '_blank');
      win.document.write('<img src="' + dataUrl + '" style="max-width:100%;display:block;margin:auto;padding:20px;"/>');
    } else {
      const a = document.createElement('a');
      a.href = dataUrl; a.download = docName || 'documento'; a.click();
    }
  } catch(e) { alert('Error: ' + e.message); }
}

async function downloadDoc(docId, docName) {
  showToast('⏳ Preparando descarga...');
  try {
    const snap = await firebase.database().ref('unibartech/documents/' + docId + '/dataUrl').once('value');
    const dataUrl = snap.val();
    if (!dataUrl) { alert('Sin archivo adjunto.'); return; }
    const a = document.createElement('a');
    a.href = dataUrl; a.download = docName || 'documento'; a.click();
  } catch(e) { alert('Error: ' + e.message); }
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,6);
}
function escHtml(str) {
  return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function formatDate(ts) {
  return new Date(ts).toLocaleDateString('es-CO',{day:'2-digit',month:'short',year:'numeric'});
}

const FOLDER_COLORS = {
  blue:'#0078D4', green:'#107C10', red:'#D13438',
  orange:'#CA5010', purple:'#5C2D91', teal:'#008272', gold:'#986F0B'
};
function folderColorHex(color) { return FOLDER_COLORS[color]||'#0078D4'; }
function folderSVG(color) {
  const c = folderColorHex(color);
  return '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M3 7c0-1.1.9-2 2-2h4.17l2 2H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" fill="'+c+'"/></svg>';
}
function fileIcon(name) {
  const ext = (name||'').split('.').pop().toLowerCase();
  const m = {pdf:'📄',doc:'📝',docx:'📝',xls:'📊',xlsx:'📊',ppt:'📋',pptx:'📋',txt:'📃',png:'🖼️',jpg:'🖼️',jpeg:'🖼️'};
  return { icon: m[ext]||'📎' };
}
function fileIconSVG(name) { return fileIcon(name).icon; }

function showToast(msg) {
  const t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style,{position:'fixed',bottom:'28px',right:'28px',zIndex:'9999',
    background:'rgba(0,30,60,0.97)',border:'1px solid rgba(0,229,255,0.3)',
    color:'#00EEFF',padding:'14px 22px',borderRadius:'10px',
    fontFamily:"'Exo 2',sans-serif",fontSize:'0.88rem',
    boxShadow:'0 4px 24px rgba(0,170,255,0.25)',opacity:'1',transition:'opacity 0.4s'});
  document.body.appendChild(t);
  setTimeout(()=>{t.style.opacity='0'; setTimeout(()=>t.remove(),400);},3000);
}

function updateFileName() {
  const input = document.getElementById('fileInput');
  const label = document.getElementById('fileLabel');
  if (!input||!label) return;
  label.textContent = input.files[0] ? '📎 '+input.files[0].name : '';
}

// ── PÁGINA PÚBLICA ──────────────────────────────────────────
let currentView = 'root';
let currentSubFolderId = null;

function goRoot() { currentView='root'; currentSubFolderId=null; renderPublic(); }
function goMain() { currentView='main'; currentSubFolderId=null; renderPublic(); }
function openSubFolder(id) { currentView='sub'; currentSubFolderId=id; renderPublic(); }

function renderPublic() {
  const rv=document.getElementById('rootView');
  const mv=document.getElementById('mainView');
  const sv=document.getElementById('subView');
  if (!rv) return;
  rv.style.display='none'; mv.style.display='none'; sv.style.display='none';
  updateBreadcrumb(); updateRootCount();
  if (currentView==='root') rv.style.display='';
  else if (currentView==='main') { mv.style.display=''; renderSubfolders(); renderRootDocs(); }
  else if (currentView==='sub')  { sv.style.display='';  renderSubDocs(); }
}

function updateRootCount() {
  const el=document.getElementById('rootCount'); if (!el) return;
  const data=getData();
  const total=data.folders.length+data.documents.filter(d=>!d.folderId).length;
  el.textContent=total+' elemento'+(total!==1?'s':'');
}

function updateBreadcrumb() {
  const bcMain=document.getElementById('bc-main');
  const bcFolder=document.getElementById('bc-folder');
  const bcSep=document.getElementById('bc-folder-sep');
  const data=getData();
  if (currentView==='root') {
    if (bcMain) bcMain.classList.remove('bc-current');
    if (bcFolder) bcFolder.style.display='none';
    if (bcSep) bcSep.style.display='none';
  } else if (currentView==='main') {
    if (bcMain) bcMain.classList.add('bc-current');
    if (bcFolder) bcFolder.style.display='none';
    if (bcSep) bcSep.style.display='none';
  } else if (currentView==='sub') {
    const folder=data.folders.find(f=>f.id===currentSubFolderId);
    if (bcMain) bcMain.classList.remove('bc-current');
    if (bcFolder) { bcFolder.style.display=''; bcFolder.textContent=folder?.name||''; }
    if (bcSep) bcSep.style.display='';
  }
}

function renderSubfolders() {
  const container=document.getElementById('subfoldersRows');
  const mainEmpty=document.getElementById('mainEmpty');
  if (!container) return;
  const data=getData();
  container.innerHTML='';
  data.folders.forEach(f=>{
    const count=data.documents.filter(d=>d.folderId===f.id).length;
    const row=document.createElement('div');
    row.className='sp-row'; row.onclick=()=>openSubFolder(f.id);
    row.innerHTML=`
      <div class="sp-col-name">
        <div class="sp-folder-icon" style="color:${folderColorHex(f.color)}">
          <svg viewBox="0 0 24 24" width="22" height="22">
            <path d="M3 7c0-1.1.9-2 2-2h4.17l2 2H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" fill="currentColor"/>
          </svg>
        </div>
        <span class="sp-item-name">${escHtml(f.name)}</span>
      </div>
      <div class="sp-col-modified sp-meta">${formatDate(f.ts)}</div>
      <div class="sp-col-by sp-meta">UniBarTech S.A.S</div>
      <div class="sp-col-size sp-meta">${count} elemento${count!==1?'s':''}</div>`;
    container.appendChild(row);
  });
  const rootDocs=data.documents.filter(d=>!d.folderId);
  if (data.folders.length===0&&rootDocs.length===0) { if (mainEmpty) mainEmpty.style.display=''; }
  else { if (mainEmpty) mainEmpty.style.display='none'; }
}

function renderRootDocs() {
  const container=document.getElementById('rootDocsRows'); if (!container) return;
  container.innerHTML='';
  getData().documents.filter(d=>!d.folderId).forEach(doc=>renderDocRow(doc,container));
}

function renderSubDocs() {
  const container=document.getElementById('subDocsRows');
  const empty=document.getElementById('subEmpty');
  if (!container) return;
  container.innerHTML='';
  const docs=getData().documents.filter(d=>d.folderId===currentSubFolderId);
  if (docs.length===0) { if (empty) empty.style.display=''; return; }
  if (empty) empty.style.display='none';
  docs.forEach(doc=>renderDocRow(doc,container));
}

function renderDocRow(doc, container) {
  const fi=fileIcon(doc.name);
  const row=document.createElement('div');
  row.className='sp-row sp-doc-row';
  row.innerHTML=`
    <div class="sp-col-name">
      <div class="sp-file-icon">${fi.icon}</div>
      <span class="sp-item-name">${escHtml(doc.name)}</span>
    </div>
    <div class="sp-col-modified sp-meta">${formatDate(doc.ts)}</div>
    <div class="sp-col-by sp-meta">${escHtml(doc.author||'UniBarTech S.A.S')}</div>
    <div class="sp-col-size sp-meta">
      ${doc.size||'—'}
      ${doc.hasFile?`
        <button class="sp-doc-btn" onclick="event.stopPropagation();viewDoc('${doc.id}','${escHtml(doc.name)}')">Ver</button>
        <button class="sp-doc-btn" onclick="event.stopPropagation();downloadDoc('${doc.id}','${escHtml(doc.name)}')">⬇</button>
      `:''}
    </div>`;
  container.appendChild(row);
}

function searchDocs() {
  const q=document.getElementById('searchInput')?.value.toLowerCase().trim()||'';
  document.querySelectorAll('.sp-row').forEach(row=>{
    const name=row.querySelector('.sp-item-name')?.textContent.toLowerCase()||'';
    row.style.display=(!q||name.includes(q))?'':'none';
  });
}

document.addEventListener('DOMContentLoaded', async ()=>{
  initFirebaseListeners();
  const snap=await firebase.database().ref('unibartech/folders').once('value');
  if (!snap.exists()) {
    const seed={};
    [['INICIO','red'],['PLANEACION','blue'],['EJECUCION','green'],
     ['MONITOREO Y CONTROL','orange'],['CIERRE','teal']].forEach(([name,color])=>{
      seed[genId()]={name,color,ts:Date.now()};
    });
    await firebase.database().ref('unibartech/folders').set(seed);
  }
});

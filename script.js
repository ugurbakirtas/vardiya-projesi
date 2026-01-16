/**
 * PRO-Vardiya v16.0 | Kural Korumalı & Gelişmiş Takip
 */

// BİRİM SIRALAMASI (DEĞİŞTİRİLEMEZ ÇEKİRDEK)
let birimSiralamasi = JSON.parse(localStorage.getItem("birimListesi")) || [
    "TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", 
    "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"
];

// PERSONEL LİSTESİ (HAFIZA DESTEKLİ)
let personeller = JSON.parse(localStorage.getItem("personelListesi")) || [
    { id: 1, isim: "YUNUS EMRE YAYLA", birim: "TEKNİK YÖNETMEN" },
    { id: 4, isim: "EKREM FİDAN", birim: "TEKNİK YÖNETMEN" },
    { id: 6, isim: "BARIŞ İNCE", birim: "TEKNİK YÖNETMEN" },
    { id: 7, isim: "ZAFER AKAR", birim: "SES OPERATÖRÜ" },
    { id: 15, isim: "SENA MİNARECİ", birim: "PLAYOUT OPERATÖRÜ" },
    { id: 22, isim: "YUSUF İSLAM TORUN", birim: "KJ OPERATÖRÜ" },
    { id: 29, isim: "RAMAZAN KOÇAK", birim: "INGEST OPERATÖRÜ" },
    { id: 40, isim: "KADİR YILMAZ", birim: "24TV MCR OPERATÖRÜ" },
    { id: 44, isim: "EMRULLAH AHLATÇI", birim: "360TV MCR OPERATÖRÜ" }
];

const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const saatler = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];

let mevcutPazartesi = getMonday(new Date());
let haftalikProgram = {};

function getMonday(d) {
    d = new Date(d);
    let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

// --- YÖNETİM FONKSİYONLARI ---
function toggleAdminPanel() {
    const p = document.getElementById("adminPanel");
    p.classList.toggle("hidden");
    adminPanelGuncelle();
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    document.getElementById("themeBtn").innerText = isDark ? "☀️ Aydınlık Mod" : "🌙 Karanlık Mod";
}

function birimEkle() {
    const ad = document.getElementById("yeniBirimAd").value.toUpperCase();
    if(!ad) return;
    birimSiralamasi.push(ad);
    localStorage.setItem("birimListesi", JSON.stringify(birimSiralamasi));
    adminPanelGuncelle();
}

function personelEkle() {
    const isim = document.getElementById("yeniIsim").value.toUpperCase();
    const birim = document.getElementById("birimSec").value;
    if(!isim) return;
    personeller.push({ id: Date.now(), isim, birim });
    localStorage.setItem("personelListesi", JSON.stringify(personeller));
    adminPanelGuncelle();
    checklistOlustur();
    tabloyuOlustur();
}

function personelSil(id) {
    personeller = personeller.filter(p => p.id !== id);
    localStorage.setItem("personelListesi", JSON.stringify(personeller));
    adminPanelGuncelle();
    checklistOlustur();
    tabloyuOlustur();
}

function adminPanelGuncelle() {
    const sel = document.getElementById("birimSec");
    sel.innerHTML = birimSiralamasi.map(b => `<option value="${b}">${b}</option>`).join('');
    const list = document.getElementById("yonetimListesi");
    list.innerHTML = personeller.map(p => `
        <div class="yonetim-card">
            <span><b>${p.isim}</b> <br><small>${p.birim}</small></span>
            <button onclick="personelSil(${p.id})" style="background:red; color:white; border-radius:4px; padding:2px 5px;">Sil</button>
        </div>
    `).join('');
}

// --- VARDİYA MANTIĞI (v14.5 Korumalı) ---
function tabloyuOlustur() {
    const haftaKey = "data_" + mevcutPazartesi.toISOString().split('T')[0];
    document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;
    
    // Hafızadan yükle yoksa yeni kurallar çalıştır
    const localData = localStorage.getItem(haftaKey);
    if(localData) {
        haftalikProgram = JSON.parse(localData);
    } else {
        haftalikProgram = {};
        personeller.forEach(p => {
            const isSelected = document.getElementById(`check_${p.id}`)?.checked;
            haftalikProgram[p.isim] = isSelected ? Array(7).fill("İZİN") : Array(7).fill(null);
        });

        // Sabit kurallar
        applyMCRRota("24TV MCR OPERATÖRÜ");
        applyMCRRota("360TV MCR OPERATÖRÜ");
        applyIngestRota();
        
        // TY Barış & Ekrem Döngüsü
        if(haftalikProgram["BARIŞ İNCE"]) {
            haftalikProgram["BARIŞ İNCE"][0] = "00:00–07:00";
            haftalikProgram["BARIŞ İNCE"][1] = "00:00–07:00";
        }
    }

    renderTable();
    ozetGuncelle();
    localStorage.setItem(haftaKey, JSON.stringify(haftalikProgram));
}

function hucreDoldur(gun, saat) {
    const isHS = (gun >= 5);
    if(!["12:00–22:00", "DIŞ YAYIN", "İZİN"].includes(saat)) {
        birimSiralamasi.forEach(birim => {
            if(birim.includes("MCR") || birim.includes("INGEST")) return;
            
            let kap = 0;
            if(birim === "SES OPERATÖRÜ") {
                kap = (saat === "09:00–18:00") ? (isHS ? 2 : 0) : (isHS ? 2 : (saat === "06:30–16:00" ? 4 : 2));
            } else if(birim === "PLAYOUT OPERATÖRÜ") {
                if(saat === "06:30–16:00") kap = isHS ? 2 : 3;
                else if(saat === "16:00–00:00") kap = 2;
            } else if(birim === "KJ OPERATÖRÜ") {
                if(saat === "06:30–16:00" || saat === "16:00–00:00") kap = 2;
            } else if(birim === "TEKNİK YÖNETMEN") {
                if(saat === "00:00–07:00") kap = 1;
                else kap = isHS ? 1 : (saat === "06:30–16:00" ? 2 : 1);
            }

            let adaylar = personeller.filter(p => p.birim === birim && !haftalikProgram[p.isim][gun]);
            let suan = personeller.filter(p => p.birim === birim && haftalikProgram[p.isim][gun] === saat).length;
            for(let k=0; k < (kap-suan); k++) {
                if(adaylar.length > 0) {
                    let p = adaylar.splice(Math.floor(Math.random() * adaylar.length), 1)[0];
                    haftalikProgram[p.isim][gun] = saat;
                }
            }
        });
    }

    let list = personeller.filter(p => haftalikProgram[p.isim][gun] === saat);
    list.sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim));
    return list.map(p => `<div class="birim-card"><span class="birim-tag">${p.birim}</span><span class="p-isim">${p.isim}</span></div>`).join('');
}

function renderTable() {
    const h = document.getElementById("tableHeader");
    h.innerHTML = `<th>SAATLER</th>` + gunler.map((g, i) => {
        let t = new Date(mevcutPazartesi); t.setDate(t.getDate() + i);
        return `<th>${g}<br><small>${t.toLocaleDateString('tr-TR')}</small></th>`;
    }).join('');
    let b = "";
    saatler.forEach(s => {
        b += `<tr><td>${s}</td>`;
        for(let i=0; i<7; i++) b += `<td>${hucreDoldur(i, s)}</td>`;
        b += `</tr>`;
    });
    document.getElementById("tableBody").innerHTML = b;
}

// MESAI TAKİBİ
function ozetGuncelle() {
    let h = `<table class="stats-table"><tr><th>Personel</th><th>Birim</th><th>Gün Mesai</th><th>Gece</th><th>Durum</th></tr>`;
    personeller.sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim)).forEach(p => {
        const gunMesai = haftalikProgram[p.isim].filter(v => v && v !== "İZİN").length;
        const geceMesai = haftalikProgram[p.isim].filter(v => v === "00:00–07:00").length;
        h += `<tr><td><b>${p.isim}</b></td><td><small>${p.birim}</small></td><td>${gunMesai} Gün</td><td>${geceMesai} Gece</td><td>${gunMesai > 5 ? '⚠️' : '✅'}</td></tr>`;
    });
    document.getElementById("ozetTablo").innerHTML = h + "</table>";
}

// MCR & INGEST (v14.5 Sabit Rota)
function applyIngestRota() {
    const ekip = personeller.filter(p => p.birim === "INGEST OPERATÖRÜ");
    const rota = ["06:30–16:00", "06:30–16:00", "16:00–00:00", "16:00–00:00", "İZİN", "İZİN"];
    ekip.forEach((p, idx) => {
        for(let i=0; i<7; i++) {
            let d = new Date(mevcutPazartesi.getTime() + (i * 86400000));
            let rI = (Math.floor((d - new Date(2025,0,6)) / 86400000) + (idx * 2)) % 6;
            if(!haftalikProgram[p.isim][i]) haftalikProgram[p.isim][i] = rota[rI < 0 ? rI + 6 : rI];
        }
    });
}

function applyMCRRota(birim) {
    const ekip = personeller.filter(p => p.birim === birim);
    const rota = ["06:30–16:00", "06:30–16:00", "16:00–00:00", "16:00–00:00", "00:00–07:00", "00:00–07:00", "İZİN", "İZİN"];
    ekip.forEach((p, idx) => {
        for(let i=0; i<7; i++) {
            let d = new Date(mevcutPazartesi.getTime() + (i * 86400000));
            let rI = (Math.floor((d - new Date(2025,0,6)) / 86400000) + (idx * 2)) % 8;
            if(!haftalikProgram[p.isim][i]) haftalikProgram[p.isim][i] = rota[rI < 0 ? rI + 8 : rI];
        }
    });
}

function checklistOlustur() {
    const container = document.getElementById("personelChecklist");
    container.innerHTML = personeller.sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim)).map(p => `
        <div class="check-item" onclick="toggleCheckbox('${p.id}')">
            <input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()">
            <label><strong>${p.isim}</strong><br><small>${p.birim}</small></label>
        </div>
    `).join('');
}

function toggleCheckbox(id) {
    const cb = document.getElementById('check_' + id);
    if(cb) { cb.checked = !cb.checked; tabloyuOlustur(); }
}

function haftaDegistir(g) { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + g); tabloyuOlustur(); }
function exportExcel() { XLSX.writeFile(XLSX.utils.table_to_book(document.getElementById("vardiyaTablosu")), "Teknik_Vardiya.xlsx"); }
function exportPDF() { html2pdf().from(document.getElementById('print-area')).save('Vardiya_Raporu.pdf'); }
function sifirla() { localStorage.clear(); location.reload(); }
function whatsappMesajiOlustur() {
    let m = `📋 *${mevcutPazartesi.toLocaleDateString('tr-TR')} HAFTASI*\n\n`;
    gunler.forEach((g, i) => {
        m += `*${g.toUpperCase()}*\n`;
        saatler.forEach(s => {
            let l = personeller.filter(p => haftalikProgram[p.isim][i] === s).map(x => x.isim);
            if(l.length > 0) m += `▫️ ${s}: ${l.join(", ")}\n`;
        });
        m += `\n`;
    });
    navigator.clipboard.writeText(m).then(() => alert("Kopyalandı!"));
}

window.onload = () => { checklistOlustur(); tabloyuOlustur(); adminPanelGuncelle(); };
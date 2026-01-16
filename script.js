const birimSiralamasi = [
    "Teknik Yönetmen", "Ses Operatörü", "Playout Operatörü", "KJ Operatörü", 
    "24TV - 360TV INGEST OPERATÖRÜ", "24TV-360TV BİLGİ İŞLEM", 
    "24TV-360TV YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"
];

let personeller = JSON.parse(localStorage.getItem("personelListesi")) || [
    { id: 1, isim: "YUNUS EMRE YAYLA", birim: "Teknik Yönetmen" },
    { id: 2, isim: "HASAN CAN SAĞLAM", birim: "Teknik Yönetmen" },
    { id: 3, isim: "MEHMET BERKMAN", birim: "Teknik Yönetmen" },
    { id: 4, isim: "EKREM FİDAN", birim: "Teknik Yönetmen" },
    { id: 5, isim: "CAN ŞENTUNALI", birim: "Teknik Yönetmen" },
    { id: 6, isim: "BARIŞ İNCE", birim: "Teknik Yönetmen" },
    { id: 7, isim: "ZAFER AKAR", birim: "Ses Operatörü" },
    { id: 8, isim: "ENES KALE", birim: "Ses Operatörü" },
    { id: 9, isim: "ANIL RİŞVAN", birim: "Ses Operatörü" },
    { id: 10, isim: "ERSAN TİLBE", birim: "Ses Operatörü" },
    { id: 11, isim: "ULVİ MUTLUBAŞ", birim: "Ses Operatörü" },
    { id: 12, isim: "OSMAN DİNÇER", birim: "Ses Operatörü" },
    { id: 13, isim: "DOĞUŞ MALGIL", birim: "Ses Operatörü" },
    { id: 14, isim: "ERDOĞAN KÜÇÜKKAYA", birim: "Ses Operatörü" },
    { id: 15, isim: "SENA MİNARECİ", birim: "Playout Operatörü" },
    { id: 16, isim: "MEHMET TUNÇ", birim: "Playout Operatörü" },
    { id: 17, isim: "KADİR ÇAÇAN", birim: "Playout Operatörü" },
    { id: 18, isim: "İBRAHİM SERİNSÖZ", birim: "Playout Operatörü" },
    { id: 19, isim: "YUSUF ALPKILIÇ", birim: "Playout Operatörü" },
    { id: 20, isim: "MUSTAFA ERCÜMENT KILIÇ", birim: "Playout Operatörü" },
    { id: 21, isim: "NEHİR KAYGUSUZ", birim: "Playout Operatörü" },
    { id: 22, isim: "YUSUF İSLAM TORUN", birim: "KJ Operatörü" },
    { id: 23, isim: "OĞUZHAN YALAZAN", birim: "KJ Operatörü" },
    { id: 24, isim: "UĞUR AKBABA", birim: "KJ Operatörü" },
    { id: 25, isim: "SENA BAYDAR", birim: "KJ Operatörü" },
    { id: 26, isim: "CEMREHAN SUBAŞI", birim: "KJ Operatörü" },
    { id: 27, isim: "YEŞİM KİREÇ", birim: "KJ Operatörü" },
    { id: 28, isim: "PINAR ÖZENÇ", birim: "KJ Operatörü" },
    { id: 29, isim: "RAMAZAN KOÇAK", birim: "24TV - 360TV INGEST OPERATÖRÜ" },
    { id: 30, isim: "Selin", birim: "Uplink" },
    { id: 40, isim: "KADİR YILMAZ", birim: "24TV MCR OPERATÖRÜ" },
    { id: 41, isim: "FARUK YILMAZ", birim: "24TV MCR OPERATÖRÜ" },
    { id: 42, isim: "YUSUF HENEK", birim: "24TV MCR OPERATÖRÜ" },
    { id: 43, isim: "SEDA KAYA", birim: "24TV MCR OPERATÖRÜ" },
    { id: 44, isim: "EMRULLAH AHLATÇI", birim: "360TV MCR OPERATÖRÜ" },
    { id: 45, isim: "EREN KAZAN", birim: "360TV MCR OPERATÖRÜ" },
    { id: 46, isim: "MUSAB YAKUB DEMİRBAŞ", birim: "360TV MCR OPERATÖRÜ" },
    { id: 47, isim: "BÜKRE YAVUZ", birim: "360TV MCR OPERATÖRÜ" }
];

let mevcutPazartesi = getMonday(new Date());
let haftalikProgram = {};
let haftalikNotlar = JSON.parse(localStorage.getItem("haftalikNotlar")) || {};

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    document.getElementById('themeBtn').innerText = document.body.classList.contains('dark-mode') ? "☀️ Aydınlık Mod" : "🌙 Koyu Mod";
}

function togglePanel(id) { 
    document.getElementById(id).classList.toggle('hidden'); 
    if(!document.getElementById(id).classList.contains('hidden')) notesFormOlustur();
}

function notesFormOlustur() {
    const container = document.getElementById("notesForm");
    const haftaKey = mevcutPazartesi.toISOString().split('T')[0];
    if(!haftalikNotlar[haftaKey]) haftalikNotlar[haftaKey] = Array(7).fill("");
    
    container.innerHTML = Array(7).fill(0).map((_, i) => `
        <div style="display:flex; gap:5px; align-items:center;">
            <span style="font-size:10px; width:80px;">${gunler[i]}:</span>
            <input type="text" id="note_${i}" value="${haftalikNotlar[haftaKey][i]}" placeholder="Not ekleyin...">
        </div>
    `).join('');
}

function notlariKaydet() {
    const haftaKey = mevcutPazartesi.toISOString().split('T')[0];
    haftalikNotlar[haftaKey] = Array(7).fill(0).map((_, i) => document.getElementById(`note_${i}`).value);
    localStorage.setItem("haftalikNotlar", JSON.stringify(haftalikNotlar));
    renderTable();
    alert("Notlar kaydedildi!");
}

function personelEkle() {
    const isim = document.getElementById("newPersonelName").value.toUpperCase();
    const birim = document.getElementById("newPersonelBirim").value;
    if(!isim) return;
    personeller.push({ id: Date.now(), isim, birim });
    saveAndRefresh();
}

function personelSil(id) {
    personeller = personeller.filter(p => p.id !== id);
    saveAndRefresh();
}

function saveAndRefresh() {
    localStorage.setItem("personelListesi", JSON.stringify(personeller));
    checklistOlustur();
    manageListOlustur();
    tabloyuOlustur();
}

function getMonday(d) { d = new Date(d); let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); return new Date(d.setDate(diff)); }

const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

function checklistOlustur() {
    const sirali = [...personeller].sort((a, b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim));
    document.getElementById("personelChecklist").innerHTML = sirali.map(p => `
        <div class="check-item" onclick="document.getElementById('check_${p.id}').click();">
            <input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()" onclick="event.stopPropagation();">
            <label><strong>${p.isim}</strong><br><small>${p.birim}</small></label>
        </div>
    `).join('');
    document.getElementById("newPersonelBirim").innerHTML = birimSiralamasi.map(b => `<option value="${b}">${b}</option>`).join('');
}

function manageListOlustur() {
    document.getElementById("manageList").innerHTML = personeller.map(p => `<div class="manage-item" onclick="personelSil(${p.id})">${p.isim} ×</div>`).join('');
}

function tabloyuOlustur() {
    document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası Planı`;
    haftalikProgram = {};
    personeller.forEach(p => {
        const isSelected = document.getElementById(`check_${p.id}`)?.checked;
        haftalikProgram[p.isim] = isSelected ? Array(7).fill("İZİN") : Array(7).fill(null);
    });

    // MCR/Ingest Rotasyonları
    applyMCRRota("24TV MCR OPERATÖRÜ");
    applyMCRRota("360TV MCR OPERATÖRÜ");

    // Özel Kurallar
    if(haftalikProgram["ZAFER AKAR"] && !haftalikProgram["ZAFER AKAR"].includes("İZİN")) {
        for(let i=0; i<5; i++) haftalikProgram["ZAFER AKAR"][i] = "06:30–16:00";
        haftalikProgram["ZAFER AKAR"][5] = "İZİN"; haftalikProgram["ZAFER AKAR"][6] = "İZİN";
    }

    renderTable();
    ozetTablosuGuncelle();
}

function renderTable() {
    const haftaKey = mevcutPazartesi.toISOString().split('T')[0];
    const notlar = haftalikNotlar[haftaKey] || Array(7).fill("");

    let h = `<th>SAATLER</th>` + gunler.map((g, i) => {
        let t = new Date(mevcutPazartesi); t.setDate(t.getDate() + i);
        return `<th>${g}<br><small>${t.toLocaleDateString('tr-TR', {day:'2-digit', month:'2-digit'})}</small></th>`;
    }).join('');
    document.getElementById("tableHeader").innerHTML = h;

    const saatler = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];
    document.getElementById("tableBody").innerHTML = saatler.map(s => `
        <tr><td>${s}</td>${[0,1,2,3,4,5,6].map(g => `<td>${hucreDoldur(g, s)}</td>`).join('')}</tr>
    `).join('');

    // Notlar Satırı
    document.getElementById("tableFooter").innerHTML = `
        <tr><td style="background:#fef08a !important; color:#854d0e">GÜNLÜK NOTLAR</td>
        ${notlar.map(n => `<td class="note-cell">${n || "-"}</td>`).join('')}</tr>
    `;
}

function hucreDoldur(gun, saat) {
    let res = "";
    const isHS = (gun >= 5);
    
    // Zaten atanmış olanlar (MCR/Ingest/Özel)
    personeller.filter(p => haftalikProgram[p.isim][gun] === saat).forEach(p => {
        res += `<div class="birim-card"><span class="birim-tag">${p.birim}</span><span class="p-isim">${p.isim}</span></div>`;
    });

    if(["12:00–22:00", "DIŞ YAYIN", "00:00–07:00", "İZİN"].includes(saat)) return res;

    // Otomatik Atama Mantığı
    birimSiralamasi.forEach(birim => {
        if(birim.includes("MCR")) return;
        let kap = 0;
        if(birim === "Teknik Yönetmen") kap = isHS ? (saat === "06:30–16:00" || saat === "09:00–18:00" || saat === "16:00–00:00" ? 1 : 0) : (saat === "06:30–16:00" ? 2 : (saat === "16:00–00:00" ? 1 : 0));
        else if(birim === "Ses Operatörü") kap = isHS ? (saat === "06:30–16:00" || saat === "09:00–18:00" || saat === "16:00–00:00" ? 2 : 0) : (saat === "06:30–16:00" ? 4 : (saat === "16:00–00:00" ? 2 : 0));
        else if(birim.includes("Playout") || birim.includes("KJ")) kap = isHS ? (saat === "16:00–00:00" ? 2 : (saat === "06:30–16:00" ? 1 : 0)) : (saat === "06:30–16:00" || saat === "16:00–00:00" ? 2 : 0);
        else if(birim.includes("BİLGİ") || birim.includes("YAYIN")) kap = (saat === "09:00–18:00" ? 1 : 0);

        let adaylar = personeller.filter(p => p.birim === birim && !haftalikProgram[p.isim][gun]);
        let suan = personeller.filter(p => p.birim === birim && haftalikProgram[p.isim][gun] === saat).length;
        
        for(let k=0; k < (kap-suan); k++) {
            if(adaylar.length > 0) {
                let p = adaylar.splice(Math.floor(Math.random() * adaylar.length), 1)[0];
                haftalikProgram[p.isim][gun] = saat;
                res += `<div class="birim-card"><span class="birim-tag">${birim}</span><span class="p-isim">${p.isim}</span></div>`;
            }
        }
    });
    return res;
}

function applyMCRRota(birim) {
    const ekip = personeller.filter(p => p.birim === birim);
    const rota = ["06:30–16:00", "06:30–16:00", "16:00–00:00", "16:00–00:00", "00:00–07:00", "00:00–07:00", "İZİN", "İZİN"];
    const ref = new Date(2025, 0, 6);
    ekip.forEach((p, idx) => {
        if(haftalikProgram[p.isim].includes("İZİN")) return;
        for(let i=0; i<7; i++) {
            let d = new Date(mevcutPazartesi.getTime() + (i * 86400000));
            let rI = (Math.floor((d - ref) / 86400000) + (idx * 2)) % 8;
            haftalikProgram[p.isim][i] = rota[rI < 0 ? rI + 8 : rI];
        }
    });
}

function ozetTablosuGuncelle() {
    let h = `<table class="stats-table"><thead><tr><th>Personel</th><th>Birim</th><th>Mesai</th><th>Gece</th><th>Durum</th></tr></thead><tbody>`;
    personeller.forEach(p => {
        const mesai = haftalikProgram[p.isim].filter(v => v && v !== "İZİN").length;
        const gece = haftalikProgram[p.isim].filter(v => v === "00:00–07:00").length;
        let durum = "✅ Uygun";
        if(mesai >= 6) durum = "⚠️ Limit Aşımı";
        
        h += `<tr><td><strong>${p.isim}</strong></td><td><small>${p.birim}</small></td><td>${mesai} G</td><td>${gece}</td><td>${durum}</td></tr>`;
    });
    document.getElementById("ozetTablo").innerHTML = h + "</tbody></table>";
}

function whatsappMesajiOlustur() {
    let m = `📋 *HAFTALIK VARDİYA PLANI*\n\n`;
    gunler.forEach((g, i) => {
        m += `*${g.toUpperCase()}*\n`;
        ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"].forEach(s => {
            let p = personeller.filter(p => haftalikProgram[p.isim][i] === s).map(x => x.isim);
            if(p.length > 0) m += `▫️ ${s}: ${p.join(", ")}\n`;
        });
        m += `\n`;
    });
    navigator.clipboard.writeText(m).then(() => alert("Kopyalandı!"));
}

function haftaDegistir(g) { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + g); tabloyuOlustur(); }
function exportExcel() { XLSX.writeFile(XLSX.utils.table_to_book(document.getElementById("vardiyaTablosu")), "Vardiya.xlsx"); }
function exportPDF() { html2pdf().from(document.getElementById('print-area')).save(); }
function sifirla() { localStorage.clear(); location.reload(); }

window.onload = () => { checklistOlustur(); manageListOlustur(); tabloyuOlustur(); };
/**
 * PRO-Vardiya v16.0 | Persistent & Dynamic Edition
 * Tüm operasyonel kurallar kilitli, yönetim özellikleri aktiftir.
 */

// BAŞLANGIÇ VERİLERİ (LocalStorage yoksa bunlar kullanılır)
let birimler = JSON.parse(localStorage.getItem("birimListesi")) || [
    "TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", 
    "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"
];

let personeller = JSON.parse(localStorage.getItem("personelListesi")) || [
    { id: 1, isim: "YUNUS EMRE YAYLA", birim: "TEKNİK YÖNETMEN" },
    { id: 2, isim: "HASAN CAN SAĞLAM", birim: "TEKNİK YÖNETMEN" },
    { id: 3, isim: "MEHMET BERKMAN", birim: "TEKNİK YÖNETMEN" },
    { id: 4, isim: "EKREM FİDAN", birim: "TEKNİK YÖNETMEN" },
    { id: 5, isim: "CAN ŞENTUNALI", birim: "TEKNİK YÖNETMEN" },
    { id: 6, isim: "BARIŞ İNCE", birim: "TEKNİK YÖNETMEN" },
    { id: 7, isim: "ZAFER AKAR", birim: "SES OPERATÖRÜ" },
    { id: 8, isim: "ENES KALE", birim: "SES OPERATÖRÜ" },
    { id: 15, isim: "SENA MİNARECİ", birim: "PLAYOUT OPERATÖRÜ" },
    { id: 22, isim: "YUSUF İSLAM TORUN", birim: "KJ OPERATÖRÜ" },
    { id: 40, isim: "KADİR YILMAZ", birim: "24TV MCR OPERATÖRÜ" },
    { id: 44, isim: "EMRULLAH AHLATÇI", birim: "360TV MCR OPERATÖRÜ" }
];

const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const saatler = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];

let mevcutPazartesi = getMonday(new Date());
let haftalikProgram = {};

// HAFTA HESAPLAMA
function getMonday(d) {
    d = new Date(d);
    let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

// TEMA DEĞİŞTİRME
function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById("themeBtn");
    if(body.classList.contains("light-mode")) {
        body.classList.replace("light-mode", "dark-mode");
        btn.innerText = "☀️ Aydınlık Mod";
    } else {
        body.classList.replace("dark-mode", "light-mode");
        btn.innerText = "🌙 Karanlık Mod";
    }
}

// YÖNETİM MODU
function modDegistir() {
    const panel = document.getElementById("adminPanel");
    panel.classList.toggle("hidden");
    adminPanelGuncelle();
}

function birimEkle() {
    const ad = document.getElementById("yeniBirimAd").value.toUpperCase();
    if(!ad) return;
    birimler.push(ad);
    localStorage.setItem("birimListesi", JSON.stringify(birimler));
    document.getElementById("yeniBirimAd").value = "";
    adminPanelGuncelle();
}

function personelEkle() {
    const isim = document.getElementById("yeniPersonelIsim").value.toUpperCase();
    const birim = document.getElementById("yeniPersonelBirim").value;
    if(!isim) return;
    personeller.push({ id: Date.now(), isim, birim });
    localStorage.setItem("personelListesi", JSON.stringify(personeller));
    document.getElementById("yeniPersonelIsim").value = "";
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
    const sel = document.getElementById("yeniPersonelBirim");
    sel.innerHTML = birimler.map(b => `<option value="${b}">${b}</option>`).join('');
    
    const list = document.getElementById("yonetimListesi");
    list.innerHTML = personeller.map(p => `
        <div class="yonetim-item">
            <span><b>${p.isim}</b> <br><small>${p.birim}</small></span>
            <button onclick="personelSil(${p.id})" class="btn-del" style="background:red; color:white; padding:2px 5px; border-radius:4px;">Sil</button>
        </div>
    `).join('');
}

// OTOMATİK PLANLAMA VE HAFTALIK KAYIT
function tabloyuOlustur() {
    const haftaKey = "v16_data_" + mevcutPazartesi.toISOString().split('T')[0];
    document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;
    
    // Önce hafızayı kontrol et
    const kaydedilmis = localStorage.getItem(haftaKey);
    if(kaydedilmis) {
        haftalikProgram = JSON.parse(kaydedilmis);
    } else {
        haftalikProgram = {};
        personeller.forEach(p => {
            const isSelected = document.getElementById(`check_${p.id}`)?.checked;
            haftalikProgram[p.isim] = isSelected ? Array(7).fill("İZİN") : Array(7).fill(null);
        });

        // KURALLARI UYGULA (MCR, Ingest, TY vb.)
        applyMCRRota("24TV MCR OPERATÖRÜ");
        applyMCRRota("360TV MCR OPERATÖRÜ");
        applyIngestRota();
        
        // TY Barış & Ekrem Özel
        if(haftalikProgram["BARIŞ İNCE"]) {
            haftalikProgram["BARIŞ İNCE"][0] = "00:00–07:00";
            haftalikProgram["BARIŞ İNCE"][1] = "00:00–07:00";
        }
    }

    renderTable();
    ozetGuncelle();
    localStorage.setItem(haftaKey, JSON.stringify(haftalikProgram));
}

function checklistOlustur() {
    const container = document.getElementById("personelChecklist");
    container.innerHTML = personeller.sort((a,b) => a.birim.localeCompare(b.birim)).map(p => `
        <div class="check-item">
            <input type="checkbox" id="check_${p.id}" onchange="tabloyuOlustur()">
            <label><strong>${p.isim}</strong><br><small>${p.birim}</small></label>
        </div>
    `).join('');
}

function hucreDoldur(gun, saat) {
    const isHS = (gun >= 5);
    
    if(!["12:00–22:00", "DIŞ YAYIN", "İZİN"].includes(saat)) {
        birimler.forEach(birim => {
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
    return list.map(p => `<div class="birim-card"><span class="birim-tag">${p.birim}</span><span class="p-isim">${p.isim}</span></div>`).join('');
}

function renderTable() {
    const h = document.getElementById("tableHeader");
    h.innerHTML = `<th>SAATLER</th>` + gunler.map(g => `<th>${g}</th>`).join('');
    let b = "";
    saatler.forEach(s => {
        b += `<tr><td>${s}</td>`;
        for(let i=0; i<7; i++) b += `<td>${hucreDoldur(i, s)}</td>`;
        b += `</tr>`;
    });
    document.getElementById("tableBody").innerHTML = b;
}

// MCR & INGEST ROTASYON MANTIKLARI
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

// MESAI TAKİBİ
function ozetGuncelle() {
    let h = `<table class="stats-table"><thead><tr><th>Personel</th><th>Birim</th><th>Top. Gün</th><th>Gece</th><th>Durum</th></tr></thead><tbody>`;
    personeller.forEach(p => {
        const gunSayisi = haftalikProgram[p.isim].filter(v => v && v !== "İZİN").length;
        const geceSayisi = haftalikProgram[p.isim].filter(v => v === "00:00–07:00").length;
        h += `<tr>
            <td><strong>${p.isim}</strong></td>
            <td><small>${p.birim}</small></td>
            <td>${gunSayisi} G</td>
            <td>${geceSayisi} G</td>
            <td>${gunSayisi > 5 ? '⚠️ Fazla' : '✅ Normal'}</td>
        </tr>`;
    });
    document.getElementById("ozetTablo").innerHTML = h + "</tbody></table>";
}

function haftaDegistir(g) { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + g); tabloyuOlustur(); }
function exportExcel() { XLSX.writeFile(XLSX.utils.table_to_book(document.getElementById("vardiyaTablosu")), "Teknik_Vardiya.xlsx"); }
function exportPDF() { html2pdf().from(document.getElementById('print-area')).save('Vardiya_Raporu.pdf'); }
function whatsappMesajiOlustur() {
    let m = `📋 *TEKNİK VARDİYA | ${mevcutPazartesi.toLocaleDateString('tr-TR')}*\n\n`;
    gunler.forEach((g, i) => {
        m += `*${g.toUpperCase()}*\n`;
        saatler.forEach(s => {
            let l = personeller.filter(p => haftalikProgram[p.isim][i] === s).map(x => x.isim);
            if(l.length > 0) m += `▫️ ${s}: ${l.join(", ")}\n`;
        });
        m += `\n`;
    });
    navigator.clipboard.writeText(m).then(() => alert("Liste WhatsApp formatında kopyalandı!"));
}

window.onload = () => { checklistOlustur(); tabloyuOlustur(); };
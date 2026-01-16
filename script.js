let mevcutPazartesi = getMonday(new Date());
let haftalikProgram = {};

const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const saatler = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];

// HAFIZADAKİ ÖZEL BİRİM SIRALAMASI
const birimSiralamasi = [
    "Teknik Yönetmen",
    "Ses Operatörü",
    "Playout Operatörü",
    "KJ Operatörü",
    "24TV - 360TV INGEST OPERATÖRÜ",
    "Uplink",
    "24TV-360TV BİLGİ İŞLEM",
    "24TV-360TV YAYIN SİSTEMLERİ",
    "24TV MCR OPERATÖRÜ",
    "360TV MCR OPERATÖRÜ"
];

const personeller = [
    { isim: "VOLKAN DEMİRBAŞ", birim: "24TV-360TV BİLGİ İŞLEM" },
    { isim: "GÖKHAN BAĞIŞ", birim: "24TV-360TV BİLGİ İŞLEM" },
    { isim: "HAKAN ELİPEK", birim: "24TV-360TV BİLGİ İşLEM" },
    { isim: "ÖZKAN KAYA", birim: "24TV-360TV BİLGİ İŞLEM" },
    { isim: "YİĞİT DAYI", birim: "24TV-360TV YAYIN SİSTEMLERİ" },
    { isim: "FERDİ TOPUZ", birim: "24TV-360TV YAYIN SİSTEMLERİ" },
    { isim: "BEYHAN KARAKAŞ", birim: "24TV-360TV YAYIN SİSTEMLERİ" },
    { isim: "FATİH AYBEK", birim: "24TV-360TV YAYIN SİSTEMLERİ" },
    { isim: "AKİF KOÇ", birim: "24TV-360TV YAYIN SİSTEMLERİ" },
    { isim: "KADİR YILMAZ", birim: "24TV MCR OPERATÖRÜ" },
    { isim: "FARUK YILMAZ", birim: "24TV MCR OPERATÖRÜ" },
    { isim: "YUSUF HENEK", birim: "24TV MCR OPERATÖRÜ" },
    { isim: "SEDA KAYA", birim: "24TV MCR OPERATÖRÜ" },
    { isim: "EMRULLAH AHLATÇI", birim: "360TV MCR OPERATÖRÜ" },
    { isim: "EREN KAZAN", birim: "360TV MCR OPERATÖRÜ" },
    { isim: "MUSAB YAKUB DEMİRBAŞ", birim: "360TV MCR OPERATÖRÜ" },
    { isim: "BÜKRE YAVUZ", birim: "360TV MCR OPERATÖRÜ" },
    { isim: "YUNUS EMRE YAYLA", birim: "Teknik Yönetmen" },
    { isim: "HASAN CAN SAĞLAM", birim: "Teknik Yönetmen" },
    { isim: "MEHMET BERKMAN", birim: "Teknik Yönetmen" },
    { isim: "EKREM FİDAN", birim: "Teknik Yönetmen" },
    { isim: "CAN ŞENTUNALI", birim: "Teknik Yönetmen" },
    { isim: "BARIŞ İNCE", birim: "Teknik Yönetmen" },
    { isim: "ZAFER AKAR", birim: "Ses Operatörü" },
    { isim: "ENES KALE", birim: "Ses Operatörü" },
    { isim: "ANIL RİŞVAN", birim: "Ses Operatörü" },
    { isim: "ERSAN TİLBE", birim: "Ses Operatörü" },
    { isim: "ULVİ MUTLUBAŞ", birim: "Ses Operatörü" },
    { isim: "OSMAN DİNÇER", birim: "Ses Operatörü" },
    { isim: "DOĞUŞ MALGIL", birim: "Ses Operatörü" },
    { isim: "ERDOĞAN KÜÇÜKKAYA", birim: "Ses Operatörü" },
    { isim: "SENA MİNARECİ", birim: "Playout Operatörü" },
    { isim: "YUSUF İSLAM TORUN", birim: "KJ Operatörü" },
    { isim: "RAMAZAN KOÇAK", birim: "24TV - 360TV INGEST OPERATÖRÜ" },
    { isim: "Selin", birim: "Uplink" }
];

function getMonday(d) {
    d = new Date(d);
    let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

function checklistOlustur() {
    const container = document.getElementById("personelChecklist");
    const sirali = [...personeller].sort((a, b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim));
    container.innerHTML = sirali.map(p => `
        <div class="check-item">
            <input type="checkbox" id="check_${p.isim.replace(/\s+/g, '_')}" onchange="tabloyuOlustur(false)">
            <label for="check_${p.isim.replace(/\s+/g, '_')}"><strong>${p.isim}</strong><br><small>${p.birim}</small></label>
        </div>
    `).join('');
}

function tabloyuOlustur(devirModu) {
    document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;
    haftalikProgram = {};
    personeller.forEach(p => {
        const isSelected = document.getElementById(`check_${p.isim.replace(/\s+/g, '_')}`)?.checked;
        haftalikProgram[p.isim] = isSelected ? Array(7).fill("İZİN") : Array(7).fill(null);
    });

    // İzinler (Zafer Akar kuralı dahil)
    personeller.forEach(p => {
        if(haftalikProgram[p.isim][0] !== "İZİN") {
            let count = 0;
            if(p.isim === "ZAFER AKAR") { haftalikProgram[p.isim][5] = "İZİN"; haftalikProgram[p.isim][6] = "İZİN"; }
            else {
                while(count < 2) {
                    let r = Math.floor(Math.random() * 7);
                    if(!haftalikProgram[p.isim][r]) { haftalikProgram[p.isim][r] = "İZİN"; count++; }
                }
            }
        }
    });

    // HAFIZADAKİ KRİTİK GECE KURALI (00:00-07:00 Ataması)
    for(let i=0; i<7; i++) {
        planlaZorunlu(i, "Teknik Yönetmen", "00:00–07:00", 1);
        planlaZorunlu(i, "24TV MCR OPERATÖRÜ", "00:00–07:00", 1);
        planlaZorunlu(i, "360TV MCR OPERATÖRÜ", "00:00–07:00", 1);
    }

    renderTable();
    draggablesHazirla();
    ozetGuncelle();
}

function planlaZorunlu(gun, birim, saat, kapasite) {
    let adaylar = personeller.filter(p => p.birim === birim && !haftalikProgram[p.isim][gun]);
    let atanmis = 0;
    while(atanmis < kapasite && adaylar.length > 0) {
        let p = adaylar.splice(Math.floor(Math.random() * adaylar.length), 1)[0];
        haftalikProgram[p.isim][gun] = saat;
        atanmis++;
    }
}

function renderTable() {
    let hHtml = `<th>Vardiya Saatleri</th>`;
    gunler.forEach((g, i) => {
        let t = new Date(mevcutPazartesi);
        t.setDate(t.getDate() + i);
        hHtml += `<th>${g}<br><small>${t.toLocaleDateString('tr-TR', {day:'2-digit', month:'2-digit'})}</small></th>`;
    });
    document.getElementById("tableHeader").innerHTML = hHtml;

    let bHtml = "";
    saatler.forEach(saat => {
        bHtml += `<tr><td><strong>${saat}</strong></td>`;
        for (let i = 0; i < 7; i++) {
            bHtml += `<td class="drop-zone" data-gun="${i}" data-saat="${saat}">${hucreIcerikGetir(i, saat)}</td>`;
        }
        bHtml += `</tr>`;
    });
    
    // İzinliler
    bHtml += `<tr style="background:#f8fafc"><td><strong>İZİNLİLER</strong></td>`;
    for (let i = 0; i < 7; i++) {
        let content = personeller.filter(p => haftalikProgram[p.isim][i] === "İZİN").map(p => `
            <div class="birim-card" draggable="true" data-p="${p.isim}" style="border-left-color:#94a3b8">
                <span class="birim-tag">${p.birim}</span><span class="p-isim">${p.isim}</span>
            </div>`).join('');
        bHtml += `<td class="drop-zone" data-gun="${i}" data-saat="İZİN">${content}</td>`;
    }
    bHtml += `</tr>`;
    document.getElementById("tableBody").innerHTML = bHtml;
}

function hucreIcerikGetir(gun, saat) {
    let html = "";
    personeller.forEach(p => {
        if(haftalikProgram[p.isim][gun] === saat) {
            html += `<div class="birim-card" draggable="true" data-p="${p.isim}">
                <span class="birim-tag">${p.birim}</span><span class="p-isim">${p.isim}</span>
            </div>`;
        }
    });
    if(saat === "00:00–07:00") return html;

    birimSiralamasi.forEach(birim => {
        let kap = 0;
        if (birim === "Teknik Yönetmen") { if (["06:30–16:00", "16:00–00:00"].includes(saat)) kap = 2; }
        else if (birim.includes("MCR")) { if (["06:30–16:00", "16:00–00:00"].includes(saat)) kap = 1; }
        else if (birim.includes("BİLGİ") || birim.includes("YAYIN")) { if (saat === "09:00–18:00") kap = 1; }
        else if (birim === "Ses Operatörü") {
            if (gun < 5) { if (saat === "06:30–16:00") kap = 4; if (saat === "16:00–00:00") kap = 2; }
            else { if (["06:30–16:00", "16:00–00:00"].includes(saat)) kap = 2; }
        } else if (saat === "06:30–16:00") kap = 1;

        let adaylar = personeller.filter(p => p.birim === birim && !haftalikProgram[p.isim][gun]);
        let suan = personeller.filter(p => p.birim === birim && haftalikProgram[p.isim][gun] === saat).length;
        for(let k=0; k < (kap - suan); k++) {
            if(adaylar.length > 0) {
                let p = adaylar.splice(Math.floor(Math.random() * adaylar.length), 1)[0];
                haftalikProgram[p.isim][gun] = saat;
                html += `<div class="birim-card" draggable="true" data-p="${p.isim}">
                    <span class="birim-tag">${birim}</span><span class="p-isim">${p.isim}</span>
                </div>`;
            }
        }
    });
    return html;
}

function draggablesHazirla() {
    const cards = document.querySelectorAll('.birim-card');
    const zones = document.querySelectorAll('.drop-zone');
    cards.forEach(c => {
        c.ondragstart = () => c.classList.add('dragging');
        c.ondragend = () => c.classList.remove('dragging');
    });
    zones.forEach(z => {
        z.ondragover = (e) => { e.preventDefault(); z.style.background = "#f0f9ff"; };
        z.ondragleave = () => { z.style.background = ""; };
        z.ondrop = (e) => {
            z.style.background = "";
            const card = document.querySelector('.dragging');
            if(!card) return;
            const p = card.getAttribute('data-p');
            const gun = z.getAttribute('data-gun');
            const s = z.getAttribute('data-saat');
            haftalikProgram[p][gun] = s;
            z.appendChild(card);
            ozetGuncelle();
        };
    });
}

function ozetGuncelle() {
    let html = `<table><thead><tr><th>Personel</th><th>Birim</th><th>Mesai</th><th>Gece</th></tr></thead><tbody>`;
    const sirali = [...personeller].sort((a, b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim));
    sirali.forEach(p => {
        const m = haftalikProgram[p.isim].filter(v => v && v !== "İZİN").length;
        const g = haftalikProgram[p.isim].filter(v => v === "00:00–07:00").length;
        html += `<tr><td>${p.isim}</td><td>${p.birim}</td><td>${m} G</td><td>${g} G</td></tr>`;
    });
    html += `</tbody></table>`;
    document.getElementById("ozetTablo").innerHTML = html;
}

function whatsappMesajiOlustur() {
    let metin = `📋 *TEKNİK VARDİYA PLANI* \n\n`;
    gunler.forEach((gun, idx) => {
        metin += `*${gun.toUpperCase()}*\n`;
        saatler.forEach(s => {
            let p = personeller.filter(p => haftalikProgram[p.isim][idx] === s).map(x => x.isim);
            if(p.length > 0) metin += `▪️ ${s}: ${p.join(", ")}\n`;
        });
        metin += `\n`;
    });
    navigator.clipboard.writeText(metin).then(() => alert("Kopyalandı!"));
}

function haftaDegistir(g) { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + g); tabloyuOlustur(false); }
function exportExcel() { XLSX.writeFile(XLSX.utils.table_to_book(document.getElementById("vardiyaTablosu")), "Vardiya.xlsx"); }
function exportPDF() { html2pdf().from(document.getElementById('print-area')).save(); }
function sifirla() { localStorage.clear(); location.reload(); }

window.onload = () => { checklistOlustur(); tabloyuOlustur(false); };
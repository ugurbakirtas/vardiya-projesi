let mevcutPazartesi = getMonday(new Date());
let haftalikProgram = {};

const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const saatler = ["00:00–07:00", "06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "DIŞ YAYIN"];

const personeller = [
    { isim: "VOLKAN DEMİRBAŞ", birim: "24TV-360TV BİLGİ İŞLEM", gece: false },
    { isim: "GÖKHAN BAĞIŞ", birim: "24TV-360TV BİLGİ İŞLEM", gece: false },
    { isim: "HAKAN ELİPEK", birim: "24TV-360TV BİLGİ İŞLEM", gece: false },
    { isim: "ÖZKAN KAYA", birim: "24TV-360TV BİLGİ İŞLEM", gece: false },
    { isim: "YİĞİT DAYI", birim: "24TV-360TV YAYIN SİSTEMLERİ", gece: true },
    { isim: "FERDİ TOPUZ", birim: "24TV-360TV YAYIN SİSTEMLERİ", gece: true },
    { isim: "BEYHAN KARAKAŞ", birim: "24TV-360TV YAYIN SİSTEMLERİ", gece: true },
    { isim: "FATİH AYBEK", birim: "24TV-360TV YAYIN SİSTEMLERİ", gece: true },
    { isim: "AKİF KOÇ", birim: "24TV-360TV YAYIN SİSTEMLERİ", gece: true },
    { isim: "KADİR YILMAZ", birim: "24TV MCR OPERATÖRÜ", gece: true },
    { isim: "FARUK YILMAZ", birim: "24TV MCR OPERATÖRÜ", gece: true },
    { isim: "YUSUF HENEK", birim: "24TV MCR OPERATÖRÜ", gece: true },
    { isim: "SEDA KAYA", birim: "24TV MCR OPERATÖRÜ", gece: true },
    { isim: "EMRULLAH AHLATÇI", birim: "360TV MCR OPERATÖRÜ", gece: true },
    { isim: "EREN KAZAN", birim: "360TV MCR OPERATÖRÜ", gece: true },
    { isim: "MUSAB YAKUB DEMİRBAŞ", birim: "360TV MCR OPERATÖRÜ", gece: true },
    { isim: "BÜKRE YAVUZ", birim: "360TV MCR OPERATÖRÜ", gece: true },
    { isim: "YUNUS EMRE YAYLA", birim: "Teknik Yönetmen", gece: true },
    { isim: "HASAN CAN SAĞLAM", birim: "Teknik Yönetmen", gece: true },
    { isim: "MEHMET BERKMAN", birim: "Teknik Yönetmen", gece: true },
    { isim: "EKREM FİDAN", birim: "Teknik Yönetmen", gece: true },
    { isim: "CAN ŞENTUNALI", birim: "Teknik Yönetmen", gece: true },
    { isim: "BARIŞ İNCE", birim: "Teknik Yönetmen", gece: true },
    { isim: "ZAFER AKAR", birim: "Ses Operatörü", gece: false },
    { isim: "ENES KALE", birim: "Ses Operatörü", gece: false },
    { isim: "ANIL RİŞVAN", birim: "Ses Operatörü", gece: false },
    { isim: "ERSAN TİLBE", birim: "Ses Operatörü", gece: false },
    { isim: "ULVİ MUTLUBAŞ", birim: "Ses Operatörü", gece: false },
    { isim: "OSMAN DİNÇER", birim: "Ses Operatörü", gece: false },
    { isim: "DOĞUŞ MALGIL", birim: "Ses Operatörü", gece: false },
    { isim: "ERDOĞAN KÜÇÜKKAYA", birim: "Ses Operatörü", gece: false },
    { isim: "SENA MİNARECİ", birim: "Playout Operatörü", gece: true },
    { isim: "YUSUF İSLAM TORUN", birim: "KJ Operatörü", gece: false },
    { isim: "RAMAZAN KOÇAK", birim: "Ingest Operatörü", gece: true },
    { isim: "Selin", birim: "Uplink", gece: true }
];

const birimler = [...new Set(personeller.map(p => p.birim))];

function getMonday(d) {
    d = new Date(d);
    let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

function init() {
    checklistOlustur();
    tabloyuOlustur(false);
}

function checklistOlustur() {
    const container = document.getElementById("personelChecklist");
    const sirali = [...personeller].sort((a,b) => a.birim.localeCompare(b.birim));
    container.innerHTML = sirali.map(p => `
        <div class="check-item">
            <input type="checkbox" id="check_${p.isim}" onchange="tabloyuOlustur(false)">
            <label for="check_${p.isim}"><strong>${p.isim}</strong><br><small>${p.birim}</small></label>
        </div>
    `).join('');
}

function tabloyuOlustur(devirModu) {
    document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Pazartesi Haftası`;
    
    // Program Sıfırlama ve İzin Atama
    haftalikProgram = {};
    personeller.forEach(p => {
        const isSelected = document.getElementById(`check_${p.isim}`)?.checked;
        haftalikProgram[p.isim] = isSelected ? Array(7).fill("İZİN") : Array(7).fill(null);
    });

    personeller.forEach(p => {
        if(haftalikProgram[p.isim][0] !== "İZİN") {
            let izinCount = 0;
            if(p.isim === "ZAFER AKAR") { haftalikProgram[p.isim][5] = "İZİN"; haftalikProgram[p.isim][6] = "İZİN"; }
            else {
                while(izinCount < 2) {
                    let r = Math.floor(Math.random() * 7);
                    if(!haftalikProgram[p.isim][r]) { haftalikProgram[p.isim][r] = "İZİN"; izinCount++; }
                }
            }
        }
    });

    headerCiz();
    bodyCiz();
    draggablesHazirla();
    ozetGuncelle();
}

function headerCiz() {
    let html = `<th>Vardiya Saatleri</th>`;
    gunler.forEach((g, i) => {
        let t = new Date(mevcutPazartesi);
        t.setDate(t.getDate() + i);
        html += `<th>${g}<br><small>${t.toLocaleDateString('tr-TR', {day:'2-digit', month:'2-digit'})}</small></th>`;
    });
    document.getElementById("tableHeader").innerHTML = html;
}

function bodyCiz() {
    let html = "";
    // Önce saatleri döndürüyoruz, ancak Teknik Yönetmen GECE atamasını içeride önceliklendiriyoruz
    saatler.forEach(saat => {
        html += `<tr><td><strong>${saat}</strong></td>`;
        for (let i = 0; i < 7; i++) {
            html += `<td class="drop-zone" data-gun="${i}" data-saat="${saat}">${hucreDoldur(i, saat)}</td>`;
        }
        html += `</tr>`;
    });
    
    // İzinliler
    html += `<tr style="background:#f8fafc"><td><strong>İZİNLİLER</strong></td>`;
    for (let i = 0; i < 7; i++) {
        let izinliler = personeller.filter(p => haftalikProgram[p.isim][i] === "İZİN");
        let content = izinliler.map(p => `
            <div class="birim-card" draggable="true" data-p="${p.isim}" style="border-left-color:#94a3b8">
                <span class="birim-tag">${p.birim}</span><span class="p-isim">${p.isim}</span>
            </div>`).join('');
        html += `<td class="drop-zone" data-gun="${i}" data-saat="İZİN">${content}</td>`;
    }
    html += `</tr>`;
    document.getElementById("tableBody").innerHTML = html;
}

function hucreDoldur(gunIdx, saat) {
    let content = "";
    birimler.forEach(birim => {
        let kapasite = 0;
        
        // --- KRİTİK GECE VE KAPASİTE MANTIĞI ---
        if (birim === "Teknik Yönetmen") {
            if (saat === "00:00–07:00") kapasite = 1; // HER GÜN 1 KİŞİ ŞART
            else if (["06:30–16:00", "16:00–00:00"].includes(saat)) kapasite = 2;
        } 
        else if (birim.includes("MCR")) {
            if (["06:30–16:00", "16:00–00:00", "00:00–07:00"].includes(saat)) kapasite = 1;
        }
        else if (birim.includes("BİLGİ") || birim.includes("YAYIN")) {
            if (saat === "09:00–18:00") kapasite = 1;
        }
        else if (birim === "Ses Operatörü") {
            if (gunIdx < 5) {
                if (saat === "06:30–16:00") kapasite = 4;
                if (saat === "16:00–00:00") kapasite = 2;
            } else {
                if (["06:30–16:00", "16:00–00:00"].includes(saat)) kapasite = 2;
            }
        } else if (saat === "06:30–16:00") kapasite = 1;

        let adaylar = personeller.filter(p => p.birim === birim && !haftalikProgram[p.isim][gunIdx]);
        
        // Eğer gece vardiyası ise ve kimse atanmamışsa, uygun olanı zorla ata
        for(let k=0; k < kapasite; k++) {
            if(adaylar.length > 0) {
                // Gece vardiyası ise uygunluk kontrolü (Haftalık max 2 gece)
                let pIdx = 0;
                if(saat === "00:00–07:00") {
                    pIdx = adaylar.findIndex(p => p.gece && haftalikProgram[p.isim].filter(v => v === "00:00–07:00").length < 2);
                    if(pIdx === -1) pIdx = 0; // Eğer kriter tutmasa da birini ata (Süreklilik için)
                }

                let secilen = adaylar.splice(pIdx, 1)[0];
                haftalikProgram[secilen.isim][gunIdx] = saat;
                content += `<div class="birim-card" draggable="true" data-p="${secilen.isim}">
                    <span class="birim-tag">${birim}</span><span class="p-isim">${secilen.isim}</span>
                </div>`;
            }
        }
    });
    return content;
}

function draggablesHazirla() {
    const cards = document.querySelectorAll('.birim-card');
    const zones = document.querySelectorAll('.drop-zone');
    cards.forEach(c => {
        c.ondragstart = () => c.classList.add('dragging');
        c.ondragend = () => c.classList.remove('dragging');
    });
    zones.forEach(z => {
        z.ondragover = (e) => { e.preventDefault(); z.style.background = "#e0f2fe"; };
        z.ondragleave = () => { z.style.background = ""; };
        z.ondrop = (e) => {
            z.style.background = "";
            const card = document.querySelector('.dragging');
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
    let html = `<table style="width:100%; font-size:10px"><thead><tr><th>Personel</th><th>Birim</th><th>Mesai</th><th>Gece</th></tr></thead><tbody>`;
    personeller.sort((a,b) => a.birim.localeCompare(b.birim)).forEach(p => {
        const m = haftalikProgram[p.isim].filter(v => v && v !== "İZİN").length;
        const g = haftalikProgram[p.isim].filter(v => v === "00:00–07:00").length;
        html += `<tr><td>${p.isim}</td><td>${p.birim}</td><td>${m} G</td><td>${g} G</td></tr>`;
    });
    html += `</tbody></table>`;
    document.getElementById("ozetTablo").innerHTML = html;
}

function whatsappMesajiOlustur() {
    let metin = `📋 *YENİ VARDİYA PLANI* \n\n`;
    gunler.forEach((gun, idx) => {
        metin += `*${gun.toUpperCase()}*\n`;
        saatler.forEach(s => {
            let p = personeller.filter(p => haftalikProgram[p.isim][idx] === s).map(x => x.isim);
            if(p.length > 0) metin += `▪️ ${s}: ${p.join(", ")}\n`;
        });
        metin += `\n`;
    });
    navigator.clipboard.writeText(metin);
    alert("WhatsApp mesajı kopyalandı!");
}

function haftaDegistir(gun) { mevcutPazartesi.setDate(mevcutPazartesi.getDate() + gun); tabloyuOlustur(false); }
function exportExcel() { XLSX.writeFile(XLSX.utils.table_to_book(document.getElementById("vardiyaTablosu")), "Vardiya.xlsx"); }
function exportPDF() { html2pdf().from(document.getElementById('print-area')).save(); }
function sifirla() { localStorage.clear(); location.reload(); }

window.onload = init;
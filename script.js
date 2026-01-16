let mevcutPazartesi = getMonday(new Date());
let haftalikProgram = {};

const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const saatler = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];

// --- PERSONEL VERİSİ ---
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
    const baslangicTarihi = new Date(mevcutPazartesi);
    document.getElementById("tarihAraligi").innerText = `${baslangicTarihi.toLocaleDateString('tr-TR')} Pazartesi Haftası`;
    
    haftalikProgram = {};
    personeller.forEach(p => {
        const isSelected = document.getElementById(`check_${p.isim}`)?.checked;
        haftalikProgram[p.isim] = isSelected ? Array(7).fill("İZİN") : Array(7).fill(null);
    });

    // Otomatik İzin Atama (Haftalık 2 gün)
    personeller.forEach(p => {
        if(haftalikProgram[p.isim][0] !== "İZİN") {
            if(p.isim === "ZAFER AKAR") { 
                haftalikProgram[p.isim][5] = "İZİN"; haftalikProgram[p.isim][6] = "İZİN"; 
            } else {
                let count = 0;
                while(count < 2) {
                    let r = Math.floor(Math.random() * 7);
                    if(!haftalikProgram[p.isim][r]) { haftalikProgram[p.isim][r] = "İZİN"; count++; }
                }
            }
        }
    });

    // Tabloyu Çiz
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
    saatler.forEach(saat => {
        html += `<tr><td class="saat-kolon"><strong>${saat}</strong></td>`;
        for (let i = 0; i < 7; i++) {
            html += `<td class="drop-zone" data-gun="${i}" data-saat="${saat}">${hucreIcerikGetir(i, saat)}</td>`;
        }
        html += `</tr>`;
    });

    // İzinliler Satırı
    html += `<tr class="izin-row"><td><strong>İZİNLİLER</strong></td>`;
    for (let i = 0; i < 7; i++) {
        let icerik = "";
        personeller.forEach(p => {
            if(haftalikProgram[p.isim][i] === "İZİN") {
                icerik += `<div class="birim-card" draggable="true" data-p="${p.isim}" style="border-left-color:#94a3b8">
                    <span class="birim-tag">${p.birim}</span><span class="p-isim">${p.isim}</span>
                </div>`;
            }
        });
        html += `<td class="drop-zone" data-gun="${i}" data-saat="İZİN">${icerik}</td>`;
    }
    html += `</tr>`;
    document.getElementById("tableBody").innerHTML = html;
}

function hucreIcerikGetir(gunIdx, saat) {
    let content = "";
    birimler.forEach(birim => {
        let kapasite = 0;
        // Akıllı Kapasite Kuralları
        if (birim.includes("MCR")) kapasite = (["06:30–16:00", "16:00–00:00", "00:00–07:00"].includes(saat)) ? 1 : 0;
        else if (birim.includes("BİLGİ") || birim.includes("YAYIN")) kapasite = (saat === "09:00–18:00") ? 1 : 0;
        else if (birim === "Teknik Yönetmen") kapasite = (saat === "00:00–07:00") ? 1 : (["06:30–16:00", "16:00–00:00"].includes(saat)) ? 2 : 0;
        else if (birim === "Ses Operatörü") {
            if (gunIdx < 5) kapasite = (saat === "06:30–16:00") ? 4 : (saat === "16:00–00:00") ? 2 : 0;
            else kapasite = (["06:30–16:00", "16:00–00:00"].includes(saat)) ? 2 : 0;
        } else if (saat === "06:30–16:00") kapasite = 1;

        let adaylar = personeller.filter(p => p.birim === birim && !haftalikProgram[p.isim][gunIdx]);
        for(let k=0; k < kapasite; k++) {
            if(adaylar.length > 0) {
                let p = adaylar.splice(Math.floor(Math.random() * adaylar.length), 1)[0];
                haftalikProgram[p.isim][gunIdx] = saat;
                content += `<div class="birim-card" draggable="true" data-p="${p.isim}">
                    <span class="birim-tag">${birim}</span><span class="p-isim">${p.isim}</span>
                </div>`;
            }
        }
    });
    return content;
}

// --- SÜRÜKLE BIRAK MANTIĞI ---
function draggablesHazirla() {
    const cards = document.querySelectorAll('.birim-card');
    const zones = document.querySelectorAll('.drop-zone');

    cards.forEach(card => {
        card.addEventListener('dragstart', () => card.classList.add('dragging'));
        card.addEventListener('dragend', () => card.classList.remove('dragging'));
    });

    zones.forEach(zone => {
        zone.addEventListener('dragover', e => {
            e.preventDefault();
            zone.classList.add('drag-over');
        });
        zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
        zone.addEventListener('drop', e => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            const draggingCard = document.querySelector('.dragging');
            const pIsim = draggingCard.getAttribute('data-p');
            const yeniGun = parseInt(zone.getAttribute('data-gun'));
            const yeniSaat = zone.getAttribute('data-saat');

            // Çakışma Kontrolü
            if (haftalikProgram[pIsim][yeniGun] && yeniSaat !== "İZİN") {
                showAlert(`${pIsim} zaten o gün başka bir vardiyada!`, "danger");
            } else {
                haftalikProgram[pIsim][yeniGun] = yeniSaat;
                zone.appendChild(draggingCard);
                ozetGuncelle();
            }
        });
    });
}

function showAlert(msg) {
    const b = document.getElementById("alertBox");
    b.innerText = msg; b.style.display = "block";
    setTimeout(() => b.style.display = "none", 3000);
}

function ozetGuncelle() {
    let html = `<table style="width:100%; font-size:11px"><thead><tr><th>İsim</th><th>Mesai</th><th>Gece</th></tr></thead><tbody>`;
    personeller.forEach(p => {
        const m = haftalikProgram[p.isim].filter(v => v && v !== "İZİN").length;
        const g = haftalikProgram[p.isim].filter(v => v === "00:00–07:00").length;
        html += `<tr><td>${p.isim}</td><td>${m}</td><td>${g}</td></tr>`;
    });
    html += `</tbody></table>`;
    document.getElementById("ozetTablo").innerHTML = html;
}

function whatsappMesajiOlustur() {
    let metin = `📝 *HAFTALIK TEKNİK VARDİYA* (${document.getElementById("tarihAraligi").innerText})\n\n`;
    gunler.forEach((gun, idx) => {
        metin += `*${gun.toUpperCase()}*\n`;
        saatler.forEach(s => {
            let calisanlar = personeller.filter(p => haftalikProgram[p.isim][idx] === s).map(p => p.isim);
            if(calisanlar.length > 0) metin += `▪️ ${s}: ${calisanlar.join(", ")}\n`;
        });
        metin += `\n`;
    });
    navigator.clipboard.writeText(metin);
    showAlert("WhatsApp mesajı kopyalandı!");
}

function haftaDegistir(gun) {
    mevcutPazartesi.setDate(mevcutPazartesi.getDate() + gun);
    tabloyuOlustur(true);
}

function exportExcel() { XLSX.writeFile(XLSX.utils.table_to_book(document.getElementById("vardiyaTablosu")), "Teknik_Vardiya.xlsx"); }
function exportPDF() { html2pdf().from(document.getElementById('print-area')).save(); }
function sifirla() { localStorage.clear(); location.reload(); }

window.onload = init;
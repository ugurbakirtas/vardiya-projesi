/**
 * PRO-Vardiya v20.0 | Akıllı Kural Motoru
 */

// ... (birimSiralamasi, gunler, saatler ve sabitPersoneller v19.0 ile aynı) ...
// (Aşağıdaki kısımlar v20.0 için güncellenmiştir)

let algoritmaKuralları = JSON.parse(localStorage.getItem("algoritmaKurallari")) || [];

function baslat() {
    // Kapasite ve Tema ayarları (v19 ile aynı)
    kapasiteVerileriniHazirla();
    if(localStorage.getItem("theme") === "dark") document.body.classList.add("dark-mode");
    updateThemeIcon();
}

function tabDegistir(tab) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.remove('hidden');
    event.currentTarget.classList.add('active');
    
    if(tab === 'kurallar') kuralArayuzunuHazirla();
}

function kuralArayuzunuHazirla() {
    const pSel = document.getElementById("kuralPersonel");
    const sSel = document.getElementById("kuralSaat");
    
    pSel.innerHTML = tumPersoneller.map(p => `<option value="${p.isim}">${p.isim} (${p.birim})</option>`).join('');
    sSel.innerHTML = `<option value="Hepsi">Tüm Saatler</option>` + saatler.map(s => `<option value="${s}">${s}</option>`).join('');
    
    kuralListesiniCiz();
}

function kuralKaydet() {
    const yeni = {
        id: Date.now(),
        personel: document.getElementById("kuralPersonel").value,
        gun: document.getElementById("kuralGun").value,
        saat: document.getElementById("kuralSaat").value,
        tip: document.getElementById("kuralTip").value
    };
    algoritmaKuralları.push(yeni);
    localStorage.setItem("algoritmaKurallari", JSON.stringify(algoritmaKuralları));
    kuralListesiniCiz();
}

function kuralListesiniCiz() {
    const cont = document.getElementById("aktifKurallarListesi");
    cont.innerHTML = algoritmaKuralları.map(k => `
        <div class="kural-item ${k.tip}">
            <div>
                <small>${k.tip === 'YASAK' ? '🚫 YASAK' : '✅ SABİT'}</small><br>
                <strong>${k.personel}</strong><br>
                ${k.gun === 'Hepsi' ? 'Her Gün' : gunler[k.gun]} | ${k.saat}
            </div>
            <button onclick="kuralSil(${k.id})" style="border:none; background:none; cursor:pointer; font-size:20px">🗑️</button>
        </div>
    `).join('');
}

function kuralSil(id) {
    algoritmaKuralları = algoritmaKuralları.filter(k => k.id !== id);
    localStorage.setItem("algoritmaKurallari", JSON.stringify(algoritmaKuralları));
    kuralListesiniCiz();
}

// ANA ALGORİTMA GÜNCELLEMESİ
function tabloyuOlustur() {
    document.getElementById("tarihAraligi").innerText = `${mevcutPazartesi.toLocaleDateString('tr-TR')} Haftası`;
    haftalikProgram = {};

    // 1. ADIM: Temel Atama (İzinler ve Zorunlu Kurallar)
    tumPersoneller.forEach(p => {
        haftalikProgram[p.isim] = Array(7).fill(null);
        
        // Eğer kullanıcı checklist'ten izinliyse
        if(document.getElementById(`check_${p.id}`)?.checked) {
            haftalikProgram[p.isim] = Array(7).fill("İZİN");
        }

        // ZORUNLU (SABİTLEME) KURALLARINI UYGULA
        algoritmaKuralları.filter(k => k.personel === p.isim && k.tip === 'ZORUNLU').forEach(k => {
            if(k.gun === 'Hepsi') {
                for(let i=0; i<7; i++) if(haftalikProgram[p.isim][i] !== "İZİN") haftalikProgram[p.isim][i] = k.saat;
            } else {
                if(haftalikProgram[p.isim][parseInt(k.gun)] !== "İZİN") haftalikProgram[p.isim][parseInt(k.gun)] = k.saat;
            }
        });
    });

    // 2. ADIM: Otomatik Dağıtım (Yasakları Gözeterek)
    renderTable();
    ozetGuncelle();
}

function hucreDoldur(gun, saat) {
    const isHS = (gun >= 5);
    
    birimSiralamasi.forEach(birim => {
        if(birim.includes("MCR") || birim.includes("INGEST")) return;
        
        let kap = 0;
        if(kapasiteAyarlari[birim] && kapasiteAyarlari[birim][saat]) {
            kap = isHS ? kapasiteAyarlari[birim][saat].haftasonu : kapasiteAyarlari[birim][saat].haftaici;
        }

        // Mevcut atananlar (Zorunlu kurallardan gelenler)
        let adaylar = tumPersoneller.filter(p => {
            // Birimi doğru mu?
            if(p.birim !== birim) return false;
            // O gün boş mu?
            if(haftalikProgram[p.isim][gun] !== null) return false;
            // YASAK kuralı var mı?
            let yasakliMi = algoritmaKuralları.some(k => 
                k.personel === p.isim && 
                k.tip === 'YASAK' && 
                (k.gun === 'Hepsi' || parseInt(k.gun) === gun) && 
                (k.saat === 'Hepsi' || k.saat === saat)
            );
            return !yasakliMi;
        });

        let suan = tumPersoneller.filter(p => p.birim === birim && haftalikProgram[p.isim][gun] === saat).length;
        
        for(let k=0; k < (kap-suan); k++) {
            if(adaylar.length > 0) {
                let p = adaylar.splice(Math.floor(Math.random() * adaylar.length), 1)[0];
                haftalikProgram[p.isim][gun] = saat;
            }
        }
    });

    let list = tumPersoneller.filter(p => haftalikProgram[p.isim][gun] === saat);
    list.sort((a,b) => birimSiralamasi.indexOf(a.birim) - birimSiralamasi.indexOf(b.birim));
    return list.map(p => `<div class="birim-card"><span class="birim-tag">${p.birim}</span><span class="p-isim">${p.isim}</span></div>`).join('');
}

// ... (Geri kalan rota ve export fonksiyonları v19.0 ile aynıdır) ...
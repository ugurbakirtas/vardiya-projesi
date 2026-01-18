// --- 1. AYARLAR VE VERİ DURUMU ---
const ADMIN_PASSWORD = "admin123"; 
const DEFAULT_UNITS = ["TEKNİK YÖNETMEN", "SES OPERATÖRÜ", "PLAYOUT OPERATÖRÜ", "KJ OPERATÖRÜ", "INGEST OPERATÖRÜ", "BİLGİ İŞLEM", "YAYIN SİSTEMLERİ", "24TV MCR OPERATÖRÜ", "360TV MCR OPERATÖRÜ"];
const DEFAULT_SHIFTS = ["06:30–16:00", "09:00–18:00", "12:00–22:00", "16:00–00:00", "00:00–07:00", "DIŞ YAYIN"];
const UNIT_COLORS = { "TEKNİK YÖNETMEN": "#e74c3c", "SES OPERATÖRÜ": "#3498db", "PLAYOUT OPERATÖRÜ": "#2ecc71", "KJ OPERATÖRÜ": "#f1c40f", "INGEST OPERATÖRÜ": "#9b59b6", "BİLGİ İŞLEM": "#34495e", "YAYIN SİSTEMLERİ": "#1abc9c", "24TV MCR OPERATÖRÜ": "#e67e22", "360TV MCR OPERATÖRÜ": "#d35400" };

let state = {
    birimler: JSON.parse(localStorage.getItem("v47_birimler")) || DEFAULT_UNITS,
    saatler: JSON.parse(localStorage.getItem("v47_saatler")) || DEFAULT_SHIFTS,
    personeller: JSON.parse(localStorage.getItem("v47_personeller")) || [],
    kapasite: JSON.parse(localStorage.getItem("v47_kapasite")) || {},
    manuelAtamalar: JSON.parse(localStorage.getItem("v47_manuelAtamalar")) || {}
};

let swapSource = null; // Takas (Swap) için geçici hafıza
let currentMonday = getMonday(new Date());
function getMonday(d) { d = new Date(d); let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); return new Date(d.setDate(diff)); }
function save() { Object.keys(state).forEach(k => localStorage.setItem(`v47_${k}`, JSON.stringify(state[k]))); }

// --- 2. ÖZEL FONKSİYONLAR (SWAP & GÜVENLİK) ---
function toggleAdminPanel() {
    const panel = document.getElementById("adminPanel");
    if (panel.classList.contains("hidden")) {
        const pass = prompt("Yönetici Şifresini Girin:");
        if (pass === ADMIN_PASSWORD) { panel.classList.remove("hidden"); refreshUI(); } 
        else { alert("Hatalı Şifre!"); }
    } else { panel.classList.add("hidden"); }
}

// SWAP (TAKAS) MOTORU
function swapHazirla(pAd, gunIdx, mevcutVardiya) {
    if (!swapSource) {
        swapSource = { pAd, gunIdx, vardiya: mevcutVardiya };
        alert(`${pAd} seçildi. Şimdi takas etmek istediğiniz diğer kişiye tıklayın.`);
    } else {
        const haftaKey = currentMonday.toISOString().split('T')[0];
        const targetK = `${haftaKey}_${pAd}_${gunIdx}`;
        const sourceK = `${haftaKey}_${swapSource.pAd}_${swapSource.gunIdx}`;

        // Yer değiştir
        state.manuelAtamalar[sourceK] = mevcutVardiya;
        state.manuelAtamalar[targetK] = swapSource.vardiya;

        swapSource = null;
        save();
        tabloyuOlustur();
        alert("Vardiyalar başarıyla takas edildi!");
    }
}

// --- 3. ANA MOTOR (DİNLENME KURALI DAHİL) ---
function tabloyuOlustur() {
    const haftaKey = currentMonday.toISOString().split('T')[0];
    document.getElementById("tarihAraligi").innerText = `${currentMonday.toLocaleDateString('tr-TR')} Haftası`;
    
    let program = {};
    let calismaSayisi = {};
    let dinlenmeIhlalleri = [];

    state.personeller.forEach(p => { 
        program[p.ad] = Array(7).fill(null); 
        calismaSayisi[p.ad] = 0; 
        if(document.getElementById(`check_${p.id}`)?.checked) program[p.ad].fill("İZİNLİ"); 
    });

    // Manuel Atamalar
    state.personeller.forEach(p => { 
        for(let i=0; i<7; i++) { 
            let mK = `${haftaKey}_${p.ad}_${i}`; 
            if(state.manuelAtamalar[mK]) { 
                program[p.ad][i] = state.manuelAtamalar[mK]; 
                if(!["İZİNLİ","BOŞALT"].includes(program[p.ad][i])) calismaSayisi[p.ad]++; 
            } 
        } 
    });

    // Teknik Yönetmen Rotasyonu (Kural: 00:00 vardiyası rotasyonlu)
    for(let i=0; i<7; i++) { 
        let g = (i < 2) ? "BARIŞ İNCE" : "EKREM FİDAN"; 
        if(program[g] && program[g][i] === null) { program[g][i] = "00:00–07:00"; calismaSayisi[g]++; } 
    }

    // Kapasite Dağıtımı
    for(let i=0; i<7; i++) {
        state.birimler.forEach(birim => {
            state.saatler.forEach(saat => {
                let k = `${birim}_${saat}`; 
                let hedef = state.kapasite[k] ? ((i >= 5) ? state.kapasite[k].hs : state.kapasite[k].h) : 0;
                let mevcut = state.personeller.filter(p => p.birim === birim && program[p.ad][i] === saat).length;
                
                if(mevcut < hedef) {
                    let adaylar = state.personeller.filter(p => p.birim === birim && program[p.ad][i] === null && calismaSayisi[p.ad] < 5).sort((a,b) => calismaSayisi[a.ad] - calismaSayisi[b.ad]);
                    for(let j=0; j < (hedef - mevcut) && adaylar[j]; j++) { 
                        program[adaylar[j].ad][i] = saat; 
                        calismaSayisi[adaylar[j].ad]++; 
                    }
                }
            });
        });
    }

    // 11 SAAT DİNLENME KONTROLÜ
    state.personeller.forEach(p => {
        for(let i=1; i<7; i++) { // 1. günden başla (bir önceki günü kontrol etmek için)
            let oncekiGun = program[p.ad][i-1];
            let bugun = program[p.ad][i];
            // Eğer dün GECE (00:00) ise ve bugün SABAH (06:30 veya 09:00) ise ihlaldir
            if(oncekiGun === "00:00–07:00" && (bugun === "06:30–16:00" || bugun === "09:00–18:00")) {
                dinlenmeIhlalleri.push(`${p.ad} (${i+1}. Gün)`);
            }
        }
    });

    uyariPaneliniGuncelle(dinlenmeIhlalleri);
    render(program, dinlenmeIhlalleri);
}

// --- 4. GÖRSELLEŞTİRME ---
function render(program, ihlaller) {
    const body = document.getElementById("tableBody");
    body.innerHTML = state.saatler.map(s => `
        <tr>
            <td><strong>${s}</strong></td>
            ${[0,1,2,3,4,5,6].map(i => `
                <td>
                    ${state.personeller.filter(p => program[p.ad][i] === s).map(p => {
                        const ihlalMi = ihlaller.includes(`${p.ad} (${i+1}. Gün)`);
                        return `
                            <div class="birim-card ${ihlalMi ? 'ihlal-animasyon' : ''}" 
                                 onclick="vardiyaMenu('${p.ad}', ${i}, '${s}')"
                                 style="border-left:5px solid ${UNIT_COLORS[p.birim]}; ${ihlalMi ? 'background:#ffebee; border:2px solid red;' : ''}">
                                <span class="birim-tag" style="background:${UNIT_COLORS[p.birim]}">${p.birim}</span>
                                ${ihlalMi ? '⚠️ ' : ''}${p.ad}
                            </div>`;
                    }).join('')}
                </td>`).join('')}
        </tr>`).join('');
}

function vardiyaMenu(pAd, gunIdx, mevcutVardiya) {
    const secim = confirm(`${pAd} için işlem seçin:\n\nTAMAM: Vardiya Değiştir\nİPTAL: Başka Personelle Takas Et (Swap)`);
    if (secim) {
        vardiyaDegistir(pAd, gunIdx);
    } else {
        swapHazirla(pAd, gunIdx, mevcutVardiya);
    }
}

function uyariPaneliniGuncelle(ihlaller) {
    const p = document.getElementById("alertPanel");
    if (ihlaller.length > 0) {
        p.innerHTML = `❌ <b>Dinlenme İhlali (11 Saat):</b> ${ihlaller.join(", ")} personeli dinlenmeden göreve yazıldı!`;
        p.className = "alert-danger ihlal-vurgu";
    } else {
        p.innerHTML = "✅ Tüm dinlenme süreleri ve kapasiteler uygun.";
        p.className = "alert-success";
    }
}

// --- DİĞER STANDART FONKSİYONLAR ---
function vardiyaDegistir(p, i) {
    const sirali = [...state.saatler].sort();
    let m = `${p} - Yeni Vardiya:\n` + sirali.map((s, idx) => `${idx + 1}- ${s}`).join("\n");
    let s = prompt(m);
    if(s) {
        let res = s.toUpperCase();
        if(!isNaN(s) && sirali[parseInt(s)-1]) res = sirali[parseInt(s)-1];
        state.manuelAtamalar[`${currentMonday.toISOString().split('T')[0]}_${p}_${i}`] = res;
        save(); tabloyuOlustur();
    }
}

// (KapasiteCiz, checklistOlustur, refreshUI vb. fonksiyonlar öncekiyle aynı kalacak şekilde buraya eklenir)
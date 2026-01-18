let employees = [];
let hours = [];
const adminUser = { username: "admin", password: "1234" };

const rotationCycle = [
  "Sabah","Sabah",
  "Akşam","Akşam",
  "Gece","Gece",
  "İzin","İzin"
];

function login() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  const msg = document.getElementById("loginMessage");

  if (user === adminUser.username && pass === adminUser.password) {
    msg.innerHTML = "Giriş başarılı!";
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("adminSection").style.display = "block";
    document.getElementById("shiftSection").style.display = "block";
    document.getElementById("hourSection").style.display = "block";
  } else {
    msg.innerHTML = "Hatalı kullanıcı adı veya şifre!";
  }
}

// Çalışan Yönetimi
function addEmployee() {
  const firstName = document.getElementById("employeeFirstName").value;
  const lastName = document.getElementById("employeeLastName").value;
  const unit = document.getElementById("employeeUnit").value;
  const rotationActive = document.getElementById("unitRotation").checked;

  if (firstName && lastName && unit) {
    employees.push({
      firstName: firstName,
      lastName: lastName,
      unit: unit,
      izin: [],
      rotationActive: rotationActive,
      rotationIndex: 0
    });
    updateEmployeeList();
    document.getElementById("employeeFirstName").value = "";
    document.getElementById("employeeLastName").value = "";
    document.getElementById("employeeUnit").value = "";
    document.getElementById("unitRotation").checked = false;
  }
}

function updateEmployeeList() {
  const list = document.getElementById("employeeList");
  list.innerHTML = "";
  employees.forEach((emp, index) => {
    list.innerHTML += `
      <li>
        ${emp.firstName} ${emp.lastName} (${emp.unit}) 
        ${emp.rotationActive ? "→ Döngü Aktif" : ""}
        <button onclick="removeEmployee(${index})">Sil</button>
        <button onclick="addIzin(${index})">İzin Ekle</button>
        <span>İzin Günleri: ${emp.izin.join(", ") || "Yok"}</span>
      </li>`;
  });
}

function removeEmployee(index) {
  employees.splice(index, 1);
  updateEmployeeList();
}

function addIzin(index) {
  let gun = prompt("İzin günü girin (örn: 3)");
  if (gun) {
    employees[index].izin.push(parseInt(gun));
    updateEmployeeList();
  }
}

// Saat Yönetimi
function addHour() {
  const range = document.getElementById("hourRange").value;
  const weekdayCap = parseInt(document.getElementById("weekdayCapacity").value);
  const weekendCap = parseInt(document.getElementById("weekendCapacity").value);

  if (range && weekdayCap > 0 && weekendCap > 0) {
    hours.push({ range: range, weekdayCapacity: weekdayCap, weekendCapacity: weekendCap });
    updateHourList();
    document.getElementById("hourRange").value = "";
    document.getElementById("weekdayCapacity").value = "";
    document.getElementById("weekendCapacity").value = "";
  }
}

function updateHourList() {
  const list = document.getElementById("hourList");
  list.innerHTML = "";
  hours.forEach((h, index) => {
    list.innerHTML += `<li>${h.range} → Hafta İçi: ${h.weekdayCapacity}, Hafta Sonu: ${h.weekendCapacity} 
      <button onclick="removeHour(${index})">Sil</button></li>`;
  });
}

function removeHour(index) {
  hours.splice(index, 1);
  updateHourList();
}

// Vardiya Planı
function generateShifts() {
  const dayCount = parseInt(document.getElementById("dayCount").value);
  
  let resultHTML = "<h3>Vardiya Planı</h3><table border='1' cellpadding='5'><tr><th>Gün</th>";
  hours.forEach(h => resultHTML += `<th>${h.range}</th>`);
  resultHTML += "</tr>";

  for (let day = 1; day <= dayCount; day++) {
    let row = `<tr><td>Gün ${day}</td>`;
    hours.forEach((h, i) => {
      let isWeekend = (day % 7 === 6 || day % 7 === 0);
      let capacity = isWeekend ? h.weekendCapacity : h.weekday
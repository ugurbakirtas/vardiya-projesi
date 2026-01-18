let employees = [];
let hours = [];

const rotationCycle = ["Sabah","Sabah","Akşam","Akşam","Gece","Gece","İzin","İzin"];

function addEmployee() {
  const firstName = document.getElementById("employeeFirstName").value;
  const lastName = document.getElementById("employeeLastName").value;
  const unit = document.getElementById("employeeUnit").value;
  const rotationActive = document.getElementById("unitRotation").checked;

  if (firstName && lastName && unit) {
    employees.push({firstName,lastName,unit,rotationActive,rotationIndex:0,izin:[]});
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
    list.innerHTML += `<li>
      ${emp.firstName} ${emp.lastName} (${emp.unit}) ${emp.rotationActive ? "→ Döngü Aktif" : ""}
      <button onclick="removeEmployee(${index})">Sil</button>
      <button onclick="addIzin(${index})">İzin Ekle</button>
      <br><small>İzin: ${emp.izin.join(", ") || "Yok"}</small>
    </li>`;
  });
}

function removeEmployee(index) {
  employees.splice(index, 1);
  updateEmployeeList();
}

function addIzin(index) {
  const gun = prompt("İzin günü girin (örn: 3)");
  if (gun) {
    employees[index].izin.push(parseInt(gun));
    updateEmployeeList();
  }
}

function addHour() {
  const range = document.getElementById("hourRange").value;
  const weekdayCap = parseInt(document.getElementById("weekdayCapacity").value);
  const weekendCap = parseInt(document.getElementById("weekendCapacity").value);

  if (range && weekdayCap && weekendCap) {
    hours.push({range,weekdayCap,weekendCap});
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
    list.innerHTML += `<li>${h.range} → Hafta İçi: ${h.weekdayCap}, Hafta Sonu: ${h.weekendCap}
      <button onclick="removeHour(${index})">Sil</button></li>`;
  });
}

function removeHour(index) {
  hours.splice(index, 1);
  updateHourList();
}

function generateShifts() {
  const dayCount = parseInt(document.getElementById("dayCount").value);
  let html = "<h3>Algoritma ile Vardiya Planı</h3><table><tr><th>Gün</th>";
  hours.forEach(h => html += `<th>${h.range}</th>`);
  html += "</tr>";

  for (let day = 1; day <= dayCount; day++) {
    html += `<tr><td>Gün ${day}</td>`;
    hours.forEach((h, i) => {
      const isWeekend = (day % 7 === 6 || day % 7 === 0);
      const capacity = isWeekend ? h.weekendCap : h.weekdayCap;
      html += `<td>${assignEmployees(day, capacity, i)}</td>`;
    });
    html += "</tr>";
  }

  html += "</table>";
  document.getElementById("shiftResult").innerHTML = html;
}

function assignEmployees(day, capacity, shiftIndex) {
  let assigned = [];
  let counter = 0;
  let startIndex = (day + shiftIndex) % employees.length;

  for (let i = 0; i < employees.length && counter < capacity; i++) {
    const emp = employees[(startIndex + i) % employees.length];
    if (emp.izin.includes(day)) continue;

    if (emp.rotationActive) {
      const shift = rotationCycle[(day - 1 + emp.rotationIndex) % rotationCycle.length];
      if (shift !== "İzin") {
        assigned.push(`${emp.firstName} ${emp.lastName} (${shift})`);
        counter++;
      }
    } else {
      assigned.push(`${emp.firstName} ${emp.lastName}`);
      counter++;
    }
  }
  return assigned.join("<br>");
}

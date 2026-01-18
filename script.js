let employees = [];
let hours = [];

const rotationCycle = ["Sabah","Sabah","Akşam","Akşam","Gece","Gece","İzin","İzin"];

function generateShifts() {
  const dayCount = parseInt(document.getElementById("dayCount").value);
  const dates = ["19 Ocak 2026","20 Ocak 2026","21 Ocak 2026","22 Ocak 2026","23 Ocak 2026","24 Ocak 2026","25 Ocak 2026"];
  const days = ["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"];

  let html = "<h3>Algoritma ile Vardiya Planı</h3><table border='1'><tr><th>Gün</th>";
  hours.forEach(h => html += `<th>${h.range}</th>`);
  html += "</tr>";

  for (let day = 1; day <= dayCount; day++) {
    html += `<tr><td>${dates[day-1]}<br>${days[(day-1)%7]}</td>`;
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

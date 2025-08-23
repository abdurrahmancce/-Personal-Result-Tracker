let results = JSON.parse(localStorage.getItem("results")) || [];
let editIndex = -1;

document.getElementById("resultForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let courseCode = document.getElementById("courseCode").value.trim();
  let courseTitle = document.getElementById("courseTitle").value.trim();

  let mid = Number(document.getElementById("mid").value) || 0;
  let ct = Number(document.getElementById("ct").value) || 0;
  let attendance = Number(document.getElementById("attendance").value) || 0;
  let final = Number(document.getElementById("final").value) || 0;

  let total = mid + ct + attendance + final;
  let gradeData = calculateGrade(total);

  let result = { courseCode, courseTitle, mid, ct, attendance, final, total, ...gradeData };

  if (editIndex === -1) {
    results.push(result);
  } else {
    results[editIndex] = result;
    editIndex = -1;
  }

  localStorage.setItem("results", JSON.stringify(results));
  displayResults();
  document.getElementById("resultForm").reset();
});

function displayResults() {
  let table = document.getElementById("resultTable");
  table.innerHTML = "";
  let totalPoints = 0;

  results.forEach((r, i) => {
    totalPoints += r.gpa;
    let row = document.createElement("tr");
    row.className = `grade-${r.grade.replace('+','\\+')}`;
    row.innerHTML = `
      <td>${r.courseCode}</td>
      <td>${r.courseTitle}</td>
      <td>${r.mid}</td>
      <td>${r.ct}</td>
      <td>${r.attendance}</td>
      <td>${r.final}</td>
      <td>${r.total}</td>
      <td>${r.grade}</td>
      <td>${r.gpa.toFixed(2)}</td>
      <td>
        <button class="edit" onclick="editResult(${i})">Edit</button>
        <button class="delete" onclick="deleteResult(${i})">Delete</button>
      </td>
    `;
    table.appendChild(row);
  });

  let cgpa = results.length ? (totalPoints / results.length).toFixed(2) : '0.00';
  let cgpaDisplay = document.getElementById("cgpa");
  cgpaDisplay.innerText = cgpa;

  let cgpaCard = cgpaDisplay.parentElement;

  // Dynamic CGPA color & glow
  if (cgpa >= 3.75) {
    cgpaDisplay.style.color = "#2ecc71";
    cgpaCard.style.background = "#d4f8e8";
  } else if (cgpa >= 3.0) {
    cgpaDisplay.style.color = "#f1c40f";
    cgpaCard.style.background = "#fff8d4";
  } else if (cgpa >= 2.0) {
    cgpaDisplay.style.color = "#e67e22";
    cgpaCard.style.background = "#ffe5d4";
  } else {
    cgpaDisplay.style.color = "#e74c3c";
    cgpaCard.style.background = "#ffd4d4";
  }

  cgpaCard.style.boxShadow = `0 0 15px ${cgpaDisplay.style.color}, 0 0 30px ${cgpaDisplay.style.color} inset`;
}

function calculateGrade(total) {
  if (total >= 80) return { grade: "A+", gpa: 4.00 };
  if (total >= 75) return { grade: "A", gpa: 3.75 };
  if (total >= 70) return { grade: "A-", gpa: 3.50 };
  if (total >= 65) return { grade: "B+", gpa: 3.25 };
  if (total >= 60) return { grade: "B", gpa: 3.00 };
  if (total >= 55) return { grade: "B-", gpa: 2.75 };
  if (total >= 50) return { grade: "C+", gpa: 2.50 };
  if (total >= 45) return { grade: "C", gpa: 2.25 };
  if (total >= 40) return { grade: "D", gpa: 2.00 };
  return { grade: "F", gpa: 0.00 };
}

function editResult(index) {
  let r = results[index];
  document.getElementById("courseCode").value = r.courseCode;
  document.getElementById("courseTitle").value = r.courseTitle;
  document.getElementById("mid").value = r.mid;
  document.getElementById("ct").value = r.ct;
  document.getElementById("attendance").value = r.attendance;
  document.getElementById("final").value = r.final;
  editIndex = index;
}

function deleteResult(index) {
  results.splice(index, 1);
  localStorage.setItem("results", JSON.stringify(results));
  displayResults();
}

displayResults();

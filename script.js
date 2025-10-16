function updateSalaryLabel(value) {
  const label = document.getElementById('salaryLabel');
  label.textContent = `$${Number(value).toLocaleString()}`;
}

function reviewForm() {
  const form = document.getElementById('registrationForm');
  const output = document.getElementById('reviewOutput');
  const section = document.getElementById('reviewSection');
  const formData = new FormData(form);

  let reviewHTML = `<table>`;

  formData.forEach((value, key) => {
    if (key === "password" || key === "confirmPassword") return;
    reviewHTML += `<tr><td><strong>${key}:</strong></td><td>${value}</td></tr>`;
  });

  const checkboxes = document.querySelectorAll('input[name="conditions"]:checked');
  reviewHTML += `<tr><td><strong>Conditions:</strong></td><td>`;
  checkboxes.forEach(cb => reviewHTML += `${cb.value} `);
  reviewHTML += `</td></tr>`;

  const radios = document.querySelectorAll('input[name="vaccinated"]:checked');
  if (radios.length > 0) {
    reviewHTML += `<tr><td><strong>Vaccinated:</strong></td><td>${radios[0].value}</td></tr>`;
  }

  reviewHTML += `</table>`;
  output.innerHTML = reviewHTML;
  section.classList.remove('hidden');
}

// Password match validation
document.getElementById('confirmPassword').addEventListener('input', () => {
  const pw = document.getElementById('password').value;
  const confirmPw = document.getElementById('confirmPassword').value;
  if (pw !== confirmPw) {
    document.getElementById('confirmPassword').setCustomValidity("Passwords do not match");
  } else {
    document.getElementById('confirmPassword').setCustomValidity("");
  }
});

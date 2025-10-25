// script.js
var isPasswordInvalid = false;
var isConfirmPaswordInvalid = false;

const labels = {
  firstName: "First Name", middleInitial: "Middle Initial", lastName: "Last Name",
  dob: "Date of Birth", ssn: "Social Security #", address1: "Address Line 1", address2: "Address Line 2",
  city: "City", state: "State", zip: "Zip Code", email: "Email", gender: "Gender",
  insurance: "Insurance", contactMethod: "Preferred Contact Method", conditions: "Existing Conditions",
  symptoms: "Symptoms", healthScale: "Health Scale", userID: "User ID", password: "Password",
  passwordConfirm: "Confirm Password"
};

document.addEventListener('DOMContentLoaded', () => {
  displayCurrentDate();
  const form = document.getElementById('patient-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if(isPasswordInvalid) return;
    if(isConfirmPaswordInvalid) return;
    if (!form.reportValidity()) return;
    showThankYou();
  });
});

function formatLabel(k){ return labels[k] || k; }

function collectFormData(form) {
  const formData = new FormData(form);
  const data = {};
  for (const key of formData.keys()) {
    const vals = formData.getAll(key);
    data[key] = vals.length > 1 ? vals : vals[0];
  }

  ['gender','insurance','contactMethod'].forEach(name => {
    if (!(name in data)) {
      const checked = form.querySelector(`input[name="${name}"]:checked`);
      data[name] = checked ? checked.value : '';
    }
  });

  if (!('conditions' in data)) data.conditions = [];

  const order = Object.keys(labels);
  order.forEach(k => { if (!(k in data)) data[k] = ''; });

  return data;
}

function renderReview(data) {
  const reviewTable = document.getElementById('review-table');
  reviewTable.innerHTML = '';
  const order = Object.keys(labels);
  order.forEach(key => {
    let val = data[key];
    if (Array.isArray(val)) val = val.join(', ');
    
    const tr = document.createElement('tr');
    const tdLabel = document.createElement('td');
    tdLabel.className = 'review-label';
    tdLabel.textContent = formatLabel(key);
    const tdVal = document.createElement('td');
    
    if(key === 'passwordConfirm' && !val){
      val = 'Invalid Password';
      tdVal.style.color = 'red';
    }
    // get the slider value set in the element with id="sliderValue"
    if(key == 'healthScale') {
      val = document.getElementById('sliderValue').textContent;
    }
    tdVal.textContent = val;
    tr.appendChild(tdLabel);
    tr.appendChild(tdVal);
    reviewTable.appendChild(tr);
  });
}

function reviewDetails()
{
    const form = document.getElementById('patient-form');
    if (!form.reportValidity()) return;
    const data = collectFormData(form);
    renderReview(data);
    document.getElementById('review-section').style.display = 'block';
    document.getElementById('reset').style.display = 'block';
    document.getElementById('submit').style.display = 'block';
    document.getElementById('review-section').scrollIntoView({behavior:'smooth', block:'start'});
}

// Displays today's date in long format
function displayCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', options);
}

function showThankYou() {
  document.getElementById('patient-form').style.display = 'none';
  document.getElementById('review-section').style.display = 'none';
  document.getElementById('thankyou').style.display = 'block';
  document.getElementById('thankyou').scrollIntoView({behavior:'smooth'});
}

function closeReviewSection()
{
    document.getElementById('review-section').style.display = 'none';
}

// First name validation with Regex
const firstNameInput = document.getElementById("firstName");
const firstNameError = document.getElementById("firstNameError");

firstNameInput.addEventListener("input", () => {
  let value = firstNameInput.value;

  // Remove any character that is NOT a letter, apostrophe, or dash
  const corrected = value.replace(/[^a-zA-Z'-]/g, "");

  // Show error only if a correction occurred
  if (corrected !== value) {
    firstNameError.textContent = "Only letters, apostrophes, and dashes are allowed.";
  } else {
    firstNameError.textContent = "";
  }

  // Update input with corrected value
  firstNameInput.value = corrected;
});

// End First name validation

// Middle name validation with Regex

const middleNameInput = document.getElementById("middleInitial");
const middleNameError = document.getElementById("middleNameError");

middleNameInput.addEventListener("input", () => {
    let value = middleNameInput.value;

    // Remove anything that's not a letter
    const corrected = value.replace(/[^a-zA-Z]/g, "");

    if(value === '')
        middleNameError.textContent = "";
    // Show error only if correction occurred
    if (corrected !== value) {
        middleNameError.textContent = "Only letters are allowed.";
    } else {
        middleNameError.textContent = "";
    }

    // Update input with corrected value
    middleNameInput.value = corrected;
});

// End Middle name

// Last name validation with Regex

const lastNameInput = document.getElementById("lastName");
const lastNameError = document.getElementById("lastNameError");

lastNameInput.addEventListener("input", () => {
  let value = lastNameInput.value;
  let corrected = "";

  for (let i = 0; i < value.length; i++) {
    const char = value[i];

    // Allowed characters always: letters, apostrophe, dash
    if (/[a-zA-Z'-]/.test(char)) {
      corrected += char;
    } 
    // Allowed numbers 2-5 only at index 2 (3rd character)
    else if (i === 2 && /[2-5]/.test(char)) {
      corrected += char;
    }
    // Otherwise skip character
  }

  // Show error only if correction occurred
  if (corrected !== value) {
    lastNameError.textContent = "Only letters, apostrophes, dashes, and numbers 2-5 in 3rd position are allowed.";
  } else {
    lastNameError.textContent = "";
  }

  // Update input with corrected value
  lastNameInput.value = corrected;
});

// End Last name validation 

// Phone number formatting

const phoneInput = document.getElementById("phone");
const phoneError = document.getElementById("phoneError");

phoneInput.addEventListener("input", () => {
  // Remove all non-digit characters
  let digits = phoneInput.value.replace(/\D/g, "").slice(0, 10);

  // Format as 000-000-0000
  let formatted = digits;
  if (digits.length > 6) {
    formatted = digits.slice(0,3) + '-' + digits.slice(3,6) + '-' + digits.slice(6);
  } else if (digits.length > 3) {
    formatted = digits.slice(0,3) + '-' + digits.slice(3);
  }

  // Update input with formatted value
  phoneInput.value = formatted;

  // Show inline error if incomplete
  if (digits.length > 0 && digits.length < 10) {
    phoneError.textContent = "Phone number must be 10 digits.";
  } else {
    phoneError.textContent = "";
  }
});

// End Phone Number

// password validation logic with regex
const userId = document.getElementById("userID");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const pwError = document.getElementById("pwError");
const confirmError = document.getElementById("confirmError");
const form = document.getElementById("patient-form");


function validatePassword(pw, user) {
  const errors = [];

  if (pw.length < 8 || pw.length > 30)
    errors.push("Password must be 8–30 characters long.");
  if (!/[A-Z]/.test(pw))
    errors.push("Must include at least one uppercase letter.");
  if (!/\d/.test(pw))
    errors.push("Must include at least one number.");
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(pw))
    errors.push("Must include at least one special character.");
  if (user && pw.toLowerCase() === user.toLowerCase())
    errors.push("Password cannot equal your User ID.");
  if (user && user.length >= 3 && pw.toLowerCase().includes(user.toLowerCase()))
    errors.push("Password cannot contain your User ID.");

  return errors;
}

// Show inline error
function showError(element, errorDiv, messages) {
  if (messages.length > 0) {
    errorDiv.innerHTML = messages.join("<br>");
    element.classList.add("error-input");
    return true;
  } else {
    errorDiv.innerHTML = "";
    element.classList.remove("error-input");
    return false;
  }
}

// Blur events
password.addEventListener("blur", () => {
  const pwErrors = validatePassword(password.value, userId.value);
  isPasswordInvalid = showError(password, pwError, pwErrors);
});

confirmPassword.addEventListener("blur", () => {
  const confErrors = [];
  if (password.value !== confirmPassword.value) {
    confErrors.push("Passwords do not match.");
  }
  isConfirmPaswordInvalid = showError(confirmPassword, confirmError, confErrors);
});

// UserId validation using Regex
const userIdError = document.getElementById("userIdError");
const userIdDisplay = document.getElementById("userIdDisplay");

userId.addEventListener("input", () => {
  let value = userId.value;
  let error = "";

  // Remove spaces
  if (/\s/.test(value)) {
    value = value.replace(/\s+/g, "");
    error = "Spaces are not allowed.";
  }

  // Remove invalid characters (allow letters, numbers, underscore, dash)
  if (/[^a-zA-Z0-9_-]/.test(value)) {
    value = value.replace(/[^a-zA-Z0-9_-]/g, "");
    error = "Only letters, numbers, underscore or dash are allowed.";
  }

  // Ensure first character is not a number
  if (/^\d/.test(value)) {
    value = value.substring(1);
    error = "First character cannot be a number.";
  }

  // Update input with corrected value
  const lower = value.toLowerCase();
  userId.value = lower;

  // Update corrected lowercase display
  userIdDisplay.textContent = "Corrected lowercase version: " + lower;

  // Show error only if it occurs
  userIdError.textContent = error;
});
// End userId validation

// Birthdate validation with Regex

const birthdayInput = document.getElementById("dob");
const birthdayError = document.getElementById("dobError");

// Set min and max dates
const today = new Date();
const maxDate = today.toISOString().split("T")[0]; // today
const minDate = new Date();
minDate.setFullYear(minDate.getFullYear() - 120);
const minDateStr = minDate.toISOString().split("T")[0];

birthdayInput.setAttribute("min", minDateStr);
birthdayInput.setAttribute("max", maxDate);

// Optional: show error if user manually edits the date
birthdayInput.addEventListener("change", () => {
  const selectedDate = new Date(birthdayInput.value);
  if (selectedDate > today) {
    birthdayError.textContent = "Birthday cannot be in the future.";
  } else if (selectedDate < minDate) {
    birthdayError.textContent = "Birthday cannot be more than 120 years ago.";
  } else {
    birthdayError.textContent = "";
  }
});


// End Birthdate validation

// zip code validation

const zipInput = document.getElementById("zip");
const zipError = document.getElementById("zipError");

zipInput.addEventListener("input", () => {
  let value = zipInput.value;

  // Allow only digits and one dash
  value = value.replace(/[^0-9-]/g, ""); // remove all invalid chars
  const dashCount = (value.match(/-/g) || []).length;

  if (dashCount > 1) {
    value = value.replace(/-+$/, ""); // remove extra dashes at the end
  }

  // Enforce max length 10
  value = value.slice(0, 10);

  zipInput.value = value;

  // Validation messages
  if (value.length < 5) {
    zipError.textContent = "ZIP Code must be at least 5 digits.";
  } else if (value.length > 0 && !/^\d{5}(-\d{0,4})?$/.test(value)) {
    zipError.textContent = "Invalid ZIP format. Use 12345 or 12345-6789.";
  } else {
    zipError.textContent = "";
  }
});

// end zip code validation

// Start slider

const slider = document.getElementById("slider");
const sliderValue = document.getElementById("sliderValue");

slider.addEventListener("input", () => {
  sliderValue.textContent = slider.value;
});

// End slider

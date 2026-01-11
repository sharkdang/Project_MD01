//  LẤY CÁC PHẦN TỬ TỪ DOM
const form = document.querySelector(".form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

// lẤY DATA TỪ LOCALSTORAGE
const users = JSON.parse(localStorage.getItem("users")) || [];

// HÀM KIỂM TRA EMAIL HỢP LỆ
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

// lẮNG NGHE SỰ KIỆN SUBMIT FORM
form.addEventListener("submit", function (event) {
  event.preventDefault();

  let isValid = true;

  // Reset lỗi cũ
  clearError(emailInput, "error-email");
  clearError(passwordInput, "error-password");

  // Validate email
  if (!emailInput.value.trim()) {
    showError(emailInput,
         "error-email",
          "Email không được để trống");
    isValid = false;
  } else if (!isValidEmail(emailInput.value)) {
    showError(emailInput,
         "error-email",
          "Email không đúng định dạng");
    isValid = false;
  }

  // Validate password
  if (!passwordInput.value.trim()) {
    showError(passwordInput,
         "error-password",
          "Mật khẩu không được để trống");
    isValid = false;
  }
    // Có lỗi -> dừng
  if (!isValid) return;

  // CHECK LOGIN
  const user = users.find(
    item =>
      item.email?.toLowerCase() === emailInput.value.trim().toLowerCase() &&
      item.password === passwordInput.value.trim()
  );

  if (!user) {
    showError(emailInput,
         "error-email", 
         "Email hoặc mật khẩu không đúng");
    showError(passwordInput, "error-password", "");
    return;
  }

  // LƯU THÔNG TIN NGƯỜI DÙNG ĐÃ ĐĂNG NHẬP
  localStorage.setItem(
    "currentUser",
    JSON.stringify({
      id: user.id,
      email: user.email,
      name: `${user.lastName} ${user.firstName}`
    })
  );

  alert("Đăng nhập thành công!");

  // Chuyển sang trang quản lý
  window.location.href = "../pages/category-manager.html";
});

// HÀM HIỂN THỊ LỖI 
function showError(input, errorId, message) {
  const errorEl = document.getElementById(errorId);
  if (!errorEl) return;

  errorEl.innerText = message;
  errorEl.style.display = "block";
  input.classList.add("error");
}
// HÀM XÓA LỖI
function clearError(input, errorId) {
  const errorEl = document.getElementById(errorId);
  if (!errorEl) return;

  errorEl.innerText = "";
  errorEl.style.display = "none";
  input.classList.remove("error");
}

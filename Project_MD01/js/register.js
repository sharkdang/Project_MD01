//LẤY CÁC PHẦN TỬ DOM

const form = document.querySelector(".form");
const lastName = document.querySelector("#lastName");
const firstName = document.querySelector("#firstName");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirmPassword");



//LẤY DATA TỪ LOCALSTORAGE
let users = JSON.parse(localStorage.getItem("users")) || [];

//HÀM KIỂM TRA EMAIL HỢP LỆ
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim()); // regex giúp email đúng định dạng 
}

//lẮNG NGHE SỰ KIỆN SUBMIT FORM
form.addEventListener("submit", function (event) {
    // Ngăn chặn sự kiện load lại trang khi submit form
    event.preventDefault();
    //Validate dữ liệu đầu vào
    let isValid = true;

    // Reset lỗi cũ
    clearError(lastName, "error-lastName");
    clearError(firstName, "error-firstName");
    clearError(emailInput, "error-email");
    clearError(passwordInput, "error-password");
    clearError(confirmPasswordInput, "error-confirmPassword");

    // Validate lastName
    if (!lastName.value.trim()) {
        showError(lastName, "error-lastName", "Họ không được để trống");
        isValid = false;
    }   
    // Validate firstName
    if (!firstName.value.trim()) {
        showError(firstName, "error-firstName", "Tên không được để trống");
        isValid = false;
    }
    // Validate email
    if (!emailInput.value.trim()) {
        showError(emailInput, "error-email", "Email không được để trống");
        isValid = false;
    } else if (!isValidEmail(emailInput.value)) {
        showError(emailInput, "error-email", "Email không đúng định dạng");
        isValid = false;
    }
    // Validate password
    if (!passwordInput.value.trim()) {
        showError(passwordInput, "error-password", "Mật khẩu không được để trống");
        isValid = false;
    }
    // Validate confirm password
    if (confirmPasswordInput.value.trim() !== passwordInput.value.trim()) {
        showError(confirmPasswordInput, "error-confirmPassword", "Mật khẩu không khớp");
        isValid = false;
    }
    // Có lỗi -> dừng
    if (!isValid) return;

    // LƯU VÀO LOCALSTORAGE
    const newUser = {
        id:Math.ceil(Math.random() * 1000000),
        lastName: lastName.value,
        firstName: firstName.value,
        email: emailInput.value,
        password: passwordInput.value,
    };

    // Push phần user mới vào trong mảng users
    users.push(newUser);

    // Lưu mảng users vào localStorage
    localStorage.setItem("users", JSON.stringify(users));

    // CHUYỂN VỀ TRANG LOGIN
    alert("Đăng ký thành công! Vui lòng đăng nhập.");
    window.location.href = "../pages/login.html";


    
});

// Hàm hiển thị và xóa lỗi

// Hiển thị lỗi
function showError(inputElement, errorElementId, message) {
  const errorElement = document.getElementById(errorElementId);
  if (!errorElement) return;

  errorElement.innerText = message;
  errorElement.style.display = "block";

  if (inputElement.type !== "checkbox") {
    inputElement.classList.add("input-error");
  }
}
// Xóa lỗi
function clearError(inputElement, errorElementId) {
  const errorElement = document.getElementById(errorElementId);
  if (!errorElement) return;
    errorElement.innerText = "";
    errorElement.style.display = "none";

    if (inputElement.type !== "checkbox") {
        inputElement.classList.remove("input-error");
    }

}
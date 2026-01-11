// Lấy các phần tử DOM

const form = document.querySelector(".form");
const lastNameInput = document.querySelector("#lastName");
const firstNameInput = document.querySelector("#firstName");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirmPassword");
const policyCheckbox = document.querySelector("#policy");

// LẤY DATA TỪ LOCALSTORAGE

let users = JSON.parse(localStorage.getItem("users")) || [];

// LẮNG NGHE SỰ KIỆN SUBMIT FORM
form.addEventListener("submit", function (event) {
  // Ngăn chặn sự kiện load lại trang khi submit form
  event.preventDefault();   

    // Validate dữ liệu đầu vào
    let isValid = true;

        // reset lỗi cũ
        clearError(lastNameInput, "error-lastName");
        clearError(firstNameInput, "error-firstName");
        clearError(emailInput, "error-email");
        clearError(passwordInput, "error-password");
        clearError(confirmPasswordInput, "error-confirmPassword");
        clearError(policyCheckbox, "error-policy");

        // Validate Họ
        if (!lastNameInput.value.trim()) {
            showError( lastNameInput,
                        "error-lastName",   
                        "Họ không được để trống"
            );
            isValid = false;
        }
        // Validate Tên
        if (!firstNameInput.value.trim()) {
            showError( firstNameInput,  
                        "error-firstName",
                        "Tên không được để trống"
            );
            isValid = false;
        }   
        // Validate Email
        if (!emailInput.value.trim()) {
            showError( emailInput,
                        "error-email",
                        "Email không được để trống"
            );
            isValid = false;
        } else {
            const isEmailExist = users.some(
                item => item.email.toLowerCase() === emailInput.value.trim().toLowerCase()
            );
            if (isEmailExist) {
                showError( emailInput,
                            "error-email",
                            "Email đã tồn tại"
                );
                isValid = false;
            }
        }
        // Validate Mật khẩu

        if (!passwordInput.value.trim()) {
            showError(passwordInput, "error-password", "Mật khẩu không được để trống");
            isValid = false;
        } else if (passwordInput.value.trim().length < 8) {
            showError(passwordInput, "error-password", "Mật khẩu phải tối thiểu 8 ký tự");
            isValid = false;
        } else if (
            passwordInput.value.trim().toLowerCase() === emailInput.value.trim().toLowerCase() ||
            passwordInput.value.trim().toLowerCase() === firstNameInput.value.trim().toLowerCase()
        ) {
            showError(passwordInput, "error-password", "Mật khẩu quá đơn giản");
            isValid = false;
         }
   
        // Validate Xác nhận mật khẩu
        if (!confirmPasswordInput.value.trim()) {
            showError( confirmPasswordInput,
                        "error-confirmPassword",
                        "Xác nhận mật khẩu không được để trống"
            );
            isValid = false;
        } else if (confirmPasswordInput.value.trim() !== passwordInput.value.trim()) {
            showError( confirmPasswordInput,
                        "error-confirmPassword",
                        "Xác nhận mật khẩu không khớp"
            );
            isValid = false;
        }
        // Validate Đồng ý chính sách
        if (!policyCheckbox.checked) {
            showError( policyCheckbox,
                        "error-policy",
                        "Bạn phải đồng ý với chính sách"
            );
            isValid = false;
        }
        // Có lỗi -> dừng
        if (!isValid) return;

    //Chuyển đổi tất cả dữ liệu từ input thành 1 đối tượng
    const newUser = {
        id:Math.ceil(Math.random() * 1000000),
        lastName: lastNameInput.value,
        firstName: firstNameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
    }

    // Push phần user mới vào trong mảng users
    users.push(newUser);

    // Lưu mảng users vào localstorage
    localStorage.setItem("users", JSON.stringify(users));
    
    // Chuyển hướng về trang đăng nhập
    alert("Đăng ký tài khoản thành công!");
    window.location.href = "login.html";
});

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

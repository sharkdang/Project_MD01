// Các phần tử trong DOM
const formCategory = document.querySelector("#form-add-category");
const categoryCodeInput = document.querySelector("#category-code");
const categoryNameInput = document.querySelector("#category-name");
const tbodyElement = document.querySelector(".tbody");
const modalTitle = document.querySelector("#modal-title");


// Lấy ra danh sách các radio có name= status
 const categoryStatues = document.querySelectorAll("input[name=status]");

  let categoryStatuesValue = "active";

// Mảng chứa danh sách danh mục Data
let categories =JSON.parse(localStorage.getItem("categories")) || [];
// Biến lưu ID danh mục đang chỉnh sửa (null nếu thêm mới)
let editingCategoryId = null;

// Lắng nghe sự kiện thay đổi khi người dùng chọn trạng thái RADIO CHANGE
categoryStatues.forEach(function (item) {
  //Lắng nghe sự kiện khi người dùng change
  item.addEventListener("change", function (event) {
    //Input nào đc chêcked, thì sẽ lấy giá trị của input đó
    if (event.target.checked) {
      categoryStatuesValue = event.target.value;
    }
  });
});

// Hàm mở modal thêm mới/ mở overlay

function handleShowModal() {
  // Reset form khi mở modal mới
  editingCategoryId = null;
  categoryCodeInput.value = "";
  categoryNameInput.value = "";
  clearError(categoryCodeInput, "error-code");
  clearError(categoryNameInput, "error-name");
  document.querySelector("input[name=status][value=active]").checked = true;
  categoryStatuesValue = "active";
  // Thay đổi tiêu đề thành "Thêm mới danh mục"
  modalTitle.textContent = "Thêm mới danh mục";
  
  // Thay đổi style để hiển thị trong form
  formCategory.style.display = "flex";
}

function handleCloseModal() {
  //Thay đổi style để ẩn form
  formCategory.style.display = "none";
}


//Hàm submit form
function handleSubmit(event) {
  //Ngăn chặn sự kiện load lại trang khi submit form
  event.preventDefault();

    //Validate dữ liệu đầu vào
    
    let isValid = true;

        // reset lỗi cũ
        clearError(categoryCodeInput, "error-code");
        clearError(categoryNameInput, "error-name");

        // Validate mã danh mục
        if (!categoryCodeInput.value.trim()) {
          showError( categoryCodeInput,
                    "error-code",
                    "Mã danh mục không được để trống"
          );
          isValid = false;
        } else {
          // Kiểm tra từng danh mục trong mảng - nếu đang sửa thì không kiểm tra chính nó
          const isCodeExist = categories.some(
          item => item.code.toLowerCase() === categoryCodeInput.value.trim().toLowerCase() && item.id !== editingCategoryId
          );

        if (isCodeExist) {
          showError(
            categoryCodeInput,
            "error-code",
            "Mã danh mục đã tồn tại"
          );
          isValid = false;
        }
      }
        // Validate tên danh mục
        if (!categoryNameInput.value.trim()) {
          showError( categoryNameInput,
                    "error-name",
                    "Tên danh mục không được để trống"
          );
          isValid = false;
        } else {
          const isNameExist = categories.some(
            item => item.name.toLowerCase() === categoryNameInput.value.trim().toLowerCase() && item.id !== editingCategoryId
          );

          if (isNameExist) {
            showError(
              categoryNameInput,
              "error-name",
              "Tên danh mục đã tồn tại"
            );
            isValid = false;
          }
        }
        // Có lỗi -> dừng
        if (!isValid) return;


    // Nếu đang edit -> cập nhật, không thì thêm mới
    if (editingCategoryId !== null) {
      // Cập nhật danh mục
      const categoryIndex = categories.findIndex(item => item.id === editingCategoryId);
      if (categoryIndex !== -1) {
        categories[categoryIndex] = {
          ...categories[categoryIndex],
          code: categoryCodeInput.value,
          name: categoryNameInput.value,
          status: categoryStatuesValue
        };
      }
    } else {
      // Thêm mới danh mục
      const newCategory = {
          id:Math.ceil(Math.random() * 1000000),
          code: categoryCodeInput.value,
          name: categoryNameInput.value,
          status: categoryStatuesValue,
      }
      // Push phần danh mục mới vào trong mảng categoies
      categories.unshift(newCategory);
    }


    // Lưu trữ dữ liệu lên localStorage
    localStorage.setItem("categories",JSON.stringify(categories));
//   console.log("category-code: ", categoryCodeInput.value);
//   console.log("category-name: ", categoryNameInput.value);
//   console.log("categoryStatues: ", categoryStatuesValue);

    // Reset giá trị trong form
    categoryNameInput.value="";
    categoryCodeInput.value="";
    
    //auto luôn check khi thêm xong danh mục
    document.querySelector("input[name=status][value=active]").checked =true;

    // Đóng form
    handleCloseModal();

    // Render lại danh sách mới nhất
    renderCategories();
}





/// Hàm render danh sách danh mục 
function renderCategories() {

    // Xóa tbody cũ đi để ko bị nhân 2 số lượng 
    tbodyElement.innerHTML = "";

    //Duyệt qua mảng categories
    categories.forEach(function (category) {
        // Convert trạng thái từ tiếng anh sang tiếng viêt
        const statusText = category.status === "active" ? ` <div class="box-status bg-active">
                                                            <div class="dot dot-active"></div>
                                                            <span class="status-text text-active">
                                                            Đang hoạt động
                                                            </span> 
                                                            </div>`
                                                         : `<div class="box-status bg-inactive">
                                                            <div class="dot dot-inactive"></div>
                                                            <span class="status-text text-inactive" >
                                                            Ngừng hoạt động
                                                            </span> 
                                                            </div>`
        
        //Tạo thẻ tr
        const trElement  = document.createElement("tr");
        trElement.dataset.id = category.id;
         trElement.innerHTML = `
                <td>${category.code}</td>
                <td>${category.name}</td>
                <td>${statusText}</td>
                
                <td style="width: 196px;">                         
                    <i class="fa-solid fa-trash btn-delete" ></i>
                    <i class="fa-solid fa-pen"></i>
                </td>
         `;

        //Gán từng thẻ 
          tbodyElement.appendChild(trElement);
    });
   
   
};
renderCategories();





// Hàm show lỗi
function showError(input, errorId, message) {
  const errorEl = document.getElementById(errorId);
  errorEl.innerText = message;
  errorEl.style.display = "block";
  input.classList.add("error");
}

function clearError(input, errorId) {
  const errorEl = document.getElementById(errorId);
  errorEl.innerText = "";
  errorEl.style.display = "none";
  input.classList.remove("error");
}




//Xóa danh mục
tbodyElement.addEventListener("click", function (event) {
  // Kiểm tra có đúng icon xóa không
  if (event.target.classList.contains("btn-delete")) {
    // Lấy id từ tr element
    const trElement = event.target.closest("tr");
    const id = Number(trElement.dataset.id);

    const confirmDelete = confirm("Bạn có chắc chắn muốn xóa danh mục này?");
    if (!confirmDelete) return;
    // Loại bỏ danh mục bị xóa
    categories = categories.filter(item => item.id !== id);
    
    // Cập nhật lại localStorage
    localStorage.setItem("categories", JSON.stringify(categories));

    renderCategories();
  }

  // Kiểm tra có đúng icon chỉnh sửa không
  if (event.target.classList.contains("fa-pen")) {
    // Lấy id từ tr element
    const trElement = event.target.closest("tr");
    const id = Number(trElement.dataset.id);

    // Tìm danh mục cần chỉnh sửa
    const category = categories.find(item => item.id === id);
    if (category) {
      // Gán ID danh mục đang chỉnh sửa
      editingCategoryId = id;

      // Điền dữ liệu vào form
      categoryCodeInput.value = category.code;
      categoryNameInput.value = category.name;
      categoryStatuesValue = category.status;

      // Cập nhật radio button
      document.querySelector(`input[name=status][value=${category.status}]`).checked = true;

      // Thay đổi tiêu đề thành "Cập nhật danh mục"
      modalTitle.textContent = "Cập nhật danh mục";

      // Hiển thị form
      formCategory.style.display = "flex";
    }
  }
});


// Hàm tìm kiếm danh mục theo tên
const searchInput = document.querySelector("#search-input");
searchInput.addEventListener("input", function (event) {
  const searchTerm = event.target.value.trim().toLowerCase();
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm)
  );  
  // Xóa tbody cũ đi để ko bị nhân 2 số lượng
  tbodyElement.innerHTML = "";
  // Duyệt qua mảng lọc được
  filteredCategories.forEach(function (category) {
    // Convert trạng thái từ tiếng anh sang tiếng viêt
    const statusText = category.status === "active" ? ` <div class="box-status bg-active">
                                                        <div class="dot dot-active"></div> 
                                                        <span class="status-text text-active">
                                                        Đang hoạt động
                                                        </span>
                                                        </div>`
                                                     : `<div class="box-status bg-inactive">
                                                        <div class="dot dot-inactive"></div>
                                                        <span class="status-text text-inactive" >
                                                        Ngừng hoạt động
                                                        </span> 
                                                        </div>`
    //Tạo thẻ tr
    const trElement  = document.createElement("tr");
    trElement.dataset.id = category.id;
      trElement.innerHTML = `
            <td>${category.code}</td>
            <td>${category.name}</td>
            <td>${statusText}</td>
            <td style="width: 196px;">
                <i class="fa-solid fa-trash btn-delete" ></i>
                <i class="fa-solid fa-pen"></i>
            </td>
      `;
    //Gán từng thẻ
      tbodyElement.appendChild(trElement);
  });
});

// Hàm phân loại trạng thái danh mục
const filterStatus = document.querySelector("#filter-status");
filterStatus.addEventListener("change", function (event) {
  const selectedStatus = event.target.value;
  let filteredCategories = [];
  if (selectedStatus === "all") {
    filteredCategories = categories;
  } else {
    filteredCategories = categories.filter(category => category.status === selectedStatus);
  }
  // Xóa tbody cũ đi để ko bị nhân 2 số lượng
  tbodyElement.innerHTML = "";    
  // Duyệt qua mảng lọc được
  filteredCategories.forEach(function (category) {
    // Convert trạng thái từ tiếng anh sang tiếng viêt
    const statusText = category.status === "active" ? ` <div class="box-status bg-active">
                                                        <div class="dot dot-active"></div>
                                                        <span class="status-text text-active">
                                                        Đang hoạt động
                                                        </span> 
                                                        </div>`
                                                     : `<div class="box-status bg-inactive">
                                                        <div class="dot dot-inactive"></div>
                                                        <span class="status-text text-inactive" >
                                                        Ngừng hoạt động
                                                        </span> 
                                                        </div>` 
    //Tạo thẻ tr
    const trElement  = document.createElement("tr");
    trElement.dataset.id = category.id;

      trElement.innerHTML = ` 
            <td>${category.code}</td>
            <td>${category.name}</td>
            <td>${statusText}</td>
            <td style="width: 196px;">  
                <i class="fa-solid fa-trash btn-delete" ></i>
                <i class="fa-solid fa-pen"></i>
            </td>
      `;  
    //Gán từng thẻ

      tbodyElement.appendChild(trElement);  
  });
}); 
/// CÁC PHÀN TỬ TRONG DOM
const overlayProduct = document.querySelector("#form-add-product");
const productCodeInput = document.querySelector("#product-code");
const productNameInput = document.querySelector("#product-name");
const productCategoryInput = document.querySelector("#product-category");
const productQuantity = document.querySelector("#product-quantity");
const productPrice = document.querySelector("#product-price");
const productDiscount = document.querySelector("#product-discount");
const modalTitle = document.querySelector("#modal-title");

const tbodyElement = document.querySelector(".tbody");

// Lấy ra danh sách các radio có name=status
const productStatus = document.querySelectorAll("input[name=status]");
let productStatusValue = "active";

// Mảng chứa sản phẩm
let products = JSON.parse(localStorage.getItem("products")) || [];

// Biến lưu ID sản phẩm đang chỉnh sửa (null nếu thêm mới)
let editingProductId = null;

// Lắng nghe sự kiện thay đổi 
productStatus.forEach(function(item){
    item.addEventListener("change",function(event){
        if(event.target.checked){
            productStatusValue = event.target.value;
        }
    })
});

// Hàm mở modal
function handleShowModal(){
    // Reset form khi mở modal mới
    editingProductId = null;
    modalTitle.textContent = "Thêm mới sản phẩm";
    productCodeInput.value="";
    productNameInput.value="";
    productCategoryInput.value="";
    productQuantity.value="";
    productPrice.value="";
    productDiscount.value="";
    document.querySelector("input[name=status][value=active]").checked = true;
    productStatusValue = "active";
    
    // Xóa các lỗi cũ (nếu có)
    clearError(productCodeInput, "error-code");
    clearError(productNameInput, "error-name");
    clearError(productCategoryInput, "error-category");

    //Thay đổi style để hiển thị 
    overlayProduct.style.display = "flex";
}

// Hàm đóng modal
function handleCloseModal(){
    overlayProduct.style.display = "none";
}

// Hàm submit form
function handleSubmit(event){
    event.preventDefault();

    let isValid = true;
    clearError(productCodeInput, "error-code");
    clearError(productNameInput, "error-name");
    clearError(productCategoryInput, "error-category");

    // Validate mã sản phẩm
    if (!productCodeInput.value.trim()) {
        showError(productCodeInput, "error-code", "Mã sản phẩm không được để trống");
        isValid = false;
    } else {
        // Kiểm tra mã sản phẩm đã tồn tại chưa - nếu đang sửa thì không kiểm tra chính nó
        const existingProduct = products.find(item => 
            item.code?.toLowerCase() === productCodeInput.value.trim().toLowerCase() && 
            item.id !== editingProductId
        );
        if (existingProduct) {
            showError(productCodeInput, "error-code", "Mã sản phẩm đã tồn tại");
            isValid = false;
        }
    }

    // Validate tên sản phẩm
    if (!productNameInput.value.trim()) {
        showError(productNameInput, "error-name", "Tên sản phẩm không được để trống");
        isValid = false;
    }

    // Validate danh mục sản phẩm
    if (!productCategoryInput.value.trim()) {
        showError(productCategoryInput, "error-category", "Danh mục sản phẩm không được để trống");
        isValid = false;
    }

    if (!isValid) return;

    // Nếu đang edit -> cập nhật, không thì thêm mới
    if (editingProductId !== null) {
        // Cập nhật sản phẩm
        const productIndex = products.findIndex(item => item.id === editingProductId);
        if (productIndex !== -1) {
            products[productIndex] = {
                ...products[productIndex],
                code: productCodeInput.value,
                name: productNameInput.value,
                category: productCategoryInput.value,
                quantity: productQuantity.value,
                price: productPrice.value,
                discount: productDiscount.value,
                status: productStatusValue
            };
        }
    } else {
        // Thêm mới sản phẩm
        const newProduct = {
            id: Math.ceil(Math.random() * 1000000),
            code: productCodeInput.value,
            name: productNameInput.value,
            category: productCategoryInput.value,
            quantity: productQuantity.value,
            price: productPrice.value,
            discount: productDiscount.value,
            status: productStatusValue,
        }
        products.unshift(newProduct);
    }

    // Lưu dữ liệu lên localStorage
    localStorage.setItem("products", JSON.stringify(products));

    // Reset giá trị trong form
    productCodeInput.value="";
    productNameInput.value="";
    productCategoryInput.value="";
    productQuantity.value="";
    productPrice.value="";
    productDiscount.value="";

    // Auto check khi thêm/sửa xong
    document.querySelector("input[name=status][value=active]").checked = true;

    // Đóng form
    handleCloseModal();

    // Render lại danh sách 
    renderProducts();
}

// Hàm render danh sách
function renderProducts (){
    tbodyElement.innerHTML = "";
    products.forEach(function(product){
        const statusText = product.status === "active" ? ` <div class="box-status bg-active">
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
        const trElement = document.createElement("tr");
        trElement.dataset.id = product.id;
        trElement.innerHTML= `
                <td>${product.code}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.quantity}</td>
                <td>${product.discount}</td>
                <td>${statusText}</td>
                <td style="width: 196px;">
                    <i class="fa-solid fa-trash btn-delete"></i>
                    <i class="fa-solid fa-pen"></i>
                </td>
        `;
        tbodyElement.appendChild(trElement);
    });
}

renderProducts();

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

// Hàm phân loại trạng thái
const filterStatusSelect = document.querySelector("#filter-status");

filterStatusSelect.addEventListener("change",function(event){
    const selectedStatus = event.target.value;
    const filteredProducts = selectedStatus === "all"
        ? products
        : products.filter(product => product.status === selectedStatus);
    
    tbodyElement.innerHTML = "";
    filteredProducts.forEach(function(product){
        const statusText = product.status === "active" ? ` <div class="box-status bg-active">
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
        const trElement = document.createElement("tr");
        trElement.dataset.id = product.id;
        trElement.innerHTML= `
                <td>${product.code}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.quantity}</td>
                <td>${product.discount}</td>
                <td>${statusText}</td>
                <td style="width: 196px;">
                    <i class="fa-solid fa-trash btn-delete"></i>
                    <i class="fa-solid fa-pen"></i>
                </td>
        `;
        tbodyElement.appendChild(trElement);
    });
});

// Hàm xóa & sửa sản phẩm
tbodyElement.addEventListener("click",function(event){
	// Kiểm tra nếu click vào nút xóa
    if(event.target.classList.contains("btn-delete")){
        const trElement = event.target.closest("tr");
        const productId = Number(trElement.dataset.id);
		// Xác nhận xóa
        const isConfirmed = confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");
        if(isConfirmed){
			// Xóa sản phẩm khỏi mảng
            products = products.filter(function(product){
                return product.id !== productId;
            });
			// Cập nhật lại localStorage và render lại danh sách
            localStorage.setItem("products",JSON.stringify(products));
			// Render lại danh sách
            renderProducts();
        }
    }	
    // Kiểm tra nếu click vào nút sửa 
    if(event.target.classList.contains("fa-pen")){
		// Lấy ID của sản phẩm cần sửa
        const trElement = event.target.closest("tr");
        const productId = Number(trElement.dataset.id);
		// Tìm sản phẩm trong mảng
        const productToEdit = products.find(item => item.id === productId);
        
        if(productToEdit){
            // Gán ID sản phẩm đang chỉnh sửa
            editingProductId = productId;
            
            // Điền dữ liệu vào form
            productCodeInput.value = productToEdit.code;
            productNameInput.value = productToEdit.name;
            productCategoryInput.value = productToEdit.category;
            productQuantity.value = productToEdit.quantity;
            productPrice.value = productToEdit.price;
            productDiscount.value = productToEdit.discount;

            // Set trạng thái radio
            document.querySelector(`input[name=status][value=${productToEdit.status}]`).checked = true;
            productStatusValue = productToEdit.status;
            
            // Thay đổi tiêu đề modal
            modalTitle.textContent = "Cập nhật sản phẩm";
            
            // Hiển thị form
            overlayProduct.style.display = "flex";
        }	
    }	
});
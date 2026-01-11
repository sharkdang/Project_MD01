
 let categoryClone = categories;







// // Lọc danh mục theo trạng thái 

// const filterStatusSelect = document.querySelector("#filter-status");
// const searchInput = document.querySelector("#search-input");

// //  Gắn sự kiện cho thẻ filterStatusSelect
// filterStatusSelect.addEventListener("change",function(){
//   renderCategories();
// });
// // Gắn sự kiện cho searchInput
// searchInput.addEventListener("input",function(){
//   renderCategories();
// });

// //Hàm xử lí sự kiện 
// function handleSearchStatus(){
//     const valueSearch=filterStatusSelect.value;
//     // Ng dùng chọn all
//     if(valueSearch ==="all"){
//       categoryClone = categories;
//     }else if(valueSearch ==="active"){
//       //ng dùng chọn active
//       categoryClone = categories.filter(c => c.status === "active")
//     }else if(valueSearch ==="inactive"){
//       //Ng dùng chọn inactive
//       categoryClone = categories.filter(c => c.status === "inactive")
//     }
// }

// Render lại danh mục


function handleLogout() {
    if (confirm("Bạn có muốn đăng xuất không?")) {
        location.href = '../pages/login.html';
    }
}
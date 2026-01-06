const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    // Tạo cửa sổ trình duyệt
    const mainWindow = new BrowserWindow({
        width: 1250, // Chiều rộng cửa sổ
        height: 900, // Chiều cao cửa sổ
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        // Ẩn thanh menu mặc định (File, Edit...) cho đẹp
        autoHideMenuBar: true 
    });

    // Nạp file index.html vào cửa sổ
    mainWindow.loadFile('index.html');
}

// Khi ứng dụng sẵn sàng thì tạo cửa sổ
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Khi đóng tất cả cửa sổ thì thoát ứng dụng (trên Windows)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import {
  TrendyolClient,
  TrendyolCredentials,
  TrendyolOrderFilter,
  TrendyolProductUpdate
} from './trendyolClient';

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 850,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js')
    }
  });

  if (!app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
};

app.whenReady().then(() => {
  ipcMain.handle('trendyol:listProducts', (_event, credentials: TrendyolCredentials, page?: number, size?: number) => {
    const client = new TrendyolClient(credentials);
    return client.listProducts(page, size);
  });

  ipcMain.handle('trendyol:updateStockPrice', (_event, credentials: TrendyolCredentials, items: TrendyolProductUpdate[]) => {
    const client = new TrendyolClient(credentials);
    return client.updateStockAndPrice(items);
  });

  ipcMain.handle('trendyol:listOrders', (_event, credentials: TrendyolCredentials, filter: TrendyolOrderFilter) => {
    const client = new TrendyolClient(credentials);
    return client.listOrders(filter);
  });

  ipcMain.handle('trendyol:getShipments', (_event, credentials: TrendyolCredentials, orderNumber: string) => {
    const client = new TrendyolClient(credentials);
    return client.getShipmentPackages(orderNumber);
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

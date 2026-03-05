import { contextBridge, ipcRenderer } from 'electron';
import {
  TrendyolCredentials,
  TrendyolOrderFilter,
  TrendyolProductUpdate
} from '../main/trendyolClient';

const trendyolApi = {
  listProducts: (credentials: TrendyolCredentials, page?: number, size?: number) =>
    ipcRenderer.invoke('trendyol:listProducts', credentials, page, size),
  updateStockPrice: (credentials: TrendyolCredentials, items: TrendyolProductUpdate[]) =>
    ipcRenderer.invoke('trendyol:updateStockPrice', credentials, items),
  listOrders: (credentials: TrendyolCredentials, filter: TrendyolOrderFilter) =>
    ipcRenderer.invoke('trendyol:listOrders', credentials, filter),
  getShipments: (credentials: TrendyolCredentials, orderNumber: string) =>
    ipcRenderer.invoke('trendyol:getShipments', credentials, orderNumber)
};

contextBridge.exposeInMainWorld('trendyol', trendyolApi);

export type TrendyolBridge = typeof trendyolApi;

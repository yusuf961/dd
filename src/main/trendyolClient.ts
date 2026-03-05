export interface TrendyolCredentials {
  apiKey: string;
  apiSecret: string;
  supplierId: string;
  baseUrl?: string;
}

export interface TrendyolProductUpdate {
  barcode: string;
  quantity: number;
  salePrice: number;
  listPrice?: number;
}

export interface TrendyolOrderFilter {
  status?: string;
  startDate?: string;
  endDate?: string;
  orderNumber?: string;
  page?: number;
  size?: number;
}

export class TrendyolClient {
  private readonly baseUrl: string;
  private readonly supplierId: string;
  private readonly authHeader: string;

  constructor(credentials: TrendyolCredentials) {
    const apiKey = credentials.apiKey?.trim();
    const apiSecret = credentials.apiSecret?.trim();
    const supplierId = credentials.supplierId?.trim();

    if (!apiKey || !apiSecret || !supplierId) {
      throw new Error('API Key, API Secret ve Supplier ID zorunludur.');
    }

    this.baseUrl = credentials.baseUrl?.trim() || 'https://api.trendyol.com/sapigw';
    this.supplierId = supplierId;
    this.authHeader = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Basic ${this.authHeader}`,
        'Content-Type': 'application/json',
        'User-Agent': `${this.supplierId} - SelfIntegration`,
        ...(init.headers || {})
      }
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Trendyol API hata ${response.status}: ${errorBody}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  }

  async listProducts(page = 0, size = 50) {
    return this.request(`/suppliers/${this.supplierId}/products?page=${page}&size=${size}`);
  }

  async updateStockAndPrice(items: TrendyolProductUpdate[]) {
    return this.request(`/suppliers/${this.supplierId}/products/price-and-inventory`, {
      method: 'POST',
      body: JSON.stringify({
        items: items.map((item) => ({
          barcode: item.barcode,
          quantity: item.quantity,
          salePrice: item.salePrice,
          ...(item.listPrice !== undefined ? { listPrice: item.listPrice } : {})
        }))
      })
    });
  }

  async listOrders(filter: TrendyolOrderFilter = {}) {
    const params = new URLSearchParams();
    if (filter.status) params.set('status', filter.status);
    if (filter.orderNumber) params.set('orderNumber', filter.orderNumber);
    if (filter.startDate) params.set('startDate', String(new Date(filter.startDate).getTime()));
    if (filter.endDate) params.set('endDate', String(new Date(filter.endDate).getTime()));
    params.set('page', String(filter.page ?? 0));
    params.set('size', String(filter.size ?? 20));

    return this.request(`/suppliers/${this.supplierId}/orders?${params.toString()}`);
  }

  async getShipmentPackages(orderNumber: string) {
    const params = new URLSearchParams({ orderNumber, page: '0', size: '50' });
    return this.request(`/suppliers/${this.supplierId}/orders/shipment-packages?${params.toString()}`);
  }
}

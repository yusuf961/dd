import { useMemo, useState } from 'react';

type Credentials = {
  apiKey: string;
  apiSecret: string;
  supplierId: string;
  baseUrl: string;
};

const defaultCreds: Credentials = {
  apiKey: '',
  apiSecret: '',
  supplierId: '',
  baseUrl: 'https://api.trendyol.com/sapigw'
};

export function App() {
  const [credentials, setCredentials] = useState<Credentials>(defaultCreds);
  const [stockPayload, setStockPayload] = useState(
    '[{"barcode":"SKU-001","quantity":12,"salePrice":399.9}]'
  );
  const [orderStatus, setOrderStatus] = useState('Created');
  const [orderNumber, setOrderNumber] = useState('');
  const [output, setOutput] = useState('Hazır. Bilgileri doldurup bir işlem seçin.');
  const [loading, setLoading] = useState(false);

  const hasCredentials = useMemo(
    () => credentials.apiKey && credentials.apiSecret && credentials.supplierId,
    [credentials]
  );

  const run = async (action: () => Promise<unknown>) => {
    if (!hasCredentials) {
      setOutput('Önce API Key, API Secret ve Supplier ID girin.');
      return;
    }

    setLoading(true);
    try {
      const result = await action();
      setOutput(JSON.stringify(result, null, 2));
    } catch (error) {
      setOutput(error instanceof Error ? error.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <h1>Trendyol Stok / Fiyat / Sipariş Takip</h1>

      <section className="card">
        <h2>Kimlik Bilgileri</h2>
        <div className="grid">
          <label>
            API Key
            <input
              value={credentials.apiKey}
              onChange={(e) => setCredentials((v) => ({ ...v, apiKey: e.target.value }))}
            />
          </label>
          <label>
            API Secret
            <input
              type="password"
              value={credentials.apiSecret}
              onChange={(e) => setCredentials((v) => ({ ...v, apiSecret: e.target.value }))}
            />
          </label>
          <label>
            Supplier ID
            <input
              value={credentials.supplierId}
              onChange={(e) => setCredentials((v) => ({ ...v, supplierId: e.target.value }))}
            />
          </label>
          <label>
            Base URL
            <input
              value={credentials.baseUrl}
              onChange={(e) => setCredentials((v) => ({ ...v, baseUrl: e.target.value }))}
            />
          </label>
        </div>
      </section>

      <section className="card actions">
        <h2>İşlemler</h2>
        <div className="buttons">
          <button
            onClick={() =>
              run(() =>
                window.trendyol.listProducts(credentials, 0, 50)
              )
            }
            disabled={loading}
          >
            Ürünleri Listele
          </button>
          <button
            onClick={() =>
              run(() => {
                const parsed = JSON.parse(stockPayload);
                return window.trendyol.updateStockPrice(credentials, parsed);
              })
            }
            disabled={loading}
          >
            Stok/Fiyat Güncelle
          </button>
          <button
            onClick={() =>
              run(() =>
                window.trendyol.listOrders(credentials, {
                  status: orderStatus,
                  page: 0,
                  size: 20
                })
              )
            }
            disabled={loading}
          >
            Siparişleri Getir
          </button>
          <button
            onClick={() => run(() => window.trendyol.getShipments(credentials, orderNumber))}
            disabled={loading || !orderNumber}
          >
            Kargo/Sipariş Takip
          </button>
        </div>

        <label>
          Stok/Fiyat JSON Payload
          <textarea
            rows={5}
            value={stockPayload}
            onChange={(e) => setStockPayload(e.target.value)}
          />
        </label>

        <div className="row">
          <label>
            Sipariş Durumu
            <input value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} />
          </label>
          <label>
            Sipariş Numarası
            <input value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} />
          </label>
        </div>
      </section>

      <section className="card">
        <h2>Çıktı</h2>
        <pre>{output}</pre>
      </section>
    </main>
  );
}

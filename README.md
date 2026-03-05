# Trendyol Masaüstü Entegrasyon (Electron + React)

Bu proje, **Trendyol Seller API** ile masaüstünden ürün/stok/fiyat/sipariş işlemlerini yapmak için hazırlanmış bir Electron uygulamasıdır.

## Özellikler
- Ürün listeleme (`/suppliers/{supplierId}/products`)
- Toplu stok/fiyat güncelleme (`/suppliers/{supplierId}/products/price-and-inventory`)
- Sipariş listeleme (`/suppliers/{supplierId}/orders`)
- Shipment package sorgulama (`/suppliers/{supplierId}/orders/shipment-packages`)

## Gerekli Bilgiler
- `apiKey`
- `apiSecret`
- `supplierId`
- Opsiyonel `baseUrl` (varsayılan: `https://api.trendyol.com/sapigw`)

## Kurulum
```bash
npm install
```

## Geliştirme
```bash
npm run dev
```

## Build
```bash
npm run build
```

## Type Check
```bash
npm run typecheck
```

## Güvenlik Notu
- Kimlik bilgileri yalnızca uygulama içinde kullanılır, dosyaya persist edilmez.
- Renderer tarafı Trendyol API'ye direkt gitmez; çağrılar preload + IPC ile main process üzerinden geçer.

## Önemli
Trendyol API sürümü/endpoint davranışları mağaza tipine göre değişebilir. Canlıya almadan önce kendi satıcı hesabınızla endpoint ve payload doğrulaması yapın.

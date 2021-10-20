## Bellshade Server Side

Hanya sebuah proxy untuk mengambil data ke github API.

## Dev

Yang pertama kali harus dilakukan adalah mengcopy file `.env.sample` dan mengubah namanya menjadi `.env`. Setelah itu, buatlah sebuah [personal token](https://github.com/settings/tokens) github api dengan akses `read:org` dan `read:user`. Copy token tersebut ke field yang sudah ada di file `.env`.

### Install Package

Install terlebih dahulu package yang diperlukan

```bash
npm install
```

### Available Script

Untuk menjalankan development server

```bash
npm run dev
```

Untuk menjalankan production server

```bash
npm run start
```

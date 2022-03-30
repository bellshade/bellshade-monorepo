# `@bellshade/shared`

![npm version](https://img.shields.io/npm/v/@bellshade/shared?style=for-the-badge)
![npm download](https://img.shields.io/npm/dt/@bellshade/shared?style=for-the-badge)
<img alt="Libraries.io dependency status for latest release" src="https://img.shields.io/librariesio/release/npm/@bellshade/shared?style=for-the-badge">

Package untuk keperluan konfigurasi yang sifatnya perlu di bagikan ke berbagai repositori. Isinya akan ada konfigurasi cache dan key yang bisa kamu gunakan ketika membuat aplikasi yang bergantung dengan api ini.

## Penggunaan

Ketika menggunakan package ini, ketika memanggilnya akan mengembalikan value. Untuk value dan typing bisa mengecek file [index.d.ts](./index.d.ts).

Contoh penggunaan sederhana

```js
const shared = require("@bellshade/shared");

console.log(shared);
```

## Bellshade Monorepo

Selamat datang ke repositori monorepo dari organisasi bellshade. Repositori ini berisikan beberapa package yang bisa digunakan, diantaranya adalah package [`@bellshade/shared`](./packages/shared/) dan [`@bellshade/ningali`](./packages/ningali/).

### Development

#### Instalasi

Karena repositori ini menerapkan monorepo dengan [lerna](https://github.com/lerna/lerna) oleh karena itu untuk melakukan instalasi dengan menggunakan command dari lerna, dengan menjalankan

```sh
npx lerna bootstrap
```

#### Membuat Package Baru

Ketika ingin membuat package baru, inisialiasi package baru tersebut dengan command lerna seperti contoh dibawah ini.

```sh
npx lerna create @bellshade/<nama package>
```

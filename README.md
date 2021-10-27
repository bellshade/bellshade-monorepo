## Bellshade Server Side

Hanya sebuah proxy untuk mengambil data ke github API.

## Dev

### Environment Variable

Copy file `.env.sample` dan ubah namanya menjadi `.env`, isikan variabel sesuai Keterangan dibawah.

```
GITHUB_TOKEN_API=
DISCORD_WEBHOOK_URL=
MENTION_DISCORD_USER_ID=
```

Keterangan :

- `GITHUB_TOKEN_API` : Untuk akses yang limitnya besar, diperlukan github personal token, buatlah [disini](https://github.com/settings/tokens) dengan akses `read:org` dan `read:user`.
- `DISCORD_WEBHOOK_URL` : Untuk kemudahan logging data error ataupun scheduler, aplikasi ini mengandalkan discord webhook. Baca [artikel ini](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks) untuk lebih lengkap apa itu discord webhook dan cara mendapatkan urlnya.
- `MENTION_DISCORD_USER_ID` : Ketika ada error di aplikasi, webhook akan mengirimkan data error dan men-tag seseorang yang menangani aplikasi ini. Baca [artikel ini](https://birdie0.github.io/discord-webhooks-guide/other/discord_markdown.html#discord-tags) dan tempelkan id nya saja (misal `1236420xxxx`).

### Install Package

Install package yang diperlukan sebelum menjalankan

```bash
npm install
```

### Available Script

Untuk menjalankan development server

```bash
npm run dev
```

Untuk menjalankan server biasa

```bash
npm run start
```

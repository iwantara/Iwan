# 📄 PDF Editor - Simple Web PDF Editor

Aplikasi web sederhana untuk mengedit file PDF secara langsung di browser. Cocok untuk mengedit teks dan menyesuaikan kalimat agar pas dengan halaman.

## ✨ Fitur

- 📤 Upload file PDF langsung dari browser
- 📄 Tampilkan semua halaman PDF (jika 17 halaman, tampil 17 halaman)
- ✏️ Edit teks pada setiap halaman
- 💾 Download PDF dengan format asli tetap terjaga
- 🎨 Interface yang clean dan mudah digunakan
- 📱 Responsive design

## 🚀 Cara Menggunakan

### 1. Buka Aplikasi

Buka file `index.html` di browser Anda (Chrome, Firefox, Edge, dll)

### 2. Upload PDF

- Klik tombol **"📤 Upload PDF"**
- Pilih file PDF yang ingin Anda edit
- Tunggu beberapa saat hingga semua halaman ditampilkan

### 3. Edit Teks

- Setiap halaman memiliki tombol **"✏️ Edit Teks"**
- Klik tombol tersebut untuk masuk ke mode edit
- Ketik atau edit teks sesuai kebutuhan
- Anda bisa mengatur enter/kalimat agar pas dengan halaman
- Klik **"💾 Simpan"** untuk keluar dari mode edit

### 4. Download PDF

- Setelah selesai mengedit, klik tombol **"💾 Download PDF"**
- PDF akan terdownload dengan nama `edited_[nama-file-asli].pdf`
- Format dan struktur asli tetap terjaga

## 🛠️ Teknologi

- **HTML5** - Struktur aplikasi
- **CSS3** - Styling dan layout
- **JavaScript** - Logic dan interaksi
- **PDF.js** - Render dan display PDF
- **pdf-lib** - Edit dan manipulasi PDF

## 📋 Kebutuhan

- Browser modern (Chrome, Firefox, Edge, Safari)
- Koneksi internet (untuk load library PDF.js dan pdf-lib dari CDN)

## 💡 Tips Penggunaan

1. **Untuk hasil terbaik**: Edit teks satu halaman dulu, simpan, baru lanjut ke halaman berikutnya
2. **Atur enter/line break**: Tekan Enter di textarea untuk membuat baris baru
3. **Preview**: Sebelum download, pastikan semua edit sudah disimpan (tombol berubah dari "💾 Simpan" ke "✏️ Edit Teks")

## 🔒 Keamanan & Privacy

- Semua proses dilakukan di browser Anda (client-side)
- File PDF tidak diupload ke server manapun
- Data tetap aman dan private di komputer Anda

## 📝 Catatan

- Aplikasi ini cocok untuk edit teks sederhana
- Untuk edit yang lebih kompleks (gambar, formatting rumit), gunakan PDF editor profesional
- Pastikan browser Anda up-to-date untuk performa terbaik

## 🐛 Troubleshooting

**PDF tidak muncul?**
- Pastikan koneksi internet stabil
- Coba refresh halaman dan upload ulang

**Edit tidak tersimpan?**
- Pastikan klik tombol "💾 Simpan" setelah mengedit
- Pastikan tidak langsung close tab sebelum download

**Download gagal?**
- Coba lagi beberapa saat
- Pastikan browser mengizinkan download

## 📄 Lisensi

Free to use - Silakan digunakan dan dimodifikasi sesuai kebutuhan

---

Dibuat dengan ❤️ untuk memudahkan editing PDF

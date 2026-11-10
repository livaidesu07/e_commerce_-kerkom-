/* =========================================
   BOOKING SYSTEM - OMAH NOTO CIJERUK
========================================= */

// HARGA PAKET
const hargaPaket = {
  weekday: 1000000,
  weekend: 1300000,
  holiday: 1500000,
};

// NAMA PAKET
const namaPaket = {
  weekday: "Weekday",
  weekend: "Weekend",
  holiday: "Holiday",
};

// NOMOR WHATSAPP ADMIN
const nomorAdmin = "6285123901112";

/* =========================================
   MENGAMBIL ELEMENT HTML
========================================= */

const form = document.getElementById("bookingForm");

const namaInput = document.getElementById("nama");
const whatsappInput = document.getElementById("whatsapp");

const checkinInput = document.getElementById("checkin");
const checkoutInput = document.getElementById("checkout");

const jumlahTamuInput = document.getElementById("jumlahTamu");
const paketInput = document.getElementById("paket");

const catatanInput = document.getElementById("catatan");

// RINGKASAN
const summaryNama = document.getElementById("summaryNama");
const summaryCheckin = document.getElementById("summaryCheckin");
const summaryCheckout = document.getElementById("summaryCheckout");
const summaryTamu = document.getElementById("summaryTamu");
const summaryPaket = document.getElementById("summaryPaket");
const summaryTotal = document.getElementById("summaryTotal");

/* =========================================
   FORMAT RUPIAH
========================================= */

function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);
}

/* =========================================
   FORMAT TANGGAL
========================================= */

function formatTanggal(tanggal) {
  if (!tanggal) {
    return "-";
  }

  const [tahun, bulan, hari] = tanggal.split("-");

  const date = new Date(Number(tahun), Number(bulan) - 1, Number(hari));

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* =========================================
   MENDAPATKAN TANGGAL LOKAL
========================================= */

function tanggalLokal(date = new Date()) {
  const tahun = date.getFullYear();

  const bulan = String(date.getMonth() + 1).padStart(2, "0");

  const hari = String(date.getDate()).padStart(2, "0");

  return `${tahun}-${bulan}-${hari}`;
}

/* =========================================
   PENGATURAN TANGGAL
========================================= */

checkinInput.min = tanggalLokal();

checkinInput.addEventListener("change", function () {
  const tanggalCheckin = checkinInput.value;

  checkoutInput.min = tanggalCheckin || tanggalLokal();

  if (checkoutInput.value && checkoutInput.value <= tanggalCheckin) {
    checkoutInput.value = "";
  }

  updateRingkasan();
});

checkoutInput.addEventListener("change", function () {
  updateRingkasan();
});

/* =========================================
   MENGHITUNG JUMLAH MALAM
========================================= */

function hitungMalam(checkin, checkout) {
  if (!checkin || !checkout) {
    return 0;
  }

  const tanggalMasuk = new Date(checkin + "T00:00:00");

  const tanggalKeluar = new Date(checkout + "T00:00:00");

  const selisih = tanggalKeluar.getTime() - tanggalMasuk.getTime();

  const jumlahMalam = Math.round(selisih / (1000 * 60 * 60 * 24));

  return jumlahMalam > 0 ? jumlahMalam : 0;
}

/* =========================================
   MENGHITUNG TOTAL HARGA
========================================= */

function hitungTotal() {
  const paket = paketInput.value;

  const checkin = checkinInput.value;

  const checkout = checkoutInput.value;

  const jumlahMalam = hitungMalam(checkin, checkout);

  if (!paket || !hargaPaket[paket] || jumlahMalam === 0) {
    return 0;
  }

  const harga = hargaPaket[paket];

  return harga * jumlahMalam;
}

/* =========================================
   UPDATE RINGKASAN BOOKING
========================================= */

function updateRingkasan() {
  const nama = namaInput.value.trim();

  const checkin = checkinInput.value;

  const checkout = checkoutInput.value;

  const jumlahTamu = jumlahTamuInput.value;

  const paket = paketInput.value;

  const jumlahMalam = hitungMalam(checkin, checkout);

  const total = hitungTotal();

  // NAMA
  summaryNama.textContent = nama || "-";

  // CHECK-IN
  summaryCheckin.textContent = formatTanggal(checkin);

  // CHECK-OUT
  summaryCheckout.textContent = formatTanggal(checkout);

  // JUMLAH TAMU
  summaryTamu.textContent = `${jumlahTamu || 1} Orang`;

  // PAKET
  summaryPaket.textContent = namaPaket[paket] || "-";

  // TOTAL
  summaryTotal.textContent = formatRupiah(total);
}

/* =========================================
   EVENT INPUT
========================================= */

namaInput.addEventListener("input", updateRingkasan);

jumlahTamuInput.addEventListener("input", updateRingkasan);

paketInput.addEventListener("change", updateRingkasan);

/* =========================================
   MEMBACA PAKET DARI URL
========================================= */

const parameterURL = new URLSearchParams(window.location.search);

const paketURL = parameterURL.get("paket");

if (hargaPaket[paketURL]) {
  paketInput.value = paketURL;
}

/* =========================================
   VALIDASI FORM BOOKING
========================================= */

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const nama = namaInput.value.trim();

  const whatsapp = whatsappInput.value.trim();

  const checkin = checkinInput.value;

  const checkout = checkoutInput.value;

  const jumlahTamu = Number(jumlahTamuInput.value);

  const paket = paketInput.value;

  const catatan = catatanInput.value.trim();

  // VALIDASI NAMA
  if (nama.length < 3) {
    alert("Nama lengkap minimal 3 karakter.");

    namaInput.focus();

    return;
  }

  // VALIDASI WHATSAPP
  if (!/^(\+62|62|0)[0-9]{8,13}$/.test(whatsapp)) {
    alert("Masukkan nomor WhatsApp yang valid.");

    whatsappInput.focus();

    return;
  }

  // VALIDASI TANGGAL
  if (!checkin || !checkout) {
    alert("Silakan pilih tanggal check-in dan check-out.");

    return;
  }

  if (checkin < tanggalLokal()) {
    alert("Tanggal check-in tidak boleh di masa lalu.");

    return;
  }

  if (checkout <= checkin) {
    alert("Tanggal check-out harus setelah check-in.");

    checkoutInput.focus();

    return;
  }

  // VALIDASI JUMLAH TAMU
  if (!Number.isInteger(jumlahTamu) || jumlahTamu < 1) {
    alert("Jumlah tamu minimal 1 orang.");

    jumlahTamuInput.focus();

    return;
  }

  // VALIDASI PAKET
  if (!hargaPaket[paket]) {
    alert("Silakan pilih paket menginap.");

    paketInput.focus();

    return;
  }

  // PERHITUNGAN
  const jumlahMalam = hitungMalam(checkin, checkout);

  const total = hitungTotal();

  if (jumlahMalam <= 0 || total <= 0) {
    alert("Periksa kembali tanggal dan pilihan paket.");

    return;
  }

  // MEMBUAT PESAN WHATSAPP
  const pesan = `
HALO OMAH NOTO CIJERUK

Saya ingin mengajukan pemesanan villa.

DATA PEMESAN

Nama: ${nama}
WhatsApp: ${whatsapp}
Jumlah Tamu: ${jumlahTamu} orang

DETAIL MENGINAP

Paket: ${namaPaket[paket]}
Check-in: ${formatTanggal(checkin)}
Check-out: ${formatTanggal(checkout)}
Durasi: ${jumlahMalam} malam

HARGA

Harga per malam: ${formatRupiah(hargaPaket[paket])}
Estimasi Total: ${formatRupiah(total)}

CATATAN

${catatan || "Tidak ada catatan tambahan."}

Mohon informasi ketersediaan villa dan konfirmasi pemesanan.

Terima kasih.
    `;

  // MEMBUKA WHATSAPP
  const linkWhatsApp = `https://wa.me/${nomorAdmin}?text=${encodeURIComponent(pesan)}`;

  window.open(linkWhatsApp, "_blank", "noopener,noreferrer");
});

/* =========================================
   INISIALISASI
========================================= */

updateRingkasan();

console.log("Booking System Omah Noto berhasil dijalankan!");

import React, { useState, useEffect } from "react";

// Data statis paket, mapel, dan link — tidak perlu fetch dari Google Sheets lagi
const STATIC_DATA = [
  {
    paket: "A (SD)",
    mapel: "GURU KELAS SD",
    link: "https://nuraeni.vercel.app/",
  },
  {
    paket: "B (SMP)",
    mapel: "BAHASA INGGRIS",
    link: "https://heni-indrayani.vercel.app/",
  },
  {
    paket: "C (SMA)",
    mapel: "MATEMATIKA",
    link: "https://sukirman-r.vercel.app/",
  },
];

function App() {
  const [paket, setPaket] = useState<string>("");
  const [mapel, setMapel] = useState<string>("");
  const [activeLink, setActiveLink] = useState<string | null>(null);

  const handleNext = () => {
    const selectedRow = STATIC_DATA.find(
      (item) => item.paket === paket && item.mapel === mapel
    );
    if (selectedRow && selectedRow.link && selectedRow.link !== "-") {
      const redirectUrl = `${selectedRow.link}?mapel=${encodeURIComponent(
        mapel
      )}&from=pkbm`;
      setActiveLink(redirectUrl); // tampilkan di iframe, URL browser tidak berubah
    } else {
      alert("Tidak ada link yang tersedia untuk pilihan ini.");
    }
  };

  
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "PKBM_KEMBALI") {
        handleBack();
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const handleBack = () => {
    setActiveLink(null);
    setPaket("");
    setMapel("");
  };

  // Dapatkan paket unik
  const uniquePakets = STATIC_DATA.map((item) => item.paket).filter(
    (value, index, self) => value && self.indexOf(value) === index
  );

  // Dapatkan mapel unik berdasarkan paket yang dipilih
  const uniqueMapels = paket
    ? STATIC_DATA.filter((item) => item.paket === paket)
        .map((item) => item.mapel)
        .filter((value, index, self) => value && self.indexOf(value) === index)
    : [];

  // Kalau sudah pilih paket & mapel, tampilkan halaman tujuan di dalam iframe
  if (activeLink) {
    return (
      <div style={{ width: "100%", height: "100vh" }}>
        <iframe
          src={activeLink}
          title="Absensi"
          allow="geolocation; camera; microphone"
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "400px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        position: "relative",
      }}
    >
      <h2 style={{ textAlign: "center" }}>
        Form Pilihan Paket dan Mata Pelajaran
      </h2>

      <div style={{ marginBottom: "15px" }}>
        <label
          style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
        >
          Paket:
        </label>
        <select
          value={paket}
          onChange={(e) => {
            setPaket(e.target.value);
            setMapel("");
          }}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">Pilih Paket</option>
          {uniquePakets.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label
          style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
        >
          Mata Pelajaran:
        </label>
        <select
          value={mapel}
          onChange={(e) => setMapel(e.target.value)}
          disabled={!paket}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            backgroundColor: paket ? "white" : "#f5f5f5",
          }}
        >
          <option value="">Pilih Mata Pelajaran</option>
          {uniqueMapels.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleNext}
        disabled={!paket || !mapel}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          opacity: !paket || !mapel ? 0.6 : 1,
        }}
      >
        Selanjutnya
      </button>
    </div>
  );
}

export default App;

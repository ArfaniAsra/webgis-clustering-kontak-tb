// config.js
// Konfigurasi data dan pengaturan untuk WebGIS Clustering TB

const CONFIG = {
  // Pengaturan peta default
  map: {
    center: [-5.2, 119.5],
    zoom: 10,
    maxZoom: 18,
    minZoom: 8,
  },

  // Path ke file data
  dataPaths: {
    clusteringData: "./webgis-input/df_pemetaan_klaster_semua_skenario.csv",
    interpretasiData: "./webgis-input/interpretasi_klaster_per_kecamatan.csv", // Legacy file
    interpretasiNormalizedData: "./webgis-input/interpretasi_klaster_per_kecamatan_normalized.csv", // New structured file
    kontakData: "./webgis-input/df_kontak_perkecamatan.csv",
    normalizedData: "./webgis-input/df_kontak_tb_perkecamatan_norm.csv",
  },

  // Konfigurasi skenario clustering
  scenarios: {
    1: {
      name: "Paparan & Umur",
      description: "Clustering berdasarkan profil demografi dan paparan kontak TB",
      features: ["rata_rata_umur", "total_kontak", "kontak_serumah"],
      clusters: 4,
      colors: ["#e74c3c", "#3498db", "#f39c12", "#2ecc71"],
      interpretation: {
        0: "Kelompok risiko rendah - paparan minimal",
        1: "Kelompok risiko sedang - paparan terkontrol",
        2: "Kelompok risiko tinggi - paparan intensif",
        3: "Kelompok risiko sangat tinggi - membutuhkan intervensi",
      },
    },
    2: {
      name: "Gejala Klinis",
      description: "Clustering berdasarkan manifestasi gejala klinis kontak TB",
      features: ["batuk_pct", "sesak_nafas_pct", "keringat_malam_pct", "demam_meriang_pct"],
      clusters: 5,
      colors: ["#e74c3c", "#3498db", "#f39c12", "#2ecc71", "#9b59b6"],
      interpretation: {
        0: "Asimptomatik - tidak ada gejala signifikan",
        1: "Gejala ringan - perlu pemantauan",
        2: "Gejala sedang - screening lanjutan",
        3: "Gejala berat - evaluasi medis segera",
        4: "Gejala sangat berat - rujukan darurat",
      },
    },
    3: {
      name: "Faktor Risiko",
      description: "Clustering berdasarkan faktor risiko individu kontak TB",
      features: ["perokok_pct", "diabetes_mellitus_pct", "lansia_pct", "berobat_tidak_tuntas_pct"],
      clusters: 4,
      colors: ["#e74c3c", "#3498db", "#f39c12", "#2ecc71"],
      interpretation: {
        0: "Risiko minimal - populasi sehat",
        1: "Risiko rendah - faktor protektif",
        2: "Risiko sedang - perlu monitor",
        3: "Risiko tinggi - intervensi prioritas",
      },
    },
    4: {
      name: "Demografi Kontak",
      description: "Clustering berdasarkan karakteristik demografi kontak TB",
      features: ["rata_rata_umur", "laki_laki_pct", "perempuan_pct"],
      clusters: 8,
      colors: ["#e74c3c", "#3498db", "#f39c12", "#2ecc71", "#9b59b6", "#1abc9c", "#34495e", "#f1c40f"],
      interpretation: {
        0: "Anak dan remaja",
        1: "Dewasa muda laki-laki",
        2: "Dewasa muda perempuan",
        3: "Dewasa tengah laki-laki",
        4: "Dewasa tengah perempuan",
        5: "Lansia laki-laki",
        6: "Lansia perempuan",
        7: "Populasi campuran",
      },
    },
    5: {
      name: "Alur Pasien & Beban",
      description: "Clustering berdasarkan alur pasien dan beban layanan kesehatan",
      features: ["total_kontak", "dirujuk_pct", "jumlah_fasyankes_unik"],
      clusters: 4,
      colors: ["#e74c3c", "#3498db", "#f39c12", "#2ecc71"],
      interpretation: {
        0: "Beban rendah - kapasitas mencukupi",
        1: "Beban sedang - optimalisasi diperlukan",
        2: "Beban tinggi - penguatan sistem",
        3: "Beban sangat tinggi - intervensi darurat",
      },
    },
    6: {
      name: "Geospasial & Akses",
      description: "Clustering berdasarkan lokasi geografis dan akses layanan",
      features: ["latitude", "longitude", "jumlah_fasyankes_unik"],
      clusters: 6,
      colors: ["#e74c3c", "#3498db", "#f39c12", "#2ecc71", "#9b59b6", "#1abc9c"],
      interpretation: {
        0: "Akses sangat baik - urban center",
        1: "Akses baik - sub-urban",
        2: "Akses sedang - semi rural",
        3: "Akses terbatas - rural",
        4: "Akses sangat terbatas - remote",
        5: "Akses khusus - area tertentu",
      },
    },
  },

  // Mapping aspek interpretasi ke indeks skenario
  aspectMapping: {
    paparan: 1,
    gejala: 2,
    risiko: 3,
    demografi: 4,
    alur: 5,
    akses: 6,
  },

  // Konfigurasi aspek untuk interpretasi
  aspects: {
    paparan: {
      name: "Paparan & Umur",
      icon: "👥",
      fields: ["paparan_status", "paparan_total_kontak", "paparan_serumah_pct", "paparan_umur_mean"],
      statusColors: {
        rendah: "#2ecc71",
        sedang: "#f39c12",
        tinggi: "#e74c3c",
        "sangat tinggi": "#8b0000",
      },
    },
    gejala: {
      name: "Gejala Klinis",
      icon: "🩺",
      fields: ["gejala_status", "gejala_indeks_pct", "gejala_batuk_pct", "gejala_sesak_pct", "gejala_keringat_pct", "gejala_demam_pct"],
      statusColors: {
        rendah: "#2ecc71",
        sedang: "#f39c12",
        tinggi: "#e74c3c",
        "sangat tinggi": "#8b0000",
      },
    },
    risiko: {
      name: "Faktor Risiko Individu",
      icon: "⚠️",
      fields: ["risiko_status", "risiko_ibu_hamil_pct", "risiko_lansia_pct", "risiko_dm_pct", "risiko_perokok_pct", "risiko_tidak_tuntas_pct"],
      statusColors: {
        rendah: "#2ecc71",
        sedang: "#f39c12",
        tinggi: "#e74c3c",
        "sangat tinggi": "#8b0000",
      },
    },
    demografi: {
      name: "Demografi Kontak",
      icon: "👨‍👩‍👧‍👦",
      fields: ["demografi_status", "demografi_umur_mean", "demografi_laki_pct", "demografi_perempuan_pct"],
      statusColors: {
        muda: "#3498db",
        dewasa: "#f39c12",
        campuran: "#9b59b6",
        lansia: "#e74c3c",
      },
    },
    alur: {
      name: "Alur Pasien & Beban",
      icon: "🏥",
      fields: ["alur_status", "alur_total_kontak", "alur_rujukan_pct", "alur_fasyankes_mean"],
      statusColors: {
        rendah: "#2ecc71",
        sedang: "#f39c12",
        tinggi: "#e74c3c",
        "sangat tinggi": "#8b0000",
      },
    },
    akses: {
      name: "Geospasial & Akses",
      icon: "📍",
      fields: ["akses_status", "akses_fasyankes_mean"],
      statusColors: {
        baik: "#2ecc71",
        sedang: "#f39c12",
        terbatas: "#e74c3c",
        "sangat terbatas": "#8b0000",
      },
    },
  },

  // Pengaturan tampilan
  display: {
    markerSizes: {
      small: 8,
      medium: 10,
      large: 12,
    },
    popupWidth: 300,
    sidebarWidth: 320,
    animationDuration: 300,
  },

  // Pengaturan data
  data: {
    encoding: "utf-8",
    delimiter: ",",
    skipEmptyLines: true,
    requiredFields: ["alamat", "latitude", "longitude"],
  },

  // Pesan error dan loading
  messages: {
    loading: "Memuat data clustering...",
    loadingError: "Gagal memuat data. Pastikan folder 'webgis-input' tersedia dan server web berjalan.",
    noData: "Data tidak ditemukan untuk kecamatan ini.",
    noInterpretation: "Interpretasi belum tersedia untuk kecamatan ini.",
  },

  // Validasi data
  validation: {
    coordinateRange: {
      lat: { min: -6, max: -4 },
      lng: { min: 119, max: 121 },
    },
    clusterRange: { min: 0, max: 10 },
  },
};

// Fungsi utility untuk konfigurasi
const ConfigUtils = {
  // Get scenario configuration
  getScenario: (scenarioNum) => {
    return CONFIG.scenarios[scenarioNum] || null;
  },

  // Get aspect configuration
  getAspect: (aspectName) => {
    return CONFIG.aspects[aspectName] || null;
  },

  // Get color for cluster
  getClusterColor: (scenarioNum, clusterNum) => {
    const scenario = CONFIG.scenarios[scenarioNum];
    return scenario ? scenario.colors[clusterNum] : "#cccccc";
  },

  // Get cluster interpretation
  getClusterInterpretation: (scenarioNum, clusterNum) => {
    const scenario = CONFIG.scenarios[scenarioNum];
    return scenario?.interpretation?.[clusterNum] || "Tidak ada interpretasi";
  },

  // Get status color for aspect
  getStatusColor: (aspectName, status) => {
    const aspect = CONFIG.aspects[aspectName];
    if (!aspect || !status) return "#95a5a6";

    const lowerStatus = status.toLowerCase();
    return aspect.statusColors[lowerStatus] || "#95a5a6";
  },

  // Validate coordinates
  isValidCoordinate: (lat, lng) => {
    const latRange = CONFIG.validation.coordinateRange.lat;
    const lngRange = CONFIG.validation.coordinateRange.lng;
    return lat >= latRange.min && lat <= latRange.max && lng >= lngRange.min && lng <= lngRange.max;
  },

  // Validate cluster number
  isValidCluster: (clusterNum) => {
    const range = CONFIG.validation.clusterRange;
    return clusterNum >= range.min && clusterNum <= range.max;
  },

  // Format number for display
  formatNumber: (num, decimals = 0) => {
    if (num === null || num === undefined || num === "") return "-";
    const numValue = parseFloat(num);
    if (isNaN(numValue)) return "-";
    return numValue.toLocaleString("id-ID", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  },

  // Format percentage
  formatPercentage: (num, decimals = 1) => {
    if (num === null || num === undefined || num === "") return "-";
    const numValue = parseFloat(num);
    if (isNaN(numValue)) return "-";
    return `${numValue.toFixed(decimals)}%`;
  },

  // Get region type from name
  getRegionType: (alamat) => {
    return alamat.includes("Kabupaten Gowa") ? "Kabupaten Gowa" : "Kota Makassar";
  },

  // Get short name
  getShortName: (alamat) => {
    return alamat.split(",")[0].trim();
  },

  // Generate unique ID
  generateId: (prefix = "item") => {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Parse field name to readable label
  parseFieldLabel: (fieldName) => {
    const labelMap = {
      paparan_total_kontak: "Total Kontak",
      paparan_serumah_pct: "Kontak Serumah (%)",
      paparan_umur_mean: "Rata-rata Umur",
      gejala_indeks_pct: "Indeks Gejala (%)",
      gejala_batuk_pct: "Batuk (%)",
      gejala_sesak_pct: "Sesak Nafas (%)",
      gejala_keringat_pct: "Keringat Malam (%)",
      gejala_demam_pct: "Demam/Meriang (%)",
      risiko_ibu_hamil_pct: "Ibu Hamil (%)",
      risiko_lansia_pct: "Lansia (%)",
      risiko_dm_pct: "Diabetes Mellitus (%)",
      risiko_perokok_pct: "Perokok (%)",
      risiko_tidak_tuntas_pct: "Berobat Tidak Tuntas (%)",
      demografi_umur_mean: "Rata-rata Umur",
      demografi_laki_pct: "Laki-laki (%)",
      demografi_perempuan_pct: "Perempuan (%)",
      alur_total_kontak: "Total Kontak",
      alur_rujukan_pct: "Rujukan (%)",
      alur_fasyankes_mean: "Rata-rata Fasyankes",
      akses_fasyankes_mean: "Rata-rata Fasyankes",
    };

    return labelMap[fieldName] || fieldName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  },
};

// Export configuration
if (typeof window !== "undefined") {
  window.CONFIG = CONFIG;
  window.ConfigUtils = ConfigUtils;
}

// For Node.js environment
if (typeof module !== "undefined" && module.exports) {
  module.exports = { CONFIG, ConfigUtils };
}

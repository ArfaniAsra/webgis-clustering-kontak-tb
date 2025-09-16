// data-loader.js
// Standalone Data Loader untuk WebGIS Clustering TB

class DataLoader {
  constructor() {
    this.clusteringData = {};
    this.interpretasiData = {};
    this.kontakData = {};
    this.isDataLoaded = false;
    this.loadingCallbacks = [];
  }

  // Parse CSV dengan handling yang robust
  parseCSV(csvText) {
    try {
      const lines = csvText.trim().split("\n");
      if (lines.length < 2) {
        throw new Error("CSV file kosong atau hanya ada header");
      }

      const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim());
      const data = [];

      for (let i = 1; i < lines.length; i++) {
        const values = this.parseCSVLine(lines[i]);
        if (values.length >= headers.length) {
          const row = {};
          headers.forEach((header, index) => {
            row[header] = values[index] ? values[index].replace(/"/g, "").trim() : "";
          });
          data.push(row);
        }
      }

      console.log(`✅ Parsed ${data.length} rows from CSV`);
      return data;
    } catch (error) {
      console.error("❌ Error parsing CSV:", error);
      throw error;
    }
  }

  // Helper untuk parse CSV line dengan handling koma dalam quotes
  parseCSVLine(line) {
    const result = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current);
    return result;
  }

  // Load data utama dari CSV files
  async loadData() {
    try {
      console.log("🔄 Loading clustering data...");
      this.isDataLoaded = false;

      // Parallel loading untuk performance
      const [pemetaanResponse, interpretasiResponse, kontakResponse] = await Promise.all([
        fetch("./webgis-input/df_pemetaan_klaster_semua_skenario.csv"),
        fetch("./webgis-input/interpretasi_klaster_per_kecamatan.csv"),
        fetch("./webgis-input/df_kontak_perkecamatan.csv"),
      ]);

      // Check response status
      if (!pemetaanResponse.ok) throw new Error("Failed to load pemetaan data");
      if (!interpretasiResponse.ok) throw new Error("Failed to load interpretasi data");
      if (!kontakResponse.ok) throw new Error("Failed to load kontak data");

      // Parse text data
      const [pemetaanText, interpretasiText, kontakText] = await Promise.all([pemetaanResponse.text(), interpretasiResponse.text(), kontakResponse.text()]);

      // Parse CSV data
      const pemetaanData = this.parseCSV(pemetaanText);
      const interpretasiDataArray = this.parseCSV(interpretasiText);
      const kontakDataArray = this.parseCSV(kontakText);

      // Process clustering data
      console.log("🔄 Processing clustering data...");
      pemetaanData.forEach((row) => {
        if (row.alamat && row.latitude && row.longitude) {
          this.clusteringData[row.alamat] = {
            lat: parseFloat(row.latitude),
            lng: parseFloat(row.longitude),
            cluster_s1: parseInt(row.cluster_s1) || 0,
            cluster_s2: parseInt(row.cluster_s2) || 0,
            cluster_s3: parseInt(row.cluster_s3) || 0,
            cluster_s4: parseInt(row.cluster_s4) || 0,
            cluster_s5: parseInt(row.cluster_s5) || 0,
            cluster_s6: parseInt(row.cluster_s6) || 0,
          };
        }
      });

      // Process interpretasi data
      console.log("🔄 Processing interpretasi data...");
      interpretasiDataArray.forEach((row) => {
        if (row.Kecamatan && row["Interpretasi klaster dan rekomendasi"]) {
          this.interpretasiData[row.Kecamatan] = row["Interpretasi klaster dan rekomendasi"];
        }
      });

      // Process kontak data
      console.log("🔄 Processing kontak data...");
      kontakDataArray.forEach((row) => {
        if (row.alamat) {
          this.kontakData[row.alamat] = {
            rata_rata_umur: parseFloat(row.rata_rata_umur) || 0,
            total_kontak: parseInt(row.total_kontak) || 0,
            total_dirujuk: parseInt(row.total_dirujuk) || 0,
            jumlah_fasyankes_unik: parseInt(row.jumlah_fasyankes_unik) || 0,
            laki_laki: parseInt(row["laki-laki"]) || 0,
            perempuan: parseInt(row.perempuan) || 0,
            kontak_serumah: parseInt(row.kontak_serumah) || 0,
            batuk: parseInt(row.batuk) || 0,
            sesak_nafas: parseInt(row.sesak_nafas) || 0,
            perokok: parseInt(row.perokok) || 0,
            diabetes_mellitus: parseInt(row.diabetes_mellitus) || 0,
            lansia: parseInt(row.lansia) || 0,
          };
        }
      });

      // Validate loaded data
      const clusteringCount = Object.keys(this.clusteringData).length;
      const interpretasiCount = Object.keys(this.interpretasiData).length;
      const kontakCount = Object.keys(this.kontakData).length;

      if (clusteringCount === 0) {
        throw new Error("No clustering data loaded");
      }

      this.isDataLoaded = true;

      console.log("✅ Data loaded successfully:", {
        clustering: clusteringCount,
        interpretasi: interpretasiCount,
        kontak: kontakCount,
      });

      // Trigger callbacks
      this.loadingCallbacks.forEach((callback) => callback(true));

      return true;
    } catch (error) {
      console.error("❌ Error loading data:", error);
      this.isDataLoaded = false;

      // Trigger error callbacks
      this.loadingCallbacks.forEach((callback) => callback(false, error));

      return false;
    }
  }

  // Tambahkan callback untuk loading completion
  onLoadComplete(callback) {
    if (this.isDataLoaded) {
      callback(true);
    } else {
      this.loadingCallbacks.push(callback);
    }
  }

  // Get cluster statistics untuk skenario tertentu
  getClusterStatistics(scenarioNum) {
    const clusterKey = `cluster_s${scenarioNum}`;
    const clusters = {};

    Object.values(this.clusteringData).forEach((data) => {
      const clusterNum = data[clusterKey];
      clusters[clusterNum] = (clusters[clusterNum] || 0) + 1;
    });

    return clusters;
  }

  // Get detail kecamatan
  getKecamatanDetail(kecamatan, scenarioNum) {
    const clusteringInfo = this.clusteringData[kecamatan];
    const interpretasi = this.interpretasiData[kecamatan];
    const kontakInfo = this.kontakData[kecamatan];

    if (!clusteringInfo) {
      console.warn(`⚠️ No data found for kecamatan: ${kecamatan}`);
      return null;
    }

    const clusterKey = `cluster_s${scenarioNum}`;
    const clusterNum = clusteringInfo[clusterKey];

    return {
      nama: kecamatan,
      koordinat: {
        lat: clusteringInfo.lat,
        lng: clusteringInfo.lng,
      },
      cluster: clusterNum,
      interpretasi: interpretasi || "Interpretasi belum tersedia.",
      demografis: kontakInfo || null,
    };
  }

  // Get kecamatan dalam cluster tertentu
  getKecamatanByCluster(scenarioNum, clusterNum) {
    const clusterKey = `cluster_s${scenarioNum}`;
    return Object.keys(this.clusteringData).filter((kecamatan) => this.clusteringData[kecamatan][clusterKey] === clusterNum);
  }

  // Validate data quality
  validateData() {
    const issues = [];

    // Check coordinate validity
    Object.keys(this.clusteringData).forEach((kecamatan) => {
      const data = this.clusteringData[kecamatan];
      if (data.lat < -6 || data.lat > -4 || data.lng < 119 || data.lng > 121) {
        issues.push(`Invalid coordinates for ${kecamatan}: ${data.lat}, ${data.lng}`);
      }
    });

    // Check cluster validity
    for (let scenario = 1; scenario <= 6; scenario++) {
      const stats = this.getClusterStatistics(scenario);
      const clusterNums = Object.keys(stats).map((k) => parseInt(k));
      const maxCluster = Math.max(...clusterNums);
      const minCluster = Math.min(...clusterNums);

      if (minCluster < 0 || maxCluster > 10) {
        issues.push(`Scenario ${scenario}: Invalid cluster range ${minCluster}-${maxCluster}`);
      }
    }

    return {
      valid: issues.length === 0,
      issues: issues,
      summary: {
        clusteringData: Object.keys(this.clusteringData).length,
        interpretasiData: Object.keys(this.interpretasiData).length,
        kontakData: Object.keys(this.kontakData).length,
      },
    };
  }

  // Export data untuk debugging
  exportData() {
    return {
      clustering: this.clusteringData,
      interpretasi: this.interpretasiData,
      kontak: this.kontakData,
      isLoaded: this.isDataLoaded,
    };
  }

  // Reset data
  reset() {
    this.clusteringData = {};
    this.interpretasiData = {};
    this.kontakData = {};
    this.isDataLoaded = false;
    this.loadingCallbacks = [];
    console.log("🔄 DataLoader reset");
  }
}

// Export untuk penggunaan
if (typeof window !== "undefined") {
  window.DataLoader = DataLoader;
  console.log("✅ DataLoader class available globally");
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = DataLoader;
}

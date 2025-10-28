<script setup>
import { ref } from "vue";

defineProps({
  currentDate: { type: String, required: true },
  patientData: { default: {} },
  hospitalData: { default: {} },
  diagnosisData: { default: {} },
  groupingResults: { default: [] },
  totalFee: { type: Number, default: 0 },
});

const generatedInfo = ref(
  "Generated : E-Klaim 5.10.5.202510071053.dev @ 2025-10-17 11:38:22",
);
const pageInfo = ref("Lembar 1 / 1");
</script>

<template>
  <div class="header">
    <div class="header-top">
      <div class="header-title flex items-center gap-2">
        <img class="w-6 h-6" src="/assets/logo-ql.png" />KEMENTERIAN KESEHATAN
        REPUBLIK INDONESIA
      </div>
      <div class="header-right">
        <div class="date">{{ currentDate }}</div>
      </div>
    </div>
    <div class="document-title">Berkas Klaim Individual Pasien</div>
  </div>

  <div class="section">
    <div class="info-grid">
      <div class="info-row">
        <span class="info-label">Kode Rumah Sakit</span>
        <span class="info-separator">:</span>
        <span class="info-value">{{ hospitalData.code }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Kelas Rumah Sakit</span>
        <span class="info-separator">:</span>
        <span class="info-value">{{ hospitalData.class }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Nama RS</span>
        <span class="info-separator">:</span>
        <span class="info-value">{{ hospitalData.name }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Jenis Tarif</span>
        <span class="info-separator">:</span>
        <span class="info-value">{{ hospitalData.feeType }}</span>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="info-grid">
      <div class="info-row">
        <span class="info-label">Nomor Peserta</span>
        <span class="info-separator">:</span>
        <span class="info-value">{{ patientData.memberNumber }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Nomor SEP</span>
        <span class="info-separator">:</span>
        <span class="info-value">{{ patientData.sepNumber }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Nomor Rekam Medis</span>
        <span class="info-separator">:</span>
        <span class="info-value">{{ patientData.medicalRecordNumber }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Tanggal Masuk</span>
        <span class="info-separator">:</span>
        <span class="info-value">{{ patientData.admissionDate }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Umur Tahun</span>
        <span class="info-separator">:</span>
        <span class="info-value">{{ patientData.ageYears }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Tanggal Keluar</span>
        <span class="info-separator">:</span>
        <span class="info-value">{{ patientData.dischargeDate }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Umur Hari</span>
        <span class="info-separator">:</span>
        <span class="info-value">{{ patientData.ageDays }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Jenis Perawatan</span>
        <span class="info-separator">:</span>
        <span class="info-value">{{ patientData.treatmentType }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Tanggal Lahir</span>
        <span class="info-separator">:</span>
        <span class="info-value">{{ patientData.birthDate }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Cara Pulang</span>
        <span class="info-separator">:</span>
        <span class="info-value">{{ patientData.dischargeMethod }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Jenis Kelamin</span>
        <span class="info-separator">:</span>
        <span class="info-value">{{ patientData.gender }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">LOS</span>
        <span class="info-separator">:</span>
        <span class="info-value">{{ patientData.los }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Kelas Perawatan</span>
        <span class="info-separator">:</span>
        <span class="info-value">{{ patientData.careClass }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Berat Lahir</span>
        <span class="info-separator">:</span>
        <span class="info-value">{{ patientData.birthWeight }}</span>
      </div>
    </div>
  </div>

  <div class="section diagnosis-section">
    <div class="diagnosis-row">
      <span class="diagnosis-label">Diagnosa Utama</span>
      <span class="info-separator">:</span>
      <span class="info-value">{{ diagnosisData.primary }}</span>
    </div>
    <div class="diagnosis-row">
      <span class="diagnosis-label">Diagnosa Sekunder</span>
      <span class="info-separator">:</span>
      <span class="info-value">{{ diagnosisData.secondary }}</span>
    </div>
    <div class="diagnosis-row">
      <span class="diagnosis-label">Prosedur</span>
      <span class="info-separator">:</span>
      <span class="info-value">{{ diagnosisData.procedure }}</span>
    </div>
    <div class="diagnosis-row">
      <span class="diagnosis-label">ADL Sub Acute</span>
      <span class="info-separator">:</span>
      <span class="info-value">{{ diagnosisData.adlSubAcute }}</span>
    </div>
    <div class="diagnosis-row">
      <span class="diagnosis-label">ADL Chronic</span>
      <span class="info-separator">:</span>
      <span class="info-value">{{ diagnosisData.adlChronic }}</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Hasil Grouping</div>
    <table class="grouping-table">
      <thead>
        <tr>
          <th style="width: 30%">Jenis</th>
          <th style="width: 50%">Keterangan</th>
          <th style="width: 20%">Tarif</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in groupingResults" :key="index">
          <td>{{ item.type }}</td>
          <td>{{ item.description }}</td>
          <td class="amount">{{ item.fee }}</td>
        </tr>
        <tr class="total-row">
          <td colspan="2">Total Tarif</td>
          <td class="amount">{{ totalFee }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="footer">
    <span>{{ generatedInfo }}</span>
    <span>{{ pageInfo }}</span>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  font-size: 11px;
  padding: 20px;
  background: white;
}

.container {
  max-width: 210mm;
  margin: 0 auto;
}

.header {
  border-bottom: 2px solid #000;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.header-title {
  font-weight: bold;
  font-size: 12px;
}

.header-right {
  text-align: right;
}

.jkn-logo {
  font-weight: bold;
  font-size: 14px;
}

.document-title {
  font-weight: bold;
  font-size: 13px;
  margin-top: 5px;
}

.date {
  font-size: 10px;
}

.section {
  margin-bottom: 15px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 20px;
}

.info-row {
  display: flex;
  font-size: 10px;
}

.info-label {
  min-width: 140px;
  font-weight: normal;
}

.info-separator {
  margin: 0 5px;
}

.info-value {
  font-weight: normal;
}

.section-title {
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 11px;
}

.diagnosis-section {
  margin-bottom: 10px;
}

.diagnosis-row {
  display: flex;
  font-size: 10px;
  margin-bottom: 5px;
}

.diagnosis-label {
  min-width: 140px;
}

.grouping-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.grouping-table th,
.grouping-table td {
  border: 1px solid #000;
  padding: 6px 8px;
  text-align: left;
  font-size: 10px;
}

.grouping-table th {
  background-color: #f0f0f0;
  font-weight: bold;
}

.grouping-table td.amount {
  text-align: right;
}

.total-row {
  font-weight: bold;
}

.footer {
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid #ccc;
  font-size: 9px;
  color: #666;
  display: flex;
  justify-content: space-between;
}

@media print {
  body {
    padding: 0;
  }

  .container {
    max-width: 100%;
  }
}
</style>

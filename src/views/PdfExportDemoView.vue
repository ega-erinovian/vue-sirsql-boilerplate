<script setup>
import { Button } from "@/components/ui/button";
import { usePdfExport } from "@/composables/helper/usePdfExport";
import { computed, ref } from "vue";
import SampleTemplate from "../components/pdf-template/SampleTemplate.vue";

const { exportToPdf, exportToPdfFromHtml } = usePdfExport();
const pdfContent = ref(null);
const patientData = ref({
  memberNumber: "0000656174349",
  sepNumber: "0179R0140925V001056",
  medicalRecordNumber: "137753",
  admissionDate: "03/09/2025",
  ageYears: "53",
  dischargeDate: "03/09/2025",
  ageDays: "19584",
  treatmentType: "2 - Rawat Jalan",
  birthDate: "21/01/1972",
  dischargeMethod: "1 - Atas Persetujuan Dokter",
  gender: "2 - Perempuan",
  los: "1 hari",
  careClass: "Regular",
  birthWeight: "-",
});

const hospitalData = ref({
  code: "3404045",
  class: "C",
  name: "RSU QUEEN LATIFA",
  feeType: "TARIF RS KELAS D SWASTA",
});

const diagnosisData = ref({
  primary: "A00.1 Cholera due to vibrio cholerae 01, biovar eltor",
  secondary: "F25.1 Schizoaffective disorder, depressive type",
  procedure: "-",
  adlSubAcute: "-",
  adlChronic: "-",
});

const groupingResults = ref([
  {
    type: "INA-CBG",
    description: "Q-5-42-0 PENYAKIT AKUT KECIL LAIN-LAIN",
    fee: "Rp 189,200.00",
  },
  { type: "Sub Acute", description: "- -", fee: "Rp 0.00" },
  { type: "Chronic", description: "- -", fee: "Rp 0.00" },
  {
    type: "Special CMG",
    description: "RR-04-III-KneeHIP IMPLANT/ KNEE IMPLANT",
    fee: "Rp 0.00",
  },
]);

const totalFee = computed(() => {
  return "Rp 189,200.00";
});

const exportElement = () => {
  if (pdfContent.value) {
    exportToPdf(pdfContent.value, {
      filename: "my-document.pdf",
    });
  }
};

const exportCustomHtml = () => {
  const customHtml = `
      <!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Berkas Klaim Individual Pasien</title>
    <style>
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
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="header-top">
                <div class="header-title">KEMENTERIAN KESEHATAN REPUBLIK INDONESIA <span class="jkn-logo">JKN</span></div>
                <div class="header-right">
                    <div class="date">03/09/2025</div>
                </div>
            </div>
            <div style="font-weight: bold; font-size: 13px; margin-top: 5px;">Berkas Klaim Individual Pasien</div>
        </div>
        
        <div class="section">
            <div class="info-grid">
                <div class="info-row">
                    <span class="info-label">Kode Rumah Sakit</span>
                    <span class="info-separator">:</span>
                    <span class="info-value">3404045</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Kelas Rumah Sakit</span>
                    <span class="info-separator">:</span>
                    <span class="info-value">C</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Nama RS</span>
                    <span class="info-separator">:</span>
                    <span class="info-value">RSU QUEEN LATIFA</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Jenis Tarif</span>
                    <span class="info-separator">:</span>
                    <span class="info-value">TARIF RS KELAS D SWASTA</span>
                </div>
            </div>
        </div>
        
        <div class="section">
            <div class="info-grid">
                <div class="info-row">
                    <span class="info-label">Nomor Peserta</span>
                    <span class="info-separator">:</span>
                    <span class="info-value">0000656174349</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Nomor SEP</span>
                    <span class="info-separator">:</span>
                    <span class="info-value">0179R0140925V001056</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Nomor Rekam Medis</span>
                    <span class="info-separator">:</span>
                    <span class="info-value">137753</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Tanggal Masuk</span>
                    <span class="info-separator">:</span>
                    <span class="info-value">03/09/2025</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Umur Tahun</span>
                    <span class="info-separator">:</span>
                    <span class="info-value">53</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Tanggal Keluar</span>
                    <span class="info-separator">:</span>
                    <span class="info-value">03/09/2025</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Umur Hari</span>
                    <span class="info-separator">:</span>
                    <span class="info-value">19584</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Jenis Perawatan</span>
                    <span class="info-separator">:</span>
                    <span class="info-value">2 - Rawat Jalan</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Tanggal Lahir</span>
                    <span class="info-separator">:</span>
                    <span class="info-value">21/01/1972</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Cara Pulang</span>
                    <span class="info-separator">:</span>
                    <span class="info-value">1 - Atas Persetujuan Dokter</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Jenis Kelamin</span>
                    <span class="info-separator">:</span>
                    <span class="info-value">2 - Perempuan</span>
                </div>
                <div class="info-row">
                    <span class="info-label">LOS</span>
                    <span class="info-separator">:</span>
                    <span class="info-value">1 hari</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Kelas Perawatan</span>
                    <span class="info-separator">:</span>
                    <span class="info-value">Regular</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Berat Lahir</span>
                    <span class="info-separator">:</span>
                    <span class="info-value">-</span>
                </div>
            </div>
        </div>
        
        <div class="section diagnosis-section">
            <div class="diagnosis-row">
                <span class="diagnosis-label">Diagnosa Utama</span>
                <span class="info-separator">:</span>
                <span class="info-value">A00.1 Cholera due to vibrio cholerae 01, biovar eltor</span>
            </div>
            <div class="diagnosis-row">
                <span class="diagnosis-label">Diagnosa Sekunder</span>
                <span class="info-separator">:</span>
                <span class="info-value">F25.1 Schizoaffective disorder, depressive type</span>
            </div>
            <div class="diagnosis-row">
                <span class="diagnosis-label">Prosedur</span>
                <span class="info-separator">:</span>
                <span class="info-value">-</span>
            </div>
            <div class="diagnosis-row">
                <span class="diagnosis-label">ADL Sub Acute</span>
                <span class="info-separator">:</span>
                <span class="info-value">-</span>
            </div>
            <div class="diagnosis-row">
                <span class="diagnosis-label">ADL Chronic</span>
                <span class="info-separator">:</span>
                <span class="info-value">-</span>
            </div>
        </div>
        
        <div class="section">
            <div class="section-title">Hasil Grouping</div>
            <table class="grouping-table">
                <thead>
                    <tr>
                        <th style="width: 30%;">Jenis</th>
                        <th style="width: 50%;">Keterangan</th>
                        <th style="width: 20%;">Tarif</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>INA-CBG</td>
                        <td>Q-5-42-0 PENYAKIT AKUT KECIL LAIN-LAIN</td>
                        <td class="amount">Rp 189,200.00</td>
                    </tr>
                    <tr>
                        <td>Sub Acute</td>
                        <td>- -</td>
                        <td class="amount">Rp 0.00</td>
                    </tr>
                    <tr>
                        <td>Chronic</td>
                        <td>- -</td>
                        <td class="amount">Rp 0.00</td>
                    </tr>
                    <tr>
                        <td>Special CMG</td>
                        <td>RR-04-III-KneeHIP IMPLANT/ KNEE IMPLANT</td>
                        <td class="amount">Rp 0.00</td>
                    </tr>
                    <tr class="total-row">
                        <td colspan="2">Total Tarif</td>
                        <td class="amount">Rp 189,200.00</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="footer">
            <span>Generated : E-Klaim 5.10.5.202510071053.dev @ 2025-10-17 11:38:22</span>
            <span>Lembar 1 / 1</span>
        </div>
    </div>
</body>
</html>
    `;

  exportToPdfFromHtml(customHtml, {
    filename: "custom-document.pdf",
  });
};

const exportWithOptions = () => {
  if (pdfContent.value) {
    exportToPdf(pdfContent.value, {
      filename: "custom-options.pdf",
      margin: 20,
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "landscape",
      },
      html2canvas: {
        scale: 3,
        useCORS: true,
      },
    });
  }
};
</script>
<template>
  <div class="pdf-export-demo border-2">
    <div class="container py-2 pb-8 pdf-content" ref="pdfContent">
      <SampleTemplate 
      currentDate="03/09/2025"
      :patientData="patientData"
      :hospitalData="hospitalData"
      :diagnosisData="diagnosisData"
      :groupingResults="groupingResults"
      :totalFee="totalFee"
      />
    </div>
    <!-- Export buttons -->
    <div class="export-buttons flex gap-2">
      <Button @click="exportElement" class="btn btn-primary">
        Export Element to PDF
      </Button>

      <Button @click="exportCustomHtml" class="btn btn-secondary">
        Export Custom HTML to PDF
      </Button>

      <Button @click="exportWithOptions" class="btn btn-tertiary">
        Export with Custom Options
      </Button>
    </div>
  </div>
</template>
<style scoped>
@media print {
  .no-print {
    display: none !important;
  }

  body {
    margin: 0;
    padding: 0;
    background: white;
  }

  #pdf-content {
    padding: 0;
    margin: 0;
    box-shadow: none;
  }
}
</style>

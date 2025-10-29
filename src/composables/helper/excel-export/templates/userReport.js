// services/excelExport/templates/userReport.js

import { BaseTemplate } from '../baseTemplate.js';
import { Formatters } from '../utils/formatters.js';

export class UserReportTemplate {
  static generate(exportData) {
    const { users, options = {} } = exportData;
    const { 
      title = 'Laporan Data User', 
      subtitle = '',
      includeTimestamp = true 
    } = options;

    const content = `
    ${BaseTemplate.generateHeader(title, subtitle)}
    ${this.generateUserTable(users)}
    ${includeTimestamp ? this.generateTimestamp() : ''}
    ${this.generateSummary(users)}`;

    return content;
  }

  static generateUserTable(users) {
    if (!users || users.length === 0) {
      return `
      <div style="text-align: center; margin: 20px 0;">
        <p style="color: #666; font-style: italic;">Tidak ada data user</p>
      </div>`;
    }

    return `
    <table border="1" style="width: 100%; margin-top: 20px;">
      <thead>
        <tr>
          <th>No</th>
          <th>Username</th>
          <th>Nama Lengkap</th>
          <th>Last Login</th>
          <th>ID User</th>
          <th>ID Person</th>
          <th>ID Pegawai</th>
        </tr>
      </thead>
      <tbody>
        ${users.map((user, index) => this.generateUserRow(user, index)).join('')}
      </tbody>
    </table>`;
  }

  static generateUserRow(user, index) {
    const cleanedName = Formatters.escapeHtml(user.nama_pegawai?.trim() || '-');
    const lastLogin = user.login_terakhir ? Formatters.formatDateTime(user.login_terakhir) : 'Never';
    
    return `
    <tr>
      <td>${index + 1}</td>
      <td>${Formatters.escapeHtml(user.username || '-')}</td>
      <td>${cleanedName}</td>
      <td>${lastLogin}</td>
      <td class="number">${user.iduser || '-'}</td>
      <td class="number">${user.idperson || '-'}</td>
      <td class="number">${user.idpegawai || '-'}</td>
    </tr>`;
  }

  static generateTimestamp() {
    return `
    <div style="margin-top: 20px; font-size: 12px; color: #666; text-align: center;">
      <p>File generated on: ${new Date().toLocaleString('id-ID')}</p>
    </div>`;
  }

  static generateSummary(users) {
    if (!users || users.length === 0) return '';

    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.login_terakhir).length;
    const neverLoggedIn = totalUsers - activeUsers;
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 30));
    const recentActiveUsers = users.filter(user => {
      if (!user.login_terakhir) return false;
      const loginDate = new Date(user.login_terakhir);
      return loginDate >= thirtyDaysAgo;
    }).length;

    return `
    <table border="1" style="width: 100%; margin-top: 20px; background-color: #f9f9f9;">
      <thead>
        <tr>
          <th colspan="4" style="background-color: #e0e0e0;">Summary Report</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Total Users</strong></td>
          <td class="number">${totalUsers}</td>
          <td><strong>Active Users (Ever)</strong></td>
          <td class="number">${activeUsers}</td>
        </tr>
        <tr>
          <td><strong>Never Logged In</strong></td>
          <td class="number">${neverLoggedIn}</td>
          <td><strong>Active Last 30 Days</strong></td>
          <td class="number">${recentActiveUsers}</td>
        </tr>
        <tr>
          <td><strong>Report Date</strong></td>
          <td colspan="3">${new Date().toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</td>
        </tr>
      </tbody>
    </table>`;
  }
}
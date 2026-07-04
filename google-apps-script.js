// ============================================================
// SUP Antalya — Google Apps Script
// Bu kodu script.google.com'da yeni proje olarak yapıştır
// Spreadsheet: https://docs.google.com/spreadsheets/d/1_a02MPfXb0niSW9RAQMZ_iT_qDkOlRVU
// ============================================================

const SPREADSHEET_ID = '1_a02MPfXb0niSW9RAQMZ_iT_qDkOlRVU';
const SHEET_NAME = 'WebSitesi';

const HEADERS = [
  'Rez. No',
  'Kayıt Tarihi',
  'Aktivite Tarihi',
  'Saat/Seans',
  'Aktivite Türü',
  'Bölge',
  'Kişi Sayısı',
  'Ad',
  'Soyad',
  'Telefon',
  'E-Posta',
  'Not',
  'Toplam Tutar (₺)',
  'Kapora (₺)',
  'Kapora Durumu',
  'Rezervasyon Durumu',
  'Dil',
];

function doPost(e) {
  try {
    const raw = e.postData ? e.postData.contents : '{}';
    const data = JSON.parse(raw);

    if (data.action !== 'addReservation') {
      return response({ success: false, message: 'Unknown action' });
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Sheet yoksa oluştur ve başlık satırı ekle
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length)
        .setFontWeight('bold')
        .setBackground('#0077b6')
        .setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

    const now = new Date();
    const kayitTarihi = Utilities.formatDate(now, 'Europe/Istanbul', 'dd.MM.yyyy HH:mm');

    const row = [
      data.rezNo        || '',
      kayitTarihi,
      data.date         || '',
      data.time         || '',
      data.activityType === 'event' ? 'Etkinlik' : 'Kiralama',
      data.location     || 'Konyaaltı Beachpark',
      data.people       || 1,
      data.firstName    || '',
      data.lastName     || '',
      data.phone        || '',
      data.email        || '',
      data.note         || '',
      data.total        || 0,
      data.deposit      || 0,
      'Bekliyor',
      'Bekliyor',
      data.lang         || 'tr',
    ];

    sheet.appendRow(row);

    // Son satırı biraz formatlı yap
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 13, 1, 2).setNumberFormat('#,##0 "₺"');

    return response({ success: true, message: 'Rezervasyon eklendi', rezNo: data.rezNo });
  } catch (err) {
    return response({ success: false, message: err.toString() });
  }
}

function doGet(e) {
  return response({ success: true, message: 'SUP Antalya Apps Script aktif' });
}

function response(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

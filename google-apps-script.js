// ============================================================
// SUP Antalya — Google Apps Script
// Spreadsheet: https://docs.google.com/spreadsheets/d/1_a02MPfXb0niSW9RAQMZ_iT_qDkOlRVU
// ============================================================

const SPREADSHEET_ID = '1_a02MPfXb0niSW9RAQMZ_iT_qDkOlRVU';
const SHEET_NAME = 'WebRezervasyon';

const HEADERS = [
  'Rez. No', 'Kayıt Tarihi', 'Aktivite Tarihi', 'Saat/Seans', 'Aktivite Türü',
  'Bölge', 'Kişi Sayısı', 'Ad', 'Soyad', 'Telefon', 'E-Posta', 'Not',
  'Toplam Tutar (₺)', 'Kapora (₺)', 'Kapora Durumu', 'Rezervasyon Durumu', 'Dil',
];

function doGet(e) {
  try {
    // Rezervasyon verisi GET parametresiyle geliyorsa yaz
    if (e && e.parameter && e.parameter.payload) {
      const data = JSON.parse(decodeURIComponent(e.parameter.payload));

      if (data.action !== 'addReservation') {
        return response({ success: false, message: 'Unknown action' });
      }

      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      let sheet = ss.getSheetByName(SHEET_NAME);

      if (!sheet) {
        sheet = ss.insertSheet(SHEET_NAME);
        sheet.appendRow(HEADERS);
        sheet.getRange(1, 1, 1, HEADERS.length)
          .setFontWeight('bold').setBackground('#0077b6').setFontColor('#ffffff');
        sheet.setFrozenRows(1);
      }

      const kayitTarihi = Utilities.formatDate(new Date(), 'Europe/Istanbul', 'dd.MM.yyyy HH:mm');

      sheet.appendRow([
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
      ]);

      const lastRow = sheet.getLastRow();
      sheet.getRange(lastRow, 10).setNumberFormat('@');
      sheet.getRange(lastRow, 13, 1, 2).setNumberFormat('#,##0 "₺"');

      return response({ success: true, rezNo: data.rezNo });
    }

    // Normal GET — script aktif kontrolü
    return response({ success: true, message: 'SUP Antalya Apps Script aktif' });

  } catch (err) {
    return response({ success: false, message: err.toString() });
  }
}

function doPost(e) {
  // Artık kullanılmıyor, doGet'e yönlendir
  return response({ success: false, message: 'POST desteklenmiyor, GET kullanin' });
}

function response(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

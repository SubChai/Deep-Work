function TOSHAMSI_TODAY() {
  var today = new Date();
  var gy = today.getFullYear();
  var gm = today.getMonth() + 1;
  var gd = today.getDate();
  
  var g_y = gy - 1600;
  var g_m = gm - 1;
  var g_d = gd - 1;
  
  var g_day_no = 365 * g_y + Math.floor((g_y + 3) / 4) - Math.floor((g_y + 99) / 100) + Math.floor((g_y + 399) / 400);
  
  for (var i = 0; i < g_m; ++i)
    g_day_no += [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][i];
  
  if (g_m > 1 && ((gy % 4 == 0 && gy % 100 != 0) || (gy % 400 == 0)))
    g_day_no++;
  
  g_day_no += g_d;
  
  var j_day_no = g_day_no - 79;
  
  var j_np = Math.floor(j_day_no / 12053);
  j_day_no = j_day_no % 12053;
  
  var jy = 979 + 33 * j_np + 4 * Math.floor(j_day_no / 1461);
  
  j_day_no %= 1461;
  
  if (j_day_no >= 366) {
    jy += Math.floor((j_day_no - 1) / 365);
    j_day_no = (j_day_no - 1) % 365;
  }
  
  var jm, jd;
  
  if (j_day_no < 186) {
    jm = 1 + Math.floor(j_day_no / 31);
    jd = 1 + (j_day_no % 31);
  } else {
    jm = 7 + Math.floor((j_day_no - 186) / 30);
    jd = 1 + ((j_day_no - 186) % 30);
  }
  
  return jy + '/' + (jm < 10 ? '0' + jm : jm) + '/' + (jd < 10 ? '0' + jd : jd);
}

function onEdit(e) {
  var sheet = e.source.getActiveSheet();
  var range = e.range;
  var col = range.getColumn();
  var row = range.getRow();
  
  // اگر ردیف 1 یا 2 باشه، کاری نکن
  if (row <= 2) {
    return;
  }
  
  // اگر ستون فرد باشه (1=A, 3=C, 5=E, ...)
  if (col % 2 == 1 && range.getValue() != "") {
    var targetCell = sheet.getRange(row, col + 1); // ستون بعدی (زوج)
    targetCell.setValue(TOSHAMSI_TODAY());
  }
  
  // محاسبه جمع ستون‌های فرد
  updateSumInG2(sheet);
}

function updateSumInG2(sheet) {
  var lastCol = sheet.getLastColumn();
  var lastRow = sheet.getLastRow();
  var sum = 0;
  
  // از ستون 1 (A) شروع می‌کنیم و فقط ستون‌های فرد رو می‌خونیم
  for (var col = 1; col <= lastCol; col += 2) {
    for (var row = 3; row <= lastRow; row++) {
      var value = sheet.getRange(row, col).getValue();
      
      // تبدیل به عدد اگر متن باشه
      if (value !== "" && value !== null) {
        var numValue = Number(value);
        if (!isNaN(numValue)) {
          sum += numValue;
        }
      }
    }
  }
  
  // جمع رو در G2 می‌ذاریم
  sheet.getRange("G2").setValue(sum);
}

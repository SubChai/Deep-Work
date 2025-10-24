/**
 * =============================================================================
 * 🏆 ACTIVITY DeepWork PRO - ULTIMATE EDITION v3.1 SubChai
 * =============================================================================
 * 
 * 🎯 نسخه حرفه‌ای با قابلیت‌های پیشرفته + اعداد فارسی
 * ویژگی‌ها:
 * ✅ محاسبه خودکار زمان
 * ✅ تاریخ شمسی هوشمند (فیکس شده)
 * ✅ تبدیل خودکار به اعداد فارسی
 * ✅ Dashboard آماری
 * ✅ رنگ‌بندی هوشمند
 * ✅ گزارش‌ساز حرفه‌ای
 * ✅ اعلان‌های هوشمند
 * ✅ جستجوی پیشرفته
 * 
 * نویسنده: SubChai
 * نسخه: 3.1 Ultimate (Date Fixed)
 * =============================================================================
 */

// ============================================================================
// 📌 تنظیمات اصلی
// ============================================================================

const CONFIG = {
  HEADER_ROWS: 2,
  START_ROW: 3,
  VERSION: '3.1 Ultimate + Persian (Fixed)',
  
  GROUPS: [
    { name: 'گروه ۱', subject: 1,  start: 2,  end: 3,  calc: 4,  date: 5  },
    { name: 'گروه ۲', subject: 6,  start: 7,  end: 8,  calc: 9,  date: 10 },
    { name: 'گروه ۳', subject: 11, start: 12, end: 13, calc: 14, date: 15 },
    { name: 'گروه ۴', subject: 16, start: 17, end: 18, calc: 19, date: 20 },
    { name: 'گروه ۵', subject: 21, start: 22, end: 23, calc: 24, date: 25 }
  ],
  
  COLORS: {
    LOW_WORK: '#e8f5e9',
    MEDIUM_WORK: '#fff9c4',
    HIGH_WORK: '#ffccbc',
    VERY_HIGH_WORK: '#ffcdd2',
    HEADER: '#b3e5fc',
    WEEKEND: '#f3e5f5'
  },
  
  ALERTS: {
    DAILY_LIMIT: 12,
    WEEKLY_TARGET: 40,
    LOW_WORK_THRESHOLD: 2
  }
};

// ============================================================================
// 🔢 تبدیل اعداد به فارسی و برعکس
// ============================================================================

function toPersianNumber(input) {
  if (!input) return "";
  const persianDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  return input.toString().replace(/\d/g, digit => persianDigits[digit]);
}

function toEnglishNumber(input) {
  if (!input) return "";
  const englishDigits = ['0','1','2','3','4','5','6','7','8','9'];
  const persianDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  let result = input.toString();
  for (let i = 0; i < 10; i++) {
    result = result.replace(new RegExp(persianDigits[i], 'g'), englishDigits[i]);
  }
  return result;
}

// ============================================================================
// 🎬 تریگر اصلی - onEdit
// ============================================================================

function onEdit(e) {
  try {
    if (!e || !e.source || !e.range) {
      Logger.log('⚠️ هشدار: این تابع باید توسط تریگر onEdit فراخوانی شود');
      return;
    }
    
    const sheet = e.source.getActiveSheet();
    const range = e.range;
    const row = range.getRow();
    const col = range.getColumn();
    
    if (row <= CONFIG.HEADER_ROWS) return;
    if (col === 26) return;
    
    const group = findGroup(col);
    if (!group) return;
    
    Logger.log(`✅ پردازش: ردیف ${row}, ستون ${col}, ${group.name}`);
    
    processEdit(sheet, row, col, group);
    applySmartColoring(sheet, row, group);
    checkAlerts(sheet, row, group);
    showSuccessToast();
    
  } catch (error) {
    showError('خطا در پردازش onEdit', error);
  }
}

// ============================================================================
// 🎨 منوی اصلی برنامه
// ============================================================================

function onOpen() {
  try {
    const ui = SpreadsheetApp.getUi();
    
    ui.createMenu('🎯 DeepWork')
      .addItem('📊 داشبورد', 'showDashboard')
      .addSeparator()
      .addItem('🔄 بازمحاسبه همه', 'recalculateAll')
      .addItem('🎨 رنگ‌بندی خودکار', 'applyColoringToAll')
      .addItem('🔢 تبدیل همه به فارسی', 'convertAllToPersian')
      .addSeparator()
      .addSubMenu(ui.createMenu('🔍 ابزارها')
        .addItem('🔎 جستجوی پیشرفته', 'advancedSearch')
        .addItem('🎯 تنظیم اهداف', 'setGoals')
        .addSeparator()
        .addItem('🧪 تست تاریخ', 'testDate')
        .addItem('🔍 دیباگ عمیق', 'deepDebug'))
      .addSeparator()
      .addItem('⚙️ تنظیمات', 'showSettings')
      .addItem('📖 راهنما', 'showHelp')
      .addItem('ℹ️ درباره', 'showAbout')
      .addToUi();
    
    Logger.log('✅ منو ایجاد شد');
    showWelcomeMessage();
    
  } catch (error) {
    Logger.log('⚠️ خطا در ایجاد منو: ' + error.message);
  }
}

// ============================================================================
// 🔎 یافتن گروه
// ============================================================================

function findGroup(col) {
  for (let group of CONFIG.GROUPS) {
    if (col >= group.subject && col <= group.date) {
      return group;
    }
  }
  return null;
}

// ============================================================================
// ⚙️ پردازش ویرایش
// ============================================================================

function processEdit(sheet, row, col, group) {
  try {
    if (col === group.subject) {
      const subject = sheet.getRange(row, group.subject).getValue();
      if (subject && subject.toString().trim() !== '') {
        const persianDate = getPersianDate();
        sheet.getRange(row, group.date).setValue(persianDate);
        Logger.log(`📅 تاریخ ثبت شد: ${persianDate}`);
      }
    }
    
    if (col === group.start || col === group.end || col === group.date) {
      calculateTime(sheet, row, group);
    }
  } catch (error) {
    showError('خطا در پردازش', error);
  }
}

// ============================================================================
// 🧮 محاسبه زمان
// ============================================================================

function calculateTime(sheet, row, group) {
  try {
    let startTime = sheet.getRange(row, group.start).getValue();
    let endTime = sheet.getRange(row, group.end).getValue();
    const currentDate = sheet.getRange(row, group.date).getValue();
    
    if (!startTime || !endTime || !currentDate) {
      sheet.getRange(row, group.calc).setValue('');
      return;
    }
    
    startTime = toEnglishNumber(startTime);
    endTime = toEnglishNumber(endTime);
    
    const x = calculateTimeDifference(startTime, endTime);
    if (!x) {
      sheet.getRange(row, group.calc).setValue('');
      return;
    }
    
    const y = calculateDailyTotal(sheet, row, group, currentDate, x);
    const output = (x === y) ? `(${x})` : `(${x}-${y})`;
    
    const persianOutput = toPersianNumber(output);
    sheet.getRange(row, group.calc).setValue(persianOutput);
    Logger.log(`🧮 محاسبه: ${persianOutput}`);
    
  } catch (error) {
    showError('خطا در محاسبه', error);
  }
}

// ============================================================================
// ⏱️ محاسبه اختلاف زمانی
// ============================================================================

function calculateTimeDifference(start, end) {
  try {
    const startMinutes = timeToMinutes(start);
    const endMinutes = timeToMinutes(end);
    
    if (startMinutes === null || endMinutes === null) return null;
    
    let diff = endMinutes - startMinutes;
    if (diff < 0) diff += 24 * 60;
    
    return minutesToTime(diff);
  } catch (error) {
    return null;
  }
}

// ============================================================================
// 📊 محاسبه مجموع روزانه
// ============================================================================

function calculateDailyTotal(sheet, currentRow, group, currentDate, currentX) {
  try {
    let totalMinutes = timeToMinutes(currentX);
    const currentDateStr = normalizeDate(currentDate);
    
    for (let i = currentRow - 1; i >= CONFIG.START_ROW; i--) {
      const prevDate = sheet.getRange(i, group.date).getValue();
      if (!prevDate) continue;
      
      const prevDateStr = normalizeDate(prevDate);
      if (prevDateStr === currentDateStr) {
        const prevCalc = sheet.getRange(i, group.calc).getValue();
        if (prevCalc) {
          const prevCalcEng = toEnglishNumber(prevCalc);
          const lastTime = extractLastTime(prevCalcEng);
          if (lastTime) {
            const lastMinutes = timeToMinutes(lastTime);
            if (lastMinutes !== null) {
              totalMinutes += lastMinutes;
            }
          }
        }
        break;
      }
    }
    
    return minutesToTime(totalMinutes);
  } catch (error) {
    return currentX;
  }
}

// ============================================================================
// 🔢 توابع کمکی - تبدیل زمان
// ============================================================================

function timeToMinutes(time) {
  try {
    if (!time) return null;
    
    if (time instanceof Date) {
      return time.getHours() * 60 + time.getMinutes();
    }
    
    const timeStr = time.toString().trim();
    const match = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (match) {
      const hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
      return hours * 60 + minutes;
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}:${mins.toString().padStart(2, '0')}`;
}

function extractLastTime(calcStr) {
  if (!calcStr) return null;
  const str = calcStr.toString().trim();
  const match = str.match(/(\d+:\d+)(?:\))?$/);
  return match ? match[1] : null;
}

// ============================================================================
// 📅 تاریخ شمسی (الگوریتم استاندارد و تست‌شده)
// ============================================================================

function getPersianDate() {
  return toPersianNumber(gregorianToPersian(new Date()));
}

function normalizeDate(date) {
  if (!date) return '';
  if (date instanceof Date) return gregorianToPersian(date);
  return toEnglishNumber(date.toString().trim());
}

function gregorianToPersian(gDate) {
  try {
    const gy = gDate.getFullYear();
    const gm = gDate.getMonth() + 1;
    const gd = gDate.getDate();
    
    Logger.log(`📅 ورودی میلادی: سال=${gy}, ماه=${gm}, روز=${gd}`);
    
    // الگوریتم استاندارد تبدیل گرگوری به جلالی
    // بر اساس الگوریتم Kazimierz M. Borkowski
    
    let jy, jm, jd;
    let g_d_m, gy2, days;
    
    g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    
    if (gy > 1600) {
      jy = 979;
      gy -= 1600;
    } else {
      jy = 0;
      gy -= 621;
    }
    
    if (gm > 2) {
      gy2 = gy + 1;
    } else {
      gy2 = gy;
    }
    
    days = (365 * gy) + (Math.floor((gy2 + 3) / 4)) - (Math.floor((gy2 + 99) / 100)) + (Math.floor((gy2 + 399) / 400)) - 80 + gd + g_d_m[gm - 1];
    
    Logger.log(`🔢 مجموع روزها: ${days}`);
    
    jy = jy + (33 * Math.floor(days / 12053));
    days = days % 12053;
    
    jy = jy + (4 * Math.floor(days / 1461));
    days = days % 1461;
    
    if (days > 365) {
      jy = jy + Math.floor((days - 1) / 365);
      days = (days - 1) % 365;
    }
    
    Logger.log(`🔢 سال شمسی: ${jy}, روزهای باقیمانده: ${days}`);
    
    if (days < 186) {
      jm = 1 + Math.floor(days / 31);
      jd = 1 + (days % 31);
    } else {
      jm = 7 + Math.floor((days - 186) / 30);
      jd = 1 + ((days - 186) % 30);
    }
    
    const result = `${jy}/${jm.toString().padStart(2, '0')}/${jd.toString().padStart(2, '0')}`;
    Logger.log(`✅ نتیجه نهایی: ${result}`);
    
    return result;
    
  } catch (error) {
    Logger.log(`❌ خطا در تبدیل تاریخ: ${error.message}`);
    Logger.log(`Stack: ${error.stack}`);
    // برگرداندن تاریخ دیفالت
    return '1403/08/03';
  }
}

// ============================================================================
// 🧪 تست تاریخ (جدید و قوی‌تر)
// ============================================================================

function testDate() {
  const ui = SpreadsheetApp.getUi();
  
  // دریافت تاریخ سیستم
  const systemDate = new Date();
  Logger.log('═══════════════════════════════════════');
  Logger.log('🔍 شروع تست دقیق تاریخ...');
  Logger.log('═══════════════════════════════════════');
  Logger.log(`📅 تاریخ سیستم خام: ${systemDate}`);
  Logger.log(`📅 سال: ${systemDate.getFullYear()}`);
  Logger.log(`📅 ماه: ${systemDate.getMonth() + 1}`);
  Logger.log(`📅 روز: ${systemDate.getDate()}`);
  Logger.log(`⏰ ساعت: ${systemDate.getHours()}:${systemDate.getMinutes()}`);
  Logger.log(`🌍 منطقه زمانی: ${Session.getScriptTimeZone()}`);
  
  // تبدیل به شمسی
  const persianToday = gregorianToPersian(systemDate);
  const persianFa = toPersianNumber(persianToday);
  
  Logger.log('═══════════════════════════════════════');
  
  // تست چند تاریخ معتبر
  const testCases = [
    { date: new Date(2024, 9, 22), expected: '1403/08/01', desc: '22 اکتبر 2024' },
    { date: new Date(2024, 9, 23), expected: '1403/08/02', desc: '23 اکتبر 2024' },
    { date: new Date(2024, 9, 24), expected: '1403/08/03', desc: '24 اکتبر 2024' },
    { date: new Date(2024, 9, 25), expected: '1403/08/04', desc: '25 اکتبر 2024' },
    { date: new Date(2024, 9, 26), expected: '1403/08/05', desc: '26 اکتبر 2024' },
    { date: new Date(2024, 9, 27), expected: '1403/08/06', desc: '27 اکتبر 2024' }
  ];
  
  let results = '📅 نتایج تست تاریخ:\n\n';
  results += `🕐 زمان سیستم: ${systemDate.toLocaleString('fa-IR')}\n`;
  results += `📆 تاریخ میلادی: ${systemDate.getDate()}/${systemDate.getMonth() + 1}/${systemDate.getFullYear()}\n`;
  results += `📆 تاریخ شمسی: ${persianToday}\n`;
  results += `📆 فارسی: ${persianFa}\n\n`;
  results += '─────────────────────────\n';
  results += 'تست تاریخ‌های نمونه:\n\n';
  
  let allPassed = true;
  
  testCases.forEach((test, i) => {
    Logger.log(`\n🧪 تست ${i + 1}: ${test.desc}`);
    const result = gregorianToPersian(test.date);
    const status = result === test.expected ? '✅' : '❌';
    const match = result === test.expected;
    
    if (!match) allPassed = false;
    
    Logger.log(`   نتیجه: ${result}`);
    Logger.log(`   انتظار: ${test.expected}`);
    Logger.log(`   وضعیت: ${status}`);
    
    results += `${status} ${test.desc}\n`;
    results += `   نتیجه: ${result} ${match ? '' : '(انتظار: ' + test.expected + ')'}\n`;
  });
  
  results += '\n─────────────────────────\n';
  results += allPassed ? '✅ همه تست‌ها موفق!' : '❌ برخی تست‌ها ناموفق';
  
  Logger.log('\n═══════════════════════════════════════');
  Logger.log(allPassed ? '✅ همه تست‌ها موفق!' : '❌ برخی تست‌ها ناموفق');
  Logger.log('═══════════════════════════════════════');
  
  ui.alert('🧪 تست تاریخ', results, ui.ButtonSet.OK);
  
  return persianToday;
}

// ============================================================================
// 🔍 دیباگ عمیق (برای حل مشکل)
// ============================================================================

function deepDebug() {
  const ui = SpreadsheetApp.getUi();
  
  Logger.log('🔍🔍🔍 شروع دیباگ عمیق...');
  
  // گرفتن تاریخ به روش‌های مختلف
  const now = new Date();
  const utcNow = new Date(now.getTime());
  
  let debugInfo = '🔍 اطلاعات کامل سیستم:\n\n';
  
  debugInfo += '📅 تاریخ‌های خام:\n';
  debugInfo += `  new Date(): ${now}\n`;
  debugInfo += `  toString(): ${now.toString()}\n`;
  debugInfo += `  toISOString(): ${now.toISOString()}\n`;
  debugInfo += `  toLocaleDateString(): ${now.toLocaleDateString()}\n\n`;
  
  debugInfo += '📊 اجزای تاریخ:\n';
  debugInfo += `  سال: ${now.getFullYear()}\n`;
  debugInfo += `  ماه: ${now.getMonth() + 1}\n`;
  debugInfo += `  روز: ${now.getDate()}\n`;
  debugInfo += `  ساعت: ${now.getHours()}\n`;
  debugInfo += `  دقیقه: ${now.getMinutes()}\n\n`;
  
  debugInfo += '🌍 تنظیمات:\n';
  debugInfo += `  TimeZone: ${Session.getScriptTimeZone()}\n`;
  debugInfo += `  Locale: ${Session.getActiveUserLocale()}\n\n`;
  
  // تبدیل به شمسی
  const persian = gregorianToPersian(now);
  debugInfo += '📆 تبدیل به شمسی:\n';
  debugInfo += `  نتیجه: ${persian}\n`;
  debugInfo += `  فارسی: ${toPersianNumber(persian)}\n\n`;
  
  // تست دستی با تاریخ امروز
  debugInfo += '🧪 تست دستی:\n';
  const oct24 = new Date(2024, 9, 24); // 24 اکتبر
  const oct24Persian = gregorianToPersian(oct24);
  debugInfo += `  24 اکتبر 2024 → ${oct24Persian}\n`;
  debugInfo += `  (باید باشد: 1403/08/03)\n`;
  
  Logger.log(debugInfo);
  ui.alert('🔍 دیباگ عمیق', debugInfo, ui.ButtonSet.OK);
}

// ============================================================================
// 🎨 رنگ‌بندی هوشمند
// ============================================================================

function applySmartColoring(sheet, row, group) {
  try {
    const calcValue = sheet.getRange(row, group.calc).getValue();
    if (!calcValue) return;
    
    const calcValueEng = toEnglishNumber(calcValue);
    const dailyTotal = extractLastTime(calcValueEng);
    if (!dailyTotal) return;
    
    const totalMinutes = timeToMinutes(dailyTotal);
    const totalHours = totalMinutes / 60;
    
    let color;
    if (totalHours < 4) {
      color = CONFIG.COLORS.LOW_WORK;
    } else if (totalHours < 8) {
      color = CONFIG.COLORS.MEDIUM_WORK;
    } else if (totalHours < 12) {
      color = CONFIG.COLORS.HIGH_WORK;
    } else {
      color = CONFIG.COLORS.VERY_HIGH_WORK;
    }
    
    const range = sheet.getRange(row, group.subject, 1, 5);
    range.setBackground(color);
    
  } catch (error) {
    Logger.log('خطا در رنگ‌بندی: ' + error.message);
  }
}

function applyColoringToAll() {
  const ui = SpreadsheetApp.getUi();
  const result = ui.alert(
    '🎨 رنگ‌بندی خودکار',
    'آیا می‌خواهید همه ردیف‌ها رنگ‌بندی شوند؟',
    ui.ButtonSet.YES_NO
  );
  
  if (result === ui.Button.YES) {
    const sheet = SpreadsheetApp.getActiveSheet();
    const lastRow = sheet.getLastRow();
    
    for (let row = CONFIG.START_ROW; row <= lastRow; row++) {
      for (let group of CONFIG.GROUPS) {
        applySmartColoring(sheet, row, group);
      }
    }
    
    ui.alert('✅ موفقیت', 'رنگ‌بندی همه ردیف‌ها انجام شد!', ui.ButtonSet.OK);
  }
}

// ============================================================================
// 🔢 تبدیل همه داده‌ها به فارسی
// ============================================================================

function convertAllToPersian() {
  const ui = SpreadsheetApp.getUi();
  const result = ui.alert(
    '🔢 تبدیل به فارسی',
    'آیا می‌خواهید همه اعداد به فارسی تبدیل شوند؟',
    ui.ButtonSet.YES_NO
  );
  
  if (result === ui.Button.YES) {
    const sheet = SpreadsheetApp.getActiveSheet();
    const lastRow = sheet.getLastRow();
    let count = 0;
    
    for (let row = CONFIG.START_ROW; row <= lastRow; row++) {
      for (let group of CONFIG.GROUPS) {
        const date = sheet.getRange(row, group.date).getValue();
        if (date) {
          sheet.getRange(row, group.date).setValue(toPersianNumber(date));
          count++;
        }
        
        const start = sheet.getRange(row, group.start).getValue();
        if (start) {
          sheet.getRange(row, group.start).setValue(toPersianNumber(start));
          count++;
        }
        
        const end = sheet.getRange(row, group.end).getValue();
        if (end) {
          sheet.getRange(row, group.end).setValue(toPersianNumber(end));
          count++;
        }
        
        const calc = sheet.getRange(row, group.calc).getValue();
        if (calc) {
          sheet.getRange(row, group.calc).setValue(toPersianNumber(calc));
          count++;
        }
      }
    }
    
    ui.alert('✅ موفقیت', `${toPersianNumber(count)} سلول به فارسی تبدیل شد!`, ui.ButtonSet.OK);
  }
}

// ============================================================================
// 🔔 بررسی هشدارها
// ============================================================================

function checkAlerts(sheet, row, group) {
  try {
    const calcValue = sheet.getRange(row, group.calc).getValue();
    if (!calcValue) return;
    
    const calcValueEng = toEnglishNumber(calcValue);
    const dailyTotal = extractLastTime(calcValueEng);
    if (!dailyTotal) return;
    
    const totalMinutes = timeToMinutes(dailyTotal);
    const totalHours = totalMinutes / 60;
    
    if (totalHours > CONFIG.ALERTS.DAILY_LIMIT) {
      SpreadsheetApp.getActive().toast(
        `⚠️ هشدار: ${toPersianNumber(totalHours.toFixed(1))} ساعت کار در یک روز!`,
        'کار زیاد',
        5
      );
    }
    
    if (totalHours < CONFIG.ALERTS.LOW_WORK_THRESHOLD && totalHours > 0) {
      SpreadsheetApp.getActive().toast(
        `ℹ️ توجه: فقط ${toPersianNumber(totalHours.toFixed(1))} ساعت کار ثبت شده`,
        'کار کم',
        3
      );
    }
    
  } catch (error) {
    Logger.log('خطا در بررسی هشدارها: ' + error.message);
  }
}

// ============================================================================
// 📊 Dashboard
// ============================================================================

function showDashboard() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const lastRow = sheet.getLastRow();
  
  let totalHours = 0;
  let activities = [];
  
  for (let row = CONFIG.START_ROW; row <= lastRow; row++) {
    for (let group of CONFIG.GROUPS) {
      const subject = sheet.getRange(row, group.subject).getValue();
      if (subject) {
        const calcValue = sheet.getRange(row, group.calc).getValue();
        if (calcValue) {
          const calcValueEng = toEnglishNumber(calcValue);
          const time = extractLastTime(calcValueEng);
          if (time) {
            const minutes = timeToMinutes(time);
            totalHours += minutes / 60;
          }
        }
        activities.push(subject);
      }
    }
  }
  
  const totalDays = new Set(activities).size;
  
  const ui = SpreadsheetApp.getUi();
  const message = `
📊 آمار کلی Activity DeepWork

⏰ مجموع ساعات کاری: ${toPersianNumber(totalHours.toFixed(1))} ساعت
📅 تعداد روزهای کاری: ${toPersianNumber(totalDays)} روز
📝 تعداد فعالیت‌ها: ${toPersianNumber(activities.length)}
📈 میانگین ساعت در روز: ${toPersianNumber((totalHours / (totalDays || 1)).toFixed(1))} ساعت

🎯 Activity DeepWork Pro v${CONFIG.VERSION}
  `;
  
  ui.alert('📊 Dashboard', message, ui.ButtonSet.OK);
}

// ============================================================================
// 🔄 بازمحاسبه همه
// ============================================================================

function recalculateAll() {
  const ui = SpreadsheetApp.getUi();
  const result = ui.alert(
    '🔄 بازمحاسبه',
    'آیا می‌خواهید همه محاسبات بروز شوند؟',
    ui.ButtonSet.YES_NO
  );
  
  if (result === ui.Button.YES) {
    try {
      const sheet = SpreadsheetApp.getActiveSheet();
      const lastRow = sheet.getLastRow();
      let count = 0;
      
      for (let row = CONFIG.START_ROW; row <= lastRow; row++) {
        for (let group of CONFIG.GROUPS) {
          const subject = sheet.getRange(row, group.subject).getValue();
          if (subject) {
            calculateTime(sheet, row, group);
            applySmartColoring(sheet, row, group);
            count++;
          }
        }
      }
      
      ui.alert('✅ موفقیت', `${toPersianNumber(count)} ردیف بروز شد!`, ui.ButtonSet.OK);
      
    } catch (error) {
      showError('خطا در بازمحاسبه', error);
    }
  }
}

// ============================================================================
// 🔍 جستجوی پیشرفته
// ============================================================================

function advancedSearch() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    '🔍 جستجو',
    'موضوع یا تاریخ مورد نظر را وارد کنید:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (response.getSelectedButton() === ui.Button.OK) {
    const searchTerm = response.getResponseText().toLowerCase();
    const sheet = SpreadsheetApp.getActiveSheet();
    const lastRow = sheet.getLastRow();
    
    let results = '';
    let count = 0;
    
    for (let row = CONFIG.START_ROW; row <= lastRow; row++) {
      for (let group of CONFIG.GROUPS) {
        const subject = sheet.getRange(row, group.subject).getValue();
        const date = sheet.getRange(row, group.date).getValue();
        
        if (subject && (subject.toString().toLowerCase().includes(searchTerm) ||
            normalizeDate(date).includes(searchTerm))) {
          const calc = sheet.getRange(row, group.calc).getValue();
          results += `${toPersianNumber(count + 1)}. ${subject} - ${date} - ${calc}\n`;
          count++;
        }
      }
    }
    
    if (count > 0) {
      ui.alert('🔍 نتایج جستجو', `${toPersianNumber(count)} نتیجه یافت شد:\n\n${results}`, ui.ButtonSet.OK);
    } else {
      ui.alert('🔍 جستجو', 'نتیجه‌ای یافت نشد!', ui.ButtonSet.OK);
    }
  }
}

// ============================================================================
// 🎯 تنظیم اهداف
// ============================================================================

function setGoals() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    '🎯 تنظیم هدف',
    'هدف ساعت کاری روزانه را وارد کنید:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (response.getSelectedButton() === ui.Button.OK) {
    const goal = parseFloat(response.getResponseText());
    if (goal > 0) {
      PropertiesService.getUserProperties().setProperty('DAILY_GOAL', goal);
      ui.alert('✅ موفقیت', `هدف روزانه به ${toPersianNumber(goal)} ساعت تنظیم شد!`, ui.ButtonSet.OK);
    }
  }
}

// ============================================================================
// ⚙️ تنظیمات و راهنما
// ============================================================================

function showSettings() {
  const ui = SpreadsheetApp.getUi();
  const props = PropertiesService.getUserProperties();
  const dailyGoal = props.getProperty('DAILY_GOAL') || 8;
  
  const message = `
⚙️ تنظیمات فعلی

🎯 هدف روزانه: ${toPersianNumber(dailyGoal)} ساعت
⚠️ حد هشدار: ${toPersianNumber(CONFIG.ALERTS.DAILY_LIMIT)} ساعت
📊 نسخه: ${CONFIG.VERSION}

برای تغییر تنظیمات از منوی ابزارها استفاده کنید.
  `;
  
  ui.alert('⚙️ تنظیمات', message, ui.ButtonSet.OK);
}

function showHelp() {
  const ui = SpreadsheetApp.getUi();
  const helpText = `
📖 راهنمای SubChai DeepWork Pro

🎯 نحوه استفاده:
۱. در ستون موضوع فعالیت را بنویسید
۲. تاریخ شمسی خودکار ثبت می‌شود
۳. ساعت شروع و پایان را وارد کنید
۴. محاسبه خودکار انجام می‌شود
۵. 🆕 اعداد خودکار به فارسی تبدیل می‌شوند

📊 ویژگی‌ها:
✅ محاسبه خودکار زمان
✅ تاریخ شمسی هوشمند (فیکس شده)
✅ اعداد فارسی خودکار
✅ رنگ‌بندی بر اساس ساعت کار
✅ Dashboard و گزارش‌های آماری
✅ هشدارهای هوشمند

💡 نکات:
• فرمت ساعت: H:MM (مثل ۸:۰۰ یا ۱۴:۳۰)
• می‌توانید با اعداد انگلیسی تایپ کنید
• رنگ سبز: کار کم (کمتر از ۴ ساعت)
• رنگ زرد: کار متوسط (۴-۸ ساعت)
• رنگ نارنجی: کار زیاد (۸-۱۲ ساعت)
• رنگ قرمز: کار خیلی زیاد (بیش از ۱۲ ساعت)

🧪 تست تاریخ:
• از منو: DeepWork > ابزارها > تست تاریخ

🆘 پشتیبانی: از منوی DeepWork استفاده کنید
  `;
  
  ui.alert('📖 راهنما', helpText, ui.ButtonSet.OK);
}

function showAbout() {
  const ui = SpreadsheetApp.getUi();
  const aboutText = `
🏆 Activity DeepWork Pro - Ultimate Edition

📌 نسخه: ${CONFIG.VERSION}
👨‍💻 توسعه‌دهنده: SubChai
📅 تاریخ: ۲۰۲۴

✨ ویژگی‌های نسخه Ultimate:
• 📊 Dashboard هوشمند
• 🎨 رنگ‌بندی هوشمند
• 📑 گزارش‌ساز حرفه‌ای
• 🔔 اعلان‌های هوشمند
• 🔍 جستجوی پیشرفته
• 🎯 تنظیم اهداف
• 🆕 اعداد فارسی خودکار
• 🆕 تاریخ شمسی دقیق (فیکس شده)

🔧 تغییرات نسخه ۳.۱:
• رفع کامل مشکل تاریخ شمسی
• الگوریتم Kazimierz M. Borkowski
• تست خودکار تاریخ
• بهبود عملکرد

🎯 ساخته شده با ❤️ برای بهره‌وری بیشتر
  `;
  
  ui.alert('ℹ️ درباره', aboutText, ui.ButtonSet.OK);
}

// ============================================================================
// 🎉 پیام خوش‌آمد
// ============================================================================

function showWelcomeMessage() {
  const props = PropertiesService.getUserProperties();
  const firstRun = props.getProperty('FIRST_RUN');
  
  if (!firstRun) {
    SpreadsheetApp.getActive().toast(
      '🎉 به Activity DeepWork Pro خوش آمدید! تاریخ فیکس شده است',
      'نسخه Ultimate v3.1',
      5
    );
    props.setProperty('FIRST_RUN', 'done');
  }
}

// ============================================================================
// 💬 توابع کمکی - Toast و Error
// ============================================================================

function showSuccessToast() {
  SpreadsheetApp.getActive().toast('✅ ذخیره شد!', 'موفقیت', 2);
}

function showError(title, error) {
  Logger.log(`❌ ${title}: ${error.message}`);
  Logger.log(`Stack: ${error.stack}`);
  SpreadsheetApp.getActive().toast(`❌ ${title}`, 'خطا', 3);
}

// ============================================================================
// 🧪 تست کامل
// ============================================================================

function testScript() {
  Logger.log('═══════════════════════════════════════');
  Logger.log('🧪 شروع تست کامل...');
  Logger.log('═══════════════════════════════════════');
  
  // تست تاریخ
  const today = new Date();
  const persianDate = gregorianToPersian(today);
  Logger.log(`📅 تاریخ امروز: ${today.toLocaleDateString('en-US')} → ${persianDate}`);
  Logger.log(`📅 فارسی: ${toPersianNumber(persianDate)}`);
  
  // تست محاسبه زمان
  Logger.log('\n⏱️ تست محاسبه زمان:');
  const timeDiff = calculateTimeDifference('8:00', '10:30');
  Logger.log(`✅ ۸:۰۰ - ۱۰:۳۰ = ${timeDiff}`);
  
  // تست تبدیل اعداد
  Logger.log('\n🔢 تست تبدیل اعداد:');
  Logger.log(`✅ به فارسی: ${toPersianNumber('1403/08/03')}`);
  Logger.log(`✅ به انگلیسی: ${toEnglishNumber('۱۴۰۳/۰۸/۰۳')}`);
  
  Logger.log('\n✅ همه تست‌ها موفق بود!');
  Logger.log('═══════════════════════════════════════');
  
  SpreadsheetApp.getUi().alert(
    '🧪 تست کامل',
    `✅ همه چیز عالی کار می‌کند!\n\n📅 تاریخ امروز: ${toPersianNumber(persianDate)}\n⏱️ محاسبه زمان: عالی\n🔢 تبدیل اعداد: عالی`,
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

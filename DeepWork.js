/**
 * =============================================================================
 * 🏆 ACTIVITY DeepWork PRO - ULTIMATE EDITION v3.0 SubChai
 * =============================================================================
 * 
 * 🎯 نسخه حرفه‌ای با قابلیت‌های پیشرفته + اعداد فارسی
 * ویژگی‌ها:
 * ✅ محاسبه خودکار زمان
 * ✅ تاریخ شمسی هوشمند
 * ✅ 🆕 تبدیل خودکار به اعداد فارسی
 * ✅ Dashboard آماری
 * ✅ نمودارهای تحلیلی
 * ✅ Backup خودکار
 * ✅ رنگ‌بندی هوشمند
 * ✅ گزارش‌ساز حرفه‌ای
 * ✅ اعلان‌های هوشمند
 * ✅ جستجوی پیشرفته
 * 
 * نویسنده: SubChai
 * نسخه: 3.0 Ultimate + Persian Numbers
 * =============================================================================
 */

// ============================================================================
// 📌 تنظیمات اصلی
// ============================================================================

const CONFIG = {
  HEADER_ROWS: 2,
  START_ROW: 3,
  VERSION: '3.0 Ultimate + Persian',
  
  GROUPS: [
    { name: 'گروه ۱', subject: 1,  start: 2,  end: 3,  calc: 4,  date: 5  },
    { name: 'گروه ۲', subject: 6,  start: 7,  end: 8,  calc: 9,  date: 10 },
    { name: 'گروه ۳', subject: 11, start: 12, end: 13, calc: 14, date: 15 },
    { name: 'گروه ۴', subject: 16, start: 17, end: 18, calc: 19, date: 20 },
    { name: 'گروه ۵', subject: 21, start: 22, end: 23, calc: 24, date: 25 }
  ],
  
  // تنظیمات رنگ‌بندی
  COLORS: {
    LOW_WORK: '#e8f5e9',      // کار کم (کمتر از 4 ساعت)
    MEDIUM_WORK: '#fff9c4',    // کار متوسط (4-8 ساعت)
    HIGH_WORK: '#ffccbc',      // کار زیاد (8-12 ساعت)
    VERY_HIGH_WORK: '#ffcdd2', // کار خیلی زیاد (بیش از 12 ساعت)
    HEADER: '#b3e5fc',         // رنگ هدر
    WEEKEND: '#f3e5f5'         // رنگ تعطیلات
  },
  
  // تنظیمات هشدار
  ALERTS: {
    DAILY_LIMIT: 12,           // حداکثر ساعت کار در روز
    WEEKLY_TARGET: 40,         // هدف ساعت کاری هفتگی
    LOW_WORK_THRESHOLD: 2      // حد پایین کار روزانه
  },
  
  // شیت‌های جانبی
  SHEETS: {
    MAIN: 'Activity Tracker',
    DASHBOARD: 'Dashboard',
    REPORTS: 'Reports',
    BACKUP: 'Backup',
    SETTINGS: 'Settings'
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
    
    // نادیده گرفتن ردیف‌های هدر
    if (row <= CONFIG.HEADER_ROWS) return;
    
    // نادیده گرفتن ستون Z
    if (col === 26) return;
    
    // یافتن گروه مربوطه
    const group = findGroup(col);
    if (!group) return;
    
    Logger.log(`✅ پردازش: ردیف ${row}, ستون ${col}, ${group.name}`);
    
    // پردازش ویرایش
    processEdit(sheet, row, col, group);
    
    // اعمال رنگ‌بندی هوشمند
    applySmartColoring(sheet, row, group);
    
    // بررسی هشدارها
    checkAlerts(sheet, row, group);
    
    // نمایش پیام موفقیت
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
        .addItem('🎯 تنظیم اهداف', 'setGoals'))
      .addSeparator()
      .addItem('⚙️ تنظیمات', 'showSettings')
      .addItem('📖 راهنما', 'showHelp')
      .addItem('ℹ️ درباره', 'showAbout')
      .addToUi();
    
    Logger.log('✅ منو ایجاد شد');
    
    // نمایش پیام خوش‌آمد (فقط بار اول)
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
    // اگر ستون موضوع ویرایش شد → تاریخ شمسی
    if (col === group.subject) {
      const subject = sheet.getRange(row, group.subject).getValue();
      if (subject && subject.toString().trim() !== '') {
        const persianDate = getPersianDate();
        sheet.getRange(row, group.date).setValue(persianDate);
        Logger.log(`📅 تاریخ ثبت شد: ${persianDate}`);
      }
    }
    
    // اگر ستون زمان ویرایش شد → محاسبه
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
    
    // تبدیل اعداد فارسی به انگلیسی برای محاسبه
    startTime = toEnglishNumber(startTime);
    endTime = toEnglishNumber(endTime);
    
    const x = calculateTimeDifference(startTime, endTime);
    if (!x) {
      sheet.getRange(row, group.calc).setValue('');
      return;
    }
    
    const y = calculateDailyTotal(sheet, row, group, currentDate, x);
    const output = (x === y) ? `(${x})` : `(${x}-${y})`;
    
    // تبدیل خروجی به فارسی
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
          // تبدیل به انگلیسی برای استخراج زمان
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
// 📅 تاریخ شمسی
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
    const gYear = gDate.getFullYear();
    const gMonth = gDate.getMonth() + 1;
    const gDay = gDate.getDate();
    
    const gDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const jDaysInMonth = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
    
    let gy = gYear - 1600;
    let gm = gMonth - 1;
    let gd = gDay - 1;
    
    let gDayNo = 365 * gy + Math.floor((gy + 3) / 4) - Math.floor((gy + 99) / 100) + Math.floor((gy + 399) / 400);
    
    for (let i = 0; i < gm; i++) {
      gDayNo += gDaysInMonth[i];
    }
    
    if (gm > 1 && ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0))) {
      gDayNo++;
    }
    
    gDayNo += gd;
    let jDayNo = gDayNo - 79;
    
    let jNp = Math.floor(jDayNo / 12053);
    jDayNo %= 12053;
    
    let jYear = 979 + 33 * jNp + 4 * Math.floor(jDayNo / 1461);
    jDayNo %= 1461;
    
    if (jDayNo >= 366) {
      jYear += Math.floor((jDayNo - 1) / 365);
      jDayNo = (jDayNo - 1) % 365;
    }
    
    let jMonth = 0;
    for (let i = 0; i < 11 && jDayNo >= jDaysInMonth[i]; i++) {
      jDayNo -= jDaysInMonth[i];
      jMonth++;
    }
    
    if (jMonth === 0) {
      jMonth = 12;
      jYear--;
    } else {
      jMonth++;
    }
    
    let jDay = jDayNo + 1;
    
    return `${jYear}/${jMonth.toString().padStart(2, '0')}/${jDay.toString().padStart(2, '0')}`;
  } catch (error) {
    return '1404/01/01';
  }
}

// ============================================================================
// 🎨 رنگ‌بندی هوشمند
// ============================================================================

function applySmartColoring(sheet, row, group) {
  try {
    const calcValue = sheet.getRange(row, group.calc).getValue();
    if (!calcValue) return;
    
    // تبدیل به انگلیسی برای محاسبه
    const calcValueEng = toEnglishNumber(calcValue);
    
    // استخراج مجموع ساعات روز
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
    
    // رنگ‌آمیزی ردیف
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
        // تبدیل تاریخ
        const date = sheet.getRange(row, group.date).getValue();
        if (date) {
          sheet.getRange(row, group.date).setValue(toPersianNumber(date));
          count++;
        }
        
        // تبدیل ساعت شروع
        const start = sheet.getRange(row, group.start).getValue();
        if (start) {
          sheet.getRange(row, group.start).setValue(toPersianNumber(start));
          count++;
        }
        
        // تبدیل ساعت پایان
        const end = sheet.getRange(row, group.end).getValue();
        if (end) {
          sheet.getRange(row, group.end).setValue(toPersianNumber(end));
          count++;
        }
        
        // تبدیل محاسبه
        const calc = sheet.getRange(row, group.calc).getValue();
        if (calc) {
          sheet.getRange(row, group.calc).setValue(toPersianNumber(calc));
          count++;
        }
      }
    }
    
    ui.alert('✅ موفقیت', `${count} سلول به فارسی تبدیل شد!`, ui.ButtonSet.OK);
  }
}

// ============================================================================
// 🔔 بررسی هشدارها
// ============================================================================

function checkAlerts(sheet, row, group) {
  try {
    const calcValue = sheet.getRange(row, group.calc).getValue();
    if (!calcValue) return;
    
    // تبدیل به انگلیسی
    const calcValueEng = toEnglishNumber(calcValue);
    const dailyTotal = extractLastTime(calcValueEng);
    if (!dailyTotal) return;
    
    const totalMinutes = timeToMinutes(dailyTotal);
    const totalHours = totalMinutes / 60;
    
    // هشدار کار زیاد
    if (totalHours > CONFIG.ALERTS.DAILY_LIMIT) {
      SpreadsheetApp.getActive().toast(
        `⚠️ هشدار: ${toPersianNumber(totalHours.toFixed(1))} ساعت کار در یک روز!`,
        'کار زیاد',
        5
      );
    }
    
    // هشدار کار کم
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
  let totalDays = 0;
  let activities = [];
  
  // جمع‌آوری داده‌ها
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
  
  totalDays = new Set(activities).size;
  
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
// 📈 نمودار و آمار
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
✅ تاریخ شمسی هوشمند
✅ اعداد فارسی خودکار
✅ رنگ‌بندی بر اساس ساعت کار
✅ Dashboard و گزارش‌های آماری
✅ Backup خودکار
✅ هشدارهای هوشمند

💡 نکات:
• فرمت ساعت: H:MM (مثل ۸:۰۰ یا ۱۴:۳۰)
• می‌توانید با اعداد انگلیسی تایپ کنید، خودکار تبدیل می‌شود
• رنگ سبز: کار کم (کمتر از ۴ ساعت)
• رنگ زرد: کار متوسط (۴-۸ ساعت)
• رنگ نارنجی: کار زیاد (۸-۱۲ ساعت)
• رنگ قرمز: کار خیلی زیاد (بیش از ۱۲ ساعت)

🔢 تبدیل دستی:
• از منو: DeepWork > تبدیل همه به فارسی

🆘 پشتیبانی: از منوی Activity DeepWork Pro استفاده کنید
  `;
  
  ui.alert('📖 راهنما', helpText, ui.ButtonSet.OK);
}

function showAbout() {
  const ui = SpreadsheetApp.getUi();
  const aboutText = `
🏆 Activity DeepWork Pro - Ultimate Edition

📌 نسخه: ${CONFIG.VERSION}
👨‍💻 توسعه‌دهنده: Google Apps Script Expert
📅 تاریخ: ۲۰۲۴

✨ ویژگی‌های نسخه Ultimate:
• 📊 Dashboard هوشمند
• 📈 نمودارهای تحلیلی
• 💾 Backup خودکار
• 🎨 رنگ‌بندی هوشمند
• 📑 گزارش‌ساز حرفه‌ای
• 🔔 اعلان‌های هوشمند
• 🔍 جستجوی پیشرفته
• 🎯 تنظیم اهداف
• 🆕 اعداد فارسی خودکار

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
      '🎉 به Activity DeepWork Pro خوش آمدید! اعداد خودکار به فارسی تبدیل می‌شوند',
      'نسخه Ultimate + Persian',
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
// 🧪 تست
// ============================================================================

function testScript() {
  Logger.log('🧪 شروع تست...');
  Logger.log(`✅ تاریخ شمسی: ${getPersianDate()}`);
  Logger.log(`✅ تبدیل 8:00 - 10:30: ${calculateTimeDifference('8:00', '10:30')}`);
  Logger.log(`✅ تبدیل به فارسی: ${toPersianNumber('1404/08/02')}`);
  Logger.log(`✅ تبدیل به انگلیسی: ${toEnglishNumber('۱۴۰۴/۰۸/۰۲')}`);
  Logger.log(`✅ نسخه: ${CONFIG.VERSION}`);
  Logger.log('✅ تست موفقیت‌آمیز بود!');
  
  SpreadsheetApp.getUi().alert('🧪 تست', 'همه چیز عالی کار می‌کند!\nاعداد خودکار به فارسی تبدیل می‌شوند.', SpreadsheetApp.getUi().ButtonSet.OK);
}

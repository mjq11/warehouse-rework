// Google Apps Script - 仓库拆检数据接收
// 部署为 Web 应用后，将 URL 填入 HTML 页面

function doPost(e) {
  const sheet = getOrCreateSheet();
  const data = JSON.parse(e.postData.contents);
  
  // 表头字段顺序（必须与 HTML 提交顺序一致）
  const headers = [
    '序号', '退货物流单号', '实收SKU', '实收数量', 
    '拆检日期', '拆检开始时间', '拆检结束时间', '拆检工时', 
    '拆检结果', '包装辅料消耗SKU', '入库配件拆检SKU',
    '录入人', '提交时间'
  ];
  
  // 逐行写入
  data.rows.forEach(row => {
    const rowData = [
      row.index,
      row.tracking,
      row.sku,
      row.qty,
      row.date,
      row.startTime,
      row.endTime,
      row.spent,
      row.status,
      row.accessory,
      row.extracted,
      data.coworker,
      data.submitTime
    ];
    sheet.appendRow(rowData);
  });
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: '提交成功！共 ' + data.rows.length + ' 条记录',
    rows: data.rows.length
  })).setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('拆检数据');
  if (!sheet) {
    sheet = ss.insertSheet('拆检数据');
    // 写入表头
    const headers = [
      '序号', '退货物流单号', '实收SKU', '实收数量', 
      '拆检日期', '拆检开始时间', '拆检结束时间', '拆检工时', 
      '拆检结果', '包装辅料消耗SKU', '入库配件拆检SKU',
      '录入人', '提交时间'
    ];
    sheet.appendRow(headers);
    // 设置表头样式
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  return sheet;
}

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: '仓库拆检数据接收服务运行中'
  })).setMimeType(ContentService.MimeType.JSON);
}

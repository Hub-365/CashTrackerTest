import { CONFIG } from "./config.js";

// Excel のベース URL
const urlBase =
  `${CONFIG.graphBase}/${CONFIG.excelFolder}/${CONFIG.excelFile}.xlsx:/workbook/tables/${CONFIG.tableName}`;

// ------------------------------
// 複数行送信（メイン）
// ------------------------------
export async function submitEntries(rows) {
  const token = sessionStorage.getItem("access_token");
  if (!token) return false;

  // Excel の列名を取得
  const columns = await getExcelColumns(token);

  // rows（配列の配列）を Excel の列順にマッピング
  const mappedRows = rows.map(r => {
    const dataObj = {
      date: r[0],
      credit: r[1],
      debit: r[2],
      amount: r[3],
      real: r[4],
      note: r[5]
    };
    return mapDataToColumns(columns, dataObj);
  });

  const endpoint = `${urlBase}/rows/add`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ values: mappedRows })
  });

  return res.ok;
}


// ------------------------------
// Excel の列名を取得
// ------------------------------
async function getExcelColumns(token) {
  const url = `${urlBase}/columns`;

  const res = await fetch(url, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const json = await res.json();
  return json.value.map(col => col.name);
}

// ------------------------------
// 列名に合わせてデータを整形（大文字小文字無視）
// ------------------------------
function mapDataToColumns(columns, data) {
  const lowerData = {};
  for (const key in data) {
    lowerData[key.toLowerCase()] = data[key];
  }

  return columns.map(colName => {
    const lowerCol = colName.toLowerCase();
    return lowerData[lowerCol] !== undefined ? lowerData[lowerCol] : null;
  });
}

function mapDataToColumns2(columns, data) {
  // data が配列ならそのまま返す（列数チェックだけする）
  if (Array.isArray(data)) {
    if (data.length !== columns.length) {
      console.error("列数が一致しません:", data.length, columns.length);
    }
    return data;
  }

  // data がオブジェクトなら従来通りマッピング
  const lowerData = {};
  for (const key in data) {
    lowerData[key.toLowerCase()] = data[key];
  }

  return columns.map(colName => {
    const lowerCol = colName.toLowerCase();
    return lowerData[lowerCol] !== undefined ? lowerData[lowerCol] : null;
  });
}

// ------------------------------
// 単一行追加（必要な場合のみ使用）
// ------------------------------
export async function addRowToExcel(data) {
  const token = sessionStorage.getItem("access_token");
  if (!token) {
    alert("ログインしてください");
    return false;
  }

  const columns = await getExcelColumns(token);
  console.log("Excel Columns:", columns);
  const row = mapDataToColumns(columns, data);
  console.log("Mapped Row:", row);

  const url = `${urlBase}/rows/add`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ values: [row] })
  });

  const json = await res.json();
  console.log("Graph API Response:", json);

  if (!res.ok) {
    console.error(await res.text());
    alert("送信に失敗しました");
    return false;
  }else{
    alert("送信成功!");
  }

  return true;
}

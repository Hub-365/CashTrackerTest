const excelFolder = "Apps";
const excelFile = "Book";
const excelTable = "t_record";

const urlBase =
  `https://graph.microsoft.com/v1.0/me/drive/root:/${excelFolder}/${excelFile}.xlsx:/workbook/tables/${excelTable}`;

// Excel の列名を取得
async function getExcelColumns(token) {
  const url = `${urlBase}/columns`;

  const res = await fetch(url, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const json = await res.json();
  return json.value.map(col => col.name);
}

// 列名に合わせてデータを整形（大文字小文字無視）
function mapDataToColumns(columns, data) {
  // data のキーを全部小文字化
  const lowerData = {};
  for (const key in data) {
    lowerData[key.toLowerCase()] = data[key];
  }

  // Excel の列名に合わせて値を並べる
  return columns.map(colName => {
    const lowerCol = colName.toLowerCase();
    return lowerData[lowerCol] ?? "";
  });
}

// Excel に行を追加
async function addRowToExcel(token, data) {
  // ① Excel の列名を取得
  const columns = await getExcelColumns(token);
  console.log("Excel Columns:", columns);

  // ② 列名に合わせてデータを整形
  const row = mapDataToColumns(columns, data);
  console.log("Mapped Row:", row);

  // ③ 行追加 API
  const url = `${urlBase}/rows/add`;

  const body = { values: [row] };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const json = await res.json();
  console.log("Graph API Response:", json);

  return json;
}

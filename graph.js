const excelFolder = "Apps";
const excelFile = "Book";
const excelTable = "t_record";

async function addRowToExcel(token, data) {
  const url =
    `https://graph.microsoft.com/v1.0/me/drive/root:/${excelFolder}/${excelFile}.xlsx:/workbook/tables/${excelTable}/rows/add`;

  const body = {
    values: [
      [data.name, data.email, data.message]
    ]
  };

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

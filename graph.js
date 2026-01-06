async function addRowToExcel(token, data) {
  const url = "https://graph.microsoft.com/v1.0/me/drive/root:/Apps/Book.xlsx:/workbook/tables/t_record/rows/add
";

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

  return res.json();
}

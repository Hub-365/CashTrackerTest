export async function setupEntryBlock(block) {
  // ▼ 勘定科目読み込み
  const res = await fetch("./data/toa.json");
  const toa = await res.json();

  // const creditList = [...toa.shared, ...toa.credit];
  const creditList = [...toa.credit, ...toa.shared];
  const debitList = [...toa.shared, ...toa.debit];

  fill(block.querySelector(".credit"), creditList);
  fill(block.querySelector(".debit"), debitList);

  // ▼ 今日の日付をセット
  const today = new Date().toISOString().split("T")[0];

  const dateInput = block.querySelector(".date-input");
  dateInput.value = today;

  const [y, m, d] = today.split("-");
  block.querySelector(".date-display").textContent = `${y}/${m}/${d}`;
}

function fill(select, list) {
  select.innerHTML = "";
  list.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item;
    opt.textContent = item;
    select.appendChild(opt);
  });
}

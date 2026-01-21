import { setupEntryBlock } from "./ui_setup.js";
import { submitEntries } from "./graph.js";
import { ensureLogin } from "./auth.js";

async function loadTemplate() {
  const res = await fetch("./templates/entry.html");
  const html = await res.text();

  const wrapper = document.createElement("div");
  wrapper.innerHTML = html.trim();

  // link タグをスキップして .block を返す
  return wrapper.querySelector(".block");
}

window.addEventListener("DOMContentLoaded", async () => {
  await addEntryBlock();
});

export async function addEntryBlock() {
  const block = await loadTemplate();
  await setupEntryBlock(block);

  block.querySelector(".remove-btn").onclick = () => block.remove();

  document.getElementById("entries").appendChild(block);
}

document.getElementById("addEntry").onclick = async () => {
  await addEntryBlock();
};

// ▼ 送信
document.getElementById("submit").addEventListener("click", async () => {
  if (!validateBlocks()) return;

  if (!navigator.onLine) {
    saveToQueue(data);
    return;
  }

  if (!ensureLogin()) {
    // login() にリダイレクトされるのでここには戻らない
    return;
  }

  try {
    const blocks = document.querySelectorAll("#entries .block");
    const rows = [];
  
    blocks.forEach(block => {
      rows.push([
        block.querySelector(".date-input").value,
        block.querySelector(".credit").value,
        block.querySelector(".debit").value,
        Number(block.querySelector(".amount").value),
        Number(block.querySelector(".real").value),
        block.querySelector(".note").value
      ]);
    });

    const ok = await submitEntries(rows);

    if (ok) {
      document.getElementById("entries").innerHTML = "";
      await addEntryBlock();
      alert("送信しました");
    }
  } catch (e) {
    saveToQueue(data);
  }
});

// ▼ 赤枠バリデーション
function validateBlocks() {
  let valid = true;

  document.querySelectorAll(".block").forEach(block => {
    block.querySelectorAll("input, select").forEach(input => {
      input.classList.remove("input-error");

      if (input.hasAttribute("required") && !input.value.trim()) {
        input.classList.add("input-error");
        valid = false;
      }
    });
  });

  return valid;
}

// ▼ 入力したら赤枠解除
document.addEventListener("input", e => {
  if (e.target.classList.contains("input-error")) {
    e.target.classList.remove("input-error");
  }
});

// ▼ カレンダーを開く
document.addEventListener("click", e => {
  if (e.target.closest(".date-picker-btn")) {
    const block = e.target.closest(".block");
    block.querySelector(".date-input").showPicker();
  }
});

// ▼ 日付選択 → 表示更新
document.addEventListener("input", e => {
  if (e.target.classList.contains("date-input")) {
    const raw = e.target.value;
    if (!raw) return;

    const [y, m, d] = raw.split("-");
    const formatted = `${y}/${m}/${d}`;

    e.target.closest(".block").querySelector(".date-display").textContent = formatted;
  }
});

const data = window.WLK_BIS_DATA;

const el = {
  phase: document.querySelector("#phaseSelect"),
  size: document.querySelector("#sizeSelect"),
  difficulty: document.querySelector("#difficultySelect"),
  className: document.querySelector("#classSelect"),
  spec: document.querySelector("#specSelect"),
  search: document.querySelector("#searchInput"),
  results: document.querySelector("#results"),
  resultTitle: document.querySelector("#resultTitle"),
  phaseLabel: document.querySelector("#phaseLabel"),
  bossCount: document.querySelector("#bossCount"),
  itemCount: document.querySelector("#itemCount"),
  notice: document.querySelector("#notice"),
  copy: document.querySelector("#copyButton"),
  note: document.querySelector("#data-note"),
};

const phaseLabel = {
  P1: "P1 纳克萨玛斯 / 永恒之眼 / 黑曜石圣殿",
  P2: "P2 奥杜尔",
  P3: "P3 十字军的试炼 / 奥妮克希亚",
  P4: "P4 冰冠堡垒 / 晶红圣殿",
};

const phases = [
  { value: "P1", label: "P1 - 纳克萨玛斯 / 永恒之眼 / 黑曜石圣殿 / 宝库" },
  { value: "P2", label: "P2 - 奥杜尔 / 宝库" },
  { value: "P3", label: "P3 - 十字军的试炼 / 奥妮克希亚 / 宝库" },
  { value: "P4", label: "P4 - 冰冠堡垒 / 晶红圣殿 / 宝库" },
];

function option(value, label = value) {
  const node = document.createElement("option");
  node.value = value;
  node.textContent = label;
  return node;
}

function iconUrl(icon) {
  if (!icon) return "";
  return `https://wow.zamimg.com/images/wow/icons/large/${icon}.jpg`;
}

function normalize(text) {
  return String(text || "").toLowerCase().trim();
}

function matchesDifficulty(record, selected) {
  if (selected === "全部") return true;
  if (record.difficulty === selected) return true;
  return selected === "普通" && record.difficulty === "未标注";
}

function matchesSize(record, selected) {
  if (selected === "全部") return true;
  return record.sizes.includes(selected);
}

function groupByRaid(records) {
  const map = new Map();
  for (const record of records) {
    const key = record.raid;
    if (!map.has(key)) {
      map.set(key, { raid: record.raid, items: [] });
    }
    map.get(key).items.push(record);
  }
  return [...map.values()].sort((a, b) => a.raid.localeCompare(b.raid, "zh"));
}

function groupByBoss(records) {
  const map = new Map();
  for (const record of records) {
    const key = `${record.boss.type}:${record.boss.id}:${record.boss.zh}`;
    if (!map.has(key)) {
      map.set(key, { boss: record.boss, items: [] });
    }
    map.get(key).items.push(record);
  }
  return [...map.values()].sort((a, b) => {
    if (a.boss.id === "other") return 1;
    if (b.boss.id === "other") return -1;
    return a.boss.zh.localeCompare(b.boss.zh, "zh");
  });
}

function uniqueByItem(records) {
  const seen = new Set();
  const out = [];
  for (const record of records) {
    const key = `${record.itemId}:${record.slot}:${record.boss.id}:${record.source}:${record.location}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(record);
  }
  return out;
}

function populate() {
  el.note.textContent = `${data.meta.recordCount} 条 BIS 记录`;
  for (const phase of phases) {
    el.phase.append(option(phase.value, phase.label));
  }
  for (const cls of data.classes) {
    el.className.append(option(cls.name));
  }
  el.phase.value = "P4";
  el.className.value = data.classes[0]?.name || "";
  updateSpecOptions();
}

function updateSpecOptions() {
  const cls = data.classes.find((item) => item.name === el.className.value);
  const current = el.spec.value;
  el.spec.replaceChildren();
  for (const spec of cls?.specs || []) {
    el.spec.append(option(spec));
  }
  if ([...(cls?.specs || [])].includes(current)) {
    el.spec.value = current;
  }
}

function filterRecords() {
  const q = normalize(el.search.value);
  return uniqueByItem(
    data.records.filter((record) => {
      if (record.phase !== el.phase.value) return false;
      if (record.class !== el.className.value) return false;
      if (record.spec !== el.spec.value) return false;
      if (!matchesSize(record, el.size.value)) return false;
      if (!matchesDifficulty(record, el.difficulty.value)) return false;
      if (!q) return true;
      const haystack = normalize(
        [
          record.boss.zh,
          record.boss.en,
          record.itemName,
          record.itemNameZh,
          record.slot,
          record.itemType,
          record.source,
          record.location,
        ].join(" "),
      );
      return haystack.includes(q);
    }),
  );
}

function renderStats(record) {
  if (!record.stats.length) {
    return "";
  }
  const stats = record.stats
    .slice(0, 8)
    .map((stat) => `<span class="stat">+${escapeHtml(stat.value)} ${escapeHtml(stat.label)}</span>`)
    .join("");
  return `<div class="stats">${stats}</div>`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderItem(record) {
  const name = record.itemNameZh || record.itemName;
  const subName = record.itemNameZh ? record.itemName : "";
  const slotLabel = record.itemType === "盾牌" ? "盾牌" : record.itemType ? `${record.slot} · ${record.itemType}` : record.slot;
  const sizes = record.sizes.filter((size) => size !== "未标注").join(" / ") || "人数未标注";
  const difficulty = record.difficulty === "未标注" ? "普通/未标注" : record.difficulty;
  const icon = iconUrl(record.icon);
  return `
    <article class="item-row">
      <img class="icon" src="${escapeHtml(icon)}" alt="" loading="lazy" />
      <div class="item-main">
        <a class="item-name" href="${escapeHtml(record.itemUrl)}" target="_blank" rel="noreferrer">${escapeHtml(name)}</a>
        <span class="item-id">#${escapeHtml(record.itemId)}</span>
        ${subName ? `<div class="meta">${escapeHtml(subName)}</div>` : ""}
        <div class="meta">${escapeHtml(sizes)} · ${escapeHtml(difficulty)}</div>
        ${renderStats(record)}
      </div>
      <div class="item-slot">
        <span class="slot-pill">${escapeHtml(slotLabel)}</span>
      </div>
      <div class="source">
        <div>${escapeHtml(record.source || "来源未标注")}</div>
        <div class="meta">${escapeHtml(record.location || "地点未标注")}</div>
      </div>
    </article>
  `;
}

function render() {
  const records = filterRecords();
  const raidGroups = groupByRaid(records);
  const bossCount = raidGroups.reduce((total, group) => total + groupByBoss(group.items).length, 0);
  el.resultTitle.textContent = `${el.phase.value} · ${el.className.value}${el.spec.value}`;
  el.phaseLabel.textContent = phaseLabel[el.phase.value] || el.phase.value;
  el.bossCount.textContent = bossCount;
  el.itemCount.textContent = records.length;
  el.notice.textContent =
    records.length > 0
      ? `${el.size.value} / ${el.difficulty.value} · 已严格按人数筛选；普通包含未标注英雄的普通掉落。`
      : "当前条件没有匹配到 BIS 装备。";

  if (!records.length) {
    el.results.innerHTML = `<div class="empty-state">没有匹配结果。</div>`;
    return;
  }

  el.results.innerHTML = raidGroups
    .map((raidGroup) => {
      const bossSections = groupByBoss(raidGroup.items)
        .map((group) => {
          const en =
            group.boss.en && group.boss.en !== group.boss.zh ? `<span>${escapeHtml(group.boss.en)}</span>` : "";
          const items = group.items
            .sort((a, b) => a.slot.localeCompare(b.slot, "zh") || a.itemName.localeCompare(b.itemName))
            .map(renderItem)
            .join("");
          return `
            <section class="boss-group">
              <header class="boss-header">
                <div class="boss-title">
                  <h3>${escapeHtml(group.boss.zh)}</h3>
                  ${en}
                </div>
                <div class="boss-count">${group.items.length} 件</div>
              </header>
              <div class="item-list">${items}</div>
            </section>
          `;
        })
        .join("");
      return `
        <section class="raid-section">
          <header class="raid-header">
            <h3>${escapeHtml(raidGroup.raid)}</h3>
            <span>${raidGroup.items.length} 件 BIS</span>
          </header>
          ${bossSections}
        </section>
      `;
    })
    .join("");
}

function copyList() {
  const records = filterRecords();
  const lines = [`${el.phase.value} ${el.size.value} ${el.difficulty.value} - ${el.className.value}${el.spec.value}`];
  for (const raidGroup of groupByRaid(records)) {
    lines.push(`\n=== ${raidGroup.raid} ===`);
    for (const group of groupByBoss(raidGroup.items)) {
      lines.push(`\n[${group.boss.zh}]`);
      for (const item of group.items) {
        lines.push(`- ${item.slot}: ${item.itemName} (#${item.itemId})`);
      }
    }
  }
  navigator.clipboard?.writeText(lines.join("\n"));
  el.copy.textContent = "已复制";
  window.setTimeout(() => {
    el.copy.textContent = "复制清单";
  }, 1200);
}

populate();
render();

el.phase.addEventListener("change", render);
el.size.addEventListener("change", render);
el.difficulty.addEventListener("change", render);
el.className.addEventListener("change", () => {
  updateSpecOptions();
  render();
});
el.spec.addEventListener("change", render);
el.search.addEventListener("input", render);
el.copy.addEventListener("click", copyList);

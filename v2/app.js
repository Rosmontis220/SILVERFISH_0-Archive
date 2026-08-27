(() => {
  const articles = window.WIKI_ARTICLES || [];
  const article = document.querySelector("#article");
  const navigation = document.querySelector("#navigation");
  const toc = document.querySelector("#toc");
  const search = document.querySelector("#search");
  const sidebar = document.querySelector("#sidebar");
  const navToggle = document.querySelector("#nav-toggle");
  const homeLink = document.querySelector("#home-link");

  const byId = new Map(articles.map((item) => [item.id, item]));
  const groups = articles.reduce((map, item) => {
    if (!map.has(item.group)) map.set(item.group, []);
    map.get(item.group).push(item);
    return map;
  }, new Map());

  const escapeHtml = (text) => text.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  })[char]);

  function renderNavigation(activeId = "") {
    navigation.innerHTML = [...groups.entries()].map(([group, items]) => `
      <section class="nav-group">
        <h2>${escapeHtml(group)}</h2>
        ${items.map((item) => `<button class="nav-item ${item.id === activeId ? "active" : ""}" data-id="${item.id}">${escapeHtml(item.title)}</button>`).join("")}
      </section>
    `).join("");
  }

  function renderToc() {
    const headings = [...article.querySelectorAll("h2, h3")];
    if (!headings.length) { toc.innerHTML = ""; return; }
    toc.innerHTML = `<h2>本页目录</h2>${headings.map((heading, index) => {
      if (!heading.id) heading.id = `section-${index + 1}`;
      return `<a class="level-${heading.tagName === "H3" ? 3 : 2}" href="#${heading.id}" data-section="${heading.id}">${escapeHtml(heading.textContent)}</a>`;
    }).join("")}`;
  }

  function openArticle(id, updateHistory = true) {
    const item = byId.get(id);
    if (!item) return renderHome(updateHistory);
    article.innerHTML = `<header class="article-header"><h1>${escapeHtml(item.title)}</h1><p class="article-summary">${escapeHtml(item.summary)}</p></header>${item.html}`;
    renderNavigation(id);
    renderToc();
    if (updateHistory) history.pushState({ id }, "", `#/${id}`);
    sidebar.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    document.title = `${item.title}｜雾后札记`;
    window.scrollTo({ top: 0 });
    article.focus({ preventScroll: true });
  }

  function renderHome(updateHistory = true) {
    const featured = articles.filter((item) => item.featured);
    article.innerHTML = `
      <header class="article-header"><p class="eyebrow">SILVERFISH_0 / PERSONAL DRAFT</p><h1>雾后札记</h1><p class="article-summary">我把仍能复核的东西放在这里。它不是档案馆，不是公报，也不保证我的判断全部正确。</p></header>
      <div class="status-note"><strong>给后来者</strong>事实、推断和直觉已尽量分开。缺页不是网站故障；有些材料我没有，有些材料我暂时不公开。</div>
      <h2 id="quick-start">先读这些</h2>
      <div class="home-grid">${featured.map((item) => `<button class="home-card" data-id="${item.id}"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.summary)}</span></button>`).join("")}</div>
      <h2 id="current-state">我现在相信的事</h2>
      <p>有人正在借文件、录像和游戏存档向外搬运因果。它不需要把一个完整的人送过来，只要让两边在同一个问题上作出相同选择。我可能就是这次搬运留下的误差。</p>
    `;
    renderNavigation("");
    renderToc();
    if (updateHistory) history.pushState({}, "", location.pathname);
    document.title = "雾后札记";
    window.scrollTo({ top: 0 });
  }

  function renderSearch(query) {
    const needle = query.trim().toLocaleLowerCase("zh-CN");
    if (!needle) return renderHome(false);
    const results = articles.filter((item) => `${item.title} ${item.summary} ${item.text}`.toLocaleLowerCase("zh-CN").includes(needle));
    article.innerHTML = `<header class="article-header"><h1>搜索结果</h1><p class="article-summary">“${escapeHtml(query)}”共找到 ${results.length} 篇条目。</p></header>${results.length ? `<div class="home-grid">${results.map((item) => `<button class="home-card" data-id="${item.id}"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.summary)}</span></button>`).join("")}</div>` : `<p class="search-empty">没有匹配内容。可尝试角色名、锚点、平台编号或术语。</p>`}`;
    toc.innerHTML = "";
  }

  document.addEventListener("click", (event) => {
    const section = event.target.closest("[data-section]");
    if (section) {
      event.preventDefault();
      document.getElementById(section.dataset.section)?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    const target = event.target.closest("[data-id]");
    if (target) openArticle(target.dataset.id);
  });
  search.addEventListener("input", () => renderSearch(search.value));
  homeLink.addEventListener("click", () => { search.value = ""; renderHome(); });
  navToggle.addEventListener("click", () => {
    const open = sidebar.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  window.addEventListener("popstate", () => {
    const id = location.hash.startsWith("#/") ? location.hash.slice(2) : "";
    if (id && byId.has(id)) openArticle(id, false); else renderHome(false);
  });

  const initialId = location.hash.startsWith("#/") ? location.hash.slice(2) : "";
  if (initialId && byId.has(initialId)) openArticle(initialId, false); else renderHome(false);
})();

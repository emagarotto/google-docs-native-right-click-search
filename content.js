const MENU_ITEM_ID = "custom-google-docs-search-item";

function triggerDocsCopy() {
  // Method 1: Programmatically click Google Docs' own Copy menu item
  const menuItems = document.querySelectorAll(".goog-menuitem");
  for (const item of menuItems) {
    if (item.id === MENU_ITEM_ID) continue;
    const labelEl = item.querySelector(".goog-menuitem-label");
    const text = (labelEl ? labelEl.textContent : item.textContent || "").trim();
    if (text === "Copy" || text.startsWith("Copy\n") || text.startsWith("Copy⌘") || text.startsWith("CopyCtrl")) {
      const target = item.querySelector(".goog-menuitem-content") || item;
      const rect = target.getBoundingClientRect();
      const opts = {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: rect.left + 5,
        clientY: rect.top + 5
      };
      target.dispatchEvent(new MouseEvent("mousedown", opts));
      target.dispatchEvent(new MouseEvent("mouseup", opts));
      target.dispatchEvent(new MouseEvent("click", opts));
      return true;
    }
  }

  // Method 2: Fallback to hidden texteventtarget iframe
  const iframe = document.querySelector(".docs-texteventtarget-iframe");
  if (iframe && iframe.contentDocument) {
    iframe.contentDocument.execCommand("copy");
    return true;
  }

  document.execCommand("copy");
  return false;
}

function createSearchMenuItem() {
  const item = document.createElement("div");
  item.id = MENU_ITEM_ID;
  item.className = "goog-menuitem apps-menuitem";
  item.setAttribute("role", "menuitem");
  item.style.userSelect = "none";

  const content = document.createElement("div");
  content.className = "goog-menuitem-content";

  // Add a clean magnifying glass SVG matching Google Docs icon spacing
  const iconWrap = document.createElement("div");
  iconWrap.className = "goog-menuitem-icon";
  iconWrap.style.display = "inline-flex";
  iconWrap.style.alignItems = "center";
  iconWrap.style.justifyContent = "center";
  iconWrap.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="#5f6368"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`;

  const label = document.createElement("span");
  label.className = "goog-menuitem-label";
  label.textContent = "Search Google for selection";

  content.appendChild(iconWrap);
  content.appendChild(label);
  item.appendChild(content);

  item.addEventListener("mouseenter", () => {
    item.classList.add("goog-menuitem-highlight");
  });
  item.addEventListener("mouseleave", () => {
    item.classList.remove("goog-menuitem-highlight");
  });

  // Use mousedown so we trigger copy BEFORE Google Docs closes/destroys the context menu
  item.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();

    triggerDocsCopy();

    setTimeout(async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          const url = `https://www.google.com/search?q=${encodeURIComponent(text.trim())}`;
          window.open(url, "_blank", "noopener,noreferrer");
        } else {
          console.warn("Google Docs Search: Clipboard was empty after copy.");
        }
      } catch (err) {
        console.error("Google Docs Search: Clipboard read failed.", err);
      }
    }, 150);
  });

  return item;
}

function injectIntoMenu(menu) {
  if (!menu || menu.querySelector(`#${MENU_ITEM_ID}`)) return;

  // Verify this is the right-click context menu containing Copy or Define
  const text = menu.textContent || "";
  if (!text.includes("Copy") && !text.includes("Cut") && !text.includes("Paste")) {
    return;
  }

  const searchItem = createSearchMenuItem();
  const items = Array.from(menu.querySelectorAll(".goog-menuitem"));
  const copyItem = items.find((el) => (el.textContent || "").trim().startsWith("Copy"));

  if (copyItem && copyItem.parentNode) {
    copyItem.parentNode.insertBefore(searchItem, copyItem.nextSibling);
  } else {
    menu.insertBefore(searchItem, menu.firstChild);
  }
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType !== Node.ELEMENT_NODE) continue;
      if (node.classList && node.classList.contains("goog-menu")) {
        injectIntoMenu(node);
      } else if (node.querySelectorAll) {
        node.querySelectorAll(".goog-menu").forEach(injectIntoMenu);
      }
    }
    if (
      mutation.type === "attributes" &&
      mutation.target.classList &&
      mutation.target.classList.contains("goog-menu")
    ) {
      injectIntoMenu(mutation.target);
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ["style", "class"]
});

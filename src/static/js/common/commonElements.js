export function createButton(text) {
  return createElement("button", null, text);
}
//Great to know this!. We duplicated the navbar in our code, but we can use something like this too.
export function createHeader() {
  const a = createElement("a", null, "Shortr");
  a.href = "/";
  const h1 = createElement("h1", null, null, [a]);

  const buttonCreate = createElement("Button", "showWhenLoggedIn", "Create");
  buttonCreate.addEventListener(
    "click",
    () => (window.location.href = `/link.html?create=true`)
  );

  const buttonLogin = createElement("Button", "hideWhenLoggedIn", "Login");
  buttonLogin.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = `/login.html?redirect=${window.location}`;
  });

  const buttonLogout = createElement("Button", "showWhenLoggedIn", "Logout");
  buttonLogout.addEventListener("click", (event) => {
    event.preventDefault();
    window.localStorage.clear();
    window.location.reload();
  });

  const controls = createElement("div", "controls", null, [
    buttonCreate,
    buttonLogin,
    buttonLogout,
  ]);
  return createElement("header", "header", null, [h1, controls]);
}

export function createFooter() {
  return createElement(
    "footer",
    "footer",
    "Created by Jianhao Zhou and Yuanxun Qin"
  );
}

export function createMainContent() {
  return createElement("main", "content");
}

export function createSection(title) {
  const h2 = createElement("h2", "sectionTitle", title);
  return createElement("section", "section", null, [h2]);
}

export function createElement(tagName, className, innerHTML, children) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  if (innerHTML) {
    element.innerHTML = innerHTML;
  }
  if (children) {
    for (const child of children) {
      element.appendChild(child);
    }
  }
  return element;
}

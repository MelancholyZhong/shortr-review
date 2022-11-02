import { createElement } from "./commonElements.js";

// It is so great to learn from you that we can make it a new function that wraps up our http request and it can really save the duplicates of writing headers.
export async function makeHttpRequest(url, method, body) {
  try {
    let res;
    if (!method) {
      method = "GET";
    }
    if (!body) {
      res = await fetch(url, {
        method,
        headers: {
          Accept: "application/json",
        },
      });
    } else {
      res = await fetch(url, {
        method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body,
      });
    }
    if (res.ok && res.status === 200) {
      const data = await res.json();
      if (data.success === true) {
        return data.data;
      }
    }
    console.error("Operation Failed");
    showMessage("Operation Failed");
  } catch (e) {
    console.error("Operation Failed");
    showMessage("Operation Failed");
  }
}

export function getQueryParams() {
  return new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
}

export function getShortUrlFromId(linkId) {
  return `${window.location.origin}/r/${linkId}`;
}

export function showMessage(msg, msgSetter) {
  console.log(msg);
  const messageBox = createElement("div", "messageBox", msg);
  if (msgSetter) {
    msgSetter(messageBox);
  }
  document.querySelector(".content").prepend(messageBox);
  setTimeout(() => {
    messageBox.classList.add("animate");
  });
  setTimeout(() => {
    document.querySelector(".content").removeChild(messageBox);
  }, 5000);
}

export function showConfirmation(
  title,
  message,
  positiveOption,
  negativeOption,
  positiveAction,
  negativeAction
) {
  const overlay = createElement("div", "overlay");
  const dialogTitle = createElement("div", "dialogTitle", title);
  const dialogMessage = createElement("div", "dialogMessage", message);

  const positiveButton = createElement("button", null, positiveOption);
  const negativeButton = createElement(
    "button",
    "negativeButton",
    negativeOption
  );

  const dialogControls = createElement("div", "dialogControls", null, [
    positiveButton,
    negativeButton,
  ]);
  const confirmationDialog = createElement("div", "confirmationDialog", null, [
    dialogTitle,
    dialogMessage,
    dialogControls,
  ]);

  positiveButton.addEventListener("click", (event) => {
    event.preventDefault();
    if (positiveAction) {
      positiveAction();
    }
    document.body.removeChild(confirmationDialog);
    document.body.removeChild(overlay);
  });

  negativeButton.addEventListener("click", (event) => {
    event.preventDefault();
    if (negativeAction) {
      negativeAction();
    }
    document.body.removeChild(confirmationDialog);
    document.body.removeChild(overlay);
  });

  document.body.appendChild(overlay);
  document.body.appendChild(confirmationDialog);
}

export function getCurrentUser() {
  return window.localStorage.getItem("username");
}

export function isLoggedIn() {
  return !!getCurrentUser();
}

// This function is brilliant, by adding a loggedIn class can manage if it showes up.
export function commonSetup() {
  if (isLoggedIn()) {
    document.body.classList.add("loggedIn");
  }
}

export function parseUrl(url) {
  if (url.length === 0) {
    return ["", ""];
  }
  const i = url.indexOf("://");
  const protocol = url.substring(0, i + 3);
  const path = url.substring(i + 3, url.length);
  return [protocol, path];
}

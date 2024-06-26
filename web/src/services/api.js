// api.js

export const register = async (username, password, phone) => {
  const response = await fetch(`https://huush-api.azpekt.dev/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, phone }),
  });
  const data = await response.json();
  return data;
};

export const verify = async (code) => {
  const response = await fetch(`https://huush-api.azpekt.dev/auth/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });
  const data = await response.json();
  return data;
};

export const login = async (username, password) => {
  const response = await fetch(`https://huush-api.azpekt.dev/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  return data;
};

export const validateToken = async (token) => {
  const response = await fetch(`https://huush-api.azpekt.dev/auth/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });
  const data = await response.json();
  return data;
};

export const createChat = async (token, participantId) => {
  const response = await fetch(`https://huush-api.azpekt.dev/chat/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ participants: [participantId] }),
  });
  const data = await response.json();
  return data;
};

export const searchUser = async (username, token) => {
  const response = await fetch(`https://huush-api.azpekt.dev/user/search?query=${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};

export const getChats = async (token) => {
  const response = await fetch(`https://huush-api.azpekt.dev/user/me/chats`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};

export const getChatHistory = async (chatId, token) => {
  const response = await fetch(`https://huush-api.azpekt.dev/chat/${chatId}/history`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};

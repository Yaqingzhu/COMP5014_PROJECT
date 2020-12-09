const apiurl = process.env.API_URL;

export const logOut = () => new Promise((resolve, reject) => {
  window.fetch(`${apiurl}/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
  }).then(res => res.json()).then(res => {
    if (res.loginStatus === -1) {
      resolve();
    } else {
      reject(new Error(res.message));
    }
  });
});

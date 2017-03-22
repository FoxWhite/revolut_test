function checkStatus(response) {
  return new Promise((resolve, reject) => {
    if (response.status < 200 || response.status >= 300) {
      const error = new Error(`${response.status}: ${response.statusText}`);
      reject(error);
    }

    resolve({ response });
  });
}

function parseJson({ response }) {
  return response.json();
}

export {
  checkStatus,
  parseJson,
};
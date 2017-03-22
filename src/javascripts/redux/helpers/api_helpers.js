/**
  * @flow
  */

class StatusError extends Error {
  response: Object;
}

function checkStatus(response): Promise<{ response: Response }> {
  return new Promise((resolve, reject) => {
    if (response.status < 200 || response.status >= 300) {
      const error: StatusError = new StatusError(`${response.status}: ${response.statusText}`);
      error.response = response;

      reject({ error });
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
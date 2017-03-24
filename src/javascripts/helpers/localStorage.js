
const loadLS = (stateName: string) => {
  try {
    const serializedData = localStorage.getItem(stateName);
    if (serializedData === null) {
      return undefined;
    }
    return JSON.parse(serializedData);
  } catch(err) {
    console.warn('localStorage read err: ', err);
    return undefined;
  }
}

const saveLS = (stateName: string, data: {}) => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(stateName, serializedData);
  } catch(err) {
    console.warn('localStorage write err: ',err);
  }
}

export {
  loadLS,
  saveLS,
};
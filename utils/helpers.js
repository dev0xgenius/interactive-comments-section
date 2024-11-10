const generateID = (objArray, usedIDs = new Set([])) => {
  let newID = null; let idExists = false;
  
  do {
    newID = Math.floor(Date.now() / 1000);
  } while (usedIDs.has(newID));

  // Add matching ID into usedIDs 'Set Object' for tracking
  for (const item of objArray) {
    const { id } = item;
    if (Number(id) === newID) {
      idExists = true;
      usedIDs.add(Number(id));
    }
  }
  return (idExists) ? generateID(objArray, usedIDs) : newID;
};

export { generateID };
exports.queryFilter = (filterObj) => {
  const filteredValues = ["page", "limit", "sort"];
  let newFilteredObject = {};
  Object.keys(filterObj).forEach((filter) => {
    if (!filteredValues.includes(filter)) {
      newFilteredObject[filter] = filterObj[filter];
    }
  });

  return newFilteredObject;
};

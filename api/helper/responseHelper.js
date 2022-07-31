exports.successResponse = (...otherResponses) => {
  return {
    status: "Success",
    ...otherResponses[0],
  };
};

exports.failResponse = (...otherResponses) => {
  return {
    status: "Error",
    ...otherResponses[0],
  };
};

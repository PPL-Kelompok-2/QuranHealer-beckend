const h = {
  response(result) {
    return {
      code(codeNum) {
        return {
          code: codeNum,
          result,
        };
      },
    };
  },
};

export default h;

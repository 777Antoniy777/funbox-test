const setEndingWords = (num, cases) => {
  num = Math.abs(num);
  let word = '';

  if (num.toString().indexOf('.') > -1) {
      word = cases.GEN;
  } else {
      word = (
          num % 10 == 1 && num % 100 != 11
              ? cases.NOM
              : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20)
                  ? cases.GEN
                  : cases.PLU
      );
  }

  return word;
};

export {setEndingWords};

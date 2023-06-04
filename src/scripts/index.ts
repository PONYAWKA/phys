import { data } from './phys/index.data';

export const script = `(function () {
  'use strict';
  const data = JSON.parse('${data}');
  const findAnswer = (text, arrayMode) => {
    if (arrayMode) {
      let ArrAnswers = [];
      for (let val of data) {
        if (val.ask == text) {
          ArrAnswers = [...ArrAnswers, [...val.answer]];
        }
      }
      for (let i = 0; i < ArrAnswers.length; i++)
        for (let j = i + 1; j < ArrAnswers.length; j++) {
          {
            if (ArrAnswers[i] == ArrAnswers[j]) {
              ArrAnswers.splice(j, 1);
            }
          }
        }
      return ArrAnswers;
    }
    for (let val of data) {
      if (val.ask == text) {
        if (typeof val.answer == 'string') return val.answer;
        return [...val.answer];
      }
    }
  };

  const removeDuple = (str) => {
    let ans = str[0];

    for (let i = 1; i < str.length; i++) {
      if (str[i] !== str[i - 1]) ans += str[i];
    }
    return ans;
  };

  const getAsk = (askBody) => {
    return formatText(askBody.getElementsByClassName('qtext')[0].textContent);
  };

  const typeFilter = (e, type) => {
    return e.type == type;
  };

  const formatText = (text) => {
    try {
      return text
        .replaceAll(/"/g, '')
        .trim()
        .replace('Ответ', '')
        .replaceAll("'", 'cavi4ka')
        .replaceAll('’', ' ')
        .replaceAll('\n', '')
        .replaceAll('  ', ' ')
        .replaceAll('/', 'slash')
        .replaceAll('\\\\', 'backslash')
        .replace(/\\s/g, '')
        .replaceAll('$', '')
        .replaceAll("<", "Angle")
        .toLowerCase();
    } catch (e) {
      console.error(e);
    }
  };

  const scriptExtract = (node) => formatText(node.querySelector('script'));

  const removeEng = (text) => text.replace(/[^А-яЁё0-9 ]/g, '');
  const isRus = /^[а-яА-Я\s]+$/;

  const removeRus = (text) =>
    text
      .replaceAll(',', '')
      .replaceAll('-', '')
      .replace(/^[А-яё\s\p{P}]+/i, '');

  const multichoice = (e, answer) => {
    let ask;
    ask = formatText(e.getElementsByClassName('flex-fill')[0].textContent);
    let script = e.querySelector('script');
    if (script) ask = formatText(script.textContent);
    console.log(ask);
    try {
      if (answer.includes(ask) || answer[0].includes(ask)) {
        e.childNodes[0].click();
        e.childNodes[1].click();
      }
    } catch (e) {}
  };

  const truefalse = (e, answer) => {
    const input = e.childNodes[0];
    const text = formatText(e.childNodes[1].textContent);
    if (answer?.includes(text)) {
      input.click();
    }
  };

  const match = (variant, answer) => {
    let text = formatText(variant.querySelector('.text')?.textContent);
    let script = variant.querySelectorAll('script');
    if (script.length > 1) {
      text = formatText(
        [...[...script].map((e) => formatText(e.textContent))].join(),
      );
    }
    console.log(text);
    let input = variant.querySelector('select');
    for (let variantOfAnswer of answer) {
      if (variantOfAnswer.ask == text)
        [...input.options].forEach((e) => {
          if (formatText(e.label) == variantOfAnswer.answer) {
            e.setAttribute('selected', 'selected');
          }
        });
    }
  };

  const checkHandler = (askBody) => {
    if (askBody.className.search('multichoice') != -1) {
      let ask = removeDuple(getAsk(askBody));
      console.log(ask);
      let answers = findAnswer(ask, true);
      let variants = askBody.getElementsByClassName('answer')[0].children;
      answers.forEach((answer) =>
        [...variants].forEach((e) => multichoice(e, answer)),
      );
    } else if (askBody.className.search('truefalse') != -1) {
      let ask = getAsk(askBody);
      let answer = findAnswer(ask);
      let variants = askBody.getElementsByClassName('answer')[0].children;
      [...variants].forEach((e) => truefalse(e, answer));
    } else if (askBody.className.search('shortanswer') != -1) {
      let ask = removeEng(
        formatText(askBody.getElementsByClassName('qtext')[0].textContent),
      );
      console.log(ask);
      let answer = findAnswer(ask);
      let answerFields = [...askBody.getElementsByClassName('form-control')];
      answerFields.forEach((e, i) => {
        if (answer) e.setAttribute('value', answer);
      });
    } else if (askBody.className.search('match') != -1) {
      let ask = removeDuple(
        formatText(askBody.getElementsByClassName('qtext')[0].textContent),
      );
      let answers = findAnswer(ask, true);
      let variants =
        askBody.getElementsByClassName('answer')[0].children[0].children;
      console.log(ask);
      try {
        for (let variantofAnswer of answers)
          for (let variant of [...variants]) {
            match(variant, variantofAnswer);
          }
      } catch (e) {
        console.error(e);
      }
    } else if (askBody.className.search('numerical') != -1) {
      let ask = formatText(
        askBody.getElementsByClassName('qtext')[0].textContent,
      );
      let answer = findAnswer(ask);
      let input = askBody.getElementsByClassName('form-control')[0];
      input.value = answer;
    }
  };

  addEventListener('keypress', (event) => {
    if (event.key === '\`') {
      console.log('fine');
      let a = [...document.getElementsByClassName('que')];
      a.forEach(checkHandler);
    }
  });
})()`;

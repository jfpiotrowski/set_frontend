export default class SetCardClassifier {
  static getIndexFromCard(card) {
    let value = 0;
    if (card.filling === 'EMPTY') {
      value = 54;
    } else if (card.filling === 'STRIPED') {
      value = 27;
    }

    if (card.shape === 'OVAL') {
      value += 18;
    } else if (card.shape === 'DIAMOND') {
      value += 9;
    }

    if (card.color === 'GREEN') {
      value += 6;
    } else if (card.color === 'PURPLE') {
      value += 3;
    }

    if (card.count === 'THREE') {
      value += 2;
    } else if (card.count === 'TWO') {
      value += 1;
    }

    return value + 1;
  }
}

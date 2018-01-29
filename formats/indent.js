import Parchment from 'parchment';
import _ from 'underscore';

class IdentAttributor extends Parchment.Attributor.Class {
  add(node, value) {
    if (value === '+1' || value === '-1') {
      let indent = this.value(node) || 0;
      value = (value === '+1' ? (indent + 1) : (indent - 1));
    }
    if (value === 0) {
      this.remove(node);
      return true;
    } else {
      return super.add(node, value);
    }
  }

  canAdd(node, value) {
    return super.canAdd(node, value) || super.canAdd(node, parseInt(value));
  }

  value(node) {
    return parseInt(super.value(node)) || undefined;  // Don't return NaN
  }
}

class IndentStyleAttributor extends Parchment.Attributor.Style{
    add(node, value) {
        // if (value === '+1' ||value === 1 || value === '-1') {
        let plusOne = [1, 16, 31, 46, 61, 76, 91, 106, 121];
        let minusOne = [14, 29, 44, 59, 76, 89, 104, 119, 134];

        if ((_.indexOf(plusOne, value) > -1) || (_.indexOf(minusOne, value) > -1) || value === '+1' || value === '-1') {
            let indent = this.value(node) || 0;
            indent = parseInt(String(indent).replace('px', ''));
            if (node.localName === 'li') {
                if (indent === 0) {
                    indent = 15;
                }
                if (_.indexOf(plusOne, value) > -1) {
                    value = indent + 15;
                } else if (_.indexOf(minusOne, value) > 1) {
                    value = indent - 15;
                } else if (_.indexOf(minusOne, value) <= 1) {
                    value = 0;
                }
            } else {
                value = (value === '-1' ? (indent - 15) : (indent + 15));
            }
        }
        if (value === 0) {
            if (node.localName === 'li') {
                return super.add(node, `15px`);
            }
            this.remove(node);
            return true;
        } else {
            return super.add(node, `${value}px`);
        }
    }
}

let IndentClass = new IdentAttributor('indent', 'ql-indent', {
    scope: Parchment.Scope.BLOCK,
    whitelist: [1, 2, 3, 4, 5, 6, 7, 8]
});

let IndentStyle = new IndentStyleAttributor('indent', 'margin-left', {
    scope: Parchment.Scope.BLOCK,
    whitelist: ['15px', '30px', '45px', '60px', '75px', '90px', '105px', '120px', '135px']
});

export { IndentClass, IndentStyle };

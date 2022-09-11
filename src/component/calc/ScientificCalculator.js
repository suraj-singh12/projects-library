import React from 'react';
import './scientific.css';
import $ from 'jquery';

class ScientificCalculator extends React.Component {
  // calculator js starts here

  expression = '';
  expressionArray = [];
  screenArray = [];
  parentheses = 0;
  ansOnScreen = false;
  ans = null;
  error = false;
  inverted = false;

  // function for clear (AC) button
  defaults = () => {
    this.expression = '';
    this.expressionArray = [];
    this.screenArray = [];
    this.parentheses = 0;
    this.ansOnScreen = false;
    this.ans = null;
    this.error = false;
    this.inverted = false;
    // clear the readings
    $('.result').html('');
    $('.screentext').html('');
    $('.hints').html('');
    console.log('AC button working fine.')
  }

  // on pressing 'Inv' button
  toggleInverted = () => {
    $('.cbfun .inv').toggle();
    this.inverted = this.inverted ? false : true;
  }

  adjustParentheses = (num) => {
    // writes closing parenthesis to hints, when user enters a parenthesis
    // so user does not needs to write
    $('.hints').html(')'.repeat(num));
  }


  writeToScreen = (mode, text) => {
    if (mode === 'append') {
      if (this.error) {
        this.screenArray = [];
      }
      this.error = false;
      // console.log(text);
      this.screenArray.push(text);
      // console.log('this.screenArray: ', this.screenArray);
      // console.log('this.expressionArray: ', this.expressionArray);
    } else if (mode === 'write') {
      this.screenArray = [text];
    } else if (mode === 'delete') {
      var popped = this.screenArray.pop();
      if (/[(]$/g.test(popped)) {   // if the popped item is parenthesis; [].test(popped) returns true if pattern is found in popped item]
        this.parentheses > 0 ? this.parentheses-- : this.parentheses = 0;
        // repeat closing parenthesis given no of times, to match the no of opening ones.
        this.adjustParentheses(this.parentheses);
      }
    }

    // html() method sets or returns the content (innerHTML) of the selected elements.
    // .join('') method makes the screen array into a string
    // eg: [1,2,3] is converted to '123
    $('.screentext').html(this.screenArray.join(''));

    // change the this.inverted to normal if it was   
    if (this.inverted) {
      this.toggleInverted();
    }
  }

  // as soon any value is pressed, add it to this.expression
  addToExpression = (text) => {
    this.expressionArray.push(text);
    this.expression += text;
  }

  // as soon DEL button is pressed, remove the last element from this.expression
  removeFromExpression = () => {
    var count = this.expressionArray.pop().length;
    this.expression = this.expression.slice(0, -count);
  }

  // for enter value (to process results)

  evaluate = () => {

    if (this.ansOnScreen) {  // if this.ans is already there on screen 
      this.expressionArray = [this.ans];
    }

    // add the closing parenthesis to the this.expression as soon enter is pressed
    this.addToExpression(')'.repeat(this.parentheses));
    // console.log(this.expressionArray);

    try {
      Math.eval(this.expressionArray.join('')).toPrecision(8);
    } catch (e) {
      this.error = true;
    }

    if (this.error) {
      this.defaults();
      this.error = true;
      this.writeToScreen('write', 'Syntax Error');
    } else {
      // write the raw text to top level of screen in '#result' div
      $('.result').html($('.screentext').html().replace(/this.ans/, this.ans) + ')'.repeat(this.parentheses) + ' =');

      // evaluate the result
      this.ans = Math.eval(this.expressionArray.join('')).toPrecision(8);
      // console.log(this.expressionArray);

      // write the result
      this.writeToScreen('write', this.ans.toString().replace(/(\.0+$)|(0+$)/g, ''));
      // .replace(/(\.0+$)|(0+$)/g, '') : removes trailing zeros after decimal point with '' 
      // console.log(this.ans, this.ans.toString(), this.ans.toString().replace(/(\.0+$)|(0+$)/g, ''));

      // clear the hints
      $('.hints').html('');

      var el = $('#screentext');
      var newone = el.clone(true);
      // clone() method makes a copy of selected elements, including child nodes, text and attributes.
      // .clone(true) specifies that event handlers also should be copied

      el.before(newone);    //  inserts specified content in front of (before) the selected elements
      $(".animated:last").remove();   // removes the selected elements, including all text and child nodes.

      this.ansOnScreen = true;
    }
    this.parentheses = 0;
    this.expression = '';
    this.expressionArray = [];
  }


  // add a number to the screen ------------------------------------------------
  writeNum = (e) => {
    console.log(e.target.getAttribute('key'));
    let key = e.target.getAttribute('key');
    // console.log(key);
    // console.log(e.target);

    if (this.inverted) {
      this.toggleInverted();
    }

    // when ans is on screen, add 'this.ans = this.ans' when new value comes
    if (this.ansOnScreen) {
      $('.result').html('this.ans = ' + $('.screentext').html());
      this.writeToScreen('write', '');
      this.ansOnScreen = false;
    }
    this.addToExpression(key);       // add this value to this.expression
    this.writeToScreen('append', e.target.innerHTML);  // update the this.expression (by appending new data)
  }


  // add an operator to the screen if there's no other operator ----------------
  writeOperator = () => {
    var key = $(this).attr('key');
    var char = $(this).attr('char');
    if (this.inverted) {
      this.toggleInverted();
    }

    if (this.ansOnScreen) {
      $('.result').html('this.ans = ' + $('.screentext').html());
      this.writeToScreen('write', 'this.ans');
      this.expression = this.ans;    // this.ans contains result of last evaluated this.expression
      this.expressionArray = [this.ans];
      this.parentheses = 0;
      $('.hints').html('');
      this.ansOnScreen = false;
    }

    // if this.expression ends an operator, and user puts another, then just replace previous one with this.
    if ((/[/]$|[*]$|[+]$|[-]$/g.test(this.expression) && (key === '/' || key === '*' || key === '+' || key === '-'))) {
      // write updated text on screen
      this.writeToScreen('write', $('.screentext').html().replace(/[÷]$|[×]$|[+]$|[-]$/g, char));
      console.log(this.expression);
      console.log($('.screentext').html());
      this.removeFromExpression();   // remove last character (operator) from this.expression
      this.addToExpression(key);     // update the this.expression (with new character)
    } else {
      // else just add the operator
      this.writeToScreen('append', char);
      this.addToExpression(key);
    }

    this.ansOnScreen = false;
  }

  // add a this.parentheses both to screen and to a global var ----------------------
  writeParenthesis = (e) => {
    // var value = $(this).attr('value');
    console.log(e.target);
    let key = e.target.getAttribute('key');
    console.log('key: ', key);
    if (this.inverted) {
      this.toggleInverted();
    }

    // if answer is on screen, then erase it
    if (this.ansOnScreen) {
      this.writeToScreen('write', '');
      this.ansOnScreen = false;
    }

    // add to this.expression & this.expressionArray
    this.addToExpression(key);
    // write on screen
    this.writeToScreen('append', key);

    // balance parenthesis
    if (key === '(') {
      this.parentheses++;
      this.adjustParentheses(this.parentheses);
    } else if (key === ')') {
      this.parentheses > 0 ? this.parentheses-- : this.parentheses = 0;
      this.adjustParentheses(this.parentheses);
    }

  }

  // on adding a function [like sin, cos, tan], change this.parentheses ----------------------------------------
  writeFunction = (e) => {
    var key1 = e.target.getAttribute('key1'); // contains trigonometric function name
    var key2 = e.target.getAttribute('key2'); // contains inverse trig. fn. name
    // console.log('key: ', e.target.getAttribute('key1'));
    // console.log('element: ', e.target);
    // console.log('innerHTML: ', e.target.innerHTML);

    if (this.ansOnScreen) {
      this.writeToScreen('write', '');
      this.ansOnScreen = false;
    }

    // add according to if 'Inv' is active or not [sin / sin-1 like functions]
    if (!this.inverted) {
      this.addToExpression(key1);
    } else {
      this.addToExpression(key2);
    }

    this.writeToScreen('append', e.target.innerHTML + '(');  // write current 'cbfun' button's inner HTML content to screen
    // console.log($(this).html() + '(');

    this.parentheses++;
    this.adjustParentheses(this.parentheses);

    if (this.inverted) {
      this.toggleInverted();
    }

  }

  // append the old result to the this.expression-----------------------------------------
  writeAns = () => {
    // if results on screen, then erase them
    if (this.ansOnScreen) {
      this.writeToScreen('write', '');
      this.ansOnScreen = false;
    }
    // if the screentext this.expression not ends with 'this.ans' or 0-9 or pi or e then append 'Answer' in front of the answer there
    if (!/[this.ans]$|[0-9]$|[π]$|[e]$/g.test($('.screentext').html())) {
      this.addToExpression(this.ans.toString());
      this.writeToScreen('append', 'this.ans');
      console.log(this.screenArray);
    }

  }

  // backspace -----------------------------------------------------------------------
  backSpaceCE = () => {
    if (this.inverted) {
      this.toggleInverted();
    }
    // if answer is there, erase it
    if (this.ansOnScreen) {
      this.writeToScreen('write', '');
      this.ansOnScreen = false;
    }
    // if this.expression is not empty, then
    if (this.expressionArray && this.expressionArray.length) {
      // remove the last character
      this.removeFromExpression();
      // remove the last character from this.screenArray, and write the remaining again to screen
      this.writeToScreen('delete', '');
    }

  }

  // Insert a random number ---------------------------------------------------------
  generateRandom = () => {
    var value = Math.random().toPrecision(8);

    if (this.inverted) {
      this.toggleInverted();
    }

    if (this.ansOnScreen) {
      $('.result').html('this.ans = ' + $('.screentext').html());
      this.writeToScreen('write', '');
      this.ansOnScreen = false;
    }

    // write only the random number to screen
    this.addToExpression(value);
    this.writeToScreen('append', value);
  }


  // calculator js ends here

  render() {
    return (
          // < !--main wrapper-- >
      <div className="wrapper">
        <h1 style={{textAlign:'center'}}>Scientific Calculator</h1>
        {/* <!-- calculator --> */}
        <div className="calc">
          <div className="top">
            <div className='result'></div>
            <div className='screen'><span id="screentext" className="screentext animated"></span><span className="hints"></span></div>
          </div>

          <div className="keyboard">
            <div className="crow">
              <div className='cb cbac'  onClick={() => {this.defaults()}}>AC</div>
              <div className="cb cbpar" key='(' onClick={(e) => {this.writeParenthesis(e)}}>(</div>
              <div className="cb cbpar" key=')' onClick={(e) => {this.writeParenthesis(e)}}>)</div>
              <div className='cb cbce' onClick={() => {this.backSpaceCE()}}>CE</div>
            </div>

            <div className="crow">
              <div className="cb cbnum" key='pi' onClick={(e) => {this.writeNum(e)}}>π</div>
              <div className="cb cbnum" key='e' onClick={(e) => {this.writeNum(e)}}>e</div>
              <div className="cb cbnum" key='phi' onClick={(e) => {this.writeNum(e)}}>φ</div>
              <div className="cb cbnum" key='tau' onClick={(e) => {this.writeNum(e)}}>τ</div>
            </div>

            <div className="crow">
              <div className="cb cbinv" onClick={() => {this.toggleInverted()}}>Inv</div>
              <div className="cb cbfun" key1='sin(' onClick={(e) => {this.writeFunction(e)}} key2="asin(">sin<sup className="inv">-1</sup></div>
              <div className="cb cbfun" key1='cos(' onClick={(e) => {this.writeFunction(e)}} key2="acos(">cos<sup className="inv">-1</sup></div>
              <div className="cb cbfun" key1='tan(' onClick={(e) => {this.writeFunction(e)}} key2="atan(">tan<sup className="inv">-1</sup></div>
            </div>

            <div className="crow">
              <div className="cb cbfun" onClick={(e) => {this.writeFunction(e)}} key1='log10('>log</div>
              <div className="cb cbfun" onClick={(e) => {this.writeFunction(e)}} key1='log('>ln</div>
              <div className="cb cbop" onClick={() => {this.writeOperator()}} key='!' char='!'>!</div>
              <div className="cb cbop" onClick={() => {this.writeOperator()}} key='deg' char='deg'>deg</div>
            </div>

            <div className="crow">
              <div className="cb cbfun" onClick={() => {this.writeFunction()}} key1='sqrt('>√</div>
              <div className="cb cbop" onClick={() => {this.writeOperator()}} key='^2' char='²'>x²</div>
              <div className="cb cbop" onClick={() => {this.writeOperator()}} key='^3' char='³'>x³</div>
              <div className="cb cbop" onClick={() => {this.writeOperator()}} key='^' char='^'>^</div>
            </div>

            <div className="crow">
              <div className="cb cbnum lighter" onClick={() => {this.writeNum()}} key='7'>7</div>
              <div className="cb cbnum lighter" onClick={() => {this.writeNum()}} key='8'>8</div>
              <div className="cb cbnum lighter" onClick={() => {this.writeNum()}} key='9'>9</div>
              <div className="cb cbop operands" key='/' char='÷' onClick={() => {this.writeOperator()}}>÷</div>
            </div>

            <div className="crow">
              <div className="cb cbnum lighter" onClick={() => {this.writeNum()}} key='4'>4</div>
              <div className="cb cbnum lighter" onClick={() => {this.writeNum()}} key='5'>5</div>
              <div className="cb cbnum lighter" onClick={() => {this.writeNum()}} key='6'>6</div>
              <div className="cb cbop operands" key='*' char='×' onClick={() => {this.writeOperator()}}>×</div>
            </div>

            <div className="crow">
              <div className="cb cbnum lighter" onClick={() => {this.writeNum()}} key='1'>1</div>
              <div className="cb cbnum lighter" onClick={() => {this.writeNum()}} key='2'>2</div>
              <div className="cb cbnum lighter" onClick={() => {this.writeNum()}} key='3'>3</div>
              <div className="cb cbop operands" key='-' char='-' onClick={() => {this.writeOperator()}}>-</div>
            </div>

            <div className="crow">
              <div className="cb cbnum lighter" onClick={() => {this.writeNum()}} key='0'>0</div>
              <div className="cb cbnum lighter" onClick={() => {this.writeNum()}} key='.'>.</div>
              <div className="cb cbop lighter" key='E' char='E' onClick={() => {this.writeOperator()}}>exp</div>
              <div className="cb cbop operands" key='+' char='+' onClick={() => {this.writeOperator()}}>+</div>
            </div>

            <div className="crow">
              <div className="cb cbrnd" onClick={() => {this.generateRandom()}} style={{width:'25%'}}>Rnd</div>
              <div className="cb cbans" onClick={() => {this.writeAns()}} style={{width:'25%'}}>Ans</div>
              <div className="cb enter" onClick={() => {this.evaluate()}} style={{width:'50%'}}>=</div>
            </div>

          </div>
        </div>
      </div>
    )
  };

  componentDidMount() {
    this.expression = '';
    this.expressionArray = [];
    this.screenArray = [];
    this.parentheses = 0;
    this.ansOnScreen = false;
    this.ans = null;
    this.error = false;
    this.inverted = false;
  }
}

export default ScientificCalculator;
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
        let value = e.target.getAttribute('value');
        console.log(value); 
        console.log(e.target);
  
        if (this.inverted) {
          this.toggleInverted();
        }

        // when this.ans is on screen, add 'this.ans = this.ans' when new value comes
        if (this.ansOnScreen) {
          $('.result').html('this.ans = ' + $('.screentext').html());
          this.writeToScreen('write', '');
          this.ansOnScreen = false;
        }
        this.addToExpression(value);       // add this value to this.expression
        console.log('fine2')
        this.writeToScreen('append', value);  // update the this.expression (by appending new data)
      }

  
    // add an operator to the screen if there's no other operator ----------------
    writeOperator = () => {
        var value = $(this).attr('value');
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
        if ((/[/]$|[*]$|[+]$|[-]$/g.test(this.expression) && (value === '/' || value === '*' || value === '+' || value === '-'))) {
          // write updated text on screen
          this.writeToScreen('write', $('.screentext').html().replace(/[÷]$|[×]$|[+]$|[-]$/g, char));
          console.log(this.expression);
          console.log($('.screentext').html());
          this.removeFromExpression();   // remove last character (operator) from this.expression
          this.addToExpression(value);     // update the this.expression (with new character)
        } else {
          // else just add the operator
          this.writeToScreen('append', char);
          this.addToExpression(value);
        }
  
        this.ansOnScreen = false;
      }
  
    // add a this.parentheses both to screen and to a global var ----------------------
    writeParenthesis = (e) => {
        // var value = $(this).attr('value');
        let value = e.target.getAttribute('value');
        if (this.inverted) {
          this.toggleInverted();
        }
  
        // if answer is on screen, then erase it
        if (this.ansOnScreen) {
          this.writeToScreen('write', '');
          this.ansOnScreen = false;
        }

        // add to this.expression & this.expressionArray
        console.log(value);
        this.addToExpression(value);
        // write on screen
        this.writeToScreen('append', value);
  
        // balance parenthesis
        if (value === '(') {
          this.parentheses++;
          this.adjustParentheses(this.parentheses);
        } else if (value === ')') {
          this.parentheses > 0 ? this.parentheses-- : this.parentheses = 0;
          this.adjustParentheses(this.parentheses);
        }
  
      }
  
    // on adding a function [like sin, cos, tan], change this.parentheses ----------------------------------------
        writeFunction = (e) => {
        // var key1 = $(this).attr('key1'); // contains trigonometric function name
        // var key2 = $(this).attr('key2'); // contains inverse trig. fn. name
        let value = e.target.getAttribute('value');
        console.log('key: ', e.target.getAttribute('key1'));
        console.log('element: ', e.target);
        console.log('innerHTML: ', e.target.innerHTML);
  
        if (this.ansOnScreen) {
          this.writeToScreen('write', '');
          this.ansOnScreen = false;
        }
  
        // add according to if 'Inv' is active or not [sin / sin-1 like functions]
        if (!this.inverted) {
          this.addToExpression(value);
        } else {
          this.addToExpression('a' + value);
          value = 'a' + value;
        }

        this.writeToScreen('append', value);  // write current 'cbfun' button's inner HTML content to screen
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
                        <div className='cb cbac' onClick={() => {this.defaults()}}>AC</div>
                        <div className="cb cbpar" value='(' onClick={(e) => {this.writeParenthesis(e)}}>(</div>
                        <div className="cb cbpar" value=')' onClick={(e) => {this.writeParenthesis(e)}}>)</div>
                        <div className='cb cbce' onClick={() => {this.backSpaceCE()}}>CE</div>
                    </div>

                    <div className="crow">
                        <div className="cb cbnum" value='π' onClick={(e) => {this.writeNum(e)}}>π</div>
                        <div className="cb cbnum" value='e' onClick={(e) => {this.writeNum(e)}}>e</div>
                        <div className="cb cbnum" value='φ' onClick={(e) => {this.writeNum(e)}}>φ</div>
                        <div className="cb cbnum" value='τ' onClick={(e) => {this.writeNum(e)}}>τ</div>
                    </div>

                    <div className="crow">
                        <div className="cb cbinv" onClick={() => {this.toggleInverted()}}>Inv</div>
                        <div className="cb cbfun" value='sin(' onClick={(e) => {this.writeFunction(e)}} key2="asin(">sin<sup className="inv">-1</sup></div>
                        <div className="cb cbfun" value='cos(' onClick={(e) => {this.writeFunction(e)}} key2="acos(">cos<sup className="inv">-1</sup></div>
                        <div className="cb cbfun" value='tan(' onClick={(e) => {this.writeFunction(e)}} key2="atan(">tan<sup className="inv">-1</sup></div>
                    </div>

                    <div className="crow">
                        <div className="cb cbfun" onClick={(e) => {this.writeFunction(e)}} key1='log10(' value="log">log</div>
                        <div className="cb cbfun" onClick={(e) => {this.writeFunction(e)}} key1='log(' value="ln">ln</div>
                        <div className="cb cbop" value='!' char='!' onClick={() => {this.writeOperator()}}>!</div>
                        <div className="cb cbop" value='deg' char='deg' onClick={() => {this.writeOperator()}}>deg</div>
                    </div>

                    <div className="crow">
                        <div className="cb cbfun" onClick={() => {this.writeFunction()}} key1='sqrt('>√</div>
                        <div className="cb cbop" value='^2' char='²' onClick={() => {this.writeOperator()}}>x²</div>
                        <div className="cb cbop" value='^3' char='³' onClick={() => {this.writeOperator()}}>x³</div>
                        <div className="cb cbop" value='^' char='^' onClick={() => {this.writeOperator()}}>^</div>
                    </div>

                    <div className="crow">
                        <div className="cb cbnum lighter" value='7' onClick={() => {this.writeNum()}}>7</div>
                        <div className="cb cbnum lighter" value='8' onClick={() => {this.writeNum()}}>8</div>
                        <div className="cb cbnum lighter" value='9' onClick={() => {this.writeNum()}}>9</div>
                        <div className="cb cbop operands" value='/' char='÷' onClick={() => {this.writeOperator()}}>÷</div>
                    </div>

                    <div className="crow">
                        <div className="cb cbnum lighter" value='4' onClick={() => {this.writeNum()}}>4</div>
                        <div className="cb cbnum lighter" value='5' onClick={() => {this.writeNum()}}>5</div>
                        <div className="cb cbnum lighter" value='6' onClick={() => {this.writeNum()}}>6</div>
                        <div className="cb cbop operands" value='*' char='×' onClick={() => {this.writeOperator()}}>×</div>
                    </div>

                    <div className="crow">
                        <div className="cb cbnum lighter" value='1' onClick={() => {this.writeNum()}}>1</div>
                        <div className="cb cbnum lighter" value='2' onClick={() => {this.writeNum()}}>2</div>
                        <div className="cb cbnum lighter" value='3' onClick={() => {this.writeNum()}}>3</div>
                        <div className="cb cbop operands" value='-' char='-' onClick={() => {this.writeOperator()}}>-</div>
                    </div>

                    <div className="crow">
                        <div className="cb cbnum lighter" value='0'>0</div>
                        <div className="cb cbnum lighter" value='.'>.</div>
                        <div className="cb cbop lighter" value='E' char='E' onClick={() => {this.writeOperator()}}>exp</div>
                        <div className="cb cbop operands" value='+' char='+' onClick={() => {this.writeOperator()}}>+</div>
                    </div>

                    <div className="crow">
                        <div className="cb cbrnd" onClick={() => {this.generateRandom()}} style={{width:'25%'}}>Rnd</div>
                        <div className="cb cbans" onClick={() => {this.writeAns()}} style={{width:'25%'}}>this.ans</div>
                        <div className="cb enter" onClick={() => {this.evaluate()}} style={{width:'50%'}}>=</div>
                    </div>

                </div>
            </div>
        </div>
    )};

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
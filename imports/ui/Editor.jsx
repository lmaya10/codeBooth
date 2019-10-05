import React, { useState, useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/highlight';
import javascript from 'highlight.js/lib/languages/javascript';
import '../styles/Editor.css';
import '../styles/codeSyntax.css';

hljs.registerLanguage('javascript', javascript);

Function.prototype.clone = function () {
  var that = this;
  var temp = function temporary() {
    return that.apply(this, arguments);
  };
  for (var key in this) {
    if (this.hasOwnProperty(key)) {
      temp[key] = this[key];
    }
  }
  return temp;
};

const Editor = () => {

  const [content, setContent] = useState('');
  const [output, setOutput] = useState('');
  const inputRef = useRef(null);
  const outputRef = useRef(null);


  useEffect(() => refreshHighlighting(), [content]);

  const refreshHighlighting = () => {
    hljs.highlightBlock(outputRef.current);
  };
  const bindKeys = (e) => {
    const keyCode = e.keyCode || e.which;

    const prevValue = e.target.value;
    const pos = inputRef.current.selectionStart;
    if (keyCode === 9) {
      e.preventDefault();

      e.target.value = `${prevValue.substring(0, pos)}  ${prevValue.substring(pos)}`;
      inputRef.current.selectionStart = pos + 2;
      inputRef.current.selectionEnd = pos + 2;
    }

    // // To autocomplete curly braces
    // if(keyCode === 222){
    //   e.preventDefault();

    //   e.target.value = `${prevValue.substring(0, pos)}{}${prevValue.substring(pos)}`;
    //   inputRef.current.selectionStart = pos + 1;
    //   inputRef.current.selectionEnd = pos + 1;
    // }
  };
  const onTextChange = (e) => {
    setContent(e.target.value);
  };
  const scrollHandler = (e) => {
    outputRef.current.scrollTop = e.target.scrollTop;
  };
  const execute = () => {
    const rtas = [];
    console.oldLog = console.log;
    console.log = (a) => rtas.push(a);
    eval(content);
    setOutput(rtas.join('\n'));
    console.log = console.oldLog;
  };

  return (
    <div id="editor">
      <div>
        <div id="name-container">
          <button><i className="fas fa-save"></i></button>
          <input placeholder="Unnamed Document" />
        </div>
        <button onClick={execute}><i className="fas fa-play"></i></button>
      </div>
      <div>
        <div id="editable">
          <textarea ref={inputRef} autoFocus onKeyDown={bindKeys} onChange={onTextChange} onScroll={scrollHandler} />
          <pre>
            <code ref={outputRef}>
              {content}
            </code>
          </pre>
        </div>
        <div id="console" className={output ? '' : 'hidden'}>
          <pre><code>{output}</code></pre>
        </div>
      </div>
    </div>
  );
};

export default Editor;

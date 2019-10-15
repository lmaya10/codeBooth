import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import hljs from 'highlight.js/lib/highlight';
import javascript from 'highlight.js/lib/languages/javascript';
import '../styles/Editor.css';
import '../styles/codeSyntax.css';
import { call } from '../utils/mongo';
import { withTracker } from 'meteor/react-meteor-data';
import { Documents } from '../api/documents';
import { Meteor } from 'meteor/meteor';
import Share from './Share';

hljs.registerLanguage('javascript', javascript);

const Editor = ({ showToast, document, showDocument, saveShare }) => {

  const [docId, setDocId] = useState(document ? document._id : undefined);
  const [name, setName] = useState(document ? document.title : '');
  const [content, setContent] = useState(document ? document.text : '');
  const [output, setOutput] = useState('');
  const [showShare, setShowShare] = useState(false);
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  useEffect(() => {
    if (document) {
      setContent(document.text);
      setName(document.title);
      setDocId(document._id);
    }
  }, [document]);

  useEffect(() => {
    refreshHighlighting();
  }, [content]);

  useEffect(() => {
    if (docId) {
      (async () => {
        try {
          await call('document.update', docId, name, content);
          // showToast({ state: 'Success', msg: 'Ok' });
        }
        catch (error) {
          showToast({ state: 'Error', msg: error });
        }
      })();
    }
  }, [content, name, docId]);

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
    try {
      const rtas = [];
      console.oldLog = console.log;
      console.log = (a) => rtas.push(a);
      eval(content);
      setOutput(rtas.join('\n'));
      console.log = console.oldLog;
    }
    catch (error) {
      setOutput('' + error);
    }
  };
  const save = () => {
    if (!document) {
      if (!name) {
        showToast({ state: 'Error', msg: 'Please provide a name for the document' });
      }
      else {
        (async () => {
          try {
            const rta = await call('document.create', name, content);
            showToast({ state: 'Success', msg: 'Created!' });
            setDocId(rta);
            showDocument({ _id: rta });
          }
          catch (error) {
            showToast({ state: 'Error', msg: error });
          }
        })();
      }
    }
  };

  const saveSharedWith = (shares) => {
    setShowShare(false);
    saveShare(docId, shares);
  };

  return (
    <div id="editor">
      <div>
        <div id="name-container">
          <button aria-label="save" onClick={save}>
            <i className="fas fa-save" />
          </button>
          <input
            aria-label="booth name"
            placeholder="Unnamed Document"
            value={name}
            onChange={e => setName(e.target.value)}
            className={name ? 'non-empty' : ''} />
        </div>
        <button aria-label="run" onClick={execute}><i className="fas fa-play"></i></button>
        <button aria-label="share" className={docId ? '' : 'hidden'} onClick={() => setShowShare(true)}>
          <i className="fas fa-share-alt" />
        </button>
      </div>
      <div>
        <div id="editable">
          <textarea
            aria-label="code booth"
            ref={inputRef}
            autoFocus
            onKeyDown={bindKeys}
            onChange={onTextChange}
            onScroll={scrollHandler}
            value={content} />
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
      {document &&
        <Share
          document={document}
          show={showShare}
          closeShare={() => setShowShare(false)}
          saveShare={saveSharedWith} />}
    </div>
  );
};

Editor.propTypes = {
  showToast: PropTypes.func.isRequired,
  document: PropTypes.object,
  documentId: PropTypes.any,
  showDocument: PropTypes.func.isRequired,
  saveShare: PropTypes.func.isRequired
};

// export default Editor;
export default withTracker((props) => {
  Meteor.subscribe('documents');

  return {
    document: props.documentId ? Documents.findOne({ _id: props.documentId }) : undefined,
    ...props
  };
})(Editor);

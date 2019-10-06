import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/Share.css';

const Share = ({ document, show, closeShare, saveShare }) => {

  const [rows, setRows] = useState([...document.sharedWith, { username: '', rol: 'Reader' }]);

  const delRow = (i) => {
    return () => {
      setRows(p => {
        return [...p.slice(0, i), ...p.slice(i + 1)];
      });
    };
  };

  const addRow = () => {
    setRows(r => {
      const r1 = [...r];
      r1.push({ username: '', rol: 'Reader' });
      return r1;
    });
  };

  const setUsername = (i) => {
    return (e) => {
      const nUsername = e.target.value;
      setRows(r => {
        const nR = [...r];
        nR[i] = { username: nUsername, rol: r[i].rol };
        return nR;
      });
    };
  };

  const setRol = (i) => {
    return (e) => {
      const nRol = e.target.value;
      setRows(r => {
        const nR = [...r];
        nR[i] = { username: r[i].username, rol: nRol };
        return nR;
      });
    };
  };

  return (
    <div id="share" className={show ? '' : 'hidden'}>
      <div id="bg"></div>
      <div id="share-container">
        <div><span>People shared with</span></div>
        <div>
          <div>
            {rows.map((r, i) => (
              <div key={`b-${i}`}>
                <input placeholder="username" value={r.username} onChange={setUsername(i)} />
                <select value={r.rol} onChange={setRol(i)}>
                  <option value="Reader">Reader</option>
                  <option value="Editor">Writter</option>
                  <option value="Owner">Owner</option>
                </select>
                <button onClick={delRow(document.sharedWith.length + i)}><i className="fas fa-times"></i></button>
              </div>
            ))}
          </div>
          <div>
            <button onClick={addRow}>
              <i className="fas fa-plus" />
            </button>
          </div>
        </div>
        <div>
          <button onClick={() => saveShare(rows)}>Ok</button>
          <button onClick={closeShare}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

Share.propTypes = {
  document: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  closeShare: PropTypes.func.isRequired,
  saveShare: PropTypes.func.isRequired
};

export default Share;

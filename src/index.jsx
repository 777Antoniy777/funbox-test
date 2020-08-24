import React from 'react';
import {render} from 'react-dom';

const App = () => {
  return (
    <div className="container">
      <h1>Webpack config</h1>

      <pre className="json-wrapper"></pre>
    </div>
  )
};

render(<App />, document.getElementById('root'))

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import memoryUtils from './utils/memoryUtils';
import storageUtils from './utils/storageUtils';

// 读取local中保存的user，保存到内存中
const user = storageUtils.getUser()
memoryUtils.user = user

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);

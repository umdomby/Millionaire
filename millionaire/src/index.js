import React, {createContext} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import DeviceStore from "./store/DeviceStore";

export const Context = createContext(null)

ReactDOM.render(
    <Context.Provider value={{
        device: new DeviceStore()
    }}>
        <App />
    </Context.Provider>,
  document.getElementById('root')
);


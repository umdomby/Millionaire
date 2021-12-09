import './App.css';

import WebSocketProject from './components/WebSocketProject'
import {observer} from "mobx-react-lite";


const App = observer(() => {
  return (
        <div style={{textAlign:'center'}}>
            <WebSocketProject/>
        </div>
  );
});

export default App;

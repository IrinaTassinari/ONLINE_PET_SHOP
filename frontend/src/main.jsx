import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import "antd/dist/reset.css"; //reset.css — это базовый reset-стиль библиотеки Ant Design. Он сбрасывает/нормализует стандартные стили браузера для компонентов antd
import './fonts.css'
import './index.css'
import App from './App.jsx'
import {Provider} from 'react-redux'
import store from './store/store.js'

createRoot(document.getElementById('root')).render(
 <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
)






import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../reducers";
import rootSaga from "../sagas";
import createSagaMiddleware from "redux-saga";

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});
sagaMiddleware.run(rootSaga);

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Navbar></Navbar>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;

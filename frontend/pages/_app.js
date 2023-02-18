import Header from "../components/Header";
import Toast from "../components/Toast";
import AppProvider from "../context/AppContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <AppProvider>
      <Header />
      <Component {...pageProps} />
      <Toast />
    </AppProvider>
  );
}

export default MyApp;

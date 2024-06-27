import "../styles/globals.css";

// INTERNAL IMPORT
import { ChatAppContect, ChatAppProvider } from "../Context/ChatAppContext";
import { NavBar, Loader } from "../Components/index";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  const isUserLoggedIn = useState(ChatAppContect);
  const loading = useContext(ChatAppContect);

  useEffect(() => {
    if (!isUserLoggedIn && router.pathname !== "/login") {
      router.push("/login");
    }
  }, [isUserLoggedIn, router]);

  return (
    <ChatAppProvider>
      {loading ? (
        <Loader />
      ) : (
        <>
          {isUserLoggedIn && router.pathname !== "/login" && router.pathname !== "/UserRegister" && <NavBar />}
          <Component {...pageProps} />
        </>
      )}
    </ChatAppProvider>
  );
};

export default MyApp;

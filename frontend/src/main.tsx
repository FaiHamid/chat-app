import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/main.scss";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#8BC83F" },
    background: { default: "#0f172a", paper: "#1e293b" },
  },
});
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login.tsx";
import { Register } from "./pages/Register.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { InformMessage } from "./components/informMessage.tsx";
import { ActivateMessage } from "./components/activateMessage.tsx";
import { CompaniesList } from "./pages/companiesList.tsx";
import { Profile } from "./pages/profile.tsx";
import { Dashboard } from "./pages/dashboard.tsx";
import { NewCompany } from "./pages/addNewCompany.tsx";
import { RequireAuth } from "./utils/requireAuthRouters.tsx";
import { RequireNonAuth } from "./utils/requireNonAuthRouters.tsx";
import { ResetPassword } from "./pages/resetPassword.tsx";
import { RedirectFromHome } from "./utils/redirectFromHome.tsx";
import { Chat } from "./pages/chat.tsx";
import { Chats } from "./pages/chats.tsx";
import { JoinChat } from "./pages/joinChat.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
  <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<RedirectFromHome />} />
            <Route element={<RequireNonAuth />}>
              <Route path="register" element={<Register />} />
              <Route path="check-email" element={<InformMessage />} />
              <Route path="login" element={<Login />} />
              <Route
                path="activate/:activatedToken"
                element={<ActivateMessage />}
              />
            </Route>

            <Route element={<RequireAuth />}>
              <Route path="companies" element={<CompaniesList />} />
              <Route path="new" element={<NewCompany />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="reset-password" element={<ResetPassword />} />
              <Route path="chat" element={<Navigate to="/chats" replace />} />
              <Route path="chats" element={<Chats />} />
              <Route path="chats/join/:inviteCode" element={<JoinChat />} />
              <Route path="chats/:chatId" element={<Chat />} />
            </Route>
          </Route>
        </Routes>
      </Router>
  </QueryClientProvider>
  </ThemeProvider>
);

import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { chatsService } from "../services/chatsService";
import { CustomLoader } from "../components/customLoader";

export const JoinChat = () => {
  const navigate = useNavigate();
  const { inviteCode } = useParams<{ inviteCode: string }>();

  useEffect(() => {
    const joinRoom = async () => {
      if (!inviteCode) {
        navigate("/chats", { replace: true });
        return;
      }

      try {
        await chatsService.joinChat(inviteCode);
        const chats = await chatsService.getAllChats();
        const joinedChat = chats.find((chat) => chat.inviteLink === inviteCode);

        if (!joinedChat) {
          navigate("/chats", { replace: true });
          return;
        }

        navigate(`/chats/${joinedChat.id}`, { replace: true });
      } catch {
        navigate("/chats", { replace: true });
      }
    };

    void joinRoom();
  }, [inviteCode, navigate]);

  return <CustomLoader loaderSize={90} paddingY={120} />;
};

import { FormEvent, MouseEvent, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";
import { chatsService, IChatResponse } from "../services/chatsService";
import { queryKeys } from "../reactQuery/queriesKey";

export const Chats = () => {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [chatTitle, setChatTitle] = useState("");
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedChat, setSelectedChat] = useState<IChatResponse | null>(null);

  const { data: chats = [], isLoading } = useQuery({
    queryKey: [queryKeys.getAllChats],
    queryFn: chatsService.getAllChats,
  });

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setChatTitle("");
  };

  const createChatMutation = useMutation({
    mutationFn: async (title: string) => chatsService.createChat(title),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [queryKeys.getAllChats] });
      handleCloseCreateModal();
    },
  });

  const canCreate = useMemo(() => chatTitle.trim().length > 0, [chatTitle]);

  const handleOpenMenu = (
    event: MouseEvent<HTMLButtonElement>,
    chat: IChatResponse,
  ) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedChat(chat);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setSelectedChat(null);
  };

  const handleCopyInviteLink = async () => {
    if (!selectedChat?.inviteLink) {
      return;
    }

    const inviteLink = `${window.location.origin}/chats/join/${selectedChat.inviteLink}`;
    await navigator.clipboard.writeText(inviteLink);
    handleCloseMenu();
  };

  const handleCreateChat = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = chatTitle.trim();
    if (!trimmedTitle) {
      return;
    }

    await createChatMutation.mutateAsync(trimmedTitle);
  };

  return (
    <>
      <section className="mx-auto mt-6 w-full max-w-[880px] rounded-3xl border border-slate-700 bg-slate-800 p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-100">Chats</h1>
            <p className="mt-1 text-sm text-slate-400">
              Всі чати, до яких у вас є доступ.
            </p>
          </div>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            New chat
          </Button>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-dashed border-slate-600 px-5 py-8 text-center text-sm text-slate-400">
            Loading chats...
          </div>
        ) : chats.length > 0 ? (
          <div className="flex flex-col gap-3">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-700 px-4 py-4 transition hover:border-[#8BC83F] hover:bg-slate-700"
              >
                <Link
                  to={`/chats/${chat.id}`}
                  className="min-w-0 flex-1"
                >
                  <p className="truncate text-base font-semibold text-slate-100">
                    {chat.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Open chat
                  </p>
                </Link>

                <button
                  type="button"
                  onClick={(event) => handleOpenMenu(event, chat)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-600 text-slate-300 transition hover:bg-slate-600"
                  aria-label={`Open actions for ${chat.title}`}
                >
                  <MoreHorizIcon fontSize="small" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-600 px-5 py-8 text-center text-sm text-slate-400">
            У вас ще немає чатів. Створіть перший чат, щоб почати спілкування.
          </div>
        )}
      </section>

      <Dialog
        open={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        fullWidth
        maxWidth="xs"
      >
        <form onSubmit={handleCreateChat}>
          <DialogTitle>Create new chat</DialogTitle>
          <DialogContent>
            <input
              autoFocus
              value={chatTitle}
              onChange={(event) => setChatTitle(event.target.value)}
              placeholder="Enter chat title"
              className="mt-2 h-11 w-full rounded-xl border border-slate-600 bg-slate-700 text-slate-100 px-4 text-sm outline-none transition focus:border-[#8BC83F] placeholder:text-slate-400"
            />
          </DialogContent>
          <DialogActions sx={{ paddingInline: 3, paddingBottom: 3 }}>
            <Button
              color="inherit"
              onClick={handleCloseCreateModal}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!canCreate || createChatMutation.isPending}
            >
              {createChatMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleCopyInviteLink}>Copy invite link</MenuItem>
      </Menu>
    </>
  );
};

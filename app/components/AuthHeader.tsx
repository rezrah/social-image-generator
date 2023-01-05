import { PencilIcon, ArchiveIcon, TrashIcon } from "@primer/octicons-react";
import { ActionList, ActionMenu, Box } from "@primer/react";
import { Avatar } from "@primer/react";
import { useAuth } from "../auth/AuthProvider";

export function AuthHeader() {
  const { user, authEnabled, signOut } = useAuth();
  return (
    <Box
      sx={{
        position: "absolute",
        right: 32,
        top: 16,
        zIndex: 999,
      }}
    >
      {authEnabled && user && (
        <ActionMenu>
          <ActionMenu.Anchor>
            <Avatar src={user?.picture} size={42}></Avatar>
          </ActionMenu.Anchor>
          <ActionMenu.Overlay>
            <ActionList>
              <ActionList.Item onClick={signOut}>Sign out</ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>
      )}
    </Box>
  );
}

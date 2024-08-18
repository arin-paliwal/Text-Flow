import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Tooltip,
  MenuDivider,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerHeader,
  DrawerContent,
  DrawerBody,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { BellIcon, ChatIcon, ChevronDownIcon, EmailIcon, Search2Icon, SearchIcon } from "@chakra-ui/icons";
import { ChatState } from "../../../Context/ChatProvider";
import ProfileModal from "./profileModal";
import axios from "axios";
import ChatLoading from "../../ChatLoading";
import UserListItem from "../../UserAvatar/UserListItem";
import { getSender } from "../../../config/ChatLogics";
import { Effect } from "react-notification-badge"
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";
function SideDrawer() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setloading] = useState(false);
  const [loadingChat, setloadingChat] = useState();
  const { user, setSelectedChat, chats, setChats, notification, setnotification } = ChatState();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Search Something",
        status: "info",
        duration: 2500,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setloading(true);
      const congif = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, congif);
      setloading(false);
      setsearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load the search result",
        duration: 2500,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const accessChat = async (userId) => {
    try {
      setloadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setloadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error Fetching the chat",
        description: "error.message",
        duration: 2500,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search User" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <ChatIcon />
            <Text d={{ base: "none", md: "flex" }} px="2">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          {/* Welcome to Text Flow ! */}
        </Text>
        <div>
          <Menu>
            <MenuButton p={2}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.ROTATE_X}
              />
              <EmailIcon />
            </MenuButton>
            <MenuList p="2">
              <center>
                {!notification.length && "No New Messages"}
                {notification.map(notif => (
                  <MenuItem key={notif._id} onClick={() => {
                    setSelectedChat(notif.chat);
                    setnotification(notification.filter((n) => n !== notif));
                  }}>
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      :
                      `New Message from ${getSender(user, notif.chat.users)}`
                    }
                  </MenuItem>
                ))}
              </center>

            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem padding="13px">My Profile</MenuItem>
              </ProfileModal>
              <MenuItem padding="13px" onClick={logoutHandler}>
                {/* navigate("/chat"); */}
                Log Out
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by Name or Email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}><Search2Icon/></Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;

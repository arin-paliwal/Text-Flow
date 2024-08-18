import { AddIcon, SmallAddIcon } from "@chakra-ui/icons";
import { Box, Button, color, Stack, Text, useToast } from "@chakra-ui/react";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import GroupChatModal from "./Authentication/miscellaenous/GroupChatModal";
import ChatLoading from "./ChatLoading";
// headers = header.append('Authorization', token);
// headers = header.append('Content-Type', 'application/json');

const MyChats = ({fetchAgain}) => {
  const [loggedUser, setloggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("https://text-flow.onrender.com/api/chat", config);
      // console.log(data);
      setChats(data);
    } catch (error) {
      // console.log(error);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    setloggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{
        base: selectedChat ? "none" : "flex",
        md: "flex",
      }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignContent="center"
        
      >
        My Chats
        <GroupChatModal>
        <Button
          display="flex"
          fontSize={{ base: "17px", md: "10px", lg: "17px" }}
          rightIcon={<SmallAddIcon />}
        >
          New Group Chat
        </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                bg={selectedChat === chat ? "#588157" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={3}
                  borderRadius="lg"
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                  {chat.latestMessage && (
                    <Text fontSize="xs">
                      <b>{chat.latestMessage.sender.name} : </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </Text>
                  )}
                </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;

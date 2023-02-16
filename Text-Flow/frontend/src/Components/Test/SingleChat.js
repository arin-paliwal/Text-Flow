import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import Lottie from "lottie-react";
import axios from "axios";
import animationData from"../../Animations/typing.json"
import { ArrowBackIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import logo from "./Screenshot_20230201_065723-removebg-preview.png";
import { ChatState } from "../../Context/ChatProvider";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import ProfileModal from "../Authentication/miscellaenous/profileModal";
import "../styles.css"
import UpdateGroupChatModal from "../Authentication/miscellaenous/UpdateGroupChatModal";
import ScrollableChat from "../ScrollableChat";
import indicator from "./indicator.gif";
import io from 'socket.io-client';
const ENDPOINT="http://localhost:5000";
var socket,selectedChatCompare;
const SingleChat = ({ fetchAgain, setfetchAgain }) => {
  const [messages, setmessages] = useState([]);
  const [loading, setloading] = useState(false);
  const [newMessage, setnewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { user, selectedChat, setSelectedChat, notification, setnotification } = ChatState();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };
  const [socketConnected, setsocketConnected] = useState(false);
  const toast = useToast();
  const fetchMessages=async()=>{
    if(!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setloading(true);
      const { data } = await axios.get(`/api/message/${selectedChat._id}`,
      config
      );
      console.log(messages);
      setmessages(data);
      setloading(false);
      socket.emit("join chat",selectedChat._id);
      }
    catch (error) {
      toast({
        title: "Failed to load message",
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setsocketConnected(true));
    socket.on("typing",()=>setIsTyping(true));
    socket.on("stop typing",()=>setIsTyping(false));
  }, [])

  useEffect(() => {
    fetchMessages();
    selectedChatCompare=selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved",(newMessageRecieved)=>{
      if(!selectedChatCompare||selectedChatCompare._id!==newMessageRecieved.chat._id){
        if(!notification.includes(newMessageRecieved)){
          setnotification([newMessageRecieved,...notification]);
          setfetchAgain(!fetchAgain);
        }
      }
      else{
        setmessages([...messages,newMessageRecieved]);
      }
    });
  });
  
  
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing",selectedChat._id);
      // console.log("I am present in try block");
      try {
        // console.log("I am present in try block");
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
            // console.log();
          },
        };
        // console.log("till config running fine");
        setnewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            // console.log("I am present here"),
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        // console.log(data);
        socket.emit("new message",data);
        setmessages([...messages, data]);
      } catch (error) {
        // console.log(error);
        toast({
          title: "Error Occured! Message Not Send",
          status: "error",
          duration: 2500,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  
  const typingHandler = (e) => {
    setnewMessage(e.target.value);
    if(!socketConnected) return;
    if(!typing){
      setTyping(true);
      socket.emit("typing",selectedChat._id);
    }
    let lastTypingTime = (new Date()).getTime();
    var timerLength=3000;
    setTimeout(()=>{
      var timeNow = (new Date()).getTime();
      var timeDiff=timeNow-lastTypingTime;
      if(timeDiff>=timerLength && typing){
        socket.emit("stop typing",selectedChat._id);
        setTyping(false);
      }
    },timerLength);
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "20px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName}
                {
                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setfetchAgain={setfetchAgain}
                      fetchMessages={fetchMessages}
                  />
                }
              </>
            )}
          </Text>
          <Box
            display="flex"
            justifyContent="flex-end"
            flexDir="column"
            p={3}
            bg="#fyf8g8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages}/>
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping?
              <div class="indicator">
                  <img src={indicator} alt="loading..." />
              </div>:
              <></>}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message..."
                onChange={typingHandler}
                value={newMessage}
              ></Input>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <img src={logo} alt="logo" />
        </Box>
      )}
    </>
  );
};

export default SingleChat;
// module.exports=SingleChat




{/* <Lottie
  options={defaultOptions}
  width={70}
  style={{ marginBottom: 15, marginLeft: 0 }}
/>  */}
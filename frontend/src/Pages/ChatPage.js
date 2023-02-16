import React, { useEffect, useState } from 'react';
import axios from 'axios'
import {ChatState} from "../Context/ChatProvider"
import SideDrawer from '../Components/Authentication/miscellaenous/SideDrawer';
import { Box } from '@chakra-ui/react';
import ChatBox from '../Components/ChatBox';
import MyChats from '../Components/MyChats';
const ChatPage = () => {
    const {user}=ChatState();
    const [fetchAgain, setfetchAgain] = useState(false);
    return (
        <div style={{width:"100%"}}>
            {user && <SideDrawer/>}
            <Box
            display="flex"
            justifyContent="space-between"
            width="100%"
            h="91.5vh"
            p="10px"
            >
                {user && <MyChats fetchAgain={fetchAgain}/>}
                {user && <ChatBox fetchAgain={fetchAgain} setfetchAgain={setfetchAgain}/>}
            </Box>
        </div>
    )
};

export default ChatPage
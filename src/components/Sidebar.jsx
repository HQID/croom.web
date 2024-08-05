import chatBot from "../assets/chatbot.png"
import dashboard from "../assets/layout.png"
import schedule from "../assets/schedule.png"
import notes from "../assets/writing.png"
import account from "../assets/account.png"
import profile from "../assets/profile.png"
import change from "../assets/change.png"
import croom from "../assets/croom.png"
import { Link, useLocation } from "react-router-dom"
import { HamburgerIcon } from "@chakra-ui/icons"
import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {toast} from 'react-hot-toast'
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  SkeletonCircle
} from '@chakra-ui/react';

const Sidebar = () => {
  const location = useLocation();
  const activePath = location.pathname;
  const [isActive, setActive] = useState(true);
  const [avatar, setAvatar] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { name: 'Dashboard', icon: dashboard, path: '/' },
    { name: 'Schedule', icon: schedule, path: '/schedule' },
    { name: 'Notes', icon: notes, path: '/notes' },
    { name: 'ChatBot', icon: chatBot, path: '/chatbot' },
    { name: 'Account', icon: account, path: '/account' },
  ];

  const toggleSidebar = () => {
    setActive(!isActive);
  };

  const logoutUser = async () => {
    try {
      const res = await axios.post('/logout')
      if(res.data.status) {
        navigate('/login')
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    axios.get('/avatar')
        .then((res) => {
          if(res.data.message === 'Avatar not found') {
            setAvatar(profile)
          } else {
            setAvatar(res.data.img)
          }
        })
        .catch((err) => {
          console.error('Error fetching avatar:', err);
          toast.error(err.message);
        })
        .finally(() => {
          setLoading(false);
      })
  }, [])

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 mobile:px-4 px-6 py-3 border-b bg-white flex justify-between">
        <div className="flex gap-6 justify-center items-center ">
          <div className="hidden mobile:block cursor-pointer"onClick={toggleSidebar}>
            <HamburgerIcon boxSize={8} cursor='pointer' color='gray.700'/>
          </div>
          <img src={croom} alt="Croom" className="w-28 select-none"/>
        </div>
        <div className="size-10 rounded-full border border-slate-300">
          {loading ? <SkeletonCircle size={10}/> : (<img src={avatar} alt="profile" className=""/>)}
        </div>
      </header>
      <div
        className={`flex h-screen w-16 flex-col justify-between border-e bg-white fixed top-16 z-40 transform ${
          isActive ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="border-t border-gray-100">
          <div className="px-2">
            <ul className="flex flex-col gap-6 space-y-1 border-t border-gray-100 pt-4">
              {menuItems.map((item) => (
                <Link to={item.path} key={item.name}>
                  <li>
                    <div
                      className={`group relative flex items-center mobile:justify-center rounded px-2 py-1.5 hover:bg-blue-50 ${
                        activePath === item.path ? "bg-blue-50" : ""
                      }`}
                    >
                      <img src={item.icon} alt={item.name} />
                      <span
                        className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                      >
                        {item.name}
                      </span>
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        </div>
        <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 bg-white p-2">
          <div
              className='group relative flex items-center mobile:justify-center w-full rounded-lg px-2 py-1.5 text-sm hover:bg-blue-50 cursor-pointer'
              onClick={onOpen}
            >
              <img src={change} alt="change account" />
              <span
                className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
              >
                ChangeAccount
              </span>
            </div>
        </div>
      </div>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} size='xs'>
        <ModalOverlay/>
        <ModalContent containerProps={{ alignItems: 'center' }}>
          <ModalHeader textAlign='center'>Are you Sure?</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} display='flex' justifyContent='center' gap={3}>
          <Button bg='gray.700' color='white' _hover={{bg:'red.300'}} mr={3} onClick={logoutUser}>
              Yes
            </Button>
            <Button onClick={onClose}>No</Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Sidebar;

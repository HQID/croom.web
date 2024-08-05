import { useState, useEffect, useContext, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import profile from '../assets/profile.png'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import AccountSkeleton from '../utils/AccountSkeleton';
import { toast } from "react-hot-toast"
import Avatar from 'react-avatar-edit'
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react';

const Account = () => {
    const {user} = useContext(UserContext)
    const email = {
      email: user?.email
    }
    const [edit, setEdit] = useState(false)
    const [datas, setDatas] = useState({
      username: '',
      fullname: '',
  })
    const [loading, setLoading] = useState(true)
    const [file, setFile] = useState('')
    const [preview, setPreview] = useState(null)
    const [avatar, setAvatar] = useState('')
    const { isOpen, onOpen, onClose } = useDisclosure();

  
    const onCrop = useCallback((prev) => {
      setPreview(prev);
      setFile(prev)
    }, []);
  
    const onBeforeFileLoad = useCallback((elem) => {
      if (elem.target.files[0].size > 2097152) {
        toast.error("File should not be more than 2MB", {
          duration: 3000
        });
        elem.target.value = "";
      }
    }, []);

    const handleSave = async () => {
      try {
        const {data} = await axios.post('/avatar', {image: file})
        console.log(data)
        if(data.error) {
          toast.error(data.error);
        } else {
          setAvatar(data.image)
          onClose();
          toast.success('Avatar updated');
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        }
      } catch (err) {
        toast.error('Upload image failed')
        console.log('Error uploading image: ' + err);
        onClose();
      }

    };

    const navigate = useNavigate();
    useEffect(() => {
        axios.get('/verify')
        .then((res) => {
          if(!res.data.status) {
            navigate('/login')
          }
          
        })
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
          setLoading(false)
        })
      }, [])
      

      useEffect(() => {
        if (user) {
          setDatas({
            username: user.username,
            fullname: user.fullname,
          });
        }
      }, [user]);
    

    const saveChanges = async () => {
      try {
        const { data } = await axios.put('/editProfile', datas)
        
        if(data.error) {
          toast.error(data.error)
        } else {
          setEdit(!edit)
          toast.success('Edit Profile Successfully')
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        }
      } catch (err) {
        toast.error('An error occurred while updating profile')
        console.log(err)
      }
    }

    const sendEmail = async () => {
      try {
        const {data} = await axios.post('/verifyEmail',email )
        if(data.error) {
          toast.error(data.error, {
            duration: 5000,
            position: 'top-center'
          })
        } else {
            toast('Check your email for verification', 
            {
              duration: 5000,
              position: 'top-center',
              icon: '📢'
            })
        }
        
      } catch (err) {
        console.log(err)
        toast.error('An error occurred while sending email verification', {
          duration: 5000,
          position: 'top-center'
        })
      }
      
    }

    return (
      <div className='bg-slate-50'>
        <Sidebar/>
        { loading ? <AccountSkeleton/> :
        (<main className='w-full flex flex-col pt-14 justify-center'>
            <section className="w-full py-6 flex flex-col items-center bg-[url('https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-bottom bg-cover bg-no-repeat text-slate-800">
                <h1 className='text-2xl font-bold mobile:text-lg'>Your profile</h1>
                <div className="flex mt-10 flex-col gap-4 items-center">
                    <img src={avatar} alt="Avatar" className="size-32 rounded-full mb-4" />
                    <button onClick={onOpen} className='bg-slate-200 text-slate-900 font-semibold px-3 py-2 rounded-xl text-sm hover:opacity-80 shadow-lg transition duration-500 '>Upload image</button>

                    <Modal isOpen={isOpen} onClose={onClose}>
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>Crop your image</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <Avatar
                            width={390}
                            height={295}
                            onCrop={onCrop}
                            onClose={() => setPreview(null)}
                            onBeforeFileLoad={onBeforeFileLoad}
                            // src={src}
                          />
                          {preview && <img src={preview} alt="Preview" className='w-full h-auto mt-5'/>}
                        </ModalBody>
                        <ModalFooter>
                          <Button bg='gray.700' color='white' mr={4} _hover={{bg:'gray.500'}} borderRadius="xl" fontSize="lg" px={5} py={4}  onClick={handleSave}>
                            Save
                          </Button>
                          <Button borderRadius="xl" fontSize="lg" px={5} py={4} onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>

                    <h2 className='text-xl font-semibold'>{user?.fullname}</h2>
                    <p className='italic font-semibold '>{user?.username}</p>
                </div>
          </section>
          
          <section className='py-8 px-4 w-1/2 flex flex-col gap-6 self-center mobile:w-full mobile:px-6'>
            <div className='gap-2 flex flex-col w-full'>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" value={email.email} className="mt-1 w-full rounded-md bg-white text-sm text-gray-700 shadow-sm p-2 cursor-not-allowed select-none" disabled/>
            </div>
            <div className='gap-2 flex flex-col w-full'>
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" name="fullname" value={datas.fullname} className="mt-1 w-full rounded-md bg-white text-sm text-gray-700 shadow-sm p-2 focus:outline-none focus:ring-primary focus:ring-1" onChange={(e) =>
                setDatas({...datas, fullname: e.target.value})} disabled={!edit}
              />
            </div>
            <div className='gap-2 flex flex-col w-full'>
              <label className="text-sm font-medium text-gray-700">Username</label>
              <input type="text" name="username" value={datas.username} className="mt-1 w-full rounded-md focus:outline-none focus:ring-primary focus:ring-1 bg-white text-sm text-gray-700 shadow-sm p-2" onChange={(e) => setDatas({...datas, username: e.target.value})} disabled={!edit}/>
            </div>
            <div className='gap-2 flex flex-col w-full'>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input type="password" name="password" value='********' className="mt-1 w-full rounded-md bg-white text-sm text-gray-700 shadow-sm p-2" disabled/>
              <p className={`underline self-end cursor-pointer ${edit ? '' : 'hidden'}`} onClick={sendEmail}>Change password</p>
            </div>
          </section>
            <div className='mt-10 my-5 flex self-end gap-4 mr-10 mobile:mr-6 text-lg'>
              <button className={`py-3 px-4 bg-slate-700 font-semibold text-white rounded-xl hover:opacity-80 shadow-lg transition duration-500 ${!edit ? 'hidden' : ''}`} onClick={saveChanges}>Save Changes</button>
              <button className={`py-3 px-4 bg-slate-700 font-semibold text-white rounded-xl hover:opacity-80 shadow-lg transition duration-500 ${edit ? 'hidden' : ''}`} onClick={() => setEdit(!edit)}>Edit Profile</button>
              <button className={`py-3 px-4 bg-red-500 font-semibold text-white rounded-xl hover:opacity-80 shadow-lg transition duration-500 ${edit ? '' : 'hidden'}`} onClick={() => setEdit(false)}>Cancel</button>
            </div>
        </main>)}
      </div>
    );
}

export default Account;

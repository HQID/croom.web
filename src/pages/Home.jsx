import { useContext, useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import UserContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {motion} from 'framer-motion'
import gemini from '../assets/gemini.png'
import vercel from '../assets/vercel.svg'
import { toast } from 'react-hot-toast'

const Home = () => {
  const {user} = useContext(UserContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [datas, setDatas] = useState({
    name: '',
    email: '',
    message: ''
  })

  useEffect(() => {
    axios.get('/verify')
    .then((res) => {
      if(!res.data.status) {
        navigate('/login')
      }
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(datas)
    setLoading(true)
    try {
      const {data} = await axios.post('/send', datas)
      if(data.error) {
        toast.error(data.error)
      } else {
        toast.success('Message sent successfully')
        setDatas({name: '', email: '', message: ''})
      }
    } catch (err) {
      toast.error('Failed to send message')
    } finally {
      setLoading(false)
    }
    
  }

  return (
    <>
      <Sidebar />
      <main className='flex flex-wrap justify-center mt-16 ml-16 z-10 mobile:ml-0'>
        <section className="flex flex-col gap-20 w-full py-20 px-24 mobile:py-14 mobile:px-10 mobile:gap-10 bg-[url('https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-center bg-cover bg-no-repeat bg-gray-400 bg-blend-multiply justify-center items-center">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className='text-5xl font-bold text-white mobile:text-4xl text-center'
          >
            Hello {user?.username}! Welcome to Croom
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className='text-3xl text-white mobile:text-2xl text-center px-[100px] mobile:px-0'
          >
            Let's Start your productivity with Croom, the ultimate productivity website designed to help you take important notes, organize schedules, and chat with a smart chatbot to answer any of your questions.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9}}
            className='text-2xl bg-transparent border-2 border-white py-3 px-6 text-white rounded-xl font-semibold hover:bg-white hover:text-slate-700 shadow-lg transition duration-500 mobile:text-xl'
            onClick={() => navigate('/schedule')}
          >
            Get Started
          </motion.button>
        </section>

        <section className="flex flex-col gap-8 w-full py-16 px-20 mobile:py-0 mobile:px-0 mobile:gap-6 bg-slate-400 justify-center items-center text-slate-700 bg-[url('https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-center bg-cover bg-no-repeat bg-gray-400 bg-blend-multiply">
          <form onSubmit={handleSubmit} className='w-3/4 flex flex-col bg-slate-100 p-10 rounded-2xl mobile:w-full mobile:rounded-none mobile:px-6'>
            <h2 className='text-3xl text-center font-semibold mb-8'>Contact Us</h2>
            <div className="w-full px-4 mb-8">
              <label className="font-bold">Name</label>
              <input type="text" className="w-full text-dark p-3 rounded-md focus:outline-none focus:ring-primary focus:ring-1 focus:border-primary"
              value={datas.name} 
              onChange={(e) => setDatas({
                ...datas, name: e.target.value
                })}
                />
            </div>
            <div className="w-full px-4 mb-8">
              <label className="font-bold">Email</label>
              <input type="email" className="w-full text-dark p-3 rounded-md focus:outline-none focus:ring-primary focus:ring-1 focus:border-primary"
              value={datas.email} 
              onChange={(e) => setDatas({
                ...datas, email: e.target.value
                })}
              />
            </div>
            <div className="w-full px-4 mb-8">
              <label className="font-bold">Message</label>
              <textarea type="text" className="w-full p-3 rounded-md focus:outline-none focus:ring-primary focus:ring-1 focus:border-primary h-32 resize-none"
              value={datas.message} 
              onChange={(e) => setDatas({
                ...datas, message: e.target.value
                })}
                />
            </div>
            <div className="w-full px-4">
                    <button type="submit" className="font-semibold bg-slate-700 text-white py-3 px-8 rounded-xl w-full hover:opacity-80 shadow-lg transition duration-500 disabled:bg-slate-500" disabled={loading}>
                        {loading ? 'Sending...' : 'Send'}
                    </button>
                </div>
          </form>
        </section>

        <footer className='w-full flex flex-col pt-16 bg-slate-900 text-white font-semibold'>
          <div className=' px-20 mb-10 mobile:px-6'>
            <h2 className='text-4xl mb-4'>Croom</h2>
            <p className='text-lg'>web.croom.io@gmail.com</p>
            <p className='text-lg mb-4'>Sulawesi Tengah, Indonesia</p>
            <p className='mb-4'>Powered by:</p>
            <div className='w-full flex flex-row gap-4'>
              <div className='bg-white rounded-full p-2'>
                <img src={gemini} alt=""className='w-8'/>
              </div>
              <div className='bg-white rounded-full p-2'>
                <img src={vercel} alt="" className='w-8'/>
              </div>
            </div>
          </div>
          
          <hr className='bg-white'/>

          <div className='pt-4 py-8 text-center'>
            <p>Copyright&copy; Croom {new Date().getFullYear()}</p>
          </div>

        </footer>
      </main>
    </>
  );
}

export default Home;

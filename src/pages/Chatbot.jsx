import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import profile from '../assets/profile.png';
import bot from '../assets/bot.png';
import ChatSkeleton from '../utils/ChatbotSkeleton';
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast'


const Chatbot = () => {
    const navigate = useNavigate()
    const [prompt, setPrompt] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState('');
    
    useEffect(() => {
        axios.get('/verify')
        .then((res) => {
        if(!res.data.status) {
            navigate('/login')
        }
        })
    }, [navigate])

    useEffect(() => {
        setLoading(true);
        axios.get('/chatHistory')
        .then(({data}) => {
            const filteredHistory = data[0].history.map(entry => ({
                role: entry.role,
                parts: entry.parts.map(part => ({ text: part.text }))
            }));
            setChatHistory(filteredHistory);
        })
        .catch(error => {
            console.log(error);
          })
        .finally(() => {
            setLoading(false);
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
              });
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
              setLoading(false);
          })
    }, [])
    

    const promptHandle = (e) => {
        setPrompt(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e)
        }
    }

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        setLoading(true);

        const options = {
            history: chatHistory,
            message: prompt,
            generationConfig: {
                temperature: 1,
                topP: 0.95,
                topK: 64,
                maxOutputTokens: 8192,
                responseMimeType: "text/plain",
            }

        };

        try {
            const {data} = await axios.post('/chatbot', options);

            await axios.post('/chatHistory', {
                history: [
                  {
                    role: 'user',
                    parts: [{ text: prompt }],
                  },
                  {
                    role: 'model',
                    parts: [{ text: data }],
                  },
                ],
              });

            setChatHistory(oldChatHistory => [
                ...oldChatHistory,
                {
                    role: 'user',
                    parts: [{ text: prompt }]
                },
                {
                    role: 'model',
                    parts: [{ text: data}]
                }
            ]);
            setPrompt('');
        } catch (error) {
            console.log(error);
            toast.error('An error occurred while processing your request');
        } finally {
            setLoading(false);
        }
    };

    const decodeHtml = (html) => {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = html;
        return textArea.value;
      };

      const decodeStyle = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
      
        doc.querySelectorAll('li').forEach(li => {
          li.style.listStyleType = 'disc';
          li.style.marginLeft = '20px'// You can change 'disc' to other types if needed
        });

        doc.querySelectorAll('a').forEach(a => {
            a.style.color = '#4299e1';
        })
      
        return doc.body.innerHTML;
      };

    return (
        <>
            <Sidebar />
            <main className='w-full flex flex-col pl-[30px] items-center justify-center pt-10 mobile:ml-0 mobile:p-0'>
                <div className='w-full py-4 flex fixed top-14 bg-white justify-center'>
                    <h1 className='text-2xl font-bold mt-[6px] mobile:text-lg text-slate-700'>Chat with our Bot, EidaBoo 🐱‍💻</h1>
                </div>

                <div className='w-3/4 h-3/4 flex flex-col gap-10 mt-28 mb-24 mobile:mt-36 mobile:w-full mobile:px-4 mobile:gap-6 bg-transparent'>
                    {chatHistory.map((chatItem, index) => (
                        <div key={index} className={`flex ${chatItem.role === 'user' ? 'justify-end' : 'justify-start'} gap-2.5`}>
                            {chatItem.role === 'model' && <div className="w-8 h-8 border border-slate-500 rounded-full"><img className="" src={bot} alt="EidaBoo" /></div>}
                            <div className={`flex flex-col max-w-[600px] py-2 px-4 ${chatItem.role === 'user' ? 'bg-blue-100' : 'bg-slate-100'} rounded-xl ${chatItem.role === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'} mobile:w-2/3`}>
                                <div className="text-sm font-normal py-2.5 text-gray-900">
                                    {chatItem.parts.map((part, idx) => (
                                        <div key={idx} dangerouslySetInnerHTML={{ __html: decodeStyle(decodeHtml(part.text)) }}></div>
                                    ))}
                                </div>
                            </div>
                            {chatItem.role === 'user' && <img className="w-8 h-8 rounded-full" src={avatar} alt="avatar" />}
                        </div>
                    ))}
                    {loading && (
                        <ChatSkeleton />
                    )}
                </div>

                <div className='w-full fixed bottom-0 flex pb-4 px-6 bg-white mobile:px-0'>
                    <form className='w-full flex flex-row justify-center items-center gap-1 mobile:px-3' onSubmit={handleSubmit}>
                        <textarea
                            placeholder="Send a message to EidaBoo"
                            id="prompt"
                            className='w-3/5 resize-none py-2 px-4 bg-slate-100 h-[50px] rounded-lg no-scrollbar mobile:w-full focus:outline-none focus:ring-primary focus:ring-1'
                            value={prompt}
                            onChange={promptHandle}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            type='submit'
                            className='text-lg bg-slate-700 text-white p-3 rounded-md disabled:bg-slate-500 shadow-lg transition duration-500'
                            disabled={!prompt.trim() || loading}
                            
                        >
                            Send
                        </button>
                    </form>
                </div>
            </main>
        </>
    );
};

export default Chatbot;

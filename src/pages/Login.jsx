import { useState, useEffect } from 'react';
import { Link } from "react-router-dom"
import axios from "axios"
import {toast} from "react-hot-toast"
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        axios.get('/verify')
        .then((res) => {
          if(res.data.status) {
            navigate('/')
          }
        })
      }, [])

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const loginUser =  async (e) => {
        e.preventDefault();
        
        try {
            const {data} = await axios.post('/login', {
                email,
                password
            })
            if(data.error) {
                toast.error(data.error)
            } else {
                setEmail('');
                setPassword('');
                navigate('/')
                window.location.reload()
                // toast.success('Login Successful')
            }
        } catch (err) {
            toast.error('Login Failed')
            console.log(err);
        }

    }

    return (
        <>
            <div className="mx-auto h-[100vh] flex justify-center items-center">
                <div className="mx-auto w-2/5 mobile:w-4/5">
                    <h1 className="text-center text-2xl font-bold text-slate-800 sm:text-3xl">Sign In to Croom</h1>

                    <form onSubmit={loginUser} className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8">
                        <p className="text-center text-lg font-medium">Sign in to your account</p>

                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>

                            <div className="relative">
                                <input
                                    type="email"
                                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={handleEmailChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>

                            <div className="relative">
                                <input
                                    type={passwordVisible ? 'text' : 'password'}
                                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                />

                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 end-0 flex items-center px-4 text-gray-400"
                                >
                                    {passwordVisible ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10S6.477-1 12-1s10 4.477 10 10c0 1.31-.252 2.558-.715 3.709M15 10a3 3 0 00-3-3m0 0a3 3 0 00-3 3m6 0a3 3 0 01-3 3m0 0a3 3 0 01-3-3"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="block w-full rounded-lg bg-slate-700 px-5 py-3 text-sm font-medium text-white hover:bg-slate-900"
                        >
                            Sign in
                        </button>

                        <p className="text-center text-sm text-gray-500">
                            No account?
                            <Link to='/signup'>
                            <span className="underline">Sign up</span>
                            </Link>
                            
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;

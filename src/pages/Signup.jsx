import { useEffect, useState } from 'react';
import img from '../assets/img2.jpg'
import { Link } from "react-router-dom"
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
    const navigate = useNavigate();
    const [datas, setDatas] = useState({
        fullname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [isFormValid, setIsFormValid] = useState(false)

    useEffect(() => {
        setIsFormValid(
            datas.fullname.trim()!== '' &&
            datas.username.trim()!== '' &&
            datas.email.trim()!== '' &&
            datas.password.trim()!== '',
            datas.password === datas.confirmPassword
        )
    }, [datas])

    const registerUser = async (ev) => {
        ev.preventDefault();
        try {
            const {data} = await axios.post('/signup', datas);
            if (data.error) {
                toast.error(data.error);
            } else {
                setDatas({
                    fullname: '',
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });
                toast.success('Registration successful');
                navigate('/login');
            }
        } catch (err) {
            toast.error('Registration failed');
            console.log(err);
        }
    };
    
    return (
            <section className="bg-white">
                <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
                    <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
                        <img
                            alt=""
                            src={img}
                            className="absolute inset-0 h-full w-full object-cover opacity-80"
                        />
                        <div className="hidden lg:relative lg:block lg:p-12">
                            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                                Welcome to Croom
                            </h2>
                            <p className="mt-4 leading-relaxed text-white/90">
                            Croom is a productivity website that can help you as a user to write important notes, arrange schedules and chatbots to ask any questions.
                            </p>
                        </div>
                    </section>

                    <main className="flex items-center justify-center px-8 py-6 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
                        <div className="max-w-xl lg:max-w-3xl">
                            <div className="relative block lg:hidden">
                                <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                                    Welcome to Croom
                                </h1>
                                <p className="mt-4 leading-relaxed text-gray-500">
                                Croom is a productivity website that can help you as a user to write important notes, arrange schedules and chatbots to ask any questions.
                                </p>
                            </div>
                            <form onSubmit={registerUser} className="mt-8 grid grid-cols-6 gap-6">
                                <div className="col-span-6">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fullname"
                                        value={datas.fullname}
                                        onChange={(e) => setDatas({
                                            ...datas, fullname: e.target.value
                                        })}
                                        className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm p-2"
                                    />
                                </div>
                                <div className="col-span-6">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={datas.username}
                                        onChange={(e) => setDatas({
                                            ...datas, username: e.target.value
                                        })}
                                        className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm p-2"
                                    />
                                </div>
                                <div className="col-span-6">
                                    <label className="block text-sm font-medium text-gray-700"> Email </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={datas.email}
                                        onChange={(e) => setDatas({
                                            ...datas, email: e.target.value
                                        })}
                                        className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm p-2"
                                    />
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700"> Password </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={datas.password}
                                        onChange={(e) => setDatas({
                                            ...datas, password: e.target.value
                                        })}
                                        className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm p-2"
                                    />
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Password Confirmation
                                    </label>
                                    <input
                                        type="password"
                                        name="password_confirmation"
                                        value={datas.confirmPassword}
                                        onChange={(e) => setDatas({
                                            ...datas, confirmPassword: e.target.value
                                        })}
                                        className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm p-2"
                                    />
                                </div>
                                <div className="col-span-6">
                                    <p className="text-sm text-gray-500">
                                        By creating an account, you agree to our
                                        <span className="text-gray-700 underline cursor-pointer"> terms and conditions </span>
                                        and
                                        <span className="text-gray-700 underline cursor-pointer">privacy policy</span>.
                                    </p>
                                </div>
                                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                                    <button disabled={!isFormValid} className="inline-block shrink-0 rounded-md border border-slate-600 bg-slate-700 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-slate-700 focus:outline-none focus:ring active:text-slate-600 disabled:bg-slate-500 disabled:hover:text-white">
                                        Create an account
                                    </button>
                                    <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                                        Already have an account? 
                                        <Link to='/login'>
                                        <span className="text-gray-700 underline">Log in</span>.
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </main>
                </div>
            </section>
    );
};

export default Signup;

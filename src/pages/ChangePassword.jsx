import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';
import {toast} from 'react-hot-toast'

const ChangePassword = () => {
    const navigate = useNavigate()
    const {token} = useParams()

    useEffect(() => {
        axios.get('/verify')
        .then((res) => {
        if(!res.data.status) {
            navigate('/login')
        }
        })
    }, [])

    const [datas, setDatas] = useState({
        password: '',
        confirmPassword: ''
    })

    const submitPassword = async (ev) => {
        ev.preventDefault()
        try {
            const {data} = await axios.put(`/changePassword/${token}`, datas);
            if(data.error === 'Token is Expired') {
                toast.error(data.error, {
                    duration: 5000,
                    position: 'top-right'
                })
                navigate('/account')
            } else if(data.error) {
                toast.error(data.error)
            } else {
                setDatas({
                    password: '',
                    confirmPassword: ''
                })
                toast.success('Password Changed Successfully')
                navigate('/account')
            }
        } catch (err) {
            toast.error('Change Password Failed')
            console.log(err)
        }
    }

    return (
        <div className="flex justify-center items-center w-full h-[100vh]">
            <form onSubmit={submitPassword} className="w-[45%] space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8 mobile:w-full flex flex-col gap-6">
                        <p className="text-center text-xl font-medium">Change Password</p>

                            <div>
                                <label className="text-sm font-medium text-gray-700">New Password</label>
                                <input
                                    type="password"
                                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm mt-3"
                                    placeholder="Enter password"
                                    value={datas.password}
                                    onChange={(e) => {
                                        setDatas({...datas, password: e.target.value})
                                    }}
                                />
                            </div>
                                

                        <div>

                            <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                                <input
                                    type='password'
                                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm mt-3"
                                    placeholder="Confrim password"
                                    value={datas.confirmPassword}
                                    onChange={(e) => {
                                        setDatas({...datas, confirmPassword: e.target.value})
                                    }}
                                />

                        </div>

                        <button
                            type="submit"
                            className="block w-full rounded-lg bg-slate-700 px-5 py-3 text-sm font-medium text-white hover:bg-slate-900"
                        >
                            Send
                        </button>
                    </form>
        </div>
    )
}

export default ChangePassword;
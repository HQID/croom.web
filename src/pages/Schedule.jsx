import Sidebar from "../components/Sidebar";
import Calendar from "../components/Calendar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

const Schedule = () => {
    const navigate = useNavigate()

    useEffect(() => {
        axios.get('/verify')
        .then((res) => {
        if(!res.data.status) {
            navigate('/login')
        }
        })
    }, [])
    
    return (
        <>
        <Sidebar />
        <div className="flex pl-[80px] h-[100vh] mobile:h-full bg-slate-50 p-6 gap-6 mobile:pl-6 mobile:flex-col py-[90px] mobile:gap-0">
            <Calendar/>
        </div>
        </>
    )
}

export default Schedule;
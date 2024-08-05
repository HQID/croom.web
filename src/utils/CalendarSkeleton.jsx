import { Skeleton } from '@chakra-ui/react'

const CalendarSkeleton = () => {
    return (
        <div className='w-full'>
            <Skeleton height='500px' borderRadius={5}/>
        </div>
    )
}

export default CalendarSkeleton;
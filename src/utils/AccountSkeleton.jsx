import { Skeleton, SkeletonCircle, Stack, SkeletonText } from '@chakra-ui/react'

const AccountSkeleton = () => {
    return (
        <div className='pt-36 flex flex-col items-center'>
            <Stack gap={4} display='flex' flexDir='column' alignItems='center' w='100%'>
                <SkeletonCircle size='150' mb={4}/>
                <SkeletonText mb={4} spacing='6' skeletonHeight='4' className='w-1/3'/>
            </Stack>
            <hr className=' border-slate-500 w-full my-10'/>
            <Stack gap='50px' w='45%'>
                <Skeleton height='30px'/>
                <Skeleton height='30px'/>
                <Skeleton height='30px'/>
                <Skeleton height='30px'/>
            </Stack>
        </div>
        
    )
}

export default AccountSkeleton
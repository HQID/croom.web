import { SkeletonCircle, Stack, SkeletonText } from '@chakra-ui/react'

const ChatSkeleton = () => {
    return (
        <>
        <Stack gap={4} display='flex' flexDir='row' justifyContent='end'>
            <SkeletonText mb='4' noOfLines={4} spacing='4' skeletonHeight='3' className='w-2/3'/>
            <SkeletonCircle size='10'/>
        </Stack>
        <Stack gap={4} display='flex' flexDir='row'>
            <SkeletonCircle size='10'/>
            <SkeletonText mb='4' noOfLines={4} spacing='4' skeletonHeight='3' className='w-2/3'/>
        </Stack>
        </>
        
    )
}

export default ChatSkeleton
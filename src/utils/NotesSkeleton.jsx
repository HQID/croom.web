import { Skeleton, Stack } from '@chakra-ui/react'

const NotesSkeleton = () => {
    return (
        <Stack gap={4}>
            <Skeleton height='150px' />
            <Skeleton height='150px' />
            <Skeleton height='150px' />
            <Skeleton height='150px' />
        </Stack>
    )
}

export default NotesSkeleton
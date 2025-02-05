import { Box, Flex, Grid, GridItem, Spinner } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import subjectsAtom from '../atoms/subjectAtom'
import userAtom from '../atoms/userAtom'
import BoardCard from '../components/Cards/BoardCard'
import Sidebar from '../components/Sidebar/Sidebar'
import CreateSubjectModal from '../components/Subjects/CreateSubject'

const HomePage = () => {
  const user = useRecoilValue(userAtom)
  const [loading, setLoading] = useState(true)
  const [subjects, setSubjects] = useRecoilState(subjectsAtom)
  useEffect(() => {
    const getSubjects = async () => {
      if (!user) return
      setSubjects([])
      try {
        setLoading(true)
        const res = await fetch(`/v1/api/subjects/list`)
        const data = await res.json()

        setSubjects(data)
        setLoading(false)
      } catch (error) {
        setSubjects([])
      } finally {
        setLoading(false)
      }
    }

    getSubjects()
  }, [setSubjects, user])

  return (
    <Flex>
      <Box width={'300px'} className="hidden lg:block  ">
        <Sidebar />
      </Box>

      <Box mt={4} width={'100%'}>
        <CreateSubjectModal setSubjects={setSubjects} />
        <Grid
          gap={4}
          templateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          }}
          mt={4}
        >
          {loading && (
            <Flex justifyContent={'center'}>
              <Spinner size={'xl'} />
            </Flex>
          )}
          {subjects.length === 0 && !loading && <Box>No subjects found</Box>}
          {subjects.map((subject) => (
            <GridItem key={subject._id}>
              <BoardCard subject={subject} />
            </GridItem>
          ))}
        </Grid>
      </Box>
    </Flex>
  )
}

export default HomePage

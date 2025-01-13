import {
  Button,
  Container,
  Flex,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  VStack,
  HStack,
  StackDivider,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect, //useState,
   useRef } from "react"
import { z } from "zod"

import { PetitionsService, type Dim_PetitionPublicMe } from "../../client"
import Navbar from "../../components/Common/Navbar"
import AddPetition from "../../components/Petitions/AddPetition"
import VotePetition from "../../components/Petitions/VotePetition"

const itemsSearchSchema = z.object({
  page: z.number().catch(1),
})

export const Route = createFileRoute("/_layout/petitions")({
  component: Petitions,
  validateSearch: (search) => itemsSearchSchema.parse(search),
})

const PER_PAGE = 10

function getPetitionsQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      PetitionsService.readPetitions({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
    queryKey: ["petitions", { page }],
  }
}

function PetitionsList() {
  const {
    isOpen, onOpen,
    onClose
} = useDisclosure();
  const queryClient = useQueryClient()
  const { page } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const setPage = (page: number) =>
    navigate({ search: (prev) => ({ ...prev, page }) })

  const {
    data: petitions, 
    isPending,
    isPlaceholderData,
  } = useQuery({
    ...getPetitionsQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  })

  const hasNextPage = !isPlaceholderData && petitions?.petitions.length === PER_PAGE
  const hasPreviousPage = page > 1

  useEffect(() => {
    if (hasNextPage) {
      queryClient.prefetchQuery(getPetitionsQueryOptions({ page: page + 1 }))
    }
  }, [page, queryClient, hasNextPage])

  // const [curState, setCurState] = useState<Dim_PetitionPublicMe>({
  //   status: "",
  //   petition_title: "",
  //   petition_text: "",
  //   response: "",
  //   vote_threshold: 0,
  //   id: "",
  //   signatures: 0,
  //   action: ""
  // })
  const currState = useRef<Dim_PetitionPublicMe>({
    status: "",
    petition_title: "",
    petition_text: "",
    response: "",
    vote_threshold: 0,
    id: "",
    signatures: 0,
    action: ""
  })
  const currentPetition = (petition: Dim_PetitionPublicMe) => {
    // setCurState(petition)
    currState.current = petition
    // console.log(curState)
    console.log(currState)
  }

  return (
    <>
        { isPending ? (
            <Container alignItems='center'>
              <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='blue.500'
                size='xl'
              />
            </Container>
          ) : (
            <Accordion allowToggle size={{ base: "sm", md: "md" }}>
              {petitions?.petitions.map((petition) => (
                <AccordionItem >
                <h2>
                  <AccordionButton>
                    <Box textAlign='left' shadow="md">
                      {petition.petition_title?.toUpperCase()}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <VStack 
                    divider={<StackDivider borderColor='#4A5568' />}
                    spacing={4}
                    align='left'>
                      <Box>
                        <HStack>
                          <Text as='b'>Status: </Text>
                        {
                          petition.status == 'open' ? (
                            <Text as='b' color='green'> {petition.status} </Text>
                          ) : (
                            <Text as='b' color='red'> {petition.status} </Text>
                          )
                        }
                        </HStack>
                      </Box>
                      <Box>
                        <HStack>
                            <Text as='b'>Details: </Text>
                            <Text > {petition.petition_text} </Text>
                          </HStack>
                      </Box>
                      <Box>
                        <HStack>
                            <Text as='b'>Response: </Text>
                            <Text > {petition.response} </Text>
                          </HStack>
                      </Box>
                      <Box>
                        <HStack>
                            <Text as='b'>Signature(s): </Text>
                            <Text > {petition.signatures} </Text>currState.current = petition
                          </HStack>
                      </Box>
                      <Box>
                        <HStack>
                            <Text as='b'>Signature Threshold(s): </Text>
                            <Text > {petition.vote_threshold} </Text>currState.current = petition
                          </HStack>
                      </Box>
                      <Box>
                        <Button onClick = {onOpen} onClickCapture={() => {currentPetition(petition)}} isDisabled={petition.action === "SIGNED" || petition.status === 'closed'}>
                            Vote
                        </Button>
                        <VotePetition petition={currState.current} isOpen={isOpen} onClose={onClose}></VotePetition>
                      </Box>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
              ))
              }
            </Accordion>
          ) 
        }
        
      <Flex
        gap={4}
        alignItems="center"
        mt={4}
        direction="row"
        justifyContent="flex-end"
      >
        <Button onClick={() => setPage(page - 1)} isDisabled={!hasPreviousPage}>
          Previous
        </Button>
        <span>Page {page}</span>
        <Button isDisabled={!hasNextPage} onClick={() => setPage(page + 1)}>
          Next
        </Button>
      </Flex>
    </>
  )
}

function Petitions() {
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
        Petitions
      </Heading>

      <Navbar type={"Partition"} addModalAs={AddPetition} />
      <PetitionsList />
    </Container>
  )
}

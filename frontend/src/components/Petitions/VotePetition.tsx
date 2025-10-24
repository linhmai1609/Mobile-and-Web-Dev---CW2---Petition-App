import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type SubmitHandler, useForm } from "react-hook-form"

import { type ApiError, Dim_PetitionPublicMe, type Facts_PetitionCreate, PetitionsService } from "../../client"
import useCustomToast from "../../hooks/useCustomToast"
import { handleError } from "../../utils"

interface VotePetitionProps {
  petition: Dim_PetitionPublicMe
  isOpen: boolean
  onClose: () => void
}

const VotePetition = ({ petition, isOpen, onClose }: VotePetitionProps) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()
  const {
    handleSubmit,
    reset,
    formState: {isSubmitting },
  } = useForm<Facts_PetitionCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      action: "SIGNED",
      message: "",
    },
  })

  const mutation = useMutation({
    mutationFn: (data: Facts_PetitionCreate) =>
      PetitionsService.votePetition({ id: petition.id, requestBody: data }),
    onSuccess: () => {
      showToast("Success!", "Petition voted successfully.", "success")
      reset()
      onClose()
    },
    onError: (err: ApiError) => {
      handleError(err, showToast)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["petitions"] })
    },
  })

  const onSubmit: SubmitHandler<Facts_PetitionCreate> = (data) => {
    mutation.mutate(data)
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "sm", md: "md" }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Vote Petition</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text > Do you wish to vote for the petition {petition.petition_title?.toUpperCase()}? </Text>
          </ModalBody>

          <ModalFooter gap={3}>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Yes
            </Button>
            <Button onClick={onClose}>No</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default VotePetition

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type SubmitHandler, useForm } from "react-hook-form"

import { type ApiError, type Dim_PetitionPublicMe, type Dim_PetitionUpdate, PetitionsService } from "../../client"
import useCustomToast from "../../hooks/useCustomToast"
import { handleError } from "../../utils"

interface ClosePetitionProps {
  petition: Dim_PetitionPublicMe
  isOpen: boolean
  onClose: () => void
}

const ClosePetition = ({petition, isOpen, onClose }: ClosePetitionProps) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Dim_PetitionUpdate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      status: "closed",
      response: "",
    },
  })

  const mutation = useMutation({
    mutationFn: (data: Dim_PetitionUpdate) =>
      PetitionsService.updatePetition({ id: petition.id, requestBody: data, addons: petition}),
    onSuccess: () => {
      showToast("Success!", "Petition closed successfully.", "success")
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

  const onSubmit: SubmitHandler<Dim_PetitionUpdate> = (data) => {
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
          <ModalHeader>Response And Close Petition</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired isInvalid={!!errors.response}>
              <FormLabel htmlFor="response">Title</FormLabel>
              <Input
                id="response"
                {...register("response", {
                  required: "Respond is required.",
                })}
                placeholder="Respond"
                type="text"
              />
              {errors.response && (
                <FormErrorMessage>{errors.response.message}</FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter gap={3}>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Save Respond And Close Petition
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ClosePetition

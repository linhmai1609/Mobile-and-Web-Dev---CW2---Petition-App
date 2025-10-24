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

import { type ApiError, type Dim_PetitionCreate, PetitionsService } from "../../client"
import useCustomToast from "../../hooks/useCustomToast"
import { handleError } from "../../utils"

interface AddPetitionProps {
  isOpen: boolean
  onClose: () => void
}

const AddPetition = ({ isOpen, onClose }: AddPetitionProps) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Dim_PetitionCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      status: "open",
      petition_title: "",
      petition_text: "",
      response: "",
      vote_threshold: 0
    },
  })

  const mutation = useMutation({
    mutationFn: (data: Dim_PetitionCreate) =>
      PetitionsService.createPetition({ requestBody: data }),
    onSuccess: () => {
      showToast("Success!", "Petition created successfully.", "success")
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

  const onSubmit: SubmitHandler<Dim_PetitionCreate> = (data) => {
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
          <ModalHeader>Add Petition</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired isInvalid={!!errors.petition_title}>
              <FormLabel htmlFor="petition_title">Title</FormLabel>
              <Input
                id="petition_title"
                {...register("petition_title", {
                  required: "Title is required.",
                })}
                placeholder="Title"
                type="text"
              />
              {errors.petition_title && (
                <FormErrorMessage>{errors.petition_title.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl mt={4}>
              <FormLabel htmlFor="description">Description</FormLabel>
              <Input
                id="petition_text"
                {...register("petition_text")}
                placeholder="Description"
                type="text"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter gap={3}>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddPetition

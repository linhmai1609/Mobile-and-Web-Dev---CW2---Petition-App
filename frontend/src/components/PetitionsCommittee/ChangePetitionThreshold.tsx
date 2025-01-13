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

import { type ApiError, type TDataUpdatePetitionThreshold, PetitionsService } from "../../client"
import useCustomToast from "../../hooks/useCustomToast"
import { handleError } from "../../utils"

interface ChangePetitionThresholdProps {
  isOpen: boolean
  onClose: () => void
}

const ChangePetitionThreshold = ({ isOpen, onClose }: ChangePetitionThresholdProps) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      threshold: 0
    },
  })

  const mutation = useMutation({
    mutationFn: (data : number) =>
      PetitionsService.updateThreshold({ threshold : data }),
    onSuccess: () => {
      showToast("Success!", "Petition vote threshold has been changed successfully.", "success")
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
  // onSubmit: SubmitHandler<Dim_PetitionCreate> = (data) => {
  const onSubmit: SubmitHandler<TDataUpdatePetitionThreshold> = (data) => {
    console.log(data)
    mutation.mutate(data.threshold)
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
          <ModalHeader>Change Vote Threshold</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired isInvalid={!!errors.threshold}>
              <FormLabel htmlFor="threshold">Threshold</FormLabel>
              <Input
                id="threshold"
                {...register("threshold", {
                  required: "Threshold is required.",
                  validate: {
                    lessThanFifty: v => v < 50,
                    positive: v => v > 0,
                  }
                })}
                placeholder="Threshold"
                type="number"
              />
              {errors.threshold && (
                <FormErrorMessage>{errors.threshold.message}</FormErrorMessage>
              )}
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

export default ChangePetitionThreshold

import { trpc } from "~/trpc/client"

export function useSignup() {
    const { mutateAsync: createUserEmailAndPasswordAsync, mutate: createUserEmailAndPassword, error, failureCount, isError, isIdle, isSuccess, isPending, status } = trpc.auth.createUserEmailAndPassword.useMutation()

    return { createUserEmailAndPasswordAsync, createUserEmailAndPassword, error, failureCount, isError, isIdle, isSuccess, isPending, status }
}

export function useVerifyEmail(token : string) {
    const { data: verifyEmailData, isLoading: isVerifyEmailLoading, isError: isVerifyEmailError, error: verifyEmailError, isSuccess: isVerifyEmailSuccess, status: verifyEmailStatus } = trpc.auth.verifyEmail.useQuery({ token })
    return { verifyEmailData, isVerifyEmailLoading, isVerifyEmailError, verifyEmailError, isVerifyEmailSuccess, verifyEmailStatus }
}
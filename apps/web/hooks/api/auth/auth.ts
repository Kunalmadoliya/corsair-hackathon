import { trpc } from "~/trpc/client"

export function useSignup() {
    const { mutateAsync: createUserEmailAndPasswordAsync, mutate: createUserEmailAndPassword, error, failureCount, isError, isIdle, isSuccess, isPending, status } = trpc.auth.createUserEmailAndPassword.useMutation()

    return { createUserEmailAndPasswordAsync, createUserEmailAndPassword, error, failureCount, isError, isIdle, isSuccess, isPending, status }
}

export function useVerifyEmail(token : string) {
    const { data: verifyEmailData, isLoading: isVerifyEmailLoading, isError: isVerifyEmailError, error: verifyEmailError, isSuccess: isVerifyEmailSuccess, status: verifyEmailStatus } = trpc.auth.verifyEmail.useQuery({ token } , {enabled: !!token,})
    return { verifyEmailData, isVerifyEmailLoading, isVerifyEmailError, verifyEmailError, isVerifyEmailSuccess, verifyEmailStatus }
}

export function useLogin() {
    const { mutateAsync: loginUserEmailAndPasswordAsync, mutate: loginUserEmailAndPassword, error, failureCount, isError, isIdle, isSuccess, isPending, status } = trpc.auth.loginUserEmailAndPassword.useMutation()

    return { loginUserEmailAndPasswordAsync, loginUserEmailAndPassword, error, failureCount, isError, isIdle, isSuccess, isPending, status }
}

export function useLogout() {
    const { mutateAsync: logoutUserAsync, mutate: logoutUser, error, failureCount, isError, isIdle, isSuccess, isPending, status } = trpc.auth.logoutUser.useMutation()

    return { logoutUserAsync, logoutUser, error, failureCount, isError, isIdle, isSuccess, isPending, status }
}

export function useLoginWithOAuth() {
    const { mutateAsync: loginWithOAuthAsync, mutate: loginWithOAuth, error, isError, isPending, status } = trpc.auth.loginWithOAuth.useMutation()

    return { loginWithOAuthAsync, loginWithOAuth, error, isError, isPending, status }
}

export function useSupportedProviders() {
    const { data: providers, isLoading, isError, error } = trpc.auth.getSupportedAuthenticationProviders.useQuery()

    return { providers, isLoading, isError, error }
}
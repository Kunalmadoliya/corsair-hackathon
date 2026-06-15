import { trpc } from "~/trpc/client"

export function useSignup() {
    const utils = trpc.useUtils()
    const { mutateAsync: createUserEmailAndPasswordAsync, mutate: createUserEmailAndPassword, error, failureCount, isError, isIdle, isSuccess, isPending, status } = trpc.auth.createUserEmailAndPassword.useMutation({
        onSuccess : () => {
            utils.auth.getUserWithToken.invalidate()
        }
    })

    return { createUserEmailAndPasswordAsync, createUserEmailAndPassword, error, failureCount, isError, isIdle, isSuccess, isPending, status }
}

export function useVerifyEmail(token : string) {
    const utils = trpc.useUtils()
    const { data: verifyEmailData, isLoading: isVerifyEmailLoading, isError: isVerifyEmailError, error: verifyEmailError, isSuccess: isVerifyEmailSuccess, status: verifyEmailStatus } = trpc.auth.verifyEmail.useQuery({ token } , {enabled: !!token,})
    return { verifyEmailData, isVerifyEmailLoading, isVerifyEmailError, verifyEmailError, isVerifyEmailSuccess, verifyEmailStatus }
}

export function useLogin() {
    const utils = trpc.useUtils()
    const { mutateAsync: loginUserEmailAndPasswordAsync, mutate: loginUserEmailAndPassword, error, failureCount, isError, isIdle, isSuccess, isPending, status } = trpc.auth.loginUserEmailAndPassword.useMutation({
        onSuccess : ( ) => {
            utils.auth.getUserWithToken.invalidate()
        }
    })

    return { loginUserEmailAndPasswordAsync, loginUserEmailAndPassword, error, failureCount, isError, isIdle, isSuccess, isPending, status }
}

export function useLogout() {
    const utils = trpc.useUtils()
    const { mutateAsync: logoutUserAsync, mutate: logoutUser, error, failureCount, isError, isIdle, isSuccess, isPending, status } = trpc.auth.logoutUser.useMutation({
        onSuccess : () => {
            utils.auth.getUserWithToken.invalidate()
        }
    })

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

export function usegetUser(){
 const { data: user, isLoading, isError, error } = trpc.auth.getUserWithToken.useQuery()

    return { user, isLoading, isError, error }
}
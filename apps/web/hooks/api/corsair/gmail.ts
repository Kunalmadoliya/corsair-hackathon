import { trpc } from "~/trpc/client"

export const useConnectGmail = () => {
    const utils = trpc.useUtils()
    const { mutateAsync: connectGmailAsync, mutate: connectGmail, isPending, error } = trpc.corsairGmail.connectGmail.useMutation({
        onSuccess: () => {
            utils.auth.getUserWithToken.invalidate()
        }
    })

    return { connectGmailAsync, connectGmail, isPending, error }
}

export const useReadGmail = () => {
    const { mutateAsync: readGmailAsync, mutate: readGmail, isPending, error } = trpc.corsairGmail.readGmail.useMutation()

    return { readGmailAsync, readGmail, isPending, error }
}

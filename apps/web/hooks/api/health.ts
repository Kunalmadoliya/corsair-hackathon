import { trpc } from "~/trpc/client"

export function useHealth() {
    const { data, status, isFetched, isError } = trpc.health.getHealth.useQuery();

    return {
        data, status, isFetched, isError
    }
}
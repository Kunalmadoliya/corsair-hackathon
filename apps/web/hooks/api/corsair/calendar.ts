import { trpc } from "~/trpc/client";

export const useConnectCalendar = () => {
    const utils = trpc.useUtils();
    const { mutateAsync: connectCalendarAsync, mutate: connectCalendar, isPending, error } = trpc.corsairCalendar.connectCalendar.useMutation({
        onSuccess: () => {
            utils.auth.getUserWithToken.invalidate();
        }
    });

    return { connectCalendarAsync, connectCalendar, isPending, error };
}

export const useCalendarCallback = () => {
    const { mutateAsync: calendarCallbackAsync, mutate: calendarCallback, isPending, error } = trpc.corsairCalendar.calendarCallback.useMutation();
    return { calendarCallbackAsync, calendarCallback, isPending, error };
}

export const useGetAvailability = () => {
    const { mutateAsync: getAvailabilityAsync, mutate: getAvailability, isPending, error, data } = trpc.corsairCalendar.getAvailability.useMutation();
    return { getAvailabilityAsync, getAvailability, isPending, error, data };
}

export const useCreateEvent = () => {
    const { mutateAsync: createEventAsync, mutate: createEvent, isPending, error, data } = trpc.corsairCalendar.createEvent.useMutation();
    return { createEventAsync, createEvent, isPending, error, data };
}

export const useDeleteEvent = () => {
    const { mutateAsync: deleteEventAsync, mutate: deleteEvent, isPending, error, data } = trpc.corsairCalendar.deleteEvent.useMutation();
    return { deleteEventAsync, deleteEvent, isPending, error, data };
}

export const useGetEvent = () => {
    const { mutateAsync: getEventAsync, mutate: getEvent, isPending, error, data } = trpc.corsairCalendar.getEvent.useMutation();
    return { getEventAsync, getEvent, isPending, error, data };
}

export const useGetManyEvents = () => {
    const { mutateAsync: getManyEventsAsync, mutate: getManyEvents, isPending, error, data } = trpc.corsairCalendar.getManyEvents.useMutation();
    return { getManyEventsAsync, getManyEvents, isPending, error, data };
}

export const useUpdateEvent = () => {
    const { mutateAsync: updateEventAsync, mutate: updateEvent, isPending, error, data } = trpc.corsairCalendar.updateEvent.useMutation();
    return { updateEventAsync, updateEvent, isPending, error, data };
}

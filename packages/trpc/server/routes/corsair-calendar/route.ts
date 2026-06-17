import { z } from "../../schema";
import { corsairCalendarService } from "../../services";
import { authenticatedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

import * as Models from "./model";

const TAGS = ["Corsair Calendar"];
const getPath = generatePath("/corsair-calendar");

export const corsairCalendarRouter = router({
    connectCalendar: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/connectCalendar"), tags: TAGS }
    }).input(Models.connectCalendarInputType)
    .output(Models.connectCalendarOutputType)
    .mutation(async ({ ctx }) => {
        const id = ctx.user.id;
        const { url } = await corsairCalendarService.connectCalendar(id);
        return { url };
    }),

    calendarCallback: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/calendarCallback"), tags: TAGS }
    }).input(Models.calendarCallbackInputType)
    .output(Models.calendarCallbackOutputType)
    .mutation(async ({ input }) => {
        const { code, state } = input;
        await corsairCalendarService.calendarCallback(code, state);
        return { url: "/dashboard" };
    }),
    getAvailability: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/getAvailability"), tags: TAGS }
    }).input(Models.getAvailabilityInputType).output(Models.getAvailabilityOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairCalendarService.getAvailability(ctx.user.id, input);
    }),

    createEvent: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/createEvent"), tags: TAGS }
    }).input(Models.createEventInputType).output(Models.createEventOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairCalendarService.createEvent(ctx.user.id, input);
    }),

    deleteEvent: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/deleteEvent"), tags: TAGS }
    }).input(Models.deleteEventInputType).output(Models.deleteEventOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairCalendarService.deleteEvent(ctx.user.id, input);
    }),

    getEvent: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/getEvent"), tags: TAGS }
    }).input(Models.getEventInputType).output(Models.getEventOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairCalendarService.getEvent(ctx.user.id, input);
    }),

    getManyEvents: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/getManyEvents"), tags: TAGS }
    }).input(Models.getManyEventsInputType).output(Models.getManyEventsOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairCalendarService.getManyEvents(ctx.user.id, input);
    }),

    updateEvent: authenticatedProcedure.meta({
        openapi: { method: "POST", path: getPath("/updateEvent"), tags: TAGS }
    }).input(Models.updateEventInputType).output(Models.updateEventOutputType)
    .mutation(async ({ ctx, input }) => {
        return corsairCalendarService.updateEvent(ctx.user.id, input);
    }),
});

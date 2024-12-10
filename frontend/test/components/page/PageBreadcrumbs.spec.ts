// import render from '~/test/render';
// import { screen } from '@testing-library/vue';
// import PageBreadcrumbs from '~/components/page/PageBreadcrumbs.vue';
// import { useOrganizationStore } from '~/stores/organization';
// import { useGroupStore } from '~/stores/group';
// import { useEventStore } from '~/stores/event';

import app from "~/app.vue";
import render from "@/test/render";
import { fireEvent, screen, waitFor } from "@testing-library/vue";
import { registerEndpoint } from "@nuxt/test-utils/runtime";
import { createError } from "h3";

import PageBreadcrumbs from '~/components/page/PageBreadcrumbs.vue'

// afterEach(() => {
//   localStorage.removeItem("accessToken");
//   vi.resetAllMocks();
// });

const eventsMock = vi.fn();
registerEndpoint("http://localhost:8000/v1/events/events/18f80f0d-7f73-4158-bf88-495ca0117883/", {
  method: "POST",
  handler: eventsMock,
});


describe.skip("pageBreadcrumbs", () => {
  it("should show the correct route for events", async () => {
    eventsMock.mockImplementation(() => ({
        "id": "d960d077-1dec-4882-a5d3-ef48eb9bf8e8",
        "createdBy": "8f846387-c3ea-4c42-9e8c-d592a8b00c8f",
        "name": "Climate Event o0:e0",
        "tagline": "area",
        "iconUrl": null,
        "type": "learn",
        "onlineLocationLink": "https://robinson.biz/",
        "offlineLocationId": "332dd550-3234-4809-9434-6c598dc01b21",
        "isPrivate": true,
        "startTime": "2024-12-09T19:39:49.379161Z",
        "endTime": "2024-12-10T19:39:49.379178Z",
        "eventText": null
    }));
    window.location.assign("http://localhost:3000/events/d960d077-1dec-4882-a5d3-ef48eb9bf8e8");
    await render(app, { route: '/events/d960d077-1dec-4882-a5d3-ef48eb9bf8e8'});
    const nav = screen.getByRole("nav", { name: "Pae breadcrumb navigation" });
    //screen.debug(nav);
  });
});

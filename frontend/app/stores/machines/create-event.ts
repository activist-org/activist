/*
 * createEvent.ts
 *
 * This is now the single source of truth for the entire "Create Event" flow.
 * Each node in the `nodes` array now defines its own UI via the `component` property.
 * Logic-only nodes simply omit the `component` property.
 */
import { createFlowStore } from './flowBaseModal';
import { CreateEventSteps } from '~/types/machines';

// Import the screen components directly. Lazy-loading is highly recommended for performance.
const EventDetailsStep = () => import('~/components/machine/steps/EventDetailsStep.vue');
const EventScheduleStep = () => import('~/components/machine/steps/EventScheduleStep.vue');
const EventLocationStep = () => import('~/components/machine/steps/EventLocationStep.vue');
const ReviewStep = () => import('~/components/machine/steps/ReviewStep.vue');

const nodes = [
  {
    id: CreateEventSteps.EventDetails,
    label: "Details",
    next: CreateEventSteps.EventSchedule,
    component: EventDetailsStep, // <-- UI is co-located with logic
  },
  {
    id: CreateEventSteps.EventSchedule,
    label: "Schedule",
    next: CreateEventSteps.EventLocation,
    prev: CreateEventSteps.EventDetails,
    component: EventScheduleStep, // <-- UI is co-located
  },
  {
    id: CreateEventSteps.EventLocation,
    label: "Location",
    next: CreateEventSteps.AskCreateMore,
    prev: CreateEventSteps.EventSchedule,
    component: EventLocationStep, // <-- UI is co-located
  },
  {
    id: CreateEventSteps.AskCreateMore,
    label: "Create more?",
    type: "logic",
    // This node has no `component` property, making it a logic-only step.
    next: (nodeData, allNodeData) => {
      const createAnother = allNodeData?.askCreateMore?.createAnother === true;
      return createAnother ? CreateEventSteps.EventDetails : CreateEventSteps.Review;
    },
    prev: CreateEventSteps.EventLocation,
  },
  {
    id: CreateEventSteps.Review,
    label: "Review",
    next: null,
    prev: CreateEventSteps.AskCreateMore,
    component: ReviewStep, // <-- UI is co-located
  },
];

const initialNodeData = { /* ... same as before ... */ };

export const useCreateEventStore = createFlowStore({
  storeId: "createEventFlow",
  defaultNodeId: CreateEventSteps.EventDetails,
  nodes,
  initialNodeData,
});

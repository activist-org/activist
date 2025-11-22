/* createEvent.ts
   Concrete CreateEvent flow store built with createFlowStore (flowBaseModal).
   - Per-node nodeData keys: eventDetails, eventSchedule, eventLocation, askCreateMore, review
   - askCreateMore.next loops back to eventDetails when createAnother is true.
   - Uses generic start/close/active API and the next(payload?) behavior to save current node data before transition.
*/
import { createFlowStore } from "./flow";

const nodes = [
  { id: CreateEventSteps.EventDetails, label: "Details", next: CreateEventSteps.AskCreateMore, prev: null },
  {
    id: CreateEventSteps.AskCreateMore,
    label: "Create more?",
    // dynamic next: loop back to eventDetails if createAnother true (reads the latest nodeData)
    next: (nodeData, allNodeData) => {
      const createAnother =
        // prefer explicit value on askCreateMore, fallback to eventDetails flag if needed
        (nodeData?.createAnother === true) ||
        (allNodeData?.eventDetails?.createAnother === true);
      return createAnother ? CreateEventSteps.EventDetails : CreateEventSteps.Review;
    }
  },
  { id: CreateEventSteps.Review, label: "Review", next: null, prev: CreateEventSteps.EventDetails },
];

const initialNodeData = {
  eventDetails: {}, // title, description, etc.
  eventSchedule: {}, // startDate, endDate, timezone, etc.
  eventLocation: {}, // location fields
  askCreateMore: { createAnother: false }, // checkbox value
  review: {},
};

export const useCreateEventStore = createFlowStore({
  storeId: "createEventFlow",
  defaultNodeId: "eventDetails",
  nodes,
  initialNodeData,
  // keep default discardOnClose = true so context resets when flow is closed
});

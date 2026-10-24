// SPDX-License-Identifier: AGPL-3.0-or-later

const resourceEventBaseUrl = `${eventBaseUrl}/event_resources`;

// MARK: Create

export async function createEventResource(
  eventId: string,
  input: ResourceInput
): Promise<void> {
  try {
    await post(
      resourceEventBaseUrl,
      { ...input, event: eventId },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Update

export async function updateEventResource(
  eventId: string,
  input: ResourceInput
): Promise<void> {
  try {
    await put(
      `${resourceEventBaseUrl}/${input.id}`,
      { ...input, event: eventId },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Delete

export async function deleteEventResource(resourceId: string): Promise<void> {
  try {
    await del(`${resourceEventBaseUrl}/${resourceId}`);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Reorder

export async function reorderEventResources(
  eventId: string,
  resources: Resource[]
): Promise<void> {
  try {
    await Promise.all(
      resources.map((resource) =>
        put(
          `${resourceEventBaseUrl}/${resource.id}`,
          {
            id: resource.id,
            order: resource.order,
            event: eventId,
          },
          { headers: { "Content-Type": "application/json" } }
        )
      )
    );
  } catch (e) {
    throw errorHandler(e);
  }
}

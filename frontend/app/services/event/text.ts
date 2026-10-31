// SPDX-License-Identifier: AGPL-3.0-or-later

// MARK: Update

export async function updateEventTexts(
  eventId: string,
  textId: string,
  data: EventUpdateTextFormData
): Promise<CommunityEvent> {
  try {
    return await put(
      `${textEventBaseUrl}/${textId}`,
      {
        primary: true,
        description: data.description,
        getInvolved: data.getInvolved,
        getInvolvedUrl: data.getInvolvedUrl,
        donate_prompt: "",
        event: eventId,
        iso: "en",
      } as AcceptedBody,
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

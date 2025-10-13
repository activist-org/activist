// SPDX-License-Identifier: AGPL-3.0-or-later
// Groups service: plain exported functions (no composables, no state).
// Uses services/http.ts helpers and centralizes error handling + normalization.

import type {
  Group as GroupT,
  GroupResponse,
  GroupsResponseBody,
  GroupUpdateTextFormData,
} from "~/types/communities/group";
import type { FaqEntry } from "~/types/content/faq-entry";
import type { ContentImage, UploadableFile } from "~/types/content/file";
import type { Resource, ResourceInput } from "~/types/content/resource";
import type { SocialLinkFormData } from "~/types/content/social-link";

import { get, post, put, del, type AcceptedBody } from "~/services/http";
import { defaultGroupText } from "~/types/communities/group";
import { errorHandler } from "~/utils/errorHandler";

// MARK: Map API response to frontend type

export function mapGroup(res: GroupResponse): GroupT {
  return {
    id: res.id,
    images: res.images ?? [],
    groupName: res.groupName,
    name: res.name,
    tagline: res.tagline,
    org: res.org,
    createdBy: res.createdBy,
    iconUrl: res.iconUrl,
    location: res.location,
    getInvolvedUrl: res.getInvolvedUrl,
    socialLinks: res.socialLinks,
    creationDate: res.creationDate,
    events: res.events ?? [],
    resources: res.resources ?? [],
    faqEntries: res.faqEntries ?? [],
    texts: res.texts?.[0] ?? defaultGroupText,
  };
}

// MARK: Get group by ID DONE

export async function getGroup(id: string): Promise<GroupT> {
  try {
    const res = await get<GroupResponse>(`/communities/groups/${id}`);
    return mapGroup(res);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: List all groups

export async function listGroups(): Promise<GroupT[]> {
  try {
    const res = await get<GroupsResponseBody>(`/communities/group`);
    return res.results.map(mapGroup);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Creates group - disabled until we allow user-created groups

// export async function createGroup(data: GroupCreateFormData): Promise<GroupT> {
//   try {
//     const payload = {
//       name: data.name,
//       location: data.location,
//       tagline: data.tagline,
//       social_accounts: data.social_accounts,
//       description: data.description,
//       topics: data.topics,
//       high_risk: false,
//       total_flags: 0,
//       acceptance_date: new Date()
//     }
//     const res = await post<GroupResponse, GroupCreateFormData>(`/communities/groups`, payload)
//     return mapGroup(res)
//   } catch (e) {
//     const err = errorHandler(e)
//     showToastError(err.message)
//     throw err
//   }
// }

// MARK: Update group texts DONE

export async function updateGroupTexts(
  groupId: string,
  textId: string,
  data: GroupUpdateTextFormData
): Promise<void> {
  try {
    await put(
      `/communities/group_texts/${textId}`,
      {
        primary: true,
        description: data.description,
        getInvolved: data.getInvolved,
        donate_prompt: "",
        orgId: groupId,
        iso: "en",
      } as AcceptedBody,
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Create resources DONE

export async function createGroupResource(
  groupId: string,
  input: ResourceInput
): Promise<void> {
  try {
    await post(
      `/communities/group_resources`,
      { ...input, group: groupId },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Update resources DONE

export async function updateGroupResource(input: ResourceInput): Promise<void> {
  try {
    await put(
      `/communities/group_resources/${input.id}`,
      { ...input },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Reorder resources DONE

export async function reorderGroupResources(
  resources: Resource[]
): Promise<void> {
  try {
    await Promise.all(
      resources.map((r) =>
        put(
          `/communities/group_resources/${r.id}`,
          {
            id: r.id,
            order: r.order,
          },
          { headers: { "Content-Type": "application/json" } }
        )
      )
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Create social links

export async function createGroupSocialLinks(
  groupId: string,
  links: SocialLinkFormData[]
): Promise<void> {
  try {
    await Promise.all(
      links.map((data) =>
        post(`/communities/group_social_links`, {
          link: data.link,
          label: data.label,
          order: data.order,
          group: groupId,
        })
      )
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Update social links

export async function updateGroupSocialLink(
  linkId: string,
  data: { link: string; label: string; order: number; group: string }
): Promise<void> {
  try {
    await put(`/communities/group_social_links/${linkId}`, data, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Delete social links

export async function deleteGroupSocialLink(linkId: string): Promise<void> {
  try {
    await del(`/communities/group_social_links/${linkId}`);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Replace all social links

// Deletes all links then recreates
export async function replaceAllGroupSocialLinks(
  groupId: string,
  links: { link: string; label: string; order: number }[]
): Promise<void> {
  try {
    // Backend expects a placeholder payload to bulk-delete
    await del(`/communities/group_social_links`, {
      // Ensure JSON content-type for bodies on DELETE if your backend needs it
      headers: { "Content-Type": "application/json" },
      body: {
        link: "https://www.example.com",
        label: "placeholder",
        group: groupId,
      },
    });
    await createGroupSocialLinks(groupId, links);
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Create FAQs DONE

export async function createGroupFaq(
  groupId: string,
  faq: FaqEntry
): Promise<void> {
  try {
    await post(`/communities/group_faqs`, {
      iso: faq.iso,
      order: faq.order,
      question: faq.question,
      answer: faq.answer,
      group: groupId,
    });
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Update FAQs DONE

export async function updateGroupFaq(faq: FaqEntry): Promise<void> {
  try {
    await put(
      `/communities/group_faqs/${faq.id}`,
      {
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
      },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Reorder FAQs DONE

export async function reorderGroupFaqs(faqs: FaqEntry[]): Promise<void> {
  try {
    await Promise.all(
      faqs.map(
        (f) =>
          put(`/communities/group_faqs/${f.id}`, { id: f.id, order: f.order }),
        { headers: { "Content-Type": "application/json" } }
      )
    );
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Upload images DONE

export async function uploadGroupImages(
  groupId: string,
  files: UploadableFile[],
  sequences: number[] = []
): Promise<ContentImage[]> {
  try {
    const fd = new FormData();
    fd.append("entity_id", groupId);
    fd.append("entity_type", "group"); // backend expects EntityType.GROUP; if you have enum, adjust
    for (const s of sequences) fd.append("sequences", String(s));
    for (const f of files) fd.append("file_object", f.file);

    const res = await post<ContentImage[], FormData>(`/content/images`, fd);
    return res;
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Update image DONE

export async function updateGroupImage(
  entityId: string,
  image: ContentImage
): Promise<void> {
  try {
    await put(`/communities/group/${entityId}/images/${image.id}`, image, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

// MARK: Fetch images DONE

export async function fetchGroupImages(
  entityId: string
): Promise<ContentImage[]> {
  try {
    const res = await get<ContentImage[]>(
      `/communities/group/${entityId}/images`
    );
    return res;
  } catch (e) {
    const err = errorHandler(e);
    throw err;
  }
}

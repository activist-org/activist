// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Upload limits shared between the Nuxt server's request size guard and the
 * image upload flows.
 *
 * The backend decides what a valid upload is: it rejects any image over
 * IMAGE_UPLOAD_MAX_FILE_SIZE (backend/core/settings.py) with a message naming
 * the limit. nuxt-security's requestSizeLimiter runs before that on the Nuxt
 * server and measures the whole multipart request rather than each file in it.
 * The ceiling has to stay above the largest batch the backend would accept.
 * Below that, uploads are cut off at the edge with a generic 413 "Payload Too
 * Large" and the backend's message never reaches the user.
 */

/** Mirrors IMAGE_UPLOAD_MAX_FILE_SIZE in backend/core/settings.py. */
export const MAX_IMAGE_SIZE_IN_BYTES = 5 * 1024 * 1024;

/** Images accepted per upload request; the uploadLimit the modals default to. */
export const MAX_IMAGES_PER_UPLOAD = 10;

/**
 * Multipart boundaries, per-part headers and the entity_id/entity_type/sequence
 * fields all count toward the request's Content-Length but toward no single
 * file's size, so the request ceiling allows for them.
 */
const MULTIPART_ENVELOPE_HEADROOM_IN_BYTES = 1024 * 1024;

/**
 * Ceiling for an image upload request as a whole, kept above every batch the
 * backend would accept so oversized files are rejected by the backend — with
 * its specific message — instead of by the edge guard.
 */
export const MAX_IMAGE_UPLOAD_REQUEST_SIZE_IN_BYTES =
  MAX_IMAGES_PER_UPLOAD * MAX_IMAGE_SIZE_IN_BYTES +
  MULTIPART_ENVELOPE_HEADROOM_IN_BYTES;

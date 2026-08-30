// SPDX-License-Identifier: AGPL-3.0-or-later
import { z } from "zod";

import { MAX_IMAGES_PER_UPLOAD } from "#shared/constants/uploadLimits";

export const validateUploadBodySchema = z.object({
  fileSizesInBytes: z
    .array(z.number().int().nonnegative())
    .min(1)
    .max(MAX_IMAGES_PER_UPLOAD),
});

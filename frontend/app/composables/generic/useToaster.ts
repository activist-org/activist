// SPDX-License-Identifier: AGPL-3.0-or-later
import { toast } from "vue-sonner";

export const useToaster = () => {
  const { announcePolite, announceAssertive } = useAppAnnouncer();

  const showToastError = (message: string) => {
    toast.error(message);
    announceAssertive(message);
  };
  const showToastInfo = (message: string) => {
    toast.info(message);
    announcePolite(message);
  };
  const showToastSuccess = (message: string) => {
    toast.success(message);
    announcePolite(message);
  };
  return {
    showToastError,
    showToastInfo,
    showToastSuccess,
  };
};

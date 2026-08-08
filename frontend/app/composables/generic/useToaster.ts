// SPDX-License-Identifier: AGPL-3.0-or-later
import { toast } from "vue-sonner";

export const useToaster = () => {
  const { announce } = useAnnouncer();

  const showToastError = (message: string) => {
    toast.error(message);
    announce(message, { priority: "assertive" });
  };
  const showToastInfo = (message: string) => {
    toast.info(message);
    announce(message, { priority: "polite" });
  };
  const showToastSuccess = (message: string) => {
    toast.success(message);
    announce(message, { priority: "polite" });
  };
  return {
    showToastError,
    showToastInfo,
    showToastSuccess,
  };
};

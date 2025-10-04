// SPDX-License-Identifier: AGPL-3.0-or-later
import { toast } from "vue-sonner";
export const useToaster = () => {
  const showToastError = (message: string) => {
    toast.error(message);
  };
  const showToastInfo = (message: string) => {
    toast.info(message);
  };
  const showToastSuccess = (message: string) => {
    toast.success(message);
  };
  return {
    showToastError,
    showToastInfo,
    showToastSuccess,
  };
};

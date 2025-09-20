// SPDX-License-Identifier: AGPL-3.0-or-later
import { toast } from "vue-sonner";
export const useToaster = ()=> {
    const showError = (message: string) => {
      console.log("Toaster Error:", message);
      toast.error(message);
    };
    const showInfo = (message: string) => {
      toast.info(message);
    };
    const showSuccess = (message: string) => {
      toast.success(message);
    };
    return {
      showError,
      showInfo,
      showSuccess
    };
};

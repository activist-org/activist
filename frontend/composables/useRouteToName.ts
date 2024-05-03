import { onBeforeRouteLeave } from "vue-router";

export default function useRouteToName(emit: any) {
  onBeforeRouteLeave((to) => {
    if (to.name) {
      const routeToName = to.name.toString().split("___")[0];
      console.log(`Hey routeToName: ${routeToName}`);
      emit("routeToName", routeToName);
    }
  });
}

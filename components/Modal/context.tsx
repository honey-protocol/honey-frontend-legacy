import { noop } from "lodash";
import { createContainer } from "unstated-next";

const useModalInner = (
  close: () => void = noop
): {
  close: () => void;
} => {
  if (!close) {
    throw new Error("no close provided");
  }
  return { close };
};

export const { useContainer: useModal, Provider: ModalProvider } =
  createContainer(useModalInner);

import Loading from "./Loading";
import { ExplorerButton } from "./ExplorerButton"

export const RenderUpdate = ({
  updateText,
  signature,
  load,
}: {
  updateText: string;
  signature?: string;
  load?: boolean;
}) => {
  if (signature) {
    return (
      <div className="flex flex-col">
        <span> Transaction confirmed 👌</span>
        <ExplorerButton tx={signature} />
      </div>
    );
  }
  return (
    <div className="flex flex-row items-center">
      <span className="mr-2">{updateText} </span> {load && <Loading />}
    </div>
  );
};

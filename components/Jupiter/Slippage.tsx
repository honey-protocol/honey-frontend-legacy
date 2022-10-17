import { useState } from "react";
import { ButtonModal } from "./ButtonModal";
import {ButtonBorderGradient} from "./ButtonBorderGradient"
import { AdjustmentsIcon, InformationCircleIcon } from "@heroicons/react/solid";
import clsx from "clsx";

const OPTIONS = [1, 5, 10];

export const Slippage = ({
  slippage,
  setSlippage,
}: {
  slippage: number;
  setSlippage: (arg: number) => void;
}) => {
  const [input, setInput] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  const custom = !OPTIONS.includes(input || -1);

  const canSubmit = !custom || (custom && input && input > 0 && input < 500);

  const handleSave = () => {
    input && setSlippage(input);
    setVisible(false);
  };

  return (
    <div className="flex flex-row justify-between">
      {OPTIONS.map((e) => {
        return (
          <ButtonBorderGradient
            key={`slippage-option-${e}`}
            onClick={() => setInput(e)}
            buttonClass="bg-neutral p-2 uppercase font-bold h-[40px] w-full"
            fromColor={input === e ? "green-400" : "none"}
            toColor="blue-500"
            containerClass="w-1/3 mx-2"
          >
            {e / 10}%
          </ButtonBorderGradient>
        );
      })}
      {
        custom ? 
        <div
          className={clsx(
            "relative",
            "bg-gradient-to-r from-green-400 to-blue-500",
            "p-[2px] rounded-[6px] h-[40px] w-1/3 mx-2"
          )}
        >
          <input
            onChange={(e) => setInput(10 * parseFloat(e.target.value.trim()))}
            placeholder="0.00 %"
            value={(input || 0) / 10}
            type="number"
            max={100}
            min={0}
            className="w-full h-full pr-10 text-lg font-bold text-right rounded-[5px] bg-neutral focus:outline-none"
          />
          <span className="absolute text-lg font-bold top-2 right-5">%</span>
        </div>
        :
        <ButtonBorderGradient
          key={`slippage-option-manual`}
          onClick={() => setInput(0)}
          buttonClass="bg-neutral p-2 h-[40px] w-full"
          fromColor={"none"}
          toColor="blue-500"
          containerClass="w-1/3 mx-2"
        >
          Manually
        </ButtonBorderGradient>
      }
    </div>
  );
};

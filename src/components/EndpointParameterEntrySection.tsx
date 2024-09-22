import { twJoin } from "tailwind-merge";
import { ENDPOINT_NAMES, Paths } from "../App";

import { useEffect, useState } from "react";
import { Slider } from "./Slider";
import { Button } from "./Button";
import backend from "../backendApi";
import { Input } from "./Input";
import { isAxiosError } from "axios";

const EndpointParameterEntrySection = ({
  method,
  path,
  title,
  className = "",
  setFetchedResponse,
}: Paths[string]["endpoints"][number] & {
  className?: string;
  setFetchedResponse: React.Dispatch<any>;
}) => {
  const [sliderState, setSliderState] = useState(1);
  const [textFieldState, setTextFieldState] = useState("");

  return (
    <div className={twJoin("flex flex-col items-center", className)}>
      <div className="w-2/3 h-full flex flex-col justify-between">
        {(() => {
          switch (title) {
            case ENDPOINT_NAMES.TROLLING_CUSTOMERS:
              return (
                <div>
                  <p>minimum average rating:</p>
                  <div className="flex flex-row gap-12">
                    <Slider
                      min={1}
                      max={5}
                      step={0.1}
                      onValueChange={(value) => {
                        setSliderState(value[0]);
                      }}
                      value={[sliderState]}
                    />
                    <div>{sliderState}</div>
                  </div>
                </div>
              );
            case ENDPOINT_NAMES.PRODUCT_OFFERS:
            case ENDPOINT_NAMES.BY_PRODUCT_NUMBER:
              return (
                <div>
                  <p>product number:</p>
                  <div className="flex flex-row gap-12">
                    <Input
                      className="text-neutral-800"
                      onChange={(e) => setTextFieldState(e.target.value)}
                      value={textFieldState}
                    ></Input>
                  </div>
                </div>
              );

            default:
              return <></>;
          }
        })()}
        <Button
          className="w-full"
          onClick={async () => {
            let response: { data: any; status: number } | undefined;
            switch (title) {
              case ENDPOINT_NAMES.TROLLING_CUSTOMERS:
                response = await backend.get(
                  path.replace("{minimumAverageRating}", sliderState.toString())
                );

                return;
              case ENDPOINT_NAMES.BY_PRODUCT_NUMBER:
              case ENDPOINT_NAMES.PRODUCT_OFFERS:
                response = await backend.get(
                  path.replace(
                    "{productNumber}",
                    encodeURIComponent(textFieldState)
                  )
                );
            }

            console.log(
              path.replace(
                "{productNumber}",
                encodeURIComponent(textFieldState)
              )
            );
            setFetchedResponse({
              data: response?.data ?? {},
              status: response?.status ?? 500,
            });
          }}
        >
          fetch data
        </Button>
      </div>
    </div>
  );
};

export default EndpointParameterEntrySection;

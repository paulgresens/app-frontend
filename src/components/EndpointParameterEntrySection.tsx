import { twJoin } from "tailwind-merge";
import { ENDPOINT_NAMES, paths, Paths } from "../App";

import { useEffect, useState } from "react";
import { Slider } from "./Slider";
import { Button } from "./Button";
import backend from "../backendApi";
import { Input } from "./Input";

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

  useEffect(() => {
    setSliderState(1);
    setTextFieldState("");
    setFetchedResponse(undefined);
  }, [path]);

  return (
    <div className={twJoin("flex flex-col items-center", className)}>
      <div className="w-2/3 h-full flex flex-col justify-between">
        {(() => {
          switch (title) {
            case ENDPOINT_NAMES.TROLLING_CUSTOMERS:
            case ENDPOINT_NAMES.TOP_PRODUCTS:
              return (
                <div>
                  <p>
                    {(() => {
                      if (title === ENDPOINT_NAMES.TROLLING_CUSTOMERS) {
                        return "minimum average rating: ";
                      }
                      return "limit: ";
                    })()}
                  </p>
                  <div className="flex flex-row gap-12">
                    <Slider
                      min={1}
                      max={
                        title === ENDPOINT_NAMES.TROLLING_CUSTOMERS ? 5 : 100
                      }
                      step={
                        title === ENDPOINT_NAMES.TROLLING_CUSTOMERS ? 0.1 : 1
                      }
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
            case ENDPOINT_NAMES.BY_PATTERN:
            case ENDPOINT_NAMES.BY_PATH:
            case ENDPOINT_NAMES.SIMILAR_CHEAPER_PRODUCTS:
              return (
                <div>
                  <p>
                    {(() => {
                      if (
                        [
                          ENDPOINT_NAMES.PRODUCT_OFFERS,
                          ENDPOINT_NAMES.BY_PRODUCT_NUMBER,
                          ENDPOINT_NAMES.SIMILAR_CHEAPER_PRODUCTS,
                        ].includes(title)
                      ) {
                        return "product number:";
                      }
                      if (title === ENDPOINT_NAMES.BY_PATTERN) {
                        return "pattern: ";
                      }
                      return 'path (enter with "/" as delimeter)';
                    })()}
                  </p>
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
          className={`w-full ${
            title === ENDPOINT_NAMES.CATEGORY_TREE ? "hidden" : ""
          }`}
          onClick={async () => {
            setFetchedResponse(undefined);
            let response: { data: any; status: number } | undefined;
            switch (title) {
              case ENDPOINT_NAMES.TROLLING_CUSTOMERS:
                response = await backend.get(
                  path.replace("{minimumAverageRating}", sliderState.toString())
                );

                break;
              case ENDPOINT_NAMES.BY_PRODUCT_NUMBER:
              case ENDPOINT_NAMES.PRODUCT_OFFERS:
              case ENDPOINT_NAMES.SIMILAR_CHEAPER_PRODUCTS:
                response = await backend.get(
                  path.replace(
                    "{productNumber}",
                    encodeURIComponent(textFieldState)
                  )
                );
                break;
              case ENDPOINT_NAMES.BY_PATTERN:
                response = await backend.get(path, {
                  params: !!textFieldState.length
                    ? { pattern: textFieldState }
                    : {},
                });
                break;
              case ENDPOINT_NAMES.BY_PATH:
                response = await backend.get(
                  path.replace("{path}", encodeURIComponent(textFieldState))
                );
                break;
              case ENDPOINT_NAMES.TOP_PRODUCTS:
                response = await backend.get(path, {
                  params: { limit: sliderState },
                });
                break;
            }

            console.log(response);
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

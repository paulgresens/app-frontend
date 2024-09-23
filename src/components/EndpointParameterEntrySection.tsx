import { twJoin } from "tailwind-merge";
import { ENDPOINT_NAMES, paths, Paths } from "../App";

import { useEffect, useState } from "react";
import { Slider } from "./Slider";
import { Button } from "./Button";
import backend from "../backendApi";
import { Input } from "./Input";
import { Textarea } from "./Textarea";

type reviewInsertParameters = {
  customerId: number;
  productNumber: string;
  branchOfficeId: number;
  productCondition: string;
  rating: number;
  description: string;
  summary: string;
};

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
                      onChange={(e) => setTextFieldState(e.target.value)}
                      value={textFieldState}
                    ></Input>
                  </div>
                </div>
              );
            case ENDPOINT_NAMES.REVIEW:
              return (
                <div>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const formObject = Object.fromEntries(formData);
                      let transformedFormData = formObject;

                      transformedFormData.customerId = Number(
                        formObject.customerId
                      );
                      transformedFormData.branchOfficeId = Number(
                        formObject.branchOfficeId
                      );
                      transformedFormData.rating = Number(formObject.rating);
                      console.log(JSON.stringify(transformedFormData));
                      const { data, status } = await backend.post(
                        path,
                        transformedFormData,
                        {
                          headers: {
                            "Content-Type": "application/json",
                          },
                        }
                      );
                      console.log("status", status);
                      console.log("data: ", data);
                      setFetchedResponse({ data: data ?? {}, status });
                    }}
                  >
                    <div className="grid grid-cols-2 gap-1 pb-1">
                      <>
                        <div className="flex flex-col">
                          customer id:
                          <Input
                            name="customerId"
                            id="customerId"
                            type="number"
                          />
                        </div>
                        <div className="flex flex-col">
                          branch office id:
                          <Input
                            name="branchOfficeId"
                            id="branchOfficeId"
                            type="number"
                          />
                        </div>
                        <div className="flex flex-col">
                          rating:
                          <Input name="rating" id="rating" type="number" />
                        </div>
                      </>
                      <>
                        <div className="flex flex-col">
                          product number:
                          <Input
                            name="productNumber"
                            id="productNumber"
                            type="text"
                          />
                        </div>
                        <div className="flex flex-col">
                          condition:
                          <Input
                            name="productCondition"
                            id="productCondition"
                            type="text"
                          />
                        </div>
                        <div className="flex flex-col">
                          summary:
                          <Input name="summary" id="summary" type="text" />
                        </div>
                      </>
                    </div>
                    <div className="flex flex-col">
                      description:
                      <Textarea name="description" id="description" />
                      <Button type="submit" className="mt-1">
                        add review
                      </Button>
                    </div>
                  </form>
                </div>
              );
            default:
              return <></>;
          }
        })()}
        <Button
          className={`w-full ${
            title === ENDPOINT_NAMES.REVIEW ? "hidden" : ""
          }`}
          disabled={
            !textFieldState.length &&
            [
              ENDPOINT_NAMES.BY_PRODUCT_NUMBER,
              ENDPOINT_NAMES.BY_PATH,
              ENDPOINT_NAMES.SIMILAR_CHEAPER_PRODUCTS,
              ENDPOINT_NAMES.PRODUCT_OFFERS,
            ].includes(title)
          }
          onClick={async () => {
            setFetchedResponse(undefined);
            let response: { data: any; status: number } | undefined;
            switch (title) {
              case ENDPOINT_NAMES.TROLLING_CUSTOMERS:
                response = await backend.get(
                  path.replace(
                    "{minimumAverageRating}",
                    (sliderState ?? 1).toString()
                  )
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
                  path.replace(
                    "{path}",
                    textFieldState
                      .split("/")
                      .map((value) => encodeURIComponent(value))
                      .join("/")
                  )
                );
                break;
              case ENDPOINT_NAMES.TOP_PRODUCTS:
                response = await backend.get(path, {
                  params: { limit: sliderState ?? 1 },
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

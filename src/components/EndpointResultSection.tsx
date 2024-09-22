import { ScrollArea } from "@radix-ui/react-scroll-area";
import { format } from "date-fns";
import { twJoin } from "tailwind-merge";
import { ENDPOINT_NAMES, Paths } from "../App";

const EndpointResultSection = ({
  method,
  path,
  title,
  className = "",
  fetchedResponse,
}: Paths[string]["endpoints"][number] & {
  className?: string;
  fetchedResponse: { data: any; status: number } | undefined;
}) => {
  return (
    <div className={twJoin("flex flex-col items-center h-full", className)}>
      <div className="w-2/3 h-full flex flex-col justify-around ">
        {(() => {
          console.log(fetchedResponse);
          if (!fetchedResponse) {
            return;
          }
          if (!fetchedResponse.data) {
            return "LOADING";
          }
          console.log(fetchedResponse.data);

          switch (title) {
            case ENDPOINT_NAMES.TROLLING_CUSTOMERS:
              return (
                <ScrollArea className="h-80 overflow-auto">
                  <div className="flex flex-col gap-1 ">
                    {fetchedResponse?.data.map((customer) => (
                      <div className="flex flex-col bg-neutral-800 rounded-sm p-1 mr-4">
                        <div>{`${customer.username} (${customer.customerId})`}</div>
                        <div>{`street: ${
                          !!customer.street ? customer.street : "unknown"
                        }, zip: ${
                          !!customer.zip ? customer.zip : "unknown"
                        }`}</div>
                        <div>{`bank account number: ${
                          !!customer.bankAccountNumber
                            ? customer.bankAccountNumber
                            : "unknown"
                        }`}</div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              );
            case ENDPOINT_NAMES.PRODUCT_OFFERS:
              return (
                <ScrollArea className="h-80 overflow-auto">
                  <div className="flex flex-col gap-1 ">
                    {fetchedResponse?.status === 404
                      ? "product not found"
                      : !fetchedResponse?.data.offers?.length
                      ? "no offers found"
                      : fetchedResponse?.data.offers.map((offer) => (
                          <div className="flex flex-col bg-neutral-800 rounded-sm p-1 mr-4">
                            <div>{`price: ${
                              !!offer.price ? offer.price : "unknown"
                            } (${
                              offer.curreny ? offer.curreny : "unknown currency"
                            })`}</div>
                            <div>{`store: ${
                              !!offer.store ? offer.store : "unknown"
                            }`}</div>
                            <div>{`condition: ${
                              !!offer.productCondition
                                ? offer.productCondition
                                : "unknown"
                            }`}</div>
                            <div>{`left to buy: ${
                              !!offer.count ? offer.count : "unknown"
                            }`}</div>
                          </div>
                        ))}
                  </div>
                </ScrollArea>
              );
            case ENDPOINT_NAMES.BY_PRODUCT_NUMBER:
              return (
                <ScrollArea className="h-80 overflow-auto">
                  <div className="flex flex-col gap-1 ">
                    {fetchedResponse?.status === 404
                      ? "product not found"
                      : (() => {
                          const product = fetchedResponse?.data.product;
                          if (!product) {
                            return <></>;
                          }
                          return (
                            <div className="flex flex-col bg-neutral-800 rounded-sm p-1 mr-4">
                              <div>{`title: ${
                                !!product.title ? product.title : "unknown"
                              } ${
                                !!product.productType
                                  ? "(" + product.productType + ")"
                                  : ""
                              }`}</div>
                              <div>{`published at: ${
                                !!product.publishedDate
                                  ? format(product.publishedDate, "MM/dd/yyyy")
                                  : "unknown"
                              }`}</div>
                              <div>{`product number: ${
                                !!product.productNumber
                                  ? product.productNumber
                                  : "unknown"
                              }`}</div>
                              <div>{`labels: ${
                                !!product.labels?.length
                                  ? product.labels.join(", ")
                                  : "unknown"
                              }`}</div>

                              <div>{`salesrank: ${
                                !!product.salesrank
                                  ? product.salesrank
                                  : "unknown"
                              }`}</div>
                            </div>
                          );
                        })()}
                  </div>
                </ScrollArea>
              );
            case ENDPOINT_NAMES.BY_PATTERN:
            case ENDPOINT_NAMES.TOP_PRODUCTS:
              return (
                <ScrollArea className="h-80 overflow-auto">
                  <div className="flex flex-col gap-1 ">
                    {!fetchedResponse?.data.products?.length
                      ? "no products found"
                      : fetchedResponse?.data.products.map((product) => (
                          <div className="flex flex-col bg-neutral-800 rounded-sm p-1 mr-4">
                            <div>{`title: ${
                              !!product.title ? product.title : "unknown"
                            } `}</div>
                            <div>{`product number: ${
                              !!product.productNumber
                                ? product.productNumber
                                : "unknown"
                            } `}</div>
                            <div>{`sales rank: ${
                              !!product.salesrank
                                ? product.salesrank
                                : "unknown"
                            } `}</div>
                          </div>
                        ))}
                  </div>
                </ScrollArea>
              );
            case ENDPOINT_NAMES.SIMILAR_CHEAPER_PRODUCTS:
              return (
                <ScrollArea className="h-80 overflow-auto">
                  <div className="flex flex-col gap-1 ">
                    {fetchedResponse.status === 404
                      ? "product not found"
                      : !fetchedResponse?.data.productNumbers?.length
                      ? "no similar and cheaper products found"
                      : fetchedResponse?.data.productNumbers.map(
                          (productNumber) => (
                            <div className="flex flex-col bg-neutral-800 rounded-sm p-1 mr-4">
                              <div>{`product number: ${productNumber} `}</div>
                            </div>
                          )
                        )}
                  </div>
                </ScrollArea>
              );
            default:
              return <></>;
          }
        })()}
      </div>
    </div>
  );
};

export default EndpointResultSection;

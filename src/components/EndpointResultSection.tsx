import { ScrollArea } from "@radix-ui/react-scroll-area";
import { format } from "date-fns";
import { twJoin } from "tailwind-merge";
import { Category, ENDPOINT_NAMES, Paths } from "../App";
import CategoryShower from "./CategoryShower";

const renderCategoryTree = (
  categories: Category[],
  indent: string = ""
): string => {
  let result = "";

  categories.forEach((category) => {
    result += `${indent}${category.name}\n`;

    if (category.subcategories.length > 0) {
      result += renderCategoryTree(category.subcategories, indent + "  ");
    }
  });
  return result;
};

const EndpointResultSection = ({
  method,
  path,
  title,
  className = "",
  fetchedResponse,
  categoryTree,
}: Paths[string]["endpoints"][number] & {
  className?: string;
  fetchedResponse: { data: any; status: number } | undefined;
  categoryTree: undefined | Category[];
}) => {
  return (
    <div className={twJoin("flex flex-col items-center h-full", className)}>
      <div className="w-2/3 h-full flex flex-col justify-around ">
        {(() => {
          if (!fetchedResponse && title !== ENDPOINT_NAMES.CATEGORY_TREE) {
            return;
          }
          if (!(title === ENDPOINT_NAMES.REVIEW && fetchedResponse?.status)) {
            if (
              (!fetchedResponse?.data &&
                title !== ENDPOINT_NAMES.CATEGORY_TREE) ||
              (title === ENDPOINT_NAMES.CATEGORY_TREE && !categoryTree)
            ) {
              return "LOADING";
            }
          }
          switch (title) {
            case ENDPOINT_NAMES.TROLLING_CUSTOMERS:
              return (
                <ScrollArea className="h-80 overflow-auto">
                  <div className="flex flex-col gap-1 ">
                    {!fetchedResponse?.data.customers?.length
                      ? "no trolling customers found"
                      : fetchedResponse?.data.customers.map((customer) => (
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
            case ENDPOINT_NAMES.BY_PATH:
              return (
                <ScrollArea className="h-80 overflow-auto">
                  <div className="flex flex-col gap-1 ">
                    {!fetchedResponse?.data.products?.length
                      ? fetchedResponse?.status === 404 &&
                        title === ENDPOINT_NAMES.BY_PATH
                        ? "invalid path"
                        : "no products found"
                      : fetchedResponse?.data.products.map((product) => (
                          <div className="flex flex-row bg-neutral-800 rounded-sm p-1 mr-4">
                            <div className="flex flex-col">
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
                            {!!product.image && (
                              <div className="h-20 w-20">
                                <img src={product.image}></img>
                              </div>
                            )}
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
            case ENDPOINT_NAMES.CATEGORY_TREE:
              return (
                <ScrollArea className="h-80 overflow-auto">
                  {categoryTree?.map((category) => (
                    <CategoryShower
                      id={category.id}
                      name={category.name}
                      subcategories={category.subcategories}
                    />
                  ))}
                </ScrollArea>
              );
            case ENDPOINT_NAMES.REVIEW:
              return (
                <div>
                  {(() => {
                    switch (fetchedResponse?.status) {
                      case 201:
                        return "review added successfully";
                      case 409:
                        return "review does already exist";
                      case 400:
                        return "invalid input";
                      default:
                        return "could not insert review";
                    }
                  })()}
                </div>
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

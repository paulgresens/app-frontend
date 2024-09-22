import { useEffect, useState } from "react";
import EndpointParameterEntrySection from "./components/EndpointParameterEntrySection";
import EndpointResultSection from "./components/EndpointResultSection";
import backend from "./backendApi";

export type Paths = {
  [key: string]: {
    title: string;
    endpoints: { title: string; path: string; method: string }[];
  };
};
export enum ENDPOINT_NAMES {
  BY_PRODUCT_NUMBER = "by product number",
  BY_PATTERN = "by pattern",
  BY_PATH = "by path",
  TOP_PRODUCTS = "top products",
  SIMILAR_CHEAPER_PRODUCTS = "similar cheaper products",
  PRODUCT_OFFERS = "product offers",
  TROLLING_CUSTOMERS = "trolling customers",
  CATEGORY_TREE = "category tree",
  REVIEW = "add review",
}
export enum HTTPMethods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

export const paths: Paths = {
  product: {
    title: "Products",
    endpoints: [
      {
        title: ENDPOINT_NAMES.BY_PRODUCT_NUMBER,
        path: "/product/{productNumber}",
        method: HTTPMethods.GET, //fertig
      },
      {
        title: ENDPOINT_NAMES.BY_PATTERN,
        path: "/product",
        method: HTTPMethods.GET, //fertig
      },
      {
        title: ENDPOINT_NAMES.BY_PATH,
        path: "/product/path/{path}",
        method: HTTPMethods.GET, //fertig
      },
      {
        title: ENDPOINT_NAMES.TOP_PRODUCTS,
        path: "/product/top",
        method: HTTPMethods.GET, //fertig
      },
      {
        title: ENDPOINT_NAMES.SIMILAR_CHEAPER_PRODUCTS,
        path: "/{productNumber}/similarCheaper",
        method: HTTPMethods.GET, //fertig
      },
      {
        title: ENDPOINT_NAMES.PRODUCT_OFFERS,
        path: "/{productNumber}/offers",
        method: HTTPMethods.GET, //fertig
      },
    ],
  },
  category: {
    title: "Category",
    endpoints: [
      {
        title: ENDPOINT_NAMES.CATEGORY_TREE,
        path: "/categorytree",
        method: HTTPMethods.GET, //fertig
      },
    ],
  },
  reviews: {
    title: "Reviews",
    endpoints: [
      {
        title: ENDPOINT_NAMES.REVIEW,
        path: "/review",
        method: HTTPMethods.POST,
      },
    ],
  },
  trolls: {
    title: "General",
    endpoints: [
      {
        title: ENDPOINT_NAMES.TROLLING_CUSTOMERS,
        path: "/belowRating/{minimumAverageRating}",
        method: HTTPMethods.GET, //fertig
      },
    ],
  },
};

let componentTreeResult = null;

function App() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<
    null | Paths[string]["endpoints"][number]
  >(null);
  const [fetchedResponse, setFetchedResponse] = useState<
    { data: any; status: number } | undefined
  >(undefined);

  const [componentTree, setComponentTree] = useState();

  useEffect(
    () => console.log(JSON.stringify(fetchedResponse)),
    [fetchedResponse]
  );

  useEffect(() => {
    if (componentTreeResult) {
      setComponentTree(componentTreeResult);
      return;
    }
    const fetchComponentTree = async () => {
      const response = await backend.get(
        paths["category"].endpoints.find(
          (endpoint) => endpoint.title === ENDPOINT_NAMES.CATEGORY_TREE
        )?.path ?? ""
      );
      console.log(response.data);
      if (response.status === 200) {
        setComponentTree(response.data);
      }
    };
    fetchComponentTree();
  }, []);

  useEffect(() => console.log(componentTree), [componentTree]);

  return (
    <div className="container mx-auto pt-20">
      <div className=" bg-neutral-700 rounded-md grid grid-cols-3 p-4 gap-4">
        <div className="flex flex-row justify-between">
          <div className="gap-4 flex flex-col ">
            {Object.values(paths).map((endpointCategory) => (
              <div>
                <h4>{endpointCategory.title}</h4>
                <div className="pl-4">
                  {endpointCategory.endpoints.map((endpoint) => (
                    <div
                      className="cursor-pointer hover:text-neutral-400"
                      onClick={() => setSelectedEndpoint(endpoint)}
                    >
                      {endpoint.title}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="min-h-full min-w-[2px] rounded-md  bg-neutral-600" />
        </div>
        {selectedEndpoint && (
          <div className="col-span-2 grid grid-cols-2 gap-4 h-full py-4">
            <EndpointParameterEntrySection
              method={selectedEndpoint.method}
              path={selectedEndpoint.path}
              title={selectedEndpoint.title}
              setFetchedResponse={setFetchedResponse}
            />
            <EndpointResultSection
              method={selectedEndpoint.method}
              path={selectedEndpoint.path}
              title={selectedEndpoint.title}
              fetchedResponse={fetchedResponse}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

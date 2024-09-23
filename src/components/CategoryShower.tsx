import { useState } from "react";
import { Category } from "../App";

const CategoryShower = (category: Category) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <h4>
          <div
            className={`${
              category.subcategories.length ? "cursor-pointer" : ""
            }`}
            onClick={() => setIsOpen((isOpen) => !isOpen)}
          >{`${category.name} (id: ${category.id})`}</div>
        </h4>
      </div>
      <div className="pl-1 flex flex-row">
        {isOpen && (
          <div className="flex flex-col">
            {category.subcategories.map((subcategory) => (
              <div className="flex flex-row">
                <div>⤷</div>
                <CategoryShower
                  id={subcategory.id}
                  name={subcategory.name}
                  subcategories={subcategory.subcategories}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryShower;

import { Category } from "../App";

const CategoryShower = (category: Category) => {
  return (
    <div className="flex flex-col">
      <div>{`${category.name} (${category.id})`}</div>
      <div className="pl-1 flex flex-row">
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
      </div>
    </div>
  );
};

export default CategoryShower;

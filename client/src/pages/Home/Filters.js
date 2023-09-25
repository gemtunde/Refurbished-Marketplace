import React, { useEffect } from "react";

const Filters = ({
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  getData,
}) => {
  const categories = [
    { name: "Electronics", value: "electronics" },
    { name: "Home", value: "home" },
    { name: "Fashions", value: "fashion" },
    { name: "Sports", value: "sports" },
    { name: "Toys", value: "toys" },
  ];

  const ages = [
    { name: "0 - 10years Old", value: "0-20" },
    { name: "21 - 40years Old", value: "21-40" },
    { name: "41-60years Old", value: "41-60" },
    { name: "61-80years Old", value: "61-80" },
    { name: "81-100years Old", value: "11-100" },
  ];

  useEffect(() => {
    //  console.log("show filters", filters);
    getData();
  }, [filters]);
  return (
    <div className="w-[50%] mt-10 flex flex-col">
      <div className="flex justify-between">
        <h1 className="text-md text-primary font-semibold">Filters</h1>
        <i
          className="ri-close-line cursor-pointer"
          onClick={() => setShowFilters(false)}
        ></i>
      </div>

      <div className="flex flex-col gap-1 my-2">
        <h2>Categories</h2>
        {categories.map((category) => {
          return (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="category"
                className="max-width"
                checked={filters.category.includes(category.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFilters({
                      ...filters,
                      category: [...filters.category, category.value],
                    });
                  } else {
                    setFilters({
                      ...filters,
                      category: filters.category.filter(
                        (item) => item !== category.value
                      ),
                    });
                  }
                }}
              />
              <label htmlFor="category"> {category.name}</label>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-1 mt-3">
        <h2>Ages</h2>
        {ages.map((age) => {
          return (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="category"
                className="max-width"
                checked={filters.age.includes(age.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFilters({
                      ...filters,
                      age: [...filters.age, age.value],
                    });
                  } else {
                    setFilters({
                      ...filters,
                      age: filters.age.filter((item) => item !== age.value),
                    });
                  }
                }}
              />
              <label htmlFor="category"> {age.name}</label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Filters;

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useFetchData } from "../../hooks/useFetchData";

export const AddProduct = () => {
  const { categories, styles, brands, colors, sizes } = useFetchData();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      name: "",
      gender: "unisex",
      categoryId: "",
      styleId: "",
      brandId: "",
      price: 0,
      salePercentage: 0,
      description: "",
      colorsArr: [],
    },
  });

  const {
    fields: colorsArr,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "colorsArr",
  });

  const [currentColor, setCurrentColor] = useState("");
  const [currentSize, setCurrentSize] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [variants, setVariants] = useState([]);

  const addVariant = () => {
    console.log("addVariant")
    // Use react-hook-form validation
    if (!currentColor) {
      setError("currentColor", {
        type: "manual",
        message: "Color is required",
      });
    } else {
      clearErrors("currentColor");
    }

    if (!currentSize) {
      setError("currentSize", {
        type: "manual",
        message: "Size is required",
      });
    } else {
      clearErrors("currentSize");
    }

    if (currentQuantity <= 0) {
      setError("currentQuantity", {
        type: "manual",
        message: "Quantity must be greater than 0",
      });
    } else {
      clearErrors("currentQuantity");
    }

    if (currentPrice <= 0) {
      setError("currentPrice", {
        type: "manual",
        message: "Price must be greater than 0",
      });
    } else {
      clearErrors("currentPrice");
    }

    // Check if all fields are filled correctly
    if (
      !currentColor ||
      !currentSize ||
      currentQuantity <= 0 ||
      currentPrice <= 0
    ) {
      alert("Please fill all variant fields correctly.");
      return;
    }

    // Add the variant to the variants array
    setVariants((prev) => [
      ...prev,
      {
        color: currentColor,
        size: currentSize,
        price: currentPrice,
        quantity: currentQuantity,
      },
    ]);

    // Reset the current variant inputs
    setCurrentColor("");
    setCurrentSize("");
    setCurrentPrice(0);
    setCurrentQuantity(0);
  };

  const removeVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    try {
      // Extract general product details
      const generalDetails = {
        name: data.name,
        gender: data.gender,
        categoryId: data.categoryId,
        styleId: data.styleId,
        brandId: data.brandId,
        price: data.price,
        salePercentage: data.salePercentage,
        description: data.description,
      };

      // Prepare variants array
      const variantsArr = variants.map(({ color, size, price, quantity }) => ({
        color,
        size,
        price,
        quantity,
      }));

      // Send data to server
      console.log("generalDetails", generalDetails);
      console.log("variants", variantsArr);

      alert("Product added successfully!");
      reset(); // Reset form
      setVariants([]); // Clear variant list
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  return (
    <div className="p-6 bg-gray-100">
      
      <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Product Details */}
        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-lg font-medium mb-4">Product Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                {...register("name", { required: true })}
                className="mt-1 block w-full border rounded px-2 py-1"
              />
              {errors.name && (
                <span className="text-red-500 text-sm">Name is required</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Gender</label>
              <select
                {...register("gender")}
                className="mt-1 block w-full border rounded px-2 py-1">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
            {/* Category Dropdown */}
            <div>
              <label className="block text-sm font-medium">Category</label>
              <select
                {...register("categoryId", { required: true })}
                className="mt-1 block w-full border rounded px-2 py-1">
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <span className="text-red-500 text-sm">
                  Category is required
                </span>
              )}
            </div>
            {/* Style Dropdown */}
            <div>
              <label className="block text-sm font-medium">Style</label>
              <select
                {...register("styleId", { required: true })}
                className="mt-1 block w-full border rounded px-2 py-1">
                <option value="">Select Style</option>
                {styles.map((style) => (
                  <option key={style._id} value={style._id}>
                    {style.name}
                  </option>
                ))}
              </select>
              {errors.styleId && (
                <span className="text-red-500 text-sm">Style is required</span>
              )}
            </div>
            {/* Brand Dropdown */}
            <div>
              <label className="block text-sm font-medium">Brand</label>
              <select
                {...register("brandId", { required: true })}
                className="mt-1 block w-full border rounded px-2 py-1">
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              {errors.brandId && (
                <span className="text-red-500 text-sm">Brand is required</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Price</label>
              <input
                {...register("price", {
                  required: true,
                  valueAsNumber: true,
                  min: 1, // Changed min from 0 to 1 to ensure price is greater than 0
                })}
                type="number"
                className="mt-1 block w-full border rounded px-2 py-1"
              />
              {errors.price && (
                <span className="text-red-500 text-sm">
                  Price must be greater than 0
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">
                Sale Percentage
              </label>
              <input
                {...register("salePercentage", {
                  valueAsNumber: true,
                  min: 0,
                  max: 100,
                })}
                type="number"
                className="mt-1 block w-full border rounded px-2 py-1"
                placeholder="0"
              />
              {errors.salePercentage && (
                <span className="text-red-500 text-sm">
                  Sale percentage must be between 0 and 100
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                {...register("description", { required: true })}
                className="mt-1 block w-full border rounded px-2 py-1"
                rows="4"
              />
              {errors.description && (
                <span className="text-red-500 text-sm">
                  Description is required
                </span>
              )}
            </div>{" "}
          </div>
        </div>

        {/* Variants Section */}
        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-lg font-medium mb-4">Variants</h3>

          <div className="grid grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium">Color</label>
              <select
                value={currentColor}
                onChange={(e) => setCurrentColor(e.target.value)}
                className="mt-1 block w-full border rounded px-2 py-1">
                <option value="">Select Color</option>
                {colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
              {errors.currentColor && (
                <span className="text-red-500 text-sm">
                  {errors.currentColor.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Size</label>
              <select
                value={currentSize}
                onChange={(e) => setCurrentSize(e.target.value)}
                className="mt-1 block w-full border rounded px-2 py-1">
                <option value="">Select Size</option>
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              {errors.currentSize && (
                <span className="text-red-500 text-sm">
                  {errors.currentSize.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Price</label>
              <input
                type="number"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(Number(e.target.value))}
                className="mt-1 block w-full border rounded px-2 py-1"
              />
              {errors.currentPrice && (
                <span className="text-red-500 text-sm">
                  {errors.currentPrice.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Quantity</label>
              <input
                type="number"
                value={currentQuantity}
                onChange={(e) => setCurrentQuantity(Number(e.target.value))}
                className="mt-1 block w-full border rounded px-2 py-1"
              />
              {errors.currentQuantity && (
                <span className="text-red-500 text-sm">
                  {errors.currentQuantity.message}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={addVariant}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
            Add Variant
          </button>

          {/* Display Variants */}
          <ul className="mt-4 space-y-2">
            {variants.map((variant, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-100 p-2 rounded">
                <span>
                  {variant.color} - {variant.size} | Price: ${variant.price} |
                  Quantity: {variant.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="text-red-500">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          className="mt-6 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Submit Product
        </button>
      </form>
    </div>
  );
};

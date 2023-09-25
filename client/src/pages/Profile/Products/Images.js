import { Button, Upload, message } from "antd";
import React, { useState } from "react";
import { SetLoader } from "../../../redux/loadersSlice";
import { useDispatch } from "react-redux";
import { EditProduct, UploadProductImage } from "../../../apicalls/products";

const Images = ({ setShowProductForm, selectedProduct, getData }) => {
  const [images, setImages] = useState(selectedProduct.images);
  const [file, setFile] = useState([]);

  //state
  const dispatch = useDispatch();

  const upload = async () => {
    try {
      dispatch(SetLoader(true));

      //upload image to clodinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("productId", selectedProduct._id);
      const response = await UploadProductImage(formData);

      if (response.success) {
        message.success(response.message);
        setImages([...images, response.data]);
        getData();
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(SetLoader(false));
    }
  };

  //delete image
  const deleteImage = async (image) => {
    try {
      dispatch(SetLoader(true));
      const updatedImageArray = images.filter((img) => img !== image);
      const upDatedProduct = { ...selectedProduct, images: updatedImageArray };
      const response = await EditProduct(selectedProduct._id, upDatedProduct);
      if (response.success) {
        message.success(response.message);
        setImages(updatedImageArray);
        setFile(null);
        getData();
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(SetLoader(false));
    }
  };

  return (
    <div>
      {/* display images */}
      <div className="flex gap-3 my-3">
        {images.map((image) => {
          return (
            <div className="flex items-end gap-2 border border-solid border-gray-300 rounded p-5 ">
              <img className="w-20 h-20 object-cover" alt="" src={image} />
              <i
                className="ri-delete-bin-line cursor-pointer"
                onClick={() => deleteImage(image)}
              ></i>
            </div>
          );
        })}
      </div>
      <Upload
        listType="picture"
        beforeUpload={() => false}
        onChange={(info) => setFile(info.file)}
        // showUploadList={() => false}
        fileList={file ? [file] : []}
      >
        <Button type="default">Upload Images</Button>
      </Upload>
      <div className="flex justify-end gap-5 mt-5">
        <Button type="default" onClick={() => setShowProductForm(false)}>
          Cancel
        </Button>
        <Button type="primary" onClick={upload} disabled={!file}>
          Upload Image
        </Button>
      </div>
    </div>
  );
};

export default Images;

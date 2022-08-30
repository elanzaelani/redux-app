import { createSlice ,createAsyncThunk,createEntityAdapter} from '@reduxjs/toolkit';
import axios from "axios";

export const getProducts = createAsyncThunk("products/getProducts",async()=>{
  const response = await axios.get("http://localhost:5000/products");
  return response.data;
});

export const saveProducts = createAsyncThunk("products/saveProducts",async({title,price})=>{
  const response = await axios.post("http://localhost:5000/products",{
    title,
    price
  });
  return response.data;
});

export const updateProduct = createAsyncThunk("products/updateProduct",async({id,title,price})=>{
  const response = await axios.post(`http://localhost:5000/products/${id}`,{
    title,
    price
  });
  return response.data;
});

export const deleteProduct = createAsyncThunk("products/deleteProducts",async(id)=>{
   await axios.delete(`http://localhost:5000/products/${id}`);
  return id
});


const productEntity= createEntityAdapter({
  selectId:(product)=>product.id
});

const ProductSlice = createSlice({
  name: "product",
  initialState:productEntity.getInitialState(),
  extraReducers: {
    [getProducts.fulfilled]:(state,action)=>{
      productEntity.setAll(state,action.payload)
    },
    [saveProducts.fulfilled]:(state,action)=>{
      productEntity.addOne(state,action.payload)
    },
    [deleteProduct.fulfilled]:(state,action)=>{
      productEntity.removeOne(state,action.payload)
    },
    [updateProduct.fulfilled]:(state,action)=>{
      productEntity.updateOne(state,{id:action.payload.id,updates:action.payload})
    },
  }
});


export const productSelectors=productEntity.getSelectors(state=>state.product);
export default ProductSlice.reducer;
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyledShop } from '../styles/general/Shop.styled';
import { BagPlusFill, Search } from 'react-bootstrap-icons';
import { notifySuccess, notifyError } from '../../utils';
import { AuthContext } from '../../context/AuthContext';
import { BuyerContext } from '../../context/BuyerContext';
import { CartContext } from '../../context/CartContext';
import { ProductContext } from '../../context/ProductContext';
import { StyledShopSidebar } from '../styles/general/ShopSidebar.styled';
import imageNotAvailable from '../../assets/images/main/image-not-available.webp'

const Shop = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const authContext = useContext(AuthContext);
  const buyerContext = useContext(BuyerContext);
  const cartContext = useContext(CartContext);
  const productContext = useContext(ProductContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await productContext.getAllProduct()
        setProducts(response.data.allProducts)
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [])

  const handleAddCart = async (productId, productName) => {
    try {
      if (authContext.isAuthenticatedBuyer()) {
        const buyerId = await buyerContext.getBuyerId();
        const productData = {
          product_id: productId
        }
        const response = await cartContext.addToCart(buyerId, productData);
        if (response) {
          notifySuccess(`${productName} has been added to the cart.`)
        } else {
          notifyError(`No more stock for ${productName}!`, 'addToCartError')
        }
      } else {
        notifyError(`Please login to add products to your cart`, 'unauthorisedBuyer')  
      }
    } catch (e) {
      notifyError(`Please login to add products to your cart`, 'unauthorisedBuyer')
      console.log(e);
    }
    
  }

  const onSubmit = async (data) => {
    try {
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  }

  const onSubmit = async (data) => {
    try {
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <StyledShopSidebar>
        {/* <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor='search-term'><h1>Search</h1></label>
          <input type='text' id='search-term' name='search-term' 
          {...register('search-term')}/> 
          <button type='submit'><Search/></button>
        </form> */}        
      </StyledShopSidebar>
      <StyledShop>
        {
          products.map(product => (
            <article key={product.id}>
              <img src={product.image_url || imageNotAvailable} alt={product.name} />
              <section>
                <div>
                  <h1>{product.name}</h1>
                  <p>{product.category.name}</p>
                </div>
                <div>
                  <h2>${product.price}</h2>
                  <button onClick={
                    () => handleAddCart(product.id, product.name)
                  }><BagPlusFill />Add to Cart</button>
                </div>

              </section>
            </article>
          ))
        }
      </StyledShop>
    </>
    
  );
};

export default Shop;
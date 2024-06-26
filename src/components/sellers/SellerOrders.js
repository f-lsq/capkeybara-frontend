import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StyledSellerOrders } from '../styles/sellers/SellerTables.styled';
import { StyledSellerPopup } from '../styles/sellers/SellerPopup.styled';
import { FloppyFill, Pencil, XLg } from 'react-bootstrap-icons';
import sellerOrdersEmptyBackground from "../../assets/images/main/seller-orders-empty.webp"
import { convertDateTime, notifySuccess, notifyError } from '../../utils';
import { SellerContext } from '../../context/SellerContext';
import { OrderContext } from '../../context/OrderContext';

const SellerOrders = () => {
  const navigate = useNavigate();
  const sellerContext = useContext(SellerContext);
  const orderContext = useContext(OrderContext);
  const [isUpdating, setIsUpdating] = useState([false, ""]);
  const [newOrderStatus, setNewOrderStatus] = useState(null);
  const [orders, setOrders] = useState([]);
  const [sellerId, setSellerId] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sellerId = await sellerContext.getSellerId();
        const responseOrders = await orderContext.getSellerOrders(sellerId);
        setSellerId(sellerId);
        setOrders(responseOrders.data.allOrders)
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [newOrderStatus]);

  const handleUpdate = async (orderId, new_order_status) => {
    if (new_order_status) {
      const orderData = {
        order_status: new_order_status
      }
      const response = await orderContext.updateOrderStatus(orderId, orderData)
      if (response.status == 200) {
        notifySuccess(`Status for Order ID ${orderId} has been updated to '${new_order_status}'.`, 'updateOrderStatusSuccess')
        setNewOrderStatus(null)
        setIsUpdating([false, ""])
      } else {
        notifyError(`Status for Order ID ${orderId} was not updated.`, 'updateOrderStatusError')
        setNewOrderStatus(null)
        setIsUpdating([false, ""])
      }
    } else {
      setIsUpdating([false, ""])
    }
  }

  return (
    <StyledSellerOrders>
      {orders.length !== 0 ?
        <>
          <div className='seller-mobile-table-view'>
            <header>
              <h1>Order Items</h1>
            </header>          
            {
              orders.map(order => (
                <article key={order.id} className='seller-order-article'>
                  <div className='seller-order-article-top'>
                    <section>
                      <div>
                        <p>Deliver to:</p>
                        <p>{order.shipping_address}</p>
                      </div>
                      <div>
                        {
                          isUpdating[0] && isUpdating[1] === order.id ?
                            <>
                              <label htmlFor={`order_status_${order.id}`} hidden>Order Status:</label>
                              <select name="order_status" value={newOrderStatus || order.order_status}
                                onChange={(e) => { setNewOrderStatus(e.target.value) }}>
                                <option value="Payment Made">Payment Made</option>
                                <option value="Ready to Ship">Ready to Ship</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </>
                            :
                            <p className={order.order_status.split(' ')[0]}>{order.order_status}</p>
                        }
                      </div>
                    </section>
                    <section>
                      <div>
                        <p className='seller-order-id'>CP{order.id}</p>
                        <p>{convertDateTime(order.date_created)}</p>
                      </div>
                      <div>
                        {
                          isUpdating[0] && isUpdating[1] === order.id ?
                            <>
                              <button className='seller-edit-btn' onClick={() => handleUpdate(order.id, newOrderStatus)}><FloppyFill /></button>
                              <button className='seller-delete-btn' onClick={() => setIsUpdating([false, ""])}><XLg /></button>
                            </> :
                            <button className='seller-action-btn' onClick={() => setIsUpdating([true, order.id])}><Pencil /></button>
                        }
                      </div>
                    </section>
                  </div>
                  {
                    order.order_items
                      .filter(order_item => order_item.product.seller_id === sellerId)
                      .map(order_item => (
                        <section className='seller-order-article-section' key={order.id + '-' + order_item.product.id}>
                          <img src={order_item.product.image_url} alt={order_item.product.name} />
                          <div>
                            <p>{order_item.product.name}</p>
                            <p>Subtotal: ${(order_item.quantity * order_item.product.price).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}</p>
                          </div>
                          <dl>
                            <dt>Qty Ordered</dt>
                            <dd>{order_item.quantity}</dd>
                          </dl>
                        </section>
                      ))
                  }
                </article>
              ))}
          </div>
          <div className='seller-standard-table-view'>
            <h1>Order Items</h1>
            <table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Products</th>
                  <th>Status</th>
                  <th>Quantity</th>
                  <th>Address</th>
                  <th>Date Ordered</th>
                  <th>Subtotal</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {
                  orders.map(order => (
                    order.order_items
                      .filter(order_item => order_item.product.seller_id === sellerId)
                      .map(order_item => (
                        <tr key={order.id + '-' + order_item.product.id}>
                          <td>{order.id}</td>
                          <td className='seller-product-name-col'>
                            <img className="seller-product-img" src={order_item.product.image_url} alt={order_item.product.name} />
                            <p>{order_item.product.name}</p>
                          </td>
                          <td className='seller-order-status-col'>
                            {
                              isUpdating[0] && isUpdating[1] === order.id ?
                                <>
                                  <label htmlFor={`order_status_${order.id}`} hidden>Order Status:</label>
                                  <select name="order_status" value={newOrderStatus || order.order_status}
                                    onChange={(e) => { setNewOrderStatus(e.target.value) }}>
                                    <option value="Payment Made">Payment Made</option>
                                    <option value="Ready to Ship">Ready to Ship</option>
                                    <option value="Out for Delivery">Out for Delivery</option>
                                    <option value="Delivered">Delivered</option>
                                  </select>
                                </>
                                :
                                <p className={order.order_status.split(' ')[0]}>{order.order_status}</p>
                            }
                          </td>
                          <td className='seller-right-align-col'>{order_item.quantity}</td>
                          <td>{order.shipping_address}</td>
                          <td>{convertDateTime(order.date_created)}</td>
                          <td className='seller-right-align-col'>{(order_item.quantity * order_item.product.price).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}</td>
                          <td className='seller-actions-col'>
                            {
                              isUpdating[0] && isUpdating[1] === order.id ?
                                <div>
                                  <button onClick={() => handleUpdate(order.id, newOrderStatus)}><FloppyFill /></button>
                                  <button onClick={() => setIsUpdating([false, ""])}><XLg /></button>
                                </div> :
                                <button onClick={() => setIsUpdating([true, order.id])}><Pencil /></button>
                            }
                          </td>
                        </tr>
                      ))
                  ))
                }
              </tbody>
            </table>
          </div>
        </> :
        <StyledSellerPopup>
          <h1>No Orders Found</h1>
          <p>Orders placed by buyers will appear here.</p>
          <img src={sellerOrdersEmptyBackground} alt="Capybara taking a bath in a bucket while playing with oranges" />
          <button onClick={() => navigate("/seller/product")}>See Products</button>
        </StyledSellerPopup>}
    </StyledSellerOrders>
  );
};

export default SellerOrders;
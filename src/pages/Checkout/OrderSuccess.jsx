import { useParams, Link } from "react-router-dom";

const OrderSuccess = () => {
  // Get the _id from the URL path parameters
  const { id } = useParams();

  return (
    <div className="min-h-[70vh] bg-gray-100 flex flex-col items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <video
            className="w-[50rem] h-64"
            src="https://cdnl.iconscout.com/lottie/premium/thumb/successful-money-dollar-sign-transaction-animated-icon-download-in-lottie-json-gif-static-svg-file-formats--payment-success-invoice-loading-pack-user-interface-icons-8157889.mp4"
            autoPlay
            loop
            muted></video>

          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Order Successful!
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Thank you for your purchase. Your order has been received and is
            being processed.
          </p>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="text-sm font-medium text-gray-600">
              Order Id:
              <span className="ml-2 text-gray-900">#{id}</span>
            </p>
          </div>

          <div className="mt-6">
            <Link
              to={`/profile/orders/${id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              View Order Details
            </Link>
          </div>

          <div className="mt-4">
            <Link
              to="/products"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

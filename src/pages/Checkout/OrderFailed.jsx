import { useParams, Link } from "react-router-dom";

// Component to display order failure message and details
const OrderFailed = () => {
  const { id } = useParams();

  return (
    <div className="min-h-[80vh] bg-gray-100 flex flex-col items-center justify-center text-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <video
          className="w-[50rem] h-64"
          src="https://cdnl.iconscout.com/lottie/premium/thumb/payment-decline-animated-icon-download-in-lottie-json-gif-static-svg-file-formats--failed-online-transaction-error-upi-pack-business-icons-8111745.mp4"
          autoPlay
          loop
          muted
          aria-label="Payment Failed Animation"
        ></video>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Order Failed
        </h2>
        <p className="text-gray-600 mb-6">
          We're sorry but there was an error during your payment.
        </p>
        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-sm font-medium text-gray-600">
            Order Id:
            <span className="ml-2 text-gray-900">#{id}</span>
          </p>
        </div>
        <div className="mt-6">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Order Details
          </button>
        </div>
        <div className="mt-4">
          <Link
            to="/products"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderFailed;
